const Command = require('../../structures/Command.js');

class SaveQueue extends Command {
	constructor() {
		super({
			description: 'Saves queue',
			aliases: ['sq']
		});
        
	}
    
	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');

		const player = this.client.players.get(msg.guild.id);
        
		const queues = (await this.client.pg.user.findOne({ id: msg.author.id }))?.queues || {};

		queues[msg.content.replace(/[^\w-_ ]/g, '').replace(/\s/, '_') || 'unnamed'] = player.queue;

		this.client.pg.user.save({ id: msg.author.id, queues });
		msg.reply(`Queue saved to \`${msg.content.replace(/[^\w-_ ]/g, '') || 'unnamed'}\``);
	}
}

module.exports = SaveQueue;
