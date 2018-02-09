const fs = require('fs');
const commands = fs.readdirSync('./commands').map(x => {return x.slice(0, -3)});
const prefix = require('../config.json').prefix;

exports.run = (client, message, args, config) => {
	if(!args || args.size > 1 || !commands.some(x => x === args[0])) {
		return message.reply(`Usage: ${prefix}help [command]. For a list of commands, use ${prefix}listcommands`);
	} else {
		let commandFile = require(`../commands/${args[0]}.js`);
		let helpText = commandFile.help;
		message.reply(helpText);
	}
}