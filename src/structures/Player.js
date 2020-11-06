const linkRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

class Player extends require('@lavacord/discord.js').Player {
	constructor(...args) {
		super(...args);
                
		this.queue = [];
		this.loop = null;
		this.shuffle = false;
		this.position = 0;
		this.channel = null;

		this.on('end', async data => {
			console.log(data);
			if (data.reason === 'REPLACED') return;
			if (data.reason === 'LOAD_FAILED') {
				await this.node.manager.switch(this, this.node.manager.client.manager.nodes.get('fallback'));
				return this.play(this.queue[this.position].track);
			}

			if (this.queue.length === 1 && !this.loop) {
				this.node.manager.leave(this.id);
				this.node.manager.client.players.delete(this.channel.guild.id);
				return this.channel?.send('Queue has concluded.');
			}

			this.queue[this.position].volume && this.volume(this.state.volume - this.queue[this.position].volume); 			

			!this.loop && this.queue.splice(this.position, 1); 

			if (this.loop !== 'single') {
				if ((!this.loop ? this.position : this.position + 1) >= this.queue.length) {
					this.position = 0;
					this.loop === 'queue' && this.shuffle && this.queue.shuffle(); 
				} else this.loop === 'queue' && this.position++;
			}

			this.play(this.queue[this.position].track);

			this.queue[this.position].volume && this.volume(this.state.volume + this.queue[this.position].volume); 
			this.channel?.send(`Playing **${this.queue[this.position].info.title}**`);

			this.node.manager.client.wsConnections.get(this.id).forEach(ws => {
				const { queue, position, state, timestamp, paused, shuffle, loop } = this;
				ws.send(JSON.stringify({ status: 'ok', event: 'queueUpdate', data: { queue, position, state, timestamp, paused, shuffle, loop } }));
			});
		});
	}

	play(search) {
		
	}

	move(start, end) {
		if (start === this.position) this.position = end;
		else if (end <= this.position) this.position++;
		
		this.queue.splice(end, 0, ...this.queue.splice(start, 1));
	}
}

module.exports = Player;