require('@babel/register');

const Discord = require('discord.js');
const client = new Discord.Client();
new (require('./structures/Console.js'))();
client.parser = new (require('./structures/Parser.js'))(client);
client.error = new (require('./structures/Error.js'));
client.utils = new (require('./structures/Utils.js'))();
client.clans = new (require('./structures/Clans.js'))(client);
client.handler = new (require('./structures/Handler.js'))().load(client);

client.once('ready', () => {
	console.log(`Logged in as ${client.user.tag}`);
});

client.config = require('../config.json');
client.login(client.config.token);

Map.prototype.add = function (key, float) { 
	return this.set(key, (this.get(key) || 0) + float);
};

Map.prototype.deleteAll = function (name) {
	return Array.from(this).filter(x => x[0] !== name);
};

process.on('unhandledRejection', (reason) => console.error(reason.stack.split('\n')[0] + '\n', reason.stack.match(/\((C:\\Users\\.+?)\)/)[1])); 