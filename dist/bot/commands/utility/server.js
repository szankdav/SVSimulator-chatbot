var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { SlashCommandBuilder } from "discord.js";
import { logger } from "../../../winston/winston.js";
const data = new SlashCommandBuilder().setName("server").setDescription("Provides information about the server.");
async function execute(interaction) {
  await interaction.reply(`This server is ${interaction.guild?.name} and has ${interaction.guild?.memberCount} members.`);
  logger.info(`Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`);
}
__name(execute, "execute");
export {
  data,
  execute
};
