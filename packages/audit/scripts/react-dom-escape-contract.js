const forbiddenInheritedDomProps = [
  "contentEditable",
  "dangerouslySetInnerHTML",
  "style",
  "suppressContentEditableWarning",
  "suppressHydrationWarning",
];

function inheritedDomAttributeTypes(source) {
  return [...source.matchAll(/^export interface ([A-Za-z][A-Za-z0-9]*) extends ([^{]+)\{/gm)]
    .map(([, interfaceName, inheritedTypes]) => ({ interfaceName, inheritedTypes }))
    .filter(({ inheritedTypes }) => /(?:^|[^A-Za-z])(?:HTMLAttributes|ButtonHTMLAttributes|InputHTMLAttributes|TextareaHTMLAttributes)\b/.test(inheritedTypes));
}

function missingDomEscapeOmissions(inheritedTypes) {
  return forbiddenInheritedDomProps.filter((prop) => !inheritedTypes.includes(`"${prop}"`));
}

function checkDomEscapeTypeContract({ add, name, typesFile, types }) {
  for (const { interfaceName, inheritedTypes } of inheritedDomAttributeTypes(types)) {
    const missing = missingDomEscapeOmissions(inheritedTypes);
    if (missing.length) add("errors", typesFile, 1, `${name} React type ${interfaceName} must omit inherited DOM escape props (${missing.join(", ")}) so product code cannot bypass Flow-owned rendering.`);
  }
}

module.exports = {
  checkDomEscapeTypeContract,
  forbiddenInheritedDomProps,
  inheritedDomAttributeTypes,
  missingDomEscapeOmissions,
};
