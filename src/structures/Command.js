class Command {
	constructor(options) {
		this.name = options.name || '';
		this.usage = options.usage || '';
		this.aliases = options.aliases || [];
		this.description = options.description || 'No description specified.';
	}
}

module.exports = Command;
