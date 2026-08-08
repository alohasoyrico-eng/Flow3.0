const {
  fs,
  path,
  root,
  read,
  add,
} = require("./audit-context.js");

const contractsFile = path.join(root, "packages/components/src/contracts.js");
const packageCssFile = path.join(root, "packages/components/styles/components.css");
const reactSrcDir = path.join(root, "packages/react/src");

const cssDensityContracts = {
  breadcrumbs: { selector: '.breadcrumbs[data-density="sm"]', token: "--comp-breadcrumbs-target-block" },
  button: { selector: '.button[data-density="sm"]', token: "--button-current-size" },
  card: { selector: '.card[data-density="sm"]', token: "--comp-card-padding" },
  chartPanel: { selector: '.chart-panel[data-density="sm"]', token: "--comp-chart-panel-plot-size" },
  codeInput: { selector: '.code-input[data-density="sm"]', token: "--comp-code-input-slot-block-size-sm" },
  iconButton: { selector: '.icon-button[data-density="sm"]', token: "--icon-button-size" },
  pagination: { selector: '.pagination[data-density="sm"]', token: "--comp-pagination-size" },
  spinner: { selector: '.spinner[data-density="sm"]', token: "--comp-spinner-size" },
  stepper: { selector: '.stepper[data-density="sm"]', token: "--comp-stepper-marker-size" },
  switch: { selector: '.switch[data-density="sm"]', token: "--switch-track-width" },
  table: { selector: '.table[data-density="sm"]', token: "--comp-table-cell-padding-block-sm" },
};

function checkDensityContracts() {
  const contracts = read(contractsFile);
  const css = read(packageCssFile);
  const reactFiles = reactComponentFiles();
  const densityContracts = contractIdsWithDensity(contracts);

  for (const id of densityContracts) {
    const component = reactFiles.get(id);
    if (!component) {
      add("errors", contractsFile, 1, `${id} declares density but has no matching React source component.`);
      continue;
    }

    const source = read(component.file);
    if (!source.includes("flowDensityProps(")) {
      add("errors", component.file, 1, `${component.name} must route density through flowDensityProps() so theme/density cascade stays centralized.`);
    }
    if (source.includes('"data-density"')) {
      add("errors", component.file, 1, `${component.name} must not write data-density directly; use flowDensityProps().`);
    }
    if (/\bdensity\s*=\s*["'](?:sm|md|lg)["']|\bdensity:\s*["'](?:sm|md|lg)["']/.test(source)) {
      add("errors", component.file, 1, `${component.name} must not assign local fixed density; inherit density unless product code opts in.`);
    }
    if (/validDensities\.has\(density\)\s*\?\s*density\s*:\s*["'](?:sm|md|lg)["']/.test(source)) {
      add("errors", component.file, 1, `${component.name} normalizeDensity() must fall back to undefined, not a fixed density.`);
    }
    if (/\bdensity\s*(?:\?\?|\|\|)\s*["'](?:sm|md|lg)["']/.test(source) || /\bdensity:\s*[^,\n]*(?:\?\?|\|\|)\s*["'](?:sm|md|lg)["']/.test(source)) {
      add("errors", component.file, 1, `${component.name} must not fallback child density to a fixed value; pass inherited density or omit it.`);
    }
    if (/\b(?:resolvedDensity|currentDensity|childDensity|densityValue)\s*=\s*[^;\n?]+\?\s*["'](?:sm|md|lg)["']/.test(source)) {
      add("errors", component.file, 1, `${component.name} must not derive density from variant/state with a fixed ternary value; density is owned by Flow cascade or explicit density prop.`);
    }

    const cssContract = cssDensityContracts[id];
    if (cssContract) checkCssDensity(css, cssContract.selector, cssContract.token, id);
  }
}

function reactComponentFiles() {
  const files = new Map();
  for (const file of fs.readdirSync(reactSrcDir)) {
    if (!/^[A-Z].*\.js$/.test(file)) continue;
    const name = path.basename(file, ".js");
    files.set(lowerFirst(name), { name, file: path.join(reactSrcDir, file) });
  }
  return files;
}

function contractIdsWithDensity(contracts) {
  const ids = [];
  for (const match of contracts.matchAll(/^\s+([a-z][A-Za-z0-9]*):\s*\{([\s\S]*?)(?=^\s+[a-z][A-Za-z0-9]*:\s*\{|\n\};)/gm)) {
    const [, id, body] = match;
    if (body.includes('{ name: "density"')) ids.push(id);
  }
  return ids;
}

function checkCssDensity(css, smSelector, token, id) {
  const lgSelector = smSelector.replace('[data-density="sm"]', '[data-density="lg"]');
  if (!css.includes(smSelector)) {
    add("errors", packageCssFile, 1, `${id} must define sm density CSS for ${smSelector}.`);
  }
  if (!css.includes(lgSelector)) {
    add("errors", packageCssFile, 1, `${id} must define lg density CSS for ${lgSelector}.`);
  }
  if (token && !css.includes(token)) {
    add("errors", packageCssFile, 1, `${id} density CSS must use ${token} instead of one-off sizing.`);
  }
}

function lowerFirst(value) {
  return value ? value[0].toLowerCase() + value.slice(1) : value;
}

module.exports = { checkDensityContracts };
