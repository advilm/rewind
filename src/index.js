new (require('./structures/Extender.js'))();
new (require('./structures/Console.js'))();
const client = new (require('./structures/client/Client.js'))();

Map.prototype.add = function (key, value) {
	return this.set(key, (this.get(key) || 0) + value);
};

String.prototype.toProperCase = function () {
	return this.replace(/\b\S+/g, x => x[0].toUpperCase() + x.slice(1).toLowerCase());
};

Reflect.defineProperty(Array.prototype, 'shuffle', {
	value: function () {
		for (let i = this.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[this[i], this[j]] = [this[j], this[i]];
		}
		return this;
	}
});

Reflect.defineProperty(Array.prototype, 'last', {
	configurable: true,
	get: function last() {
		return this[this.length - 1];
	}
});

Reflect.defineProperty(String.prototype, 'toProperCase', {
	value: function () {
		return this.replace(/\w\S*/g, x => x[0].toUpperCase() + x.slice(1).toLowerCase());
	}
});

Reflect.defineProperty(Map.prototype, 'push', {
	value: function (key, value) {
		if (!this.has(key)) this.set(key, [value]);
		else this.get(key).push(value);

		return this;
	}
});

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/public', express.static(__dirname + '/public'));
app.use('/evals', express.static(`${process.cwd()}/evals`));

app.get('/', (req, res) => res.sendStatus(200));
app.get('/evals/:name', (req, res) => require('fs').existsSync(`evals/${req.params.name}.html`) ? res.sendFile(`${process.cwd()}/evals/${req.params.name}.html`) : res.sendStatus(404));

app.get('/queue/:serverid', (req, res) => {
	res.sendFile(`${__dirname}/views/queue.html`);
});

const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
	console.log(wss.clients.size, 'Connected');
	
	ws.on('close', function close() {
		console.log(wss.clients.size, 'Disconnected');
	});

	ws.on('message', function incoming(message) {
		console.log('Message received', message);
		const data = message.split(':');

		if (!client.players.has(data[1])) {
			return ws.send(JSON.stringify({ status: 'ok', event: 'queueEmpty', data: null }));
		}

		if (data[0] === 'connect') {
			const { queue, position, state, timestamp, paused, shuffle, loop } = client.players.get(data[1]);
			ws.send(JSON.stringify({ status: 'ok', event: 'queueUpdate', data: { queue, position, state, timestamp, paused, shuffle, loop } }));
			client.wsConnections.push(data[1], ws);
		}
	});
});


app.listen(3000, () => console.log('Listening on port 3000'));
