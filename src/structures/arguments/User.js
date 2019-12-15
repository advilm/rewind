class User {
	constructor() {
		this.regex = /\s*(?:<@!?)?(\d{17,19}|\S+)>?\s?/;
	}

	parse(match, msg) {
		if (match) var arg = this.client.users.get(match[1]) || msg.guild.members.find(m => (m.nickname && m.nickname.includes(match[1])) || m.user.tag.includes(match?.[1]))?.user;
		return { arg, len: match?.[0].length};
	}
}

module.exports = User;
