exports.run = (client, message, args, config) => {
	if (args.size !== 2 || isNaN(args[0]) || isNaN(args[1])) {
		message.reply('Wrong syntax! Correct usage: "cb.roll [min] [max]"');
	} else {
		let min = Math.ceil(args[0]);
		let max = Math.floor(args[1]);
		let roll = Math.round(Math.random() * (max - min)) + min;
		message.reply(`Rolled ${roll}`);
	}
}