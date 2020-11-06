class Console {
    constructor() {
        const t = () => {
            return new Date().toLocaleString().split(', ');
        };

        this.blue = ['#82aaff', '3F51B5', '#89ddff'];
        this.red = ['#ff0033', '#ff0000', '#bb0000'];

        const log = console.log;
        console.log = (color, ...args) => {
            if (!this[typeof color === 'string' ? color : require('util').inspect(color)]) { args = [color, ...args]; (color = 'blue'); }

            const time = require('chalk')`{bold.hex('${this[color][0]}') [{underline ${t()[0]}} - {underline ${t()[1]}}]} {hex('${this[color][1]}') |}`;

            const content = [time, ...args].map(i => typeof i === 'string' ? require('chalk').hex(this[color][2])(i.replace(/\n/g, `\n${time} `)) : require('util').inspect(i, false, 2, true)
                .replace(/\n/g, `\n${time} `));

            log.apply(console, content);
        };


        const error = console.error;
        console.error = (...args) => {
            const time = require('chalk')`{bold.hex('${this.red[0]}') [{underline ${t()[0]}} - {underline ${t()[1]}}]} {hex('${this.red[1]}') |}`;

            const content = [time, ...args].map(i => typeof i === 'string' ? require('chalk').hex(this.red[0])(i.replace(/\n/g, `\n${time} `)) : require('util').inspect(i, false, 2, { number: 'red' })
                .replace(/\n/g, `\n${time} `));

            error.apply(console, content);
        };
    }
}

module.exports = Console;