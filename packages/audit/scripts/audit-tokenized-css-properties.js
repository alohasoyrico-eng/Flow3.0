const { path, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const tokenOwnedProperties = new Set(["padding", "gap", "border-radius", "font-size", "box-shadow"]);
const allowedLiterals = new Set(["0", "none", "inherit", "initial", "unset", "transparent"]);

function checkTokenizedVisualProperties(cssWithoutDefinitions, fullText) {
  for (const match of cssWithoutDefinitions.matchAll(/\b(padding|gap|border-radius|font-size|box-shadow):\s*([^;]+);/g)) {
    const [, property, rawValue] = match;
    const value = rawValue.trim().replace(/\s+/g, " ");
    if (!tokenOwnedProperties.has(property) || value.includes("var(") || allowedLiterals.has(value)) continue;
    add(
      "errors",
      packageCssFile,
      lineNumber(fullText, fullText.indexOf(match[0])),
      `Package ${property} must use Flow component/foundation aliases instead of literal "${value}".`
    );
  }
}

module.exports = { checkTokenizedVisualProperties };
