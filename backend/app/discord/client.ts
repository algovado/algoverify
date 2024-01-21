import { Client, GatewayIntentBits, REST, Routes, ActivityType } from "discord.js";

import { commands, selectMenus } from "./commands.js";
import { DISCORD_TOKEN } from "../constants.js";
export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages],
});

client.once("ready", async () => {
  console.log("Discord bot is ready!");

  client.user?.setActivity("algoverify.me", { type: ActivityType.Streaming });
  const rest = new REST().setToken(DISCORD_TOKEN);
  const botId = client.user?.id;
  if (!botId) {
    console.error("Bot ID not found!");
    return;
  }

  const register = Object.values(commands).map((command) => command.command.toJSON());
  await rest.put(Routes.applicationCommands(botId), {
    body: register,
  });
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    const command = commands[interaction.commandName];
    if (!command) return;

    try {
      await command.handler(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply("There was an error while executing this command!");
    }
  } else if (interaction.isAnySelectMenu()) {
    const selectMenu = selectMenus[interaction.customId];
    if (!selectMenu) return;

    try {
      await selectMenu.handler(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply("There was an error while executing select interaction!");
    }
  }
});
