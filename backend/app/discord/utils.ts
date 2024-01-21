import { DiscordAPIError, GuildMember } from "discord.js";

export const tryAddRole = async (member: GuildMember, role: string) => {
  try {
    if (member.roles.cache.has(role)) {
      return;
    }
    await member.roles.add(role);
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      console.log("Error adding role", e, "User:", member.id, "Role:", role);
      return;
    }
    console.log("Error adding role", e);
  }
};

export const tryRemoveRole = async (member: GuildMember, role: string) => {
  try {
    if (!member.roles.cache.has(role)) {
      return;
    }
    await member.roles.remove(role);
  } catch (e) {
    if (e instanceof DiscordAPIError) {
      console.log("Error removing role", e.message, "User:", member.id, "Role:", role);
      return;
    }
    console.log("Error removing role", e);
  }
};
