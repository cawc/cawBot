const Discord = require('discord.js');
const request = require('request');
const prefix = require('../config.json').prefix;
const currencies = ['AUD','BGN','BRL','CAD','CHF','CNY','CZK','DKK','EUR','GBP','HKD','HRK','HUF','IDR','ILS','INR','ISK','JPY','KRW','MXN','MYR','NOK','NZD','PHP','PLN','RON','RUB','SEK','SGD','THB','TRY','USD','ZAR'];
exports.run = (client, message, args) => {
	if (args.length !== 3 || isNaN(args[2])) {
		message.reply(`Wrong arguments given. Use ${prefix}help for help.`);
	} else {
		let fromCur = args[0].toUpperCase();
		let toCur = args[1].toUpperCase();
		let amount = parseFloat(args[2]);
		if (!currencies.some(x => x === fromCur) || !currencies.some(x => x === toCur)) {
			message.channel.send('Sorry, one or more of the currencies requested are not available.\nA list of available currencies is found here: http://bit.ly/2qc6bC7');
		} else {
			const url = `https://api.fixer.io/latest?base=${fromCur}&symbols=${toCur}`;
			request(url, (error, response, body) => { 
				if (!error && response.statusCode === 200) {
					let jsonData = JSON.parse(body);
					let converted = (jsonData.rates[toCur] * amount).toFixed(2);
					let embed = new Discord.RichEmbed()
						.setTitle(`${amount} ${fromCur} ➡ ${converted} ${toCur}`);
					message.channel.send({embed});
				}
			});
		}
	}
};


exports.help = `Exchange currency. Usage: ${prefix}currency [from] [to] [amount] | Example: ${prefix}currency EUR USD 10`;