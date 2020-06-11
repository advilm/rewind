const Command = require('../../structures/Command.js');

class Help extends Command {
	constructor() {
		super({
			description: 'Helps.',
			aliases: ['h']
		});
	}

	async run(msg) {
		const types = {
			music: [],
			queue: [],
			misc: []
		};
		this.client.handler.commands.map(c => types[c.type]?.push(`\`${c.name}\``));

		msg.reply({embed: { fields: Object.entries(types).map(c => { return { name: c[0][0].toUpperCase() + c[0].slice(1), value: c[1].join(', ') }; }) } });
	}
}

module.exports = Help;
