import { SlashCommandBuilder, MessageFlags, CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
    .setName('teszt')
    .setDescription('Teszt parancs.');

export async function execute(interaction: CommandInteraction) {
    await interaction.reply({ content: 'Sikeres teszt, minden rendben működik! :)', flags: MessageFlags.Ephemeral });
}