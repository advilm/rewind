const Command = require('../../structures/Command.js');

class Volume extends Command {
	constructor() {
		super({
			description: 'Stops'
		});

	}

	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');

		const player = this.client.players.get(msg.guild.id);
		if (!msg.content) msg.reply(`The volume is currently set to ${player.state.volume}.`);
		else if (parseInt(msg.content)) {
			if (msg.content > 200) msg.reply('Too large.');
			else if (msg.content < 0) msg.reply('Too small.');
			else await player.volume(parseInt(msg.content)) && msg.reply(`Volume set to ${msg.content}.`);
		} 
	} 
}

module.exports = Volume;
