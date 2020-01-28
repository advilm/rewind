const Command = require('../../structures/Command.js');
const Discord = require('discord.js');
class Exec extends Command {
	constructor() {
		super({
			usage: '[Any]',
			aliases: ['ex'],
			description: 'Executes stuff.',
		});
	}

	async run(msg) {    
		require('child_process').exec(msg.content, async (err, stdout, stderr) => {
			const out = `\`\`\`prolog\n${(err || '') + stderr + stdout}\`\`\``;
			if (out.length <= 2000) msg.reply(out); 
			else {
				msg.reply(out.substr(0, 1900) + '```', new Discord.MessageEmbed().setDescription(`[Full Output](${
					(await (await require('node-fetch')('https://evals.lunasrv.com/api/rewind/evals/create', 
						{ method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({code: (err || '') + stderr + stdout}) })).json()).url})`));
			}
		});
	}
}

module.exports = Exec;
