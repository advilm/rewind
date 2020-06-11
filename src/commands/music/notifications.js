const Command = require('../../structures/Command.js');

class Notifications extends Command {
	constructor() {
		super({
			description: 'Toggles notifications',
			aliases: ['n']
		});

	}

	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');

		const player = this.client.players.get(msg.guild.id);

		if (player.channel) msg.reply('Notifications toggled off.') && (player.channel = null);
		else msg.reply('Notifications toggled on.') && (player.channel = msg.channel);
	}
}

module.exports = Notifications;
