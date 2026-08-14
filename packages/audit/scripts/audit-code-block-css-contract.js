const { add, lineNumber } = require("./audit-context.js");

function checkCodeBlockCssContract({ text, blocks, packageCssFile }) {
  const root = blocks.find((block) => block.selector === ".code-block");
  if (!root) {
    add("errors", packageCssFile, 1, "Code Block CSS must define .code-block.");
    return;
  }
  for (const required of [
    "--comp-code-block-bg",
    "--comp-code-block-border",
    "--comp-code-block-padding",
    ".code-block__header",
    ".code-block__meta",
    ".code-block__pre",
    ".code-block[data-density=\"sm\"]",
    ".code-block[data-density=\"lg\"]",
    ".code-block[data-state=\"error\"]",
    ".code-block[data-wrap=\"true\"] .code-block__pre code",
  ]) {
    if (!text.includes(required)) {
      add("errors", packageCssFile, lineNumber(text, root.index), `Code Block CSS missing ${required}.`);
    }
  }
}

module.exports = { checkCodeBlockCssContract };
