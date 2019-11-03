class Parser {
  constructor(content, usage) {
    if (!usage) return;
    this.content = content;
    this.usage = usage;
    this.parseUsage(usage);
  }

  parseUsage() {
    console.log(this.usage);
  }
}

module.exports = Parser;
