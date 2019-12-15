const Command = require('../../structures/Command.js');
const Discord = require('discord.js');

class Idk extends Command {
	constructor() {
		super({
			name: 'idk',
			aliases: ['i'],
			description: 'Red/blue stats for plexi.',
		});
	}

	async run(msg) {
		const guild = this.client.guilds.get('343572980351107077');
		msg.channel.send(new Discord.MessageEmbed().addField('Green', guild.roles.get('650499858528075802').members.size, true).addField('Red', guild.roles.get('650499864559353891').members.size, true));
	}
}

module.exports = Idk;
