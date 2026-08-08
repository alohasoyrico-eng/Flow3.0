const { checkAccordionCssContract } = require("./audit-accordion-css-contract.js");
const { checkBadgeCssContract } = require("./audit-badge-css-contract.js");
const { checkCardCssContract } = require("./audit-card-css-contract.js");
const { checkCodeInputCssContract } = require("./audit-code-input-css-contract.js");
const { checkChipCssContract } = require("./audit-chip-css-contract.js");
const { checkDialogCssContract } = require("./audit-dialog-css-contract.js");
const { checkDrawerCssContract } = require("./audit-drawer-css-contract.js");
const { checkEmptyStateCssContract } = require("./audit-empty-state-css-contract.js");
const { checkErrorPanelCssContract } = require("./audit-error-panel-css-contract.js");
const { checkKpiTileCssContract } = require("./audit-kpi-tile-css-contract.js");
const { checkMenuCssContract } = require("./audit-menu-css-contract.js");
const { checkPopoverCssContract } = require("./audit-popover-css-contract.js");
const { checkProgressIndicatorCssContract } = require("./audit-progress-indicator-css-contract.js");
const { checkSkeletonCssContract } = require("./audit-skeleton-css-contract.js");
const { checkSliderCssContract } = require("./audit-slider-css-contract.js");
const { checkSpinnerCssContract } = require("./audit-spinner-css-contract.js");
const { checkStepperCssContract } = require("./audit-stepper-css-contract.js");
const { checkTableCssContract } = require("./audit-table-css-contract.js");
const { checkTagCssContract } = require("./audit-tag-css-contract.js");
const { checkTooltipCssContract } = require("./audit-tooltip-css-contract.js");
const { checkToastCssContract } = require("./audit-toast-css-contract.js");

function checkComponentCssContracts(context) {
  checkAccordionCssContract(context);
  checkBadgeCssContract(context);
  checkCardCssContract(context);
  checkChipCssContract(context);
  checkCodeInputCssContract(context);
  checkDialogCssContract(context);
  checkDrawerCssContract(context);
  checkEmptyStateCssContract(context);
  checkErrorPanelCssContract(context);
  checkKpiTileCssContract(context);
  checkMenuCssContract(context);
  checkPopoverCssContract(context);
  checkProgressIndicatorCssContract(context);
  checkSkeletonCssContract(context);
  checkSliderCssContract(context);
  checkSpinnerCssContract(context);
  checkStepperCssContract(context);
  checkTableCssContract(context);
  checkTagCssContract(context);
  checkTooltipCssContract(context);
  checkToastCssContract(context);
}

module.exports = { checkComponentCssContracts };
