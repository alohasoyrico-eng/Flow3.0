const { fs, path, root, read, readJson, add } = require("./audit-context.js");
const { checkReactPropContracts } = require("./react-prop-contract-audit.js");
const { checkDomEscapeTypeContract, forbiddenInheritedDomProps } = require("./react-dom-escape-contract.js");
const { checkDensityContractConsistency, checkReactDensityCascade, checkReactPublicDensityContract, checkStateContractConsistency } = require("./react-density-contract-audit.js");
const { checkRuntimeDomMutationContract } = require("./react-runtime-dom-mutation-audit.js");
const { checkReactComponentContentGuards } = require("./react-component-content-guards.js");
const { checkReactComponentComposition } = require("./react-composition-contract-audit.js");
const { checkControlledReactCoverage } = require("./react-controlled-contract-audit.js");
const { checkReactEffectContract } = require("./react-effect-contract-audit.js");
const { checkReactPrimaryInventory } = require("./audit-react-primary-inventory.js");
const { allowedDynamicStyleKeysByComponent } = require("./react-style-contracts.js");
const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const reactIndexFile = path.join(reactSrcDir, "index.js");
const reactTypesIndexFile = path.join(reactSrcDir, "index.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactRefTestFile = path.join(root, "packages/react/test/ref.test.mjs");
const rootPackageFile = path.join(root, "package.json");
const componentContractsFile = path.join(root, "packages/components/src/contracts.js");
const allowedPrimitiveImports = new Set([
  "createChartsPrimitive",
  "createMapsPrimitive",
  "countryFlagAssetPath",
  "countryCallingCodeOptions",
  "normalizeCountryCallingCodeOptions",
  "resolveCountryCallingCodeOption",
]);

function checkReactPrimaryContract() {
  const reactIndex = read(reactIndexFile);
  const reactTypesIndex = read(reactTypesIndexFile);
  const reactPackage = readJson(reactPackageFile);
  const rootPackage = readJson(rootPackageFile);
  const componentContractsSource = fs.existsSync(componentContractsFile) ? read(componentContractsFile) : "";
  const componentFiles = fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort();

  if (!componentFiles.length) {
    add("errors", reactSrcDir, 1, "React package must expose primary component source files.");
    return;
  }
  checkReactPrimaryInventory(componentFiles);

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
      componentContractsSource,
    });
  }

  checkOpenChangeContractConsistency(componentContractsSource);
  checkValueChangeContractConsistency(componentContractsSource);
  checkNoOpaqueFunctionContracts(componentContractsSource);
  checkStateContractConsistency({ add, contractsSource: componentContractsSource, componentContractsFile });
  checkControlledReactCoverage({ add, componentFiles, contractsSource: componentContractsSource });
  checkDensityContractConsistency({ add, contractsSource: componentContractsSource, componentContractsFile });
}

function checkOpenChangeContractConsistency(contractsSource) {
  for (const match of contractsSource.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, contractKey, body] = match;
    if (body.includes('{ name: "onOpenChange"') && !body.includes('{ name: "open"')) {
      add("errors", componentContractsFile, 1, `${contractKey} exposes onOpenChange and must also expose open so React can be controlled by product code.`);
    }
  }
}

function checkValueChangeContractConsistency(contractsSource) {
  for (const match of contractsSource.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, contractKey, body] = match;
    if (!body.includes('{ name: "onValueChange"')) continue;
    const hasControlledValue = ["value", "selectedKey", "from", "to", "country"]
      .some((name) => body.includes(`{ name: "${name}"`));
    if (!hasControlledValue) {
      add("errors", componentContractsFile, 1, `${contractKey} exposes onValueChange and must declare the controlled value prop that product code owns.`);
    }
  }
}

function checkNoOpaqueFunctionContracts(contractsSource) {
  for (const match of contractsSource.matchAll(/\bFunction\b/g)) {
    add("errors", componentContractsFile, lineForIndex(contractsSource, match.index), "Component contracts must use explicit callback signatures instead of opaque Function props.");
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
  const contractKey = lowerFirst(name);
  const contractBody = contractBodyFor(shared.componentContractsSource, contractKey);

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
    `export interface ${componentName}`,
    `displayName: "${name}"`,
    `platformContract: typeof ${contractName}`,
    `export const ${name}: ${componentName}`,
  ]) {
    if (!types.includes(snippet)) {
      add("errors", typesFile, 1, `${name} React types missing contract snippet: ${snippet}.`);
    }
  }
  if (!types.includes(`export interface ${propsName}`) && !types.includes(`export type ${propsName}`)) {
    add("errors", typesFile, 1, `${name} React types missing exported props contract: ${propsName}.`);
  }
  checkReactPublicDensityContract({ add, name, sourceFile, source, typesFile, types, reactTypesIndex: shared.reactTypesIndex, reactTypesIndexFile });

  checkReactPropContracts({ add, componentName: name, typesFile, types, contractBody });
  checkDomEscapeTypeContract({ add, name, typesFile, types });
  if (!shared.reactIndex.includes(`export { ${name} } from "./${file}"`)) {
    add("errors", reactIndexFile, 1, `React index must export ${name} from ${file}.`);
  }
  if (!shared.reactTypesIndex.includes(`${propsName}`)) {
    add("errors", reactTypesIndexFile, 1, `React type index must export ${propsName}.`);
  }
  if (!shared.reactTypesIndex.includes(`${componentName}`)) {
    add("errors", reactTypesIndexFile, 1, `React type index must export ${componentName} so consumers can type component references without deep imports.`);
  }
  const reactExport = shared.reactPackage.exports?.[packagePath];
  if (!reactExport || reactExport.default !== `./dist/${file}` || reactExport.types !== `./dist/${typeFile}`) {
    add("errors", reactPackageFile, 1, `@design-system/react must export ${packagePath} with default and types dist targets.`);
  }
  const rootReactExport = shared.rootPackage.exports?.[rootPackagePath];
  const expectedRootDefault = `./packages/react/dist/${file}`;
  const expectedRootTypes = `./packages/react/dist/${typeFile}`;
  if (!rootReactExport || rootReactExport.default !== expectedRootDefault || rootReactExport.types !== expectedRootTypes) {
    add("errors", rootPackageFile, 1, `Root package must export ${rootPackagePath} with React dist default and types targets.`);
  }

  for (const [artifact, artifactSource] of [[distFile, dist], [distTypesFile, distTypes]]) {
    if (artifactSource.includes("@design-system/components") || artifactSource.includes("../../components/src")) {
      add("errors", artifact, 1, `${name} published React artifact must use the #flow/* import contract, not workspace or deep component imports.`);
    }
    if (artifactSource.includes("apps/docs") || artifactSource.includes("#design-system/docs")) {
      add("errors", artifact, 1, `${name} published React artifact must not depend on docs.`);
    }
    checkPublishedLocalImports({ name, artifact, artifactSource });
  }
  if (source.includes("innerHTML") || source.includes("insertAdjacentHTML")) add("errors", sourceFile, 1, `${name} React source must not inject HTML strings as a parallel DOM implementation.`);
  checkInlineStyleContract({ name, sourceFile, source });
  checkRuntimeDomMutationContract({ name, sourceFile, source });
  checkReactEffectContract({ name, sourceFile, source });
  checkReactDensityCascade({ add, componentName: name, sourceFile, source });
  checkRestPropContract({ name, sourceFile, source });
  if (source.includes("createTransitional") || source.includes("createCard(") || source.includes("createTable(")) add("errors", sourceFile, 1, `${name} React source must not call component DOM factories; React is the primary implementation.`);
  if (source.includes("onOpenChange") && /\bopen\s*=\s*false\b/.test(source)) add("errors", sourceFile, 1, `${name} React source must preserve controlled vs uncontrolled open semantics; destructure open as openProp instead of defaulting to false.`);
  checkReactComponentContentGuards({ add, name, sourceFile, source });
  const componentImports = importsFromComponents(source);
  const illegalImports = componentImports.filter((item) => !allowedPrimitiveImports.has(item));
  if (illegalImports.length) {
    add("errors", sourceFile, 1, `${name} React source imports non-primitive implementation helpers from components: ${illegalImports.join(", ")}.`);
  }
  checkReactComponentComposition({ add, name, sourceFile, source });
}

function checkRestPropContract({ name, sourceFile, source }) {
  const directRestSpread = source.search(/^\s*\.\.\.rest,\s*$/m);
  if (directRestSpread >= 0) add("errors", sourceFile, 1, `${name} React source must sanitize rest props with flowRestProps(rest) so style cannot bypass Flow tokens.`);
  const restPropsFile = path.join(reactSrcDir, "internal/props.js");
  const restPropsSource = read(restPropsFile);
  for (const prop of forbiddenInheritedDomProps) {
    if (!restPropsSource.includes(prop)) add("errors", restPropsFile, 1, `flowRestProps must strip ${prop} so product code cannot bypass Flow-owned rendering.`);
  }
}

function checkPublishedLocalImports({ name, artifact, artifactSource }) {
  for (const match of artifactSource.matchAll(/from\s+"(\.[^"]+)"/g)) {
    const importPath = match[1];
    const resolved = path.join(path.dirname(artifact), importPath);
    const candidates = path.extname(resolved) ? [resolved] : [`${resolved}.js`, `${resolved}.d.ts`];
    if (!candidates.some((candidate) => fs.existsSync(candidate))) {
      add("errors", artifact, 1, `${name} published React artifact imports missing local file ${importPath}.`);
    }
  }
}

function checkInlineStyleContract({ name, sourceFile, source }) {
  const restStyleIndex = source.search(/\brest\.style\b/);
  if (restStyleIndex >= 0) add("errors", sourceFile, 1, `${name} React source must not merge rest.style into component-owned inline variables; expose Flow props/tokens instead.`);
  for (const match of source.matchAll(/style:\s*\{([\s\S]*?)\}/g)) {
    const body = match[1];
    const inlineKeys = [...body.matchAll(/(?:"([^"]+)"|'([^']+)'|([A-Za-z_$][\w$-]*))\s*:/g)]
      .map((keyMatch) => keyMatch[1] ?? keyMatch[2] ?? keyMatch[3])
      .filter(Boolean);
    const allowedInlineStyleKeys = allowedDynamicStyleKeysByComponent[name] ?? [];
    const illegalKeys = inlineKeys.filter((key) => !allowedInlineStyleKeys.includes(key));
    if (illegalKeys.length) {
      add("errors", sourceFile, 1, `${name} React source must not own inline visual styles (${illegalKeys.join(", ")}); use Flow tokens/classes and reserve style for approved dynamic CSS custom properties.`);
    }
    if (body.includes("...")) {
      add("errors", sourceFile, 1, `${name} React source must not merge arbitrary inline style objects; inline style is reserved for approved dynamic CSS custom properties.`);
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
function contractBodyFor(source, contractKey) {
  if (!source) return "";
  const match = source.match(new RegExp(`^\\\\s+${contractKey}:\\\\s*\\\\{([\\\\s\\\\S]*?)(?=^\\\\s+[a-z][A-Za-z0-9]*:\\\\s*\\\\{|\\\\n\\\\};)`, "m"));
  return match?.[1] ?? "";
}
module.exports = { allowedDynamicStyleKeysByComponent, checkReactPrimaryContract };
