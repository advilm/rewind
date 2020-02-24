module.exports = Class =>
	class extends Class {
		constructor(...data) {
			super(...data);
		}

		async reply(opts) {
			const message = this.channel.messages.cache.get(this.client.messages.get(this.id));

			if (!this.editedTimestamp || !message) {
				const sent = await this.channel.send(opts);
				this.client.messages.set(this.id, sent.id);
				return sent;
			} else return typeof opts !== 'object' ? message.edit(opts, { embed: null })
				: message.edit({ content: opts.content || null, embed: opts.embed || null });
		}
	};