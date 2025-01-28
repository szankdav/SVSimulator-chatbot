import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
	.setName('user')
	.setDescription('Provides information about the user.');

export async function execute(interaction: CommandInteraction) {
	// interaction.user egy User object, aki futtatta a parancsot
	// interaction.member egy GuildMember object, ami a usert reprezentálja a szerveren
	return interaction.reply(`This command was run by ${interaction.user}`);
}
