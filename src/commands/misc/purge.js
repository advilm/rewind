const Command = require('../../structures/Command.js');

class Purge extends Command {
	constructor() {
		super({
			aliases: ['cl', 'clear'],
			usage: '[Flags]? [Integer]',
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
		var interval = 2500;
		const purge = async (num = 20, opts = {}, initial) => {
			if (num < 1) return;

			if (initial && num <= 2000) interval = 250;

			let msgs = await msg.channel.messages.fetch({limit: num > 100 ? 100 : num, before: opts.before});
			if (!msgs.size) return;
			const last = msgs.last().id;

			msgs = msgs.filter(x => {
				if (opts.after && x.id <= opts.after) return;
				if (opts.user && !(isNaN(opts.user) ? x.member.displayName.includes(opts.user): x.author.id === opts.user)) return;
				if (opts.text && !x.content.includes(opts.text)) return;
				if (opts.embed && !x.embeds.find(x => x.type === 'rich')) return;
				if (opts.mention && !/<@[!#&]?\d{17,19}>|@everyone|@here/.test(x.content)) return;
				if (opts.bot && !(x.author.bot || /^(?:[a-z]?[!?]|[-\\`]|re\.|tide|!=|qm)\s*[a-z]/i.test(x.content))) return;
				if (opts.link && !/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(x.content)) return;
				if (!opts.pins && x.pinned) return;
				return true;
			});

			if (!msgs.size && !Object.keys(opts).find(x => x !== 'before' || x !== 'after')) return;
			if (msgs.size) {
				const old = [], recent = [];
				msgs.map(x => x.createdTimestamp > Date.now() - 604800000 ? recent.push(x) : old.push(x));

				recent.length && (purged += (await msg.channel.bulkDelete(recent)).size);

				if (old.length) await this.client.sleep(2500);
				for (const message of old) {
					await message.delete() && purged++;
					if (message.id !== old[old.length - 1].id) await this.client.sleep(2500);
				}
			}

			if (last <= opts.before) return;

			if (num - 100 > 0) await this.client.sleep(interval);
			await purge(num - 100, { ...opts, before: last}, false);
		};

		await purge(Math.abs(Math.ceil(msg.args.number[0])), msg.flags);
		await msg.channel.send(`Purged ${purged} messages`).then(x => x.delete({ timeout: 3000 }));
		this.channels.delete(msg.channel.id);
	}
}

module.exports = Purge;
