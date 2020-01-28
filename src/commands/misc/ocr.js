const Command = require('../../structures/Command.js');

class Ocr extends Command {
	constructor() {
		super({
			usage: '[Any]?',
			description: 'Executes stuff.',
		});
	}

	async run(msg) {    
		if (!msg.args.any[0]?.match(/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/) && !msg.attachments.size) return;
		const { data } = await this.client.worker.recognize(msg.args.content || msg.attachments.size && msg.attachments.first().url);
		msg.reply(`Confidence: ${data.confidence}\n\`\`\`\n${data.text.substring(0, 1900) || 'Nothing found.' }\`\`\``);
	}
}

module.exports = Ocr;
