const { fs, path, root, read, add } = require("./audit-context.js");

const adapterIndexFile = path.join(root, "packages/components/src/platforms/index.js");
const badgeAdapterFile = path.join(root, "packages/components/src/platforms/badge.js");
const tagAdapterFile = path.join(root, "packages/components/src/platforms/tag.js");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const reactBadgeFile = path.join(root, "packages/react/src/Badge.js");
const reactBadgeTypesFile = path.join(root, "packages/react/src/Badge.d.ts");
const reactTagFile = path.join(root, "packages/react/src/Tag.js");
const reactTagTypesFile = path.join(root, "packages/react/src/Tag.d.ts");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const reactIndexTypesFile = path.join(root, "packages/react/src/index.d.ts");
const reactDistBadgeFile = path.join(root, "packages/react/dist/Badge.js");
const reactDistBadgeTypesFile = path.join(root, "packages/react/dist/Badge.d.ts");
const reactDistTagFile = path.join(root, "packages/react/dist/Tag.js");
const reactDistTagTypesFile = path.join(root, "packages/react/dist/Tag.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const forbiddenPrefix = "fl" + "ow-";

function checkStatusPlatformAdapters() {
  for (const file of [
    adapterIndexFile,
    badgeAdapterFile,
    tagAdapterFile,
    reactBadgeFile,
    reactBadgeTypesFile,
    reactTagFile,
    reactTagTypesFile,
    reactDistBadgeFile,
    reactDistBadgeTypesFile,
    reactDistTagFile,
    reactDistTagTypesFile,
  ]) {
    if (!fs.existsSync(file)) {
      add("errors", file, 1, "Status platform implementation contract is missing.");
      return;
    }
  }

  const adapterIndex = read(adapterIndexFile);
  const badgeAdapter = read(badgeAdapterFile);
  const tagAdapter = read(tagAdapterFile);
  const contracts = read(contractsFile);
  const reactBadge = read(reactBadgeFile);
  const reactBadgeTypes = read(reactBadgeTypesFile);
  const reactTag = read(reactTagFile);
  const reactTagTypes = read(reactTagTypesFile);
  const reactIndex = read(reactIndexFile);
  const reactIndexTypes = read(reactIndexTypesFile);
  const reactPackage = read(reactPackageFile);

  checkAdapter("Badge", "badge", badgeAdapterFile, badgeAdapter, ["hidden", "live", "ariaLabel"]);
  checkAdapter("Tag", "tag", tagAdapterFile, tagAdapter, ["icon", "interactive", "disabled"]);

  for (const [file, source, required] of [
    [reactBadgeFile, reactBadge, ["badgePlatformContract", "className: [\"badge\"", '"data-tone": resolvedTone', '"data-variant": resolvedVariant', '"data-state": resolvedState', "badge__label", "badge__icon", "badge__live"]],
    [reactBadgeTypesFile, reactBadgeTypes, ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement>", "BadgeProps", "BadgeVariant", "BadgeTone", "BadgeState", "badgePlatformContract"]],
    [reactTagFile, reactTag, ["tagPlatformContract", "className: [\"tag\"", '"data-tone": resolvedTone', '"data-variant": resolvedVariant', '"data-state": resolvedState', "tag__label", "tag__icon", "data-interactive"]],
    [reactTagTypesFile, reactTagTypes, ["ForwardRefExoticComponent", "RefAttributes<HTMLSpanElement | HTMLButtonElement>", "TagProps", "TagVariant", "TagTone", "TagState", "tagPlatformContract"]],
    [reactPackageFile, reactPackage, ['"types": "./dist/index.d.ts"', '"./badge"', '"./tag"']],
    [reactIndexFile, reactIndex, ["Badge", "Tag"]],
    [reactIndexTypesFile, reactIndexTypes, ["BadgeProps", "TagProps"]],
  ]) {
    for (const snippet of required) {
      if (!source.includes(snippet)) {
        add("errors", file, 1, `React primary status component missing required snippet: ${snippet}.`);
      }
    }
  }

  for (const [file, source] of [
    [badgeAdapterFile, badgeAdapter],
    [tagAdapterFile, tagAdapter],
    [reactBadgeFile, reactBadge],
    [reactTagFile, reactTag],
  ]) {
    if (source.includes(forbiddenPrefix)) {
      add("errors", file, 1, "Status platform implementation contracts must not expose the forbidden public product prefix.");
    }
  }

  function checkAdapter(label, id, file, source, extraProps) {
    const prefix = `${id}Platform`;
    for (const exportName of [`${prefix}Adapters`, `${prefix}Contract`, `${prefix}Props`]) {
      if (!adapterIndex.includes(exportName)) add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
      if (!source.includes(exportName)) add("errors", file, 1, `${label} platform adapter must define ${exportName}.`);
    }
    if (!source.includes(`componentContracts.${id}`)) {
      add("errors", file, 1, `${label} platform contract must derive props, variants, states, and accessibility from componentContracts.${id}.`);
    }
    if (source.includes("dom:") || source.includes('renderMode: "factory"') || source.includes('implementationRole: "transitional-static-renderer"')) {
      add("errors", file, 1, `${label} platform contract must not advertise a DOM target once React is the public product component.`);
    }
    for (const snippet of ["react:", 'renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true"]) {
      if (!source.includes(snippet)) add("errors", file, 1, `${label} platform contract must mark React as the only public component target; missing ${snippet}.`);
    }
    for (const token of [`comp.${id}.*`, "sys.energy.*", "sys.voice.*", "sys.frame.*", "sys.state.*", "sys.momentum.*", "sys.accessibility.*", "sys.iconography.*", "sys.symbol.*", "sys.growth.*"]) {
      if (!source.includes(token)) add("errors", file, 1, `${label} platform contract must include token dependency ${token}.`);
    }
    for (const primitive of ["color", "typography", "spacing", "radius", "focus", "disabled", "duration", "motion-curves", "iconography"]) {
      if (!source.includes(`"${primitive}"`)) add("errors", file, 1, `${label} platform contract must include primitive dependency ${primitive}.`);
    }
    for (const prop of ["label", "tone", "variant", "state", ...extraProps]) {
      if (!contracts.includes(`name: "${prop}"`)) add("errors", contractsFile, 1, `${label} contract is missing prop ${prop}.`);
    }
  }
}

module.exports = { checkStatusPlatformAdapters };
