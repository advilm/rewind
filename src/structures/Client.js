class Client extends require('discord.js').Client {
	constructor() {
		super({ disableMentions: 'everyone', fetchAllMembers: true, intents: 641 });

		this.once('ready', () => {
			console.log(`Logged in as ${this.user.tag} with ${this.guilds.cache.size} guilds`);
		});

		this.login(process.env.token);
	}
}

module.exports = Client;