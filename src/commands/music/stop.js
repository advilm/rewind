const Command = require('../../structures/Command.js');

class Stop extends Command {
	constructor() {
		super({
			description: 'Stops'
		});

	}

	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		
		msg.guild.player.queue = []

		this.client.players.delete(msg.guild.id);
		this.client.manager.leave(msg.guild.id);
	} 
}

module.exports = Stop;
