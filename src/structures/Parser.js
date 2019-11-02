class Parser {
  constructor(content, usage) {
    console.log(usage)
    if (!usage) return;
    this.content = content;
    this.usage = usage;
    const test = this.parseUsage(usage)
  }

  parseUsage() {
    console.log(this.usage)
  }
}

module.exports = Parser;
