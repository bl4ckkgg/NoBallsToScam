const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('source')
		.setDescription('Displays the bot\'s GitHub repo.'),
	async execute(interaction) {
		await interaction.reply('GitHub Repo: https://github.com/your-repo');
	},
};
