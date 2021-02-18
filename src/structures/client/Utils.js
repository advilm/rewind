const fs = require('fs');

class Utils {
	static parseFlags(str) {
		str = /^\s*(?:(?:-[a-z]+|--\w{2,}(?:=(?:(?:"(?:\\"|[^"])*"|'(?:\\'|[^'])*')|\S+))?)(?:\s+|$))+/.exec(str)?.[0];
		if (!str) return { flags: {}, len: {} };
		const len = str.length;

		const flags = {}; let value;

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

		return { flags, len };
	}

	static walk(dir) {
		var results = [];
		for (var file of fs.readdirSync(dir)) {
			file = `${dir}/${file}`;
			const stat = fs.statSync(file);
			if (stat && stat.isDirectory()) results = [...results, ...this.walk(file)];
			else results.push(file);
		}

		return results;
	}

	static userFlagsToEmoji(h) {
		const e = {
			DISCORD_EMPLOYEE: '<:discord_employee:705940105604366346>',
			DISCORD_PARTNER: '<:discord_partner:705940105562423406>',
			HYPESQUAD_EVENTS: '<:discord_hypesquad:705940105306570842>',
			BUGHUNTER_LEVEL_1: '<:discord_bug_hunter:705940105344581652>',
			HOUSE_BRAVERY: '<:discord_bravery:705940105164095518>',
			HOUSE_BRILLIANCE: '<:discord_brilliance:705940104858042450>',
			HOUSE_BALANCE: '<:discord_balance:705940105222815816>',
			EARLY_SUPPORTER: '<:discord_early_supporter:705940105142992948>',
			TEAM_USER: '',
			SYSTEM: '<:discord_system:705940105273016456>',
			BUGHUNTER_LEVEL_2: '<:discord_bug_hunter_2:705940105285599312>',
			VERIFIED_BOT: '<:verified_bot:706219507420495914>',
			VERIFIED_DEVELOPER: '<:discord_verified_developer:705940105575268453>'
		};

		const em = []; for (const k of h) em.push(e[k]);
		return em;
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

	static duration(ms) {
		let str = '';
		if (str || ms >= 3600000) (str += `${ms / 3600000 | 0}` + ':') && (ms -= (ms / 3600000 | 0) * 3600000);
		(str += (str ? `${ms / 60000 | 0}`.padStart(2, '0') : `${ms / 60000 | 0}`) + ':') && (ms -= (ms / 60000 | 0) * 60000);
		str += `${ms / 1000 | 0}`.padStart(2, '0');
		return str;
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