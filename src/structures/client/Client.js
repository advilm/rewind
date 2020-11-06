const { Manager } = require('../Manager.js');
const { createConnection } = require('typeorm');
const  { EntitySchema } = require('typeorm');
const Redis = require('ioredis');
require('reflect-metadata');

class Client extends require('discord.js').Client {
	constructor() {
		super({ disableMentions: 'everyone', fetchAllMembers: true });
		this.sleep = require('util').promisify(setTimeout);

		this.load();

		this.config = require('../../../config.json');
		this.login(this.config.token);

		this.players = new Map();
		this.wsConnections = new Map();

		this.once('ready', () => {
			console.log(`Logged in as ${this.user.tag} with ${this.guilds.cache.size} guilds`);
			
			this.manager = new Manager(this, this.config.lavalink.nodes, {
				user: this.user.id,
				shards: 1,
				Player: require('../Player.js'),
			});

			this.manager.connect();
		});

		this.loadConnections();
	}

	async load() {
		this.messages = new Map();
		this.utils = require('./Utils.js');
		this.handler = new (require('./Handler.js'))(this).load();

		// this.db = new (require('sequelize'))('postgres://advil:9046@localhost:5432/rewind', {logging: false});
		// await this.db.authenticate();
		// for (const model of fs.readdirSync('src/models')) this.db.define(model.slice(0, -3), require(`../../Models/${model}`));
		// await this.db.sync();
	}
	
	async loadConnections() {
		//const connection = await createConnection({
		//	type: 'postgres',
		//	url: this.config.postgresql,
		//	synchronize: true,
		//	entities: [
		//		new EntitySchema(require('../../entities/User.js')),
		//		new EntitySchema(require('../../entities/Guild.js'))
		//	]
		//});

		//this.pg = {
		//	user: connection.getRepository('User'),
		//	guild: connection.getRepository('Guild')
		//};

		//this.redis = new Redis(this.config.redis.ip, this.config.redis.db);

		//this.bl = new Set((await this.pg.user.find({ where: { blacklisted: true }, select: [ 'id' ] })).map(x => x.id));
	}
}

module.exports = Client;
