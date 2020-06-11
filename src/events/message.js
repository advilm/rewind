exports.run = async (client, msg) => {
	if (msg.author.bot || !msg.guild) return;

	if (new RegExp(`^<@!?${client.user.id}>\\s*(?:prefix)?$`).test(msg.content)) return msg.reply('My prefix is `re.`');

	// const prefix = (await client.db.models.Guild.findOne({ where: {_id: msg.guild.id}}))?.prefix;
	// if ((msg.prefix = new RegExp(`^(?:(?:re+|rewind)\\.)\\s*`, 'i').exec(msg.content)?.[0])) client.handler.run(msg);

	if ((msg.prefix = /^(?:re+|rewind)\.\s*/i.exec(msg.content)?.[0])) client.handler.run(msg);

};
