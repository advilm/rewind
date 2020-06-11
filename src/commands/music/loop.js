const Command = require('../../structures/Command.js');

class Loop extends Command {
	constructor() {
		super({
			description: 'Loops',
			aliases: ['l']
		});

	}

	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');

        
		const player = this.client.players.get(msg.guild.id);

		let previous = player.loop;
        
		if (/^s(?:ingle)?$/i.test(msg.content)) msg.reply('Setting loop type to `single`.') && (player.loop = 'single');
		else if (/^q(?:ueue)?$/i.test(msg.content)) msg.reply('Setting loop type to `queue`.') && (player.loop = 'queue');
		else if (/^n(?:one)?$/i.test(msg.content)) msg.reply('Loop disabled.') && (player.loop = null);
		else msg.reply('You need to specify `[q]ueue`, `[s]ingle`, or `[n]one` ');

	} 
}

module.exports = Loop;
