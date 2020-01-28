const { walk } = require('walk');
const { resolve } = require('path');
const Command = require('../../structures/Command.js');

class Restart extends Command {
	constructor() {
		super({
			aliases: ['r'],
			description: 'Restarts.',
		});
	}
	async run(msg) {
		const walker = walk('./src');
    
		walker.on('file', (root, stats, next) => {
			delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
			next();
		});

		delete this.client._events;
    
		walker.on('end', async () => {
			this.client.load();
			msg.reply('Reloaded `a bunch of stuff`.');
		});
	}
}

module.exports = Restart;
