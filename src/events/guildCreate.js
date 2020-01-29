module.exports = async (client, guild) => {
	await client.db.models.Guild.create({ _id: guild.id});
	await client.db.models.Guild.sync();
};