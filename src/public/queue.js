const ws = new WebSocket('wss://ws.lmao-xd.wtf');
ws.onopen = () => ws.send(`connect:${window.location.pathname.split('/').reverse()[0]}`);
ws.addEventListener('message', function (evt) {
	const { event, data, status } = JSON.parse(evt.data);
	if (status === 'error') return;
	if (event === 'queueUpdate') {
		if (data) {
			document.getElementById('queue').innerHTML = '';
			for (const item of data.queue) newElement(item.info.title);
		}
	} else if (event === 'newSong') newElement(data.info.title);
});

function newElement(inputValue) {
	var li = document.createElement('li');
	var t = document.createTextNode(inputValue);
	li.appendChild(t);

	document.getElementById('queue').appendChild(li);
}