const forbiddenInheritedDomProps = [
  "contentEditable",
  "dangerouslySetInnerHTML",
  "style",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
];

function inheritedDomAttributeTypes(source) {
  const interfaceTypes = [...source.matchAll(/^export interface ([A-Za-z][A-Za-z0-9]*) extends ([^{]+)\{/gm)]
    .map(([, interfaceName, inheritedTypes]) => ({ interfaceName, inheritedTypes }));
  const aliasTypes = [...source.matchAll(/^export type ([A-Za-z][A-Za-z0-9]*)\s*=\s*([^;]+(?:;\n|$))/gm)]
    .map(([, interfaceName, inheritedTypes]) => ({ interfaceName, inheritedTypes }));

  return [...interfaceTypes, ...aliasTypes]
    .filter(({ inheritedTypes }) => /(?:^|[^A-Za-z])(?:HTMLAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)\b/.test(inheritedTypes));
}

function missingDomEscapeOmissions(inheritedTypes) {
  return forbiddenInheritedDomProps.filter((prop) => !inheritedTypes.includes(`"${prop}"`));
}

function checkDomEscapeTypeContract({ add, name, typesFile, types }) {
  const inheritedTypes = inheritedDomAttributeTypes(types);
  if (!inheritedTypes.length) {
    add("errors", typesFile, 1, `${name} React props must extend an explicit DOM attribute base through Omit<...HTMLAttributes...> so product code gets real typed events without Flow escape props.`);
  }
  for (const item of inheritedTypes) {
    if (!item.inheritedTypes.includes("Omit<")) {
      add("errors", typesFile, 1, `${name} React type ${item.interfaceName} must inherit DOM props through Omit<...> so Flow-owned props stay protected.`);
    }
    const missing = missingDomEscapeOmissions(item.inheritedTypes);
    if (missing.length) add("errors", typesFile, 1, `${name} React type ${item.interfaceName} must omit inherited DOM escape props (${missing.join(", ")}) so product code cannot bypass Flow-owned rendering.`);
  }
}

module.exports = {
  checkDomEscapeTypeContract,
  forbiddenInheritedDomProps,
  inheritedDomAttributeTypes,
  missingDomEscapeOmissions,
};
