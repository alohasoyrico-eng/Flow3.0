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
  for (const forbidden of ["block-size:", "min-block-size:", "min-height:", "padding:", "border-radius:"]) {
    if (root.body.includes(forbidden)) {
      add("errors", packageCssFile, lineNumber(text, root.index), `Copy Button must not own frame geometry (${forbidden}); it composes Button/IconButton.`);
    }
  }
}

module.exports = { checkCopyButtonCssContract };
