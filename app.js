const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const token = require('./token.json');
const bl = require('./bl.js');

const request = require('request');
const fs = require('fs');

const commands = fs.readdirSync('./commands').map(x => {
	return x.slice(0, -3)
});
console.log(commands);

const winston = require('winston');
let logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)(),
		new(winston.transports.File)({
			filename: './log.log'
		})
	]
});

client.on('ready', () => {
	console.log('cawBot ready!');
	client.user.setPresence({
		game: {
			name: config.startgame,
			type: 0
		}
	});
});

client.on('message', message => {
	if (message.channel.type == 'text') { //ignore DM/group DM
		if (message.author.bot) return; //ignore bots

		logger.info(`${message.author.tag} @ ${message.channel.name} : ${message.content}`);
		if (bl.some(v => message.content.toLowerCase().indexOf(v) >= 0)) { //check blacklist, ignore commands with blacklisted words
			message.delete();
			logger.info(`Blacklist match: ${message.content} | deleted.`);
		} else {
			if (!message.content.startsWith(config.prefix)) return; //commands have to start with defined prefix

			const args = message.content.slice(config.prefix.length).trim().split(/ +/g); //get arguments
			const command = args.shift().toLowerCase(); //get command

			if (!commands.some(x => x === command)) return; //if the command doesnt match the list of commands, ignore

			try {
				let commandFile = require(`./commands/${command}.js`);
				commandFile.run(client, message, args, config);
			} catch (err) {
				console.error(err);
			}
		}
	}
});

client.login(token.discord);