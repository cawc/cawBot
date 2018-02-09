const prefix = require('../config.json').prefix;
const fs = require('fs');
exports.run = (client, message, args, config) => {
	let commands = fs.readdirSync('./commands').map(x => {return x.slice(0, -3)});
	commands = commands.map(x => prefix + x)

	message.channel.send(`Command list\n${commands.join('	\n')}\n\nFor more information on command usage, use the ${prefix}help command.`, {code:true});
}


exports.help = `Lists commands. Usage: ${prefix}listcommands`;