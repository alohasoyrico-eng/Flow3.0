const densityAwareChildComponents = [
  "Avatar",
  "Badge",
  "Button",
  "Card",
  "Chip",
  "Combobox",
  "Dialog",
  "Drawer",
  "IconButton",
  "Input",
  "Menu",
  "Popover",
  "ProgressIndicator",
  "Select",
  "Spinner",
  "Tag",
  "Tooltip",
];

function checkReactDensityCascade({ add, componentName, sourceFile, source }) {
  if (/new Set\(\s*\[\s*["']sm["']\s*,\s*["']md["']\s*,\s*["']lg["']\s*\]\s*\)/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must use normalizeFlowDensity() from internal/props.js instead of redefining the density vocabulary.`);
  }
  if (/function normalize\(value,\s*(?:allowed|valid),\s*fallback\)\s*\{\s*return (?:allowed|valid)\.has\(value\) \? value : fallback;\s*\}/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must use normalizeFlowValue() from internal/props.js instead of duplicating generic value normalization.`);
  }
  if (source.includes('"data-variant"') || source.includes('"data-state"') || source.includes('"data-tone"')) {
    add("errors", sourceFile, 1, `${componentName} React source must emit semantic data attributes through flowVariantProps(), flowStateProps(), or flowToneProps().`);
  }
  if (/\bflowVariantProps\(\s*variant\s*\)/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must pass a resolved variant into flowVariantProps(); normalize raw variant props through the component contract first.`);
  }
  if (/\bflowToneProps\(\s*item\.tone\b/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must normalize item tone props before passing them into flowToneProps().`);
  }
  if (/if \(state && state !== "default"\) return state;/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must normalize explicit state props against the component state contract before returning them.`);
  }
  if (source.includes('"data-density"')) {
    add("errors", sourceFile, 1, `${componentName} React source must use flowDensityProps() instead of writing data-density directly.`);
  }
  if (/\bdensity\s*=\s*["'](?:sm|md|lg)["']|\bdensity:\s*["'](?:sm|md|lg)["']/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must not assign a local default density; density must inherit through the Flow cascade unless product code opts in.`);
  }
  if (/\bdensity\s*(?:\?\?|\|\|)\s*["'](?:sm|md|lg)["']/.test(source) || /\bdensity:\s*[^,\n]*(?:\?\?|\|\|)\s*["'](?:sm|md|lg)["']/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must not fallback nested component density to a fixed value; pass inherited density or omit it.`);
  }
  if (/\bdensity:\s*[^,\n?]+\?\s*["'](?:sm|md|lg)["']/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must not remap nested component density with a fixed ternary value; pass inherited density or an explicit child override prop.`);
  }
  if (/\b(?:resolvedDensity|currentDensity|childDensity|densityValue)\s*=\s*[^;\n?]+\?\s*["'](?:sm|md|lg)["']/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must not derive component density from variant/state with a fixed ternary value; density is owned by the Flow cascade or explicit density prop.`);
  }
  if (/\bdensity\s*\?\?\s*size\b|\bsize\s*\?\?\s*density\b/.test(source)) {
    add("errors", sourceFile, 1, `${componentName} React source must not treat density as a size alias; density controls cascade while size is an explicit component prop.`);
  }
  checkComposedChildDensity({ add, componentName, sourceFile, source });
}

function checkComposedChildDensity({ add, componentName, sourceFile, source }) {
  for (const child of densityAwareChildComponents) {
    const callPattern = new RegExp(`React\\.createElement\\(${child},\\s*\\{`, "g");
    let match;
    while ((match = callPattern.exec(source))) {
      const objectStart = match.index + match[0].length - 1;
      const propsObject = readObjectLiteral(source, objectStart);
      if (!propsObject) continue;
      if (!/\bdensity\s*(?:,|:|})/.test(propsObject)) {
        add("errors", sourceFile, 1, `${componentName} composes density-aware ${child} without forwarding density; pass inherited density or an explicit child override prop.`);
      }
    }
  }
}

function readObjectLiteral(source, startIndex) {
  let depth = 0;
  let quote = "";
  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];
    const previous = source[index - 1];
    if (quote) {
      if (char === quote && previous !== "\\") quote = "";
      continue;
    }
    if (char === "\"" || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") depth -= 1;
    if (depth === 0) return source.slice(startIndex, index + 1);
  }
  return "";
}

function checkDensityContractConsistency({ add, contractsSource, componentContractsFile }) {
  for (const match of contractsSource.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, contractKey, body] = match;
    if (!body.includes('{ name: "density"')) continue;
    if (!body.includes('{ name: "density", type: "\\"sm\\" | \\"md\\" | \\"lg\\"", required: false }')) {
      add("errors", componentContractsFile, 1, `${contractKey} density must use the shared Flow density contract: "sm" | "md" | "lg".`);
    }
  }
}

function checkStateContractConsistency({ add, contractsSource, componentContractsFile }) {
  for (const match of contractsSource.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, contractKey, body] = match;
    if (body.includes('{ name: "state", type: "string"')) {
      add("errors", componentContractsFile, 1, `${contractKey} state prop must use an explicit union from its component contract, not string.`);
    }
  }
}

module.exports = {
  checkDensityContractConsistency,
  checkReactDensityCascade,
  checkStateContractConsistency,
};
