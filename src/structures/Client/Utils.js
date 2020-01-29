class Utils {
	static parseFlags(str) {
		const flags = {}; let
			value;

		const withQuotes = /--(\w{2,})=("(\\"|[^"])*"|'(\\'|[^'])*')/gi;
		while ((value = withQuotes.exec(str))) {
			flags[value[1]] = value[2]
				.replace(/\\["']/g, (i) => i.slice(1))
				.slice(1, -1);
		}
		str = str.replace(withQuotes, '');

		const withoutQuotes = /--(\w{2,})(?:=(\S+))?/gi;
		while ((value = withoutQuotes.exec(str))) flags[value[1]] = value[2] || true;
		str = str.replace(withoutQuotes, '');

		const shortReg = /-([a-z]+)/gi;
		while ((value = shortReg.exec(str))) for (value of value[1]) flags[value] = true;
		str = str.replace(shortReg, '');

		return { flags, content: str };
	}

	static parseMS(ms, depth) {
		depth === undefined && (depth = 2);
		var x;
		if (!ms) return 0;
		else if (ms >= 3.154e10) x = `${(ms / 3.154e10).toFixed(depth)} years`;
		else if (ms >= 2.628e9) x = `${(ms / 2.628e9).toFixed(depth)} months`;
		else if (ms >= 8.64e7) x = `${(ms / 8.64e7).toFixed(depth)} days`;
		else if (ms >= 3.6e6) x = `${(ms / 3.6e6).toFixed(depth)} hours`;
		else if (ms >= 60000) x = `${(ms / 60000).toFixed(depth)} minutes`;
		else if (ms >= 1000) x = `${(ms / 1000).toFixed(depth)} seconds`;
		else if (ms) x = `${ms.toFixed(depth)} milliseconds`;
		if (depth === 0 && x.match(/\d+/)[0] === '1') return x.slice(0, -1);
		else return x;
	}

	// postCode(str, type, desc) {
	//   if (!str) return 'No text provided.';
	//   require('child_process').exec('mkdir ../src/public/evals')
	//   const key = this.createCode(6);
	//   require('fs').writeFileSync(`../src/public/evals/${key}.html`, require('../src/public/assets/html.js')(str, key, type, desc)
	//   );
	//   return `https://${process.env.PROJECT_DOMAIN}.glitch.me/evals/${key}.html`;
	// }

	static createCode(length) {
		const chars = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
		let str = '';
		while (length--) str += chars[(Math.random() * chars.length) | 0];
		return str;
	}

	static escapeRegEx(string) {
		return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
	}

	static createAce(code) {
		return `    <!DOCTYPE html>
    <html lang="en">
    <head>
    <title>Eval</title>
    <style type="text/css" media="screen">
        #editor { 
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
        }
    </style>
    </head>
    <body>

    <div id="editor">${code}</div>
    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.7/ace.js" type="text/javascript" charset="utf-8"></script>
    <script>
    var editor = ace.edit("editor");

    editor.setOptions({
        mode: "ace/mode/javascript",
        theme: "ace/theme/dracula",
        useWorker: false,
        readOnly: true,
    showPrintMargin: false,
        highlightActiveLine: false,
        hScrollBarAlwaysVisible: false,
        vScrollBarAlwaysVisible: false,
        scrollPastEnd: .025,
        highlightGutterLine: false
    });

    editor.focus(); 
    editor.gotoLine(Infinity);
    </script>
</body>
</html>`;
	}
}

module.exports = Utils;