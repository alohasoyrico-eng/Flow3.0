const { checkCardCssContract } = require("./audit-card-css-contract.js");
const { checkCodeInputCssContract } = require("./audit-code-input-css-contract.js");
const { checkTableCssContract } = require("./audit-table-css-contract.js");

function checkComponentCssContracts(context) {
  checkCardCssContract(context);
  checkCodeInputCssContract(context);
  checkTableCssContract(context);
}

module.exports = { checkComponentCssContracts };
