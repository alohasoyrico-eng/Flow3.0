const { checkBadgeCssContract } = require("./audit-badge-css-contract.js");
const { checkCardCssContract } = require("./audit-card-css-contract.js");
const { checkCodeInputCssContract } = require("./audit-code-input-css-contract.js");
const { checkChipCssContract } = require("./audit-chip-css-contract.js");
const { checkTableCssContract } = require("./audit-table-css-contract.js");
const { checkTooltipCssContract } = require("./audit-tooltip-css-contract.js");

function checkComponentCssContracts(context) {
  checkBadgeCssContract(context);
  checkCardCssContract(context);
  checkChipCssContract(context);
  checkCodeInputCssContract(context);
  checkTableCssContract(context);
  checkTooltipCssContract(context);
}

module.exports = { checkComponentCssContracts };
