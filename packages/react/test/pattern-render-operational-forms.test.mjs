import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { KpiCard } from "../dist/patterns/KpiCard.js";
import { ConfirmationDialog } from "../dist/patterns/ConfirmationDialog.js";
import { FileUpload } from "../dist/patterns/FileUpload.js";
import { MultiSelect } from "../dist/patterns/MultiSelect.js";
import { FormSection } from "../dist/patterns/FormSection.js";
import { RolesAndPermissions } from "../dist/patterns/RolesAndPermissions.js";
import { VirtualDataTable } from "../dist/patterns/VirtualDataTable.js";

const kpiMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  value: 96,
  unit: "%",
  delta: "+4%",
  trend: "up",
  tone: "success",
  density: "sm",
  status: { label: "Healthy", tone: "success" },
  tag: { label: "Live", tone: "info" },
  action: { label: "Review" },
  "data-product-hook": "kpi-card",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(kpiMarkup, /data-flow-pattern="kpi-card"/);
assert.match(kpiMarkup, /class="kpi-card"/);
assert.match(kpiMarkup, /class="kpi-tile/);
assert.match(kpiMarkup, /class="badge/);
assert.match(kpiMarkup, /class="tag/);
assert.match(kpiMarkup, /class="button button--ghost"/);
assert.doesNotMatch(kpiMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const kpiLoadingMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  loading: true,
}));
assert.match(kpiLoadingMarkup, /class="skeleton/);

const kpiErrorMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  state: "error",
  error: { label: "Metric unavailable", description: "Retry later." },
}));
assert.match(kpiErrorMarkup, /class="error-panel/);

const kpiEmptyMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  value: 96,
  state: "empty",
}));
assert.match(kpiEmptyMarkup, /data-state="empty"/);
assert.match(kpiEmptyMarkup, /class="empty-state/);
assert.doesNotMatch(kpiEmptyMarkup, /class="kpi-tile/);

const kpiPermissionMarkup = renderToStaticMarkup(React.createElement(KpiCard, {
  label: "Fleet availability",
  value: 96,
  state: "permission-blocked",
}));
assert.match(kpiPermissionMarkup, /data-state="permission-blocked"/);
assert.match(kpiPermissionMarkup, /data-variant="permission"/);
assert.doesNotMatch(kpiPermissionMarkup, /class="kpi-tile/);

const confirmationMarkup = renderToStaticMarkup(React.createElement(ConfirmationDialog, {
  label: "Delete route",
  description: "This action cannot be undone.",
  open: true,
  destructive: true,
  density: "sm",
  confirm: { label: "Delete" },
  cancel: { label: "Keep route" },
  validation: { message: "Review impacted assignments.", state: "warning" },
  recovery: {
    label: "Delete failed",
    description: "Try again later.",
    secondaryAction: { label: "View details" },
  },
  feedback: { label: "Route delete queued", actionLabel: "Undo" },
  "data-product-hook": "confirmation-dialog",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(confirmationMarkup, /data-flow-pattern="confirmation-dialog"/);
assert.match(confirmationMarkup, /class="dialog/);
assert.match(confirmationMarkup, /class="button/);
assert.match(confirmationMarkup, /class="inline-validation/);
assert.match(confirmationMarkup, /class="error-panel/);
assert.match(confirmationMarkup, /class="toast/);
assert.doesNotMatch(confirmationMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fileUploadMarkup = renderToStaticMarkup(React.createElement(FileUpload, {
  label: "Proof of delivery",
  description: "Upload a PDF or image.",
  density: "sm",
  state: "uploading",
  files: [
    { key: "pod", name: "pod.pdf", size: "1.2 MB", type: "PDF", status: "Uploading" },
  ],
  progress: { label: "Upload progress", value: 64, showValue: true },
  chooseAction: { label: "Choose file" },
  removeAction: { label: "Remove" },
  validation: { message: "PDF, PNG, or JPG only.", state: "warning" },
  feedback: { label: "Upload queued", description: "Processing file." },
  "data-product-hook": "file-upload",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(fileUploadMarkup, /data-flow-pattern="file-upload"/);
assert.match(fileUploadMarkup, /data-flow-primitive="surface"/);
assert.match(fileUploadMarkup, /data-flow-slot="surface"/);
assert.match(fileUploadMarkup, /data-file-count="1"/);
assert.match(fileUploadMarkup, /type="file"/);
assert.match(fileUploadMarkup, /class="file-upload/);
assert.match(fileUploadMarkup, /class="file-upload__dropzone"/);
assert.match(fileUploadMarkup, /class="file-upload__list"/);
assert.match(fileUploadMarkup, /class="file-upload__item"/);
assert.match(fileUploadMarkup, /class="file-upload__item-name"/);
assert.match(fileUploadMarkup, /class="progress/);
assert.match(fileUploadMarkup, /class="inline-validation/);
assert.match(fileUploadMarkup, /class="icon-button icon-button--ghost/);
assert.match(fileUploadMarkup, /class="toast/);
assert.doesNotMatch(fileUploadMarkup, /class="tag|class="empty-state|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const fileUploadEmptyMarkup = renderToStaticMarkup(React.createElement(FileUpload, {
  label: "Proof of delivery",
  files: [],
  empty: { title: "No file selected", description: "Choose a file to continue." },
}));
assert.match(fileUploadEmptyMarkup, /data-flow-pattern="file-upload"/);
assert.match(fileUploadEmptyMarkup, /data-flow-primitive="surface"/);
assert.match(fileUploadEmptyMarkup, /data-flow-slot="surface"/);
assert.match(fileUploadEmptyMarkup, /class="file-upload__dropzone"/);
assert.doesNotMatch(fileUploadEmptyMarkup, /class="empty-state/);

const multiSelectMarkup = renderToStaticMarkup(React.createElement(MultiSelect, {
  label: "Regions",
  helper: "Choose every active service region.",
  density: "sm",
  open: true,
  value: ["north", "central"],
  options: [
    { label: "North", value: "north", meta: "12 routes" },
    { label: "Central", value: "central", meta: "8 routes" },
    { label: "South", value: "south", meta: "Unavailable", disabled: true },
  ],
  clearAction: { label: "Clear regions" },
  validation: { message: "At least one region is required.", state: "warning" },
  "data-product-hook": "multi-select",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(multiSelectMarkup, /data-flow-pattern="multi-select"/);
assert.match(multiSelectMarkup, /data-selected-count="2"/);
assert.match(multiSelectMarkup, /class="select-control/);
assert.match(multiSelectMarkup, /class="badge/);
assert.match(multiSelectMarkup, /class="choice checkbox/);
assert.match(multiSelectMarkup, /class="chip/);
assert.match(multiSelectMarkup, /class="button button--ghost"/);
assert.match(multiSelectMarkup, /class="inline-validation/);
assert.doesNotMatch(multiSelectMarkup, /data-multi-select-count|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const multiSelectEmptyMarkup = renderToStaticMarkup(React.createElement(MultiSelect, {
  label: "Regions",
  options: [],
  empty: { title: "No regions", description: "Try another account." },
}));
assert.match(multiSelectEmptyMarkup, /data-flow-pattern="multi-select"/);
assert.match(multiSelectEmptyMarkup, /class="empty-state/);

const formSectionMarkup = renderToStaticMarkup(React.createElement(FormSection, {
  title: "Driver profile",
  description: "Keep dispatch records current.",
  density: "sm",
  state: "dirty",
  fields: [
    { key: "name", label: "Driver name", value: "Ana Torres", required: true },
    { key: "notes", kind: "text-area", label: "Notes", value: "Prefers morning routes.", maxLength: 120 },
  ],
  primaryAction: { label: "Save profile" },
  secondaryAction: { label: "Cancel" },
  validation: { message: "Review required fields.", state: "warning", summary: "2 fields changed" },
  feedback: { label: "Profile saved", description: "Changes will sync shortly." },
  "data-product-hook": "form-section",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(formSectionMarkup, /data-flow-pattern="form-section"/);
assert.match(formSectionMarkup, /data-field-count="2"/);
assert.match(formSectionMarkup, /data-flow-primitive="surface"/);
assert.match(formSectionMarkup, /class="surface"/);
assert.match(formSectionMarkup, /class="input/);
assert.match(formSectionMarkup, /class="text-area/);
assert.match(formSectionMarkup, /class="inline-validation/);
assert.match(formSectionMarkup, /class="button button--primary"/);
assert.match(formSectionMarkup, /class="toast/);
assert.doesNotMatch(formSectionMarkup, /<form|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const rolesAndPermissionsMarkup = renderToStaticMarkup(React.createElement(RolesAndPermissions, {
  label: "Roles and permissions",
  description: "Review access before saving.",
  density: "sm",
  state: "dirty",
  roles: [
    { key: "admin", label: "Admin" },
    { key: "dispatcher", label: "Dispatcher" },
  ],
  permissions: [
    { key: "cards.view", label: "View cards", badge: "Cards", tone: "info" },
    { key: "drivers.suspend", label: "Suspend drivers", badge: "Drivers", tone: "warning", disabled: true, disabledReason: "Requires owner approval." },
  ],
  values: {
    admin: { "cards.view": true, "drivers.suspend": true },
    dispatcher: { "cards.view": true, "drivers.suspend": false },
  },
  validation: { message: "Owner approval required for risky permissions.", state: "warning" },
  audit: { label: "Last edited by Ana", description: "Permission matrix changed yesterday.", status: "verified" },
  confirmation: {
    label: "Confirm permission change",
    description: "This can affect operational access.",
    open: true,
    actions: [{ label: "Cancel", variant: "secondary" }, { label: "Apply", variant: "danger", intent: "danger" }],
  },
  actions: [{ label: "Save changes", variant: "primary" }],
  feedback: { label: "Permissions updated", tone: "success" },
  "data-product-hook": "roles-and-permissions",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(rolesAndPermissionsMarkup, /data-flow-pattern="roles-and-permissions"/);
assert.match(rolesAndPermissionsMarkup, /data-role-count="2"/);
assert.match(rolesAndPermissionsMarkup, /data-permission-count="2"/);
assert.match(rolesAndPermissionsMarkup, /class="table/);
assert.match(rolesAndPermissionsMarkup, /class="switch/);
assert.match(rolesAndPermissionsMarkup, /class="badge/);
assert.match(rolesAndPermissionsMarkup, /class="tooltip/);
assert.match(rolesAndPermissionsMarkup, /class="dialog/);
assert.match(rolesAndPermissionsMarkup, /class="inline-validation/);
assert.match(rolesAndPermissionsMarkup, /class="audit-event/);
assert.match(rolesAndPermissionsMarkup, /class="toast/);
assert.match(rolesAndPermissionsMarkup, /class="button button--primary"/);
assert.doesNotMatch(rolesAndPermissionsMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const virtualDataTableMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  description: "Operational fleet rows",
  density: "sm",
  virtualized: true,
  columns: [
    { key: "unit", label: "Unit", sortable: true },
    { key: "status", label: "Status" },
  ],
  rows: [
    { id: "mx-4821", unit: "MX-4821", status: "Active" },
    { id: "mx-8840", unit: "MX-8840", status: "Maintenance" },
  ],
  selectedKeys: ["mx-4821"],
  selection: { enabled: true, label: "Select vehicles" },
  bulkActions: [{ label: "Assign", variant: "secondary" }],
  page: 1,
  pageCount: 3,
  pagination: { label: "Vehicle pages" },
  "data-product-hook": "virtual-data-table",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(virtualDataTableMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(virtualDataTableMarkup, /data-row-count="2"/);
assert.match(virtualDataTableMarkup, /data-selected-count="1"/);
assert.match(virtualDataTableMarkup, /data-virtualized="true"/);
assert.match(virtualDataTableMarkup, /class="badge/);
assert.match(virtualDataTableMarkup, /class="table/);
assert.match(virtualDataTableMarkup, /class="choice checkbox/);
assert.match(virtualDataTableMarkup, /class="button button--secondary"/);
assert.match(virtualDataTableMarkup, /class="pagination/);
assert.doesNotMatch(virtualDataTableMarkup, /rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const virtualDataTableLoadingMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  loading: true,
  columns: [{ key: "unit", label: "Unit" }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
}));
assert.match(virtualDataTableLoadingMarkup, /data-state="loading"/);
assert.match(virtualDataTableLoadingMarkup, /class="skeleton/);

const virtualDataTableEmptyMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  columns: [{ key: "unit", label: "Unit" }],
  rows: [],
  empty: { title: "No vehicles", description: "Try a broader filter." },
}));
assert.match(virtualDataTableEmptyMarkup, /data-state="empty"/);
assert.match(virtualDataTableEmptyMarkup, /class="empty-state/);

const virtualDataTableErrorMarkup = renderToStaticMarkup(React.createElement(VirtualDataTable, {
  label: "Vehicles",
  columns: [{ key: "unit", label: "Unit" }],
  rows: [{ id: "mx-4821", unit: "MX-4821" }],
  error: { label: "Vehicles unavailable", description: "Retry later." },
}));
assert.match(virtualDataTableErrorMarkup, /data-state="error"/);
assert.match(virtualDataTableErrorMarkup, /class="error-panel/);


console.log("react pattern operational forms render tests passed");
