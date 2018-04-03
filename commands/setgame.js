const ownerID = require('../config.json').id;
exports.run = (client, message, args) => {
	if (message.author.id === ownerID) {
		let msg = args.join(' ');
		client.user.setPresence({game: {name: msg, type: 0}});
	}
};