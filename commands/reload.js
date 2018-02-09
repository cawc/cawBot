const prefix = require('../config.json').prefix;
exports.run = (client, message, args, config) => {
	if(message.author.id === config.id){
	  if(!args || args.size < 1) return message.reply("Must provide a command name to reload.");
	  delete require.cache[require.resolve(`./${args[0]}.js`)];
	  message.reply(`The command ${args[0]} has been reloaded`);
	}
};

exports.help = `This command reloads another command. Usage: ${prefix}reload [command]`;