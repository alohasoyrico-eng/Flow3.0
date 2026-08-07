const { fs, path, root, add, read } = require("./audit-context.js");

const rootPackageFile = path.join(root, "package.json");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const reactTypesIndexFile = path.join(root, "packages/react/src/index.d.ts");
const componentsPackageFile = path.join(root, "packages/components/package.json");
const tokensPackageFile = path.join(root, "packages/tokens/package.json");
const docsSplitPackageFile = path.join(root, "repo-split-output/FlowDocs/package.json");
const readmeFile = path.join(root, "README.md");
const releaseFile = path.join(root, "RELEASE.md");
const startFile = path.join(root, "START.md");

function checkAdoptionReadiness() {
  const rootPackage = readJson(rootPackageFile);
  const reactPackage = readJson(reactPackageFile);
  const componentsPackage = readJson(componentsPackageFile);
  const tokensPackage = readJson(tokensPackageFile);
  const reactIndex = read(reactIndexFile);
  const reactTypesIndex = read(reactTypesIndexFile);

  checkReleasePackageMetadata(rootPackage);
  checkCoreExports(rootPackage, componentsPackage, tokensPackage);
  checkReactExportParity(rootPackage, reactPackage, reactIndex, reactTypesIndex);
  checkReactPackageTargets(reactPackage);
  checkDocsSplitConsumerBoundary();
  checkReactDoesNotDependOnDocs();
  checkInstallDocs(rootPackage);
}

function checkReleasePackageMetadata(rootPackage) {
  if (rootPackage.private === true) {
    add("errors", rootPackageFile, 1, "Flow3.0 package must not be private; it is intended for product adoption through GitHub Packages.");
  }
  if (rootPackage.name !== "@alohasoyrico-eng/flow") {
    add("errors", rootPackageFile, 1, "Flow3.0 package name must be @alohasoyrico-eng/flow for GitHub Packages publishing.");
  }
  if (rootPackage.publishConfig?.registry !== "https://npm.pkg.github.com") {
    add("errors", rootPackageFile, 1, "Flow3.0 package must publish to GitHub Packages.");
  }
  if (rootPackage.publishConfig?.access !== "public") {
    add("errors", rootPackageFile, 1, "Flow3.0 package publishConfig.access must be public.");
  }
  const requiredPrivateImports = {
    "#flow/components": "./packages/components/src/index.js",
    "#flow/platforms": "./packages/components/src/platforms/index.js",
    "#flow/tokens": "./packages/tokens/src/index.js",
    "#flow/tokens-css": "./packages/tokens/styles/tokens.css",
  };
  for (const [key, target] of Object.entries(requiredPrivateImports)) {
    if (rootPackage.imports?.[key] !== target) {
      add("errors", rootPackageFile, 1, `Flow3.0 package imports must map ${key} to ${target}.`);
    }
  }
  for (const peer of ["react", "react-dom"]) {
    if (!rootPackage.peerDependencies?.[peer]) {
      add("errors", rootPackageFile, 1, `Flow3.0 package must declare ${peer} as a peer dependency for React consumers.`);
    }
  }
  for (const artifact of [
    "packages/tokens/src",
    "packages/tokens/styles",
    "packages/components/src",
    "packages/components/styles",
    "packages/react/dist",
    "packages/content/content",
    "packages/specs/specs",
    "README.md",
    "RELEASE.md",
    "START.md",
  ]) {
    if (!rootPackage.files?.includes(artifact)) {
      add("errors", rootPackageFile, 1, `Flow3.0 package files must include ${artifact}.`);
    }
    if (!fs.existsSync(path.join(root, artifact))) {
      add("errors", rootPackageFile, 1, `Flow3.0 package files includes ${artifact}, but the artifact does not exist.`);
    }
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
    "./react": { types: "./packages/react/dist/index.d.ts", default: "./packages/react/dist/index.js" },
  };
  for (const [key, target] of Object.entries(requiredRootExports)) {
    if (!sameExport(rootPackage.exports?.[key], target)) {
      add("errors", rootPackageFile, 1, `Root package must export ${key} to ${target}.`);
    }
    for (const exportTarget of exportTargets(target)) checkTargetExists(rootPackageFile, exportTarget, `Root package export ${key}`);
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
    const expectedRootTypes = typesTarget ? `./packages/react/${typesTarget.replace(/^\.\//, "")}` : "";
    const rootExport = rootExports[rootKey];

    if (!rootExport || rootExport.default !== expectedRootTarget || rootExport.types !== expectedRootTypes) {
      add("errors", rootPackageFile, 1, `Root package must mirror @design-system/react export ${reactKey} as ${rootKey}.`);
    }
    checkTargetExists(rootPackageFile, expectedRootTarget, `Root package export ${rootKey}`);
    if (expectedRootTypes) checkTargetExists(rootPackageFile, expectedRootTypes, `Root package type export ${rootKey}`);
    if (typesTarget) checkTargetExists(reactPackageFile, expectedRootTypes, `React type export ${reactKey}`);
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

function sameExport(actual, expected) {
  if (typeof expected === "string") return actual === expected;
  return actual?.default === expected.default && actual?.types === expected.types;
}

function exportTargets(value) {
  return typeof value === "string" ? [value] : [value.default, value.types].filter(Boolean);
}

function checkReactPackageTargets(reactPackage) {
  const requiredPrivateImports = {
    "#flow/components": "@design-system/components",
    "#flow/platforms": "@design-system/components/platforms",
  };
  for (const [key, target] of Object.entries(requiredPrivateImports)) {
    if (reactPackage.imports?.[key] !== target) {
      add("errors", reactPackageFile, 1, `@design-system/react package imports must map ${key} to ${target} so local repo usage and published usage share one import contract.`);
    }
  }

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

function checkInstallDocs(rootPackage) {
  const docs = {
    [readmeFile]: [
      "React implementation",
      "npm run validate:system",
      "npm run validate:docs",
    ],
    [startFile]: [
      "React implementation",
      "FlowDocs",
      "consumes `flow`",
    ],
    [releaseFile]: [
      "Release Principles",
      "npm pack --dry-run",
      "npm publish",
      "Consumer Smoke Test",
      "SemVer",
      "CHANGELOG.md",
      "Do not force-push",
      "If the isolated consumer install gate fails, the release does not ship.",
    ],
    [path.join(root, "CHANGELOG.md")]: [
      "GitHub Packages",
      "React implementation exports",
      "isolated consumer install audit",
      "anti-duplication governance",
      "No breaking changes",
    ],
    [path.join(root, "agents/codex-agent.md")]: [
      "packages/specs/specs/unison.system.json",
      "Reject Work When",
      "Raw token values",
    ],
    [path.join(root, "prompts/component-authoring.md")]: [
      "Required Output",
      "Machine Contract",
      "Rejection Criteria",
    ],
  };

  for (const [file, snippets] of Object.entries(docs)) {
    if (!fs.existsSync(file)) {
      add("errors", file, 1, "Adoption documentation artifact is missing.");
      continue;
    }
    const source = read(file);
    for (const snippet of snippets) {
      if (!source.includes(snippet)) {
        add("errors", file, 1, `Adoption documentation must include ${snippet}.`);
      }
    }
  }

  const changelogFile = path.join(root, "CHANGELOG.md");
  const changelog = read(changelogFile);
  if (!changelog.includes(`## ${rootPackage.version}`)) {
    add("errors", changelogFile, 1, `CHANGELOG.md must include a heading for package version ${rootPackage.version}.`);
  }

  for (const file of [readmeFile, releaseFile, startFile]) {
    const source = read(file);
    for (const snippet of [
      "https://npm.pkg.github.com",
      "npm:@alohasoyrico-eng/flow@0.3.0-platform-mvp",
      "flow/react",
      "flow/components/styles.css",
      "flow/tokens/styles.css",
    ]) {
      if (!source.includes(snippet)) {
        add("errors", file, 1, `Install documentation must include ${snippet}.`);
      }
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
    if (file.includes(`${path.sep}packages${path.sep}react${path.sep}dist${path.sep}`) && source.includes("@design-system/components")) {
      add("errors", file, 1, "Published React dist must not import workspace-only @design-system/components; use package-relative imports.");
    }
    if (file.includes(`${path.sep}packages${path.sep}react${path.sep}dist${path.sep}`) && source.includes("@alohasoyrico-eng/flow")) {
      add("errors", file, 1, "Published React dist must use #flow/* private package imports so it works in source, file, alias, and GitHub Packages installs.");
    }
    if (file.includes(`${path.sep}packages${path.sep}react${path.sep}dist${path.sep}`) && source.includes("../../components/src")) {
      add("errors", file, 1, "Published React dist must not deep-import component source paths; use the #flow/* private package imports.");
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
