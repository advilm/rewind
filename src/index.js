new (require('./structures/Extender.js'))();
new (require('./structures/Console.js'))();
new (require('./structures/client/Client.js'))();

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