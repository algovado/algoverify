import { SlashCommandBuilder } from "discord.js";

import {
  handleVerifyCommand,
  handleVerifyNfdCommand,
  handleRemoveCommand,
  handleRemoveSelect,
  handlePrivacyCommand,
  handleLeaderboardCommand,
  handleHelpCommand,
  handleShowMyWalletsCommand,
} from "./handlers.js";
import { IButton, ICommand } from "./types.js";

export const commands: Record<string, ICommand> = {
  verify: {
    command: new SlashCommandBuilder().setName("verify").setDescription("Verify yourself!"),
    handler: handleVerifyCommand,
  },
  verifynfd: {
    command: new SlashCommandBuilder().setName("verifynfd").setDescription("Verify yourself with NFDomain!"),
    handler: handleVerifyNfdCommand,
  },
  remove: {
    command: new SlashCommandBuilder().setName("remove").setDescription("Remove your wallet from our system!"),
    handler: handleRemoveCommand,
  },
  privacy: {
    command: new SlashCommandBuilder().setName("privacy").setDescription("Toggle your privacy!"),
    handler: handlePrivacyCommand,
  },
  leaderboard: {
    command: new SlashCommandBuilder().setName("leaderboard").setDescription("Show leaderboard!"),
    handler: handleLeaderboardCommand,
  },
  mywallets: {
    command: new SlashCommandBuilder().setName("mywallets").setDescription("Show your wallets!"),
    handler: handleShowMyWalletsCommand,
  },
  help: {
    command: new SlashCommandBuilder().setName("help").setDescription("Show commands!"),
    handler: handleHelpCommand,
  },
};

export const selectMenus: Record<string, IButton> = {
  "remove-wallet": {
    handler: handleRemoveSelect,
  },
};
