const token = require('../token.json');
const request = require('request');
const Discord = require('discord.js');
const modes = ['osu', 'taiko', 'ctb', 'mania']; //don't change order, cus of bad code below
exports.run = (client, message, args, config) => {
	const osutoken = token.osu;
	if(args.length === 2 && modes.includes(args[1].toLowerCase())) {
		let mode = args[1];
		const url = `https://osu.ppy.sh/api/get_user?k=${osutoken}&u=${args[0]}&m=${modes.indexOf(mode)}`;
		console.log(url);
		request(url, (error, body, response) => {
			if (!error && response !== "[]") {
				let jsonData = JSON.parse(response);
				//console.log(jsonData);
				let embed = new Discord.RichEmbed()
				.setTitle(`${jsonData[0].username}'s osu! stats in ${mode}`)
				.setThumbnail(`https://a.ppy.sh/${jsonData[0].user_id}`)
				.setURL(`https://osu.ppy.sh/u/${jsonData[0].username}`)
				.addField("Playcount (only R/A/L)",`${jsonData[0].playcount} maps`)
				.addField("Accuracy",`${parseFloat(jsonData[0].accuracy).toFixed(2)}%`)
				.addField("Level",`${Math.floor(parseFloat(jsonData[0].level))}`,true)
				.addField("Global rank",`#${jsonData[0].pp_rank}`,true)
				.addField("Country",`${jsonData[0].country}`,true)
				.addField("Country rank", `#${jsonData[0].pp_country_rank}`,true);
				message.channel.send({embed});
			} else {
				message.reply('Something went wrong or that user does not exist!');
			}
		})
	} else {
		message.reply('Wrong syntax! Correct usage: "cb.osu [username] [osu|mania|taiko|ctb]"');
	}
}