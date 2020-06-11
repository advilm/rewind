const Command = require('../../structures/Command.js');

class Invite extends Command {
	constructor() {
		super({
			description: 'Pings.',
			aliases: ['inv']
		});
	}

	async run(msg) {
		const invite = `https://discordapp.com/oauth2/authorize?client_id=${this.client.user.id}&scope=bot&permissions=3165184`;
		msg.reply({ embed: { description: `[\`Click here to invite\`](${invite} "${invite}")` }});
	}
}

module.exports = Invite;
