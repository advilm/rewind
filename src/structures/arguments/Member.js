class Member {
	constructor() {
		this.regex = /\s*(?:<@)?(\d{17,19}|\S+)>?\s?/;
	}
  
	parse(match, msg) {
		if (match) var arg = match && msg.guild.members.get(match[1]) || msg.guild.members.find(m => m.displayName.includes(match[1]) || m.user.tag.includes(match[1]));  
		return { arg, len: match?.[0].length};
	}
}
  
module.exports = Member;
  