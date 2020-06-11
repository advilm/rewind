const Command = require('../../structures/Command.js');
const { Util } = require('discord.js');

class Queue extends Command {
	constructor() {
		super({
			description: 'Displays queue',
			aliases: ['q']
		});

	}

	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel');
		
		const player = this.client.players.get(msg.guild.id);
		
		let page = parseInt(msg.content ? parseInt(msg.content) : (player.position / 10 | 0) + 1);
		if (!page) return msg.reply('Must provide a valid page.');
		
		const totalPages = Math.ceil(player.queue.length / 10);

		if (totalPages < page) return msg.reply(`There are only ${totalPages} page${totalPages > 1 ? 's' : ''}`);

		const embed = {
			title: `[${player.queue.length}] Queue`,
			description: player.queue.slice(((page - 1) * 10) || 0, (page * 10) || 0).map((x, i) => {
				return `**${i + 1 + (page - 1) * 10})** [${i + (page - 1) * 10 === player.position ?
					`**${Util.escapeMarkdown(x.info.title)}**` : `${Util.escapeMarkdown(x.info.title)}`}](${x.info.uri})`;
			}).join('\n') + `\n\nVolume: \`${player.state.volume}\` | Loop: \`${player.loop || 'none'}\` | Shuffle: \`${player.shuffle}\``,
			footer: {
				text: `Page ${page || 1}/${totalPages}`
			}
		};

		msg.reply({ embed });
	}
}

module.exports = Queue;
