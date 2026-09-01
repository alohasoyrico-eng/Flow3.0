import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ActionSheet } from "../dist/patterns/ActionSheet.js";
import { FullscreenSheet } from "../dist/patterns/FullscreenSheet.js";
import { HelpCenter } from "../dist/patterns/HelpCenter.js";
import { DrawerAdapter } from "../dist/patterns/DrawerAdapter.js";
import { QuickActionsGrid } from "../dist/patterns/QuickActionsGrid.js";
import { SwipeActions } from "../dist/patterns/SwipeActions.js";
import { Timeline } from "../dist/patterns/Timeline.js";

const actionSheetMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  description: "Choose a contextual trip action.",
  open: true,
  density: "sm",
  actions: [
    { key: "assign", label: "Assign driver", icon: "user", prominent: true },
    { key: "remove", label: "Remove trip", intent: "danger", tone: "danger", description: "Cannot be undone" },
  ],
  overflow: { triggerLabel: "More trip actions", open: true, items: [{ key: "share", label: "Share" }] },
  search: { query: "ana", results: [{ key: "ana", label: "Ana Lopez" }] },
  primaryAction: { label: "Apply action" },
  feedback: { label: "Action ready", tone: "info" },
  "data-product-hook": "action-sheet",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(actionSheetMarkup, /data-flow-pattern="action-sheet"/);
assert.match(actionSheetMarkup, /data-state="destructive"/);
assert.match(actionSheetMarkup, /data-density="sm"/);
assert.match(actionSheetMarkup, /data-action-count="2"/);
assert.match(actionSheetMarkup, /data-search-handoff="true"/);
assert.match(actionSheetMarkup, /data-product-hook="action-sheet"/);
assert.match(actionSheetMarkup, /class="dialog/);
assert.match(actionSheetMarkup, /class="list/);
assert.match(actionSheetMarkup, /class="menu/);
assert.match(actionSheetMarkup, /class="button button--primary"/);
assert.match(actionSheetMarkup, /class="toast/);
assert.match(actionSheetMarkup, /data-flow-pattern="search"/);
assert.match(actionSheetMarkup, /Remove trip/);
assert.doesNotMatch(actionSheetMarkup, /drawer|bottom-sheet|custom-overlay|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const actionSheetClosedMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetClosedMarkup, /data-state="closed"/);
assert.match(actionSheetClosedMarkup, /data-search-handoff="false"/);

const actionSheetLoadingMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  loading: true,
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetLoadingMarkup, /data-state="loading"/);
assert.match(actionSheetLoadingMarkup, /aria-busy="true"/);

const actionSheetDisabledMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  disabled: true,
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetDisabledMarkup, /data-state="disabled"/);

const actionSheetPermissionMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  permissionBlocked: true,
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetPermissionMarkup, /data-state="permission-blocked"/);

const actionSheetErrorMarkup = renderToStaticMarkup(React.createElement(ActionSheet, {
  label: "Trip actions",
  error: { label: "Action failed", description: "Try again." },
  actions: [{ key: "assign", label: "Assign driver" }],
}));
assert.match(actionSheetErrorMarkup, /data-state="error"/);
assert.match(actionSheetErrorMarkup, /Action failed/);

const fullscreenSheetMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  description: "Review the mobile task before saving.",
  open: true,
  dirty: true,
  density: "sm",
  summary: { label: "Trip MX-4821", status: "Draft", metrics: [{ label: "Stops", value: "4" }] },
  steps: [{ id: "details", label: "Details" }, { id: "review", label: "Review" }],
  currentStep: 1,
  fields: [
    { key: "driver", label: "Driver", value: "Ana" },
    { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }] },
  ],
  validation: { message: "Unsaved changes remain.", state: "warning" },
  primaryAction: { label: "Save trip" },
  secondaryAction: { label: "Review later" },
  closeAction: { label: "Close" },
  actionSheet: { label: "Secondary actions", actions: [{ key: "delete", label: "Delete", intent: "danger", tone: "danger" }] },
  feedback: { label: "Draft updated", tone: "info" },
  "data-product-hook": "fullscreen-sheet",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(fullscreenSheetMarkup, /data-flow-pattern="fullscreen-sheet"/);
assert.match(fullscreenSheetMarkup, /data-state="dirty"/);
assert.match(fullscreenSheetMarkup, /data-density="sm"/);
assert.match(fullscreenSheetMarkup, /data-field-count="2"/);
assert.match(fullscreenSheetMarkup, /data-action-sheet-boundary="true"/);
assert.match(fullscreenSheetMarkup, /data-product-hook="fullscreen-sheet"/);
assert.match(fullscreenSheetMarkup, /data-flow-primitive="surface"/);
assert.match(fullscreenSheetMarkup, /class="card-summary/);
assert.match(fullscreenSheetMarkup, /class="stepper/);
assert.match(fullscreenSheetMarkup, /class="input"/);
assert.match(fullscreenSheetMarkup, /class="select-control/);
assert.match(fullscreenSheetMarkup, /class="inline-validation/);
assert.match(fullscreenSheetMarkup, /class="button button--primary"/);
assert.match(fullscreenSheetMarkup, /class="toast/);
assert.match(fullscreenSheetMarkup, /data-flow-pattern="action-sheet"/);
assert.doesNotMatch(fullscreenSheetMarkup, /class="card |drawer|bottom-sheet|custom-overlay|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fullscreenSheetClosedMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
}));
assert.match(fullscreenSheetClosedMarkup, /data-state="closed"/);

const fullscreenSheetValidatingMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  validating: true,
  fields: [{ label: "Driver", value: "Ana" }],
}));
assert.match(fullscreenSheetValidatingMarkup, /data-state="validating"/);
assert.match(fullscreenSheetValidatingMarkup, /aria-busy="true"/);

const fullscreenSheetSavingMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  saving: true,
  primaryAction: { label: "Save trip" },
}));
assert.match(fullscreenSheetSavingMarkup, /data-state="saving"/);
assert.match(fullscreenSheetSavingMarkup, /aria-busy="true"/);

const fullscreenSheetErrorMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  error: { label: "Save failed" },
}));
assert.match(fullscreenSheetErrorMarkup, /data-state="error"/);
assert.match(fullscreenSheetErrorMarkup, /Save failed/);

const fullscreenSheetDismissMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  dismissConfirming: true,
}));
assert.match(fullscreenSheetDismissMarkup, /data-state="dismiss-confirming"/);

const fullscreenSheetDisabledMarkup = renderToStaticMarkup(React.createElement(FullscreenSheet, {
  label: "Edit trip",
  disabled: true,
}));
assert.match(fullscreenSheetDisabledMarkup, /data-state="disabled"/);

const helpCenterMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  label: "Fleet help",
  description: "Find support articles without leaving the workflow.",
  density: "sm",
  open: true,
  query: "drivers",
  selectedTopicKey: "drivers",
  topics: [{ key: "drivers", label: "Drivers", count: 4 }, { key: "billing", label: "Billing" }],
  articles: [{ id: "assign-driver", title: "Assign a driver", topic: "Drivers", summary: "Use assignment tools.", open: true }],
  search: { label: "Search help", query: "drivers", results: [{ key: "assign-driver", label: "Assign a driver" }] },
  sidebar: { label: "Help topics" },
  topicInput: { label: "Topic filter", value: "drivers" },
  recovery: { action: { label: "Contact support" } },
  "data-product-hook": "help-center",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(helpCenterMarkup, /data-flow-pattern="help-center"/);
assert.match(helpCenterMarkup, /data-state="topic-selected"/);
assert.match(helpCenterMarkup, /data-topic-count="2"/);
assert.match(helpCenterMarkup, /data-article-count="1"/);
assert.match(helpCenterMarkup, /data-search-boundary="true"/);
assert.match(helpCenterMarkup, /data-sidebar-boundary="true"/);
assert.match(helpCenterMarkup, /data-product-hook="help-center"/);
assert.match(helpCenterMarkup, /data-flow-primitive="surface"/);
assert.match(helpCenterMarkup, /class="drawer/);
assert.match(helpCenterMarkup, /data-flow-pattern="search"/);
assert.match(helpCenterMarkup, /data-flow-pattern="sidebar"/);
assert.match(helpCenterMarkup, /class="input/);
assert.match(helpCenterMarkup, /class="tag/);
assert.match(helpCenterMarkup, /class="accordion/);
assert.doesNotMatch(helpCenterMarkup, /Contact support/);
assert.doesNotMatch(helpCenterMarkup, /help-search|help-sidebar|custom-drawer|custom-help|topic-pill|faq-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const helpCenterLoadingMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  loading: true,
  articles: [{ id: "assign-driver", title: "Assign a driver" }],
}));
assert.match(helpCenterLoadingMarkup, /data-state="loading"/);
assert.match(helpCenterLoadingMarkup, /class="empty-state/);

const helpCenterEmptyMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  empty: true,
  articles: [],
}));
assert.match(helpCenterEmptyMarkup, /data-state="empty"/);
assert.match(helpCenterEmptyMarkup, /class="empty-state/);

const helpCenterErrorMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  error: true,
  articles: [{ id: "assign-driver", title: "Assign a driver" }],
}));
assert.match(helpCenterErrorMarkup, /data-state="error"/);
assert.match(helpCenterErrorMarkup, /class="empty-state/);

const helpCenterDisabledMarkup = renderToStaticMarkup(React.createElement(HelpCenter, {
  open: true,
  disabled: true,
  articles: [{ id: "assign-driver", title: "Assign a driver" }],
}));
assert.match(helpCenterDisabledMarkup, /data-state="disabled"/);

const drawerAdapterMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  description: "Adapt navigation and task drawer behavior.",
  open: true,
  responsive: true,
  density: "sm",
  drawer: { triggerLabel: "Open operations", closeLabel: "Close operations" },
  dialog: { label: "Review drawer", open: true, actions: [{ key: "close", label: "Close" }] },
  list: { items: [{ key: "routes", label: "Routes" }, { key: "drivers", label: "Drivers" }] },
  cards: [{ title: "Open tasks", value: "12", detail: "Needs review" }],
  menu: { triggerLabel: "Drawer options", open: true, items: [{ key: "pin", label: "Pin drawer" }] },
  actions: [{ key: "apply", label: "Apply", variant: "primary" }],
  topbar: { label: "Operations topbar", mobile: true, search: { label: "Search operations", query: "routes" } },
  sidebar: { groups: [{ title: "Operations", routes: [{ key: "routes", label: "Routes" }] }] },
  multiStepForm: { label: "Task flow boundary" },
  feedback: { label: "Drawer adapted", tone: "info" },
  "data-product-hook": "drawer-adapter",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(drawerAdapterMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(drawerAdapterMarkup, /data-state="responsive"/);
assert.match(drawerAdapterMarkup, /data-density="sm"/);
assert.match(drawerAdapterMarkup, /data-card-count="1"/);
assert.match(drawerAdapterMarkup, /data-list-count="2"/);
assert.match(drawerAdapterMarkup, /data-multi-step-form-boundary="true"/);
assert.match(drawerAdapterMarkup, /data-product-hook="drawer-adapter"/);
assert.match(drawerAdapterMarkup, /class="drawer/);
assert.match(drawerAdapterMarkup, /class="dialog/);
assert.match(drawerAdapterMarkup, /data-flow-primitive="surface"/);
assert.match(drawerAdapterMarkup, /class="list/);
assert.match(drawerAdapterMarkup, /class="card/);
assert.match(drawerAdapterMarkup, /class="menu/);
assert.match(drawerAdapterMarkup, /class="button button--primary"/);
assert.match(drawerAdapterMarkup, /class="toast/);
assert.match(drawerAdapterMarkup, /data-flow-pattern="topbar"/);
assert.match(drawerAdapterMarkup, /data-flow-pattern="sidebar"/);
assert.match(drawerAdapterMarkup, /data-flow-pattern-boundary="multi-step-form"/);
assert.match(drawerAdapterMarkup, /data-flow-pattern="multi-step-form"/);
assert.doesNotMatch(drawerAdapterMarkup, /bottom-sheet|custom-overlay|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const drawerAdapterModalMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  modal: true,
}));
assert.match(drawerAdapterModalMarkup, /data-state="modal"/);

const drawerAdapterNonModalMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  nonModal: true,
}));
assert.match(drawerAdapterNonModalMarkup, /data-state="non-modal"/);

const drawerAdapterLoadingMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  loading: true,
  actions: [{ label: "Apply" }],
}));
assert.match(drawerAdapterLoadingMarkup, /data-state="loading"/);
assert.match(drawerAdapterLoadingMarkup, /aria-busy="true"/);

const drawerAdapterErrorMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  error: { label: "Drawer failed" },
}));
assert.match(drawerAdapterErrorMarkup, /data-state="error"/);
assert.match(drawerAdapterErrorMarkup, /Drawer failed/);

const drawerAdapterDisabledMarkup = renderToStaticMarkup(React.createElement(DrawerAdapter, {
  label: "Operations drawer",
  disabled: true,
}));
assert.match(drawerAdapterDisabledMarkup, /data-state="disabled"/);

const quickActionsGridMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  density: "sm",
  actions: [
    { key: "assign", label: "Assign driver", icon: "person", badge: "2", status: { label: "Ready", tone: "success" }, tooltip: { content: "Assigns a driver to the selected trip." } },
    { key: "delete", label: "Delete trip", icon: "delete", intent: "danger", tone: "danger", status: { label: "Needs review", tone: "warning" }, tooltip: { content: "Requires confirmation before deletion." } },
  ],
  search: { label: "Find target", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
  confirmation: { label: "Confirm delete", open: true, actions: [{ key: "cancel", label: "Cancel" }, { key: "delete", label: "Delete", variant: "primary", intent: "danger" }] },
  feedback: { label: "Actions ready", tone: "info" },
  "data-product-hook": "quick-actions-grid",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(quickActionsGridMarkup, /data-flow-pattern="quick-actions-grid"/);
assert.match(quickActionsGridMarkup, /data-state="confirming"/);
assert.match(quickActionsGridMarkup, /data-density="sm"/);
assert.match(quickActionsGridMarkup, /data-action-count="2"/);
assert.match(quickActionsGridMarkup, /data-search-boundary="true"/);
assert.match(quickActionsGridMarkup, /data-product-hook="quick-actions-grid"/);
assert.match(quickActionsGridMarkup, /class="pattern-action-item/);
assert.match(quickActionsGridMarkup, /class="badge/);
assert.match(quickActionsGridMarkup, /class="tooltip/);
assert.match(quickActionsGridMarkup, /class="dialog/);
assert.match(quickActionsGridMarkup, /class="toast/);
assert.match(quickActionsGridMarkup, /data-flow-pattern="search"/);
assert.doesNotMatch(quickActionsGridMarkup, /custom-button|fake-button|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const quickActionsLoadingMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  loading: true,
  actions: [{ label: "Assign driver" }],
}));
assert.match(quickActionsLoadingMarkup, /data-state="loading"/);
assert.match(quickActionsLoadingMarkup, /aria-busy="true"/);

const quickActionsDisabledMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  disabled: true,
  actions: [{ label: "Assign driver" }],
}));
assert.match(quickActionsDisabledMarkup, /data-state="disabled"/);

const quickActionsPermissionMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  permissionBlocked: true,
  actions: [{ label: "Assign driver", status: { label: "Permission needed", tone: "warning" } }],
}));
assert.match(quickActionsPermissionMarkup, /data-state="permission-blocked"/);
assert.match(quickActionsPermissionMarkup, /Permission needed/);

const quickActionsCompletedMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  completed: true,
  feedback: { label: "Done", tone: "success" },
}));
assert.match(quickActionsCompletedMarkup, /data-state="completed"/);
assert.match(quickActionsCompletedMarkup, /Done/);

const quickActionsErrorMarkup = renderToStaticMarkup(React.createElement(QuickActionsGrid, {
  label: "Frequent actions",
  error: { label: "Action failed" },
}));
assert.match(quickActionsErrorMarkup, /data-state="error"/);
assert.match(quickActionsErrorMarkup, /Action failed/);

const swipeActionsMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  density: "sm",
  revealed: true,
  row: { label: "Fuel charge", meta: "MX-4821", amount: "$82.00", status: "Pending", category: "fuel" },
  actions: [
    { key: "approve", label: "Approve", icon: "check", badge: "1" },
    { key: "decline", label: "Decline", icon: "close", intent: "danger", tone: "danger", fallbackLabel: "Decline without swipe" },
  ],
  confirmation: { label: "Confirm decline", open: true, actions: [{ key: "cancel", label: "Cancel" }, { key: "decline", label: "Decline", intent: "danger" }] },
  recovery: { label: "Action can be undone", tone: "info", actionLabel: "Undo" },
  feedback: { label: "Swipe actions ready", tone: "success" },
  "data-product-hook": "swipe-actions",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(swipeActionsMarkup, /data-flow-pattern="swipe-actions"/);
assert.match(swipeActionsMarkup, /data-state="confirming"/);
assert.match(swipeActionsMarkup, /data-density="sm"/);
assert.match(swipeActionsMarkup, /data-action-count="2"/);
assert.match(swipeActionsMarkup, /data-non-swipe-access="true"/);
assert.match(swipeActionsMarkup, /data-product-hook="swipe-actions"/);
assert.match(swipeActionsMarkup, /class="movement-row/);
assert.match(swipeActionsMarkup, /class="pattern-action-item/);
assert.match(swipeActionsMarkup, /class="button button--secondary"/);
assert.match(swipeActionsMarkup, /without swipe/);
assert.match(swipeActionsMarkup, /class="dialog/);
assert.match(swipeActionsMarkup, /class="toast/);
assert.doesNotMatch(swipeActionsMarkup, /touchstart|pointermove|translateX|custom-button|fake-button|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const swipeActionsRevealedMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  revealed: true,
  row: { label: "Fuel charge" },
  actions: [{ label: "Approve" }],
}));
assert.match(swipeActionsRevealedMarkup, /data-state="revealed"/);

const swipeActionsThresholdMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  threshold: true,
  row: { label: "Fuel charge" },
  actions: [{ label: "Approve" }],
}));
assert.match(swipeActionsThresholdMarkup, /data-state="threshold"/);

const swipeActionsCommittedMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  committed: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsCommittedMarkup, /data-state="committed"/);

const swipeActionsConfirmingMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  confirming: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsConfirmingMarkup, /data-state="confirming"/);

const swipeActionsDisabledMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  disabled: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsDisabledMarkup, /data-state="disabled"/);

const swipeActionsReducedMotionMarkup = renderToStaticMarkup(React.createElement(SwipeActions, {
  label: "Transaction actions",
  reducedMotion: true,
  row: { label: "Fuel charge" },
}));
assert.match(swipeActionsReducedMotionMarkup, /data-state="reduced-motion"/);

const timelineMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  label: "Route audit timeline",
  description: "Chronological audit history.",
  density: "sm",
  filtered: true,
  selectedKey: "delay",
  filters: [{ key: "status", label: "Status: warning", removable: true }],
  status: { label: "2 audit events", tone: "warning" },
  events: [
    { key: "assigned", label: "Driver assigned", actor: "Ana Torres", timestamp: "2026-08-09 09:00", status: "success", statusLabel: "Verified" },
    { key: "delay", label: "Delay reported", description: "Route Centro", timestamp: "2026-08-09 09:30", status: "warning", statusLabel: "Needs review" },
  ],
  clearAction: { label: "Clear filters" },
  "data-product-hook": "timeline",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(timelineMarkup, /data-flow-pattern="timeline"/);
assert.match(timelineMarkup, /data-state="filtered"/);
assert.match(timelineMarkup, /data-event-count="2"/);
assert.match(timelineMarkup, /data-filter-count="1"/);
assert.match(timelineMarkup, /data-product-hook="timeline"/);
assert.match(timelineMarkup, /class="audit-event/);
assert.match(timelineMarkup, /class="list/);
assert.match(timelineMarkup, /class="chip/);
assert.match(timelineMarkup, /class="badge/);
assert.match(timelineMarkup, /class="button button--ghost"/);
assert.doesNotMatch(timelineMarkup, /timeline-card|event-card|event-pill|status-pill|custom-timeline|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const timelineLoadingMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  loading: true,
  events: [{ key: "assigned", label: "Driver assigned" }],
}));
assert.match(timelineLoadingMarkup, /data-state="loading"/);
assert.match(timelineLoadingMarkup, /class="empty-state/);

const timelineEmptyMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  empty: true,
  events: [],
}));
assert.match(timelineEmptyMarkup, /data-state="empty"/);
assert.match(timelineEmptyMarkup, /class="empty-state/);

const timelineErrorMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  error: true,
  events: [{ key: "assigned", label: "Driver assigned" }],
}));
assert.match(timelineErrorMarkup, /data-state="error"/);
assert.match(timelineErrorMarkup, /class="empty-state/);

const timelinePermissionMarkup = renderToStaticMarkup(React.createElement(Timeline, {
  permissionBlocked: true,
  events: [{ key: "assigned", label: "Driver assigned" }],
}));
assert.match(timelinePermissionMarkup, /data-state="permission-blocked"/);
assert.match(timelinePermissionMarkup, /class="empty-state/);


console.log("react pattern sheets feedback render tests passed");
