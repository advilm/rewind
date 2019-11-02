module.exports.run = async (client, user, userr) => {
  const Discord = require('discord.js')
  if (['134133271750639616'].includes(user.id)) return;
  if (userr.id === '417628702877155330' && user.displayAvatarURL() !== userr.displayAvatarURL()) client.channels.get('575763193582845952').send(new Discord.MessageAttachment(userr.displayAvatarURL({size:2048}))).then( m => client.channels.get('575761715275235328').send(new Discord.MessageEmbed().setColor(0x11082d).setImage(m.attachments.first().url)))
  if (user.displayAvatarURL() !== userr.displayAvatarURL()) client.channels.get('575763193582845952').send(new Discord.MessageAttachment(userr.displayAvatarURL({size:2048}))).then( m => client.channels.get('575761721965281280').send(new Discord.MessageEmbed().setColor(0x11082d).setImage(m.attachments.first().url).setFooter(`User ID: ${user.id}`)))
}
