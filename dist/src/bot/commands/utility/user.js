import { SlashCommandBuilder } from "discord.js";
export const data = new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides information about the user.');
export async function execute(interaction) {
    return interaction.reply(`This command was run by ${interaction.user}`);
}
