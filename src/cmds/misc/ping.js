const Command = require('../../structures/Command.js');

class Ping extends Command {
  constructor() {
    super({
      name: 'ping',
      aliases: ['p'],
      description: 'Pings.',
    });
  }

  async run(msg) {
    const m = await msg.channel.send('Pong.');
    m.edit(`Heartbeat: \`${Math.round(this.client.ws.ping)}\` ms | Roundtrip: \`${(m.editedTimestamp || m.createdTimestamp) -
        (msg.editedTimestamp || msg.createdTimestamp)}\` ms`);
  }
}

module.exports = Ping;
