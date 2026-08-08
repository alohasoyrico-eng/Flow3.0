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

module.exports = {
  inheritedReactPropNames,
  semanticInheritedPropsFor,
};
