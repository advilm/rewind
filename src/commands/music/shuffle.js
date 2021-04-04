const Command = require('../../structures/Command.js');

class Shuffle extends Command {
	constructor() {
		super({
			description: 'Shuffles',
			aliases: ['sh']
		});
        
	}
    
	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');

		const player = this.client.players.get(msg.guild.id);
		if (/^t(?:oggle)?$/i.test(msg.content)) {
			player.shuffle = !player.shuffle;
			msg.reply(`Shuffling set to \`${player.shuffle}\` (At end of a looped queue)`);
		} else {
			const song = player.queue.shift(); 
			player.queue.shuffle();
			player.queue.unshift(song);
			player.position = 0;
			 
			msg.reply(`${player.queue.length - 1} songs shuffled.`);
		}
	}
}

module.exports = Shuffle;
