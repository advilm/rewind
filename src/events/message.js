exports.run = async (client, msg) => {
	if (msg.author.bot) return;

	if (new RegExp(`^<@!?${client.user.id}>($|\\s*prefix)`).test(msg.content)) return msg.channel.send('My prefix is `re.`');
  
	if ((msg.prefix = msg.content.match(/^(re+|rewind)\./i)?.[0])) await client.handler.run(msg);
};
