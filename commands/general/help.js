const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Displays all commands.'),
	async execute(interaction) {
		await interaction.reply("Commands: \n /channel-link - Link a channel so the bot will send scam alerts \n /channel-unlink - Unlink a linked channel \n /help - See all available commands \n /ping - See the bot's ping \n /source - See the bot's source code");
	},
};