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
  ["empty-state", "createEmptyState"],
  ["error-panel", "createErrorPanel"],
  ["floating-action-button", "createFloatingActionButton"],
  ["inline-validation", "createInlineValidation"],
  ["progress-indicator", "createProgressIndicator"],
  ["spinner", "createSpinner"],
  ["skeleton", "createSkeleton"],
  ["audit-event", "createAuditEvent"],
  ["chart-panel", "createChartPanel"],
  ["station-pin", "createStationPin"],
  ["route-summary", "createRouteSummary"],
  ["card-summary", "createCardSummary"],
  ["movement-row", "createMovementRow"],
  ["quick-action", "createQuickAction"],
  ["accordion", "createAccordion"],
  ["slider", "createSlider"],
  ["tree-view", "createTreeView"],
  ["segmented-control", "createSegmentedControl"],
  ["breadcrumbs", "createBreadcrumbs"],
  ["pagination", "createPagination"],
  ["stepper", "createStepper"],
  ["toast", "createToast"],
  ["motion-boundary", "createMotionBoundary"],
  ["animated-moment", "createAnimatedMoment"],
  ["biometric-prompt", "createBiometricPrompt"],
]);

function checkComponentRegistry() {
  const registrySource = read(registryFile);
  const indexSource = read(indexFile);

  for (const component of requiredComponentContracts) {
    const key = component.includes("-") ? `"${component}"` : component;
    if (["accordion", "avatar", "badge", "breadcrumbs", "button", "card", "card-expiry-input", "card-number-input", "card-security-code-input", "checkbox", "chip", "code-input", "combobox", "date-picker", "date-range-picker", "dialog", "drawer", "empty-state", "error-panel", "icon-button", "inline-validation", "input", "kpi-tile", "list", "menu", "pagination", "phone-input", "popover", "progress-indicator", "radio-button", "select", "segmented-control", "skeleton", "slider", "spinner", "stepper", "switch", "tabs", "table", "tag", "text-area", "toast", "tooltip", "tree-view"].includes(component)) {
      const label = component === "accordion" ? "Accordion" : component === "avatar" ? "Avatar" : component === "badge" ? "Badge" : component === "breadcrumbs" ? "Breadcrumbs" : component === "button" ? "Button" : component === "card" ? "Card" : component === "card-expiry-input" ? "Card Expiry Input" : component === "card-number-input" ? "Card Number Input" : component === "card-security-code-input" ? "Card Security Code Input" : component === "checkbox" ? "Checkbox" : component === "chip" ? "Chip" : component === "code-input" ? "Code Input" : component === "combobox" ? "Combobox" : component === "date-picker" ? "Date Picker" : component === "date-range-picker" ? "Date Range Picker" : component === "dialog" ? "Dialog" : component === "drawer" ? "Drawer" : component === "empty-state" ? "Empty State" : component === "error-panel" ? "Error Panel" : component === "icon-button" ? "Icon Button" : component === "inline-validation" ? "Inline Validation" : component === "input" ? "Input" : component === "kpi-tile" ? "KPI Tile" : component === "list" ? "List" : component === "menu" ? "Menu" : component === "pagination" ? "Pagination" : component === "phone-input" ? "Phone Input" : component === "popover" ? "Popover" : component === "progress-indicator" ? "Progress Indicator" : component === "radio-button" ? "Radio Button" : component === "segmented-control" ? "Segmented Control" : component === "skeleton" ? "Skeleton" : component === "slider" ? "Slider" : component === "spinner" ? "Spinner" : component === "stepper" ? "Stepper" : component === "switch" ? "Switch" : component === "tabs" ? "Tabs" : component === "table" ? "Table" : component === "tag" ? "Tag" : component === "text-area" ? "Text Area" : component === "toast" ? "Toast" : component === "tooltip" ? "Tooltip" : component === "tree-view" ? "Tree View" : "Select";
      const factory = component === "accordion" ? "createAccordion" : component === "avatar" ? "createTransitionalAvatar" : component === "badge" ? "createTransitionalBadge" : component === "breadcrumbs" ? "createBreadcrumbs" : component === "button" ? "createTransitionalActionButton" : component === "card" ? "createCard" : component === "card-expiry-input" ? "createTransitionalPaymentCardExpiryInput" : component === "card-number-input" ? "createTransitionalPaymentCardNumberInput" : component === "card-security-code-input" ? "createTransitionalPaymentCardSecurityCodeInput" : component === "checkbox" ? "createTransitionalChoiceCheckbox" : component === "chip" ? "createTransitionalChip" : component === "code-input" ? "createTransitionalSecurityCodeInput" : component === "combobox" ? "createCombobox" : component === "date-picker" ? "createTransitionalDatePicker" : component === "date-range-picker" ? "createTransitionalDateRangePicker" : component === "dialog" ? "createDialog" : component === "drawer" ? "createDrawer" : component === "empty-state" ? "createEmptyState" : component === "error-panel" ? "createErrorPanel" : component === "icon-button" ? "createTransitionalActionIconButton" : component === "inline-validation" ? "createInlineValidation" : component === "input" ? "createTransitionalFieldInput" : component === "kpi-tile" ? "createKpiTile" : component === "list" ? "createList" : component === "menu" ? "createMenu" : component === "pagination" ? "createPagination" : component === "phone-input" ? "createTransitionalPhoneInput" : component === "popover" ? "createPopover" : component === "progress-indicator" ? "createProgressIndicator" : component === "radio-button" ? "createTransitionalChoiceRadioButton" : component === "segmented-control" ? "createSegmentedControl" : component === "skeleton" ? "createSkeleton" : component === "slider" ? "createSlider" : component === "spinner" ? "createSpinner" : component === "stepper" ? "createStepper" : component === "switch" ? "createTransitionalChoiceSwitch" : component === "tabs" ? "createTabs" : component === "table" ? "createTable" : component === "tag" ? "createTransitionalTag" : component === "text-area" ? "createTransitionalFieldTextArea" : component === "toast" ? "createToast" : component === "tooltip" ? "createTransitionalTooltip" : component === "tree-view" ? "createTreeView" : "createTransitionalFieldSelect";
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
  const docsRendererAuditSource = docsRendererSource.replace(/reactIsland\("([^"]+)"/g, 'data-react-component="$1"');
  if (!docsRendererSource.includes("renderComponentDemo")) {
    add("errors", docsRendererFile, 1, "Docs component demo renderer must consume the official Design System registry demo renderer.");
  }
  for (const snippet of ["componentDemoProps", "reactAccordionDemo", 'data-react-component="accordion"', 'if (component === "accordion") return reactAccordionDemo(demo);', "reactAvatarDemo", 'data-react-component="avatar"', 'if (component === "avatar") return reactAvatarDemo(demo);', "reactBadgeDemo", 'data-react-component="badge"', 'if (component === "badge") return reactBadgeDemo(demo);', "reactBreadcrumbsDemo", 'data-react-component="breadcrumbs"', 'if (component === "breadcrumbs") return reactBreadcrumbsDemo(demo);', "reactChipDemo", 'data-react-component="chip"', 'if (component === "chip") return reactChipDemo(demo);', "reactTagDemo", 'data-react-component="tag"', 'if (component === "tag") return reactTagDemo(demo);', "reactButtonDemo", 'data-react-component="button"', 'if (component === "button") return reactButtonDemo(demo);', "reactCardDemo", 'data-react-component="card"', 'if (component === "card") return reactCardDemo(demo);', "reactCardExpiryInputDemo", 'data-react-component="card-expiry-input"', 'if (component === "card-expiry-input") return reactCardExpiryInputDemo(demo);', "reactCardNumberInputDemo", 'data-react-component="card-number-input"', 'if (component === "card-number-input") return reactCardNumberInputDemo(demo);', "reactCardSecurityCodeInputDemo", 'data-react-component="card-security-code-input"', 'if (component === "card-security-code-input") return reactCardSecurityCodeInputDemo(demo);', "reactCheckboxDemo", 'data-react-component="checkbox"', 'if (component === "checkbox") return reactCheckboxDemo(demo);', "reactCodeInputDemo", 'data-react-component="code-input"', 'if (component === "code-input") return reactCodeInputDemo(demo);', "reactComboboxDemo", 'data-react-component="combobox"', 'if (component === "combobox") return reactComboboxDemo(demo);', "reactDatePickerDemo", 'data-react-component="date-picker"', 'if (component === "date-picker") return reactDatePickerDemo(demo);', "reactDateRangePickerDemo", 'data-react-component="date-range-picker"', 'if (component === "date-range-picker") return reactDateRangePickerDemo(demo);', "reactDrawerDemo", 'data-react-component="drawer"', 'if (component === "drawer") return reactDrawerDemo(demo);', "reactEmptyStateDemo", 'data-react-component="empty-state"', 'if (component === "empty-state") return reactEmptyStateDemo(demo);', "reactErrorPanelDemo", 'data-react-component="error-panel"', 'if (component === "error-panel") return reactErrorPanelDemo(demo);', "reactInlineValidationDemo", 'data-react-component="inline-validation"', 'if (component === "inline-validation") return reactInlineValidationDemo(demo);', "reactInputDemo", 'data-react-component="input"', 'if (component === "input") return reactInputDemo(demo);', "reactKpiTileDemo", 'data-react-component="kpi-tile"', 'if (component === "kpi-tile") return reactKpiTileDemo(demo);', "reactListDemo", 'data-react-component="list"', 'if (component === "list") return reactListDemo(demo);', "reactMenuDemo", 'data-react-component="menu"', 'if (component === "menu") return reactMenuDemo(demo);', "reactPaginationDemo", 'data-react-component="pagination"', 'if (component === "pagination") return reactPaginationDemo(demo);', "reactPhoneInputDemo", 'data-react-component="phone-input"', 'if (component === "phone-input") return reactPhoneInputDemo(demo);', "reactProgressIndicatorDemo", 'data-react-component="progress-indicator"', 'if (component === "progress-indicator") return reactProgressIndicatorDemo(demo);', "reactRadioButtonDemo", 'data-react-component="radio-button"', 'if (component === "radio-button") return reactRadioButtonDemo(demo);', "reactSelectDemo", 'data-react-component="select"', 'if (component === "select") return reactSelectDemo(demo);', "reactSegmentedControlDemo", 'data-react-component="segmented-control"', 'if (component === "segmented-control") return reactSegmentedControlDemo(demo);', "reactSkeletonDemo", 'data-react-component="skeleton"', 'if (component === "skeleton") return reactSkeletonDemo(demo);', "reactSliderDemo", 'data-react-component="slider"', 'if (component === "slider") return reactSliderDemo(demo);', "reactSpinnerDemo", 'data-react-component="spinner"', 'if (component === "spinner") return reactSpinnerDemo(demo);', "reactStepperDemo", 'data-react-component="stepper"', 'if (component === "stepper") return reactStepperDemo(demo);', "reactSwitchDemo", 'data-react-component="switch"', 'if (component === "switch") return reactSwitchDemo(demo);', "reactTabsDemo", 'data-react-component="tabs"', 'if (component === "tabs") return reactTabsDemo(demo);', "reactTableDemo", 'data-react-component="table"', 'if (component === "table") return reactTableDemo(demo);', "reactTextAreaDemo", 'data-react-component="text-area"', 'if (component === "text-area") return reactTextAreaDemo(demo);', "reactToastDemo", 'data-react-component="toast"', 'if (component === "toast") return reactToastDemo(demo);', "reactTreeViewDemo", 'data-react-component="tree-view"', 'if (component === "tree-view") return reactTreeViewDemo(demo);']) {
    if (!docsRendererAuditSource.includes(snippet)) {
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
