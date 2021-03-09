class Client extends require('discord.js').Client {
	constructor() {
		super({ disableMentions: 'everyone', fetchAllMembers: true, intents: 641 });

		this.once('ready', () => {
			console.log(`Logged in as ${this.user.tag} with ${this.guilds.cache.size} guilds`);
		});

<<<<<<< HEAD
		this.login(process.env.token);
=======
		this.config = require('../../config.json');
		this.login(this.config.token);
>>>>>>> parent of 56706d0 (testing somth)
	}
}

module.exports = Client;