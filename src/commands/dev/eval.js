const Command = require('../../structures/Command.js');
const Discord = require('discord.js');
const fs = require('fs');

class Eval extends Command {
	constructor() {
		super({
			usage: '[Flags]? [Any]',
			aliases: ['ev'],
			description: 'Evaluates JavaScript code.',
		});
	}

	async run(msg) {
		if (!msg.content) return;
		try {
			var code = msg.flags.a ? `(async () => {\n${msg.content}\n})()` : msg.content;

			const start = process.hrtime.bigint();
			var evaled = await eval(code);
			const end = process.hrtime.bigint();


			if (msg.flags.quiet || msg.flags.q) return;

			var type = '**Type:**```js\n' + this.getType(evaled, 2) + '```';

			if (typeof evaled != 'string') evaled = require('util').inspect(evaled, { depth: parseInt(msg.flags.depth) || 0, sorted: true });
			evaled = evaled.replace(/`/g, '`\u200b');

			const input = '**Input:**\n```js\n' + msg.content + '```';
			const output = '**Output:**```js\n' + (evaled || '\'\'') + '```';
			const time = `⏱ Evaluation took ${Math.round((Number(end) - Number(start)) / 1000)} μs`;

			var out = `${input}${output}${type}\n${time}`;
			if (out.length <= 2000) {
				if (!msg.flags.v) out = output;
				await msg.reply(out);
			} else {
				if (msg.flags.v || msg.flags.verbose) out = `${output.substring(0, 1500).split('\n').slice(0, -1).join('\n') + '```'}\n${type}\n${time}`;
				else out = evaled.includes('\n') ? output.substring(0, 1500).split('\n').slice(0, -1).join('\n') + '```' : output.slice(0, 1500) + '```';

				const key = this.client.utils.createCode(6);
				fs.writeFileSync(`evals/${key}.html`, this.client.utils.createAce(evaled));
				msg.reply({ content: out, embed: { description: `[Full Output](https://rewind.sucks-at.codes/evals/${key})` } });
			}

		} catch (err) {
			if (!(msg.flags.quiet || msg.flags.q)) await msg.reply(`**Input:**\`\`\`js\n${code.replace(/`/g, '`\u200b')}\`\`\`**Error:**\`\`\`${err.toString().replace(/`/g, '`\u200b')}\`\`\``);
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
