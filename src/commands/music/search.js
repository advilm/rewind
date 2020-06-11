const Command = require('../../structures/Command.js');
const fetch = require('node-fetch');
const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

class Search extends Command {
	constructor() {
		super({
			description: 'Searches',
		});
		this.users = new Set();
	}

	async run(msg) {
		if (this.users.has(msg.author.id)) return msg.reply('You can\'t have more than one search going at once.');
		const node = this.client.manager.idealNodes[0];
		if (!node) return msg.reply('Lavalink hasn\'t finished connecting. Try again in a sec.');

		if (!msg.content) return msg.reply('Provide a song.');

		if (!msg.member.voice.channelID) return msg.reply('You need to be in a VC.');
		if (msg.guild.me.voice.channelID && msg.guild.me.voice.channelID !== msg.member.voice.channelID) return msg.reply('You need to be in the same VC as me.');
		
		const params = new URLSearchParams();
		params.append('identifier', `${linkRegex.test(msg.content) ? '' : 'ytsearch:'}${msg.content}`);
        
		const songs  = (await (await fetch(`http://${node.host}:${node.port}/loadtracks?${params}`, { headers: { Authorization: node.password } })).json()).tracks?.slice(0, 10);
		if (!songs) return msg.reply('Nothing found. (Try again if it should\'ve worked)');

		this.users.add(msg.author.id);
		msg.channel.send(songs.map((x, i) => `**${i + 1})** ${x.info.title}`));
		const n = (await msg.channel.awaitMessages(m => /^\d+$/.test(m.content), { max: 1, maxProcessed: 10, time: 30000 })).first()?.content;
		this.users.delete(msg.author.id);

		if (!n) return msg.reply('You need to provide a valid number.');
		if (!songs[n - 1]) return msg.reply('Index doesn\'t exist.');

		let player = this.client.players.get(msg.guild.id);
		if (!player) {
			const permissions = msg.member.voice.channel.permissionsFor(msg.guild.me);
			if (!permissions.has('VIEW_CHANNEL')) return msg.reply('I can\'t view that channel.');
			if (!permissions.has('CONNECT')) return msg.reply('I can\'t connect to that channel.');
			if (!permissions.has('SPEAK')) return msg.reply('I can\'t speak in that channel.');
            
			player = await this.client.manager.join({ 
				guild: msg.guild.id,
				channel: msg.member.voice.channelID,
				node: '0',
			}, { selfdeaf: true });

			this.client.players.set(msg.guild.id, player);
		}

		if (!player.queue.length) await player.play(songs[n - 1].track);
		player.queue.push(songs[n - 1]);
        
		player.channel = msg.channel;
		msg.reply(player.queue.length === 1 ? `Playing **${songs[n - 1].info.title}**` : `Added **${songs[n - 1].info.title}** to queue`);
	}
}

module.exports = Search;
