new (require('./structures/extender.js'))();
new (require('./structures/console.js'))();

const req = require('@helperdiscord/centra');

const client = new (require('./structures/Client.js'))();

Reflect.defineProperty(Array.prototype, 'last', {
	configurable: true,
	get: function last() {
		return this[this.length - 1];
	}
});

Reflect.defineProperty(String.prototype, 'toProperCase', {
	value: function () {
		return this.replace(/\b\S*/g, x => x[0].toUpperCase() + x.slice(1).toLowerCase());
	}
});

Reflect.defineProperty(Map.prototype, 'push', {
	value: function (key, value) {
		if (!this.has(key)) this.set(key, [value]);
		else this.get(key).push(value);

		return this;
	}
});

const fastify = require('fastify')({ logger: true });

fastify.register(require('fastify-cors'), {
	origin: ['https://rewind.advil.cf', 'http://localhost:3000']
});

fastify.post('/auth', async (request, reply) => {
	const token = await req('https://discord.com/api/v8/oauth2/token', 'POST')
		.body(require('querystring').encode({
			'client_id': client.user.id,
			'client_secret': client.config.secret,
			'grant_type': 'authorization_code',
			'code': request.body.code,
			'redirect_uri': 'http://rewind.advil.cf/callback',
			'scope': 'identify guilds'
		}))
		.header({ 'Content-Type': 'application/x-www-form-urlencoded' })
		.json();

	const user = await req('https://discord.com/api/v8/users/@me', 'GET')
		.header({ 'Authorization': `Bearer ${token.access_token}` })
		.json();

	console.log(token, user);

	return { 
		access_token: token.access_token, 
		refresh_token: token.refresh_token, 
		userid: user.id 
	};
});

(async () => {
	try {
		await fastify.listen(3001);
	} catch (err) {
		fastify.log.error(err);
		process.exit(1);
	}
})();
