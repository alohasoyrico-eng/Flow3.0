const {
  fs,
  path,
  root,
  read,
  add,
} = require("./audit-context.js");

const contractsFile = path.join(root, "packages/components/src/contracts.js");
const packageCssFile = path.join(root, "packages/components/styles/components.css");
const tokensFile = path.join(root, "packages/tokens/tokens.json");
const reactSrcDir = path.join(root, "packages/react/src");

const cssDensityContracts = {
  breadcrumbs: { selector: '.breadcrumbs[data-density="sm"]', token: "--comp-breadcrumbs-target-block" },
  button: { selector: '.button[data-density="sm"]', token: "--comp-button-current-size" },
  card: { selector: '.card[data-density="sm"]', token: "--comp-card-current-padding" },
  chartPanel: { selector: '.chart-panel[data-density="sm"]', token: "--comp-chart-panel-plot-size" },
  checkbox: { selector: '.checkbox[data-density="sm"]', token: "--comp-choice-current-mark-size" },
  codeInput: { selector: '.code-input[data-density="sm"]', token: "--comp-code-input-current-slot-block-size" },
  iconButton: { selector: '.icon-button[data-density="sm"]', token: "--comp-icon-button-current-size" },
  input: { selector: '.field[data-density="sm"]', token: "--comp-field-control-size" },
  pagination: { selector: '.pagination[data-density="sm"]', token: "--comp-pagination-size" },
  radioButton: { selector: '.radio[data-density="sm"]', token: "--comp-choice-current-mark-size" },
  select: { selector: '.select-control[data-density="sm"]', token: "--comp-select-current-control-size" },
  spinner: { selector: '.spinner[data-density="sm"]', token: "--comp-spinner-size" },
  stepper: { selector: '.stepper[data-density="sm"]', token: "--comp-stepper-marker-size" },
  switch: { selector: '.switch[data-density="sm"]', token: "--comp-switch-current-track-width" },
  table: { selector: '.table[data-density="sm"]', token: "--comp-table-cell-padding-block-sm" },
};

function checkDensityContracts() {
  const contracts = read(contractsFile);
  const css = read(packageCssFile);
  const reactFiles = reactComponentFiles();
  const densityContracts = contractIdsWithDensity(contracts);
  const explicitMediumSelectors = [...css.matchAll(/^\.[^{\n]+?\[data-density="md"\][^{]*\{/gm)].map((match) => match[0].trim());

  if (explicitMediumSelectors.length) {
    add("errors", packageCssFile, 1, `Component CSS must not define explicit md density selectors; medium is the inherited base cascade. Found: ${explicitMediumSelectors.join(", ")}`);
  }

  checkControlSizeScale(css);

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
    if (source.includes("resolvedDensity || undefined") || source.includes("(resolvedDensity || undefined)")) {
      add("errors", component.file, 1, `${component.name} must pass normalized density directly; normalizeFlowDensity() already returns undefined for inherited density.`);
    }
    if (/\b(?:resolvedDensity|currentDensity|childDensity|densityValue)\s*=\s*[^;\n?]+\?\s*["'](?:sm|md|lg)["']/.test(source)) {
      add("errors", component.file, 1, `${component.name} must not derive density from variant/state with a fixed ternary value; density is owned by Flow cascade or explicit density prop.`);
    }

    const cssContract = cssDensityContracts[id];
    if (cssContract) checkCssDensity(css, cssContract.selector, cssContract.token, id);
  }
}

function checkControlSizeScale(css) {
  const tokens = JSON.parse(read(tokensFile));
  const required = [
    ["--component-button-size-sm: var(--sys-frame-height-control-sm);", "Button sm size must use the system sm control height."],
    ["--component-button-size-md: var(--component-density-control-height);", "Button md size must use the system density control height."],
    ["--component-button-size-lg: var(--sys-frame-height-control-lg);", "Button lg size must use the system lg control height."],
    ["--component-field-control-size-sm: var(--sys-frame-height-control-sm);", "Field/Input sm size must use the system sm control height."],
    ["--component-field-control-size-md: var(--sys-frame-height-control-md);", "Field/Input md size must use the system md control height."],
    ["--component-field-control-size-lg: var(--sys-frame-height-control-lg);", "Field/Input lg size must use the system lg control height."],
    ["--comp-input-control-size: var(--component-density-control-height);", "Input inherited md size must stay on the density cascade."],
    ["--comp-select-control-size: var(--component-density-control-height);", "Select inherited md size must stay on the density cascade."],
  ];

  for (const [snippet, message] of required) {
    if (!css.includes(snippet)) add("errors", packageCssFile, 1, message);
  }

  checkOrderedControlSizeTokens(tokens);
}

function checkOrderedControlSizeTokens(tokens) {
  const sm = pxToken(tokens, "ref-frame-height-control-sm");
  const md = pxToken(tokens, "ref-frame-height-control-md");
  const lg = pxToken(tokens, "ref-frame-height-control-lg");
  if (!(sm < md && md < lg)) {
    add("errors", tokensFile, 1, `Control density heights must be ordered sm < md < lg; got sm=${sm}px, md=${md}px, lg=${lg}px.`);
  }

  const compactSm = pxToken(tokens, "ref-frame-height-control-sm-compact");
  const compactMd = pxToken(tokens, "ref-frame-height-control-md-compact");
  const compactLg = pxToken(tokens, "ref-frame-height-control-lg-compact");
  if (!(compactSm < compactMd && compactMd < compactLg)) {
    add("errors", tokensFile, 1, `Compact control density heights must be ordered sm < md < lg; got sm=${compactSm}px, md=${compactMd}px, lg=${compactLg}px.`);
  }

  const comfortableSm = pxToken(tokens, "ref-frame-height-control-sm-comfortable");
  const comfortableMd = pxToken(tokens, "ref-frame-height-control-md-comfortable");
  const comfortableLg = pxToken(tokens, "ref-frame-height-control-lg-comfortable");
  if (!(comfortableSm < comfortableMd && comfortableMd < comfortableLg)) {
    add("errors", tokensFile, 1, `Comfortable control density heights must be ordered sm < md < lg; got sm=${comfortableSm}px, md=${comfortableMd}px, lg=${comfortableLg}px.`);
  }
}

function pxToken(tokens, name) {
  const rawValue = tokens?.tokens?.[name]?.value ?? tokens?.[name]?.value;
  const match = typeof rawValue === "string" ? rawValue.match(/^(\d+(?:\.\d+)?)px$/) : null;
  if (!match) {
    add("errors", tokensFile, 1, `${name} must be a px token so density ordering can be audited.`);
    return Number.NaN;
  }
  return Number(match[1]);
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
