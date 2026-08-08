const { fs, path, root, goldComponents, add } = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");

function kebab(value) {
  return String(value).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function checkReactPrimaryInventory(componentFiles) {
  const sourceNames = componentFiles.map((file) => path.basename(file, ".js"));
  const sourceIds = sourceNames.map(kebab);
  const expectedIds = [...goldComponents].sort();
  const missingSources = expectedIds.filter((id) => !sourceIds.includes(id));
  const extraSources = sourceIds.filter((id) => !goldComponents.includes(id));

  if (missingSources.length) {
    add("errors", reactSrcDir, 1, `React primary package is missing source implementations for accepted components: ${missingSources.join(", ")}.`);
  }
  if (extraSources.length) {
    add("errors", reactSrcDir, 1, `React primary package exposes components outside goldComponents governance: ${extraSources.join(", ")}.`);
  }

  for (const name of sourceNames) {
    const typesFile = path.join(reactSrcDir, `${name}.d.ts`);
    if (!fs.existsSync(typesFile)) add("errors", typesFile, 1, `${name} React primary implementation must have a source .d.ts contract.`);
  }
}

module.exports = { checkReactPrimaryInventory };
