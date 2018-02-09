const prefix = require('../config.json').prefix;
exports.run = (client, message, args, config) => {
	if (args.length !== 2 || isNaN(args[0]) || isNaN(args[1])) {
		message.reply(`Wrong arguments given. Use ${prefix}help for help.`);
	} else {
		let min = Math.ceil(args[0]);
		let max = Math.floor(args[1]);
		let roll = Math.round(Math.random() * (max - min)) + min;
		message.reply(`Rolled ${roll}`);
	}
}


exports.help = `Roll a number. Usage: ${prefix}roll [from] [to]`;