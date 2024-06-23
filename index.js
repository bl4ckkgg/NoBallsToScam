const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, ChannelType } = require('discord.js');
const { token } = require('./config.json');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			client.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

async function postScamAlert(message) {
	const configPath = path.join(__dirname, 'config.json');
	const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
	const linkedChannels = config.linkedChannels || [];

	for (const channelId of linkedChannels) {
		const channel = client.channels.cache.get(channelId);
		if (channel && channel.type === ChannelType.GuildText) {
			try {
				await channel.send(message);
			} catch (error) {
				console.error(`Could not send message to channel ${channelId}:`, error);
			}
		}
	}
}

client.login(token);
