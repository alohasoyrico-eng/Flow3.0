const { path, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const rawAliasValuePattern = /(--comp-[a-z0-9-]+):\s*([^;]*(?:\b\d+(?:\.\d+)?(?:px|rem|em|%)\b|#[0-9a-fA-F]{3,8}|scale\(|translate[XY]?\(|rotate\()[^;]*);/g;

function checkComponentAliasLiterals(rootAliasBlock, fullText) {
  for (const match of rootAliasBlock.matchAll(rawAliasValuePattern)) {
    const value = match[2].trim();
    if (value.includes("var(")) continue;
    add(
      "errors",
      packageCssFile,
      lineNumber(fullText, fullText.indexOf(match[0])),
      `${match[1]} must derive from Flow aliases instead of declaring literal "${value}".`
    );
  }
}

module.exports = { checkComponentAliasLiterals };
