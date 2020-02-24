const Command = require('../../structures/Command.js');
const Discord = require('discord.js');

class Eval extends Command {
	constructor() {
		super({
			usage: '[Flags]? [Any]',
			aliases: ['ev'],
			description: 'Evaluates JavaScript code.',
		});
	}

	async run(msg) {
		const ev = async (m) => {
			m.cmd = this;
			this.client.handler.parser.parse(m);

			m.content = m.args ? m.args.content : m.content;
			try {
				var code = msg.flags.a ? `(async () => {\n${m.content}\n})()` : m.content;


				var toEval = require('@babel/core').transform(code).code;

				const start = process.hrtime.bigint();
				var evaled = await eval(toEval);
				const end = process.hrtime.bigint();

				if (m.flags.quiet || m.flags.q) return;

				var type = '**Type:**```js\n' + this.getType(evaled, 2) + '```';

				if (typeof evaled != 'string') evaled = require('util').inspect(evaled, { depth: parseInt(m.flags.depth) || 0, sorted: true });
				evaled = evaled.replace(/`/g, '`\u200b');

				const input = '**Input:**\n```js\n' + msg.content + '```';
				const output = '**Output:**```js\n' + (evaled || '\'\'') + '```';
				const time = `⏱ Evaluation took ${Math.round((Number(end) - Number(start)) / 1000)} μs`;

				var out = `${input}${output}${type}\n${time}`;
				if (out.length <= 2000) {
					if (!m.flags.v) out = output;
					await msg.reply(out);
				} else {
					const post = await (await require('node-fetch')('https://evals.lunasrv.com/api/rewind/evals/create',
						{ method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: evaled }) })).json();

					if (m.flags.v || m.flags.verbose) out = `${output.substring(0, 1500).split('\n').slice(0, -1).join('\n') + '```'}\n${type}\n${time}`;
					else out = evaled.includes('\n') ? output.substring(0, 1500).split('\n').slice(0, -1).join('\n') + '```' : output.slice(0, 1500) + '```';

					msg.reply({ content: out, embed: new Discord.MessageEmbed().setDescription(`[Full Output](${post ? post.url : `http://localhost:3000/evals/${post.url}`})`) });
				}

			} catch (err) {
				if (!(m.flags.quiet || m.flags.q)) await m.reply(`**Input:**\`\`\`js\n${code.replace(/`/g, '`\u200b')}\`\`\`**Error:**\`\`\`${err.toString().replace(/`/g, '`\u200b')}\`\`\``);
			}
		};

		if (!(msg.flags.s || msg.flags.session)) ev(msg);
		else {
			ev(msg);
			msg.reply(new Discord.MessageEmbed().setColor(this.client.color).setDescription('Sessions started.'));
			const coll = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, { max: 100, maxProcessed: 100 });

			coll.on('collect', message => {
				if (message.content.match(/^(end|stop|quit)$/)) msg.reply(new Discord.MessageEmbed().setDescription('Eval session ended.')) && coll.stop();
				else ev(message);
			});
		}
	}

	getType(item, depth) {
		if (item === undefined || item === null) return '' + item;
		const name = item.constructor?.name || 'None';
		if (depth !== 0 && name === 'Array' && item.length) item = `<${[...new Set(item.map(x => this.getType(x, depth - 1)).sort())].join(' | ')}>`;
		else if (depth !== 0 && name === 'Object' && Object.keys(item).length) item = `<${[...new Set(Object.values(item).map(x => this.getType(x, depth - 1)).sort())].join(' | ')}>`;
		else return name || 'Anonymous';
		return name + item.replace(/([a-z]+)(?:<[a-z |]*>)?(?: \| \1<[a-z |]*>)+/gi,
			x => `${x.match(/^[a-z]+/i)[0]}<${[...new Set(x.match(/[a-z |]+(?=>)/gi).map(x => x.split(' | ')).flat())].join(' | ')}>`);
	}
}

module.exports = Eval;
