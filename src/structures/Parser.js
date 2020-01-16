const { walk } = require('walk');

class Parser {
	constructor(client) {
		this.args = {};
		walk('./src/structures/arguments').on('file', (root, stats, next) => {
			this.args[stats.name.slice(0, -3).toLowerCase()] = new (require('./arguments/' + stats.name))();
			this.args[stats.name.slice(0, -3).toLowerCase()].client = client;
			next();
		});
	}

	parse(msg) {
		if (!msg.cmd.usage) return;
		var out = [], value;
		const regex = /\[((?:\w)*)\](\S*)/g;
		while ((value = regex.exec(msg.cmd.usage)) !== null) out.push([value[1].toLowerCase(), value[2]]);
    
		var args = { content: '' }, content = msg.content;

		for (const item of out) {
			args[item[0]] || (args[item[0]] = []);

			const match = this.args[item[0]].regex.exec(content);
			var { arg, len, remove } = this.args[item[0]].parse(match, msg);
			
			if (!remove) args.content += match?.[0] || '';
			
			if (!arg && !/[*?]/.test(item[1])) return require('./Error.js').handle('argument', item[0], msg, content);

			if (!(!arg && item[1].includes('?'))) content = content.slice(len);

			args[item[0]].push(arg);
		}
		
		args.content += content;

		return args;
	}
}

module.exports = Parser;
