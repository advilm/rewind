const { walk } = require('walk');
const { resolve } = require('path');
const Command = require('../../structures/Command.js');

class Restart extends Command {
  constructor() {
    super({
      name: 'restart',
      aliases: ['r'],
      description: 'Restarts.',
    });
  }

  async run(msg) {
    walk('./src/commands').on('file', (root, stats, next) => {
      delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
      next();
    });

    walk('./src/events').on('file', (root, stats, next) => {
      delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
      next();
    });

    walk('./src/structures').on('file', (root, stats, next) => {
      delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
      next();
    });

    delete this.client._events;
    delete this.client.handler;

    const Handler = require('../../structures/Handler.js');
    this.client.handler = new Handler().load(this.client);

    await msg.channel.send('Reloaded `a bunch of stuff`.');
  }
}

module.exports = Restart;
