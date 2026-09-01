import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TicketQueue } from "../dist/patterns/TicketQueue.js";
import { CaseManagement } from "../dist/patterns/CaseManagement.js";
import { FilterableEditableTable } from "../dist/patterns/FilterableEditableTable.js";
import { PricingOperations } from "../dist/patterns/PricingOperations.js";
import { BackofficeApproval } from "../dist/patterns/BackofficeApproval.js";
import { EmailTemplateLayout } from "../dist/patterns/EmailTemplateLayout.js";
import { ExpandableDetailTable } from "../dist/patterns/ExpandableDetailTable.js";
import { GanttChart } from "../dist/patterns/GanttChart.js";
import { WaterfallChart } from "../dist/patterns/WaterfallChart.js";
import { PolarChart } from "../dist/patterns/PolarChart.js";

const ticketQueueMarkup = renderToStaticMarkup(React.createElement(TicketQueue, {
  label: "Ticket queue",
  description: "Triage support tickets.",
  density: "sm",
  selectedTicketKey: "ticket-1",
  detailOpen: true,
  summaries: [{ key: "sla", label: "2 SLA risks", tone: "warning" }],
  alerts: {
    label: "Ticket alerts",
    open: true,
    notifications: [{ key: "alert-1", label: "New urgent ticket", unread: true }],
    markAllAction: { label: "Mark alerts read" },
  },
  tickets: {
    label: "Tickets",
    search: { label: "Ticket search", query: "refund" },
    filters: [{ key: "priority", label: "Priority: high" }],
    toolbar: { actions: [{ key: "assign", label: "Assign" }] },
    bulkActions: { actions: [{ key: "close", label: "Close tickets" }] },
    table: {
      columns: [{ key: "subject", label: "Subject" }, { key: "priority", label: "Priority" }],
      rows: [{ id: "ticket-1", subject: "Refund issue", priority: "High" }],
      rowKey: "id",
    },
  },
  detail: {
    label: "Ticket detail",
    open: true,
    drawer: { triggerLabel: "Open ticket detail", closeLabel: "Close ticket detail" },
    actions: [{ key: "assign", label: "Assign ticket" }],
  },
  feedback: {
    kind: "toast",
    label: "Queue updated",
    description: "Ticket assignment is synced.",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "ticket-queue",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(ticketQueueMarkup, /data-flow-pattern="ticket-queue"/);
assert.match(ticketQueueMarkup, /data-flow-slot="ticketQueueSurface"/);
assert.match(ticketQueueMarkup, /data-ticket-queue-state="detail-open"/);
assert.match(ticketQueueMarkup, /data-summary-count="1"/);
assert.match(ticketQueueMarkup, /data-ticket-row-count="1"/);
assert.match(ticketQueueMarkup, /data-alert-count="1"/);
assert.match(ticketQueueMarkup, /data-flow-slot="queueSummary"/);
assert.match(ticketQueueMarkup, /data-flow-slot="queueMetric"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="notification-panel"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(ticketQueueMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="notification-panel"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(ticketQueueMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(ticketQueueMarkup, /data-flow-primitive="surface"/);
assert.match(ticketQueueMarkup, /class="badge/);
assert.doesNotMatch(ticketQueueMarkup, /ticket-card|ticket-row-card|custom-ticket-list|custom-notification-list|custom-drawer|local-feedback|ticket-table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const caseManagementMarkup = renderToStaticMarkup(React.createElement(CaseManagement, {
  label: "Case management",
  description: "Review escalated cases.",
  density: "sm",
  selectedCaseKey: "case-1",
  detailOpen: true,
  summaries: [{ key: "sla", label: "4 escalations", tone: "warning" }],
  filters: {
    label: "Case filters",
    open: true,
    fields: [{ key: "owner", label: "Owner", value: "Ana" }],
    appliedFilters: [{ key: "priority", label: "Priority: high" }],
    drawer: { triggerLabel: "Open case filters", closeLabel: "Close case filters" },
    applyAction: { label: "Apply case filters" },
    resetAction: { label: "Reset case filters" },
  },
  cases: {
    label: "Cases",
    search: { label: "Case search", query: "refund" },
    filters: [{ key: "status", label: "Status: open" }],
    toolbar: { actions: [{ key: "assign", label: "Assign" }] },
    bulkActions: { actions: [{ key: "escalate", label: "Escalate" }] },
    table: {
      columns: [{ key: "subject", label: "Subject" }, { key: "priority", label: "Priority" }],
      rows: [{ id: "case-1", subject: "Refund escalation", priority: "High" }],
      rowKey: "id",
    },
  },
  detail: {
    label: "Case detail",
    open: true,
    drawer: { triggerLabel: "Open case detail", closeLabel: "Close case detail" },
    actions: [{ key: "resolve", label: "Resolve case" }],
  },
  timeline: {
    label: "Case activity",
    filtered: true,
    filters: [{ key: "owner", label: "Owner: Ana" }],
    events: [{ key: "evt-1", label: "Case escalated", status: "warning", timestamp: "2026-08-10" }],
  },
  feedback: {
    kind: "toast",
    label: "Case updated",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "case-management",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(caseManagementMarkup, /data-flow-pattern="case-management"/);
assert.match(caseManagementMarkup, /data-flow-slot="caseManagementSurface"/);
assert.match(caseManagementMarkup, /data-case-management-state="detail-open"/);
assert.match(caseManagementMarkup, /data-summary-count="1"/);
assert.match(caseManagementMarkup, /data-case-row-count="1"/);
assert.match(caseManagementMarkup, /data-activity-event-count="1"/);
assert.match(caseManagementMarkup, /data-flow-slot="caseSummary"/);
assert.match(caseManagementMarkup, /data-flow-slot="caseMetric"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="advanced-filters"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="timeline"/);
assert.match(caseManagementMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(caseManagementMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(caseManagementMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(caseManagementMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(caseManagementMarkup, /data-flow-pattern="timeline"/);
assert.match(caseManagementMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(caseManagementMarkup, /data-flow-primitive="surface"/);
assert.match(caseManagementMarkup, /class="badge/);
assert.doesNotMatch(caseManagementMarkup, /case-card|case-row-card|custom-case-filter|custom-activity-feed|custom-drawer|local-feedback|case-table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const filterableEditableTableMarkup = renderToStaticMarkup(React.createElement(FilterableEditableTable, {
  label: "Editable pricing table",
  description: "Review editable rows.",
  density: "sm",
  selectedRowKey: "price-1",
  editing: true,
  metrics: [{ key: "pending", label: "3 pending edits", tone: "warning" }],
  filters: {
    label: "Pricing filters",
    open: true,
    fields: [{ key: "region", label: "Region", value: "North" }],
    appliedFilters: [{ key: "status", label: "Status: draft" }],
    drawer: { triggerLabel: "Open pricing filters", closeLabel: "Close pricing filters" },
    applyAction: { label: "Apply pricing filters" },
    resetAction: { label: "Reset pricing filters" },
  },
  table: {
    label: "Pricing rows",
    columns: [{ key: "sku", label: "SKU" }, { key: "price", label: "Price" }],
    rows: [{ id: "price-1", sku: "FUEL-001", price: "$10.00" }],
    rowKey: "id",
    page: 1,
    pageCount: 2,
    bulkActions: [{ key: "approve", label: "Approve edits" }],
  },
  editor: {
    label: "Pricing editor",
    open: true,
    drawer: { triggerLabel: "Open pricing editor", closeLabel: "Close pricing editor" },
    actions: [{ key: "save", label: "Save edits" }],
  },
  feedback: {
    kind: "toast",
    label: "Edits saved",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "filterable-editable-table",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(filterableEditableTableMarkup, /data-flow-pattern="filterable-editable-table"/);
assert.match(filterableEditableTableMarkup, /data-flow-slot="filterableEditableTableSurface"/);
assert.match(filterableEditableTableMarkup, /data-filterable-editable-table-state="editing"/);
assert.match(filterableEditableTableMarkup, /data-row-count="1"/);
assert.match(filterableEditableTableMarkup, /data-filter-count="1"/);
assert.match(filterableEditableTableMarkup, /data-metric-count="1"/);
assert.match(filterableEditableTableMarkup, /data-flow-slot="tableSummary"/);
assert.match(filterableEditableTableMarkup, /data-flow-slot="tableMetric"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="advanced-filters"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="virtual-data-table"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(filterableEditableTableMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(filterableEditableTableMarkup, /data-flow-primitive="surface"/);
assert.match(filterableEditableTableMarkup, /class="badge/);
assert.doesNotMatch(filterableEditableTableMarkup, /editable-card|editable-row-card|custom-edit-table|custom-filter-shell|custom-editor|local-feedback|table-local|inline-edit-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const pricingOperationsMarkup = renderToStaticMarkup(React.createElement(PricingOperations, {
  label: "Pricing operations",
  description: "Rate rules and approvals.",
  density: "sm",
  selectedRuleKey: "P-101",
  editorOpen: true,
  summaries: [{ key: "pending", label: "2 pending approvals", tone: "warning" }],
  rules: [
    { id: "P-101", name: "Base fare CDMX", scope: "City", type: "Base", value: "$10.50/km", status: "pending approval", by: "Pricing" },
    { id: "P-102", name: "Peak surcharge", scope: "Zone", type: "Surge", value: "x1.8", status: "active", by: "Ops" },
  ],
  rolePolicy: {
    mode: "checkbox",
    roles: [{ key: "pricing", label: "Pricing" }],
    permissions: [{ key: "approve", label: "Approve pricing", badge: "Approval" }],
    values: { pricing: { approve: true } },
  },
  queue: {
    filters: {
      label: "Pricing filters",
      appliedFilters: [{ key: "status", label: "Status: pending" }],
      resetAction: { label: "Reset pricing filters" },
    },
    table: {
      page: 1,
      pageCount: 2,
      pagination: { label: "Pricing pagination" },
    },
    editor: {
      label: "Pricing rule editor",
      open: true,
      drawer: { triggerLabel: "Open pricing editor", closeLabel: "Close pricing editor" },
      actions: [{ key: "submit-approval", label: "Submit for approval" }],
    },
  },
  feedback: {
    kind: "toast",
    label: "Pricing submitted",
    action: { key: "review", label: "Review queue" },
  },
  "data-product-hook": "pricing-operations",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(pricingOperationsMarkup, /data-flow-pattern="pricing-operations"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingOperationsSurface"/);
assert.match(pricingOperationsMarkup, /data-pricing-operations-state="editing"/);
assert.match(pricingOperationsMarkup, /data-rule-count="2"/);
assert.match(pricingOperationsMarkup, /data-pending-rule-count="1"/);
assert.match(pricingOperationsMarkup, /data-editor-open="true"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingSummary"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingMetric"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingPermissionBoundary"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingRulesBoundary"/);
assert.match(pricingOperationsMarkup, /data-flow-slot="pricingFeedbackBoundary"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="roles-and-permissions"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="advanced-filters"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="virtual-data-table"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="roles-and-permissions"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="advanced-filters"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(pricingOperationsMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(pricingOperationsMarkup, /data-flow-primitive="surface"/);
assert.match(pricingOperationsMarkup, /class="badge/);
assert.doesNotMatch(pricingOperationsMarkup, /pricing-card|pricing-row-card|custom-pricing-table|custom-pricing-drawer|custom-role-guard|fake-approval|local-toast|table-local|class="card(?:\s|")|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const backofficeApprovalMarkup = renderToStaticMarkup(React.createElement(BackofficeApproval, {
  label: "Backoffice approval",
  description: "Document review queue.",
  density: "sm",
  selectedDocumentKey: "D-220",
  detailOpen: true,
  summaries: [{ key: "pending", label: "3 pending reviews", tone: "warning" }],
  documents: [
    { id: "D-220", who: "Diego Vera", doc: "Driver license", submitted: "1 day ago", status: "pending", file: "license.pdf" },
    { id: "D-221", who: "Ana Sosa", doc: "Insurance policy", submitted: "2 days ago", status: "approved", file: "policy.pdf" },
  ],
  queue: {
    search: { label: "Search documents", query: "license" },
    filters: [{ key: "status", label: "Status: pending" }],
    table: {
      page: 1,
      pageCount: 2,
      pagination: { label: "Document pagination" },
      bulkActions: [{ key: "approve", label: "Approve selected" }, { key: "reject", label: "Reject selected" }],
    },
  },
  detail: {
    label: "Document detail",
    open: true,
    drawer: { triggerLabel: "Open document detail", closeLabel: "Close document detail" },
    actions: [{ key: "reject", label: "Reject" }, { key: "approve", label: "Approve" }],
  },
  feedback: {
    kind: "toast",
    label: "Document approved",
    action: { key: "review", label: "Review next" },
  },
  "data-product-hook": "backoffice-approval",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(backofficeApprovalMarkup, /data-flow-pattern="backoffice-approval"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="backofficeApprovalSurface"/);
assert.match(backofficeApprovalMarkup, /data-backoffice-approval-state="detail-open"/);
assert.match(backofficeApprovalMarkup, /data-document-count="2"/);
assert.match(backofficeApprovalMarkup, /data-pending-document-count="1"/);
assert.match(backofficeApprovalMarkup, /data-detail-open="true"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalSummary"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalMetric"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalQueueBoundary"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalDetailBoundary"/);
assert.match(backofficeApprovalMarkup, /data-flow-slot="approvalFeedbackBoundary"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern-boundary="dense-operational-list"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(backofficeApprovalMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(backofficeApprovalMarkup, /data-flow-primitive="surface"/);
assert.match(backofficeApprovalMarkup, /class="badge/);
assert.doesNotMatch(backofficeApprovalMarkup, /document-card|approval-card|custom-document-table|custom-approval-drawer|custom-role-guard|fake-approval|local-toast|table-local|class="card(?:\s|")|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const emailVariants = ["base", "transactional", "operational-summary", "security-alert", "team-invite", "welcome"];
const emailTemplateMarkup = emailVariants.map((variant) => renderToStaticMarkup(React.createElement(EmailTemplateLayout, {
  variant,
  title: variant === "base" ? "Flow base mailing" : undefined,
  preheader: variant === "base" ? "Base preheader" : undefined,
  action: variant === "base" ? { label: "Open Flow", href: "https://flow.example" } : undefined,
  "data-product-hook": "email-template-layout",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}))).join("\n");

assert.match(emailTemplateMarkup, /data-flow-pattern="email-template-layout"/);
assert.match(emailTemplateMarkup, /data-flow-channel="email"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="base"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="transactional"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="operational-summary"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="security-alert"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="team-invite"/);
assert.match(emailTemplateMarkup, /data-email-template-variant="welcome"/);
assert.match(emailTemplateMarkup, /role="presentation"/);
assert.match(emailTemplateMarkup, /class="flow-container"/);
assert.match(emailTemplateMarkup, /class="flow-px"/);
assert.match(emailTemplateMarkup, /display:inline-block/);
assert.match(emailTemplateMarkup, /href="https:\/\/flow\.example"/);
assert.match(emailTemplateMarkup, /482 917/);
assert.match(emailTemplateMarkup, /Ver dashboard completo/);
assert.match(emailTemplateMarkup, /Aceptar invitación/);
assert.match(emailTemplateMarkup, /Abrir Flow/);
assert.doesNotMatch(emailTemplateMarkup, /class="(?:button|card|table|toast|dialog|drawer|surface)(?:\s|")|data-flow-primitive="surface"|data-flow-pattern="status-feedback-view"|<script|display:flex|display:grid|var\(--|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const expandableDetailTableMarkup = renderToStaticMarkup(React.createElement(ExpandableDetailTable, {
  label: "Expandable detail table",
  description: "Review selected row detail.",
  density: "sm",
  expandedRowKey: "row-1",
  detailOpen: true,
  summaries: [{ key: "selected", label: "1 row selected", tone: "info" }],
  table: {
    label: "Operational rows",
    columns: [{ key: "name", label: "Name" }, { key: "status", label: "Status" }],
    rows: [{ id: "row-1", name: "Acme", status: "Active" }],
    rowKey: "id",
    page: 1,
    pageCount: 2,
    bulkActions: [{ key: "review", label: "Review row" }],
  },
  detail: {
    label: "Row detail",
    open: true,
    drawer: { triggerLabel: "Open row detail", closeLabel: "Close row detail" },
    actions: [{ key: "approve", label: "Approve row" }],
  },
  feedback: {
    kind: "toast",
    label: "Detail updated",
    action: { key: "undo", label: "Undo" },
  },
  "data-product-hook": "expandable-detail-table",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(expandableDetailTableMarkup, /data-flow-pattern="expandable-detail-table"/);
assert.match(expandableDetailTableMarkup, /data-flow-slot="expandableDetailTableSurface"/);
assert.match(expandableDetailTableMarkup, /data-expandable-detail-table-state="detail-open"/);
assert.match(expandableDetailTableMarkup, /data-row-count="1"/);
assert.match(expandableDetailTableMarkup, /data-summary-count="1"/);
assert.match(expandableDetailTableMarkup, /data-flow-slot="detailTableSummary"/);
assert.match(expandableDetailTableMarkup, /data-flow-slot="detailTableMetric"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern-boundary="virtual-data-table"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern-boundary="drawer-adapter"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern-boundary="status-feedback-view"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern="drawer-adapter"/);
assert.match(expandableDetailTableMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(expandableDetailTableMarkup, /data-flow-primitive="surface"/);
assert.match(expandableDetailTableMarkup, /class="badge/);
assert.doesNotMatch(expandableDetailTableMarkup, /expandable-card|expanded-row-card|custom-expand-table|custom-detail-drawer|local-feedback|table-local|row-detail-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const ganttChartMarkup = renderToStaticMarkup(React.createElement(GanttChart, {
  label: "Launch schedule",
  description: "Milestone plan",
  density: "sm",
  selectedTaskKey: "task-1",
  tasks: [
    { key: "task-1", label: "Design review", owner: "Ops", start: "2026-08-01", end: "2026-08-04", progress: 75, status: "on-track" },
    { key: "task-2", label: "Pilot rollout", owner: "Fleet", start: "2026-08-05", end: "2026-08-12", progress: 20, status: "risk" },
  ],
  milestones: [{ key: "m1", label: "Pilot ready", date: "2026-08-12" }],
  dependencies: [{ from: "task-1", to: "task-2", type: "finish-start" }],
  metrics: [{ key: "risk", label: "1 risk", tone: "warning" }],
  primaryAction: { key: "inspect", label: "Inspect schedule" },
  feedback: { status: { key: "sync", label: "Synced", tone: "info" } },
  "data-product-hook": "gantt-chart",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(ganttChartMarkup, /data-flow-pattern="gantt-chart"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttChartSurface"/);
assert.match(ganttChartMarkup, /data-gantt-chart-state="selected"/);
assert.match(ganttChartMarkup, /data-task-count="2"/);
assert.match(ganttChartMarkup, /data-milestone-count="1"/);
assert.match(ganttChartMarkup, /data-dependency-count="1"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttSummary"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttMetric"/);
assert.match(ganttChartMarkup, /data-flow-slot="chartWrapperBoundary"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttDataSummary"/);
assert.match(ganttChartMarkup, /data-flow-slot="ganttFeedback"/);
assert.match(ganttChartMarkup, /data-flow-pattern-boundary="chart-wrapper"/);
assert.match(ganttChartMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(ganttChartMarkup, /data-chart-kind="gantt"/);
assert.match(ganttChartMarkup, /data-flow-primitive="surface"/);
assert.match(ganttChartMarkup, /class="badge/);
assert.match(ganttChartMarkup, /class="chart-panel/);
assert.match(ganttChartMarkup, /class="table/);
assert.doesNotMatch(ganttChartMarkup, /gantt-card|local-gantt|custom-gantt|gantt-bar|gantt-svg|canvas|custom-chart|raw-task-table|table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const waterfallChartMarkup = renderToStaticMarkup(React.createElement(WaterfallChart, {
  label: "Margin bridge",
  description: "Contribution analysis",
  density: "sm",
  selectedStepKey: "fuel",
  steps: [
    { key: "start", label: "Starting margin", value: 100, kind: "total", formattedValue: "$100k", formattedCumulative: "$100k" },
    { key: "fuel", label: "Fuel variance", value: -12, formattedValue: "-$12k", formattedCumulative: "$88k", note: "Supplier cost" },
    { key: "discount", label: "Discount recovery", value: 8, formattedValue: "$8k", formattedCumulative: "$96k" },
  ],
  metrics: [{ key: "variance", label: "1 negative step", tone: "warning" }],
  primaryAction: { key: "inspect", label: "Inspect bridge" },
  feedback: { status: { key: "review", label: "Needs review", tone: "warning" } },
  "data-product-hook": "waterfall-chart",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(waterfallChartMarkup, /data-flow-pattern="waterfall-chart"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallChartSurface"/);
assert.match(waterfallChartMarkup, /data-waterfall-chart-state="selected"/);
assert.match(waterfallChartMarkup, /data-step-count="3"/);
assert.match(waterfallChartMarkup, /data-increase-count="1"/);
assert.match(waterfallChartMarkup, /data-decrease-count="1"/);
assert.match(waterfallChartMarkup, /data-total-count="1"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallSummary"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallMetric"/);
assert.match(waterfallChartMarkup, /data-flow-slot="chartWrapperBoundary"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallDataSummary"/);
assert.match(waterfallChartMarkup, /data-flow-slot="waterfallFeedback"/);
assert.match(waterfallChartMarkup, /data-flow-pattern-boundary="chart-wrapper"/);
assert.match(waterfallChartMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(waterfallChartMarkup, /data-chart-kind="waterfall"/);
assert.match(waterfallChartMarkup, /data-flow-primitive="surface"/);
assert.match(waterfallChartMarkup, /class="badge/);
assert.match(waterfallChartMarkup, /class="chart-panel/);
assert.match(waterfallChartMarkup, /class="table/);
assert.doesNotMatch(waterfallChartMarkup, /waterfall-card|local-waterfall|custom-waterfall|waterfall-bar|waterfall-svg|canvas|custom-chart|raw-step-table|table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const polarChartMarkup = renderToStaticMarkup(React.createElement(PolarChart, {
  label: "Risk distribution",
  description: "Segment comparison",
  density: "sm",
  selectedSegmentKey: "fuel",
  segments: [
    { key: "fuel", label: "Fuel risk", value: 42, formattedValue: "42", share: "42%", status: "warning" },
    { key: "maintenance", label: "Maintenance", value: 28, formattedValue: "28", share: "28%", status: "info" },
  ],
  metrics: [{ key: "segments", label: "2 segments", tone: "info" }],
  primaryAction: { key: "inspect", label: "Inspect distribution" },
  feedback: { status: { key: "review", label: "Reviewed", tone: "info" } },
  "data-product-hook": "polar-chart",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(polarChartMarkup, /data-flow-pattern="polar-chart"/);
assert.match(polarChartMarkup, /data-flow-slot="polarChartSurface"/);
assert.match(polarChartMarkup, /data-polar-chart-state="selected"/);
assert.match(polarChartMarkup, /data-segment-count="2"/);
assert.match(polarChartMarkup, /data-flow-slot="polarSummary"/);
assert.match(polarChartMarkup, /data-flow-slot="polarMetric"/);
assert.match(polarChartMarkup, /data-flow-slot="chartWrapperBoundary"/);
assert.match(polarChartMarkup, /data-flow-slot="polarDataSummary"/);
assert.match(polarChartMarkup, /data-flow-slot="polarFeedback"/);
assert.match(polarChartMarkup, /data-flow-pattern-boundary="chart-wrapper"/);
assert.match(polarChartMarkup, /data-flow-pattern="chart-wrapper"/);
assert.match(polarChartMarkup, /data-chart-kind="polar"/);
assert.match(polarChartMarkup, /data-flow-primitive="surface"/);
assert.match(polarChartMarkup, /class="badge/);
assert.match(polarChartMarkup, /class="chart-panel/);
assert.match(polarChartMarkup, /class="table/);
assert.doesNotMatch(polarChartMarkup, /polar-card|local-polar|custom-polar|polar-arc|polar-svg|radar-svg|canvas|custom-chart|raw-segment-table|table-local|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);


console.log("react pattern operations charts render tests passed");
