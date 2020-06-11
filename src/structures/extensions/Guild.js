module.exports = Class =>
	class extends Class {
		constructor(...data) {
			super(...data);
		}

		get player() {
			return this.client.players.get(this.id);
		}
	};