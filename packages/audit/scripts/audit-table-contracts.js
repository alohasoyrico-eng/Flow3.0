const {
  add,
  docsAppDir,
  path,
  read,
  root,
} = require("./audit-context.js");

function checkTableContracts() {
  const tableComponentFile = path.join(root, "packages/components/src/components/commerce.js");
  const tableCssFile = path.join(root, "packages/components/styles/components.css");
  const tableComponent = read(tableComponentFile);
  const tableCss = read(tableCssFile);

  if (!tableComponent.includes('th.setAttribute("aria-sort", sortKey === column.key ? sortDir : "none")')) {
    add("errors", tableComponentFile, 1, "Table sortable headers must expose aria-sort for every sortable column.");
  }
  if (!tableComponent.includes("if (column.align) th.dataset.align = column.align") || !tableComponent.includes("if (column.align) td.dataset.align = column.align")) {
    add("errors", tableComponentFile, 1, "Table headers must share the same data-align contract as body cells.");
  }
  if (!/\.table__sort\s*{[^}]*inline-size:\s*100%;[^}]*}/s.test(tableCss)) {
    add("errors", tableCssFile, 1, "Table sortable header buttons must fill the header cell so label alignment matches column content.");
  }
  if (!/\.table__sort\s*{[^}]*justify-content:\s*inherit;/s.test(tableCss)) {
    add("errors", tableCssFile, 1, "Table sortable header buttons must inherit column alignment instead of using docs-only alignment rules.");
  }
}

module.exports = { checkTableContracts };
