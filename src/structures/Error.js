class Error {
	static handle(errorType, ...args) {
		return this[errorType](...args);
	}

	static argument(arg, msg, sent) {
		sent = sent.match(/\s*(\S+)\s?/)?.[1], arg = arg[0].toUpperCase() + arg.slice(1);
		if (sent) msg.reply(`Could not extract argument \`${arg}\` from \`${sent}\`\n    Full usage: \`${msg.cmd.usage}\``);
		else if (!sent) msg.reply(`Could not extract required argument \`${arg}\`\n    Full usage: \`${msg.cmd.usage}\``);
    
		return false;
	}
} 

module.exports = Error;