const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays all commands.'),
	async execute(interaction) {
		await interaction.reply('Commands: /channel-link, /channel-unlink, /help, /ping, /source, /docs');
	},
};
