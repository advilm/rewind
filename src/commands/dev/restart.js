const Command = require('../../structures/Command.js');

class Restart extends Command {
	constructor() {
		super({
			aliases: ['r'],
			usage: '[Flags]?',
			description: 'Restarts.',
		});
	}
	async run(msg) {
		if (msg.flags.a) Object.keys(require.cache).forEach(x => delete require.cache[x]);
		else {
			for (const module of this.client.utils.walk('src/commands')) delete require.cache[`${process.cwd()}/${module}`];
			for (const module of this.client.utils.walk('src/events')) delete require.cache[`${process.cwd()}/${module}`];
		}

		delete this.client._events;

		await this.client.load();
		msg.reply('Reloaded `a bunch of stuff`.');
	}
}

module.exports = Restart;
