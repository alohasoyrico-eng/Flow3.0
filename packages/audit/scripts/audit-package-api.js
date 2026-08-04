const { path, root, readJson, add } = require("./audit-context.js");

const boundaryImports = [
  "#design-system/components",
  "#design-system/react",
  "#design-system/components-css",
  "#design-system/content/catalog",
  "#design-system/content/component-docs",
  "#design-system/content/component-copy",
  "#design-system/content/pattern-copy",
  "#design-system/content/component-implementation-status",
  "#design-system/content/foundation-copy",
  "#design-system/content/primitive-copy",
  "#design-system/content/reference-copy",
  "#design-system/content/template-blueprints",
  "#design-system/content/home",
  "#design-system/content/i18n-ui",
  "#design-system/specs/system",
  "#design-system/tokens-css",
];

const contentExports = [
  "./catalog",
  "./component-docs",
  "./component-copy",
  "./pattern-copy",
  "./component-implementation-status",
  "./foundation-copy",
  "./primitive-copy",
  "./reference-copy",
  "./template-blueprints",
  "./home",
  "./i18n/ui",
  "./component-behavior-contracts",
  "./component-quality-backlog",
  "./pattern-backlog",
  "./fixtures/prototyping",
];

const installExports = [
  "./tokens",
  "./tokens/styles.css",
  "./components",
  "./components/contracts",
  "./components/platforms",
  "./components/styles.css",
  "./react",
  "./react/button",
  "./react/icon-button",
  "./react/input",
  "./react/select",
  "./content/catalog",
  "./content/component-docs",
  "./content/component-copy",
  "./content/pattern-copy",
  "./content/component-implementation-status",
  "./content/foundation-copy",
  "./content/primitive-copy",
  "./content/reference-copy",
  "./content/template-blueprints",
  "./content/home",
  "./content/i18n-ui",
  "./specs/system",
];

function checkPackageApiBoundary() {
  const packageJsonFile = path.join(root, "package.json");
  const contentPackageJsonFile = path.join(root, "packages/content/package.json");
  const rootImports = readJson(packageJsonFile)?.imports ?? {};
  const rootExports = readJson(packageJsonFile)?.exports ?? {};
  const exportedContent = readJson(contentPackageJsonFile)?.exports ?? {};

  for (const requiredImport of boundaryImports) {
    if (!rootImports[requiredImport]) add("errors", packageJsonFile, 1, `Root package imports missing public boundary alias: ${requiredImport}.`);
  }
  for (const requiredExport of contentExports) {
    if (!exportedContent[requiredExport]) add("errors", contentPackageJsonFile, 1, `@design-system/content export missing: ${requiredExport}.`);
  }
  for (const requiredExport of installExports) {
    if (!rootExports[requiredExport]) add("errors", packageJsonFile, 1, `Root package exports missing install surface: ${requiredExport}.`);
  }
}

module.exports = { checkPackageApiBoundary };
