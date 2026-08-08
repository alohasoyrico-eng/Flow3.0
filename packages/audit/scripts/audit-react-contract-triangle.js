const { fs, path, root, read, add } = require("./audit-context.js");
const { contractBodyFor, inheritedReactPropNames, ownReactPropsFor, semanticInheritedPropsFor } = require("./react-contract-shared.js");
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
    const reactProps = new Set(ownReactPropsFor(types, componentName).map((prop) => prop.name));
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

module.exports = { checkReactContractTriangle };
