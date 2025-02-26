var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { SlashCommandBuilder, ChannelType, PermissionFlagsBits, MessageFlags } from "discord.js";
import { logger } from "../../../winston/winston.js";
const data = new SlashCommandBuilder().setName("echo").setDescription("Replies with your input!").addUserOption(
  (option) => option.setName("user").setDescription("The text that writed")
).addStringOption(
  (option) => option.setName("input").setDescription("The input to echo back").setMaxLength(2e3)
).addChannelOption(
  (option) => option.setName("channel").setDescription("The channel to echo into").addChannelTypes(ChannelType.GuildText)
).addBooleanOption(
  (option) => option.setName("embed").setDescription("Whether or not the echo should be embedded")
).setDefaultMemberPermissions(PermissionFlagsBits.Administrator);
async function execute(interaction) {
  const text = interaction.options.get("input")?.value ?? "Nem \xEDrt be semmit.";
  const embedded = interaction.options.get("embed") ?? false;
  const user = interaction.user;
  if (!embedded) {
    await interaction.reply(
      `A megadott sz\xF6veg: ${text}, aki be\xEDrta: ${user.username}`
    );
  } else {
    await interaction.reply({
      content: `A megadott sz\xF6veg: ${text}`,
      flags: MessageFlags.Ephemeral
    });
  }
  logger.info(`Interaction: ${interaction.commandName} used by user: ${interaction.user.globalName}`);
}
__name(execute, "execute");
export {
  data,
  execute
};
