exports.run = (client, message, args, config) => {
	if (message.member.roles.find("name", "cawbot_mod") || message.author.id === config.id) {
		let msg = args.join(' ');
		client.user.setPresence({game: {name: msg, type: 0}});
	}
}