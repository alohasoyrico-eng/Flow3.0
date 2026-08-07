const { fs, path, root, read, add } = require("./audit-context.js");
const { inheritedReactPropNames, semanticInheritedPropsFor } = require("./react-contract-shared.js");
const { components } = require("./platform-adapter-components.js");

const reactSrcDir = path.join(root, "packages/react/src");
const componentContractsFile = path.join(root, "packages/components/src/contracts.js");

function checkReactContractTriangle() {
  const contractsSource = read(componentContractsFile);
  for (const component of components) {
    const componentName = component.exportName;
    const props = component.props ?? [];
    if (!props.length) continue;

    const typesFile = path.join(reactSrcDir, `${componentName}.d.ts`);
    if (!fs.existsSync(typesFile)) continue;

    const types = read(typesFile);
    const reactProps = new Set(ownPropsFor(types, componentName));
    const contractBody = contractBodyFor(contractsSource, component.contractKey);
    const semanticInherited = new Set(semanticInheritedPropsFor(componentName));

    for (const prop of props) {
      const isInherited = inheritedReactPropNames.has(prop) && !semanticInherited.has(prop);
      if (!isInherited && !reactProps.has(prop)) {
        add("errors", typesFile, 1, `${componentName} platform inventory declares ${prop}, but React props do not expose it.`);
      }
      if (!contractBody.includes(`{ name: "${prop}"`)) {
        add("errors", componentContractsFile, 1, `${componentName} platform inventory declares ${prop}, but component contract does not list it.`);
      }
    }
  }
}

function ownPropsFor(types, componentName) {
  const body = types.match(new RegExp(`export interface ${componentName}Props[^\\{]*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? "";
  return [...body.matchAll(/^\s*([A-Za-z][A-Za-z0-9]*)(\?)?:/gm)].map((match) => match[1]);
}

function contractBodyFor(source, contractKey) {
  return source.match(new RegExp(`^\\s+${contractKey}:\\s*\\{([\\s\\S]*?)(?=^\\s+[a-z][A-Za-z0-9]*:\\s*\\{|\\n\\};)`, "m"))?.[1] ?? "";
}

module.exports = { checkReactContractTriangle };
