const Discord = require('discord.js');
const { walk } = require('walk');
const { resolve } = require('path');

class Handler {
	constructor() {
		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();

		this.cooldown = 1000;
		this.cooldowns = new Map();
		this.cooldownsSent = new Map();
	}

	load(client) {
		this.client = client;
		const cmdwalker = walk('./src/commands');
		cmdwalker.on('file', (root, stats, next) => {
			const command = new (require(`${resolve(root)}/${stats.name}`))();
			command.client = this.client;

			command.type = root.split('\\')[1];

			this.commands.set(command.name.toLowerCase(), command);
			command.aliases.map((c) => this.aliases.set(c.toLowerCase(), command));
			next();
		});
    
		cmdwalker.on('end', () => console.log(`${this.commands.size} commands loaded\n${this.aliases.size} aliases loaded`));

		const eventwalker = walk('./src/events');
		eventwalker.on('file', (root, stats, next) => {
			const Event = require('../events/' + stats.name);
			this.client.on(stats.name.slice(0, -3), (...args) => Event.run(this.client, ...args));
			next();
		});

		eventwalker.on('end', () => console.log(`${Object.keys(this.client._events).length} events loaded`));
				
		return this;
	}

	get(cmd) {
		return this.commands.get(cmd?.toLowerCase()) || this.aliases.get(cmd?.toLowerCase());
	}

	async run(msg) {
		try {
			const cmdname = msg.content.slice(msg.prefix.length).split(/ +/)[0];
			msg.cmd = this.get(cmdname);
			if (!msg.cmd) return;
      
			if ((this.cooldownsSent.get(msg.author.id) || 0) > 5) return;
			if (this.cooldowns.get(msg.author.id + msg.cmd.name) > Date.now() - this.cooldown) return msg.channel.send('Command on cooldown. (1s)') && this.cooldownsSent.add(msg.author.id, 1);
			else this.cooldowns.set(msg.author.id + msg.cmd.name, Date.now());
      

			msg.content = msg.content.slice(msg.prefix.length + cmdname.length + 1);

			const { flags, content} = this.client.utils.parseFlags(msg.content);
			msg.flags = flags, msg.content = content;

			msg.args = this.client.parser.parse(msg);
			if (msg.args === false) return;  

    
			msg.author.dev = this.client.config.devs.includes(msg.author.id);
			if (msg.cmd.type === 'dev' && !msg.author.dev) return;
      
			const startTime = Date.now();
			const sent = await msg.cmd.run(msg);
			const endTime = Date.now();
      
			console.log(`${msg.cmd.name[0].toUpperCase() + msg.cmd.name.slice(1)} ran in ${msg.guild.name} [${endTime - startTime} ms]`);
      
			return sent;
		} catch (e) {
			msg.channel.send(`An unexpected error has occured: \`${e.toString()}\``);
			console.error(e.stack.split('\n')[0] + '\n', e.stack.match(/\((C:\\Users\\.+?)\)/)[1]);
		}
	}
}

module.exports = Handler;
