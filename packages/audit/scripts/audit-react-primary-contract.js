const { fs, path, root, read, readJson, add } = require("./audit-context.js");

const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const reactIndexFile = path.join(reactSrcDir, "index.js");
const reactTypesIndexFile = path.join(reactSrcDir, "index.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactRefTestFile = path.join(root, "packages/react/test/ref.test.mjs");
const rootPackageFile = path.join(root, "package.json");

const allowedPrimitiveImports = new Set([
  "createChartsPrimitive",
  "createMapsPrimitive",
  "countryFlagAssetPath",
  "countryCallingCodeOptions",
  "normalizeCountryCallingCodeOptions",
  "resolveCountryCallingCodeOption",
]);

const allowedInlineStyleKeys = [
  "--chart-index",
  "--chart-target",
  "--chart-value",
  "--comp-segmented-control-count",
  "--comp-segmented-control-index",
  "--comp-tree-view-depth-offset",
  "--progress-value",
];

function checkReactPrimaryContract() {
  const reactIndex = read(reactIndexFile);
  const reactTypesIndex = read(reactTypesIndexFile);
  const reactPackage = readJson(reactPackageFile);
  const rootPackage = readJson(rootPackageFile);
  const componentFiles = fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort();

  if (!componentFiles.length) {
    add("errors", reactSrcDir, 1, "React package must expose primary component source files.");
    return;
  }

  if (!reactPackage?.scripts?.test?.includes("test/ref.test.mjs")) {
    add("errors", reactPackageFile, 1, "React package test script must run test/ref.test.mjs so ForwardRefExoticComponent is verified at runtime.");
  }
  if (!fs.existsSync(reactRefTestFile)) {
    add("errors", reactRefTestFile, 1, "React package must include a runtime ref forwarding test for all contracted components.");
  } else {
    const refTest = read(reactRefTestFile);
    for (const snippet of ["componentContracts", "React.createRef()", "ref.current instanceof HTMLElement"]) {
      if (!refTest.includes(snippet)) {
        add("errors", reactRefTestFile, 1, `React ref test must derive coverage from contracts and assert runtime refs: ${snippet}.`);
      }
    }
  }

  for (const file of componentFiles) {
    checkReactComponent(file, {
      reactIndex,
      reactTypesIndex,
      reactPackage,
      rootPackage,
    });
  }
}

function checkReactComponent(file, shared) {
  const name = path.basename(file, ".js");
  const typeFile = `${name}.d.ts`;
  const sourceFile = path.join(reactSrcDir, file);
  const typesFile = path.join(reactSrcDir, typeFile);
  const distFile = path.join(reactDistDir, file);
  const distTypesFile = path.join(reactDistDir, typeFile);
  const source = read(sourceFile);
  const types = read(typesFile);
  const dist = fs.existsSync(distFile) ? read(distFile) : "";
  const distTypes = fs.existsSync(distTypesFile) ? read(distTypesFile) : "";
  const packagePath = `./${kebab(name)}`;
  const rootPackagePath = `./react/${kebab(name)}`;
  const propsName = `${name}Props`;
  const componentName = `${name}Component`;
  const contractName = `${lowerFirst(name)}PlatformContract`;

  for (const requiredFile of [typesFile, distFile, distTypesFile]) {
    if (!fs.existsSync(requiredFile)) {
      add("errors", requiredFile, 1, `${name} must have source types and built dist artifacts.`);
    }
  }

  for (const snippet of [
    "forwardRef(function",
    `export const ${name} = forwardRef`,
    `${name}.displayName = "${name}"`,
    `${name}.platformContract = ${contractName}`,
    "React.createElement(",
  ]) {
    if (!source.includes(snippet)) {
      add("errors", sourceFile, 1, `${name} React source missing primary implementation snippet: ${snippet}.`);
    }
  }

  for (const snippet of [
    "ForwardRefExoticComponent",
    "RefAttributes<",
    `export interface ${propsName}`,
    `export interface ${componentName}`,
    `displayName: "${name}"`,
    `platformContract: typeof ${contractName}`,
    `export const ${name}: ${componentName}`,
  ]) {
    if (!types.includes(snippet)) {
      add("errors", typesFile, 1, `${name} React types missing contract snippet: ${snippet}.`);
    }
  }

  if (!shared.reactIndex.includes(`export { ${name} } from "./${file}"`)) {
    add("errors", reactIndexFile, 1, `React index must export ${name} from ${file}.`);
  }
  if (!shared.reactTypesIndex.includes(`${propsName}`)) {
    add("errors", reactTypesIndexFile, 1, `React type index must export ${propsName}.`);
  }
  const reactExport = shared.reactPackage.exports?.[packagePath];
  if (!reactExport || reactExport.default !== `./dist/${file}` || reactExport.types !== `./dist/${typeFile}`) {
    add("errors", reactPackageFile, 1, `@design-system/react must export ${packagePath} with default and types dist targets.`);
  }
  if (shared.rootPackage.exports?.[rootPackagePath] !== `./packages/react/dist/${file}`) {
    add("errors", rootPackageFile, 1, `Root package must export ${rootPackagePath} to React dist.`);
  }

  for (const [artifact, artifactSource] of [[distFile, dist], [distTypesFile, distTypes]]) {
    if (artifactSource.includes("@design-system/components") || artifactSource.includes("../../components/src")) {
      add("errors", artifact, 1, `${name} published React artifact must use the #flow/* import contract, not workspace or deep component imports.`);
    }
    if (artifactSource.includes("apps/docs") || artifactSource.includes("#design-system/docs")) {
      add("errors", artifact, 1, `${name} published React artifact must not depend on docs.`);
    }
  }

  if (source.includes("innerHTML") || source.includes("insertAdjacentHTML")) {
    add("errors", sourceFile, 1, `${name} React source must not inject HTML strings as a parallel DOM implementation.`);
  }
  checkInlineStyleContract({ name, sourceFile, source });
  if (source.includes("createTransitional") || source.includes("createCard(") || source.includes("createTable(")) {
    add("errors", sourceFile, 1, `${name} React source must not call component DOM factories; React is the primary implementation.`);
  }
  const componentImports = importsFromComponents(source);
  const illegalImports = componentImports.filter((item) => !allowedPrimitiveImports.has(item));
  if (illegalImports.length) {
    add("errors", sourceFile, 1, `${name} React source imports non-primitive implementation helpers from components: ${illegalImports.join(", ")}.`);
  }
}

function checkInlineStyleContract({ name, sourceFile, source }) {
  for (const match of source.matchAll(/style:\s*\{([\s\S]*?)\}/g)) {
    const body = match[1];
    const chunk = source.slice(match.index, match.index + 360);
    const inlineKeys = [...body.matchAll(/(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$-]*))\s*:/g)]
      .map((keyMatch) => keyMatch[1] ?? keyMatch[2] ?? keyMatch[3])
      .filter(Boolean);
    const illegalKeys = inlineKeys.filter((key) => !allowedInlineStyleKeys.includes(key));
    if (illegalKeys.length) {
      add("errors", sourceFile, 1, `${name} React source must not own inline visual styles (${illegalKeys.join(", ")}); use Flow tokens/classes and reserve style for approved dynamic CSS custom properties.`);
    }
    const spreadCount = (body.match(/\.\.\./g) ?? []).length;
    if (spreadCount > 1 || (spreadCount === 1 && !chunk.includes("...(rest.style ?? {})"))) {
      add("errors", sourceFile, 1, `${name} React source must not merge arbitrary inline style objects except top-level rest.style passthrough when dynamic CSS variables are required.`);
    }
  }
}

function importsFromComponents(source) {
  const imports = [];
  for (const match of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*"@design-system\/components"/g)) {
    imports.push(...match[1].split(",").map((item) => item.trim().replace(/\s+as\s+.+$/, "")).filter(Boolean));
  }
  return imports;
}

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function lowerFirst(value) {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

module.exports = { checkReactPrimaryContract };
