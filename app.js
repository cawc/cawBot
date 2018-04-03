const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const sqlite = require('sqlite');
const config = require('./config.json');
const token = require('./token.json');
const bl = require('./bl.js');

const commands = fs.readdirSync('./commands').map(x => {
	return x.slice(0, -3);
});

sqlite.open('./db.sqlite');

client.on('ready', () => {
	sqlite.run('CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY, guildid INTEGER, chanid INTEGER, uid INTEGER, timestamp INTEGER, message TEXT, deleted INTEGER);');
	sqlite.run('CREATE TABLE IF NOT EXISTS channels (id INTEGER, timestamp INTEGER, ignored INTEGER);');
	sqlite.run('CREATE TABLE IF NOT EXISTS users (id INTEGER, timestamp INTEGER, name TEXT);');

	//Load all channels from the client and check if they are already stored in the database.
	client.channels.forEach(channel => {
		if(channel.type == 'text'){
			sqlite.get(`SELECT * FROM channels WHERE id = "${channel.id}";`)
				.then(row => {
					if(!row) {
						sqlite.run('INSERT INTO channels (id, timestamp, ignored) VALUES (?, ?, ?)', [channel.id, Date.now(), false]).catch(() => {console.error('Channel not added');});
					}
				}).catch(() => {console.error;});
		}
	});

	//Set game to the one defined in the configuration file
	client.user.setPresence({
		game: {
			name: config.startgame,
			type: 0
		}
	});
});

client.on('messageDelete', message => {
	sqlite.run(`UPDATE messages SET deleted = 1 WHERE id = "${message.id}"`);
});

client.on('message', message => {
	if (message.channel.type !== 'text') return; //ignore DM/group DM

	//check if user is already saved
	sqlite.get(`SELECT id FROM users WHERE id = "${message.author.id}" AND name = "${message.author.tag}";`)
		.then(row => {
			if(!row) sqlite.run('INSERT INTO users (id, timestamp, name) VALUES (?, ?, ?)', [message.author.id, Date.now(), message.author.tag]).catch(() => {console.error('User not added');});
		}).catch(() => {console.error;});

	//check if channel is already saved
	sqlite.get(`SELECT * FROM channels WHERE id = "${message.channel.id}";`)
		.then(row => {
			if(!row) sqlite.run('INSERT INTO channels (id, timestamp, ignored) VALUES (?, ?, ?)', [message.channel.id, Date.now(), false]).catch(() => {console.error('Channel not added');});
		}).catch(() => {console.error;});

	//log message
	sqlite.run('INSERT INTO messages (id, guildid, chanid, uid, timestamp, message, deleted) VALUES (?, ?, ?, ?, ?, ?, ?);', [message.id, message.guild.id, message.channel.id, message.author.id, Date.now(),message.content, 0])
		.catch(() => {console.error;});
	//end log

	if (message.author.bot) return; //ignore bots
	
	if (bl.some(v => message.content.toLowerCase().indexOf(v) >= 0)) { //check blacklist, ignore commands with blacklisted words
		message.delete();
		console.warn(`Blacklist match: ${message.content} | deleted.`);
	} else {
		if (!message.content.startsWith(config.prefix)) return; //commands have to start with defined prefix

		const args = message.content.slice(config.prefix.length).trim().split(/ +/g); //get arguments
		const command = args.shift().toLowerCase(); //get command

		if (!commands.some(x => x === command)) return; //if the command doesnt match the list of commands, ignore

		sqlite.get(`SELECT ignored FROM channels WHERE id = "${message.channel.id}";`).then(row => {
			if(row != null && row.ignored && command !== 'toggleignore') {
				return;
			} else {
				try {
					let commandFile = require(`./commands/${command}.js`);
					commandFile.run(client, message, args); 
				} catch (err) {
					console.error(err);
				}
			}
		}).catch((err) => {message.reply('Whoops, something went wrong while trying to do that. Please try again!'); console.error(err);});	
	}
});

client.login(token.discord);