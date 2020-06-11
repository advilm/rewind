class Manager extends require('@lavacord/discord.js').Manager {
	constructor(...args) {
		super(...args);
	}

	async join(data, opts) {
		return super.join(data, opts);
	}
}

module.exports = { Manager };