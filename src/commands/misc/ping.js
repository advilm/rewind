const Command = require('../../structures/Command.js');

class Ping extends Command {
	constructor() {
		super({
			description: 'Pings.',
			aliases: ['p']
		});
	}

	async run(msg) {
		const m = await msg.reply('Pong.');
		m.edit(`Heartbeat: \`${this.client.ws.ping | 0}\` ms | Roundtrip: \`${(m.editedTimestamp || m.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp)}\` ms`);
	}
}

module.exports = Ping;
