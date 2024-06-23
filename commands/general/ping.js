const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription("Displays the bot's ping."),
	async execute(interaction) {
		const sent = await interaction.reply({ content: 'Pinging...', fetchReply: true });
		const ping = sent.createdTimestamp - interaction.createdTimestamp;
		const heartbeat = Math.round(interaction.client.ws.ping);
		await interaction.editReply(`🏓 Pong!\nLatency: ${ping}ms\nAPI Latency: ${heartbeat}ms`);
	},
};
