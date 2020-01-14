module.exports = Class => 
	class extends Class {
		constructor(...data) {
			super(...data);
		}

		async reply(content) {
			var m;
			(this.editedTimestamp && (m = this.channel.messages.get(this.client.messages.get(this.id))?.edit(content))) || this.client.messages.set(this.id, (m = await this.channel.send(content)).id).get(this.id);
			return m;
		}
	};