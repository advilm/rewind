const Command = require('../../structures/Command.js');

class Bar extends Command {
	constructor() {
		super({
			name: 'bar',
			usage: '[User]? [Any]?',
			aliases: ['b'],
			description: 'Executes stuff.',
		});

		this.channels = new Map();
	}

	async run(msg) {
		var length = msg.args.any?.[0];
		if (length && length > 2000 || length < 1) return msg.channel.send('Invalid length.');
		
		const user =  msg.args.user?.[0] || msg.author;
		
		var cb, x = await msg.reply('getting');
		this.channels.set(msg.channel.id, x.id);

		this.interval = async () =>  {
			if (x.id !== this.channels.get(msg.channel.id)) return this.stop();

			if (user.presence.activity?.name !== 'Spotify') return cb !== 'not playing' && x.edit('not playing') && (cb = 'not playing');
			const t = Object.values(user.presence.activity.timestamps).map(x => x.getTime());
			const percent = (Date.now() - t[0]) / (t[1] - t[0]);
			length = parseInt(length) || 100;
			const bar = '-'.repeat(Math.ceil((percent * length) > length ? length: percent * length)).slice(0, -1) + '=' + '-'.repeat((length - percent * length) > 0 ? length - percent * length: 0);
			cb !== bar && x.edit(bar) && (cb = bar);
		};
		
		this.interval();
		setInterval(this.interval, 2000); 
	}

	stop() {
		clearInterval(this.interval);
	}
}

module.exports = Bar;
