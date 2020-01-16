const Command = require('../../structures/Command.js');

class Purge extends Command {
	constructor() {
		super({
			aliases: ['cl', 'clear'],
			usage: '[Flags]? [Number]',
			description: 'Purges.'
		});

		this.channels = new Map();
	}

	async run(msg) {
		if ((!msg.member.permissions.has('MANAGE_MESSAGES') && !msg.author.dev) || !msg.channel.permissionsFor(this.client.user.id).has('MANAGE_MESSAGES'))
			return msg.channel.send('Someone lacking perms');
		
		if (this.channels.get(msg.channel.id)) return msg.reply('Purge already running in this channel');
		this.channels.set(msg.channel.id, true);

		await msg.delete();

		var purged = 0;
		const purge = async (num = 20, opts = {}) => {
			if (num < 1) return;

			const fetched = (await msg.channel.messages.fetch({limit: num > 100 ? 100 : num, before: opts.before}));
			if (!fetched.size) return;

			let msgs = fetched;

			if (opts.before) msgs = msgs.filter(x => x.id < opts.before);
			if (opts.after) msgs = msgs.filter(x => x.id > opts.after);
			if (opts.bot) msgs = msgs.filter(x => x.author.bot || /([!?]|re\.|tide|m\?ev)\s*\w/i.test(x.content));
			if (opts.text) msgs = msgs.filter(x => x.content.includes(opts.text));
		
			if (!msgs.size && !opts.bot && !opts.text) return;
			if (msgs.size) {
				const old = [], recent = [];
				msgs.map(x => (x.createdTimestamp > Date.now() - 1.21e+9) ? recent.push(x) : old.push(x));
				recent.length && (purged += (await msg.channel.bulkDelete(recent)).size);
				for (const message of old) {
					await message.delete() && purged++;
					await require('util').promisify(setTimeout)(250);
				}
			}
				
			await require('util').promisify(setTimeout)(1000);
			await purge(num - 100, { ...opts, before: fetched.last().id });
		};

		await purge(Math.abs(Math.ceil(msg.args.number[0])), msg.flags);
		await msg.channel.send(`Purged ${purged} messages`).then(x => x.delete({ timeout: 3000 }));
		this.channels.delete(msg.channel.id);
	}
}

module.exports = Purge;
