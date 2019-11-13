exports.run = async (client, msg) => {
  msg.author.bot ||
    (new RegExp(`^<@!?${client.user.id}>($|\\s*prefix)`).test(msg.content) ? msg.channel.send('My prefix is `re.`')
      : (msg.prefix = msg.content.match(/^(re+|rewind)\./i)?.[0]) && client.handler.run(msg));
};
