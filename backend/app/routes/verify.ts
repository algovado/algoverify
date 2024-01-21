import { Prisma, type Project } from "@prisma/client";
import { TransactionType, algosToMicroalgos, encodeAddress, isValidAddress } from "algosdk";
import { Router } from "express";
import prisma from "../../prisma/client.js";
import { APPLY_FEE, APPLY_WALLET } from "../constants.js";
import {
  decodeTx,
  getLeaderboardWallets,
  getUniqueHolderCount,
  getUserCount,
  isValidAsset,
  sendTx,
  updateSingleUser,
  verifyUserWithToken,
} from "../utils.js";
import { limiter } from "../middlewares.js";

const verifyRouter = Router();

verifyRouter.post("/apply", async (req, res, next) => {
  try {
    let { tx, data, projectAssets, blacklistedAssets, creatorWallets } = req.body as {
      tx: string;
      data: Project;
      projectAssets: { assetId: number; roleId: string }[];
      blacklistedAssets: number[];
      creatorWallets: string[];
    };

    if (
      !data ||
      !tx ||
      !creatorWallets ||
      !data.name ||
      !data.creatorName ||
      !data.featuredAsset ||
      !data.verifyChannel ||
      !data.guildId ||
      !data.holderRoleId ||
      !data.inviteLink
    ) {
      res.status(400).send("Please fill out all required fields!");
      return;
    }

    // trim all strings
    data.name = data.name.trim();
    data.creatorName = data.creatorName.trim();
    data.verifyChannel = data.verifyChannel.trim();
    data.guildId = data.guildId.trim();
    data.holderRoleId = data.holderRoleId.trim();
    data.inviteLink = data.inviteLink.trim();

    // remove empty creator wallets and blacklisted assets
    creatorWallets = creatorWallets.filter((wallet) => wallet.length !== 0);

    blacklistedAssets = blacklistedAssets.filter((asset) => asset.toString().length !== 0);

    for (let i = 0; i < creatorWallets.length; i++) {
      const isValid = isValidAddress(creatorWallets[i]);
      if (!isValid) {
        res.status(400).send(`Invalid creator wallet ${creatorWallets[i]}!`);
        return;
      }
    }

    for (let i = 0; i < blacklistedAssets.length; i++) {
      const isValid = await isValidAsset(blacklistedAssets[i]);
      if (!isValid) {
        res.status(400).send(`Invalid blacklisted asset ${blacklistedAssets[i]}!`);
        return;
      }
    }

    for (let i = 0; i < projectAssets.length; i++) {
      const isValid = await isValidAsset(projectAssets[i].assetId);
      if (!isValid) {
        res.status(400).send(`Invalid special asset ${projectAssets[i].assetId}!`);
        return;
      }
    }

    const isValidFeaturedAsset = await isValidAsset(data.featuredAsset);
    if (!isValidFeaturedAsset) {
      res.status(400).send(`Invalid featured asset ${data.featuredAsset}!`);
      return;
    }

    let decodedTx;
    try {
      decodedTx = decodeTx(tx);
    } catch (e) {
      res.status(400).send("Invalid transaction");
      return;
    }

    const from = encodeAddress(decodedTx.from.publicKey);
    const receiver = encodeAddress(decodedTx.to.publicKey);
    if (
      decodedTx.type != TransactionType.pay ||
      decodedTx.amount != algosToMicroalgos(APPLY_FEE) ||
      receiver != APPLY_WALLET
    ) {
      res.status(400).send("Invalid transaction");
      return;
    }

    // if (!creatorWallets.includes(from)) {
    //   res.status(400).send("Please apply with one of the creator wallets");
    //   return;
    // }

    const project = data;

    const application = await prisma.application.create({
      data: {
        project: {
          create: {
            ...project,
            status: false,
            creatorWallets: {
              createMany: {
                data: creatorWallets.map((wallet) => ({
                  wallet,
                })),
              },
            },
            projectAssets: {
              createMany: {
                data: projectAssets.map((asset) => ({
                  assetId: asset.assetId,
                  roleId: asset.roleId,
                })),
              },
            },
            blacklistedAssets: {
              createMany: {
                data: blacklistedAssets.map((assetId) => ({
                  assetId,
                })),
              },
            },
          },
        },
        wallet: from,
        transactionId: decodedTx.txID(),
      },
    });
    try {
      const txId = await sendTx(tx);
    } catch (e) {
      await prisma.project.delete({
        where: {
          id: application.projectId,
        },
      });
      throw e;
    }

    res.json(application.transactionId);
  } catch (e) {
    next(e);
  }
});

verifyRouter.post("/verifyUuid/:uuid", async (req, res, next) => {
  try {
    const { tx } = req.body as { tx: string };
    if (!tx) {
      res.status(400).send("Please fill out all required fields!");
      return;
    }

    let decodedTx;
    try {
      decodedTx = decodeTx(tx);
    } catch (e) {
      res.status(400).send("Invalid transaction");
      return;
    }

    const from = encodeAddress(decodedTx.from.publicKey);

    const uuid = req.params.uuid;
    const txId = await sendTx(tx);
    const uuidData = await prisma.uuid.findUnique({
      where: {
        uuid,
      },
      include: {
        user: true,
      },
    });
    if (!uuidData) {
      res.status(400).json("Invalid uuid");
      return;
    }

    const user = uuidData.user;
    try {
      await prisma.$transaction([
        prisma.userWallet.create({
          data: {
            wallet: from,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        }),
        prisma.uuid.delete({
          where: {
            uuid,
          },
        }),
      ]);
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        res.status(400).send("Wallet already exists");
        return;
      } else {
        throw e;
      }
    }

    await updateSingleUser(user.id);
    res.json(txId);
  } catch (e) {
    next(e);
  }
});

verifyRouter.post("/verify", async (req, res, next) => {
  try {
    const resp = await verifyUserWithToken(req.body.tx);
    res.json(resp);
  } catch (e) {
    next(e);
  }
});

// API
verifyRouter.get("/projects", limiter, async (req, res, next) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        status: true,
      },
      select: {
        id: true,
        name: true,
        creatorName: true,
        featuredAsset: true,
      },
    });
    res.json(projects);
  } catch (e) {
    next(e);
  }
});

verifyRouter.get("/project/:id", limiter, async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id || isNaN(Number(id))) {
      res.status(400).send("Invalid id");
      return;
    }
    const project = await prisma.project.findUnique({
      where: {
        id: parseInt(id),
      },
      include: {
        projectAssets: {
          select: {
            assetId: true,
            roleId: true,
          },
        },
        creatorWallets: {
          select: {
            wallet: true,
          },
        },
      },
    });
    if (!project) {
      res.status(404).send("Not found");
      return;
    }
    const leaderboard = await getLeaderboardWallets(project.id, 100);
    const uniqueHolders = await getUniqueHolderCount(project.id);
    const ret = {
      project,
      leaderboard: leaderboard.leaderboard,
      uniqueHolders,
    };

    res.json(ret);
  } catch (e) {
    next(e);
  }
});

verifyRouter.get("/userCount", limiter, async (req, res, next) => {
  try {
    const count = await getUserCount();
    res.json(count);
  } catch (e) {
    next(e);
  }
});

verifyRouter.get("/discordId/:id", limiter, async (req, res, next) => {
  try {
    const discordId = req.params.id;
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        userWallets: {
          select: {
            wallet: true,
          },
        },
      },
      where: {
        id: discordId,
        private: false,
      },
    });
    if (!user) {
      res.status(404).send("Not found");
      return;
    }
    res.json(user);
  } catch (e) {
    next(e);
  }
});

verifyRouter.get("/wallet/:wallet", limiter, async (req, res) => {
  // Get userId from wallet. if user is private, return 404
  const wallet = req.params.wallet;
  const user = await prisma.user.findFirst({
    select: {
      id: true,
    },
    where: {
      userWallets: {
        some: {
          wallet: wallet,
        },
      },
      private: false,
    },
  });
  if (!user) {
    res.status(404).send("Not found");
    return;
  }
  res.json(user);
});

verifyRouter.get("/users", limiter, async (req, res) => {
  const users = await prisma.user.findMany({
    where: {
      private: false,
    },
    select: {
      id: true,
      userWallets: {
        select: {
          wallet: true,
        },
      },
    },
  });
  res.json(users);
});

verifyRouter.get("/health", limiter, async (req, res) => {
  try {
    await prisma.$queryRawUnsafe("SELECT 1");
    res.json("ok");
  } catch (error) {
    console.error(error);
    res.status(500).json("Internal Server Error");
  }
});

export default verifyRouter;
