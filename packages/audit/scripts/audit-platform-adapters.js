const { fs, path, root, read, add } = require("./audit-context.js");
const adapterIndexFile = path.join(root, "packages/components/src/platforms/index.js");
const componentIndexFile = path.join(root, "packages/components/src/index.js");
const componentPackageFile = path.join(root, "packages/components/package.json");
const componentCssFile = path.join(root, "packages/components/styles/components.css");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const reactIndexTypesFile = path.join(root, "packages/react/src/index.d.ts");
const reactPackageFile = path.join(root, "packages/react/package.json");
const reactExampleFile = path.join(root, "examples/prototyping/react-button.mjs");
const forbiddenPrefix = "fl" + "ow-";

const { components } = require("./platform-adapter-components.js");

function checkPlatformAdapters() {
  const adapterIndex = read(adapterIndexFile);
  const componentIndex = read(componentIndexFile);
  const componentPackage = read(componentPackageFile);
  const componentCss = read(componentCssFile);
  const contracts = read(contractsFile);
  const reactIndex = read(reactIndexFile);
  const reactIndexTypes = read(reactIndexTypesFile);
  const reactPackage = read(reactPackageFile);
  const reactExample = read(reactExampleFile);

  if (!componentIndex.includes("./platforms/index.js")) {
    add("errors", componentIndexFile, 1, "Component package must export platform implementation contracts from the public entrypoint.");
  }
  if (!componentPackage.includes('"./platforms"')) {
    add("errors", componentPackageFile, 1, "@design-system/components must expose ./platforms as a public package boundary.");
  }

  for (const component of components) {
    checkComponent(component, { adapterIndex, contracts, reactIndex, reactIndexTypes, reactPackage });
  }

  if (!reactExample.includes('import { Button } from "@design-system/react"') || !reactExample.includes('import "@design-system/components/styles.css"')) {
    add("errors", reactExampleFile, 1, "React prototype example must consume the React component entrypoint and component CSS.");
  }

  for (const cssDependency of ["--comp-button-size: var(--sys-density-control-height)", "--comp-button-padding: var(--sys-density-control-padding-x)", "--comp-button-icon-size", ".button[data-density=\"md\"]"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Button CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-icon-button-size: var(--sys-density-control-height)", "--comp-icon-button-icon-size", ".icon-button[data-density=\"md\"]"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Icon Button CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-input-control-size: var(--sys-density-control-height)", "--comp-input-padding-x", ".field[data-density=\"sm\"]", ".field[data-density=\"lg\"]", ".field__control", ".input"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Input CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-select-control-size: var(--sys-density-control-height)", "--comp-select-padding-start", ".select-control[data-density=\"sm\"]", ".select-control[data-density=\"lg\"]", ".select-control__trigger"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Select CSS must expose cascade dependency ${cssDependency}.`);
  }
}

function checkComponent(component, shared) {
  const adapterFile = path.join(root, `packages/components/src/platforms/${component.id}.js`);
  const reactFile = path.join(root, `packages/react/src/${component.files[0]}`);
  const reactTypesFile = path.join(root, `packages/react/src/${component.files[1]}`);
  const reactDistFile = path.join(root, `packages/react/dist/${component.files[0]}`);
  const reactDistTypesFile = path.join(root, `packages/react/dist/${component.files[1]}`);

  for (const file of [adapterFile, reactFile, reactTypesFile, reactDistFile, reactDistTypesFile]) {
    if (!fs.existsSync(file)) {
      add("errors", file, 1, "Platform implementation contract is missing.");
      return;
    }
  }

  const adapter = read(adapterFile);
  const react = read(reactFile);
  const reactTypes = read(reactTypesFile);

  for (const exportName of component.exports) {
    if (!shared.adapterIndex.includes(exportName)) add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
    if (!adapter.includes(exportName)) add("errors", adapterFile, 1, `${component.label} platform adapter must define ${exportName}.`);
  }
  for (const snippet of ["react:", 'renderMode: "component"', 'implementationRole: "primary-product-component"', "sourceOfTruth: true", `componentContracts.${component.contractKey}`]) {
    if (!adapter.includes(snippet)) add("errors", adapterFile, 1, `${component.label} platform contract missing ${snippet}.`);
  }
  if (adapter.includes("dom:") || adapter.includes('renderMode: "factory"') || adapter.includes('implementationRole: "transitional-static-renderer"')) {
    add("errors", adapterFile, 1, `${component.label} platform contract must not advertise a DOM target once React is the public product component.`);
  }
  for (const token of component.requiredTokens) {
    if (!adapter.includes(token)) add("errors", adapterFile, 1, `${component.label} platform contract must include token dependency ${token}.`);
  }
  for (const primitive of component.primitives) {
    if (!adapter.includes(`"${primitive}"`)) add("errors", adapterFile, 1, `${component.label} platform contract must include primitive dependency ${primitive}.`);
  }
  for (const prop of component.props) {
    if (!shared.contracts.includes(`name: "${prop}"`)) add("errors", contractsFile, 1, `${component.label} contract is missing prop ${prop}.`);
  }
  for (const snippet of component.jsSnippets) {
    if (!react.includes(snippet)) add("errors", reactFile, 1, `React primary component missing required snippet: ${snippet}.`);
  }
  for (const snippet of component.typeSnippets) {
    if (!reactTypes.includes(snippet)) add("errors", reactTypesFile, 1, `React primary component types missing required snippet: ${snippet}.`);
  }
  if (!shared.reactPackage.includes(`"${component.packagePath}"`)) {
    add("errors", reactPackageFile, 1, `React package must export ${component.packagePath}.`);
  }
  if (!shared.reactIndex.includes(component.exportName)) {
    add("errors", reactIndexFile, 1, `React index must export ${component.exportName}.`);
  }
  if (!shared.reactIndexTypes.includes(component.propsName)) {
    add("errors", reactIndexTypesFile, 1, `React type index must export ${component.propsName}.`);
  }
  for (const [file, source] of [[adapterFile, adapter], [reactFile, react]]) {
    if (source.includes(forbiddenPrefix)) {
      add("errors", file, 1, "Platform implementation contracts must not expose the forbidden public product prefix.");
    }
  }
}

module.exports = { checkPlatformAdapters };
