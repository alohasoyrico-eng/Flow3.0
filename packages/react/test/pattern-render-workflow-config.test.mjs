import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ColumnConfigurator } from "../dist/patterns/ColumnConfigurator.js";
import { DragSortableList } from "../dist/patterns/DragSortableList.js";
import { KanbanBoard } from "../dist/patterns/KanbanBoard.js";
import { DriverAndVehicleAdministration } from "../dist/patterns/DriverAndVehicleAdministration.js";
import { DriverOnboardingMobile } from "../dist/patterns/DriverOnboardingMobile.js";
import { FleetManagerOnboardingDesktop } from "../dist/patterns/FleetManagerOnboardingDesktop.js";
import { AdvancedFilters } from "../dist/patterns/AdvancedFilters.js";
import { SectionHeader } from "../dist/patterns/SectionHeader.js";

const columnConfiguratorMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  label: "Vehicle columns",
  description: "Choose columns for the operations table.",
  density: "sm",
  open: true,
  surface: { mode: "drawer", triggerLabel: "Columns" },
  columns: [
    { key: "unit", label: "Unit", required: true, requiredReason: "Identity column" },
    { key: "status", label: "Status", visible: true },
    { key: "route", label: "Route", visible: false },
  ],
  rows: [{ id: "mx-4821", unit: "MX-4821", status: "Active", route: "Centro" }],
  applyAction: { label: "Apply columns" },
  resetAction: { label: "Reset" },
  saveViewAction: { label: "Save view" },
  validation: { message: "Required identity columns stay visible.", state: "info" },
  feedback: { label: "Columns updated", tone: "success" },
  "data-product-hook": "column-configurator",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(columnConfiguratorMarkup, /data-flow-pattern="column-configurator"/);
assert.match(columnConfiguratorMarkup, /data-state="dirty"/);
assert.match(columnConfiguratorMarkup, /data-visible-count="2"/);
assert.match(columnConfiguratorMarkup, /data-column-count="3"/);
assert.match(columnConfiguratorMarkup, /data-surface-mode="drawer"/);
assert.match(columnConfiguratorMarkup, /data-product-hook="column-configurator"/);
assert.match(columnConfiguratorMarkup, /class="drawer/);
assert.match(columnConfiguratorMarkup, /data-flow-primitive="surface"/);
assert.match(columnConfiguratorMarkup, /class="choice checkbox"/);
assert.match(columnConfiguratorMarkup, /Identity column/);
assert.match(columnConfiguratorMarkup, /class="table/);
assert.match(columnConfiguratorMarkup, /class="inline-validation/);
assert.match(columnConfiguratorMarkup, /class="toast/);
assert.doesNotMatch(columnConfiguratorMarkup, /class="card|fake-checkbox|fake-drawer|fake-table|column-settings-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const columnConfiguratorDialogMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  surface: { mode: "dialog", triggerLabel: "Columns" },
  open: true,
  columns: [{ key: "unit", label: "Unit", required: true }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  applyAction: { label: "Apply" },
}));
assert.match(columnConfiguratorDialogMarkup, /data-surface-mode="dialog"/);
assert.match(columnConfiguratorDialogMarkup, /class="dialog/);

const columnConfiguratorMenuMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  surface: { mode: "menu", triggerLabel: "Columns" },
  open: true,
  columns: [{ key: "unit", label: "Unit", required: true }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  applyAction: { label: "Apply" },
}));
assert.match(columnConfiguratorMenuMarkup, /data-surface-mode="menu"/);
assert.match(columnConfiguratorMenuMarkup, /class="menu/);

const columnConfiguratorInvalidMarkup = renderToStaticMarkup(React.createElement(ColumnConfigurator, {
  columns: [{ key: "unit", label: "Unit", required: true, visible: false }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  applyAction: { label: "Apply" },
}));
assert.match(columnConfiguratorInvalidMarkup, /data-state="invalid"/);

const dragSortableListMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  label: "Dashboard module order",
  density: "sm",
  dirty: true,
  movingKey: "alerts",
  items: [
    { key: "summary", label: "Summary", locked: true, lockedReason: "Required first module" },
    { key: "alerts", label: "Alerts", description: "Moved with keyboard controls" },
    { key: "map", label: "Map" },
  ],
  settings: { label: "Order preferences" },
  saveAction: { label: "Save order" },
  undoAction: { label: "Undo move" },
  resetAction: { label: "Reset order" },
  feedback: { label: "Order ready to save", tone: "info" },
  "data-product-hook": "drag-sortable-list",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(dragSortableListMarkup, /data-flow-pattern="drag-sortable-list"/);
assert.match(dragSortableListMarkup, /data-state="keyboard-moving"/);
assert.match(dragSortableListMarkup, /data-item-count="3"/);
assert.match(dragSortableListMarkup, /data-settings-boundary="true"/);
assert.match(dragSortableListMarkup, /data-product-hook="drag-sortable-list"/);
assert.match(dragSortableListMarkup, /class="motion-boundary/);
assert.match(dragSortableListMarkup, /data-reduced-motion="false"/);
assert.match(dragSortableListMarkup, /class="list/);
assert.match(dragSortableListMarkup, /class="badge/);
assert.match(dragSortableListMarkup, /Required first module/);
assert.match(dragSortableListMarkup, /class="button button--ghost"/);
assert.match(dragSortableListMarkup, /data-flow-pattern-boundary="settings"/);
assert.match(dragSortableListMarkup, /class="toast/);
assert.doesNotMatch(dragSortableListMarkup, /pointermove|touchstart|translateX|fake-list|settings-owned-reorder|class="card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const dragSortableListReducedMotionMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  reducedMotion: true,
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListReducedMotionMarkup, /data-state="reduced-motion"/);
assert.match(dragSortableListReducedMotionMarkup, /data-reduced-motion="true"/);

const dragSortableListSavedMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  state: "saved",
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListSavedMarkup, /data-state="saved"/);

const dragSortableListErrorMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  error: true,
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListErrorMarkup, /data-state="error"/);

const dragSortableListDisabledMarkup = renderToStaticMarkup(React.createElement(DragSortableList, {
  disabled: true,
  items: [{ key: "summary", label: "Summary" }],
  saveAction: { label: "Save" },
}));
assert.match(dragSortableListDisabledMarkup, /data-state="disabled"/);

const kanbanBoardMarkup = renderToStaticMarkup(React.createElement(KanbanBoard, {
  label: "Growth board",
  description: "Onboarding experiments by state",
  density: "sm",
  selectedKey: "activate",
  selectedColumnKey: "doing",
  sortable: true,
  actions: [{ key: "add", label: "Add card" }],
  columns: [
    {
      key: "todo",
      label: "To do",
      limit: 2,
      items: [{ key: "brief", label: "Brief", description: "Draft experiment" }],
    },
    {
      key: "doing",
      label: "Doing",
      limit: 1,
      items: [
        { key: "activate", label: "Activation", description: "Keyboard movable", status: { label: "Live", tone: "success" } },
        { key: "review", label: "Review", locked: true, lockedReason: "Compliance review" },
      ],
    },
  ],
  "data-product-hook": "kanban-board",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(kanbanBoardMarkup, /data-flow-pattern="kanban-board"/);
assert.match(kanbanBoardMarkup, /data-state="idle"/);
assert.match(kanbanBoardMarkup, /data-column-count="2"/);
assert.match(kanbanBoardMarkup, /data-card-count="3"/);
assert.match(kanbanBoardMarkup, /data-sortable="true"/);
assert.match(kanbanBoardMarkup, /data-product-hook="kanban-board"/);
assert.match(kanbanBoardMarkup, /data-flow-primitive="surface"/);
assert.match(kanbanBoardMarkup, /data-flow-pattern-boundary="drag-sortable-list"/);
assert.match(kanbanBoardMarkup, /data-flow-pattern="drag-sortable-list"/);
assert.match(kanbanBoardMarkup, /class="badge/);
assert.match(kanbanBoardMarkup, /class="button button--secondary"/);
assert.match(kanbanBoardMarkup, /Compliance review/);
assert.doesNotMatch(kanbanBoardMarkup, /class="card|board-column|kanban-card|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const kanbanBoardEmptyMarkup = renderToStaticMarkup(React.createElement(KanbanBoard, {
  columns: [],
  empty: { title: "No work", description: "Create the first lane." },
}));
assert.match(kanbanBoardEmptyMarkup, /data-flow-pattern="kanban-board"/);
assert.match(kanbanBoardEmptyMarkup, /data-state="empty"/);
assert.match(kanbanBoardEmptyMarkup, /class="empty-state/);

const kanbanBoardErrorMarkup = renderToStaticMarkup(React.createElement(KanbanBoard, {
  error: { label: "Board unavailable", description: "Retry later." },
  columns: [{ key: "todo", label: "To do", items: [{ key: "brief", label: "Brief" }] }],
}));
assert.match(kanbanBoardErrorMarkup, /data-state="error"/);
assert.match(kanbanBoardErrorMarkup, /class="error-panel/);

const driverAndVehicleAdministrationMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  label: "Driver and vehicle admin",
  description: "Review admin records.",
  density: "sm",
  selectedKey: "ana",
  toolbar: {
    label: "Admin toolbar",
    actions: [{ key: "export", label: "Export" }],
    filters: [{ key: "active", label: "Active" }],
    badges: [{ key: "records", label: "2 records" }],
  },
  summary: { label: "Administration", number: "2 records", status: "Active" },
  records: [
    { key: "ana", driver: "Ana Torres", vehicle: "MX-4821", type: "Driver", status: "active" },
    { key: "unit", driver: "Fleet Unit", vehicle: "MX-8840", type: "Vehicle", status: "review" },
  ],
  actions: [{ key: "assign", label: "Assign", icon: "person_add" }],
  primaryAction: { label: "Save changes" },
  secondaryAction: { label: "Cancel" },
  dialog: { label: "Review admin action", open: true, actions: [{ key: "confirm", label: "Confirm" }] },
  audit: { label: "Ana Torres updated", meta: "Today", status: "Verified" },
  pagination: { page: 1, pageCount: 2 },
  feedback: { label: "Administration ready", tone: "info" },
  "data-product-hook": "driver-and-vehicle-administration",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(driverAndVehicleAdministrationMarkup, /data-flow-pattern="driver-and-vehicle-administration"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-state="selected"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-record-count="2"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-action-count="1"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-product-hook="driver-and-vehicle-administration"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-flow-pattern="toolbar"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-admin-toolbar-boundary="true"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-flow-primitive="surface"/);
assert.match(driverAndVehicleAdministrationMarkup, /data-admin-surface="true"/);
assert.match(driverAndVehicleAdministrationMarkup, /class="card-summary/);
assert.match(driverAndVehicleAdministrationMarkup, /class="table/);
assert.match(driverAndVehicleAdministrationMarkup, /class="avatar/);
assert.match(driverAndVehicleAdministrationMarkup, /class="badge/);
assert.match(driverAndVehicleAdministrationMarkup, /class="pattern-action-item/);
assert.match(driverAndVehicleAdministrationMarkup, /class="button button--primary"/);
assert.match(driverAndVehicleAdministrationMarkup, /class="dialog/);
assert.match(driverAndVehicleAdministrationMarkup, /class="audit-event/);
assert.match(driverAndVehicleAdministrationMarkup, /class="pagination/);
assert.match(driverAndVehicleAdministrationMarkup, /class="toast/);
assert.doesNotMatch(driverAndVehicleAdministrationMarkup, /domain-authorization|route-policy|business-workflow|custom-table|fake-toolbar|custom-audit|class="card |rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const driverAndVehicleAdministrationLoadingMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  loading: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationLoadingMarkup, /data-state="loading"/);
assert.match(driverAndVehicleAdministrationLoadingMarkup, /aria-busy="true"/);

const driverAndVehicleAdministrationEmptyMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  records: [],
}));
assert.match(driverAndVehicleAdministrationEmptyMarkup, /data-state="empty"/);
assert.match(driverAndVehicleAdministrationEmptyMarkup, /class="empty-state/);

const driverAndVehicleAdministrationPermissionMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  permissionBlocked: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationPermissionMarkup, /data-state="permission-blocked"/);
assert.match(driverAndVehicleAdministrationPermissionMarkup, /Permission required/);

const driverAndVehicleAdministrationRunningMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  actionRunning: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
  actions: [{ key: "assign", label: "Assign" }],
}));
assert.match(driverAndVehicleAdministrationRunningMarkup, /data-state="action-running"/);

const driverAndVehicleAdministrationErrorMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  error: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationErrorMarkup, /data-state="error"/);

const driverAndVehicleAdministrationDisabledMarkup = renderToStaticMarkup(React.createElement(DriverAndVehicleAdministration, {
  disabled: true,
  records: [{ key: "ana", driver: "Ana Torres" }],
}));
assert.match(driverAndVehicleAdministrationDisabledMarkup, /data-state="disabled"/);

const driverOnboardingMobileMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  label: "Driver onboarding",
  description: "Complete mobile setup.",
  density: "sm",
  inProgress: true,
  currentStep: 1,
  reducedMotion: true,
  steps: [{ id: "identity", label: "Identity" }, { id: "verify", label: "Verify" }, { id: "done", label: "Done" }],
  summary: { label: "Mobile setup", number: "2/3", status: "In progress" },
  identityCard: { title: "Ana Torres", value: "MX-4821", detail: "Driver profile" },
  formSection: { title: "License", fields: [{ label: "License number", value: "A123" }] },
  identity: { label: "Driver name", value: "Ana Torres" },
  phone: { label: "Phone number", value: "5551234567", country: "MX" },
  code: { label: "Verification code", value: "123456" },
  validation: { message: "Continue verification.", state: "info" },
  biometricPrompt: { label: "Use biometrics", fallback: "Use code instead" },
  primaryAction: { label: "Continue" },
  secondaryAction: { label: "Back" },
  animatedMoment: { label: "Verification ready", animationSource: "driver.json" },
  feedback: { label: "Onboarding ready", tone: "info" },
  "data-product-hook": "driver-onboarding-mobile",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(driverOnboardingMobileMarkup, /data-flow-pattern="driver-onboarding-mobile"/);
assert.match(driverOnboardingMobileMarkup, /data-state="in-progress"/);
assert.match(driverOnboardingMobileMarkup, /data-step-count="3"/);
assert.match(driverOnboardingMobileMarkup, /data-reduced-motion="true"/);
assert.match(driverOnboardingMobileMarkup, /data-driver-onboarding-surface="true"/);
assert.match(driverOnboardingMobileMarkup, /data-form-section-boundary="true"/);
assert.match(driverOnboardingMobileMarkup, /class="stepper/);
assert.match(driverOnboardingMobileMarkup, /class="card-summary/);
assert.match(driverOnboardingMobileMarkup, /class="card/);
assert.match(driverOnboardingMobileMarkup, /class="field/);
assert.match(driverOnboardingMobileMarkup, /phone-input/);
assert.match(driverOnboardingMobileMarkup, /class="code-input/);
assert.match(driverOnboardingMobileMarkup, /class="inline-validation/);
assert.match(driverOnboardingMobileMarkup, /class="biometric-prompt/);
assert.match(driverOnboardingMobileMarkup, /class="animated-moment/);
assert.match(driverOnboardingMobileMarkup, /class="button button--primary"/);
assert.match(driverOnboardingMobileMarkup, /class="toast/);
assert.doesNotMatch(driverOnboardingMobileMarkup, /eligibility-policy|compliance-policy|template-sequence|biometric-only|custom-form-section|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const driverOnboardingVerifyingMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  verifying: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingVerifyingMarkup, /data-state="verifying"/);
assert.match(driverOnboardingVerifyingMarkup, /aria-busy="true"/);

const driverOnboardingBiometricMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  biometric: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingBiometricMarkup, /data-state="biometric"/);
assert.match(driverOnboardingBiometricMarkup, /class="biometric-prompt/);

const driverOnboardingInvalidMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  invalid: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingInvalidMarkup, /data-state="invalid"/);

const driverOnboardingBlockedMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  blocked: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingBlockedMarkup, /data-state="blocked"/);

const driverOnboardingCompleteMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  complete: true,
  phone: { label: "Phone number" },
  animatedMoment: { label: "Complete", animationSource: "done.json" },
}));
assert.match(driverOnboardingCompleteMarkup, /data-state="complete"/);

const driverOnboardingDisabledMarkup = renderToStaticMarkup(React.createElement(DriverOnboardingMobile, {
  disabled: true,
  phone: { label: "Phone number" },
}));
assert.match(driverOnboardingDisabledMarkup, /data-state="disabled"/);

const fleetManagerOnboardingDesktopMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  label: "Fleet manager onboarding",
  description: "Complete desktop setup.",
  density: "sm",
  inProgress: true,
  currentStep: 1,
  steps: [{ id: "setup", label: "Setup" }, { id: "review", label: "Review" }, { id: "done", label: "Done" }],
  metrics: [{ key: "progress", label: "Progress", value: "2/3", tone: "info" }],
  tasks: [{ key: "vehicles", label: "Add vehicles", checked: true }, { key: "drivers", label: "Invite drivers" }],
  fields: [{ key: "fleet", label: "Fleet name", value: "North" }],
  selects: [{ key: "region", label: "Region", value: "north", options: [{ label: "North", value: "north" }] }],
  reviewColumns: [{ key: "name", label: "Name" }, { key: "status", label: "Status" }],
  reviewRows: [{ id: "vehicle", name: "MX-4821", status: "Ready" }],
  settings: { label: "Setup settings", groups: [{ label: "Preferences", controls: [{ key: "alerts", kind: "checkbox", label: "Alerts", checked: true }] }] },
  validation: { message: "Review setup before finishing.", state: "warning" },
  primaryAction: { label: "Finish setup" },
  secondaryAction: { label: "Save draft" },
  feedback: { label: "Setup ready", tone: "info" },
  "data-product-hook": "fleet-manager-onboarding-desktop",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(fleetManagerOnboardingDesktopMarkup, /data-flow-pattern="fleet-manager-onboarding-desktop"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-state="in-progress"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-task-count="2"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-review-count="1"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-fleet-manager-onboarding-surface="true"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-settings-boundary="true"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="stepper/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="kpi-tile/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="badge/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="choice checkbox/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="field/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="select-control/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="inline-validation/);
assert.match(fleetManagerOnboardingDesktopMarkup, /data-flow-pattern="settings"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="table/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="button button--primary"/);
assert.match(fleetManagerOnboardingDesktopMarkup, /class="toast/);
assert.doesNotMatch(fleetManagerOnboardingDesktopMarkup, /business-template|product-route|custom-checklist|cloned-settings|dashboard-layout|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fleetManagerValidatingMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  validating: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerValidatingMarkup, /data-state="validating"/);
assert.match(fleetManagerValidatingMarkup, /aria-busy="true"/);

const fleetManagerBlockedMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  blocked: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerBlockedMarkup, /data-state="blocked"/);

const fleetManagerCompleteMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  complete: true,
  tasks: [{ key: "vehicles", label: "Add vehicles", checked: true }],
}));
assert.match(fleetManagerCompleteMarkup, /data-state="complete"/);

const fleetManagerEmptyMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  empty: true,
}));
assert.match(fleetManagerEmptyMarkup, /data-state="empty"/);
assert.match(fleetManagerEmptyMarkup, /class="empty-state/);

const fleetManagerPermissionMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  permissionBlocked: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerPermissionMarkup, /data-state="permission-blocked"/);
assert.match(fleetManagerPermissionMarkup, /Permission required/);

const fleetManagerDisabledMarkup = renderToStaticMarkup(React.createElement(FleetManagerOnboardingDesktop, {
  disabled: true,
  tasks: [{ key: "vehicles", label: "Add vehicles" }],
}));
assert.match(fleetManagerDisabledMarkup, /data-state="disabled"/);

const advancedFiltersMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  description: "Refine vehicles before applying.",
  density: "sm",
  open: true,
  dirty: true,
  fields: [
    { key: "unit", kind: "input", label: "Unit", value: "MX", placeholder: "Search unit" },
    { key: "status", kind: "select", label: "Status", value: "active", options: [{ label: "Active", value: "active" }] },
    { key: "service-window", kind: "date-range", label: "Service window", from: "2026-08-01", to: "2026-08-09", open: true },
  ],
  appliedFilters: [
    { key: "active", label: "Status: active", removable: true },
    { key: "window", label: "Service window", removable: true },
  ],
  validation: { label: "Advanced vehicle filters", message: "Review filter combinations.", state: "warning" },
  applyAction: { label: "Apply filters" },
  resetAction: { label: "Reset" },
  savedViews: { triggerLabel: "Saved filters", open: true, items: [{ key: "recent", label: "Recently active" }] },
  overflow: { triggerLabel: "More filter actions", open: true, items: [{ key: "save", label: "Save view" }] },
  feedback: { label: "Filters updated", tone: "success" },
  toolbar: {
    label: "Filter host",
    actions: [{ key: "open", label: "Advanced filters" }],
    filters: [{ key: "status", label: "Status: active" }],
  },
  "data-product-hook": "advanced-filters",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(advancedFiltersMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(advancedFiltersMarkup, /data-state="invalid"/);
assert.match(advancedFiltersMarkup, /data-field-count="3"/);
assert.match(advancedFiltersMarkup, /data-applied-count="2"/);
assert.match(advancedFiltersMarkup, /data-product-hook="advanced-filters"/);
assert.match(advancedFiltersMarkup, /class="drawer/);
assert.match(advancedFiltersMarkup, /data-flow-pattern="toolbar"/);
assert.match(advancedFiltersMarkup, /class="field/);
assert.match(advancedFiltersMarkup, /class="input/);
assert.match(advancedFiltersMarkup, /class="select-control/);
assert.match(advancedFiltersMarkup, /class="field date-picker date-range-picker"/);
assert.match(advancedFiltersMarkup, /class="chip/);
assert.match(advancedFiltersMarkup, /class="badge/);
assert.match(advancedFiltersMarkup, /class="button button--primary"/);
assert.match(advancedFiltersMarkup, /class="inline-validation/);
assert.match(advancedFiltersMarkup, /class="menu/);
assert.match(advancedFiltersMarkup, /class="toast/);
assert.doesNotMatch(advancedFiltersMarkup, /data-flow-pattern="filter-chip-group"|toolbar-owns-filter-editing|custom-filter-chip|query-syntax|fleet-dashboard-suite|configuration-console|template-route|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const advancedFiltersApplyingMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  applying: true,
  fields: [{ label: "Unit", value: "MX" }],
  applyAction: { label: "Apply filters" },
}));
assert.match(advancedFiltersApplyingMarkup, /data-state="applying"/);
assert.match(advancedFiltersApplyingMarkup, /aria-busy="true"/);

const advancedFiltersDirtyMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  dirty: true,
  fields: [{ label: "Unit", value: "MX" }],
}));
assert.match(advancedFiltersDirtyMarkup, /data-state="dirty"/);

const advancedFiltersAppliedMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  appliedFilters: [{ label: "Status: active" }],
}));
assert.match(advancedFiltersAppliedMarkup, /data-state="applied"/);

const advancedFiltersInvalidMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  fields: [{ label: "Unit", error: "Required" }],
}));
assert.match(advancedFiltersInvalidMarkup, /data-state="invalid"/);

const advancedFiltersDisabledMarkup = renderToStaticMarkup(React.createElement(AdvancedFilters, {
  label: "Advanced vehicle filters",
  disabled: true,
}));
assert.match(advancedFiltersDisabledMarkup, /data-state="disabled"/);

const sectionHeaderMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  description: "Review local assignment state.",
  headingLevel: 3,
  density: "sm",
  badge: { label: "12 ready", tone: "info", variant: "status" },
  tag: { label: "Draft", tone: "warning" },
  dirty: true,
  actions: [{ key: "save", label: "Save", variant: "primary" }],
  overflow: { triggerLabel: "More section actions", open: true, items: [{ key: "export", label: "Export" }] },
  toolbar: { label: "Section actions", actions: [{ key: "refresh", label: "Refresh" }] },
  settings: { groups: [{ title: "Display", controls: [{ label: "Compact view", checked: true }] }] },
  formSection: { title: "Assignment details", fields: [{ label: "Owner", value: "Ana" }] },
  "data-product-hook": "section-header",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(sectionHeaderMarkup, /data-flow-pattern="section-header"/);
assert.match(sectionHeaderMarkup, /data-state="dirty"/);
assert.match(sectionHeaderMarkup, /data-action-count="1"/);
assert.match(sectionHeaderMarkup, /data-product-hook="section-header"/);
assert.match(sectionHeaderMarkup, /<h3>Vehicle assignments<\/h3>/);
assert.match(sectionHeaderMarkup, /class="badge/);
assert.match(sectionHeaderMarkup, /class="tag/);
assert.match(sectionHeaderMarkup, /class="button button--primary"/);
assert.match(sectionHeaderMarkup, /class="menu/);
assert.match(sectionHeaderMarkup, /data-flow-pattern="toolbar"/);
assert.match(sectionHeaderMarkup, /data-flow-pattern="settings"/);
assert.match(sectionHeaderMarkup, /data-flow-pattern="form-section"/);
assert.doesNotMatch(sectionHeaderMarkup, /template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const sectionHeaderLoadingMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  loading: true,
}));
assert.match(sectionHeaderLoadingMarkup, /data-state="loading"/);
assert.match(sectionHeaderLoadingMarkup, /class="skeleton/);
assert.match(sectionHeaderLoadingMarkup, /aria-busy="true"/);

const sectionHeaderActionableMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  actions: [{ label: "Refresh" }],
}));
assert.match(sectionHeaderActionableMarkup, /data-state="actionable"/);

const sectionHeaderPermissionMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  permissionBlocked: true,
}));
assert.match(sectionHeaderPermissionMarkup, /data-state="permission-blocked"/);
assert.match(sectionHeaderPermissionMarkup, /Permission blocked/);

const sectionHeaderDisabledMarkup = renderToStaticMarkup(React.createElement(SectionHeader, {
  title: "Vehicle assignments",
  disabled: true,
}));
assert.match(sectionHeaderDisabledMarkup, /data-state="disabled"/);


console.log("react pattern workflow config render tests passed");
