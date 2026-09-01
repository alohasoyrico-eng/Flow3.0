import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Sidebar } from "../dist/patterns/Sidebar.js";
import { Topbar } from "../dist/patterns/Topbar.js";
import { Toolbar } from "../dist/patterns/Toolbar.js";
import { BulkActions } from "../dist/patterns/BulkActions.js";
import { ChartWrapper } from "../dist/patterns/ChartWrapper.js";
import { CalendarView } from "../dist/patterns/CalendarView.js";

const sidebarMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  density: "sm",
  activeKey: "routes",
  breadcrumbs: [
    { label: "Fleet", href: "/fleet" },
    { label: "Routes", current: true },
  ],
  groups: [
    {
      key: "operations",
      title: "Operations",
      badge: "2",
      open: true,
      routes: [
        { key: "routes", label: "Routes", icon: "route", badge: "4", active: true },
        { key: "drivers", label: "Drivers", icon: "person" },
      ],
    },
  ],
  "data-product-hook": "sidebar",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(sidebarMarkup, /data-flow-pattern="sidebar"/);
assert.match(sidebarMarkup, /data-state="active"/);
assert.match(sidebarMarkup, /data-group-count="1"/);
assert.match(sidebarMarkup, /data-route-count="2"/);
assert.match(sidebarMarkup, /data-flow-primitive="surface"/);
assert.match(sidebarMarkup, /data-flow-slot="groups"/);
assert.match(sidebarMarkup, /data-sidebar-route="routes"/);
assert.doesNotMatch(sidebarMarkup, /class="drawer/);
assert.match(sidebarMarkup, /class="breadcrumbs/);
assert.match(sidebarMarkup, /class="accordion/);
assert.doesNotMatch(sidebarMarkup, /data-flow-slot="collapse-action"/);
assert.match(sidebarMarkup, /class="badge/);
assert.doesNotMatch(sidebarMarkup, /topbar|fleet-dashboard-suite|configuration-console|template-route|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const sidebarCollapseMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  collapseAction: { label: "Collapse navigation" },
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarCollapseMarkup, /data-flow-slot="collapse-action"/);
assert.match(sidebarCollapseMarkup, /class="icon-button/);

const sidebarCollapsedMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  collapsed: true,
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarCollapsedMarkup, /data-state="collapsed"/);
assert.match(sidebarCollapsedMarkup, /data-collapsed="true"/);

const sidebarMobileMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  mobileDrawer: true,
  drawerOpen: true,
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarMobileMarkup, /data-state="mobile-drawer"/);
assert.match(sidebarMobileMarkup, /data-open="true"/);
assert.match(sidebarMobileMarkup, /class="drawer/);

const sidebarPermissionMarkup = renderToStaticMarkup(React.createElement(Sidebar, {
  label: "Fleet navigation",
  permissionFiltered: true,
  groups: [{ title: "Operations", routes: [{ label: "Routes" }] }],
}));
assert.match(sidebarPermissionMarkup, /data-state="permission-filtered"/);
assert.match(sidebarPermissionMarkup, /Permission filtered/);

const topbarMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  density: "sm",
  search: {
    label: "Search fleet",
    triggerLabel: "Search fleet",
    query: "MX",
    active: true,
    delegate: {
      label: "Search vehicles",
      query: "MX",
      results: [{ key: "mx-4821", label: "MX-4821", meta: "Active" }],
    },
  },
  autocomplete: {
    label: "Vehicle",
    suggestions: [{ label: "MX-4821", value: "mx-4821" }],
  },
  account: {
    name: "Ana Torres",
    status: "online",
    open: true,
    items: [{ key: "profile", label: "Profile" }],
    delegate: {
      name: "Ana Torres",
      items: [{ key: "profile", label: "Profile" }],
    },
  },
  commandPalette: {
    label: "Command palette",
    open: true,
    commands: [{ key: "open-route", label: "Open route" }],
  },
  notifications: {
    label: "Notifications",
    open: true,
    notifications: [{ key: "route", label: "Route delayed", unread: true }],
  },
  settings: {
    groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }],
  },
  sidebar: {
    groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes" }] }],
  },
  actions: [{ key: "settings", label: "Settings", icon: "settings" }],
  "data-product-hook": "topbar",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(topbarMarkup, /data-flow-pattern="topbar"/);
assert.match(topbarMarkup, /data-state="search-active"/);
assert.match(topbarMarkup, /data-action-count="1"/);
assert.match(topbarMarkup, /data-unread-count="1"/);
assert.match(topbarMarkup, /data-product-hook="topbar"/);
assert.match(topbarMarkup, /class="drawer/);
assert.match(topbarMarkup, /class="icon-button/);
assert.match(topbarMarkup, /class="field/);
assert.match(topbarMarkup, /class="input/);
assert.match(topbarMarkup, /class="badge/);
assert.match(topbarMarkup, /class="avatar/);
assert.match(topbarMarkup, /class="menu/);
assert.match(topbarMarkup, /data-flow-pattern="search"/);
assert.match(topbarMarkup, /data-flow-pattern="autocomplete"/);
assert.match(topbarMarkup, /data-flow-pattern="avatar-menu"/);
assert.match(topbarMarkup, /data-flow-pattern="command-palette"/);
assert.match(topbarMarkup, /data-flow-pattern="notification-panel"/);
assert.match(topbarMarkup, /data-flow-pattern="settings"/);
assert.match(topbarMarkup, /data-flow-pattern="sidebar"/);
assert.match(topbarMarkup, /data-flow-primitive="surface"/);
assert.doesNotMatch(topbarMarkup, /fleet-dashboard-suite|configuration-console|template-route|toolbar-local|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const topbarMobileMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  mobile: true,
  sidebar: { drawerOpen: true, groups: [{ title: "Operations", routes: [{ label: "Routes" }] }] },
}));
assert.match(topbarMobileMarkup, /data-state="mobile"/);
assert.match(topbarMobileMarkup, /data-mobile="true"/);

const topbarAccountMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  account: { name: "Ana Torres", open: true, items: [{ key: "profile", label: "Profile" }] },
}));
assert.match(topbarAccountMarkup, /data-state="account-open"/);

const topbarPermissionMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  permissionFiltered: true,
}));
assert.match(topbarPermissionMarkup, /data-state="permission-filtered"/);
assert.match(topbarPermissionMarkup, /Permission filtered/);

const topbarLoadingMarkup = renderToStaticMarkup(React.createElement(Topbar, {
  label: "Fleet shell",
  loading: true,
}));
assert.match(topbarLoadingMarkup, /data-state="loading"/);
assert.match(topbarLoadingMarkup, /aria-busy="true"/);

const toolbarMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  density: "sm",
  search: {
    label: "Search vehicles",
    query: "MX",
    input: { label: "Search vehicles", value: "MX" },
    delegate: { label: "Search vehicles", query: "MX", results: [{ key: "mx-4821", label: "MX-4821" }] },
  },
  filters: [{ key: "active", label: "Status: active", removable: true }],
  badges: [{ key: "selected", label: "2 selected", tone: "info" }],
  actions: [{ key: "assign", label: "Assign", variant: "primary" }],
  overflow: { triggerLabel: "More actions", open: true, items: [{ key: "export", label: "Export" }] },
  feedback: { label: "Toolbar updated", tone: "success" },
  "data-product-hook": "toolbar",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(toolbarMarkup, /data-flow-pattern="toolbar"/);
assert.match(toolbarMarkup, /role="toolbar"/);
assert.match(toolbarMarkup, /data-state="overflow"/);
assert.match(toolbarMarkup, /data-action-count="1"/);
assert.match(toolbarMarkup, /data-filter-count="1"/);
assert.match(toolbarMarkup, /data-badge-count="1"/);
assert.match(toolbarMarkup, /data-product-hook="toolbar"/);
assert.match(toolbarMarkup, /class="button button--primary"/);
assert.match(toolbarMarkup, /class="chip/);
assert.match(toolbarMarkup, /class="input/);
assert.match(toolbarMarkup, /class="menu/);
assert.match(toolbarMarkup, /class="toast/);
assert.match(toolbarMarkup, /class="badge/);
assert.match(toolbarMarkup, /data-flow-pattern="search"/);
assert.doesNotMatch(toolbarMarkup, /data-flow-pattern="topbar"|fleet-dashboard-suite|configuration-console|template-route|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const toolbarFilterMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  filters: [{ label: "Region: north" }],
}));
assert.match(toolbarFilterMarkup, /data-state="filter-active"/);

const toolbarPermissionMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  permissionBlocked: true,
  actions: [{ label: "Export" }],
}));
assert.match(toolbarPermissionMarkup, /data-state="permission-blocked"/);
assert.match(toolbarPermissionMarkup, /Permission blocked/);

const toolbarTopbarBoundaryMarkup = renderToStaticMarkup(React.createElement(Toolbar, {
  label: "Vehicle table actions",
  topbar: { label: "Global shell", account: { name: "Ana Torres", items: [{ key: "profile", label: "Profile" }] } },
}));
assert.match(toolbarTopbarBoundaryMarkup, /data-flow-pattern="toolbar"/);
assert.match(toolbarTopbarBoundaryMarkup, /data-flow-pattern="topbar"/);

const bulkActionsMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  density: "sm",
  selectedCount: 2,
  totalCount: 5,
  eligibleCount: 1,
  selection: { label: "Select vehicles" },
  table: {
    label: "Selected vehicles",
    columns: [{ key: "unit", label: "Unit" }, { key: "eligibility", label: "Eligibility" }],
    rows: [{ id: "mx-4821", unit: "MX-4821", eligibility: "Eligible" }],
  },
  toolbar: {
    label: "Bulk action host",
    actions: [{ key: "assign", label: "Assign", variant: "primary" }],
  },
  actions: [{ key: "assign", label: "Assign", variant: "primary" }],
  overflow: { triggerLabel: "More bulk actions", open: true, items: [{ key: "export", label: "Export" }] },
  confirmation: {
    label: "Confirm assignment",
    open: true,
    description: "Apply to selected vehicles.",
    actions: [{ key: "cancel", label: "Cancel" }, { key: "confirm", label: "Apply", variant: "primary" }],
  },
  progress: { label: "Applying bulk action", value: 60, showValue: true, state: "active" },
  feedback: { label: "Bulk action queued", tone: "info" },
  "data-product-hook": "bulk-actions",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(bulkActionsMarkup, /data-flow-pattern="bulk-actions"/);
assert.match(bulkActionsMarkup, /data-state="running"/);
assert.match(bulkActionsMarkup, /data-selected-count="2"/);
assert.match(bulkActionsMarkup, /data-eligible-count="1"/);
assert.match(bulkActionsMarkup, /data-action-count="1"/);
assert.match(bulkActionsMarkup, /data-product-hook="bulk-actions"/);
assert.match(bulkActionsMarkup, /class="choice checkbox"/);
assert.match(bulkActionsMarkup, /class="badge/);
assert.match(bulkActionsMarkup, /class="table/);
assert.match(bulkActionsMarkup, /data-flow-pattern="toolbar"/);
assert.match(bulkActionsMarkup, /class="button button--primary"/);
assert.match(bulkActionsMarkup, /class="menu/);
assert.match(bulkActionsMarkup, /class="dialog/);
assert.match(bulkActionsMarkup, /class="progress/);
assert.match(bulkActionsMarkup, /class="toast/);
assert.doesNotMatch(bulkActionsMarkup, /selection-policy-owned-by-toolbar|fake-checkbox|fake-menu|fleet-dashboard-suite|configuration-console|template-route|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const bulkActionsEmptyMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
}));
assert.match(bulkActionsEmptyMarkup, /data-state="none-selected"/);

const bulkActionsConfirmingMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  selectedCount: 1,
  totalCount: 1,
  confirmation: { label: "Confirm assignment", open: true },
}));
assert.match(bulkActionsConfirmingMarkup, /data-state="confirming"/);

const bulkActionsFailureMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  selectedCount: 2,
  totalCount: 2,
  progress: { label: "Applying bulk action", state: "error" },
}));
assert.match(bulkActionsFailureMarkup, /data-state="partial-failure"/);

const bulkActionsCompleteMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  selectedCount: 2,
  totalCount: 2,
  progress: { label: "Applying bulk action", state: "complete" },
}));
assert.match(bulkActionsCompleteMarkup, /data-state="complete"/);

const bulkActionsDisabledMarkup = renderToStaticMarkup(React.createElement(BulkActions, {
  label: "Vehicle bulk actions",
  disabled: true,
  selectedCount: 2,
  totalCount: 2,
}));
assert.match(bulkActionsDisabledMarkup, /data-state="disabled"/);

const chartWrapperMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  description: "Completed routes by day.",
  density: "sm",
  filtered: true,
  chart: { values: [12, 18, 22], labels: ["Mon", "Tue", "Wed"], variant: "line", value: "22" },
  summary: { label: "Completed", value: "22", tone: "success" },
  status: { label: "Filtered", tone: "warning" },
  primaryAction: { label: "Export" },
  overflow: { triggerLabel: "Chart actions", open: true, items: [{ key: "compare", label: "Compare" }] },
  table: {
    columns: [{ key: "day", label: "Day" }, { key: "routes", label: "Routes" }],
    rows: [{ id: "mon", day: "Mon", routes: "12" }],
  },
  list: { items: [{ key: "summary", label: "Best day", value: "Wed" }] },
  "data-product-hook": "chart-wrapper",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(chartWrapperMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(chartWrapperMarkup, /class="chart-wrapper"/);
assert.match(chartWrapperMarkup, /data-state="filtered"/);
assert.match(chartWrapperMarkup, /data-has-table-summary="true"/);
assert.match(chartWrapperMarkup, /data-has-list-summary="true"/);
assert.match(chartWrapperMarkup, /data-product-hook="chart-wrapper"/);
assert.match(chartWrapperMarkup, /data-flow-primitive="surface"/);
assert.match(chartWrapperMarkup, /class="chart-panel/);
assert.match(chartWrapperMarkup, /class="kpi-tile/);
assert.match(chartWrapperMarkup, /class="badge/);
assert.match(chartWrapperMarkup, /class="button button--secondary"/);
assert.match(chartWrapperMarkup, /class="menu/);
assert.match(chartWrapperMarkup, /class="table/);
assert.match(chartWrapperMarkup, /class="list/);
assert.doesNotMatch(chartWrapperMarkup, /class="card|custom-chart|dashboard-template|canvas|chart-wrapper-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const chartWrapperLoadingMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  loading: true,
  chart: { values: [12, 18] },
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperLoadingMarkup, /data-state="loading"/);
assert.match(chartWrapperLoadingMarkup, /class="skeleton/);

const chartWrapperEmptyMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  empty: true,
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperEmptyMarkup, /data-state="empty"/);
assert.match(chartWrapperEmptyMarkup, /class="empty-state/);

const chartWrapperErrorMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  error: { label: "Chart unavailable", description: "Retry later." },
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperErrorMarkup, /data-state="error"/);
assert.match(chartWrapperErrorMarkup, /class="error-panel/);

const chartWrapperPermissionMarkup = renderToStaticMarkup(React.createElement(ChartWrapper, {
  label: "Route completion",
  permissionBlocked: true,
  table: { columns: [{ key: "day", label: "Day" }], rows: [{ id: "mon", day: "Mon" }] },
}));
assert.match(chartWrapperPermissionMarkup, /data-state="permission-blocked"/);
assert.match(chartWrapperPermissionMarkup, /class="empty-state/);
assert.match(chartWrapperPermissionMarkup, /data-variant="permission"/);
assert.doesNotMatch(chartWrapperPermissionMarkup, /class="chart-panel/);

const calendarViewMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  label: "Maintenance calendar",
  description: "Operational schedule by selected period.",
  density: "sm",
  selectedDate: "2026-08-09",
  rangeLabel: "Aug 2026",
  timezoneLabel: "America/Mexico_City",
  dateControl: { label: "Schedule date", value: "2026-08-09", open: true },
  dense: true,
  selectedKey: "oil",
  events: [
    { key: "oil", label: "Oil change", time: "09:00", description: "Unit MX-4821", status: "warning", statusLabel: "Due soon" },
    { key: "renewal", label: "Permit renewal", time: "14:00", description: "Owner: Fleet ops", status: "success", statusLabel: "Confirmed" },
  ],
  actions: [{ label: "Create event" }],
  detail: { triggerLabel: "Open event details", title: "Oil change", open: true },
  "data-product-hook": "calendar-view",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(calendarViewMarkup, /data-flow-pattern="calendar-view"/);
assert.match(calendarViewMarkup, /data-state="dense"/);
assert.match(calendarViewMarkup, /data-event-count="2"/);
assert.match(calendarViewMarkup, /data-selected-date="2026-08-09"/);
assert.match(calendarViewMarkup, /data-product-hook="calendar-view"/);
assert.match(calendarViewMarkup, /data-flow-primitive="surface"/);
assert.match(calendarViewMarkup, /date-range-picker/);
assert.match(calendarViewMarkup, /class="badge/);
assert.match(calendarViewMarkup, /class="tooltip/);
assert.match(calendarViewMarkup, /class="button button--secondary"/);
assert.match(calendarViewMarkup, /class="list/);
assert.match(calendarViewMarkup, /class="card/);
assert.match(calendarViewMarkup, /class="popover/);
assert.doesNotMatch(calendarViewMarkup, /calendar-grid|calendar-cell|custom-calendar|event-pill|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const calendarViewLoadingMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  loading: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewLoadingMarkup, /data-state="loading"/);
assert.match(calendarViewLoadingMarkup, /class="skeleton/);

const calendarViewEmptyMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  empty: true,
  dateControl: { label: "Schedule date" },
  events: [],
}));
assert.match(calendarViewEmptyMarkup, /data-state="empty"/);
assert.match(calendarViewEmptyMarkup, /class="empty-state/);

const calendarViewErrorMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  error: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewErrorMarkup, /data-state="error"/);
assert.match(calendarViewErrorMarkup, /class="empty-state/);

const calendarViewDisabledMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  disabled: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewDisabledMarkup, /data-state="disabled"/);

const calendarViewRangeChangingMarkup = renderToStaticMarkup(React.createElement(CalendarView, {
  rangeChanging: true,
  dateControl: { label: "Schedule date" },
  events: [{ key: "oil", label: "Oil change" }],
}));
assert.match(calendarViewRangeChangingMarkup, /data-state="range-changing"/);
assert.match(calendarViewRangeChangingMarkup, /class="skeleton/);


console.log("react pattern layout actions render tests passed");
