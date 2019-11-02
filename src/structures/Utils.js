class Utils {
  constructor() {}

  parseFlags(str) {
    var flags = {}, value;

    const withQuotes = /\s--(\w{2,})=("(\\"|[^"])*"|'(\\'|[^'])*')/gi;
    while ((value = withQuotes.exec(str))) flags[value[1]] = value[2]
        .replace(/\\["']/g, function(i) { return i.slice(1);})
        .slice(1, -1);
    str = str.replace(withQuotes, '');

    const withoutQuotes = /\s--(\w{2,})(?:=(\S+))?/gi;
    while ((value = withoutQuotes.exec(str))) flags[value[1]] = value[2] || true;
    str = str.replace(withoutQuotes, '');

    const shortReg = /\s-([a-z]+)/gi;
    while ((value = shortReg.exec(str))) for (value of value[1]) flags[value] = true;
    str = str.replace(shortReg, '');

    return { flags, content: str };
  }

  timeSince(ms) {
    if (ms >= 3.154e10) return `${(ms / 3.154e10).toFixed(2)} years`;
    else if (ms >= 2.628e9) return `${(ms / 2.628e9).toFixed(2)} months`;
    else if (ms >= 8.64e7) return `${(ms / 8.64e7).toFixed(2)} days`;
    else if (ms >= 3.6e6) return `${(ms / 3.6e6).toFixed(2)} hours`;
    else if (ms >= 60000) return `${(ms / 60000).toFixed(2)} minutes`;
    else if (ms >= 1000) return `${(ms / 1000).toFixed(2)} seconds`;
    else if (ms) return `${ms.toFixed(2)} milliseconds`;
  }

  // postCode(str, type, desc) {
  //   if (!str) return 'No text provided.';
  //   require('child_process').exec('mkdir ../src/public/evals')
  //   const key = this.createCode(6);
  //   require('fs').writeFileSync(`../src/public/evals/${key}.html`, require('../src/public/assets/html.js')(str, key, type, desc)
  //   );
  //   return `https://${process.env.PROJECT_DOMAIN}.glitch.me/evals/${key}.html`;
  // }

  createCode(length) {
    const chars = '0123456789AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz';
    var str = '';
    while (length--) str += chars[(Math.random() * chars.length) | 0];
    return str;
  }
}

module.exports = Utils;
