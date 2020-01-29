const fs = require('fs');

class Client extends require('discord.js').Client {
	constructor() {
		super({ disableEveryone: true });
		this.sleep = require('util').promisify(setTimeout);
		
		this.load();
		this.loadTesseract();
		
		this.once('ready', () => console.log(`Logged in as ${this.user.tag} with ${this.guilds.size} guilds`));
		this.login(this.config.token);
	}

	async load() {
		this.messages = new Map();
		this.utils = require('./Utils.js');
		this.config = require('../../../config.json');
		this.handler = new (require('./Handler.js'))(this).load();
		
		this.db = new (require('sequelize'))('postgres://advil:9046@localhost:5432/rewind', {logging: false});
		await this.db.authenticate();
		for (const model of fs.readdirSync('src/models')) this.db.define(model.slice(0, -3), require(`../../Models/${model}`));
		await this.db.sync();
		
		this.browser = await require('puppeteer').launch();
	}

	async loadTesseract() {
		this.worker = require('tesseract.js').createWorker();
		await this.worker.load();
		await this.worker.loadLanguage('english');
		await this.worker.initialize('english');
		await this.worker.setParameters({
			'tessedit_ocr_engine_mode': 'OEM_LSTM_ONLY',
			'tessjs_create_hocr': '0',
			'tessjs_create_tsv': '0'
		});
	}
}

module.exports = Client;