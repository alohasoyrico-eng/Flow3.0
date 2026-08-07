const {
  path,
  root,
  read,
  add,
} = require("./audit-context.js");

const contractsFile = path.join(root, "packages/components/src/contracts.js");
const packageCssFile = path.join(root, "packages/components/styles/components.css");
const sourceFiles = {
  actions: path.join(root, "packages/components/src/components/actions.js"),
  choices: path.join(root, "packages/components/src/components/choices.js"),
  commerce: path.join(root, "packages/components/src/components/commerce.js"),
  display: path.join(root, "packages/components/src/components/display.js"),
  feedback: path.join(root, "packages/components/src/components/feedback.js"),
  fields: path.join(root, "packages/components/src/components/fields.js"),
  interactions: path.join(root, "packages/components/src/components/interactions.js"),
  navigation: path.join(root, "packages/components/src/components/navigation.js"),
  overlays: path.join(root, "packages/components/src/components/overlays.js"),
  specializedInputs: path.join(root, "packages/components/src/components/specialized-inputs.js"),
};

const directDensityComponents = [
  { id: "button", factory: "createTransitionalActionButton", source: "actions", selector: '.button[data-density="sm"]', token: "--button-current-size" },
  { id: "iconButton", factory: "createTransitionalActionIconButton", source: "actions", selector: '.icon-button[data-density="sm"]', token: "--icon-button-size" },
  { id: "spinner", factory: "createSpinner", source: "feedback", selector: '.spinner[data-density="sm"]', token: "--comp-spinner-size" },
  { id: "breadcrumbs", factory: "createBreadcrumbs", source: "navigation", selector: '.breadcrumbs[data-density="sm"]', token: "--comp-breadcrumbs-target-block" },
  { id: "pagination", factory: "createPagination", source: "navigation", selector: '.pagination[data-density="sm"]', token: "--comp-pagination-size" },
  { id: "stepper", factory: "createStepper", source: "navigation", selector: '.stepper[data-density="sm"]', token: "--comp-stepper-marker-size" },
];

const reactDensityComponents = [
  { id: "input", file: path.join(root, "packages/react/src/Input.js"), selector: '.field[data-density="sm"]', token: null, snippets: ['"data-density": density || undefined'] },
  { id: "select", file: path.join(root, "packages/react/src/Select.js"), selector: '.select-control[data-density="sm"]', token: null, snippets: ['"data-density": density || undefined'] },
  { id: "switch", file: path.join(root, "packages/react/src/Switch.js"), selector: '.switch[data-density="sm"]', token: "--switch-track-width", snippets: ['"data-density": density || undefined'] },
  { id: "textArea", file: path.join(root, "packages/react/src/TextArea.js"), selector: '.field[data-density="sm"]', token: null, snippets: ['"data-density": density || undefined'] },
];

const delegatedDensityComponents = [
  { id: "combobox", factory: "createCombobox", source: "fields", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "cardNumberInput", factory: "createTransitionalPaymentCardNumberInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "cardExpiryInput", factory: "createTransitionalPaymentCardExpiryInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "cardSecurityCodeInput", factory: "createTransitionalPaymentCardSecurityCodeInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "codeInput", factory: "createTransitionalSecurityCodeInput", source: "specializedInputs", delegate: "createFieldShell", selector: '.field[data-density="sm"]' },
  { id: "countrySelector", factory: "createCountrySelector", source: "specializedInputs", delegate: "createSelectControl", selector: '.select-control[data-density="sm"]' },
  { id: "phoneInput", factory: "createTransitionalPhoneInput", source: "specializedInputs", delegate: "createFieldShell and createCountrySelector", selector: '.field[data-density="sm"]' },
  { id: "datePicker", factory: "createTransitionalDatePicker", source: "specializedInputs", delegate: "createFieldShell", selector: '.date-picker[data-density="sm"]' },
  { id: "dateRangePicker", factory: "createTransitionalDateRangePicker", source: "specializedInputs", delegate: "date-picker shell", selector: '.date-picker[data-density="sm"]' },
];

const contextInheritedDensityComponents = new Set(["button", "cardExpiryInput", "cardNumberInput", "cardSecurityCodeInput", "codeInput", "datePicker", "dateRangePicker", "iconButton", "phoneInput"]);

function checkDensityContracts() {
  const contracts = read(contractsFile);
  const css = read(packageCssFile);
  const allComponents = [...directDensityComponents, ...delegatedDensityComponents];

  for (const component of allComponents) {
    if (!contractDeclaresDensity(contracts, component.id)) {
      add("errors", contractsFile, 1, `${component.id} must declare density before package source can expose density variants.`);
    }
    const source = read(sourceFiles[component.source]);
    const body = factoryBody(source, component.factory);
    if (!body) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must exist for density contract enforcement.`);
      continue;
    }
    if (contextInheritedDensityComponents.has(component.id) && body.includes('density = "md"')) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must inherit density from context; do not default density to md.`);
    } else if (!contextInheritedDensityComponents.has(component.id) && !body.includes('density = "md"')) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must default density to md.`);
    }
  }

  for (const component of directDensityComponents) {
    const source = read(sourceFiles[component.source]);
    const body = factoryBody(source, component.factory);
    if (contextInheritedDensityComponents.has(component.id) && !/if\s*\(density\)\s*\w+\.dataset\.density\s*=\s*density/.test(body)) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must only write data-density when density is explicitly supplied.`);
    } else if (!contextInheritedDensityComponents.has(component.id) && !/dataset\.density\s*=\s*(?:density|resolvedDensity)/.test(body) && !body.includes("createFieldShell({")) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must expose data-density on its package root.`);
    }
    checkCssDensity(css, component.selector, component.token, component.id);
  }

  for (const component of delegatedDensityComponents) {
    const source = read(sourceFiles[component.source]);
    const body = factoryBody(source, component.factory);
    if (!body.includes("density")) {
      add("errors", sourceFiles[component.source], 1, `${component.factory} must forward density to its owned package shell.`);
    }
    checkCssDensity(css, component.selector, null, component.id);
  }

  for (const component of reactDensityComponents) {
    if (!contractDeclaresDensity(contracts, component.id)) {
      add("errors", contractsFile, 1, `${component.id} must declare density before React source can expose density variants.`);
    }
    const source = read(component.file);
    for (const snippet of component.snippets) {
      if (!source.includes(snippet)) {
        add("errors", component.file, 1, `${component.id} React implementation must inherit density by writing ${snippet}.`);
      }
    }
    if (source.includes('density = "md"')) {
      add("errors", component.file, 1, `${component.id} React implementation must inherit density from context; do not default density to md.`);
    }
    checkCssDensity(css, component.selector, component.token, component.id);
  }

  const selectControlBody = functionBody(read(sourceFiles.fields), "createSelectControl");
  if (!/if\s*\(density\)\s*control\.dataset\.density\s*=\s*density/.test(selectControlBody)) {
    add("errors", sourceFiles.fields, 1, "Select control must only expose data-density when density is explicitly supplied.");
  }

}

function contractDeclaresDensity(contracts, id) {
  const keyIndex = contracts.indexOf(`${id}: {`);
  if (keyIndex < 0) return false;
  const nextComponentIndex = contracts.indexOf("\n  },", keyIndex);
  const block = contracts.slice(keyIndex, nextComponentIndex > keyIndex ? nextComponentIndex : keyIndex + 1200);
  return block.includes('name: "density"');
}

function factoryBody(source, factoryName) {
  return functionBody(source, factoryName);
}

function functionBody(source, name) {
  const startPattern = new RegExp(`(?:export\\s+)?function\\s+${name}\\s*\\(`);
  const match = startPattern.exec(source);
  if (!match) return "";
  const nextMatch = /\n(?:export\s+)?function\s+[A-Za-z0-9_]+\s*\(/g;
  nextMatch.lastIndex = match.index + 1;
  const next = nextMatch.exec(source);
  return source.slice(match.index, next?.index ?? source.length);
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

module.exports = { checkDensityContracts };
