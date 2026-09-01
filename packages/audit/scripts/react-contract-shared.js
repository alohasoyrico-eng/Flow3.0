const fs = require("fs");
const path = require("path");

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

function propsForBody(body, { inline = false } = {}) {
  const pattern = inline
    ? /(?:^|[;{\n])\s*([A-Za-z][A-Za-z0-9]*)(\?)?:/gm
    : /^\s*([A-Za-z][A-Za-z0-9]*)(\?)?:/gm;
  return [...String(body).matchAll(pattern)]
    .map((match) => ({ name: match[1], required: !match[2] }));
}

function aliasPropsFor(types, aliasName) {
  const match = types.match(new RegExp(`export type ${escapeRegExp(aliasName)}\\s*=\\s*([\\s\\S]*?)(?=\\nexport\\s)`, "m"));
  if (!match) return [];
  return [...match[1].matchAll(/\{([\s\S]*?)\}/g)]
    .flatMap((body) => propsForBody(body[1], { inline: true }));
}

function ownReactPropsFor(types, componentName) {
  const props = propsForBody(propsBodyFor(types, componentName));
  const aliasNames = types
    .match(new RegExp(`export type ${componentName}Props\\s*=\\s*([\\s\\S]*?)\\s*&\\s*\\{`, "m"))?.[1]
    ?.split("&")
    .map((part) => part.trim())
    .filter((part) => /^[A-Z][A-Za-z0-9]*$/.test(part) && part !== "FlowDataAttributes") ?? [];
  for (const aliasName of aliasNames) props.push(...aliasPropsFor(types, aliasName));
  return props.filter((prop, index) => props.findIndex((item) => item.name === prop.name) === index);
}

function propTypeExpression(types, componentName, propName) {
  return propsBodyFor(types, componentName)
    .match(new RegExp(`^\\s*${escapeRegExp(propName)}\\??:\\s*([^;]+);`, "m"))?.[1]?.trim() ?? "";
}

function aliasUnionValues(types, aliasName) {
  const aliasMatch = types.match(new RegExp(`export type ${escapeRegExp(aliasName)}\\s*=\\s*([^;]+);`));
  return aliasMatch ? unionValues(aliasMatch[1]) : [];
}

function importedAliasUnionValues(types, aliasName) {
  const reactSrcDir = path.resolve(__dirname, "../../react/src");
  for (const match of types.matchAll(/import type \{([^}]+)\} from "([^"]+)";/g)) {
    const importedNames = match[1].split(",").map((name) => name.trim().split(/\s+as\s+/).pop()).filter(Boolean);
    if (!importedNames.includes(aliasName) || !match[2].startsWith(".")) continue;
    const importedTypesFile = path.resolve(reactSrcDir, match[2].replace(/\.js$/, ".d.ts"));
    if (!importedTypesFile.startsWith(reactSrcDir) || !fs.existsSync(importedTypesFile)) continue;
    const importedTypes = fs.readFileSync(importedTypesFile, "utf8");
    const importedValues = aliasUnionValues(importedTypes, aliasName);
    if (importedValues.length) return importedValues;
  }
  return [];
}

function reactAllowedValues(types, componentName, propName) {
  const typeExpression = propTypeExpression(types, componentName, propName);
  const inlineValues = unionValues(typeExpression);
  if (inlineValues.length) return inlineValues;
  const aliasName = typeExpression.match(/\b[A-Z][A-Za-z0-9]*\b/)?.[0];
  if (!aliasName) return [];
  return aliasUnionValues(types, aliasName).concat(importedAliasUnionValues(types, aliasName));
}

module.exports = {
  aliasUnionValues,
  contractBodyFor,
  inheritedReactPropNames,
  lowerFirst,
  ownReactPropsFor,
  propTypeExpression,
  propsBodyFor,
  importedAliasUnionValues,
  reactAllowedValues,
  semanticInheritedPropsFor,
  unionValues,
};
