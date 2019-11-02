const Discord = require('discord.js');
const { walk } = require('walk');
const { resolve } = require('path');

const Parser = require('./Parser.js')

class Handler {
  constructor() {}

  load(client) {
    this.commands = new Discord.Collection();
    this.aliases = new Discord.Collection();
    this.client = client; 
  
    walk('./src/cmds/.').on('file', (root, stats, next) => {
      const Command = require(`${resolve(root)}/${stats.name}`);
      const command = new Command(); 
      command.client = this.client
      
      const types = {dev: 'Developer', misc: 'Miscellaneous'}
      command.type = types[root.split('/')[3]]
      
      command.aliases.map(c => this.aliases.set(c.toLowerCase(), command));
      this.commands.set(command.name.toLowerCase(), command);
      next();
    });

    walk('./src/events').on('file', (root, stats, next) => {
      const Event = require(`${resolve(root)}/${stats.name}`);
      this.client.on(stats.name.slice(0, -3), (...args) => Event.run(this.client, ...args));
      next();
    });

    return this
  }

  newMethod() {
    return './src/cmds';
  }

  get(cmd) {
    return this.commands.get(cmd.toLowerCase()) || this.aliases.get(cmd.toLowerCase());
  }

  run(msg) {
    try {
      const cmd = this.get(msg.content.slice(msg.prefix.length))
      if (!cmd) return
      new Parser(msg.content, cmd.usage)
      cmd.run(msg);
    } catch (e) {
      msg.channel.send(`An unexpected error has occured: \`${e.toString()}\``) && console.error(e);
    }
  }
}

module.exports = Handler;