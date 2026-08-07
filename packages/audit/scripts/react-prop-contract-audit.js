const { inheritedReactPropNames, semanticInheritedPropsFor } = require("./react-contract-shared.js");

function propsBodyFor(types, componentName) {
  return types.match(new RegExp(`export interface ${componentName}Props[^\\\\{]*\\\\{([\\\\s\\\\S]*?)\\\\n\\\\}`))?.[1] ?? "";
}

function ownPropsFor(types, componentName) {
  return [...propsBodyFor(types, componentName).matchAll(/^\\s*([A-Za-z][A-Za-z0-9]*)(\\?)?:/gm)]
    .map((match) => ({ name: match[1], required: !match[2] }));
}

function contractPropsFor(contractBody) {
  return [...contractBody.matchAll(/\{ name: "([^"]+)", type: [^\n]+ required: (true|false) \}/g)]
    .map((match) => ({ name: match[1], required: match[2] === "true" }));
}

function checkPublicCallbackContract({ add, componentName, typesFile, types, contractBody }) {
  const propsBody = propsBodyFor(types, componentName);
  if (!propsBody || !contractBody) return;
  const publicCallbacks = [...propsBody.matchAll(/^\\s*(on[A-Z][A-Za-z0-9]*)\\??:/gm)]
    .map((match) => match[1]);
  const missing = publicCallbacks.filter((callbackName) => !contractBody.includes(`{ name: "${callbackName}"`));
  if (missing.length) {
    add("errors", typesFile, 1, `${componentName} React types expose public callbacks missing from component contract: ${missing.join(", ")}.`);
  }
}

function checkPublicPropContract({ add, componentName, typesFile, types, contractBody }) {
  if (!contractBody) return;
  const publicProps = ownPropsFor(types, componentName)
    .map((prop) => prop.name)
    .filter((propName) => !inheritedReactPropNames.has(propName));
  const missing = publicProps.filter((propName) => !contractBody.includes(`{ name: "${propName}"`));
  if (missing.length) {
    add("errors", typesFile, 1, `${componentName} React types expose public props missing from component contract: ${missing.join(", ")}.`);
  }
}

function checkSemanticInheritedPropContract({ add, componentName, typesFile, types, contractBody }) {
  const requiredProps = semanticInheritedPropsFor(componentName);
  if (!requiredProps.length || !contractBody) return;
  const missing = requiredProps
    .filter((propName) => new RegExp(`\\b${propName}\\??:`).test(types))
    .filter((propName) => !contractBody.includes(`{ name: "${propName}"`));
  if (missing.length) {
    add("errors", typesFile, 1, `${componentName} React types expose semantic inherited props missing from component contract: ${missing.join(", ")}.`);
  }
}

function checkRequiredPropContract({ add, componentName, typesFile, types, contractBody }) {
  if (!contractBody) return;
  const typeProps = new Map(ownPropsFor(types, componentName).map((prop) => [prop.name, prop.required]));
  for (const prop of contractPropsFor(contractBody)) {
    if (!typeProps.has(prop.name)) continue;
    if (typeProps.get(prop.name) !== prop.required) {
      add("errors", typesFile, 1, `${componentName} contract required flag disagrees with React type for ${prop.name}.`);
    }
  }
}

function checkReactPropContracts(args) {
  checkPublicCallbackContract(args);
  checkPublicPropContract(args);
  checkSemanticInheritedPropContract(args);
  checkRequiredPropContract(args);
}

module.exports = { checkReactPropContracts };
