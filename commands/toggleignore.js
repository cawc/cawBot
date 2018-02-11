const prefix = require('../config.json').prefix;
const sqlite = require('sqlite');
sqlite.open('./db.sqlite');
exports.run = (client, message, args, config) => {
	if (message.author.id === config.id) {
		if (args.size > 1) return message.reply("This command takes no arguments.");
		
		sqlite.get(`SELECT * FROM channels WHERE id = "${message.channel.id}";`)
		.then(row => {
			if(row.ignored)
				sqlite.run(`UPDATE channels SET ignored = 0 WHERE id = "${message.channel.id}"`).then(() => {message.reply("This channel is now unignored.");});
			else
				sqlite.run(`UPDATE channels SET ignored = 1 WHERE id = "${message.channel.id}"`).then(() => {message.reply("This channel is now ignored.");});
		}).catch(console.error);
	}
};

exports.help = `This command ignores/unignores a channel. Usage: ${prefix}toggleignore`;