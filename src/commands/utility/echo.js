const { SlashCommandBuilder, ChannelType, MessageFlags, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Replies with your input!")
    .addUserOption(option =>
			option
				.setName('target')
				.setDescription('The text that writed')
    )
    .addStringOption((option) =>
      option
        .setName("input")
        .setDescription("The input to echo back")
        .setMaxLength(2_000)
    )
    .addChannelOption((option) =>
      option
        .setName("channel")
        .setDescription("The channel to echo into")
        // Csak TextChannel lehet az output
        .addChannelTypes(ChannelType.GuildText)
    )
    .addBooleanOption((option) =>
      option
        .setName("embed")
        .setDescription("Whether or not the echo should be embedded")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
    const name = interaction.options.getString('input') ?? 'Nem adott meg nevet.';
    const embedded = interaction.options.getBoolean('embed') ?? false;
    const target = interaction.options.getUser('target');
    if(embedded){
      await interaction.reply({ content: `A megadott név: ${name}`, flags: MessageFlags.Ephemeral });
    }
    else{
      await interaction.reply(`A megadott név: ${name}, aki beíirta: ${target.username}`);
    }
	},
};
