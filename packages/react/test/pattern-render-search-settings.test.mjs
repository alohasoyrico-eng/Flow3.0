import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Search } from "../dist/patterns/Search.js";
import { NotificationPanel } from "../dist/patterns/NotificationPanel.js";
import { PullToRefresh } from "../dist/patterns/PullToRefresh.js";
import { CommandPalette } from "../dist/patterns/CommandPalette.js";
import { Settings } from "../dist/patterns/Settings.js";
import { PreferenceManagement } from "../dist/patterns/PreferenceManagement.js";
import { AccountOperations } from "../dist/patterns/AccountOperations.js";

const searchMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  helper: "Search by unit or driver",
  density: "sm",
  query: "MX",
  scopes: [
    { label: "Vehicles", value: "vehicles" },
    { label: "Drivers", value: "drivers" },
  ],
  scopeValue: "vehicles",
  results: [
    { key: "mx-4821", label: "MX-4821", meta: "Active" },
    { key: "mx-8840", label: "MX-8840", meta: "Maintenance", disabled: true },
  ],
  selectedKey: "mx-4821",
  resultCount: 2,
  submitAction: { label: "Search" },
  clearAction: { label: "Clear" },
  validation: { message: "2 results available", state: "info", live: true },
  "data-product-hook": "search",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(searchMarkup, /data-flow-pattern="search"/);
assert.match(searchMarkup, /data-result-count="2"/);
assert.match(searchMarkup, /data-has-scope="true"/);
assert.match(searchMarkup, /class="field/);
assert.match(searchMarkup, /class="input/);
assert.match(searchMarkup, /class="select/);
assert.match(searchMarkup, /class="inline-validation/);
assert.match(searchMarkup, /class="list/);
assert.match(searchMarkup, /class="button button--primary"/);
assert.match(searchMarkup, /class="button button--ghost"/);
assert.doesNotMatch(searchMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-|data-flow-pattern="autocomplete"|class="combobox/i);

const searchEmptyMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  query: "ZZ",
  state: "results",
  results: [],
  empty: { title: "No vehicles", description: "Try another scope." },
}));
assert.match(searchEmptyMarkup, /data-state="empty"/);
assert.match(searchEmptyMarkup, /class="empty-state/);

const searchInvalidMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  query: "%",
  validation: { message: "Use at least two letters.", state: "error" },
}));
assert.match(searchInvalidMarkup, /data-state="invalid"/);
assert.match(searchInvalidMarkup, /aria-invalid="true"/);

const searchLoadingMarkup = renderToStaticMarkup(React.createElement(Search, {
  label: "Search vehicles",
  query: "MX",
  loading: true,
  results: [{ key: "mx-4821", label: "MX-4821" }],
}));
assert.match(searchLoadingMarkup, /data-state="loading"/);
assert.match(searchLoadingMarkup, /class="spinner/);

const notificationPanelMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  density: "sm",
  open: true,
  notifications: [
    { key: "route", label: "Route delayed", description: "Driver is 8 minutes late.", unread: true },
    { key: "sync", label: "Sync complete", description: "Cards are up to date." },
  ],
  selectedKey: "route",
  markAllAction: { label: "Mark all read" },
  feedback: { label: "Notifications updated", tone: "success" },
  "data-product-hook": "notification-panel",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(notificationPanelMarkup, /data-flow-pattern="notification-panel"/);
assert.match(notificationPanelMarkup, /data-state="unread"/);
assert.match(notificationPanelMarkup, /data-notification-count="2"/);
assert.match(notificationPanelMarkup, /data-unread-count="1"/);
assert.match(notificationPanelMarkup, /class="drawer/);
assert.match(notificationPanelMarkup, /class="badge/);
assert.match(notificationPanelMarkup, /class="list/);
assert.match(notificationPanelMarkup, /class="button button--secondary"/);
assert.match(notificationPanelMarkup, /class="icon-button/);
assert.match(notificationPanelMarkup, /class="toast/);
assert.doesNotMatch(notificationPanelMarkup, /topbar|notification-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const notificationPanelEmptyMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  notifications: [],
  empty: { title: "No notifications" },
}));
assert.match(notificationPanelEmptyMarkup, /data-state="empty"/);
assert.match(notificationPanelEmptyMarkup, /class="empty-state/);

const notificationPanelPermissionMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  permissionBlocked: true,
  notifications: [{ key: "route", label: "Route delayed", unread: true }],
}));
assert.match(notificationPanelPermissionMarkup, /data-state="permission-blocked"/);
assert.match(notificationPanelPermissionMarkup, /class="empty-state/);

const notificationPanelErrorMarkup = renderToStaticMarkup(React.createElement(NotificationPanel, {
  label: "Notifications",
  error: { title: "Notifications unavailable", description: "Retry later." },
  notifications: [{ key: "route", label: "Route delayed", unread: true }],
}));
assert.match(notificationPanelErrorMarkup, /data-state="error"/);
assert.match(notificationPanelErrorMarkup, /class="empty-state/);

const pullToRefreshMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  label: "Route updates",
  description: "Refresh route feed without losing context.",
  density: "sm",
  state: "refreshing",
  progress: 45,
  list: { items: [{ key: "route", label: "Route delayed", meta: "Updated now" }] },
  cards: [{ title: "Fleet status", value: "Stale", detail: "Pull or press refresh." }],
  fallbackAction: { label: "Refresh now" },
  validation: { message: "Refresh status is announced.", state: "info" },
  feedback: { label: "Refreshing routes", tone: "info" },
  "data-product-hook": "pull-to-refresh",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(pullToRefreshMarkup, /data-flow-pattern="pull-to-refresh"/);
assert.match(pullToRefreshMarkup, /data-state="refreshing"/);
assert.match(pullToRefreshMarkup, /data-progress="45"/);
assert.match(pullToRefreshMarkup, /data-reduced-motion="false"/);
assert.match(pullToRefreshMarkup, /data-card-count="1"/);
assert.match(pullToRefreshMarkup, /data-product-hook="pull-to-refresh"/);
assert.match(pullToRefreshMarkup, /class="animated-moment/);
assert.match(pullToRefreshMarkup, /class="progress/);
assert.match(pullToRefreshMarkup, /class="button button--secondary"/);
assert.match(pullToRefreshMarkup, /data-flow-primitive="surface"/);
assert.match(pullToRefreshMarkup, /class="list/);
assert.match(pullToRefreshMarkup, /class="card/);
assert.match(pullToRefreshMarkup, /class="inline-validation/);
assert.match(pullToRefreshMarkup, /class="toast/);
assert.doesNotMatch(pullToRefreshMarkup, /touchstart|pointermove|translateY|fake-progress|gesture-only|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const pullToRefreshReducedMotionMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  reducedMotion: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Refresh" },
}));
assert.match(pullToRefreshReducedMotionMarkup, /data-state="reduced-motion"/);
assert.match(pullToRefreshReducedMotionMarkup, /data-reduced-motion="true"/);

const pullToRefreshErrorMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  error: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Retry" },
}));
assert.match(pullToRefreshErrorMarkup, /data-state="error"/);
assert.match(pullToRefreshErrorMarkup, /Refresh failed/);

const pullToRefreshCompleteMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  complete: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Refresh" },
}));
assert.match(pullToRefreshCompleteMarkup, /data-state="complete"/);

const pullToRefreshDisabledMarkup = renderToStaticMarkup(React.createElement(PullToRefresh, {
  disabled: true,
  list: { items: [{ key: "route", label: "Route delayed" }] },
  fallbackAction: { label: "Refresh" },
}));
assert.match(pullToRefreshDisabledMarkup, /data-state="disabled"/);

const commandPaletteMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  density: "sm",
  open: true,
  query: "route",
  commands: [
    { key: "open-route", label: "Open route", icon: "route", shortcut: "R" },
    { key: "delete-route", label: "Delete route", tone: "danger", disabled: true, reason: "Requires owner approval" },
  ],
  primaryAction: { label: "Run command" },
  feedback: { label: "Command queued", tone: "success" },
  "data-product-hook": "command-palette",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(commandPaletteMarkup, /data-flow-pattern="command-palette"/);
assert.match(commandPaletteMarkup, /data-state="results"/);
assert.match(commandPaletteMarkup, /data-command-count="2"/);
assert.match(commandPaletteMarkup, /class="dialog/);
assert.match(commandPaletteMarkup, /class="field/);
assert.match(commandPaletteMarkup, /class="input/);
assert.match(commandPaletteMarkup, /class="menu/);
assert.match(commandPaletteMarkup, /class="button button--primary"/);
assert.match(commandPaletteMarkup, /class="toast/);
assert.doesNotMatch(commandPaletteMarkup, /topbar|data-flow-pattern="search"|class="combobox|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const commandPaletteEmptyMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  open: true,
  query: "missing",
  commands: [],
  empty: { title: "No commands" },
}));
assert.match(commandPaletteEmptyMarkup, /data-state="empty"/);
assert.match(commandPaletteEmptyMarkup, /class="empty-state/);

const commandPaletteLoadingMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  open: true,
  loading: true,
  commands: [{ key: "open-route", label: "Open route" }],
}));
assert.match(commandPaletteLoadingMarkup, /data-state="loading"/);
assert.match(commandPaletteLoadingMarkup, /class="spinner/);

const commandPaletteExecutingMarkup = renderToStaticMarkup(React.createElement(CommandPalette, {
  label: "Command palette",
  open: true,
  executingKey: "open-route",
  commands: [{ key: "open-route", label: "Open route" }],
}));
assert.match(commandPaletteExecutingMarkup, /data-state="executing"/);

const settingsMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  description: "Reusable preferences only.",
  density: "sm",
  dirty: true,
  summary: { title: "Preferences", value: "3", detail: "Reusable settings groups" },
  groups: [
    {
      key: "profile",
      title: "Profile",
      description: "Visible account preferences.",
      controls: [
        { key: "name", label: "Display name", value: "Ana Torres" },
        { key: "timezone", kind: "select", label: "Timezone", value: "mx", options: [{ label: "Mexico City", value: "mx" }] },
        { key: "alerts", kind: "switch", label: "Operational alerts", checked: true },
      ],
    },
  ],
  confirmation: {
    label: "Reset settings",
    description: "This restores defaults.",
    open: true,
    actions: [{ key: "cancel", label: "Cancel" }, { key: "reset", label: "Reset", variant: "danger", intent: "danger" }],
  },
  saveAction: { label: "Save settings" },
  resetAction: { label: "Reset" },
  feedback: { label: "Settings saved", tone: "success" },
  "data-product-hook": "settings",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(settingsMarkup, /data-flow-pattern="settings"/);
assert.match(settingsMarkup, /data-state="dirty"/);
assert.match(settingsMarkup, /data-group-count="1"/);
assert.match(settingsMarkup, /data-control-count="3"/);
assert.match(settingsMarkup, /data-flow-primitive="surface"/);
assert.match(settingsMarkup, /data-settings-group="profile"/);
assert.match(settingsMarkup, /class="card/);
assert.match(settingsMarkup, /class="input/);
assert.match(settingsMarkup, /class="select/);
assert.match(settingsMarkup, /class="switch/);
assert.match(settingsMarkup, /class="dialog/);
assert.match(settingsMarkup, /class="button button--primary"/);
assert.match(settingsMarkup, /class="toast/);
assert.doesNotMatch(settingsMarkup, /admin-template|business-admin|<form|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const settingsInvalidMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  dirty: true,
  validation: { message: "Review required preferences.", state: "error" },
  groups: [{ title: "Profile", controls: [{ label: "Display name", error: "Required" }] }],
}));
assert.match(settingsInvalidMarkup, /data-state="invalid"/);
assert.match(settingsInvalidMarkup, /class="toast/);

const settingsSavingMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  saving: true,
  dirty: true,
  saveAction: { label: "Save settings" },
  groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }],
}));
assert.match(settingsSavingMarkup, /data-state="saving"/);
assert.match(settingsSavingMarkup, /aria-busy="true"/);

const settingsPermissionMarkup = renderToStaticMarkup(React.createElement(Settings, {
  label: "Workspace settings",
  permissionBlocked: true,
  groups: [{ title: "Profile", controls: [{ label: "Display name", value: "Ana" }] }],
}));
assert.match(settingsPermissionMarkup, /data-state="permission-blocked"/);
assert.match(settingsPermissionMarkup, /data-flow-primitive="surface"/);

const preferenceManagementMarkup = renderToStaticMarkup(React.createElement(PreferenceManagement, {
  label: "Workspace preferences",
  description: "Governed settings flow.",
  density: "sm",
  dirty: true,
  summary: { label: "Unsaved" },
  settings: {
    label: "Notification preferences",
    dirty: true,
    groups: [{
      key: "notifications",
      title: "Notifications",
      description: "Channel preferences.",
      controls: [
        { key: "email", label: "Email updates", kind: "switch", checked: true },
        { key: "timezone", label: "Timezone", kind: "select", value: "mx", options: [{ label: "Mexico City", value: "mx" }] },
      ],
    }],
    saveAction: { label: "Save preferences" },
    resetAction: { label: "Reset preferences" },
  },
  sections: [{
    key: "profile-copy",
    title: "Profile copy",
    description: "Visible preference content.",
    state: "dirty",
    fields: [{ key: "display-name", label: "Display name", value: "Ana Torres" }],
    primaryAction: { key: "save-profile", label: "Save profile" },
  }],
  dangerZone: {
    label: "Delete workspace",
    description: "This cannot be undone.",
    open: true,
    confirm: { key: "delete", label: "Delete workspace" },
    cancel: { key: "cancel", label: "Keep workspace" },
  },
  "data-product-hook": "preference-management",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(preferenceManagementMarkup, /data-flow-pattern="preference-management"/);
assert.match(preferenceManagementMarkup, /data-flow-slot="preferenceSurface"/);
assert.match(preferenceManagementMarkup, /data-preference-state="danger-confirming"/);
assert.match(preferenceManagementMarkup, /data-settings-group-count="1"/);
assert.match(preferenceManagementMarkup, /data-form-section-count="1"/);
assert.match(preferenceManagementMarkup, /data-control-count="3"/);
assert.match(preferenceManagementMarkup, /data-flow-slot="preferenceSummary"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern-boundary="settings"/);
assert.match(preferenceManagementMarkup, /data-flow-slot="preferenceBlocks"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern-boundary="form-section"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern-boundary="confirmation-dialog"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern="settings"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern="form-section"/);
assert.match(preferenceManagementMarkup, /data-flow-pattern="confirmation-dialog"/);
assert.match(preferenceManagementMarkup, /data-flow-primitive="surface"/);
assert.match(preferenceManagementMarkup, /class="badge/);
assert.doesNotMatch(preferenceManagementMarkup, /preference-card|danger-zone-card|custom-modal|custom-overlay|fake-field|<form|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const accountOperationsMarkup = renderToStaticMarkup(React.createElement(AccountOperations, {
  label: "Account operations",
  description: "Review account state and audit history.",
  density: "sm",
  selectedAccountKey: "acct-1",
  detailOpen: true,
  summaries: [
    { key: "active", label: "24 active accounts" },
    { key: "review", label: "3 need review", tone: "warning" },
  ],
  accounts: {
    label: "Accounts",
    search: { label: "Account search", query: "acme" },
    filters: [{ key: "status", label: "Status: active" }],
    toolbar: { actions: [{ key: "export", label: "Export" }] },
    bulkActions: { actions: [{ key: "suspend", label: "Suspend" }] },
    table: {
      columns: [{ key: "name", label: "Name" }, { key: "status", label: "Status" }],
      rows: [{ id: "acct-1", name: "Acme", status: "Active" }],
      rowKey: "id",
    },
  },
  detail: {
    label: "Account detail",
    open: true,
    drawer: { triggerLabel: "Open account detail", closeLabel: "Close account detail" },
    list: { label: "Account fields", items: [{ key: "owner", label: "Owner", value: "Ana" }] },
    actions: [{ key: "review", label: "Review account" }],
  },
  timeline: {
    label: "Account audit",
    filtered: true,
    filters: [{ key: "risk", label: "Risk: high" }],
    events: [{ key: "evt-1", label: "Risk reviewed", status: "warning", timestamp: "2026-08-10" }],
  },
  "data-product-hook": "account-operations",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(accountOperationsMarkup, /data-flow-pattern="account-operations"/);
assert.match(accountOperationsMarkup, /data-flow-slot="accountOperationsSurface"/);
assert.match(accountOperationsMarkup, /data-account-operations-state="detail-open"/);
assert.match(accountOperationsMarkup, /data-summary-count="2"/);
assert.match(accountOperationsMarkup, /data-account-row-count="1"/);
assert.match(accountOperationsMarkup, /data-audit-event-count="1"/);
assert.match(accountOperationsMarkup, /data-flow-slot="operationsSummary"/);
assert.match(accountOperationsMarkup, /data-flow-slot="operationsMetric"/);
assert.match(accountOperationsMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(accountOperationsMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(accountOperationsMarkup, /data-flow-pattern-boundary="timeline"/);
assert.match(accountOperationsMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(accountOperationsMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(accountOperationsMarkup, /data-flow-pattern="timeline"/);
assert.match(accountOperationsMarkup, /data-flow-primitive="surface"/);
assert.match(accountOperationsMarkup, /class="badge/);
assert.doesNotMatch(accountOperationsMarkup, /account-card|account-row-card|custom-drawer|custom-timeline|internal-tools-local|account-table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);


console.log("react pattern search settings render tests passed");
