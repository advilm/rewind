const Discord = require('discord.js');

class Handler {
	constructor(client) {
		this.client = client;

		this.commands = new Discord.Collection();
		this.aliases = new Discord.Collection();

		this.cooldown = 1000;
		this.cooldowns = new Map();
		this.cooldownsSent = new Map();
	}

	load() {
		for (const module of this.client.utils.walk('src/commands')) {
			const command = new (require(`${process.cwd()}/${module}`))();

			Reflect.defineProperty(command, 'client', {value: this.client});
			command.name = command.constructor.name.toLowerCase();
			command.type = module.split('/').slice(0, -1).pop();

			this.commands.set(command.name, command);
			command.aliases.map(c => this.aliases.set(c, command));
		}

		console.log(`${this.commands.size} commands loaded\n${this.aliases.size} aliases loaded`);

		for (const module of this.client.utils.walk('src/events')) {
			const event = require(`${process.cwd()}/${module}`);
			this.client.on(module.split('/').pop().slice(0, -3), (...args) => event.run(this.client, ...args));
		}

		console.log(`${Object.keys(this.client._events).length} events loaded`);

		return this;
	}

	get(cmd) {
		return this.commands.get(cmd?.toLowerCase()) || this.aliases.get(cmd?.toLowerCase());
	}

	async run(msg) {
		if (await (this.client.bl || new Set()).has(msg.author.id) && !msg.author.dev) return;

		try {
			const cmdname = msg.content.slice(msg.prefix.length).split(/ +/)[0];
			msg.cmd = this.get(cmdname);
			if (!msg.cmd) return;

			msg.author.dev = this.client.config.devs.includes(msg.author.id);
			if (msg.cmd.type === 'dev' && !msg.author.dev) return;

			if ((this.cooldownsSent.get(msg.author.id) || 0) > 5) return;
			if (this.cooldowns.get(msg.author.id + msg.cmd.name) > Date.now() - this.cooldown && !msg.author.dev) return msg.reply('Command on cooldown. (1s)') && this.cooldownsSent.add(msg.author.id, 1);
			else this.cooldowns.set(msg.author.id + msg.cmd.name, Date.now());


			msg.content = msg.content.slice(msg.prefix.length + cmdname.length + 1);

			const { flags, len } = this.client.utils.parseFlags(msg.content);
			msg.content = msg.content.slice(len);
			msg.flags = flags;

			const startTime = Date.now();
			const sent = await msg.cmd.run(msg);
			const endTime = Date.now();

			console.log(`${msg.cmd.name[0].toUpperCase() + msg.cmd.name.slice(1)} ran in ${msg.guild.name} [${endTime - startTime} ms]`);

			return sent;
		} catch (e) {
			msg.reply(`An unexpected error has occured: \`${e.toString()}\``);
			console.error(e.stack.split('\n')[0] + '\n', e.stack.match(/\(\/home\/advil\/.+?\)/g).map(x => x.slice(1, -1)).join('\n'));
		}
	}
}

module.exports = Handler;
