const Discord = require('discord.js');
const client = new Discord.Client();
const request = require('request');
const fs = require('fs');
const sqlite = require('sqlite');

const config = require('./config.json');
const token = require('./token.json');
const bl = require('./bl.js');

const commands = fs.readdirSync('./commands').map(x => {
	return x.slice(0, -3)
});
console.log(commands);

sqlite.open('./db.sqlite');

client.on('ready', () => {
	sqlite.run('CREATE TABLE IF NOT EXISTS messages (msgid INTEGER PRIMARY KEY, guildid INTEGER, chanid INTEGER, uid INTEGER, timestamp INTEGER, message TEXT);');
	sqlite.run('CREATE TABLE IF NOT EXISTS guilds (guildid INTEGER, name TEXT);');
	sqlite.run('CREATE TABLE IF NOT EXISTS channels (channelid INTEGER, name TEXT);');
	sqlite.run('CREATE TABLE IF NOT EXISTS users (userid INTEGER, name TEXT);');
	sqlite.run('CREATE TABLE IF NOT EXISTS levels (uid INTEGER PRIMARY KEY, xp INTEGER, level INTEGER);');

	console.log('cawBot ready!');
	client.user.setPresence({
		game: {
			name: config.startgame,
			type: 0
		}
	});

	sqlite.all('SELECT messages.timestamp, users.name, messages.message FROM messages, users WHERE messages.uid = users.userid').then(rows => {
		console.log(rows);
	});
});

client.on('message', message => {
	if (message.channel.type !== 'text') return; //ignore DM/group DM


	sqlite.get(`SELECT * FROM users WHERE userid = "${message.author.id}" AND name = "${message.author.tag}";`)
	.then(row => {
		if(!row) sqlite.run(`INSERT INTO users (userid, name) VALUES (?, ?)`, [message.author.id, message.author.tag]).then(() => console.log('Inserted new user'));
	}).catch(console.error);

	//log in db
	sqlite.run(`INSERT INTO messages (msgid, guildid, chanid, uid, timestamp, message) VALUES (?, ?, ?, ?, ?, ?);`, [message.id, message.guild.id, message.channel.id, message.author.id, Date.now(),message.content])
	.then(() => {console.log(`${message.author.tag} @ ${message.channel.name} : ${message.content}`);}, () => {console.error});
	//end log

	if (message.author.bot) return; //ignore bots
	
	if (bl.some(v => message.content.toLowerCase().indexOf(v) >= 0)) { //check blacklist, ignore commands with blacklisted words
		message.delete();
		console.log(`Blacklist match: ${message.content} | deleted.`);
	} else {
		if (!message.content.startsWith(config.prefix)) return; //commands have to start with defined prefix

		const args = message.content.slice(config.prefix.length).trim().split(/ +/g); //get arguments
		const command = args.shift().toLowerCase(); //get command

		if (!commands.some(x => x === command)) return; //if the command doesnt match the list of commands, ignore

		try {
			let commandFile = require(`./commands/${command}.js`);
			commandFile.run(client, message, args, config);
		} catch (err) {
			console.error(err);
		}
	}
});

client.login(token.discord);