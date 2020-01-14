const Command = require('../../structures/Command.js');

class Eval extends Command {
	constructor() {
		super({
			name: 'eval',
			usage: '[Any]',
			aliases: ['ev'],
			description: 'Evaluates JavaScript code.',
		});
	}

	run(msg) {    
		const ev = async (m) => {
			const { flags, content} = m.content !== msg.content && this.client.utils.parseFlags(m.content);
			m.content !== msg.content && (m.flags = flags) && (m.content = content);

			try {
				var code;
				if (m.flags.async || m.flags.a) code = `(async () => {\n${m.content}\n})()`;
				else code = m.content;
       

				var toEval = require('@babel/core').transform(code).code;

				const start = process.hrtime.bigint();
				var evaled = await eval(toEval);
				const end = process.hrtime.bigint();  
  
				if (m.flags.quiet || m.flags.q) return;
        
				var type = '**Type:**```js\n' + (typeof evaled)[0].toUpperCase() + (typeof evaled).substr(1) + '```';
        
				if (typeof evaled != 'string') evaled = require('util').inspect(evaled, false, parseInt(m.flags.depth) || 0);
				evaled = evaled.replace(/`/g, '`\u200b');
  
				var output = '**Output:**```js\n' + (evaled || 'No output.') + '```';
				var time = `⏱ Evaluation took ${Math.round((Number(end) - Number(start)) / 1000)} μs`;
  
				if (evaled.length <= 1900) {  
					var out = output.slice(11);
					if (m.flags.v || m.flags.verbose) out = `${output}\n${type}\n${time}`;
  
					await msg.reply(out);
				}
  
			} catch (err) {
				if (m.flags.async || m.flags.a) code = code.slice(24, -9);
				if (!(m.flags.quiet || m.flags.q)) await m.reply(`**Input:**\`\`\`js\n${code.replace(/`/g, '`\u200b')}\`\`\`**Error:**\`\`\`${err.toString().replace(/`/g, '`\u200b')}\`\`\``);
			}
		};
    
		if (!(msg.flags.s || msg.flags.session)) ev(msg);
		else {
			ev(msg);
			// msg.reply(new Discord.MessageEmbed().setColor(this.client.color).setDescription('Sessions started.'));
			// const coll = new Discord.MessageCollector(msg.channel, m => m.author.id === msg.author.id, {max: 100, maxProcessed: 100});
  
			// coll.on('collect', message => {
			// 	if (message.content.match(/^(end|stop|quit)$/)) msg.reply(new Discord.MessageEmbed().setDescription('Eval session ended.')) && coll.stop();
			// 	else ev(message);
			// });
		}
	}
}

module.exports = Eval;
