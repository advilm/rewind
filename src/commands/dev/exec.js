const Command = require('../../structures/Command.js');
const Discord = require('discord.js');
const {exec} = require('child_process');
const fetch = require('node-fetch');

class Exec extends Command {
	constructor() {
		super({
			usage: '[Any]',
			aliases: ['ex'],
			description: 'Executes stuff.',
		});
	}

	async run(msg) {
		exec(msg.content, async (err, stdout, stderr) => {
			if(!msg.content) return;
			const out = '\`\`\`prolog\n' + `${(err || '') + stderr + stdout}`.replace(/```/g, '`\u200b`\u200b`') + '\`\`\`';
			if (out.length < 1900) {
				msg.reply(out);
			} else {
				msg.reply({
					content: out.substr(0, 1900) + '```',
					embed: new Discord.MessageEmbed()
					.setDescription(`[Full Output](${(await (await fetch('https://evals.lunasrv.com/api/rewind/evals/create', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							code: (err || '') + stderr + stdout
						})
					}))
					.json())
					.url})`)
				});
			}
		});
	}
}

module.exports = Exec;
