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
  checkOrderedComponentDensityAliases(css, tokens);
}

function checkOrderedComponentDensityAliases(css, tokens) {
  const resolver = createCssValueResolver(css, tokens);
  const requiredScales = [
    {
      label: "Checkbox mark size",
      names: ["--comp-checkbox-mark-size-sm", "--comp-checkbox-mark-size-md", "--comp-checkbox-mark-size-lg"],
    },
    {
      label: "Checkbox indicator icon size",
      names: ["--comp-checkbox-indicator-size-sm", "--comp-checkbox-indicator-size-md", "--comp-checkbox-indicator-size-lg"],
      expected: [16, 20, 24],
    },
    {
      label: "RadioButton mark size",
      names: ["--comp-radio-button-mark-size-sm", "--comp-radio-button-mark-size-md", "--comp-radio-button-mark-size-lg"],
    },
    {
      label: "Button icon size",
      names: ["--comp-button-icon-size-sm", "--comp-button-icon-size-md", "--comp-button-icon-size-lg"],
      expected: [16, 20, 24],
    },
    {
      label: "Input icon size",
      names: ["--comp-input-icon-size-sm", "--comp-input-icon-size-md", "--comp-input-icon-size-lg"],
      expected: [16, 20, 24],
    },
    {
      label: "IconButton icon size",
      names: ["--comp-icon-button-icon-size-sm", "--comp-icon-button-icon-size-md", "--comp-icon-button-icon-size-lg"],
      expected: [16, 20, 24],
    },
    {
      label: "Switch thumb size",
      names: ["--comp-switch-thumb-size-sm", "--comp-switch-thumb-size-md", "--comp-switch-thumb-size-lg"],
    },
    {
      label: "Button block size",
      names: ["--comp-button-size-sm", "--comp-button-size-md", "--comp-button-size-lg"],
    },
    {
      label: "Field control size",
      names: ["--comp-input-control-size-sm", "--comp-input-control-size-md", "--comp-input-control-size-lg"],
    },
    {
      label: "Select option row size",
      names: ["--comp-select-option-min-size-sm", "--comp-select-option-min-size-md", "--comp-select-option-min-size-lg"],
    },
    {
      label: "Select option check icon size",
      names: ["--comp-select-option-check-size-sm", "--comp-select-option-check-size-md", "--comp-select-option-check-size-lg"],
      expected: [16, 20, 24],
    },
    {
      label: "Combobox option check icon size",
      names: ["--comp-combobox-option-check-size-sm", "--comp-combobox-option-check-size-md", "--comp-combobox-option-check-size-lg"],
      expected: [16, 20, 24],
    },
    {
      label: "Menu item icon size",
      names: ["--comp-menu-item-icon-size-sm", "--comp-menu-item-icon-size-md", "--comp-menu-item-icon-size-lg"],
      expected: [16, 20, 24],
    },
  ];

  for (const scale of requiredScales) {
    const values = scale.names.map((name) => resolver(name));
    if (values.some((value) => !Number.isFinite(value))) {
      add("errors", packageCssFile, 1, `${scale.label} density aliases must resolve to numeric px values; got ${scale.names.map((name, index) => `${name}=${values[index]}`).join(", ")}.`);
      continue;
    }
    const [sm, md, lg] = values;
    if (!(sm < md && md < lg)) {
      add("errors", packageCssFile, 1, `${scale.label} density aliases must be ordered sm < md < lg; got sm=${sm}px, md=${md}px, lg=${lg}px.`);
    }
    if (scale.expected && !scale.expected.every((expected, index) => values[index] === expected)) {
      add("errors", packageCssFile, 1, `${scale.label} must resolve to the shared Flow icon density scale ${scale.expected.join("/")}; got sm=${sm}px, md=${md}px, lg=${lg}px.`);
    }
  }
}

function createCssValueResolver(css, tokens) {
  const values = new Map();
  for (const match of css.matchAll(/(--[\w-]+):\s*([^;]+);/g)) {
    values.set(match[1], match[2].trim());
  }
  for (const [name, token] of Object.entries(tokens?.tokens ?? {})) {
    if (token?.cssVariable && token?.value) values.set(token.cssVariable, String(token.value).trim());
    if (token?.value) values.set(`--${name}`, String(token.value).trim());
  }

  function resolve(name, seen = new Set()) {
    if (seen.has(name)) return Number.NaN;
    seen.add(name);
    const raw = values.get(name);
    if (!raw) return Number.NaN;

    const numeric = raw.match(/^(-?\d+(?:\.\d+)?)px$/);
    if (numeric) return Number(numeric[1]);

    const rem = raw.match(/^(-?\d+(?:\.\d+)?)rem$/);
    if (rem) return Number(rem[1]) * 16;

    const varOnly = raw.match(/^var\((--[\w-]+)\)$/);
    if (varOnly) return resolve(varOnly[1], seen);

    if (raw.startsWith("calc(") && raw.endsWith(")")) {
      return resolveCalculation(raw.slice(5, -1), seen);
    }

    return Number.NaN;
  }

  function resolveCalculation(expression, seen) {
    let resolved = expression.replace(/var\((--[\w-]+)\)/g, (_, name) => {
      const value = resolve(name, new Set(seen));
      return Number.isFinite(value) ? String(value) : "NaN";
    });
    resolved = resolved.replace(/(-?\d+(?:\.\d+)?)px\b/g, "$1");
    if (!/^[\d\s.+\-*/()Na]+$/.test(resolved) || resolved.includes("NaN")) return Number.NaN;
    try {
      const result = Function(`"use strict"; return (${resolved});`)();
      return Number.isFinite(result) ? result : Number.NaN;
    } catch {
      return Number.NaN;
    }
  }

  return resolve;
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
