import { SlashCommandBuilder, MessageFlags } from 'discord.js';
export const data = new SlashCommandBuilder()
    .setName('teszt')
    .setDescription('Teszt parancs.');
export async function execute(interaction) {
    await interaction.reply({ content: 'Sikeres teszt, minden rendben működik! :)', flags: MessageFlags.Ephemeral });
}
