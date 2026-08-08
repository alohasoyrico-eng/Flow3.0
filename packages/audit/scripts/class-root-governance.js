const fs = require("fs");
const path = require("path");

const classifiedNonComponentRoots = {
  "animation-asset": {
    type: "primitive-asset",
    owner: "packages/components/src/primitives/animation-assets.js",
    note: "Reusable animation asset primitive consumed by AnimatedMoment.",
    reactSupport: true,
  },
  "docs-package-demo": {
    type: "docs-layout-bridge",
    owner: "../FlowDocs/apps/docs",
    note: "Temporary docs layout hook for package-backed demos; tracked so it cannot multiply silently.",
    reactSupport: false,
  },
  "field-action": {
    type: "shared-control-primitive",
    owner: "field",
    note: "Shared field action affordance consumed by Input, Combobox, and card field inputs.",
    reactSupport: true,
  },
  "field-control": {
    type: "legacy-field-shell",
    owner: "field",
    note: "Legacy-compatible field shell selector covered by the Field CSS contract.",
    reactSupport: false,
  },
  "field-input": {
    type: "legacy-field-input",
    owner: "field",
    note: "Legacy-compatible field input selector covered by the Field CSS contract.",
    reactSupport: false,
  },
  "illustration-asset": {
    type: "primitive-asset",
    owner: "packages/components/src/primitives/illustration-assets.js",
    note: "Reusable illustration asset primitive.",
    reactSupport: true,
  },
  input: {
    type: "shared-control-primitive",
    owner: "field",
    note: "Shared native input surface consumed by field-family React components.",
    reactSupport: true,
  },
  "material-symbol": {
    type: "iconography-hook",
    owner: "packages/components/src/primitives/iconography.js",
    note: "Material Symbols font hook used by icon-bearing components.",
    reactSupport: true,
  },
};

const reactSupportClassRoots = new Set(Object.entries(classifiedNonComponentRoots)
  .filter(([, config]) => config.reactSupport)
  .map(([root]) => root));

function classRootTokensFromClassExpression(value) {
  return new Set([...classTokensFromClassExpression(value)].map((token) => token.split(/__|--/)[0]));
}

function classTokensFromClassExpression(value) {
  const literals = [...String(value).matchAll(/["'`]([^"'`]+)["'`]/g)].map((match) => match[1]);
  const source = literals.length ? literals.join(" ") : String(value);
  return new Set(source
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => /^[a-z][a-z0-9-]*(?:__[a-z0-9-]+|--[a-z0-9-]+)?$/.test(token)));
}

function packageCssClassRoots(root) {
  return packageCssRootInventory(root).roots;
}

function packageCssRootInventory(root) {
  const cssFile = path.join(root, "packages/components/styles/components.css");
  if (!fs.existsSync(cssFile)) return { cssFile, roots: new Set(), selectors: 0 };
  const source = fs.readFileSync(cssFile, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const roots = new Set();
  let selectors = 0;
  let selectorStart = 0;
  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") {
      const selector = source.slice(selectorStart, index).trim();
      if (selector && !selector.startsWith("@")) {
        selectors += 1;
        for (const match of selector.matchAll(/\.([a-z][a-z0-9-]*(?:__[a-z0-9-]+|--[a-z0-9-]+)?)/g)) {
          roots.add(match[1].split(/__|--/)[0]);
        }
      }
      continue;
    }
    if (char === "}") selectorStart = index + 1;
  }
  return { cssFile, roots, selectors };
}

module.exports = {
  classRootTokensFromClassExpression,
  classTokensFromClassExpression,
  classifiedNonComponentRoots,
  packageCssClassRoots,
  packageCssRootInventory,
  reactSupportClassRoots,
};
