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

module.exports = {
  contractBodyFor,
  inheritedReactPropNames,
  lowerFirst,
  semanticInheritedPropsFor,
  unionValues,
};
