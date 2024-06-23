const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('send-scam')
		.setDescription('Sends a new scam alert in the linked channel (exclusive to this server)')
		.addStringOption(option => option.setName('description').setDescription('Description of the scam').setRequired(true))
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction) {
		const guildId = '1254141995035660369';

		if (interaction.guild.id !== guildId) {
			return interaction.reply({ content: 'This command is not available in this server.', ephemeral: true });
		}

		const description = interaction.options.getString('description');
		const configPath = path.join(__dirname, '../../config.json');
		const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
		const linkedChannels = config.linkedChannels || [];

		for (const channelId of linkedChannels) {
			const channel = interaction.client.channels.cache.get(channelId);
			if (channel && channel.type === ChannelType.GuildText) {
				try {
					await channel.send(`🚨 New scam alert! 🚨\n\n**Description:** ${description}`);
				} catch (error) {
					console.error(`Could not send message to channel ${channelId}:`, error);
				}
			}
		}

		await interaction.reply({ content: 'New scam alert sent!', ephemeral: true });
	},
};
