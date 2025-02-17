import { CacheType, Collection, Interaction, MessageFlags } from "discord.js";
import { commands } from "../commands/utility/index.js";

const cooldowns = new Collection<string, Collection<string, number>>();

export function cooldownForInteraction(interaction: Interaction<CacheType>) {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;

  const command: string = interaction.commandName;

  if (!cooldowns.has(command)) {
    cooldowns.set(command, new Collection<string, number>());
  }

  const now = Date.now();
  const timestamps: Collection<string, number> = cooldowns.get(command)!;
  const defaultCooldownDuration = 5;
  const cooldownAmount = defaultCooldownDuration * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime =
      Math.round(timestamps.get(interaction.user.id)! / 1000) +
      cooldownAmount / 1000;

    if (now < expirationTime * 1000) {
      const remainingTime = Math.round(expirationTime - now / 1000);
      return interaction.reply({
        content: `Kérlek várj még ${remainingTime} másodpercet, mielőtt újra használnád a \`${command}\` parancsot.`,
        flags: MessageFlags.Ephemeral,
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  if (!command) {
    console.error(
      `No command matching ${interaction.commandName} was found.`
    );
    return;
  }

  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
}