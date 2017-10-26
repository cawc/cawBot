const request = require('request');
const Discord = require('discord.js');
exports.run = (client, message, args, config) => {
	let url;
	if (isNaN(args[0])) {
		url = 'http://xkcd.com/info.0.json';
	} else {
		url = `http://xkcd.com/${args[0]}/info.0.json`;
	}
	request(url, (error, response, body) => {
		if (!error && response.statusCode === 200) {
			let jsonData = JSON.parse(body);
			let embed = new Discord.RichEmbed()
				.setTitle(jsonData.num + ' - ' + jsonData.title)
				.setDescription(jsonData.alt)
				.setImage(jsonData.img)
				.setTimestamp(new Date(jsonData.year, jsonData.month - 1, jsonData.day))
				.setURL(`http://xkcd.com/${jsonData.num}`);

			message.channel.send('', {
				embed: embed
			});
		} else {
			message.channel.send('That xkcd doesn\'t exist!');
		}
	});
};