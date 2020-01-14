require('@babel/register');

new (require('./structures/Extender.js'))();
new (require('./structures/Console.js'))();
new (require('./structures/Client/Client.js'))();

process.on('unhandledRejection', (reason) => console.error(reason.stack.split('\n')[0] + '\n ', reason.stack.match(/\((C:\\Users\\.+?)\)/)[1]));

Map.prototype.add = function(key, value) {
	return this.set(key, (this.get(key) || 0) + value);
};