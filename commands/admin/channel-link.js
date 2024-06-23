const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('channel-link')
		.setDescription('Links a channel for scam alerts')
		.addChannelOption(option => option
			.setName('channel')
			.setDescription('The channel to link')
			.addChannelTypes(ChannelType.GuildText)
			.setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
	async execute(interaction) {
		const channel = interaction.options.getChannel('channel');

		if (channel.type !== ChannelType.GuildText) {
			return interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
		}

		if (!channel.viewable) {
			return interaction.reply({ content: "I don't have access to that channel.", ephemeral: true });
		}

		if (!channel.permissionsFor(interaction.client.user).has(PermissionFlagsBits.SendMessages)) {
			return interaction.reply({ content: "I don't have permission to Send Messages in this channel.", ephemeral: true });
		}

		const configPath = path.join(__dirname, '../../config.json');
		let config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		config.linkedChannels = config.linkedChannels || [];

		if (config.linkedChannels.includes(channel.id)) {
			return interaction.reply({ content: "This channel is already linked.", ephemeral: true });
		}

		config.linkedChannels.push(channel.id);
		fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

		return interaction.reply({ content: `Channel ${channel.name} has been linked for scam alerts.`, ephemeral: true });
	},
};
