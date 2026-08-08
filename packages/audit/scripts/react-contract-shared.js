const inheritedReactPropNames = new Set([
  "children",
  "className",
  "style",
  "id",
  "role",
  "tabIndex",
  "title",
  "href",
  "onClick",
  "name",
  "placeholder",
  "disabled",
  "required",
  "type",
  "inputMode",
  "rows",
  "maxLength",
  "min",
  "max",
  "value",
  "checked",
  "defaultValue",
]);

const semanticInheritedPropsByComponent = {
  StationPin: ["value"],
};

function semanticInheritedPropsFor(componentName) {
  return semanticInheritedPropsByComponent[componentName] ?? [];
}

function lowerFirst(value) {
  return `${value.charAt(0).toLowerCase()}${value.slice(1)}`;
}

function contractBodyFor(source, contractKey) {
  if (!source) return "";
  const match = source.match(new RegExp(`^\\s+${contractKey}:\\s*\\{([\\s\\S]*?)(?=^\\s+[a-z][A-Za-z0-9]*:\\s*\\{|\\n\\};)`, "m"));
  return match?.[1] ?? "";
}

function unionValues(typeExpression) {
  return [...String(typeExpression).replaceAll('\\"', '"').matchAll(/"([^"]+)"/g)].map((match) => match[1]);
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function propsBodyFor(types, componentName) {
  return types.match(new RegExp(`export interface ${componentName}Props[^\\{]*\\{([\\s\\S]*?)\\n\\}`))?.[1]
    ?? types.match(new RegExp(`export type ${componentName}Props\\s*=\\s*[\\s\\S]*?&\\s*\\{([\\s\\S]*?)\\n\\};`))?.[1]
    ?? "";
}

function ownReactPropsFor(types, componentName) {
  return [...propsBodyFor(types, componentName).matchAll(/^\s*([A-Za-z][A-Za-z0-9]*)(\?)?:/gm)]
    .map((match) => ({ name: match[1], required: !match[2] }));
}

function propTypeExpression(types, componentName, propName) {
  return propsBodyFor(types, componentName)
    .match(new RegExp(`^\\s*${escapeRegExp(propName)}\\??:\\s*([^;]+);`, "m"))?.[1]?.trim() ?? "";
}

function aliasUnionValues(types, aliasName) {
  const aliasMatch = types.match(new RegExp(`export type ${escapeRegExp(aliasName)}\\s*=\\s*([^;]+);`));
  return aliasMatch ? unionValues(aliasMatch[1]) : [];
}

function reactAllowedValues(types, componentName, propName) {
  const typeExpression = propTypeExpression(types, componentName, propName);
  const inlineValues = unionValues(typeExpression);
  if (inlineValues.length) return inlineValues;
  const aliasName = typeExpression.match(/\b[A-Z][A-Za-z0-9]*\b/)?.[0];
  return aliasName ? aliasUnionValues(types, aliasName) : [];
}

module.exports = {
  aliasUnionValues,
  contractBodyFor,
  inheritedReactPropNames,
  lowerFirst,
  ownReactPropsFor,
  propTypeExpression,
  propsBodyFor,
  reactAllowedValues,
  semanticInheritedPropsFor,
  unionValues,
};
