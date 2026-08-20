const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

function checkCopyButtonCssContract({ text, blocks, packageCssFile, root: sourceRoot = process.cwd() }) {
  const tsxSourceFile = path.join(sourceRoot, "packages/react/src/CopyButton.tsx");
  const jsSourceFile = path.join(sourceRoot, "packages/react/src/CopyButton.js");
  const sourceFile = fs.existsSync(tsxSourceFile) ? tsxSourceFile : jsSourceFile;
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, "utf8") : "";
  const root = blocks.find((block) => block.selector === ".copy-button");
  if (!root) {
    add("errors", packageCssFile, 1, "Copy Button CSS must define .copy-button.");
    return;
  }
  if (!source.includes("React.createElement(Button") || !source.includes("React.createElement(IconButton")) {
    add("errors", sourceFile, 1, "CopyButton must compose Button and IconButton instead of cloning action frames.");
  }
  if (!source.includes("state: resolvedState === \"copied\" || resolvedState === \"error\" ? \"default\" : resolvedState")) {
    add("errors", sourceFile, 1, "CopyButton must forward governed actionable states to the composed Button.");
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
