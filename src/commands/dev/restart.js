const { walk } = require('walk');
const { resolve } = require('path');
const Command = require('../../structures/Command.js');

class Restart extends Command {
	constructor() {
		super({
			name: 'restart',
			aliases: ['r'],
			description: 'Restarts.',
		});
	}
	run(msg) {
		const walker = walk('./src');
    
		walker.on('file', (root, stats, next) => {
			delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
			next();
		});

		delete this.client._events;
    
		walker.on('end', async () => {
			this.client.handler = new (require('../../structures/Handler.js'))().load(this.client);
			this.client.error = new (require('../../structures/Error.js'));
			this.client.parser = new (require('../../structures/Parser.js'))(this.client);
			this.client.utils = new (require('../../structures/Utils.js'))();
			this.client.clans = new (require('../../structures/Clans.js'))(this.client);
      
			msg.channel.send('Reloaded `a bunch of stuff`.');
		});
	}
}

module.exports = Restart;
