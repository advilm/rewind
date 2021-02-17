const Command = require('../../structures/Command.js');
const Discord = require('discord.js');

class Userinfo extends Command {
	constructor() {
		super({
			aliases: ['ui'],
			description: 'Userinfo.'
		});

		this.channels = new Map();
	}

	async run(msg) {
		const user = msg.mentions.users.first() || (msg.content && await this.client.users.fetch(msg.content)) || msg.author;
		const member = await msg.guild.members.fetch(user);

		if (!user) return msg.reply('User not found.');

		let maybe = new Discord.MessageEmbed();
  
		// const staus = { 
		// 	online: 'Online',
		// 	idle: 'Idle',
		// 	dnd: 'Do not disturb',
		// 	offline: 'Invisible' 
		// };

		const createdAt = this.client.utils.parseMS(Date.now() - user.createdTimestamp);
		let nick = member?.nickname ? `(${member.nickname}) `: '';
		const activity = user.presence.activities[0];

		maybe.setTitle(`${user.tag}${user.bot ? ' <:bot:706220088490983485>': ''} ${nick}${this.client.utils.userFlagsToEmoji(user.flags.toArray()).join('')}`);
		maybe.setDescription(activity ? `${activity.type.replace('_', ' ').toProperCase()}: ${activity.type === 'CUSTOM_STATUS' ? activity.state: activity.name}` : '');
		maybe.addField('Created At', `${user.createdAt.toLocaleString()}\n (${createdAt} ago)`, true);
		maybe.setFooter(`User ID: ${user.id} | Requested by ${msg.author.tag}`);
		maybe.setThumbnail(user.displayAvatarURL({ size: 2048, dynamic: true }));
  
		if (member) {
			const joinedAt = this.client.utils.parseMS(Date.now() - member.joinedTimestamp);
    
			maybe.addField('Joined At', `${member.joinedAt.toLocaleString()}\n (${joinedAt} ago)`, true);
		
			const roles = member.roles.cache.array().slice(0, -1).sort((a, b) => b.position - a.position).slice(0, 5).join(' ║ ');
			
			const roleSize = member.roles.cache.size - 1;
			const roleamount = roleSize < 5 ? roleSize : 5;
			const toproles = `Role${roleSize === 1 ? '' : 's'}`;
    
			maybe.addField(`\\⬇ Top ${roleamount} ${toproles} | Total Amount: ${roleSize} | Display Color: ${member.displayHexColor}`, roles || 'No Roles', false);
		}
  
		member && maybe.setColor(member.displayColor);
  
		msg.reply({ embed: maybe });
	}
}

module.exports = Userinfo;
