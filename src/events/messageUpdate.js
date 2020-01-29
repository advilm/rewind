exports.run = async (client, m, msg) => {
	if (msg.author.bot || !msg.guild) return;

	if (new RegExp(`^<@!?${client.user.id}>($|\\s*prefix)`).test(msg.content)) return msg.channel.send('My prefix is `re.`');
  
	if ((msg.prefix = /^(?:re+|rewind)\.\s*/i.exec(msg.content)?.[0])) client.handler.run(msg);
};
