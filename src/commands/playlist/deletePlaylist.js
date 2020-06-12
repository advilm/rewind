const Command = require('../../structures/Command.js');

class DeletePlaylist extends Command {
	constructor() {
		super({
			description: 'Deletes a playlist',
			aliases: ['dp']
		});

	}

	async run(msg) {
		let keys;

		const queues = (await this.client.pg.user.findOne({ id: msg.author.id }))?.queues;
		if (!queues || !(keys = Object.keys(queues)).length) return msg.reply('You have no queues');

		if (!msg.content) return msg.reply(`Queues: ${keys.map(x => `\`${x}\``).join(', ')}.`);
		if (!keys.includes(msg.content)) return msg.reply('Queue not found.');

		delete queues[msg.content];
		this.client.pg.user.save({ id: msg.author.id, queues });

		msg.reply(`Queue \`${msg.content}\` deleted`);
	}
}

module.exports = DeletePlaylist;
