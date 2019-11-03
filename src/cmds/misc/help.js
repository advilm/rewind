const Discord = require('discord.js');
const Command = require('../../structures/Command.js');

class Help extends Command {
  constructor() {
    super({
      name: 'help',
      aliases: ['h'],
      usage: '[Command]?',
      description: 'List of commands w/ descriptions.',
    });
  }

  async run(msg) {
    const embed = new Discord.MessageEmbed();
    msg.channel.send(embed);
  }
}

module.exports = Help;
