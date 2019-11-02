const Discord = require('discord.js');
const client = new Discord.Client();

const Handler = require('./structures/Handler.js');
client.handler = new Handler().load(client);

const Utils = require('./structures/Utils.js');
client.utils = new Utils();

client.config = require('./config.json');

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.login(client.config.token);

const express = require('express');
const app = express();
app.get('/', (req, res) => res.sendStatus(200));
app.listen(3000);