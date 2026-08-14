const { add, lineNumber } = require("./audit-context.js");

function checkCopyButtonCssContract({ text, blocks, packageCssFile }) {
  const root = blocks.find((block) => block.selector === ".copy-button");
  if (!root) {
    add("errors", packageCssFile, 1, "Copy Button CSS must define .copy-button.");
    return;
  }
  for (const required of [
    "--comp-copy-button-feedback-gap",
    ".copy-button[data-copy-feedback=\"copied\"]",
    ".copy-button[data-copy-feedback=\"error\"]",
  ]) {
    if (!text.includes(required)) {
      add("errors", packageCssFile, lineNumber(text, root.index), `Copy Button CSS missing ${required}.`);
    }
  }
}

module.exports = { checkCopyButtonCssContract };
