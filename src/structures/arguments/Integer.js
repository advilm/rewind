class Integer {
	constructor() {
		this.regex = /\s*(-?\d+|Infinity)\s*/;
	}
  
	parse(match) {
		const arg = Number(match?.[1]);
		return { arg, len: match?.[0].length};
	}
}

module.exports = Integer;
