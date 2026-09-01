import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MultiStepForm } from "../dist/patterns/MultiStepForm.js";
import { TransferList } from "../dist/patterns/TransferList.js";
import { StationDiscovery } from "../dist/patterns/StationDiscovery.js";
import { StatusFeedbackView } from "../dist/patterns/StatusFeedbackView.js";
import { PaymentForm } from "../dist/patterns/PaymentForm.js";
import { DenseOperationalList } from "../dist/patterns/DenseOperationalList.js";
import { AgentConversation } from "../dist/patterns/AgentConversation.js";
import { ConfigurationConsole } from "../dist/templates/ConfigurationConsole.js";

const multiStepFormMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  description: "Complete the reusable step sequence.",
  density: "sm",
  dirty: true,
  steps: [{ id: "profile", label: "Profile" }, { id: "vehicle", label: "Vehicle" }, { id: "review", label: "Review" }],
  currentStep: 1,
  summary: { title: "Onboarding progress" },
  fields: [
    { key: "name", label: "Driver name", value: "Ana" },
    { key: "region", kind: "select", label: "Region", value: "north", options: [{ label: "North", value: "north" }] },
  ],
  formSection: { title: "License details", fields: [{ label: "License number", value: "MX-123" }] },
  validation: { message: "Review license details.", state: "warning" },
  backAction: { label: "Back" },
  saveAction: { label: "Save draft" },
  primaryAction: { label: "Continue" },
  feedback: { label: "Draft saved", tone: "info" },
  "data-product-hook": "multi-step-form",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(multiStepFormMarkup, /data-flow-pattern="multi-step-form"/);
assert.match(multiStepFormMarkup, /data-state="dirty"/);
assert.match(multiStepFormMarkup, /data-density="sm"/);
assert.match(multiStepFormMarkup, /data-step-count="3"/);
assert.match(multiStepFormMarkup, /data-current-step="1"/);
assert.match(multiStepFormMarkup, /data-field-count="2"/);
assert.match(multiStepFormMarkup, /data-form-section-boundary="true"/);
assert.match(multiStepFormMarkup, /data-product-hook="multi-step-form"/);
assert.match(multiStepFormMarkup, /class="stepper/);
assert.match(multiStepFormMarkup, /data-flow-primitive="surface"/);
assert.match(multiStepFormMarkup, /class="card/);
assert.match(multiStepFormMarkup, /class="input"/);
assert.match(multiStepFormMarkup, /class="select-control/);
assert.match(multiStepFormMarkup, /class="inline-validation/);
assert.match(multiStepFormMarkup, /data-flow-pattern="form-section"/);
assert.match(multiStepFormMarkup, /class="button button--primary"/);
assert.match(multiStepFormMarkup, /class="toast/);
assert.doesNotMatch(multiStepFormMarkup, /custom-form|fake-step|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const multiStepNotStartedMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
}));
assert.match(multiStepNotStartedMarkup, /data-state="not-started"/);

const multiStepActiveMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  started: true,
}));
assert.match(multiStepActiveMarkup, /data-state="active"/);

const multiStepValidatingMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  validating: true,
  fields: [{ label: "Driver name", value: "Ana" }],
}));
assert.match(multiStepValidatingMarkup, /data-state="validating"/);
assert.match(multiStepValidatingMarkup, /aria-busy="true"/);

const multiStepInvalidMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  invalid: true,
  validation: { message: "Fix this step.", state: "error" },
}));
assert.match(multiStepInvalidMarkup, /data-state="invalid"/);
assert.match(multiStepInvalidMarkup, /Fix this step/);

const multiStepSavingMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  saving: true,
  primaryAction: { label: "Save" },
}));
assert.match(multiStepSavingMarkup, /data-state="saving"/);
assert.match(multiStepSavingMarkup, /aria-busy="true"/);

const multiStepCompleteMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  complete: true,
  feedback: { label: "Complete", tone: "success" },
}));
assert.match(multiStepCompleteMarkup, /data-state="complete"/);
assert.match(multiStepCompleteMarkup, /Complete/);

const multiStepDisabledMarkup = renderToStaticMarkup(React.createElement(MultiStepForm, {
  label: "Driver onboarding",
  disabled: true,
}));
assert.match(multiStepDisabledMarkup, /data-state="disabled"/);

const transferListMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  density: "sm",
  sourceLabel: "Available drivers",
  targetLabel: "Assigned drivers",
  source: [
    { key: "ana", label: "Ana Torres", description: "North", selected: true },
    { key: "luis", label: "Luis Perez", description: "South" },
  ],
  target: [{ key: "mia", label: "Mia Chen", description: "Assigned", selected: true }],
  selectedSourceKeys: ["ana"],
  selectedTargetKeys: ["mia"],
  search: { label: "Search drivers", query: "Ana", results: [{ key: "ana", label: "Ana Torres" }] },
  filterInput: { label: "Filter local drivers", value: "north" },
  multiSelect: { label: "Selected driver ids", options: [{ label: "Ana Torres", value: "ana" }], value: ["ana"] },
  moveToTargetAction: { label: "Assign selected" },
  moveToSourceAction: { label: "Remove selected" },
  validation: { message: "One driver has limited availability.", state: "warning" },
  feedback: { label: "Transfer ready", tone: "info" },
  "data-product-hook": "transfer-list",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(transferListMarkup, /data-flow-pattern="transfer-list"/);
assert.match(transferListMarkup, /data-state="selecting"/);
assert.match(transferListMarkup, /data-density="sm"/);
assert.match(transferListMarkup, /data-source-count="2"/);
assert.match(transferListMarkup, /data-target-count="1"/);
assert.match(transferListMarkup, /data-selected-count="4"/);
assert.match(transferListMarkup, /data-search-boundary="true"/);
assert.match(transferListMarkup, /data-multi-select-boundary="true"/);
assert.match(transferListMarkup, /data-product-hook="transfer-list"/);
assert.match(transferListMarkup, /data-flow-pattern="search"/);
assert.match(transferListMarkup, /data-flow-pattern="multi-select"/);
assert.match(transferListMarkup, /class="list/);
assert.match(transferListMarkup, /class="choice checkbox/);
assert.match(transferListMarkup, /class="badge/);
assert.match(transferListMarkup, /class="field/);
assert.match(transferListMarkup, /class="button button--primary"/);
assert.match(transferListMarkup, /class="inline-validation/);
assert.match(transferListMarkup, /class="toast/);
assert.doesNotMatch(transferListMarkup, /custom-list|fake-checkbox|template-route|full-page-layout|global-navigation|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs|docs-demo|gold-/i);

const transferListIdleMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  source: [{ label: "Ana Torres" }],
  target: [{ label: "Mia Chen" }],
}));
assert.match(transferListIdleMarkup, /data-state="idle"/);

const transferListTransferringMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  transferring: true,
  source: [{ label: "Ana Torres", selected: true }],
  selectedSourceKeys: ["ana"],
}));
assert.match(transferListTransferringMarkup, /data-state="transferring"/);
assert.match(transferListTransferringMarkup, /aria-busy="true"/);

const transferListPartialMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  partial: true,
  source: [{ label: "Ana Torres" }],
}));
assert.match(transferListPartialMarkup, /data-state="partial"/);

const transferListInvalidMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  invalid: true,
  source: [{ label: "Ana Torres" }],
  validation: { message: "Cannot transfer this record.", state: "error" },
}));
assert.match(transferListInvalidMarkup, /data-state="invalid"/);
assert.match(transferListInvalidMarkup, /Cannot transfer this record/);

const transferListEmptySourceMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  source: [],
  target: [{ label: "Mia Chen" }],
}));
assert.match(transferListEmptySourceMarkup, /data-state="empty-source"/);

const transferListEmptyTargetMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  source: [{ label: "Ana Torres" }],
  target: [],
}));
assert.match(transferListEmptyTargetMarkup, /data-state="empty-target"/);

const transferListDisabledMarkup = renderToStaticMarkup(React.createElement(TransferList, {
  label: "Assign drivers",
  disabled: true,
  source: [{ label: "Ana Torres" }],
}));
assert.match(transferListDisabledMarkup, /data-state="disabled"/);

const stationDiscoveryMarkup = renderToStaticMarkup(React.createElement(StationDiscovery, {
  label: "Nearby stations",
  description: "Choose a station or search manually.",
  permission: "granted",
  density: "sm",
  stations: [
    { id: "centro", label: "Centro Norte", value: "1.2 km", meta: "Open", route: "8 min", selected: true },
    { id: "sur", label: "Sur Express", value: "3.4 km", meta: "Diesel only" },
  ],
  route: {
    label: "Route to Centro Norte",
    eta: "8 min",
    distance: "1.2 km",
    metrics: [{ key: "eta", label: "ETA", value: "8 min" }],
    actions: [{ key: "start", label: "Start route", icon: "navigation" }],
  },
  "data-product-hook": "station-discovery",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(stationDiscoveryMarkup, /data-flow-pattern="station-discovery"/);
assert.match(stationDiscoveryMarkup, /data-flow-primitive="surface"/);
assert.match(stationDiscoveryMarkup, /data-map-primitive="maps"/);
assert.match(stationDiscoveryMarkup, /data-map-layer="true"/);
assert.match(stationDiscoveryMarkup, /data-map-permission="granted"/);
assert.match(stationDiscoveryMarkup, /data-map-runtime="runtimeUnavailable"/);
assert.match(stationDiscoveryMarkup, /data-product-hook="station-discovery"/);
assert.match(stationDiscoveryMarkup, /data-flow-pattern="search"/);
assert.match(stationDiscoveryMarkup, /class="station-pin/);
assert.match(stationDiscoveryMarkup, /class="list/);
assert.match(stationDiscoveryMarkup, /class="route-summary/);
assert.match(stationDiscoveryMarkup, /class="inline-validation/);
assert.doesNotMatch(stationDiscoveryMarkup, /class="card|custom-map|template-route|docs-demo|gold-|rgb\(255,\s*0,\s*0\)|margin-top|Injected markup|contenteditable=|apps\/docs/i);

const stationDiscoveryDeniedMarkup = renderToStaticMarkup(React.createElement(StationDiscovery, {
  label: "Nearby stations",
  permission: "denied",
  stations: [{ id: "manual", label: "Manual station", value: "Search result", meta: "Fallback" }],
}));
assert.match(stationDiscoveryDeniedMarkup, /data-state="denied"/);
assert.match(stationDiscoveryDeniedMarkup, /Location is off/);
assert.match(stationDiscoveryDeniedMarkup, /class="empty-state/);
assert.match(stationDiscoveryDeniedMarkup, /class="list/);

const statusFeedbackMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  label: "Driver status",
  title: "No status yet",
  description: "Create the first driver status.",
  density: "sm",
  action: { key: "create", label: "Create status" },
  "data-product-hook": "status-feedback",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(statusFeedbackMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(statusFeedbackMarkup, /data-feedback-kind="empty"/);
assert.match(statusFeedbackMarkup, /data-density="sm"/);
assert.match(statusFeedbackMarkup, /data-product-hook="status-feedback"/);
assert.match(statusFeedbackMarkup, /class="empty-state/);
assert.match(statusFeedbackMarkup, /Create status/);
assert.doesNotMatch(statusFeedbackMarkup, /status-view|feedback-shell|status-shell|feedback-banner|notice-banner|status-message-wrapper|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const statusFeedbackErrorMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "error",
  label: "Sync failed",
  description: "Retry driver sync.",
  tone: "critical",
  state: "critical",
}));
assert.match(statusFeedbackErrorMarkup, /data-feedback-kind="error"/);
assert.match(statusFeedbackErrorMarkup, /class="error-panel/);
assert.match(statusFeedbackErrorMarkup, /data-state="critical"/);

const statusFeedbackInlineMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "inline",
  label: "Driver name",
  value: "Ana",
  message: "Name is ready.",
  state: "success",
  field: true,
}));
assert.match(statusFeedbackInlineMarkup, /data-feedback-kind="inline"/);
assert.match(statusFeedbackInlineMarkup, /class="inline-validation/);
assert.match(statusFeedbackInlineMarkup, /data-state="success"/);

const statusFeedbackToastMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "toast",
  label: "Saved",
  description: "Driver status saved.",
  state: "success",
}));
assert.match(statusFeedbackToastMarkup, /data-feedback-kind="toast"/);
assert.match(statusFeedbackToastMarkup, /class="toast/);
assert.match(statusFeedbackToastMarkup, /data-tone="success"/);

const statusFeedbackNotificationMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "notifications",
  label: "Driver notifications",
  open: true,
  notifications: [{ key: "risk", label: "Risk review", unread: true }],
}));
assert.match(statusFeedbackNotificationMarkup, /data-feedback-kind="notifications"/);
assert.match(statusFeedbackNotificationMarkup, /data-flow-pattern="notification-panel"/);
assert.match(statusFeedbackNotificationMarkup, /Risk review/);

const statusFeedbackSnackbarMarkup = renderToStaticMarkup(React.createElement(StatusFeedbackView, {
  kind: "snackbar",
  label: "Queue",
  messages: [{ key: "saved", label: "Saved to queue", tone: "success" }],
}));
assert.match(statusFeedbackSnackbarMarkup, /data-feedback-kind="snackbar"/);
assert.match(statusFeedbackSnackbarMarkup, /data-flow-pattern="snackbar-provider"/);
assert.match(statusFeedbackSnackbarMarkup, /Saved to queue/);

const paymentFormMarkup = renderToStaticMarkup(React.createElement(PaymentForm, {
  label: "Card payment",
  description: "Capture card details and amount.",
  density: "sm",
  state: "review",
  cardNumber: { value: "4242424242424242", helper: "Use the driver card." },
  expiry: { value: "1228" },
  securityCode: { value: "123", revealable: true },
  amount: { value: "820", currency: "MXN", helper: "Fuel authorization amount." },
  validation: { message: "Review card details before continuing.", state: "info" },
  feedback: { kind: "toast", title: "Ready for review", description: "Card details are complete.", state: "success" },
  submitAction: { key: "continue", label: "Continue" },
  secondaryAction: { key: "cancel", label: "Cancel" },
  "data-product-hook": "payment-form",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(paymentFormMarkup, /data-flow-pattern="payment-form"/);
assert.match(paymentFormMarkup, /data-flow-slot="paymentSurface"/);
assert.match(paymentFormMarkup, /data-flow-slot="card-fields"/);
assert.match(paymentFormMarkup, /data-flow-slot="amount-fields"/);
assert.match(paymentFormMarkup, /class="field card-number-input"/);
assert.match(paymentFormMarkup, /class="field card-expiry-input"/);
assert.match(paymentFormMarkup, /class="field card-security-code-input"/);
assert.match(paymentFormMarkup, /class="field input-amount"/);
assert.match(paymentFormMarkup, /class="inline-validation/);
assert.match(paymentFormMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(paymentFormMarkup, /class="button/);
assert.doesNotMatch(paymentFormMarkup, /class="card(?:\\s|")|payment-field|card-input-group|payment-shell|raw-payment-input|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const denseOperationalListMarkup = renderToStaticMarkup(React.createElement(DenseOperationalList, {
  label: "Accounts operations",
  description: "Open operational records",
  density: "sm",
  selectedKeys: ["acct-1"],
  filters: [{ key: "risk", label: "Risk review" }],
  resultCount: 1,
  search: { query: "ana", placeholder: "Search accounts" },
  toolbar: {
    actions: [{ key: "export", label: "Export" }],
    overflow: { triggerLabel: "More list actions", items: [{ key: "columns", label: "Columns" }], open: true },
  },
  bulkActions: {
    actions: [{ key: "assign", label: "Assign reviewer" }],
  },
  table: {
    columns: [
      { key: "label", label: "Account", sortable: true },
      { key: "status", label: "Status" },
    ],
    rows: [{ id: "acct-1", label: "Ana Torres", status: { label: "Review", tone: "warning" } }],
    page: 1,
    pageCount: 2,
  },
  feedback: { kind: "inline", message: "1 record needs review.", state: "warning" },
  "data-product-hook": "dense-operational-list",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(denseOperationalListMarkup, /data-flow-pattern="dense-operational-list"/);
assert.match(denseOperationalListMarkup, /data-flow-primitive="surface"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="listSurface"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="searchBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="summary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="filterSummary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="toolbarBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="bulkActionsBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-slot="tableBoundary"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="search"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="filter-chip-group"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="toolbar"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="bulk-actions"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="virtual-data-table"/);
assert.match(denseOperationalListMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(denseOperationalListMarkup, /class="table/);
assert.match(denseOperationalListMarkup, /data-density="sm"/);
assert.doesNotMatch(denseOperationalListMarkup, /class="card(?:\\s|")|operational-card-row|dense-list-row|fake-toolbar|fake-filter-chip|local-status-shell|raw-table-shell|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const agentConversationMarkup = renderToStaticMarkup(React.createElement(AgentConversation, {
  label: "Agent support",
  description: "Support conversation",
  density: "sm",
  handoff: {
    active: true,
    title: "Specialist joining",
    description: "A teammate can review the conversation.",
    action: { key: "handoff", label: "Open handoff" },
  },
  thread: {
    messages: [
      { key: "m1", author: "user", body: "I need help with billing.", timestamp: "09:00" },
      { key: "m2", author: "agent", authorLabel: "Flow Assist", body: "I can help review that.", action: { label: "Retry answer" } },
    ],
  },
  composer: {
    defaultValue: "Thanks",
    attachLabel: "Attach file",
    sendLabel: "Send message",
  },
  "data-product-hook": "agent-conversation",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));
assert.match(agentConversationMarkup, /data-flow-pattern="agent-conversation"/);
assert.match(agentConversationMarkup, /data-flow-primitive="surface"/);
assert.match(agentConversationMarkup, /data-flow-slot="conversationSurface"/);
assert.match(agentConversationMarkup, /data-flow-slot="thread"/);
assert.match(agentConversationMarkup, /data-flow-slot="handoffFeedback"/);
assert.match(agentConversationMarkup, /data-flow-slot="composer"/);
assert.match(agentConversationMarkup, /data-flow-component="chat-thread"/);
assert.match(agentConversationMarkup, /data-flow-component="chat-message"/);
assert.match(agentConversationMarkup, /data-flow-component="chat-composer"/);
assert.match(agentConversationMarkup, /data-flow-pattern="status-feedback-view"/);
assert.match(agentConversationMarkup, /data-conversation-state="handoff"/);
assert.match(agentConversationMarkup, /data-density="sm"/);
assert.doesNotMatch(agentConversationMarkup, /class="card(?:\\s|")|fake-chat-bubble|agent-chat-shell|raw-message-shell|raw-composer|local-handoff|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const configurationConsoleMarkup = renderToStaticMarkup(React.createElement(ConfigurationConsole, {
  label: "Configuration console",
  density: "sm",
  selectedModule: "drivers",
  state: "loaded",
  "data-product-hook": "configuration-console",
  style: { color: "red" },
  dangerouslySetInnerHTML: { __html: "<strong>Bad</strong>" },
}));

assert.match(configurationConsoleMarkup, /data-flow-template="configuration-console"/);
assert.match(configurationConsoleMarkup, /data-flow-primitive="surface"/);
assert.match(configurationConsoleMarkup, /data-selected-module="drivers"/);
assert.match(configurationConsoleMarkup, /data-product-hook="configuration-console"/);
assert.match(configurationConsoleMarkup, /data-template-slot="global-shell"/);
assert.match(configurationConsoleMarkup, /data-template-slot="navigation-region"/);
assert.match(configurationConsoleMarkup, /data-template-slot="workspace"/);
assert.match(configurationConsoleMarkup, /data-template-module="permission-matrix"/);
assert.match(configurationConsoleMarkup, /data-template-module="driver-lifecycle-table"/);
assert.match(configurationConsoleMarkup, /data-template-module="vehicle-lifecycle-table"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="topbar"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="sidebar"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="roles-and-permissions"/);
assert.match(configurationConsoleMarkup, /data-flow-pattern="driver-and-vehicle-administration"/);
assert.match(configurationConsoleMarkup, /data-density="sm"/);
assert.doesNotMatch(configurationConsoleMarkup, /docs-demo|gold-|apps\/docs|document\.createElement|custom-template|rgb\(255,\s*0,\s*0\)|Injected markup|contenteditable=/i);

const configurationConsolePermissionMarkup = renderToStaticMarkup(React.createElement(ConfigurationConsole, {
  density: "md",
  state: "permission",
  authentication: {
    label: "Admin authentication",
    primaryAction: { label: "Continue" },
  },
}));

assert.match(configurationConsolePermissionMarkup, /data-state="permission"/);
assert.match(configurationConsolePermissionMarkup, /data-flow-pattern="authentication-login-biometrics-and-otp"/);
assert.match(configurationConsolePermissionMarkup, /data-template-module="authentication-gate"/);
assert.match(configurationConsolePermissionMarkup, /data-state="permission-blocked"/);

console.log("react pattern final flows render tests passed");
