require('@babel/register');

const Discord = require('discord.js');
const client = new Discord.Client();

const Handler = require('./structures/Handler.js');
client.handler = new Handler().load(client);

const Utils = require('./structures/Utils.js');
client.utils = new Utils();

client.once('ready', () => console.log(`Logged in as ${client.user.tag}`));

client.config = require('./config.json');
client.login(client.config.token);