class Client extends require('discord.js').Client {
	constructor() {
		super({ disableEveryone: true });

		this.load();
		
		this.once('ready', () => console.log(`Logged in as ${this.user.tag} with ${this.guilds.size} guilds`));
		this.login(this.config.token);
	}

	load() {
		this.messages = new Map();

		this.utils = require('./Utils.js');
		this.config = require('../../../config.json');

		this.handler = new (require('./Handler.js'))(this).load();	
	}
}

module.exports = Client;
