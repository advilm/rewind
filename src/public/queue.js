const ws = new WebSocket('wss://rewind.advil.cf/ws');
ws.onopen = () => ws.send(`connect:${window.location.pathname.split('/').reverse()[0]}`);
ws.addEventListener('message', function (evt) {
	console.log(JSON.parse(evt.data))
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
	const li = document.createElement('li');
	li.appendChild(document.createTextNode(inputValue));

	document.getElementById('queue').appendChild(li);
}