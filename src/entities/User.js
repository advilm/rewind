module.exports = {
	name: 'User',
	columns: {
		id: {
			primary: true,
			type: 'text',
		},
		queues: {
			type: 'simple-json',
			default: {}
		},
		blacklisted: {
			type: 'boolean',
			default: false
		}
	},
};