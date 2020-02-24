const Command = require('../../structures/Command.js');

class ChannelMap extends Command {
	constructor() {
		super({
			aliases: ['cm'],
			description: 'Channel list',
		});
	}

	async run(msg) {
		const roots = msg.guild.channels.cache.filter(c => !c.parent).sort((a, b) => a.position - b.position);

		let content = '';
		for (const r of roots.values()) {
			content += `\n+-- ${r.name}`;
			if (r.children.size) content += '\n' + r.children.sort((a, b) => a.position - b.position).map(x => `| +-- ${x.name}`).join('\n');
		}

		msg.channel.send('```' + content.substr(0, 1994) + '```');
	}
}

module.exports = ChannelMap;