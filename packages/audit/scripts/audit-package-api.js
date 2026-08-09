const { goldComponents, path, root, readJson, add } = require("./audit-context.js");

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
  "#design-system/tokens-json",
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
  "./tokens.json",
  "./tokens/styles.css",
  "./components",
  "./components/contracts",
  "./components/platforms",
  "./components/styles.css",
  "./react",
  ...goldComponents.map((component) => `./react/${component}`),
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

const publishFileAllowlist = [
  "packages/tokens/src",
  "packages/tokens/tokens.json",
  "packages/tokens/styles",
  "packages/components/src",
  "packages/components/styles",
  "packages/react/dist",
  "packages/content/content",
  "packages/specs/specs",
  "README.md",
  "CHANGELOG.md",
  "RELEASE.md",
  "START.md",
];

function checkPackageApiBoundary() {
  const packageJsonFile = path.join(root, "package.json");
  const contentPackageJsonFile = path.join(root, "packages/content/package.json");
  const tokenPackageJsonFile = path.join(root, "packages/tokens/package.json");
  const tokenContractFile = path.join(root, "packages/tokens/tokens.json");
  const rootImports = readJson(packageJsonFile)?.imports ?? {};
  const rootPackage = readJson(packageJsonFile) ?? {};
  const rootExports = rootPackage.exports ?? {};
  const exportedContent = readJson(contentPackageJsonFile)?.exports ?? {};
  const exportedTokens = readJson(tokenPackageJsonFile)?.exports ?? {};
  const tokenContract = readJson(tokenContractFile);

  if (rootPackage.private === true) {
    add("errors", packageJsonFile, 1, "Root package must be publishable; do not mark Flow as private.");
  }
  if (rootPackage.publishConfig?.registry !== "https://npm.pkg.github.com") {
    add("errors", packageJsonFile, 1, "Root package publishConfig.registry must target GitHub Packages.");
  }
  if (rootPackage.publishConfig?.access !== "public") {
    add("errors", packageJsonFile, 1, "Root package publishConfig.access must be public.");
  }
  if (!rootPackage.peerDependencies?.react || !rootPackage.peerDependencies?.["react-dom"]) {
    add("errors", packageJsonFile, 1, "Root package must publish react and react-dom as peerDependencies.");
  }
  if (!Array.isArray(rootPackage.sideEffects) || !rootPackage.sideEffects.includes("**/*.css")) {
    add("errors", packageJsonFile, 1, "Root package sideEffects must preserve published CSS for bundlers.");
  }
  if (JSON.stringify(rootPackage.files ?? []) !== JSON.stringify(publishFileAllowlist)) {
    add("errors", packageJsonFile, 1, `Root package files must stay on the governed publish allowlist: ${publishFileAllowlist.join(", ")}.`);
  }
  for (const requiredImport of boundaryImports) {
    if (!rootImports[requiredImport]) add("errors", packageJsonFile, 1, `Root package imports missing public boundary alias: ${requiredImport}.`);
  }
  for (const requiredExport of contentExports) {
    if (!exportedContent[requiredExport]) add("errors", contentPackageJsonFile, 1, `@design-system/content export missing: ${requiredExport}.`);
  }
  for (const requiredExport of installExports) {
    if (!rootExports[requiredExport]) add("errors", packageJsonFile, 1, `Root package exports missing install surface: ${requiredExport}.`);
  }
  if (exportedTokens["./tokens.json"] !== "./tokens.json") {
    add("errors", tokenPackageJsonFile, 1, "@design-system/tokens must export ./tokens.json for platform-neutral token pipelines.");
  }
  if (tokenContract?.format !== "flow-token-contract@1") {
    add("errors", tokenContractFile, 1, "Token JSON contract must declare format flow-token-contract@1.");
  }
  if (!tokenContract?.compatibleWith?.includes?.("style-dictionary")) {
    add("errors", tokenContractFile, 1, "Token JSON contract must declare Style Dictionary compatibility.");
  }
  if (Object.keys(tokenContract?.tokens ?? {}).length < 1000) {
    add("errors", tokenContractFile, 1, "Token JSON contract must expose the full CSS token inventory.");
  }
}

module.exports = { checkPackageApiBoundary };
