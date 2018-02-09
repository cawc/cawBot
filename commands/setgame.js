exports.run = (client, message, args, config) => {
	if (message.member.roles.find("name", "cawbot_mod") || message.author.id === config.id) {
		let msg = args.join(' ')
		let game = new Object();
		game.name = msg;
		client.user.setPresence({game});
	}
}