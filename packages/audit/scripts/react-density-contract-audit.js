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

module.exports = {
  checkDensityContractConsistency,
  checkReactDensityCascade,
};
