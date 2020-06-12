const Command = require('../../structures/Command.js');

class LoadPlaylist extends Command {
	constructor() {
		super({
			description: 'Appends a playlist to queue',
			aliases: ['lp']
		});
        
	}
    
	async run(msg) {
		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');
        
		let keys;
        
		const queues = (await this.client.pg.user.findOne({ id: msg.author.id }))?.queues;
		if (!queues || !(keys = Object.keys(queues)).length) return msg.reply('You have no queues');
        
		if (!msg.content) return msg.reply(`Queues: ${keys.map(x => `\`${x}\``).join(', ')}.`);
		if (msg.content.split(' ').find(x => !keys.includes(x))) return msg.reply('Queue not found.');
		
		let player = this.client.players.get(msg.guild.id);
		if (!player) {
			const permissions = msg.member.voice.channel.permissionsFor(msg.guild.me);
			if (!permissions.has('VIEW_CHANNEL')) return msg.reply('I can\'t view that channel.');
			if (!permissions.has('CONNECT')) return msg.reply('I can\'t connect to that channel.');
			if (!permissions.has('SPEAK')) return msg.reply('I can\'t speak in that channel.');
            
			player = await this.client.manager.join({ 
				guild: msg.guild.id,
				channel: msg.member.voice.channelID,
				node: 'main',
			}, { selfdeaf: true });
			
			player.channel = msg.channel;
			this.client.players.set(msg.guild.id, player);
		}

		player.queue.push(...[...msg.content.split(' ').map(x => queues[x]).filter(x => x).flat()]);
		msg.reply(`Queue \`${msg.content}\` loaded.`);

		if (!player.playing) {
			player.play(player.queue[player.position].track);
			player.queue[player.position].volume && player.volume(player.state.volume + player.queue[player.position].volume);
		}

		this.client.wsConnections.get(msg.guild.id).forEach(ws => {
			const { queue, position, state, timestamp, paused, shuffle, loop } = player;
			ws.send(JSON.stringify({ status: 'ok', event: 'queueUpdate', data: { queue, position, state, timestamp, paused, shuffle, loop } }));
		});
	}
}

module.exports = LoadPlaylist;
