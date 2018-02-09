const prefix = require('../config.json').prefix;
const fs = require('fs');
exports.run = (client, message, args, config) => {
	if (message.author.id === config.id) {
		if (!args || args.size < 1) return message.reply("Must provide a command name to reload.");
		let commands = fs.readdirSync('./commands').map(x => {return x.slice(0, -3)});
		if (!commands.some(x => x === args[0])) return message.react('⛔');
		delete require.cache[require.resolve(`./${args[0]}.js`)];
		return message.react('✅');
	}
};

exports.help = `This command reloads another command. Usage: ${prefix}reload [command]`;