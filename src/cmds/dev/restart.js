const Command = require('../../structures/Command.js');
const { walk } = require('walk');
const { resolve } = require('path');

class Restart extends Command {
  constructor() {
    super({
      name: 'restart',
      aliases: ['r'],
      description: 'Restarts.',
    });
  }
  async run(msg) {
    walk('../../cmds').on('file', (root, stats, next) => {
      delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
      next();
    });

    walk('../../events').on('file', (root, stats, next) => {
      delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
      next();
    });

    walk('../../structures').on('file', (root, stats, next) => {
      delete require.cache[require.resolve(`${resolve(root)}/${stats.name}`)];
      next();
    });

    delete this.client._events;

    const Handler = require('../../structures/Handler.js');
    this.client.handler = new Handler();
    this.client.handler.load(this.client);

    await msg.channel.send('Reloaded `a bunch of stuff`.');
  }
}

module.exports = Restart;
