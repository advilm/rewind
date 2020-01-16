class Any {
	constructor() {
		this.regex = /\s*(\S+)\s*/;
	}
  
	parse(match) {
		const arg = match?.[1];
		return { arg, len: match?.[0].length};
	}
}

module.exports = Any;
