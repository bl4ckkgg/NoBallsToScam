const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel-unlink')
		.setDescription('Unlinks a channel from scam alerts')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('The channel to unlink')
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');
		const configPath = path.join(__dirname, '../../config.json');
		let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		config.linkedChannels = config.linkedChannels || [];

		if (!config.linkedChannels.includes(channel.id)) {
			return interaction.reply({ content: "This channel is not linked.", ephemeral: true });
		}

		config.linkedChannels = config.linkedChannels.filter(id => id !== channel.id);
		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

		return interaction.reply({ content: `Channel ${channel.name} will no longer receive scam updates.`, ephemeral: true });
	},
};
