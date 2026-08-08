const { fs, path, root, read, add, goldComponents } = require("./audit-context.js");
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

function contractBodyFor(source, contractKey) {
  if (!source) return "";
  const match = source.match(new RegExp(`^\\s+${contractKey}:\\s*\\{([\\s\\S]*?)(?=^\\s+[a-z][A-Za-z0-9]*:\\s*\\{|\\n\\};)`, "m"));
  return match?.[1] ?? "";
}

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
  checkPlatformComponentInventory();
  checkAllPlatformFilesHaveReactPrimary({ adapterIndex, reactIndex, reactIndexTypes, reactPackage });

  if (!reactExample.includes('import { Button } from "@design-system/react"') || !reactExample.includes('import "@design-system/components/styles.css"')) {
    add("errors", reactExampleFile, 1, "React prototype example must consume the React component entrypoint and component CSS.");
  }

  for (const cssDependency of ["--comp-button-size: var(--component-density-control-height)", "--comp-button-padding: var(--component-density-control-padding-x)", "--comp-button-icon-size", ".button[data-density=\"sm\"]", ".button[data-density=\"lg\"]"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Button CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-icon-button-size: var(--component-density-control-height)", "--comp-icon-button-icon-size", ".icon-button[data-density=\"sm\"]", ".icon-button[data-density=\"lg\"]"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Icon Button CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-input-control-size: var(--component-density-control-height)", "--comp-input-padding-x", ".field[data-density=\"sm\"]", ".field[data-density=\"lg\"]", ".field__control", ".input"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Input CSS must expose cascade dependency ${cssDependency}.`);
  }
  for (const cssDependency of ["--comp-select-control-size: var(--component-density-control-height)", "--comp-select-padding-start", ".select-control[data-density=\"sm\"]", ".select-control[data-density=\"lg\"]", ".select-control__trigger"]) {
    if (!componentCss.includes(cssDependency)) add("errors", componentCssFile, 1, `Select CSS must expose cascade dependency ${cssDependency}.`);
  }
}

function checkPlatformComponentInventory() {
  const platformsDir = path.join(root, "packages/components/src/platforms");
  const componentIds = fs.readdirSync(platformsDir)
    .filter((file) => file.endsWith(".js") && file !== "index.js")
    .map((file) => path.basename(file, ".js"))
    .sort();
  const checkedIds = components.map((component) => component.id).sort();
  const expectedIds = [...goldComponents].sort();
  const missing = expectedIds.filter((id) => !componentIds.includes(id));
  const extra = componentIds.filter((id) => !goldComponents.includes(id));
  const checkedOutsideGovernance = checkedIds.filter((id) => !goldComponents.includes(id));
  if (missing.length) {
    add("errors", path.join(root, "packages/components/src/platforms"), 1, `Platform adapter files are missing accepted components: ${missing.join(", ")}.`);
  }
  if (extra.length) {
    add("errors", path.join(root, "packages/components/src/platforms"), 1, `Platform adapter files include components outside goldComponents governance: ${extra.join(", ")}.`);
  }
  if (checkedOutsideGovernance.length) {
    add("errors", path.join(root, "packages/audit/scripts/platform-adapter-components.js"), 1, `Detailed platform adapter checks include components outside goldComponents governance: ${checkedOutsideGovernance.join(", ")}.`);
  }
}

function checkAllPlatformFilesHaveReactPrimary(shared) {
  const platformsDir = path.join(root, "packages/components/src/platforms");
  for (const fileName of fs.readdirSync(platformsDir).filter((file) => file.endsWith(".js") && file !== "index.js").sort()) {
    const adapterFile = path.join(platformsDir, fileName);
    const id = path.basename(fileName, ".js");
    const adapter = read(adapterFile);
    const componentName = adapter.match(/componentName:\s*["']([^"']+)["']/)?.[1];
    const exportedNames = [
      ...adapter.matchAll(/export const ([A-Za-z0-9]+Platform(?:Adapters|Contract))\b/g),
      ...adapter.matchAll(/export function ([A-Za-z0-9]+PlatformProps)\b/g),
    ].map((match) => match[1]);

    if (!componentName) {
      add("errors", adapterFile, 1, `${id} platform adapter must declare its React componentName.`);
      continue;
    }
    if (!adapter.includes('implementationRole: "primary-product-component"') || !adapter.includes("sourceOfTruth: true")) {
      add("errors", adapterFile, 1, `${componentName} platform adapter must declare React as the primary source of truth.`);
    }
    for (const requiredExport of ["PlatformContract", "PlatformAdapters", "PlatformProps"]) {
      if (!exportedNames.some((exportName) => exportName.endsWith(requiredExport))) {
        add("errors", adapterFile, 1, `${componentName} platform adapter must export ${requiredExport}.`);
      }
    }

    for (const exportName of exportedNames) {
      if (!shared.adapterIndex.includes(exportName)) {
        add("errors", adapterIndexFile, 1, `Platform index must export ${exportName}.`);
      }
    }
    for (const file of [
      path.join(root, `packages/react/src/${componentName}.js`),
      path.join(root, `packages/react/src/${componentName}.d.ts`),
      path.join(root, `packages/react/dist/${componentName}.js`),
      path.join(root, `packages/react/dist/${componentName}.d.ts`),
    ]) {
      if (!fs.existsSync(file)) add("errors", file, 1, `${componentName} React primary implementation is missing for ${id}.`);
    }
    if (!shared.reactPackage.includes(`"./${id}"`)) {
      add("errors", reactPackageFile, 1, `React package must export ./${id}.`);
    }
    if (!shared.reactIndex.includes(componentName)) {
      add("errors", reactIndexFile, 1, `React index must export ${componentName}.`);
    }
    if (!shared.reactIndexTypes.includes(`${componentName}Props`)) {
      add("errors", reactIndexTypesFile, 1, `React type index must export ${componentName}Props.`);
    }
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
  const contractBody = contractBodyFor(shared.contracts, component.contractKey);

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
  if (!contractBody) {
    add("errors", contractsFile, 1, `${component.label} contract block is missing for ${component.contractKey}.`);
  }
  for (const prop of component.props) {
    if (!contractBody.includes(`name: "${prop}"`)) add("errors", contractsFile, 1, `${component.label} contract is missing prop ${prop}.`);
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
