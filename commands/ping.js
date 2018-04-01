exports.run = (client, message, args) => {
	if (args.size > 1) return message.reply('This command takes no arguments.');
	
	message.react('🏓').catch(console.error);
};