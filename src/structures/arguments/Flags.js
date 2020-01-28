class Flags {
	constructor() {
		this.regex = /^\s*(?:(?:-[a-z]+|--\w{2,}(?:=(?:(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|\S+))?)(?:\s+|$))+/;
	}
  
	parse(match) {
		const arg = match && this.client.utils.parseFlags(match?.[0]).flags;
		return { arg, len: match?.[0].length, remove: true};
	}
}

module.exports = Flags;
