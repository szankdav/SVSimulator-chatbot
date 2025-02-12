var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { SlashCommandBuilder } from "discord.js";
const data = new SlashCommandBuilder().setName("user").setDescription("Provides information about the user.");
async function execute(interaction) {
  return interaction.reply(`This command was run by ${interaction.user}`);
}
__name(execute, "execute");
export {
  data,
  execute
};
