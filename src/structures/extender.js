const { Structures } = require('discord.js');
const fs = require('fs');

class Extender {
	constructor() {
		for (const struct of fs.readdirSync('src/structures/extensions')) Structures.extend(struct.slice(0, -3), require('./extensions/' + struct));
	}
}

module.exports = Extender;