const {
  add,
  path,
  read,
  requiredComponentContracts,
  root,
} = require("./audit-context.js");

const registryFile = path.join(root, "packages/components/src/registry.js");
const indexFile = path.join(root, "packages/components/src/index.js");
const removedDocsAdapterFiles = [
  "apps/docs/component-demo-adapter.js",
  "apps/docs/component-core-demo-adapter.js",
  "apps/docs/component-surface-demo-adapter.js",
  "apps/docs/component-table-demo-adapter.js",
].map((file) => path.join(root, file));
const docsRendererFile = path.join(root, "apps/docs/component-demo.js");
const unprefixedFactoryComponents = new Map([
  ["badge", "createBadge"],
  ["card", "createCard"],
  ["chip", "createChip"],
  ["empty-state", "createEmptyState"],
  ["error-panel", "createErrorPanel"],
  ["floating-action-button", "createFloatingActionButton"],
  ["inline-validation", "createInlineValidation"],
  ["tag", "createTag"],
  ["phone-input", "createPhoneInput"],
  ["progress-indicator", "createProgressIndicator"],
  ["spinner", "createSpinner"],
  ["date-picker", "createDatePicker"],
  ["skeleton", "createSkeleton"],
  ["avatar", "createAvatar"],
  ["list", "createList"],
  ["kpi-tile", "createKpiTile"],
  ["audit-event", "createAuditEvent"],
  ["table", "createTable"],
  ["chart-panel", "createChartPanel"],
  ["station-pin", "createStationPin"],
  ["route-summary", "createRouteSummary"],
  ["card-summary", "createCardSummary"],
  ["movement-row", "createMovementRow"],
  ["quick-action", "createQuickAction"],
  ["tabs", "createTabs"],
  ["accordion", "createAccordion"],
  ["slider", "createSlider"],
  ["tree-view", "createTreeView"],
  ["segmented-control", "createSegmentedControl"],
  ["breadcrumbs", "createBreadcrumbs"],
  ["pagination", "createPagination"],
  ["stepper", "createStepper"],
  ["tooltip", "createTooltip"],
  ["toast", "createToast"],
  ["dialog", "createDialog"],
  ["menu", "createMenu"],
  ["drawer", "createDrawer"],
  ["popover", "createPopover"],
  ["motion-boundary", "createMotionBoundary"],
  ["animated-moment", "createAnimatedMoment"],
  ["biometric-prompt", "createBiometricPrompt"],
]);

function checkComponentRegistry() {
  const registrySource = read(registryFile);
  const indexSource = read(indexFile);

  for (const component of requiredComponentContracts) {
    const key = component.includes("-") ? `"${component}"` : component;
    if (["button", "card-expiry-input", "card-number-input", "card-security-code-input", "checkbox", "code-input", "icon-button", "input", "radio-button", "select", "switch", "text-area"].includes(component)) {
      const label = component === "button" ? "Button" : component === "card-expiry-input" ? "Card Expiry Input" : component === "card-number-input" ? "Card Number Input" : component === "card-security-code-input" ? "Card Security Code Input" : component === "checkbox" ? "Checkbox" : component === "code-input" ? "Code Input" : component === "icon-button" ? "Icon Button" : component === "input" ? "Input" : component === "radio-button" ? "Radio Button" : component === "switch" ? "Switch" : component === "text-area" ? "Text Area" : "Select";
      const factory = component === "button" ? "createTransitionalActionButton" : component === "card-expiry-input" ? "createTransitionalPaymentCardExpiryInput" : component === "card-number-input" ? "createTransitionalPaymentCardNumberInput" : component === "card-security-code-input" ? "createTransitionalPaymentCardSecurityCodeInput" : component === "checkbox" ? "createTransitionalChoiceCheckbox" : component === "code-input" ? "createTransitionalSecurityCodeInput" : component === "icon-button" ? "createTransitionalActionIconButton" : component === "input" ? "createTransitionalFieldInput" : component === "radio-button" ? "createTransitionalChoiceRadioButton" : component === "switch" ? "createTransitionalChoiceSwitch" : component === "text-area" ? "createTransitionalFieldTextArea" : "createTransitionalFieldSelect";
      if (!registrySource.includes(`${label} is React-primary`) || registrySource.includes(`${key}: ${factory}`)) {
        add("errors", registryFile, 1, `${label} registry entry must reject DOM rendering and route docs through the React component.`);
      }
      continue;
    }
    const expectedFactory = unprefixedFactoryComponents.get(component);
    const expectedFactoryReference = expectedFactory ? `${key}: ${expectedFactory}` : `${key}: create`;
    if (!registrySource.includes(expectedFactoryReference)) {
      add("errors", registryFile, 1, `Package component registry missing gold component: ${component}.`);
    }
  }

  for (const exportName of ["componentRegistry", "renderComponent", "renderComponentDemo", "componentDemoProps", "listComponents", "hasComponent"]) {
    if (!indexSource.includes(exportName)) {
      add("errors", indexFile, 1, `Design System package index must export ${exportName}.`);
    }
  }

  if (!registrySource.includes("componentDemoProps") || !registrySource.includes("renderComponentDemo")) {
    add("errors", registryFile, 1, "Package component registry must own demo prop normalization and demo rendering.");
  }

  const docsRendererSource = read(docsRendererFile);
  if (!docsRendererSource.includes("renderComponentDemo")) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must consume the official Design System registry demo renderer.");
  }
  for (const snippet of ["componentDemoProps", "reactButtonDemo", 'data-react-component="button"', 'if (component === "button") return reactButtonDemo(demo);', "reactCardExpiryInputDemo", 'data-react-component="card-expiry-input"', 'if (component === "card-expiry-input") return reactCardExpiryInputDemo(demo);', "reactCardNumberInputDemo", 'data-react-component="card-number-input"', 'if (component === "card-number-input") return reactCardNumberInputDemo(demo);', "reactCardSecurityCodeInputDemo", 'data-react-component="card-security-code-input"', 'if (component === "card-security-code-input") return reactCardSecurityCodeInputDemo(demo);', "reactCheckboxDemo", 'data-react-component="checkbox"', 'if (component === "checkbox") return reactCheckboxDemo(demo);', "reactCodeInputDemo", 'data-react-component="code-input"', 'if (component === "code-input") return reactCodeInputDemo(demo);', "reactInputDemo", 'data-react-component="input"', 'if (component === "input") return reactInputDemo(demo);', "reactRadioButtonDemo", 'data-react-component="radio-button"', 'if (component === "radio-button") return reactRadioButtonDemo(demo);', "reactSelectDemo", 'data-react-component="select"', 'if (component === "select") return reactSelectDemo(demo);', "reactSwitchDemo", 'data-react-component="switch"', 'if (component === "switch") return reactSwitchDemo(demo);', "reactTextAreaDemo", 'data-react-component="text-area"', 'if (component === "text-area") return reactTextAreaDemo(demo);']) {
    if (!docsRendererSource.includes(snippet)) {
      add("errors", docsRendererFile, 1, `Docs Button demo must mount the React component before registry DOM rendering; missing ${snippet}.`);
    }
  }
  if (docsRendererSource.indexOf('if (component === "button") return reactButtonDemo(demo);') > docsRendererSource.indexOf("renderComponentDemo(component, demo)")) {
    add("errors", docsRendererFile, 1, "Docs Button demo must short-circuit to React before calling renderComponentDemo.");
  }
  if (/import\s+\{[^}]*create[A-Z]/.test(docsRendererSource) || /\bcreate[A-Z][A-Za-z0-9_]*\(/.test(docsRendererSource.replace(/\bdocument\.create[A-Z][A-Za-z0-9_]*\(/g, ""))) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must not import or call create* factories directly.");
  }

  for (const file of removedDocsAdapterFiles) {
    if (require("fs").existsSync(file)) {
      add("errors", file, 1, "Docs component adapters are no longer allowed; consume apps/docs/component-demo.js and the Design System registry.");
    }
  }
}

module.exports = { checkComponentRegistry };
