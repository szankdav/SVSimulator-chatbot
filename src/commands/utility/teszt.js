const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	cooldown: 5,
	data: new SlashCommandBuilder()
		.setName('teszt')
		.setDescription('Teszt parancs.'),
	async execute(interaction) {
		await interaction.reply('Sikeres teszt, minden rendben működik! :)');
	},
};