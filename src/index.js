require('@babel/register');

new (require('./structures/Extender.js'))();
new (require('./structures/Console.js'))();
new (require('./structures/Client/Client.js'))();

process.on('unhandledRejection', (reason) => console.error(reason.stack.split('\n')[0] + '\n ', reason.stack.match(/\((C:\\Users\\.+?)\)/)[1]));

Map.prototype.add = function(key, value) {
	return this.set(key, (this.get(key) || 0) + value);
};

String.prototype.toProperCase = function() {
	return this.replace(/\b\S+/g, x => x[0].toUpperCase() + x.slice(1).toLowerCase());
};

const express = require('express');
const app = express();

app.use('/evals', express.static(`${process.cwd()}/evals`));

app.get('/', (req, res) => res.sendStatus(200));
app.get('/evals/:name', (req, res) => require('fs').existsSync(`evals/${req.params.name}.html`) ? res.sendFile(`${process.cwd()}/evals/${req.params.name}.html`): res.sendStatus(404));

app.listen(3000, () => console.log('Listening on port 3000'));