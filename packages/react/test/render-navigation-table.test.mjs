import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Breadcrumbs, Pagination, Table, Tabs } from "../dist/index.js";

const breadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  label: "Fleet path",
  collapsedLabel: "Hidden breadcrumb items",
  variant: "overflow",
  state: "collapsed",
  density: "sm",
  maxItems: 4,
  items: [
    { label: "Fleet", href: "#/fleet" },
    { label: "Regions", href: "#/regions" },
    { label: "North", href: "#/north" },
    { label: "Cards", href: "#/cards" },
    { id: "jmx-214-b", label: "JMX-214-B", current: true },
  ],
}));
assert.match(breadcrumbsMarkup, /^<nav/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs"/);
assert.match(breadcrumbsMarkup, /aria-label="Fleet path"/);
assert.match(breadcrumbsMarkup, /data-variant="overflow"/);
assert.match(breadcrumbsMarkup, /data-state="collapsed"/);
assert.match(breadcrumbsMarkup, /data-density="sm"/);
assert.match(breadcrumbsMarkup, /<ol>/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs__item"/);
assert.match(breadcrumbsMarkup, /href="#\/fleet"/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs__target breadcrumbs__target--collapsed"/);
assert.match(breadcrumbsMarkup, /aria-label="Hidden breadcrumb items"/);
assert.match(breadcrumbsMarkup, /class="breadcrumbs__separator"/);
assert.match(breadcrumbsMarkup, /aria-current="page"/);
assert.match(breadcrumbsMarkup, />JMX-214-B<\/span>/);
const unnamedBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  variant: "overflow",
  maxItems: 3,
  items: [
    { href: "#/empty" },
    { label: "Fleet", href: "#/fleet" },
    { label: "Regions", href: "#/regions" },
    { label: "North", href: "#/north" },
    { id: "cards", label: "Cards", current: true },
  ],
}));
assert.match(unnamedBreadcrumbsMarkup.match(/^<nav[^>]+>/)?.[0] ?? "", /aria-label="Ruta"/);
assert.match(unnamedBreadcrumbsMarkup, /Rutas intermedias ocultas/);
assert.doesNotMatch(unnamedBreadcrumbsMarkup, /#\/empty/);
const nonNavigableBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { label: "Fleet" },
    { label: "Vehicle", current: true },
  ],
}));
assert.doesNotMatch(nonNavigableBreadcrumbsMarkup, /href="#"/);
assert.match(nonNavigableBreadcrumbsMarkup, />Fleet<\/span>/);
const actionBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { id: "fleet", label: "Fleet", onClick: () => {} },
    { id: "vehicle", label: "Vehicle", current: true },
  ],
}));
assert.match(actionBreadcrumbsMarkup, /<button type="button" class="breadcrumbs__target"><span class="breadcrumbs__label">Fleet<\/span><\/button>/);
assert.doesNotMatch(actionBreadcrumbsMarkup, /href="#"/);
const iconBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { label: "Inicio", icon: "home", iconOnly: true, href: "#/" },
    { label: "Fleet", href: "#/fleet" },
    { label: "Vehicle", current: true },
  ],
}));
assert.match(iconBreadcrumbsMarkup, /class="breadcrumbs__target breadcrumbs__target--icon-only" href="#\/" aria-label="Inicio"/);
assert.match(iconBreadcrumbsMarkup, /class="breadcrumbs__icon" aria-hidden="true">home<\/span>/);
assert.match(iconBreadcrumbsMarkup, /class="breadcrumbs__label breadcrumbs__label--hidden">Inicio<\/span>/);
const unstableBreadcrumbsMarkup = renderToStaticMarkup(React.createElement(Breadcrumbs, {
  items: [
    { href: "#/empty" },
    { id: "", label: "" },
  ],
}));
assert.doesNotMatch(unstableBreadcrumbsMarkup, /breadcrumbs__target|#\/empty/);

const tabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  selectedKey: "cards",
  variant: "underline",
  items: [
    { key: "drivers", label: "Drivers", icon: "person" },
    { key: "cards", label: "Cards", badge: { label: "8", variant: "count", tone: "neutral" } },
  ],
}));
assert.match(tabsMarkup, /^<div/);
assert.match(tabsMarkup, /class="tabs"/);
assert.match(tabsMarkup, /role="tablist"/);
assert.match(tabsMarkup, /aria-label="Fleet views"/);
assert.match(tabsMarkup, /data-variant="underline"/);
assert.match(tabsMarkup, /data-tabs-item=""/);
assert.match(tabsMarkup, /aria-selected="true"/);
assert.match(tabsMarkup, /class="tabs__icon"/);
assert.match(tabsMarkup, /class="tabs__label">Cards<\/span>/);
assert.match(tabsMarkup, /class="badge"/);
const countOnlyTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  items: [{ key: "cards", label: "Cards", count: 8 }],
}));
assert.doesNotMatch(countOnlyTabsMarkup, /class="badge"|aria-label=""/);
const incompleteBadgeTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  items: [{ key: "cards", label: "Cards", badge: { count: 8 } }],
}));
assert.doesNotMatch(incompleteBadgeTabsMarkup, /class="badge"|aria-label=""/);
const unnamedTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  items: [{ key: "overview", icon: "dashboard" }],
}));
assert.doesNotMatch(unnamedTabsMarkup, /aria-label="Tabs"|Tab 1/);
assert.doesNotMatch(unnamedTabsMarkup, /role="tab"/);
const unstableTabsMarkup = renderToStaticMarkup(React.createElement(Tabs, {
  label: "Fleet views",
  items: [{ label: "Cards" }],
}));
assert.doesNotMatch(unstableTabsMarkup, /role="tab"/);
assert.doesNotMatch(unstableTabsMarkup, /data-key="Cards"|tab-1/);

const paginationMarkup = renderToStaticMarkup(React.createElement(Pagination, {
  label: "Fleet pages",
  previousLabel: "Previous fleet page",
  nextLabel: "Next fleet page",
  getPageLabel: (page) => `Fleet page ${page}`,
  page: 4,
  pageCount: 12,
  state: "selected",
  density: "sm",
  fullWidth: true,
}));
assert.match(paginationMarkup, /^<nav/);
assert.match(paginationMarkup, /class="pagination"/);
assert.match(paginationMarkup, /aria-label="Fleet pages"/);
assert.match(paginationMarkup, /data-variant="numbered"/);
assert.match(paginationMarkup, /data-state="selected"/);
assert.match(paginationMarkup, /data-density="sm"/);
assert.match(paginationMarkup, /data-page="4"/);
assert.match(paginationMarkup, /data-page-count="12"/);
assert.match(paginationMarkup, /data-full-width="true"/);
assert.match(paginationMarkup, /class="pagination__button"/);
assert.match(paginationMarkup, /data-kind="prev"/);
assert.match(paginationMarkup, /data-kind="next"/);
assert.match(paginationMarkup, /class="pagination__ellipsis"/);
assert.match(paginationMarkup, /aria-current="page"/);
assert.match(paginationMarkup, /class="pagination__icon"/);
assert.match(paginationMarkup, /aria-label="Previous fleet page"/);
assert.match(paginationMarkup, /aria-label="Fleet page 4"/);
assert.match(paginationMarkup, /aria-label="Next fleet page"/);
const unnamedPaginationMarkup = renderToStaticMarkup(React.createElement(Pagination, {
  page: 2,
  pages: 3,
}));
assert.match(unnamedPaginationMarkup.match(/^<nav[^>]+>/)?.[0] ?? "", /aria-label="Paginación"/);
assert.match(unnamedPaginationMarkup, /aria-label="Página anterior"/);
assert.match(unnamedPaginationMarkup, /aria-label="Página 2"/);
assert.match(unnamedPaginationMarkup, /aria-label="Página siguiente"/);
assert.match(unnamedPaginationMarkup, /data-page-count="3"/);
assert.match(unnamedPaginationMarkup, /class="pagination__icon"/);
const jumpPaginationMarkup = renderToStaticMarkup(React.createElement(Pagination, {
  page: 14,
  pages: 42,
  variant: "jump",
  jumpSize: 10,
}));
assert.match(jumpPaginationMarkup, /data-variant="jump"/);
assert.match(jumpPaginationMarkup, /aria-label="Primera página"/);
assert.match(jumpPaginationMarkup, /aria-label="Retroceder 10 páginas"/);
assert.match(jumpPaginationMarkup, /aria-label="Avanzar 10 páginas"/);
assert.match(jumpPaginationMarkup, /aria-label="Última página"/);
assert.match(jumpPaginationMarkup, /first_page/);
assert.match(jumpPaginationMarkup, /last_page/);

const tableColumns = [
  { key: "plate", label: "Plate", mono: true, sortable: true },
  { key: "status", label: "Status" },
  { key: "spend", label: "Spend", align: "right", mono: true, sortable: true, sortValue: (row) => row.spendValue },
];
const tableRows = [
  { id: "mx-1", plate: "JMX-214-B", status: { label: "Active", tone: "success" }, spend: "$842", spendValue: 842, detail: "Last fuel stop 08:30" },
  { id: "mx-2", plate: "JMX-778-C", status: { label: "Review", tone: "warning" }, spend: "$420", spendValue: 420 },
];
const tableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Fleet spend",
  rowKey: "id",
  variant: "sortable",
  density: "sm",
  sortKey: "spend",
  selectedKey: "mx-1",
  columns: tableColumns,
  rows: tableRows,
}));
assert.match(tableMarkup, /^<div/);
assert.match(tableMarkup, /class="table"/);
assert.match(tableMarkup, /data-variant="sortable"/);
assert.match(tableMarkup, /data-state="sorted"/);
assert.match(tableMarkup, /data-density="sm"/);
assert.match(tableMarkup, /aria-label="Fleet spend"/);
assert.match(tableMarkup, /aria-sort="ascending"/);
assert.match(tableMarkup, /class="table__sort"/);
assert.match(tableMarkup, /data-table-sort=""/);
assert.match(tableMarkup, /data-selected="true"/);
assert.match(tableMarkup, /class="badge"/);
assert.match(tableMarkup, /data-align="right"/);
assert.match(tableMarkup, /data-mono="true"/);

const inheritedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Inherited fleet density",
  rowKey: "id",
  columns: tableColumns,
  rows: tableRows,
}));
assert.doesNotMatch(inheritedTableMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  columns: tableColumns,
  rows: tableRows,
}));
assert.equal(unnamedTableMarkup, "");
assert.doesNotMatch(unnamedTableMarkup, /class="table"|aria-label="Table"/);
const unlabeledColumnTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Guarded columns",
  variant: "sortable",
  columns: [
    { key: "plate", sortable: true },
    { key: "status", label: "Status" },
  ],
  rows: tableRows,
}));
assert.doesNotMatch(unlabeledColumnTableMarkup, /<span>plate<\/span>|<th[^>]*>plate<\/th>/);
assert.match(unlabeledColumnTableMarkup, />Status</);

const unstableRowTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Guarded rows",
  rowKey: "id",
  columns: tableColumns.slice(0, 2),
  rows: [{ plate: "NO-ID", status: "Draft" }],
}));
assert.doesNotMatch(unstableRowTableMarkup, /NO-ID|data-key="undefined"/);
assert.match(unstableRowTableMarkup, /class="table__empty-row"/);
assert.match(unstableRowTableMarkup, /No rows available/);

const decorativeSelectedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Decorative selected table",
  rowKey: "id",
  state: "selected",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
}));
assert.match(decorativeSelectedTableMarkup, /data-state="selected"/);
assert.doesNotMatch(decorativeSelectedTableMarkup, /data-selected="true"/);

const expandableTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Expandable fleet",
  getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
  rowKey: "id",
  variant: "expandable",
  state: "expanded",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
  expandedKey: "mx-1",
}));
assert.match(expandableTableMarkup, /data-variant="expandable"/);
assert.match(expandableTableMarkup, /data-state="expanded"/);
assert.match(expandableTableMarkup, /aria-expanded="true"/);
assert.match(expandableTableMarkup, /aria-label="Close JMX-214-B"/);
assert.match(expandableTableMarkup, /class="table__expander"/);
assert.match(expandableTableMarkup, /class="table__detail-row"/);
assert.match(expandableTableMarkup, /class="table__detail"[^>]*>Last fuel stop 08:30/);
const unlabeledExpandableTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Unlabeled expandable fleet",
  rowKey: "id",
  variant: "expandable",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
  expandedKey: "mx-1",
}));
assert.doesNotMatch(unlabeledExpandableTableMarkup, /class="table__expander"/);
assert.doesNotMatch(unlabeledExpandableTableMarkup, /class="table__detail-row"/);
assert.doesNotMatch(unlabeledExpandableTableMarkup, /aria-expanded=/);

const decorativeExpandedTableMarkup = renderToStaticMarkup(React.createElement(Table, {
  label: "Decorative expandable fleet",
  getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
  rowKey: "id",
  variant: "expandable",
  state: "expanded",
  columns: tableColumns.slice(0, 2),
  rows: tableRows,
}));
assert.match(decorativeExpandedTableMarkup, /data-state="expanded"/);
assert.doesNotMatch(decorativeExpandedTableMarkup, /aria-expanded="true"/);


console.log("react navigation table render tests passed");
