import { CacheType, Interaction } from "discord.js";
import { SlashCommandBuilder } from "discord.js";

export interface ICommand {
  handler: (interaction: Interaction<CacheType>) => Promise<void>;
  command: Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubCommand">;
}

export interface IButton {
  handler: (interaction: Interaction<CacheType>) => Promise<void>;
}
