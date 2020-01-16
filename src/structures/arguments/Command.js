class Command {
	constructor() {
		this.regex = /\s*(\S+)\s*/;
	}

	parse(match) {
		const arg = this.client.handler.get(match?.[1]);  
		return { arg, len: match?.[0].length};
	}
}

module.exports = Command;
