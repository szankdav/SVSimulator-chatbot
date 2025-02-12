var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { SlashCommandBuilder, MessageFlags } from "discord.js";
const data = new SlashCommandBuilder().setName("teszt").setDescription("Teszt parancs.");
async function execute(interaction) {
  await interaction.reply({ content: "Sikeres teszt, minden rendben m\u0171k\xF6dik! :)", flags: MessageFlags.Ephemeral });
}
__name(execute, "execute");
export {
  data,
  execute
};
