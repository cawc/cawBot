const prefix = require('../config.json').prefix;
exports.run = (client, message, args) => {
	if (message.member.roles.find('name', 'cawbot_mod')) {
		if (!args || args.size < 2 || message.mentions.members.array().length < 1 || message.mentions.members.array().length > 1 ) {
			return message.reply('Must provide 1 user.');
		}
		if(!message.mentions.members.first().bot && message.mentions.members.first().kickable) {
			let reason = args.slice(1).join(' ');
			message.mentions.members.first().send(reason).then(() => {message.mentions.members.first().kick();},() => {message.mentions.members.first().kick();});
		}
	}
};

exports.help = `Kicks a user and tries to DM them with the reason. Usage: ${prefix}kick [user] [reason]`;