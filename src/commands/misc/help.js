const Discord = require('discord.js');
const Command = require('../../structures/Command.js');

class Help extends Command {
	constructor() {
		super({
			aliases: ['h'],
			usage: '[Command]?',
			description: 'List of commands w/ descriptions.',
		});
	}

	async run(msg) {
		const embed = new Discord.MessageEmbed()
			.setDescription('```js\n' + require('util').inspect(msg.args) + '```');
		msg.reply(embed);
	}
}

module.exports = Help;