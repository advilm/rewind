class Error {
	constructor(client) {
		this.client = client;
	}
	handle(errorType, ...args) {
		return this[errorType](...args);
	}

	argument(arg, msg, sent) {
		sent = sent.match(/\s*(\S+)\s?/)?.[1], arg = arg[0].toUpperCase() + arg.slice(1);
		if (sent) msg.channel.send(`Could not extract argument \`${arg}\` from \`${sent}\`\n    Full usage: \`${msg.cmd.usage}\``);
		else if (!sent) msg.channel.send(`Could not find required argument \`${arg}\`\n    Full usage: \`${msg.cmd.usage}\``);
    
		return { arg: false };
	}
} 

module.exports = Error;