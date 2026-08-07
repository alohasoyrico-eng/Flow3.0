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
