module.exports = async (client, guild) => {
	(await client.db.models.Guild.findOne({ where: { _id: guild.id } })).destroy();
	await client.db.models.Guild.sync();
};