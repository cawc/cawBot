const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const token = require('./token.json');
const bl = require('./bl.js');

const request = require('request');
var fs = require('fs');

var commands = fs.readdirSync('./commands').map(x => {
	return x.slice(0, -3)
});
console.log(commands)

var winston = require('winston');
var logger = new(winston.Logger)({
	transports: [
		new(winston.transports.Console)(),
		new(winston.transports.File)({
			filename: './log.log'
		})
	]
});

client.on('ready', () => {
	console.log('cawBot ready!');
	client.user.setGame(config.startgame);
});

client.on('message', message => {
	if (message.author.bot) return;

	logger.info(`${message.author.tag} @ ${message.channel.name} : ${message.content}`);
	if (bl.some(v => {
			return message.content.toLowerCase().indexOf(v) >= 0;
		})) {
		message.delete();
		logger.info(`Blacklist match: ${message.content} | deleted.`);
	}

	if (!message.content.startsWith(config.prefix)) return;


	const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (!commands.some(x => x === command)) return;

	try {
		let commandFile = require(`./commands/${command}.js`);
		commandFile.run(client, message, args, config);
	} catch (err) {
		console.error(err);
	}
});

client.login(token.discord);