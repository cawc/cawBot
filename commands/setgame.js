exports.run = (client, message, args, config) => {
	if (message.member.roles.find("name", "cawbot_mod") || message.author.id === config.id) {
		client.user.setGame(args.join(' ')).catch(console.error);
	}
}