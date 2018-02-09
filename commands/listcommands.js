const prefix = require('../config.json').prefix;
const fs = require('fs');
exports.run = (client, message, args, config) => {
	let commands = fs.readdirSync('./commands').map(x => {return x.slice(0, -3)});
	commands = commands.map(x => prefix + x)

	message.author.send(`Command list\n${commands.join('	\n')}\n\nFor more information on command usage, use the ${prefix}help command.`, {code:true})
	.catch((e) => {console.log(`${message.author.username} doesn't accept DMs`); message.react('⛔');});
}


exports.help = `Sends a DM with a list of all the commands. Make sure to accept DMs from server members. Usage: ${prefix}listcommands`;