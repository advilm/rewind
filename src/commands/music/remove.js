const Command = require('../../structures/Command.js');

class Remove extends Command {
	constructor() {
		super({
			description: 'Shuffles',
			aliases: ['rm']
		});
        
	}
    
	async run(msg) {
		
	}
}

module.exports = Remove;
