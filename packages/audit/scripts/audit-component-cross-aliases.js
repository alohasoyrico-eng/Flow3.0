const { goldComponents, path, add, lineNumber } = require("./audit-context.js");

const packageCssFile = path.join(process.cwd(), "packages/components/styles/components.css");
const componentIds = [...goldComponents].sort((a, b) => b.length - a.length);
const allowedCrossAliases = new Set(["country-selector->select"]);

function aliasOwner(alias) {
  return componentIds.find((id) => alias.startsWith(`--comp-${id}-`));
}

function selectorOwners(selector) {
  return componentIds.filter((id) => new RegExp(`\\.${id}(?:$|[\\s.#:[,{>+~_-])`).test(selector));
}

function checkComponentCrossAliases(cssWithoutDefinitions, fullText) {
  const blocks = cssWithoutDefinitions.matchAll(/([^{}]+)\{([^{}]*)\}/g);
  for (const block of blocks) {
    const selector = block[1].replace(/\/\*[\s\S]*?\*\//g, "").trim().replace(/\s+/g, " ");
    const owners = selectorOwners(selector);
    if (!owners.length) continue;
    for (const match of block[2].matchAll(/var\((--comp-[a-z0-9-]+-[^)]+)\)/g)) {
      const owner = aliasOwner(match[1]);
      if (!owner || owners.includes(owner)) continue;
      const allowed = owners.some((selectorOwner) => allowedCrossAliases.has(`${selectorOwner}->${owner}`));
      if (allowed) continue;
      add(
        "errors",
        packageCssFile,
        lineNumber(fullText, fullText.indexOf(match[0], block.index)),
        `${owners.join(", ")} must not consume ${match[1]}; expose an owned alias or an explicit family contract instead.`
      );
    }
  }
}

module.exports = { checkComponentCrossAliases };
