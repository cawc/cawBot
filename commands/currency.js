const Discord = require('discord.js');
const request = require('request');
const prefix = require('../config.json').prefix;
const currencies = ['AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HRK','HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK','NZD','PHP','PLN','RON','RUB','SEK','SGD','THB','TRY','USD','ZAR'];
exports.run = (client, message, args, config) => {
	if (args.length !== 3 || isNaN(args[2]) || !currencies.some(x => x === args[0]) || !currencies.some(x => x === args[1])) {
		console.log(args);
		message.reply(`Wrong arguments given. Use ${prefix}help for help.`);
	} else {
		const url = `https://api.fixer.io/latest?symbols=${args[0]},${args[1]}`;
		console.log(url);
		request(url, (error, response, body) => { 
			if (!error && response.statusCode === 200) {
				let jsonData = JSON.parse(body);
				let converted = jsonData.rates[args[1]] * args[2];
				let embed = new Discord.RichEmbed()
				.setTitle(args[0] + ' ➡ ' + args[1])
				.addField("Result", `${converted} ${args[1]}`);
				message.channel.send({embed});
			}
		});
		
	}
}


exports.help = `Exchange currency. Usage: ${prefix}currency [from] [to] [amount] | Example: ${prefix}currency EUR USD 10`;