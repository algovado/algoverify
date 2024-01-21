import {
  ActionRowBuilder,
  CacheType,
  Interaction,
  SelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} from "discord.js";
import prisma from "../../prisma/client.js";
import { BASE_URL } from "../constants.js";
import { getLeaderboard, getNFDWalletWithDiscordId, togglePrivacy, updateSingleUser } from "../utils.js";

export const handleVerifyCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  try {
    const user = await prisma.user.upsert({
      where: { id: interaction.user.id },
      create: { id: interaction.user.id },
      update: {},
    });
    const uuid = await prisma.uuid.create({
      data: { user: { connect: { id: user.id } } },
    });
    const wallets = await prisma.userWallet.count({
      where: { user: { id: user.id } },
    });
    if (wallets === 0) {
      await interaction.editReply({
        content: `You have no wallets registered in our system. Continue verification process by clicking here: ${BASE_URL}/verifyme/${uuid.uuid}.`,
      });
      return;
    }
    await updateSingleUser(user.id);
    await interaction.editReply({
      content: `You have ${wallets} wallets already registered in our system and we updated your roles! If you want to add a new wallet, continue verification process by clicking here: ${BASE_URL}/verifyme/${uuid.uuid}.`,
    });
  } catch (e) {
    console.log("ERROR on handleVerifyCommand:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
  return;
};

export const handleVerifyNfdCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  // create user if they don't exist
  try {
    const userId = interaction.user.id;
    const user = await prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
    const nfd = await getNFDWalletWithDiscordId(userId);
    if (!nfd) {
      await interaction.editReply({
        content: `You don't have a NFDomain or you didn't connect your Discord to your domain, please check again!`,
      });
      return;
    }

    const wallet = await prisma.userWallet.findUnique({
      where: { wallet: nfd },
      select: { userId: true, wallet: true },
    });

    if (wallet) {
      if (wallet?.userId === userId) {
        console.log(`User ${userId} already registered ${nfd} wallet!`);
        await interaction.editReply({
          content: `You have already registered ${nfd} wallet! You can check your wallets with \`/mywallets\` command or remove them with \`/remove\` command.`,
        });
      } else {
        console.log(`Wallet ${nfd} already registered by another user (${wallet.userId})!`);
        await interaction.editReply({
          content: `This wallet (${nfd}) has already been registered by another Discord user!`,
        });
      }
      return;
    }

    await prisma.userWallet.create({
      data: {
        wallet: nfd,
        user: { connect: { id: user.id } },
      },
    });
    const wallets = await prisma.userWallet.count({
      where: { user: { id: user.id } },
    });
    await interaction.editReply({
      content: `Your Discord paired with ${nfd}! You have ${wallets} wallets registered now!`,
    });
  } catch (e) {
    console.log("ERROR on handleVerifyNfdCommand:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
  return;
};

export const handleRemoveCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });

  try {
    const wallets = await prisma.userWallet.findMany({
      where: { user: { id: interaction.user.id } },
    });
    if (wallets.length === 0) {
      await interaction.editReply({
        content: `You have no wallets registered in our system.`,
      });
      return;
    }

    const options = wallets.map((wallet) => {
      return new StringSelectMenuOptionBuilder().setLabel(wallet.wallet).setValue(wallet.wallet);
    });
    // add a Cancel option
    options.push(new StringSelectMenuOptionBuilder().setLabel("Cancel").setValue("Cancel"));
    const select = new StringSelectMenuBuilder()
      .setCustomId("remove-wallet")
      .setPlaceholder("Select a wallet to remove!")
      .addOptions(options);

    const row = new ActionRowBuilder<SelectMenuBuilder>().addComponents(select);

    await interaction.editReply({
      content: "Select a wallet to remove!",
      components: [row],
    });
  } catch (e) {
    console.log("ERROR on handleRemoveCommand:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
};

export const handleRemoveSelect = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isStringSelectMenu()) return;
  await interaction.deferReply({ ephemeral: true });

  try {
    const value = interaction.values[0];
    if (value === "Cancel") {
      await interaction.editReply({ content: "Cancelled!" });
      return;
    }
    const wallet = await prisma.userWallet.findUnique({
      where: { wallet: value },
    });
    if (!wallet) {
      await interaction.editReply({ content: "Wallet not found!" });
      return;
    }
    if (wallet.userId !== interaction.user.id) {
      await interaction.editReply({
        content: "You are not the owner of this wallet!",
      });
      return;
    }
    await prisma.userWallet.delete({ where: { wallet: value } });
    await interaction.editReply({ content: "Wallet removed!" });
  } catch (e) {
    console.log("ERROR on handleRemoveSelect:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
};

export const handlePrivacyCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  try {
    const user = await prisma.user.upsert({
      where: { id: interaction.user.id },
      create: { id: interaction.user.id },
      update: {},
    });
    const privacy = await togglePrivacy(user.id);
    await interaction.editReply({
      content: `Your privacy setting is now ${
        privacy ? "private. Your information won't be exposed by API" : "public. Your information will be public on API"
      }. `,
    });
  } catch (e) {
    console.log("ERROR on handlePrivacyCommand:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
};

export const handleLeaderboardCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });

  try {
    if (!interaction.guildId) {
      await interaction.editReply({ content: "This command only works in a server!" });
      return;
    }
    const project = await prisma.project.findMany({
      where: {
        guildId: interaction.guildId,
      },
    });
    if (project.length === 0) {
      await interaction.editReply({ content: "No project found in this server!" });
      return;
    }
    const projectIds = project.map((p) => p.id);
    const leaderboards = projectIds.map(async (projectId) => {
      return getLeaderboard(projectId, 10);
    });
    const results = await Promise.all(leaderboards);
    const messageData: Record<string, string[]> = {};
    for (const result of results) {
      messageData[result.projectName] = result.leaderboard.map(
        (l) => `<@${l.userId}>: ${l.count} piece${l.count > 1 ? "s" : ""}`
      );
    }
    // send message with embed titled Leaderboard
    await interaction.editReply({
      embeds: [
        {
          title: "Leaderboard",
          fields: Object.entries(messageData).map(([name, value]) => {
            return {
              name,
              value: value.join("\n"),
            };
          }),
        },
      ],
    });
  } catch (e) {
    console.log("ERROR on handleLeaderboardCommand:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
};

export const handleHelpCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });
  await interaction.editReply({
    content: `**Commands**:
    \`/verify\` - Verify your wallet
    \`/verifynfd\` - Verify your NFDomain
    \`/remove\` - Remove a wallet
    \`/privacy\` - Toggle privacy setting
    \`/leaderboard\` - Show leaderboard
    \`/mywallets\` - Show your registered wallets
    \`/help\` - Show this message`,
  });
};

export const handleShowMyWalletsCommand = async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;
  await interaction.deferReply({ ephemeral: true });

  try {
    const wallets = await prisma.userWallet.findMany({
      select: { wallet: true },
      where: { user: { id: interaction.user.id } },
    });
    if (wallets.length === 0) {
      await interaction.editReply({
        content: `You have no wallets registered in our system. Please use \`/verify\` or \`/verifynfd\` to register your wallet!`,
      });
      return;
    }
    const list = wallets.map((wallet) => {
      return `[${wallet.wallet}](https://allo.info/account/${wallet.wallet})`;
    });
    await interaction.editReply({
      content: `**Your Wallets**\n${list.join("\n")}`,
    });
  } catch (e) {
    console.log("ERROR on handleShowMyWalletsCommand:", e);
    await interaction.editReply({
      content: `Something went wrong, please try again!`,
    });
  }
};
