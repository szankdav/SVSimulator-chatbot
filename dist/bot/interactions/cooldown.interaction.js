var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
import { Collection, MessageFlags } from "discord.js";
import { commands } from "../commands/utility/index.js";
import { logger } from "../../winston/winston.js";
const cooldowns = new Collection();
function cooldownForInteraction(interaction) {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  const command = interaction.commandName;
  if (!cooldowns.has(command)) {
    cooldowns.set(command, new Collection());
  }
  const now = Date.now();
  const timestamps = cooldowns.get(command);
  const defaultCooldownDuration = 5;
  const cooldownAmount = defaultCooldownDuration * 1e3;
  if (timestamps.has(interaction.user.id)) {
    const expirationTime = Math.round(timestamps.get(interaction.user.id) / 1e3) + cooldownAmount / 1e3;
    if (now < expirationTime * 1e3) {
      const remainingTime = Math.round(expirationTime - now / 1e3);
      logger.info(`Interaction: ${interaction.commandName} was tried to get use within the expiration time by user: ${interaction.user.globalName}`);
      return interaction.reply({
        content: `K\xE9rlek v\xE1rj m\xE9g ${remainingTime} m\xE1sodpercet, miel\u0151tt \xFAjra haszn\xE1ln\xE1d a \`${command}\` parancsot.`,
        flags: MessageFlags.Ephemeral
      });
    }
  }
  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
  if (!command) {
    logger.error(
      `No command matching ${interaction.commandName} was found.`
    );
    return;
  }
  if (commands[commandName]) {
    commands[commandName].execute(interaction);
  }
}
__name(cooldownForInteraction, "cooldownForInteraction");
export {
  cooldownForInteraction
};
