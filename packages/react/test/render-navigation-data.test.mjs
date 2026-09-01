import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Accordion, KpiTile, List, TreeView } from "../dist/index.js";

const accordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  density: "sm",
  items: [
    { id: "docs", title: "Documents", content: "Insurance", open: true, icon: "description", meta: "3 of 4" },
    { id: "limits", title: "Limits", content: "Daily limit", icon: "speed", meta: "2 rules" },
  ],
}));
assert.match(accordionMarkup, /class="accordion"/);
assert.match(accordionMarkup, /data-density="sm"/);
assert.match(accordionMarkup, /data-variant="single"/);
assert.match(accordionMarkup, /data-surface="solid"/);
assert.match(accordionMarkup, /data-multiple="false"/);
assert.match(accordionMarkup, /data-accordion-trigger=""/);
assert.match(accordionMarkup, /aria-expanded="true"/);
assert.match(accordionMarkup, /aria-controls="[^"]+-docs"/);
assert.match(accordionMarkup, /class="accordion__icon"/);
assert.match(accordionMarkup, /class="accordion__title">Documents<\/span>/);
assert.match(accordionMarkup, /class="accordion__meta">3 of 4<\/span>/);
assert.match(accordionMarkup, /class="accordion__chevron"/);
assert.match(accordionMarkup, /class="accordion__panel"/);
assert.match(accordionMarkup, /role="region"/);
assert.match(accordionMarkup, /class="accordion__panel-body">Insurance<\/div>/);
assert.match(accordionMarkup, /aria-hidden="true"/);
assert.match(accordionMarkup, /inert=""/);
assert.doesNotMatch(accordionMarkup, /hidden="">/);
const defaultOpenAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  defaultOpen: "limits",
  surface: "transparent",
  items: [
    { id: "docs", title: "Documents", content: "Insurance", open: true },
    { id: "limits", title: "Limits", content: "Daily limit" },
  ],
}));
assert.match(defaultOpenAccordionMarkup, /data-surface="transparent"/);
assert.match(defaultOpenAccordionMarkup, /aria-expanded="true" aria-controls="[^"]+-limits"[\s\S]+?class="accordion__title">Limits<\/span>/);
const inheritedAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "billing", title: "Billing", content: "Cards" }],
}));
assert.doesNotMatch(inheritedAccordionMarkup.match(/^<div[^>]+>/)?.[0] ?? "", /data-density=/);
const emptyAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [],
}));
assert.doesNotMatch(emptyAccordionMarkup, /Section/);
assert.doesNotMatch(emptyAccordionMarkup, /accordion__item/);
const incompleteAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "ghost", content: "Panel" }],
}));
assert.doesNotMatch(incompleteAccordionMarkup, /accordion__item|data-accordion-trigger/);
const labelAliasAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "ghost", label: "Alias title", content: "Panel" }],
}));
assert.doesNotMatch(labelAliasAccordionMarkup, /accordion__item|data-accordion-trigger|Alias title/);
const descriptionAliasAccordionMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "ghost", title: "Documents", description: "Alias panel", open: true }],
}));
assert.doesNotMatch(descriptionAliasAccordionMarkup, /Alias panel/);
const unnamedAccordionItemMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ id: "empty", ariaLabel: "Consumer section", content: "Panel" }],
}));
assert.doesNotMatch(unnamedAccordionItemMarkup, /accordion__item|data-accordion-trigger|aria-label="Consumer section"/);
const unstableAccordionItemMarkup = renderToStaticMarkup(React.createElement(Accordion, {
  items: [{ title: "Documents", content: "Insurance" }],
}));
assert.doesNotMatch(unstableAccordionItemMarkup, /accordion__item|data-accordion-trigger|accordion-panel-|Documents/);

const listMarkup = renderToStaticMarkup(React.createElement(List, {
  label: "Fleet tasks",
  variant: "action",
  state: "selected",
  density: "sm",
  interactive: true,
  items: [
    { key: "docs", label: "Documents", meta: "3 pending", value: "75%", icon: "description", state: "selected" },
    { key: "fuel", label: "Fuel card", meta: "Needs review", value: "$842", icon: "credit_card", tone: "danger" },
  ],
  onSelect: () => {},
}));
assert.match(listMarkup, /^<ul/);
assert.match(listMarkup, /class="list"/);
assert.match(listMarkup, /role="list"/);
assert.match(listMarkup, /aria-label="Fleet tasks"/);
assert.match(listMarkup, /data-variant="action"/);
assert.match(listMarkup, /data-state="selected"/);
assert.match(listMarkup, /data-density="sm"/);
assert.match(listMarkup, /data-interactive="true"/);
assert.match(listMarkup, /<button class="list__item"/);
assert.match(listMarkup, /data-key="docs"/);
assert.match(listMarkup, /aria-current="true"/);
assert.match(listMarkup, /class="list__icon material-symbol"/);
assert.match(listMarkup, /class="list__content"/);
assert.match(listMarkup, /class="list__value">75%<\/span>/);

const passiveListMarkup = renderToStaticMarkup(React.createElement(List, {
  items: [{ key: "ana-sosa", label: "Ana Sosa", meta: "Driver", value: "Active" }],
}));
assert.match(passiveListMarkup, /<span class="list__item"/);
assert.doesNotMatch(passiveListMarkup.match(/^<ul[^>]+>/)?.[0] ?? "", /data-density=/);
assert.doesNotMatch(passiveListMarkup, /<button/);

const inertActionListMarkup = renderToStaticMarkup(React.createElement(List, {
  variant: "action",
  interactive: true,
  items: [{ key: "docs", label: "Documents", meta: "3 pending" }],
}));
assert.match(inertActionListMarkup, /data-interactive="false"/);
assert.match(inertActionListMarkup, /<span class="list__item"/);
assert.doesNotMatch(inertActionListMarkup, /<button/);

const loadingListItemMarkup = renderToStaticMarkup(React.createElement(List, {
  items: [{ key: "loading-row", label: "Refreshing assignments", state: "loading" }],
}));
assert.match(loadingListItemMarkup, /aria-busy="true"/);
assert.doesNotMatch(loadingListItemMarkup, /Loading item/);
const unnamedActionListMarkup = renderToStaticMarkup(React.createElement(List, {
  variant: "action",
  items: [{ key: "empty-action", icon: "more_horiz" }],
  onSelect: () => {},
}));
assert.doesNotMatch(unnamedActionListMarkup, /<button/);
assert.doesNotMatch(unnamedActionListMarkup, /data-key="empty-action"/);
const unstableActionListMarkup = renderToStaticMarkup(React.createElement(List, {
  variant: "action",
  items: [{ label: "Documents" }],
  onSelect: () => {},
}));
assert.doesNotMatch(unstableActionListMarkup, /<button/);
assert.doesNotMatch(unstableActionListMarkup, /data-key="Documents"/);
assert.doesNotMatch(unstableActionListMarkup, /Documents/);

const kpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Fuel spend",
  value: "$84.2k",
  delta: "+12% vs last week",
  trend: "up",
  tone: "warning",
  icon: "local_gas_station",
  variant: "delta",
  state: "selected",
  density: "sm",
  selected: true,
  onSelect: () => {},
}));
assert.match(kpiMarkup, /^<article/);
assert.match(kpiMarkup, /class="kpi-tile kpi-tile--warning"/);
assert.match(kpiMarkup, /role="button"/);
assert.match(kpiMarkup, /aria-pressed="true"/);
assert.match(kpiMarkup, /data-variant="delta"/);
assert.match(kpiMarkup, /data-state="selected"/);
assert.match(kpiMarkup, /data-density="sm"/);
assert.match(kpiMarkup, /class="kpi-tile__label">Fuel spend<\/span>/);
assert.match(kpiMarkup, /class="kpi-tile__icon"/);
assert.match(kpiMarkup, /class="kpi-tile__value">\$84\.2k<\/strong>/);
assert.match(kpiMarkup, /class="kpi-tile__delta" data-trend="up"/);
assert.match(kpiMarkup, /trending_up/);

const inheritedKpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Inherited KPI density",
  value: "42",
}));
assert.doesNotMatch(inheritedKpiMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /data-density=/);

const kpiLinkMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Cards at risk",
  value: "18",
  href: "#cards",
  variant: "drill-in",
}));
assert.match(kpiLinkMarkup, /^<a/);
assert.match(kpiLinkMarkup, /href="#cards"/);
assert.match(kpiLinkMarkup, /class="kpi-tile__affordance"/);

const kpiSparklineMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Resolved cases",
  value: "94%",
  variant: "sparkline",
  values: [20, 28, 36],
}));
assert.match(kpiSparklineMarkup, /class="kpi-tile__sparkline"/);
assert.match(kpiSparklineMarkup, /<polyline points="/);
const kpiMissingSparklineDataMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Resolved cases",
  value: "94%",
  variant: "sparkline",
}));
assert.doesNotMatch(kpiMissingSparklineDataMarkup, /class="kpi-tile__sparkline"/);
const unnamedInteractiveKpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  variant: "drill-in",
  onSelect: () => {},
  href: "#missing-copy",
}));
assert.equal(unnamedInteractiveKpiMarkup, "");
assert.doesNotMatch(unnamedInteractiveKpiMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /role="button"|tabIndex=|href=|aria-label=/);
assert.doesNotMatch(unnamedInteractiveKpiMarkup, /class="kpi-tile__affordance"/);
const inertDrillInKpiMarkup = renderToStaticMarkup(React.createElement(KpiTile, {
  label: "Cards at risk",
  value: "18",
  variant: "drill-in",
}));
assert.match(inertDrillInKpiMarkup, /^<article/);
assert.doesNotMatch(inertDrillInKpiMarkup.match(/^<article[^>]+>/)?.[0] ?? "", /role="button"|tabIndex=|href=/);
assert.doesNotMatch(inertDrillInKpiMarkup, /class="kpi-tile__affordance"/);

const treeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  label: "Fleet hierarchy",
  density: "sm",
  nodes: [
    { key: "fleet", label: "Fleet", level: 1, expanded: true, icon: "account_tree" },
    { key: "cards", label: "Cards", level: 2, selected: true },
    { key: "card-4821", label: "Card 4821", level: 7 },
  ],
}));
assert.match(treeViewMarkup, /^<ul/);
assert.match(treeViewMarkup, /class="tree-view"/);
assert.match(treeViewMarkup, /role="tree"/);
assert.match(treeViewMarkup, /aria-label="Fleet hierarchy"/);
assert.match(treeViewMarkup, /data-density="sm"/);
assert.match(treeViewMarkup, /data-tree-item=""/);
assert.match(treeViewMarkup, /data-level="7"/);
assert.match(treeViewMarkup, /style="--comp-tree-view-level:7"/);
assert.match(treeViewMarkup, /data-expanded="true"/);
assert.match(treeViewMarkup, /data-selected="true"/);
assert.match(treeViewMarkup, /aria-level="7"/);
assert.match(treeViewMarkup, /aria-expanded="true"/);
assert.match(treeViewMarkup, /aria-selected="true"/);
assert.match(treeViewMarkup, /data-tree-control=""/);
assert.match(treeViewMarkup, /role="treeitem"/);
assert.equal((treeViewMarkup.match(/aria-expanded=/g) ?? []).length, 1);
assert.equal((treeViewMarkup.match(/aria-selected=/g) ?? []).length, 3);
assert.doesNotMatch(treeViewMarkup, /data-level="5"/);
const inheritedTreeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  label: "Inherited tree",
  nodes: [{ key: "root", label: "Root", level: 1 }],
}));
assert.doesNotMatch(inheritedTreeViewMarkup.match(/^<ul[^>]+>/)?.[0] ?? "", /data-density=/);
const unnamedTreeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  nodes: [{ id: "root" }],
}));
assert.doesNotMatch(unnamedTreeViewMarkup, /Tree view|Tree item 1/);
assert.doesNotMatch(unnamedTreeViewMarkup, /role="treeitem"/);
assert.doesNotMatch(unnamedTreeViewMarkup.match(/^<ul[^>]+>/)?.[0] ?? "", /aria-label=/);
const unstableTreeViewMarkup = renderToStaticMarkup(React.createElement(TreeView, {
  label: "Unstable tree",
  nodes: [{ label: "Root", level: 1 }],
}));
assert.doesNotMatch(unstableTreeViewMarkup, /role="treeitem"/);
assert.doesNotMatch(unstableTreeViewMarkup, /tree-item-0|data-key="Root"/);


console.log("react navigation data render tests passed");
