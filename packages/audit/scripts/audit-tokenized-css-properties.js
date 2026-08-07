const { path, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const tokenOwnedProperties = new Set(["padding", "gap", "border-radius", "font-size", "box-shadow"]);
const allowedLiterals = new Set(["0", "none", "inherit", "initial", "unset", "transparent"]);

function checkTokenizedVisualProperties(cssWithoutDefinitions, fullText) {
  checkCardCompositionAliases(cssWithoutDefinitions, fullText);
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

function checkCardCompositionAliases(cssWithoutDefinitions, fullText) {
  for (const match of cssWithoutDefinitions.matchAll(/--card-(padding|gap|title-size|value-size):\s*([^;]+);/g)) {
    const value = match[2].trim();
    if (value === "0" || value.startsWith("var(--comp-card-")) continue;
    add(
      "errors",
      packageCssFile,
      lineNumber(fullText, fullText.indexOf(match[0])),
      `Card local ${match[1]} alias must be assigned from --comp-card-* so composition does not bypass the component cascade.`
    );
  }
}

module.exports = { checkTokenizedVisualProperties };
