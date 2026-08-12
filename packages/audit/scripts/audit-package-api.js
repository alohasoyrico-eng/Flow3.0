const fs = require("node:fs");
const { goldComponents, patternArtifacts, path, root, readJson, add } = require("./audit-context.js");

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
  "#design-system/specs/foundations/*",
  "#design-system/specs/primitives/*",
  "#design-system/specs/patterns/*",
  "#design-system/specs/templates/*",
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

const componentPackageExports = {
  ".": "./src/index.js",
  "./contracts": "./src/contracts.js",
  "./platforms": "./src/platforms/index.js",
  "./styles.css": "./styles/components.css",
};

const tokenPackageExports = {
  ".": "./src/index.js",
  "./tokens.json": "./tokens.json",
  "./styles.css": "./styles/tokens.css",
  "./flutter": "./dist/flutter/flow_tokens.dart",
  "./android": "./dist/android/flow_tokens.xml",
  "./ios": "./dist/ios/FlowTokens.swift",
};

const specsPackageExports = {
  "./system": "./specs/unison.system.json",
  "./foundations/*": "./specs/unison-system/artifacts/foundations/*.json",
  "./primitives/*": "./specs/unison-system/artifacts/primitives/*.json",
  "./patterns/*": "./specs/unison-system/artifacts/patterns/*.json",
  "./templates/*": "./specs/unison-system/artifacts/templates/*.json",
};

const reactTemplateDir = path.join(root, "packages/react/src/templates");
const implementedReactTemplates = fs.existsSync(reactTemplateDir)
  ? fs.readdirSync(reactTemplateDir)
      .filter((file) => /^[A-Z].*\.js$/.test(file))
      .map((file) => file.replace(/\.js$/, "").replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase())
      .sort()
  : [];

const installExports = [
  "./tokens",
  "./tokens.json",
  "./tokens/styles.css",
  "./tokens/android",
  "./tokens/flutter",
  "./tokens/ios",
  "./components",
  "./components/contracts",
  "./components/platforms",
  "./components/styles.css",
  "./react",
  "./react/surface",
  ...goldComponents.map((component) => `./react/${component}`),
  ...(implementedReactTemplates.length ? ["./react/templates"] : []),
  ...implementedReactTemplates.map((template) => `./react/templates/${template}`),
  "./react/patterns",
  ...patternArtifacts.map((pattern) => `./react/patterns/${pattern}`),
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
  "./specs/foundations/*",
  "./specs/primitives/*",
  "./specs/patterns/*",
  "./specs/templates/*",
];

const publishFileAllowlist = [
  "packages/tokens/src",
  "packages/tokens/tokens.json",
  "packages/tokens/styles",
  "packages/tokens/dist",
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

function exportTargets(value) {
  if (typeof value === "string") return [value];
  if (!value || typeof value !== "object") return [];
  return Object.values(value).flatMap(exportTargets);
}

function isPublishAllowedTarget(target) {
  const file = target.replace(/^\.\//, "");
  return publishFileAllowlist.some((entry) => file === entry || file.startsWith(`${entry}/`));
}

function isInternalBoundaryTarget(target) {
  const file = target.replace(/^\.\//, "");
  return [
    "packages/components/src/",
    "packages/components/styles/",
    "packages/content/content/",
    "packages/react/src/",
    "packages/specs/specs/",
    "packages/tokens/src/",
    "packages/tokens/styles/",
    "packages/tokens/tokens.json",
  ].some((entry) => file === entry.replace(/\/$/, "") || file.startsWith(entry));
}

function targetExists(target) {
  const absoluteTarget = path.join(root, target);
  return targetExistsAt(absoluteTarget, target);
}

function targetExistsAt(absoluteTarget, target) {
  if (!target.includes("*")) return fs.existsSync(absoluteTarget);
  const [prefix, suffix = ""] = absoluteTarget.split("*");
  const directory = prefix.endsWith(path.sep) ? prefix.slice(0, -1) : path.dirname(prefix);
  const basenamePrefix = prefix.endsWith(path.sep) ? "" : path.basename(prefix);
  return fs.existsSync(directory) && fs.readdirSync(directory).some((file) => file.startsWith(basenamePrefix) && file.endsWith(suffix));
}

function checkPackageApiBoundary() {
  const packageJsonFile = path.join(root, "package.json");
  const componentsPackageJsonFile = path.join(root, "packages/components/package.json");
  const contentPackageJsonFile = path.join(root, "packages/content/package.json");
  const specsPackageJsonFile = path.join(root, "packages/specs/package.json");
  const tokenPackageJsonFile = path.join(root, "packages/tokens/package.json");
  const tokenContractFile = path.join(root, "packages/tokens/tokens.json");
  const rootImports = readJson(packageJsonFile)?.imports ?? {};
  const rootPackage = readJson(packageJsonFile) ?? {};
  const rootExports = rootPackage.exports ?? {};
  const exportedComponents = readJson(componentsPackageJsonFile)?.exports ?? {};
  const exportedContent = readJson(contentPackageJsonFile)?.exports ?? {};
  const exportedSpecs = readJson(specsPackageJsonFile)?.exports ?? {};
  const exportedTokens = readJson(tokenPackageJsonFile)?.exports ?? {};
  const tokenContract = readJson(tokenContractFile);

  if (rootPackage.private === true) {
    add("errors", packageJsonFile, 1, "Root package must be publishable; do not mark Flow as private.");
  }
  if (!rootPackage.description || !rootPackage.description.includes("React components") || !rootPackage.description.includes("tokens")) {
    add("errors", packageJsonFile, 1, "Root package must publish a product-readable description covering tokens and React components.");
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
  for (const [importPath, importTarget] of Object.entries(rootImports)) {
    if (typeof importTarget !== "string" || !importTarget.startsWith("./")) {
      add("errors", packageJsonFile, 1, `Root package import ${importPath} must use a relative workspace target.`);
      continue;
    }
    if (!isInternalBoundaryTarget(importTarget)) {
      add("errors", packageJsonFile, 1, `Root package import ${importPath} points outside governed Flow source boundaries: ${importTarget}.`);
    }
    if (!targetExists(importTarget)) {
      add("errors", packageJsonFile, 1, `Root package import ${importPath} points to a missing workspace artifact: ${importTarget}.`);
    }
  }
  for (const requiredExport of contentExports) {
    if (!exportedContent[requiredExport]) add("errors", contentPackageJsonFile, 1, `@design-system/content export missing: ${requiredExport}.`);
  }
  checkExactPackageExports({
    packageFile: componentsPackageJsonFile,
    packageName: "@design-system/components",
    exportsMap: exportedComponents,
    expectedExports: componentPackageExports,
  });
  checkExactPackageExports({
    packageFile: contentPackageJsonFile,
    packageName: "@design-system/content",
    exportsMap: exportedContent,
    expectedExports: Object.fromEntries(contentExports.map((entry) => [entry, `./content/${entry.replace(/^\.\//, "")}.json`])),
    targetOverrides: {
      "./fixtures/prototyping": "./content/fixtures/prototyping.json",
      "./i18n/ui": "./content/i18n/ui.json",
    },
  });
  checkExactPackageExports({
    packageFile: specsPackageJsonFile,
    packageName: "@design-system/specs",
    exportsMap: exportedSpecs,
    expectedExports: specsPackageExports,
  });
  checkExactPackageExports({
    packageFile: tokenPackageJsonFile,
    packageName: "@design-system/tokens",
    exportsMap: exportedTokens,
    expectedExports: tokenPackageExports,
  });
  for (const requiredExport of installExports) {
    if (!rootExports[requiredExport]) add("errors", packageJsonFile, 1, `Root package exports missing install surface: ${requiredExport}.`);
  }
  const rootExportKeys = Object.keys(rootExports).sort();
  const expectedRootExportKeys = [...installExports].sort();
  const extraRootExports = rootExportKeys.filter((entry) => !expectedRootExportKeys.includes(entry));
  if (extraRootExports.length) {
    add("errors", packageJsonFile, 1, `Root package exports include ungoverned public subpaths: ${extraRootExports.join(", ")}.`);
  }
  for (const [exportPath, exportValue] of Object.entries(rootExports)) {
    for (const target of exportTargets(exportValue)) {
      if (!target.startsWith("./")) {
        add("errors", packageJsonFile, 1, `Root package export ${exportPath} must use a relative package target.`);
        continue;
      }
      if (!isPublishAllowedTarget(target)) {
        add("errors", packageJsonFile, 1, `Root package export ${exportPath} points outside the governed publish allowlist: ${target}.`);
      }
      if (!targetExists(target)) {
        add("errors", packageJsonFile, 1, `Root package export ${exportPath} points to a missing artifact: ${target}.`);
      }
    }
  }
  if (exportedTokens["./tokens.json"] !== "./tokens.json") {
    add("errors", tokenPackageJsonFile, 1, "@design-system/tokens must export ./tokens.json for platform-neutral token pipelines.");
  }
  if (tokenContract?.format !== "flow-token-contract@2") {
    add("errors", tokenContractFile, 1, "Token JSON contract must declare format flow-token-contract@2.");
  }
  if (!tokenContract?.compatibleWith?.includes?.("style-dictionary")) {
    add("errors", tokenContractFile, 1, "Token JSON contract must declare Style Dictionary compatibility.");
  }
  if (Object.keys(tokenContract?.tokens ?? {}).length < 1000) {
    add("errors", tokenContractFile, 1, "Token JSON contract must expose the full CSS token inventory.");
  }
}

function checkExactPackageExports({ packageFile, packageName, exportsMap, expectedExports, targetOverrides = {} }) {
  const expected = { ...expectedExports, ...targetOverrides };
  const actualKeys = Object.keys(exportsMap).sort();
  const expectedKeys = Object.keys(expected).sort();
  const missing = expectedKeys.filter((entry) => !actualKeys.includes(entry));
  const extra = actualKeys.filter((entry) => !expectedKeys.includes(entry));
  if (missing.length) add("errors", packageFile, 1, `${packageName} exports missing governed subpaths: ${missing.join(", ")}.`);
  if (extra.length) add("errors", packageFile, 1, `${packageName} exports include ungoverned public subpaths: ${extra.join(", ")}.`);
  for (const [exportPath, expectedTarget] of Object.entries(expected)) {
    const actualTarget = exportsMap[exportPath];
    if (actualTarget !== expectedTarget) {
      add("errors", packageFile, 1, `${packageName} export ${exportPath} must target ${expectedTarget}.`);
      continue;
    }
    if (!targetExistsAt(path.join(path.dirname(packageFile), expectedTarget), expectedTarget)) {
      add("errors", packageFile, 1, `${packageName} export ${exportPath} points to a missing artifact: ${expectedTarget}.`);
    }
  }
}

module.exports = { checkPackageApiBoundary };
