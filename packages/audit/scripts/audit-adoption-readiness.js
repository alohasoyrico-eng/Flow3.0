const { fs, path, root, add, read } = require("./audit-context.js");

const rootPackageFile = path.join(root, "package.json");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const reactTypesIndexFile = path.join(root, "packages/react/src/index.d.ts");
const componentsPackageFile = path.join(root, "packages/components/package.json");
const tokensPackageFile = path.join(root, "packages/tokens/package.json");
const docsSplitPackageFile = path.join(root, "repo-split-output/FlowDocs/package.json");

function checkAdoptionReadiness() {
  const rootPackage = readJson(rootPackageFile);
  const reactPackage = readJson(reactPackageFile);
  const componentsPackage = readJson(componentsPackageFile);
  const tokensPackage = readJson(tokensPackageFile);
  const reactIndex = read(reactIndexFile);
  const reactTypesIndex = read(reactTypesIndexFile);

  checkCoreExports(rootPackage, componentsPackage, tokensPackage);
  checkReactExportParity(rootPackage, reactPackage, reactIndex, reactTypesIndex);
  checkReactPackageTargets(reactPackage);
  checkDocsSplitConsumerBoundary();
  checkReactDoesNotDependOnDocs();

  if (rootPackage.private === true) {
    add("warnings", rootPackageFile, 1, "Flow3.0 is still private; GitHub/file consumption works, but npm package adoption requires a deliberate release decision.");
  }
}

function checkCoreExports(rootPackage, componentsPackage, tokensPackage) {
  const requiredRootExports = {
    "./tokens": "./packages/tokens/src/index.js",
    "./tokens/styles.css": "./packages/tokens/styles/tokens.css",
    "./components": "./packages/components/src/index.js",
    "./components/contracts": "./packages/components/src/contracts.js",
    "./components/platforms": "./packages/components/src/platforms/index.js",
    "./components/styles.css": "./packages/components/styles/components.css",
    "./react": "./packages/react/dist/index.js",
  };
  for (const [key, target] of Object.entries(requiredRootExports)) {
    if (rootPackage.exports?.[key] !== target) {
      add("errors", rootPackageFile, 1, `Root package must export ${key} to ${target}.`);
    }
    checkTargetExists(rootPackageFile, target, `Root package export ${key}`);
  }

  for (const key of [".", "./contracts", "./platforms", "./styles.css"]) {
    if (!componentsPackage.exports?.[key]) {
      add("errors", componentsPackageFile, 1, `@design-system/components must expose ${key}.`);
    }
  }
  for (const key of [".", "./styles.css"]) {
    if (!tokensPackage.exports?.[key]) {
      add("errors", tokensPackageFile, 1, `@design-system/tokens must expose ${key}.`);
    }
  }
}

function checkReactExportParity(rootPackage, reactPackage, reactIndex, reactTypesIndex) {
  const rootExports = rootPackage.exports ?? {};
  const reactExports = reactPackage.exports ?? {};

  for (const [reactKey, reactExport] of Object.entries(reactExports)) {
    const rootKey = reactKey === "." ? "./react" : `./react/${reactKey.slice(2)}`;
    const target = typeof reactExport === "string" ? reactExport : reactExport.default;
    const typesTarget = typeof reactExport === "object" ? reactExport.types : "";
    const expectedRootTarget = `./packages/react/${target.replace(/^\.\//, "")}`;

    if (rootExports[rootKey] !== expectedRootTarget) {
      add("errors", rootPackageFile, 1, `Root package must mirror @design-system/react export ${reactKey} as ${rootKey}.`);
    }
    checkTargetExists(rootPackageFile, expectedRootTarget, `Root package export ${rootKey}`);
    if (typesTarget) checkTargetExists(reactPackageFile, `./packages/react/${typesTarget.replace(/^\.\//, "")}`, `React type export ${reactKey}`);
  }

  const componentFiles = fs.readdirSync(path.join(root, "packages/react/src"))
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort();
  for (const file of componentFiles) {
    const exportName = path.basename(file, ".js");
    if (!reactIndex.includes(`export { ${exportName} } from "./${file}"`)) {
      add("errors", reactIndexFile, 1, `React index must export ${exportName}.`);
    }
    if (!reactTypesIndex.includes(`${exportName}Props`)) {
      add("errors", reactTypesIndexFile, 1, `React type index must export ${exportName}Props.`);
    }
  }
}

function checkReactPackageTargets(reactPackage) {
  for (const [key, value] of Object.entries(reactPackage.exports ?? {})) {
    const target = typeof value === "string" ? value : value.default;
    const types = typeof value === "object" ? value.types : "";
    checkTargetExists(reactPackageFile, `./packages/react/${target.replace(/^\.\//, "")}`, `@design-system/react export ${key}`);
    if (types) checkTargetExists(reactPackageFile, `./packages/react/${types.replace(/^\.\//, "")}`, `@design-system/react type export ${key}`);
  }
}

function checkDocsSplitConsumerBoundary() {
  if (!fs.existsSync(docsSplitPackageFile)) return;
  const docsPackage = readJson(docsSplitPackageFile);
  if (docsPackage.dependencies?.flow !== "file:../Flow3.0") {
    add("errors", docsSplitPackageFile, 1, "FlowDocs must consume Flow3.0 through the flow dependency.");
  }
  const imports = docsPackage.imports ?? {};
  for (const [key, value] of Object.entries(imports)) {
    if (key.startsWith("#design-system/") && !String(value).startsWith("flow/")) {
      add("errors", docsSplitPackageFile, 1, `FlowDocs import ${key} must resolve through flow/*, not a copied local system path.`);
    }
  }
}

function checkReactDoesNotDependOnDocs() {
  const files = [
    ...listFiles(path.join(root, "packages/react/src")),
    ...listFiles(path.join(root, "packages/react/dist")),
  ].filter((file) => /\.(?:js|d\.ts)$/.test(file));

  for (const file of files) {
    const source = read(file);
    if (source.includes("apps/docs") || source.includes("#design-system/docs")) {
      add("errors", file, 1, "React package must not depend on FlowDocs implementation paths.");
    }
  }
}

function checkTargetExists(file, target, label) {
  if (!target.startsWith("./")) return;
  const absolute = path.join(root, target);
  if (!fs.existsSync(absolute)) {
    add("errors", file, 1, `${label} points to missing target ${target}.`);
  }
}

function listFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

function readJson(file) {
  return JSON.parse(read(file));
}

module.exports = { checkAdoptionReadiness };
