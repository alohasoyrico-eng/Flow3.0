const fs = require("fs");
const path = require("path");
const { add, goldComponents, root } = require("./audit-context.js");
const { classRootsFromClassExpression } = require("./audit-anti-duplication.js");
const { componentCssGovernance } = require("./component-css-governance-policy.js");
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
const { checkChatComposerCssContract } = require("./audit-chat-composer-css-contract.js");
const { checkChatMessageCssContract } = require("./audit-chat-message-css-contract.js");
const { checkChatThreadCssContract } = require("./audit-chat-thread-css-contract.js");
const { checkCheckboxCssContract } = require("./audit-checkbox-css-contract.js");
const { checkChoiceCssContract } = require("./audit-choice-css-contract.js");
const { checkCodeBlockCssContract } = require("./audit-code-block-css-contract.js");
const { checkCodeInputCssContract } = require("./audit-code-input-css-contract.js");
const { checkChipCssContract } = require("./audit-chip-css-contract.js");
const { checkComboboxCssContract } = require("./audit-combobox-css-contract.js");
const { checkCountrySelectorCssContract } = require("./audit-country-selector-css-contract.js");
const { checkCopyButtonCssContract } = require("./audit-copy-button-css-contract.js");
const { checkDialogCssContract } = require("./audit-dialog-css-contract.js");
const { checkDrawerCssContract } = require("./audit-drawer-css-contract.js");
const { checkDateRangePickerCssContract } = require("./audit-date-range-picker-css-contract.js");
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
const { checkPhoneInputCssContract } = require("./audit-phone-input-css-contract.js");
const { checkPopoverCssContract } = require("./audit-popover-css-contract.js");
const { checkProgressIndicatorCssContract } = require("./audit-progress-indicator-css-contract.js");
const { checkQuickActionCssContract } = require("./audit-quick-action-css-contract.js");
const { checkRadioButtonCssContract } = require("./audit-radio-button-css-contract.js");
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
const { checkTextAreaCssContract } = require("./audit-text-area-css-contract.js");
const { checkTooltipCssContract } = require("./audit-tooltip-css-contract.js");
const { checkToastCssContract } = require("./audit-toast-css-contract.js");
const { checkTreeViewCssContract } = require("./audit-tree-view-css-contract.js");

const { familyCssContracts } = componentCssGovernance();

const directCssContractRoots = {
  "floating-action-button": "fab",
  "progress-indicator": "progress",
  "radio-button": "radio",
  select: "select-control",
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
    if (direct.has(component)) {
      const requiredRoot = directCssContractRoots[component] ?? component;
      const observedRoots = observedReactRootsForComponent(component);
      const requiredRootObserved = observedRoots.includes(requiredRoot);
      return {
        component,
        coverage: "direct",
        contract: component,
        requiredRoot,
        observedRoots,
        requiredRootObserved,
      };
    }
    if (familyCssContracts[component]) {
      const familyContract = familyCssContracts[component];
      const observedRoots = observedReactRootsForComponent(component);
      const requiredRootObserved = observedRoots.includes(familyContract.requiredRoot);
      const allowedRoots = [familyContract.requiredRoot, ...(familyContract.allowedExtensionRoots ?? [])];
      const unexpectedRoots = observedRoots.filter((root) => !allowedRoots.includes(root));
      return {
        component,
        coverage: "family",
        contract: familyContract.contract,
        requiredRoot: familyContract.requiredRoot,
        allowedExtensionRoots: familyContract.allowedExtensionRoots ?? [],
        observedRoots,
        requiredRootObserved,
        unexpectedRoots,
      };
    }
    return { component, coverage: "missing", contract: null };
  });
  const family = components.filter((item) => item.coverage === "family");
  const missing = components.filter((item) => item.coverage === "missing").map((item) => item.component);
  const directRootGaps = components.filter((item) => item.coverage === "direct" && !item.requiredRootObserved).map((item) => ({
    component: item.component,
    contract: item.contract,
    requiredRoot: item.requiredRoot,
    observedRoots: item.observedRoots,
  }));
  const familyRootGaps = family.filter((item) => !item.requiredRootObserved).map((item) => ({
    component: item.component,
    contract: item.contract,
    requiredRoot: item.requiredRoot,
    observedRoots: item.observedRoots,
  }));
  const familyUnexpectedRoots = family.filter((item) => item.unexpectedRoots.length).map((item) => ({
    component: item.component,
    contract: item.contract,
    requiredRoot: item.requiredRoot,
    allowedExtensionRoots: item.allowedExtensionRoots,
    observedRoots: item.observedRoots,
    unexpectedRoots: item.unexpectedRoots,
  }));
  const familyGroups = [...new Set(family.map((item) => item.contract))].sort().map((contract) => ({
    contract,
    components: family.filter((item) => item.contract === contract).map((item) => item.component),
    requiredRoots: [...new Set(family.filter((item) => item.contract === contract).map((item) => item.requiredRoot))].sort(),
    allowedExtensionRoots: [...new Set(family.flatMap((item) => item.contract === contract ? item.allowedExtensionRoots : []))].sort(),
  }));
  return {
    total: components.length,
    direct: components.filter((item) => item.coverage === "direct").length,
    family: family.length,
    missing,
    directRootGaps,
    familyRootGaps,
    familyUnexpectedRoots,
    familyContractPolicy: {
      principle: "Family CSS contracts are allowed only when multiple accepted components intentionally share the same visual cascade contract; component-specific roots are explicit extension scopes and cannot multiply silently.",
      groups: familyGroups,
    },
    components,
  };
}

function observedReactRootsForComponent(component) {
  const sourceFile = path.join(root, "packages/react/src", `${pascalCase(component)}.js`);
  if (!fs.existsSync(sourceFile)) return [];
  const source = fs.readFileSync(sourceFile, "utf8");
  const roots = [...source.matchAll(/\bclassName\s*:\s*(?:\[([^\]]+)\]|["'`]([^"'`]+)["'`])/g)]
    .flatMap((match) => [...classRootsFromClassExpression(match[1] ?? match[2] ?? "")]);
  return [...new Set(roots)].sort();
}

function pascalCase(value) {
  return value.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join("");
}

function checkComponentCssContractCoverage({ packageCssFile }) {
  const coverage = componentCssContractCoverage();
  const missing = coverage.missing;
  if (missing.length) {
    add("errors", packageCssFile, 1, `Accepted components missing CSS cascade contract coverage: ${missing.join(", ")}.`);
  }
  if (coverage.directRootGaps.length) {
    add("errors", packageCssFile, 1, `Direct CSS contract coverage is not backed by observed React roots: ${coverage.directRootGaps.map((item) => `${item.component}->${item.requiredRoot}`).join(", ")}.`);
  }
  if (coverage.familyRootGaps.length) {
    add("errors", packageCssFile, 1, `Family CSS contract coverage is not backed by observed React roots: ${coverage.familyRootGaps.map((item) => `${item.component}->${item.requiredRoot}`).join(", ")}.`);
  }
  if (coverage.familyUnexpectedRoots.length) {
    add("errors", packageCssFile, 1, `Family CSS contract coverage has undeclared extension roots: ${coverage.familyUnexpectedRoots.map((item) => `${item.component}->${item.unexpectedRoots.join("+")}`).join(", ")}.`);
  }
  const direct = currentCssContractIds();
  const orphanFamilies = Object.entries(familyCssContracts)
    .filter(([component, familyContract]) => !goldComponents.includes(component) || !direct.has(familyContract.contract))
    .map(([component, familyContract]) => `${component}->${familyContract.contract}`);
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
  checkChatComposerCssContract(context);
  checkChatMessageCssContract(context);
  checkChatThreadCssContract(context);
  checkCheckboxCssContract(context);
  checkChoiceCssContract(context);
  checkChipCssContract(context);
  checkCopyButtonCssContract(context);
  checkCodeBlockCssContract(context);
  checkCodeInputCssContract(context);
  checkComboboxCssContract(context);
  checkCountrySelectorCssContract(context);
  checkDateRangePickerCssContract(context);
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
  checkPhoneInputCssContract(context);
  checkPopoverCssContract(context);
  checkProgressIndicatorCssContract(context);
  checkQuickActionCssContract(context);
  checkRadioButtonCssContract(context);
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
  checkTextAreaCssContract(context);
  checkTooltipCssContract(context);
  checkToastCssContract(context);
  checkTreeViewCssContract(context);
}

module.exports = { checkComponentCssContracts, componentCssContractCoverage, familyCssContracts };
