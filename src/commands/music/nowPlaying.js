const Command = require('../../structures/Command.js');

class NowPlaying extends Command {
	constructor() {
		super({
			description: 'Displays what is currently playing',
			aliases: ['np']
		});

	}

	async run(msg) {
		if (!msg.guild.me.voice.channelID) return msg.reply('I\'m not even in a voice channel.');
		const player = this.client.players.get(msg.guild.id);

		if (!player.playing) return msg.reply('Not playing anything rn.');

		const song = player.queue[player.position].info;

		const percent = player.state.position / player.queue[player.position].info.length, length = 50; 			
		const bar = '-'
			.repeat(Math.ceil(percent * length > length ? length : percent * length))
			.slice(0, -1) + '=' + '-'
			.repeat(length - percent * length > 0 ? length - percent * length : 0);

		msg.reply({
			embed: {
				title: song.title,
				description: `Author: ${song.author}
Position: ${this.client.utils.duration(player.state.position)} / ${this.client.utils.duration(player.queue[player.position].info.length)}
${bar}`,
				thumbnail: { url: `https://img.youtube.com/vi/${song.identifier}/0.jpg?size=2048` }
			}
		});
	}
}

module.exports = NowPlaying;
