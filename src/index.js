require('@babel/register');

new (require('./structures/Console.js'))();
new (require('./structures/Client.js'))();

process.on('unhandledRejection', (reason) => console.error(reason.stack.split('\n')[0] + '\n ', reason.stack.match(/\((C:\\Users\\.+?)\)/)[1])); 