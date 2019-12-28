class Rewind extends require('discord.js').Client {
	constructor() {
		super({disableEveryone: true});

		this.load();
		
		this.once('ready', () => console.log(`Logged in as ${this.user.tag} with ${this.guilds.size} guilds`));
		this.login(this.config.token);
	}

	load() {
		this.utils = require('./Utils.js');
		this.error = require('./Error.js');
		this.config = require('../../config.json');

		this.parser = new (require('./Parser.js'))(this);
		this.handler = new (require('./Handler.js'))().load(this);
	}
}

module.exports = Rewind;
