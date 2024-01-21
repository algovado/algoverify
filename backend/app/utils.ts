import algosdk from "algosdk";
import axios, { AxiosError } from "axios";
import { Collection, DiscordAPIError, GuildMember } from "discord.js";
import { decode } from "uint8-to-base64";
import prisma from "../prisma/client.js";
import { ALGONODE_IDX_NODE_URL, ALGONODE_MAINNET_NODE_URL } from "./constants.js";
import { client } from "./discord/client.js";
import { tryAddRole, tryRemoveRole } from "./discord/utils.js";
import { AlgonodeResponse, FullProject, IndexerResponse } from "./types.js";

export async function getNFDWalletWithDiscordId(discordId: string): Promise<string> {
  const url = `https://api.nf.domains/nfd?vproperty=discord&vvalue=${discordId}`;
  try {
    const response = await axios.get(url);
    if (response.data.length > 0) {
      return response.data[0].depositAccount;
    }
  } catch (error) {}
  return "";
}

export const decodeTx = (tx: string) => {
  const bytes = decode(tx);
  const decodedTx = algosdk.decodeSignedTransaction(bytes);
  return decodedTx.txn;
};

export const generateAlgodClient = (): algosdk.Algodv2 => {
  return new algosdk.Algodv2("", ALGONODE_MAINNET_NODE_URL, "");
};

export const sendTx = async (tx: string) => {
  const algodClient = generateAlgodClient();
  const { txId } = await algodClient.sendRawTransaction(decode(tx)).do();
  return txId as string;
};

export async function getAssetsFromAddress(address: string, block: number): Promise<number[]> {
  try {
    let userAssets = await axios.get<IndexerResponse>(
      `${ALGONODE_IDX_NODE_URL}/accounts/${address}?round=${block}&include-all=false&exclude=created-assets,apps-local-state,created-apps`
    );
    if (!userAssets.data.account.assets || userAssets.data.account.assets.length === 0) {
      return [];
    }
    let assets = userAssets.data.account.assets.filter((asset) => asset.amount > 0);
    return assets.map((asset) => asset["asset-id"]);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log("Address:", address, error.response?.data);
    } else {
      console.log("Address:", address, error);
    }
    return [];
  }
}

export async function getLastRound(): Promise<number> {
  const url = ALGONODE_MAINNET_NODE_URL + "/v2/status";
  const response = await axios.get(url);
  const lastRound = response.data["last-round"];
  return lastRound;
}

export async function isValidAsset(assetId: number): Promise<boolean> {
  try {
    const url = ALGONODE_MAINNET_NODE_URL + "/v2/assets/" + assetId;
    const response = await axios.get(url);
    return response.status === 200;
  } catch (error) {
    console.log("Error: ", error, assetId);
    return false;
  }
}

export async function getCreatedAssets(address: string[], blacklist: number[]): Promise<number[]> {
  try {
    const assets = await Promise.all(
      address.map(async (address) => {
        const res = await axios.get<AlgonodeResponse>(ALGONODE_MAINNET_NODE_URL + "/v2/accounts/" + address);
        let project_created_asset = res.data["created-assets"].map((asset) => asset.index);
        project_created_asset = project_created_asset.filter((asset) => !blacklist.includes(asset));
        return project_created_asset;
      })
    );
    return assets.flat();
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function updateUserAssets(userId: string, block?: number): Promise<boolean> {
  if (!block) {
    block = await getLastRound();
  }
  const addresses = await prisma.userWallet.findMany({
    where: {
      user: {
        id: userId,
      },
    },
  });
  for (const address of addresses) {
    const assets = await getAssetsFromAddress(address.wallet, block);
    await prisma.userWallet.update({
      where: {
        id: address.id,
      },
      data: {
        assets: {
          set: assets,
        },
      },
    });
  }
  return true;
}

export async function updateProjectHolders(projectId: number, block?: number, updateUsers?: boolean): Promise<boolean> {
  if (!block) {
    block = await getLastRound();
  }
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
    include: {
      projectAssets: true,
      blacklistedAssets: true,
      creatorWallets: true,
    },
  });
  if (!project) {
    return false;
  }
  const blacklist = project.blacklistedAssets.map((asset) => Number(asset.assetId));
  const assets = await getCreatedAssets(
    project.creatorWallets.map((obj) => obj.wallet),
    blacklist
  );
  const server = await client.guilds.fetch(project.guildId);
  const members = await server.members.fetch();
  // This check is for projects that wants to give role only for holders that holds more than 1 asset

  const holders = members.filter((member) => {
    member.roles.cache.has(project.holderRoleId);
  });

  const memberIds = members
    .filter((member) => {
      // filter if user has no holderRole and no specialRole
      if (!member.roles.cache.has(project.holderRoleId)) {
        return true;
      }
      return false;
    })
    .map((member) => member.id);

  const memberUsers = await prisma.user.findMany({
    where: {
      id: {
        in: memberIds,
      },
    },
    include: {
      userWallets: true,
    },
  });

  const specialRoleId = project.specialRoleId;
  let specialHolders = new Collection<string, GuildMember>();
  if (specialRoleId) {
    specialHolders = members.filter((member) => {
      member.roles.cache.has(specialRoleId);
    });
  }
  // merge holders and special holders and remove duplicates
  const allHolders = new Collection<string, GuildMember>();
  allHolders.concat(holders);
  allHolders.concat(specialHolders);
  // remove duplicates
  const arr = allHolders.map((member) => member.id);
  const uniqueHolders = [...new Set(arr)];

  if (updateUsers) {
    let users = await prisma.user.findMany({
      where: {
        id: {
          in: uniqueHolders,
        },
      },
    });

    for (const user of users) {
      await updateUserAssets(user.id, block);
    }
  }

  let usersWithAssets = await prisma.user.findMany({
    where: {
      id: {
        in: uniqueHolders,
      },
    },
    include: {
      userWallets: true,
    },
  });

  // This section changes or removes roles for people who already have some role.
  for (const user of usersWithAssets) {
    const member = server.members.cache.get(user.id);
    if (!member) {
      continue;
    }
    const userAssets = [...new Set(user.userWallets.map((wallet) => wallet.assets).flat())];
    // now get intersection of userAssets and assets
    const intersection = userAssets.filter((asset) => assets.includes(Number(asset)));
    // if user is holder, add role
    if (intersection.length > 0) {
      await tryAddRole(member, project.holderRoleId);
      // if project has special role and user has more than special amount, add special role
      if (specialRoleId && project.specialAmount && intersection.length >= project.specialAmount) {
        await tryAddRole(member, specialRoleId);
      } else if (specialRoleId && project.specialAmount) {
        await tryRemoveRole(member, specialRoleId);
      }
    } else {
      // if user has no assets we need to remove both roles.
      await tryRemoveRole(member, project.holderRoleId);

      if (specialRoleId) {
        await tryRemoveRole(member, specialRoleId);
      }
    }

    // now check if user has special asset, if so add special role
    if (project.projectAssets.length > 0) {
      for (const projectAsset of project.projectAssets) {
        if (userAssets.includes(projectAsset.assetId)) {
          await tryAddRole(member, projectAsset.roleId);
        } else {
          await tryRemoveRole(member, projectAsset.roleId);
        }
      }
    }
  }

  // This section adds roles for people who don't have any role.

  for (const user of memberUsers.filter((user) => !usersWithAssets.includes(user))) {
    const member = server.members.cache.get(user.id);
    if (!member) {
      continue;
    }
    const userAssets = [...new Set(user.userWallets.map((wallet) => wallet.assets).flat())];
    const intersection = userAssets.filter((asset) => assets.includes(Number(asset)));
    // if user is holder, add role
    if (intersection.length > 0) {
      await tryAddRole(member, project.holderRoleId);
      uniqueHolders.push(user.id);
      // if project has special role and user has more than special amount, add special role
      if (specialRoleId && project.specialAmount && intersection.length >= project.specialAmount) {
        await tryAddRole(member, specialRoleId);
      }
    }

    // now check if user has special asset, if so add special role
    if (project.projectAssets.length > 0) {
      for (const projectAsset of project.projectAssets) {
        if (userAssets.includes(projectAsset.assetId)) {
          await tryAddRole(member, projectAsset.roleId);
        }
      }
    }
  }

  // update asset counts for leaderboard
  await updateSingleProjectAssetCounts(project);
  return true;
}

export const updateProjectsAssetCounts = async () => {
  const users = await prisma.user.findMany({
    include: {
      userWallets: true,
    },
  });
  const usersWithAssets: Record<string, number[]> = {};
  for (const user of users) {
    usersWithAssets[user.id] = [...new Set(user.userWallets.map((wallet) => wallet.assets).flat())];
  }

  const projects = await prisma.project.findMany({
    where: {
      status: true,
    },
    include: {
      creatorWallets: true,
      blacklistedAssets: true,
      projectAssets: true,
    },
  });
  for (const project of projects) {
    await updateSingleProjectAssetCounts(project, usersWithAssets);
  }
};

export const updateHolders = async () => {
  const block = await getLastRound();
  const projects = await prisma.project.findMany({
    where: {
      status: true,
    },
  });

  const users = await prisma.user.findMany();
  for (const user of users) {
    await updateUserAssets(user.id, block);
  }

  for (const project of projects) {
    await updateProjectHolders(project.id, block, false);
  }
};

export const updateSingleProjectAssetCounts = async (
  project: FullProject,
  usersWithAssets: Record<string, number[]> = {}
) => {
  if (Object.keys(usersWithAssets).length === 0) {
    const users = await prisma.user.findMany({
      include: {
        userWallets: true,
      },
    });
    for (const user of users) {
      usersWithAssets[user.id] = [...new Set(user.userWallets.map((wallet) => wallet.assets).flat())];
    }
  }

  const assets = await getCreatedAssets(
    project.creatorWallets.map((obj) => obj.wallet),
    project.blacklistedAssets.map((asset) => Number(asset.assetId))
  );
  // get intersection of assets and usersWithAssets
  const userList = Object.keys(usersWithAssets);
  const assetCounts: { userId: string; count: number; projectId: number }[] = [];
  for (const user of userList) {
    const intersection = usersWithAssets[user].filter((asset) => assets.includes(asset));
    assetCounts.push({
      userId: user,
      count: intersection.length,
      projectId: project.id,
    });
  }
  await prisma.$transaction([
    prisma.assetCounts.deleteMany({ where: { projectId: project.id } }),
    prisma.assetCounts.createMany({ data: assetCounts }),
  ]);
};

export const getLeaderboard = async (projectId: number, count: number = 20) => {
  if (count < 0) {
    count = 20;
  }
  const projectName = await prisma.project.findUniqueOrThrow({
    where: {
      id: projectId,
    },
    select: {
      name: true,
    },
  });

  const counts = await prisma.assetCounts.findMany({
    where: {
      projectId,
      count: {
        gt: 0,
      },
    },
    orderBy: {
      count: "desc",
    },
    select: {
      userId: true,
      count: true,
    },
    take: count,
  });

  return {
    projectName: projectName.name,
    leaderboard: counts,
  };
};

export const getLeaderboardWallets = async (projectId: number, count: number = 20) => {
  if (count < 0) {
    count = 20;
  }
  const projectName = await prisma.project.findUniqueOrThrow({
    where: {
      id: projectId,
    },
    select: {
      name: true,
    },
  });

  const counts = await prisma.assetCounts.findMany({
    where: {
      projectId,
      count: {
        gt: 0,
      },
    },
    orderBy: {
      count: "desc",
    },
    select: {
      user: {
        select: {
          userWallets: {
            select: {
              wallet: true,
            },
            take: 1,
            orderBy: {
              createdAt: "asc",
            },
          },
        },
      },
      count: true,
    },
    take: count,
  });

  return {
    projectName: projectName.name,
    leaderboard: counts,
  };
};

export const getUniqueHolderCount = async (projectId: number) => {
  const count = await prisma.assetCounts.aggregate({
    where: {
      projectId,
      count: {
        gt: 0,
      },
    },
    _count: true,
  });
  return count._count;
};

export const updateSingleUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) return false;
  const lastRound = await getLastRound();
  await updateUserAssets(userId, lastRound);

  const projects = await prisma.project.findMany({
    include: {
      projectAssets: true,
      blacklistedAssets: true,
      creatorWallets: true,
    },
    where: {
      status: true,
    },
  });

  for (const project of projects) {
    try {
      const projectId = project.id;
      const specialRoleId = project.specialRoleId;
      const blacklist = project.blacklistedAssets.map((asset) => Number(asset.assetId));
      const assets = await getCreatedAssets(
        project.creatorWallets.map((obj) => obj.wallet),
        blacklist
      );
      const server = await client.guilds.fetch(project.guildId);
      const member = await server.members.fetch(userId);
      if (!member) continue;
      console.log("single update: member found");
      const userWithAssets = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          userWallets: true,
        },
      });
      if (!userWithAssets) continue;

      try {
        const userAssets = [...new Set(userWithAssets.userWallets.map((wallet) => wallet.assets).flat())];
        // now get intersection of userAssets and assets
        const intersection = userAssets.filter((asset) => assets.includes(Number(asset)));

        if (intersection.length > 0) {
          await tryAddRole(member, project.holderRoleId);
          // if project has special role and user has more than special amount, add special role
          if (specialRoleId && project.specialAmount && intersection.length >= project.specialAmount) {
            await tryAddRole(member, specialRoleId);
          } else if (specialRoleId && project.specialAmount) {
            await tryRemoveRole(member, specialRoleId);
          }
        } else {
          // if user has no assets we need to remove both roles.
          await tryRemoveRole(member, project.holderRoleId);

          if (specialRoleId) {
            await tryRemoveRole(member, specialRoleId);
          }
        }

        if (project.projectAssets.length > 0) {
          for (const projectAsset of project.projectAssets) {
            if (userAssets.includes(projectAsset.assetId)) {
              await tryAddRole(member, projectAsset.roleId);
            } else {
              await tryRemoveRole(member, projectAsset.roleId);
            }
          }
        }
        console.log(`Updated user ${userId} for project ${projectId}`);
        await prisma.$transaction([
          prisma.assetCounts.deleteMany({ where: { projectId, userId } }),
          prisma.assetCounts.create({ data: { projectId, userId, count: intersection.length } }),
        ]);
        console.log(`Updated asset count for user ${userId} for project ${projectId}`);
      } catch (error) {
        if (error instanceof DiscordAPIError) {
          console.error(`Error updating user ${userId} for project ${projectId}: ${error.message}`);
        } else {
          console.error(`Error updating user ${userId} for project ${projectId}`);
          console.error(error);
        }
      }
    } catch (error) {
      if (error instanceof DiscordAPIError) {
        console.error(`Error updating user ${userId} for project ${project.id}: ${error.message}`);
      } else {
        console.error(`Error updating user ${userId} for project ${project.id}`);
        console.error(error);
      }
    }
  }
  return true;
};

export const verifyUserWithToken = async (tx: string) => {
  let decodedTx;
  try {
    decodedTx = decodeTx(tx);
  } catch (error) {
    console.log(error);
    return false;
  }
  const from = algosdk.encodeAddress(decodedTx.from.publicKey);
  const token = new TextDecoder().decode(decodedTx.note);
  if (!token) {
    return false;
  }
  const txId = await sendTx(tx);
  const discordRes = await axios.get("https://discordapp.com/api/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const discordUser = discordRes.data;
  const discordId = discordUser.id;
  const user = await prisma.user.upsert({
    where: {
      id: discordId,
    },
    create: {
      id: discordId,
    },
    update: {},
  });
  await prisma.userWallet.upsert({
    where: {
      wallet: from,
    },
    create: {
      wallet: from,
      user: {
        connect: {
          id: discordId,
        },
      },
    },
    update: {},
  });

  await updateSingleUser(user.id);
  return true;
};

export const getUserCount = async () => {
  return await prisma.user.count();
};

export const togglePrivacy = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) {
    return false;
  }
  const privacy = !user.private;
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      private: privacy,
    },
  });
  return privacy;
};
