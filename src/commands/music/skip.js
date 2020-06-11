const Command = require('../../structures/Command.js');

class Skip extends Command {
	constructor() {
		super({
			description: 'Skips',
			aliases: ['s']
		});
        
	}
    
	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');

		const player = this.client.players.get(msg.guild.id);
		msg.reply(`Skipped **${player.queue[player.position].info.title}**`);
		player.stop();
	}
}

module.exports = Skip;
