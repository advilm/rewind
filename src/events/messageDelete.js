exports.run = async (client, msg) => client.messages.get(msg.id) && msg.channel.messages.cache.get(client.messages.get(msg.id))?.delete() && client.messages.delete(msg.id);
