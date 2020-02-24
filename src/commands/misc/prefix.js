const Command = require('../../structures/Command.js');

class Prefix extends Command {
	constructor() {
		super({
			usage: '[Any]',
			description: 'Sets prefix',
		});
	}

	async run() {
		// const guild = (await this.client.db.models.Guild.findOne({ where: { _id: msg.guild.id } }));
		// guild.prefix = this.client.utils.escapeRegEx(msg.content);
		// await guild.save();
		// await this.client.db.models.Guild.sync();

		// msg.reply(`Prefix set to \`${msg.content}\``);
	}
}

module.exports = Prefix;