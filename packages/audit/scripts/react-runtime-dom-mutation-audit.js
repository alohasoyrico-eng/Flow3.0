const { allowedDynamicStyleKeysByComponent } = require("./react-style-contracts.js");

function checkRuntimeDomMutationContract({ add, name, sourceFile, source }) {
  const allowedDynamicStyleKeys = allowedDynamicStyleKeysByComponent[name] ?? [];
  const allowedSetPropertyCalls = [...source.matchAll(/\.style\.setProperty\(\s*["']([^"']+)["']/g)]
    .map((match) => match[1])
    .filter((propertyName) => allowedDynamicStyleKeys.includes(propertyName));
  const setPropertyCallCount = [...source.matchAll(/\.style\.setProperty\(/g)].length;
  const blockedPatterns = [
    { pattern: /\.style\.(?!setProperty\()/, label: "DOM style mutation" },
    { pattern: /\.dataset\./, label: "DOM dataset mutation" },
    { pattern: /\.classList\./, label: "DOM classList mutation" },
  ];

  if (setPropertyCallCount !== allowedSetPropertyCalls.length) {
    add("errors", sourceFile, 1, `${name} React source may only use style.setProperty for audited component dynamic CSS properties: ${allowedDynamicStyleKeys.join(", ") || "none"}.`);
  }
  for (const { pattern, label } of blockedPatterns) {
    if (!pattern.test(source)) continue;
    add("errors", sourceFile, 1, `${name} React source must not use ${label}; represent state through React props/data attributes or add a narrow audited exception.`);
  }
}

module.exports = { checkRuntimeDomMutationContract };
