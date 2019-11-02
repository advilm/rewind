exports.run = async (client, msg) => {
  if (msg.author.bot) return;
  msg.prefix = msg.content.match(/^re+\./i);
  msg.prefix = msg.prefix && msg.prefix[0];
  msg.prefix && client.handler.run(msg);
};
