const Command = require('../../structures/Command.js');
const fetch = require('node-fetch');
const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

class Play extends Command {
	constructor() {
		super({
			description: 'Plays',
		});
        
	}

	async run(msg) {
		const node = this.client.manager.idealNodes[0];
		if (!node) return msg.reply('Lavalink hasn\'t finished connecting. Try again in a sec.');

		if (!msg.content) return msg.reply('Provide a song.');

		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');
		
		const params = new URLSearchParams();
		params.append('identifier', `${linkRegex.test(msg.content) ? '' : 'ytsearch:'}${msg.content}`);
        
		const res  = await (await fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } })).json();
		if (!res.tracks?.length) console.log(res);
		if (!res.tracks?.length) return msg.reply('Song not found. (Try again if it should\'ve worked)');
        
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
		
		const song = res.tracks[0];
		
		if (!player.queue.length) await player.play(song.track);
		res.playlistInfo.name ? player.queue.push(...res.tracks) : player.queue.push(song);
	
		msg.reply(`${player.queue.length === 1 ? 
			`Playing **${song.info.title}**` : `Added **${song.info.title}** to queue`}${res.playlistInfo.name ? ` and ${res.tracks.length - 1} other songs` : ''}`);

	}
}

module.exports = Play;
