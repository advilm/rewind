const Command = require('../../structures/Command.js');

class Exec extends Command {
	constructor() {
		super({
			name: 'exec',
			usage: '[Any]',
			aliases: ['ex'],
			description: 'Executes stuff.',
		});
	}

	run(msg) {    
		require('child_process').exec(msg.content, (err, stdout, stderr) => {
			const out = `\`\`\`prolog\n${(err || '') + stderr + stdout}\`\`\``;
			if (out.length <= 2000) msg.reply(out); 
			else msg.reply(out.substr(0, 1900) + '```');
			
		});
	}
}

module.exports = Exec;
