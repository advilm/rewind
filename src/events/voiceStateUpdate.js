exports.run = async (client, oldState, newState) => {
	if (newState.id === client.user.id && !newState.channel) {
		client.players.get(newState.guild.id)?.channel?.send('Disconnected.');
		client.manager.leave(newState.guild.id);
		client.players.delete(newState.guild.id);
	}
};