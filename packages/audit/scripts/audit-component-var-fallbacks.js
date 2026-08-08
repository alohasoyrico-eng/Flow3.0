const { path, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");

function checkComponentVarFallbacks(cssWithoutDefinitions, fullText) {
  const fallbackPattern = /var\((--comp-[^,\)]+),/g;
  for (const match of cssWithoutDefinitions.matchAll(fallbackPattern)) {
    add(
      "errors",
      packageCssFile,
      lineNumber(fullText, fullText.indexOf(match[0])),
      `${match[1]} must declare its default in the component contract instead of using a var() fallback at consumption.`
    );
  }
}

module.exports = { checkComponentVarFallbacks };
