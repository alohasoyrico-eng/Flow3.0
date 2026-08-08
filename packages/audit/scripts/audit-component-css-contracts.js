const fs = require("fs");
const path = require("path");
const { add, goldComponents, root } = require("./audit-context.js");
const { checkAccordionCssContract } = require("./audit-accordion-css-contract.js");
const { checkAnimatedMomentCssContract } = require("./audit-animated-moment-css-contract.js");
const { checkAuditEventCssContract } = require("./audit-audit-event-css-contract.js");
const { checkAvatarCssContract } = require("./audit-avatar-css-contract.js");
const { checkBadgeCssContract } = require("./audit-badge-css-contract.js");
const { checkBiometricPromptCssContract } = require("./audit-biometric-prompt-css-contract.js");
const { checkBreadcrumbsCssContract } = require("./audit-breadcrumbs-css-contract.js");
const { checkButtonCssContract } = require("./audit-button-css-contract.js");
const { checkCardCssContract } = require("./audit-card-css-contract.js");
const { checkCardSummaryCssContract } = require("./audit-card-summary-css-contract.js");
const { checkChartPanelCssContract } = require("./audit-chart-panel-css-contract.js");
const { checkChoiceCssContract } = require("./audit-choice-css-contract.js");
const { checkCodeInputCssContract } = require("./audit-code-input-css-contract.js");
const { checkChipCssContract } = require("./audit-chip-css-contract.js");
const { checkDialogCssContract } = require("./audit-dialog-css-contract.js");
const { checkDrawerCssContract } = require("./audit-drawer-css-contract.js");
const { checkDatePickerCssContract } = require("./audit-date-picker-css-contract.js");
const { checkEmptyStateCssContract } = require("./audit-empty-state-css-contract.js");
const { checkErrorPanelCssContract } = require("./audit-error-panel-css-contract.js");
const { checkFieldCssContract } = require("./audit-field-css-contract.js");
const { checkFloatingActionButtonCssContract } = require("./audit-floating-action-button-css-contract.js");
const { checkIconButtonCssContract } = require("./audit-icon-button-css-contract.js");
const { checkInlineValidationCssContract } = require("./audit-inline-validation-css-contract.js");
const { checkKpiTileCssContract } = require("./audit-kpi-tile-css-contract.js");
const { checkListCssContract } = require("./audit-list-css-contract.js");
const { checkMenuCssContract } = require("./audit-menu-css-contract.js");
const { checkMotionBoundaryCssContract } = require("./audit-motion-boundary-css-contract.js");
const { checkMovementRowCssContract } = require("./audit-movement-row-css-contract.js");
const { checkPaginationCssContract } = require("./audit-pagination-css-contract.js");
const { checkPopoverCssContract } = require("./audit-popover-css-contract.js");
const { checkProgressIndicatorCssContract } = require("./audit-progress-indicator-css-contract.js");
const { checkQuickActionCssContract } = require("./audit-quick-action-css-contract.js");
const { checkRouteSummaryCssContract } = require("./audit-route-summary-css-contract.js");
const { checkSelectCssContract } = require("./audit-select-css-contract.js");
const { checkSegmentedControlCssContract } = require("./audit-segmented-control-css-contract.js");
const { checkSkeletonCssContract } = require("./audit-skeleton-css-contract.js");
const { checkSliderCssContract } = require("./audit-slider-css-contract.js");
const { checkSpinnerCssContract } = require("./audit-spinner-css-contract.js");
const { checkStationPinCssContract } = require("./audit-station-pin-css-contract.js");
const { checkStepperCssContract } = require("./audit-stepper-css-contract.js");
const { checkSwitchCssContract } = require("./audit-switch-css-contract.js");
const { checkTableCssContract } = require("./audit-table-css-contract.js");
const { checkTabsCssContract } = require("./audit-tabs-css-contract.js");
const { checkTagCssContract } = require("./audit-tag-css-contract.js");
const { checkTooltipCssContract } = require("./audit-tooltip-css-contract.js");
const { checkToastCssContract } = require("./audit-toast-css-contract.js");
const { checkTreeViewCssContract } = require("./audit-tree-view-css-contract.js");

const familyCssContracts = {
  checkbox: "choice",
  "radio-button": "choice",
  input: "field",
  "text-area": "field",
  "phone-input": "field",
  "card-number-input": "field",
  "card-expiry-input": "field",
  "card-security-code-input": "field",
  combobox: "select",
  "country-selector": "select",
  "date-range-picker": "date-picker",
};

function currentCssContractIds() {
  const dir = path.join(root, "packages/audit/scripts");
  return new Set(fs.readdirSync(dir)
    .filter((file) => /^audit-.*-css-contract\.js$/.test(file))
    .map((file) => file.replace(/^audit-/, "").replace(/-css-contract\.js$/, "")));
}

function componentCssContractCoverage() {
  const direct = currentCssContractIds();
  const components = goldComponents.map((component) => {
    if (direct.has(component)) return { component, coverage: "direct", contract: component };
    if (familyCssContracts[component]) return { component, coverage: "family", contract: familyCssContracts[component] };
    return { component, coverage: "missing", contract: null };
  });
  const family = components.filter((item) => item.coverage === "family");
  const missing = components.filter((item) => item.coverage === "missing").map((item) => item.component);
  return {
    total: components.length,
    direct: components.filter((item) => item.coverage === "direct").length,
    family: family.length,
    missing,
    components,
  };
}

function checkComponentCssContractCoverage({ packageCssFile }) {
  const coverage = componentCssContractCoverage();
  const missing = coverage.missing;
  if (missing.length) {
    add("errors", packageCssFile, 1, `Accepted components missing CSS cascade contract coverage: ${missing.join(", ")}.`);
  }
  const direct = currentCssContractIds();
  const orphanFamilies = Object.entries(familyCssContracts)
    .filter(([component, contract]) => !goldComponents.includes(component) || !direct.has(contract))
    .map(([component, contract]) => `${component}->${contract}`);
  if (orphanFamilies.length) {
    add("errors", packageCssFile, 1, `Component CSS family coverage points at missing components or contracts: ${orphanFamilies.join(", ")}.`);
  }
}

function checkComponentCssContracts(context) {
  checkComponentCssContractCoverage(context);
  checkAccordionCssContract(context);
  checkAnimatedMomentCssContract(context);
  checkAuditEventCssContract(context);
  checkAvatarCssContract(context);
  checkBadgeCssContract(context);
  checkBiometricPromptCssContract(context);
  checkBreadcrumbsCssContract(context);
  checkButtonCssContract(context);
  checkCardCssContract(context);
  checkCardSummaryCssContract(context);
  checkChartPanelCssContract(context);
  checkChoiceCssContract(context);
  checkChipCssContract(context);
  checkCodeInputCssContract(context);
  checkDatePickerCssContract(context);
  checkDialogCssContract(context);
  checkDrawerCssContract(context);
  checkEmptyStateCssContract(context);
  checkErrorPanelCssContract(context);
  checkFieldCssContract(context);
  checkFloatingActionButtonCssContract(context);
  checkIconButtonCssContract(context);
  checkInlineValidationCssContract(context);
  checkKpiTileCssContract(context);
  checkListCssContract(context);
  checkMenuCssContract(context);
  checkMotionBoundaryCssContract(context);
  checkMovementRowCssContract(context);
  checkPaginationCssContract(context);
  checkPopoverCssContract(context);
  checkProgressIndicatorCssContract(context);
  checkQuickActionCssContract(context);
  checkRouteSummaryCssContract(context);
  checkSelectCssContract(context);
  checkSegmentedControlCssContract(context);
  checkSkeletonCssContract(context);
  checkSliderCssContract(context);
  checkSpinnerCssContract(context);
  checkStationPinCssContract(context);
  checkStepperCssContract(context);
  checkSwitchCssContract(context);
  checkTableCssContract(context);
  checkTabsCssContract(context);
  checkTagCssContract(context);
  checkTooltipCssContract(context);
  checkToastCssContract(context);
  checkTreeViewCssContract(context);
}

module.exports = { checkComponentCssContracts, componentCssContractCoverage };
