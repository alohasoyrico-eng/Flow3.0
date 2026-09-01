import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLInputElement = dom.window.HTMLInputElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const { cleanup, fireEvent, render, within } = await import("@testing-library/react");
const {
  ActionSheet,
  AccountOperations,
  AgentConversation,
  AuthenticationLoginBiometricsAndOtp,
  Autocomplete,
  AvatarGroup,
  AvatarMenu,
  BackofficeApproval,
  BottomSheet,
  CalendarView,
  CaseManagement,
  CheckboxGroup,
  ChartLegendItem,
  ChartWrapper,
  ColumnConfigurator,
  CommandPalette,
  ConfirmationDialog,
  DenseOperationalList,
  DragSortableList,
  DriverAndVehicleAdministration,
  DriverOnboardingMobile,
  DrawerAdapter,
  ExpandableDetailTable,
  FilterChipGroup,
  FilterableEditableTable,
  FileUpload,
  FleetManagerOnboardingDesktop,
  FormSection,
  FullscreenSheet,
  GanttChart,
  HelpCenter,
  KanbanBoard,
  KpiCard,
  MultiSelect,
  NotificationPanel,
  OnThisPageNav,
  PaymentForm,
  PolarChart,
  PricingOperations,
  PreferenceManagement,
  PullToRefresh,
  QuickActionsGrid,
  RadioGroup,
  RolesAndPermissions,
  Search,
  SelectOptionLayer,
  Settings,
  Sidebar,
  SnackbarProvider,
  StationDiscovery,
  StatusFeedbackView,
  SwipeActions,
  TicketQueue,
  Timeline,
  Topbar,
  TransferList,
  VirtualDataTable,
  WaterfallChart,
} = await import("../dist/patterns/index.js");


try {
  const accountEvents = [];
  const accountView = render(React.createElement(AccountOperations, {
    label: "Account operations",
    selectedAccountKey: "acct-1",
    detailOpen: true,
    accounts: {
      label: "Accounts",
      search: { label: "Account search", query: "" },
      filters: [{ key: "status", label: "Status: active" }],
      toolbar: { overflow: { triggerLabel: "More account actions", items: [{ key: "export", label: "Export" }] } },
      bulkActions: { actions: [{ key: "suspend", label: "Suspend" }] },
      table: {
        columns: [{ key: "name", label: "Name", sortable: true }],
        rows: [{ id: "acct-1", name: "Acme" }],
        rowKey: "id",
        page: 1,
        pageCount: 2,
        pagination: { label: "Accounts pagination" },
      },
    },
    detail: {
      label: "Account detail",
      open: true,
      drawer: { triggerLabel: "Open account detail", closeLabel: "Close account detail" },
      actions: [{ key: "review", label: "Review account" }],
    },
    timeline: {
      label: "Account audit",
      filtered: true,
      filters: [{ key: "risk", label: "Risk: high" }],
      clearAction: { label: "Clear audit filters" },
      events: [{ key: "evt-1", label: "Risk reviewed", status: "warning" }],
    },
    onAccountSearchChange: (value, event) => accountEvents.push(["search", value, event.type]),
    onAccountFilterRemove: (key, event) => accountEvents.push(["filter-remove", key, event.type]),
    onAccountFiltersReset: (event) => accountEvents.push(["filters-reset", event.type]),
    onAccountSelect: (key, event) => accountEvents.push(["account-select", key, event.type]),
    onAccountSortChange: (sort, event) => accountEvents.push(["sort", sort.key, sort.direction, event.type]),
    onAccountPageChange: (page, event) => accountEvents.push(["page", page, event.type]),
    onAccountBulkAction: (key, event) => accountEvents.push(["bulk", key, event.type]),
    onAccountToolbarOverflowSelect: (item, event) => accountEvents.push(["toolbar-overflow", item.key, event.type]),
    onDetailOpenChange: (open, event) => accountEvents.push(["detail-open", open, event.type]),
    onDetailAction: (key, event) => accountEvents.push(["detail-action", key, event.type]),
    onAuditEventSelect: (key, event) => accountEvents.push(["audit-select", key, event.type]),
    onAuditFilterRemove: (key, event) => accountEvents.push(["audit-filter-remove", key, event.type]),
    onAuditClear: (event) => accountEvents.push(["audit-clear", event.type]),
  }));
  fireEvent.input(accountView.getByRole("searchbox", { name: /account search/i }), { target: { value: "acme" } });
  fireEvent.click(accountView.getByRole("button", { name: /remove status: active/i }));
  fireEvent.click(accountView.getByRole("button", { name: /reset filters/i }));
  fireEvent.click(accountView.getByRole("checkbox", { name: /select row acct-1/i }));
  fireEvent.click(accountView.getByRole("button", { name: /^name$/i }));
  fireEvent.click(accountView.getByRole("button", { name: /next page/i }));
  fireEvent.click(accountView.getByRole("button", { name: /suspend/i }));
  fireEvent.click(accountView.getByRole("button", { name: /more account actions/i }));
  fireEvent.click(accountView.getByRole("menuitem", { name: /export/i }));
  fireEvent.click(accountView.getByRole("button", { name: /close account detail/i }));
  fireEvent.click(accountView.getAllByRole("button", { name: /review account/i }).at(-1));
  fireEvent.click(accountView.getByRole("button", { name: /risk reviewed/i }));
  fireEvent.click(accountView.getByRole("button", { name: /remove risk: high/i }));
  fireEvent.click(accountView.getByRole("button", { name: /clear audit filters/i }));
  assert.deepEqual(accountEvents.map((event) => event[0]), [
    "search",
    "filter-remove",
    "filters-reset",
    "account-select",
    "sort",
    "page",
    "bulk",
    "toolbar-overflow",
    "detail-open",
    "detail-action",
    "audit-select",
    "audit-filter-remove",
    "audit-clear",
  ]);
  cleanup();

  const ticketEvents = [];
  const ticketView = render(React.createElement(TicketQueue, {
    label: "Ticket queue",
    selectedTicketKey: "ticket-1",
    detailOpen: true,
    alerts: {
      label: "Ticket alerts",
      open: true,
      notifications: [{ key: "alert-1", label: "New urgent ticket", unread: true }],
      markAllAction: { label: "Mark alerts read" },
      closeLabel: "Close ticket alerts",
    },
    tickets: {
      label: "Tickets",
      search: { label: "Ticket search", query: "" },
      filters: [{ key: "priority", label: "Priority: high" }],
      toolbar: { overflow: { triggerLabel: "More ticket actions", items: [{ key: "assign", label: "Assign" }] } },
      bulkActions: { actions: [{ key: "close", label: "Close tickets" }] },
      table: {
        columns: [{ key: "subject", label: "Subject", sortable: true }],
        rows: [{ id: "ticket-1", subject: "Refund issue" }],
        rowKey: "id",
        page: 1,
        pageCount: 2,
        pagination: { label: "Tickets pagination" },
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
      action: { key: "undo", label: "Undo" },
    },
    onAlertOpenChange: (open, event) => ticketEvents.push(["alert-open", open, event.type]),
    onAlertSelect: (key, event) => ticketEvents.push(["alert-select", key, event.type]),
    onAlertDismiss: (key, event) => ticketEvents.push(["alert-dismiss", key, event.type]),
    onAlertMarkAll: (event) => ticketEvents.push(["alert-mark-all", event.type]),
    onTicketSearchChange: (value, event) => ticketEvents.push(["search", value, event.type]),
    onTicketFilterRemove: (key, event) => ticketEvents.push(["filter-remove", key, event.type]),
    onTicketFiltersReset: (event) => ticketEvents.push(["filters-reset", event.type]),
    onTicketSortChange: (sort, event) => ticketEvents.push(["sort", sort.key, sort.direction, event.type]),
    onTicketSelect: (key, event) => ticketEvents.push(["ticket-select", key, event.type]),
    onTicketPageChange: (page, event) => ticketEvents.push(["page", page, event.type]),
    onTicketBulkAction: (key, event) => ticketEvents.push(["bulk", key, event.type]),
    onTicketToolbarOverflowSelect: (item, event) => ticketEvents.push(["toolbar-overflow", item.key, event.type]),
    onDetailOpenChange: (open, event) => ticketEvents.push(["detail-open", open, event.type]),
    onDetailAction: (key, event) => ticketEvents.push(["detail-action", key, event.type]),
    onFeedbackAction: (key, event) => ticketEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.click(ticketView.getByRole("button", { name: /mark alerts read/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /dismiss notification: new urgent ticket/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /close ticket alerts/i }));
  fireEvent.click(ticketView.container.querySelector('[data-key="alert-1"]'));
  fireEvent.input(ticketView.getByRole("searchbox", { name: /ticket search/i }), { target: { value: "refund" } });
  fireEvent.click(ticketView.getByRole("button", { name: /remove priority: high/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /reset filters/i }));
  fireEvent.click(ticketView.getByRole("checkbox", { name: /select row ticket-1/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /^subject$/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /next page/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /close tickets/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /more ticket actions/i }));
  fireEvent.click(ticketView.getByRole("menuitem", { name: /assign/i }));
  fireEvent.click(ticketView.getByRole("button", { name: /close ticket detail/i }));
  fireEvent.click(ticketView.getAllByRole("button", { name: /assign ticket/i }).at(-1));
  fireEvent.click(ticketView.getByRole("button", { name: /undo/i }));
  assert.deepEqual(ticketEvents.map((event) => event[0]), [
    "alert-mark-all",
    "alert-dismiss",
    "alert-open",
    "alert-select",
    "search",
    "filter-remove",
    "filters-reset",
    "ticket-select",
    "sort",
    "page",
    "bulk",
    "toolbar-overflow",
    "detail-open",
    "detail-action",
    "feedback",
  ]);
  cleanup();

  const caseEvents = [];
  const caseView = render(React.createElement(CaseManagement, {
    label: "Case management",
    selectedCaseKey: "case-1",
    detailOpen: true,
    summaries: [{ key: "open", label: "Open cases", tone: "info" }],
    filters: {
      label: "Case filters",
      open: true,
      fields: [{ key: "owner", label: "Owner", value: "Ana" }],
      appliedFilters: [{ key: "priority", label: "Priority: high" }],
      drawer: { triggerLabel: "Open case filters", closeLabel: "Close case filters" },
      applyAction: { label: "Apply case filters" },
      resetAction: { label: "Reset case filters" },
      savedViews: {
        triggerLabel: "Saved case filters",
        items: [{ key: "mine", label: "My cases" }],
      },
    },
    cases: {
      label: "Cases",
      search: { label: "Case search", query: "" },
      filters: [{ key: "status", label: "Status: open" }],
      toolbar: { overflow: { triggerLabel: "More case actions", items: [{ key: "assign", label: "Assign" }] } },
      bulkActions: { actions: [{ key: "escalate", label: "Escalate" }] },
      table: {
        columns: [{ key: "subject", label: "Subject", sortable: true }],
        rows: [{ id: "case-1", subject: "Refund escalation" }],
        rowKey: "id",
        page: 1,
        pageCount: 2,
        pagination: { label: "Cases pagination" },
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
      clearAction: { label: "Clear activity filters" },
      events: [{ key: "evt-1", label: "Case escalated", status: "warning" }],
    },
    feedback: {
      kind: "toast",
      label: "Case updated",
      action: { key: "undo", label: "Undo" },
    },
    onFilterDrawerOpenChange: (open, event) => caseEvents.push(["filter-open", open, event.type]),
    onFilterApply: (event) => caseEvents.push(["filter-apply", event.type]),
    onFilterReset: (event) => caseEvents.push(["filter-reset", event.type]),
    onSavedFilterSelect: (item, event) => caseEvents.push(["saved-filter", item.key, event.type]),
    onCaseSearchChange: (value, event) => caseEvents.push(["search", value, event.type]),
    onCaseFilterRemove: (key, event) => caseEvents.push(["case-filter-remove", key, event.type]),
    onCaseFiltersReset: (event) => caseEvents.push(["case-filters-reset", event.type]),
    onCaseSortChange: (sort, event) => caseEvents.push(["sort", sort.key, sort.direction, event.type]),
    onCaseSelect: (key, event) => caseEvents.push(["case-select", key, event.type]),
    onCasePageChange: (page, event) => caseEvents.push(["page", page, event.type]),
    onCaseBulkAction: (key, event) => caseEvents.push(["bulk", key, event.type]),
    onCaseToolbarOverflowSelect: (item, event) => caseEvents.push(["toolbar-overflow", item.key, event.type]),
    onDetailOpenChange: (open, event) => caseEvents.push(["detail-open", open, event.type]),
    onDetailAction: (key, event) => caseEvents.push(["detail-action", key, event.type]),
    onTimelineEventSelect: (key, event) => caseEvents.push(["timeline-select", key, event.type]),
    onTimelineFilterRemove: (key, event) => caseEvents.push(["timeline-filter-remove", key, event.type]),
    onTimelineClear: (event) => caseEvents.push(["timeline-clear", event.type]),
    onFeedbackAction: (key, event) => caseEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.click(caseView.getByRole("button", { name: /close case filters/i }));
  fireEvent.click(caseView.getByRole("button", { name: /apply case filters/i }));
  fireEvent.click(caseView.getByRole("button", { name: /^reset case filters$/i }));
  fireEvent.click(caseView.getByRole("button", { name: /saved case filters/i }));
  fireEvent.click(caseView.getByRole("menuitem", { name: /my cases/i }));
  fireEvent.input(caseView.getByRole("searchbox", { name: /case search/i }), { target: { value: "refund" } });
  fireEvent.click(caseView.getByRole("button", { name: /remove status: open/i }));
  fireEvent.click(caseView.getByRole("button", { name: /^reset filters$/i }));
  fireEvent.click(caseView.getByRole("checkbox", { name: /select row case-1/i }));
  fireEvent.click(caseView.getByRole("button", { name: /^subject$/i }));
  fireEvent.click(caseView.getByRole("button", { name: /next page/i }));
  fireEvent.click(caseView.getByRole("button", { name: /^escalate$/i }));
  fireEvent.click(caseView.getByRole("button", { name: /more case actions/i }));
  fireEvent.click(caseView.getByRole("menuitem", { name: /assign/i }));
  fireEvent.click(caseView.getByRole("button", { name: /close case detail/i }));
  fireEvent.click(caseView.getAllByRole("button", { name: /resolve case/i }).at(-1));
  fireEvent.click(caseView.container.querySelector('[data-key="evt-1"]'));
  fireEvent.click(caseView.getByRole("button", { name: /remove owner: ana/i }));
  fireEvent.click(caseView.getByRole("button", { name: /clear activity filters/i }));
  fireEvent.click(caseView.getByRole("button", { name: /undo/i }));
  assert.deepEqual(caseEvents.map((event) => event[0]), [
    "filter-open",
    "filter-apply",
    "filter-reset",
    "saved-filter",
    "search",
    "case-filter-remove",
    "case-filters-reset",
    "case-select",
    "sort",
    "page",
    "bulk",
    "toolbar-overflow",
    "detail-open",
    "detail-action",
    "timeline-select",
    "timeline-filter-remove",
    "timeline-clear",
    "feedback",
  ]);
  cleanup();

  const editableTableEvents = [];
  const editableTableView = render(React.createElement(FilterableEditableTable, {
    label: "Editable pricing table",
    selectedRowKey: "price-1",
    editing: true,
    metrics: [{ key: "drafts", label: "Draft edits", tone: "warning" }],
    filters: {
      label: "Pricing filters",
      open: true,
      fields: [{ key: "region", label: "Region", value: "North" }],
      appliedFilters: [{ key: "status", label: "Status: draft" }],
      drawer: { triggerLabel: "Open pricing filters", closeLabel: "Close pricing filters" },
      applyAction: { label: "Apply pricing filters" },
      resetAction: { label: "Reset pricing filters" },
      savedViews: {
        triggerLabel: "Saved pricing filters",
        items: [{ key: "drafts", label: "Draft rows" }],
      },
    },
    table: {
      label: "Pricing rows",
      columns: [{ key: "sku", label: "SKU", sortable: true }],
      rows: [{ id: "price-1", sku: "FUEL-001" }],
      rowKey: "id",
      page: 1,
      pageCount: 2,
      pagination: { label: "Pricing pagination" },
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
    onFilterDrawerOpenChange: (open, event) => editableTableEvents.push(["filter-open", open, event.type]),
    onFilterApply: (event) => editableTableEvents.push(["filter-apply", event.type]),
    onFilterReset: (event) => editableTableEvents.push(["filter-reset", event.type]),
    onSavedFilterSelect: (item, event) => editableTableEvents.push(["saved-filter", item.key, event.type]),
    onTableSortChange: (sort, event) => editableTableEvents.push(["sort", sort.key, sort.direction, event.type]),
    onTableRowSelect: (key, event) => editableTableEvents.push(["row-select", key, event.type]),
    onTablePageChange: (page, event) => editableTableEvents.push(["page", page, event.type]),
    onTableBulkAction: (key, event) => editableTableEvents.push(["bulk", key, event.type]),
    onEditorOpenChange: (open, event) => editableTableEvents.push(["editor-open", open, event.type]),
    onEditorAction: (key, event) => editableTableEvents.push(["editor-action", key, event.type]),
    onFeedbackAction: (key, event) => editableTableEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.click(editableTableView.getByRole("button", { name: /close pricing filters/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /apply pricing filters/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /^reset pricing filters$/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /saved pricing filters/i }));
  fireEvent.click(editableTableView.getByRole("menuitem", { name: /draft rows/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /^sku$/i }));
  fireEvent.click(editableTableView.getByRole("checkbox", { name: /select row price-1/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /next page/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /^approve edits$/i }));
  fireEvent.click(editableTableView.getByRole("button", { name: /close pricing editor/i }));
  fireEvent.click(editableTableView.getAllByRole("button", { name: /save edits/i }).at(-1));
  fireEvent.click(editableTableView.getByRole("button", { name: /undo/i }));
  assert.deepEqual(editableTableEvents.map((event) => event[0]), [
    "filter-open",
    "filter-apply",
    "filter-reset",
    "saved-filter",
    "sort",
    "row-select",
    "page",
    "bulk",
    "editor-open",
    "editor-action",
    "feedback",
  ]);
  cleanup();

  const pricingEvents = [];
  const pricingView = render(React.createElement(PricingOperations, {
    label: "Pricing operations",
    selectedRuleKey: "P-101",
    editorOpen: true,
    rules: [{ id: "P-101", name: "Base fare CDMX", scope: "City", type: "Base", value: "$10.50/km", status: "pending approval", by: "Pricing" }],
    rolePolicy: {
      mode: "checkbox",
      roles: [{ key: "pricing", label: "Pricing" }],
      permissions: [{ key: "approve", label: "Approve pricing", badge: "Approval" }],
      values: { pricing: { approve: true } },
      actions: [{ key: "save-access", label: "Save pricing access" }],
    },
    queue: {
      filters: {
        label: "Pricing filters",
        appliedFilters: [{ key: "status", label: "Status: pending" }],
        resetAction: { label: "Reset pricing filters" },
      },
      table: {
        columns: [{ key: "name", label: "Rule", sortable: true }],
        page: 1,
        pageCount: 2,
        pagination: { label: "Pricing pagination" },
        bulkActions: [{ key: "submit-approval", label: "Submit for approval" }],
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
    onRuleFiltersReset: (event) => pricingEvents.push(["reset", event.type]),
    onRuleSortChange: (sort, event) => pricingEvents.push(["sort", sort.key, sort.direction, event.type]),
    onRuleSelect: (key, event) => pricingEvents.push(["select", key, event.type]),
    onRulePageChange: (page, event) => pricingEvents.push(["page", page, event.type]),
    onRuleBulkAction: (key, event) => pricingEvents.push(["bulk", key, event.type]),
    onRuleSubmitForApproval: (key, event) => pricingEvents.push(["approval", key, event.type]),
    onEditorOpenChange: (open, event) => pricingEvents.push(["editor-open", open, event.type]),
    onEditorAction: (key, event) => pricingEvents.push(["editor-action", key, event.type]),
    onPermissionChange: (roleKey, permissionKey, checked, meta, event) => pricingEvents.push(["permission", roleKey, permissionKey, checked, event.type]),
    onPermissionAction: (key, event) => pricingEvents.push(["permission-action", key, event.type]),
    onFeedbackAction: (key, event) => pricingEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.click(pricingView.getByRole("button", { name: /^reset pricing filters$/i }));
  fireEvent.click(pricingView.getByRole("button", { name: /^rule$/i }));
  fireEvent.click(pricingView.getByRole("checkbox", { name: /select row p-101/i }));
  fireEvent.click(pricingView.getByRole("button", { name: /next page/i }));
  fireEvent.click(pricingView.getAllByRole("button", { name: /submit for approval/i })[0]);
  fireEvent.click(pricingView.getByRole("button", { name: /close pricing editor/i }));
  fireEvent.click(pricingView.getAllByRole("button", { name: /submit for approval/i }).at(-1));
  fireEvent.click(pricingView.getByRole("checkbox", { name: /pricing: approve pricing/i }));
  fireEvent.click(pricingView.getByRole("button", { name: /save pricing access/i }));
  fireEvent.click(pricingView.getByRole("button", { name: /review queue/i }));
  assert.deepEqual(pricingEvents.map((event) => event[0]), [
    "reset",
    "sort",
    "select",
    "page",
    "bulk",
    "approval",
    "editor-open",
    "editor-action",
    "approval",
    "permission",
    "permission-action",
    "feedback",
  ]);
  cleanup();

  const approvalEvents = [];
  const approvalView = render(React.createElement(BackofficeApproval, {
    label: "Backoffice approval",
    selectedDocumentKey: "D-220",
    detailOpen: true,
    documents: [{ id: "D-220", who: "Diego Vera", doc: "Driver license", submitted: "1 day ago", status: "pending", file: "license.pdf" }],
    queue: {
      search: { label: "Search documents", query: "license" },
      filters: [{ key: "status", label: "Status: pending" }],
      table: {
        columns: [{ key: "document", label: "Document", sortable: true }],
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
    onDocumentSearchChange: (value, event) => approvalEvents.push(["search", value, event.type]),
    onDocumentFilterRemove: (key, event) => approvalEvents.push(["filter-remove", key, event.type]),
    onDocumentFiltersReset: (event) => approvalEvents.push(["filters-reset", event.type]),
    onDocumentSortChange: (sort, event) => approvalEvents.push(["sort", sort.key, sort.direction, event.type]),
    onDocumentSelect: (key, event) => approvalEvents.push(["select", key, event.type]),
    onDocumentPageChange: (page, event) => approvalEvents.push(["page", page, event.type]),
    onDocumentBulkAction: (key, event) => approvalEvents.push(["bulk", key, event.type]),
    onDetailOpenChange: (open, event) => approvalEvents.push(["detail-open", open, event.type]),
    onDetailAction: (key, event) => approvalEvents.push(["detail-action", key, event.type]),
    onApprove: (key, event) => approvalEvents.push(["approve", key, event.type]),
    onReject: (key, event) => approvalEvents.push(["reject", key, event.type]),
    onFeedbackAction: (key, event) => approvalEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.change(approvalView.getByRole("searchbox", { name: /search documents/i }), { target: { value: "policy" } });
  fireEvent.click(approvalView.getByRole("button", { name: /remove status: pending/i }));
  fireEvent.click(approvalView.getByRole("button", { name: /^reset filters$/i }));
  fireEvent.click(approvalView.getByRole("button", { name: /^document$/i }));
  fireEvent.click(approvalView.getByRole("checkbox", { name: /select row d-220/i }));
  fireEvent.click(approvalView.getByRole("button", { name: /next page/i }));
  fireEvent.click(approvalView.getByRole("button", { name: /approve selected/i }));
  fireEvent.click(approvalView.getByRole("button", { name: /close document detail/i }));
  const approvalDrawer = within(approvalView.getByRole("dialog", { name: /document detail/i }));
  fireEvent.click(approvalDrawer.getByRole("button", { name: /^reject$/i }));
  fireEvent.click(approvalDrawer.getByRole("button", { name: /^approve$/i }));
  fireEvent.click(approvalView.getByRole("button", { name: /review next/i }));
  assert.deepEqual(approvalEvents.map((event) => event[0]), [
    "search",
    "filter-remove",
    "filters-reset",
    "sort",
    "select",
    "page",
    "bulk",
    "approve",
    "detail-open",
    "detail-action",
    "reject",
    "detail-open",
    "detail-action",
    "approve",
    "detail-open",
    "feedback",
  ]);
  cleanup();

  const expandableTableEvents = [];
  const expandableTableView = render(React.createElement(ExpandableDetailTable, {
    label: "Expandable detail table",
    expandedRowKey: "row-1",
    detailOpen: true,
    summaries: [{ key: "selected", label: "Selected row", tone: "info" }],
    table: {
      label: "Operational rows",
      columns: [{ key: "name", label: "Name", sortable: true }],
      rows: [{ id: "row-1", name: "Acme" }],
      rowKey: "id",
      page: 1,
      pageCount: 2,
      pagination: { label: "Rows pagination" },
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
    onTableSortChange: (sort, event) => expandableTableEvents.push(["sort", sort.key, sort.direction, event.type]),
    onTableRowSelect: (key, event) => expandableTableEvents.push(["row-select", key, event.type]),
    onTablePageChange: (page, event) => expandableTableEvents.push(["page", page, event.type]),
    onTableBulkAction: (key, event) => expandableTableEvents.push(["bulk", key, event.type]),
    onDetailOpenChange: (open, event) => expandableTableEvents.push(["detail-open", open, event.type]),
    onDetailAction: (key, event) => expandableTableEvents.push(["detail-action", key, event.type]),
    onFeedbackAction: (key, event) => expandableTableEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.click(expandableTableView.getByRole("button", { name: /^name$/i }));
  fireEvent.click(expandableTableView.getByRole("checkbox", { name: /select row row-1/i }));
  fireEvent.click(expandableTableView.getByRole("button", { name: /next page/i }));
  fireEvent.click(expandableTableView.getByRole("button", { name: /^review row$/i }));
  fireEvent.click(expandableTableView.getByRole("button", { name: /close row detail/i }));
  fireEvent.click(expandableTableView.getAllByRole("button", { name: /approve row/i }).at(-1));
  fireEvent.click(expandableTableView.getByRole("button", { name: /undo/i }));
  assert.deepEqual(expandableTableEvents.map((event) => event[0]), [
    "sort",
    "row-select",
    "page",
    "bulk",
    "detail-open",
    "detail-action",
    "feedback",
  ]);
  cleanup();

  const permissionEvents = [];
  const permissionView = render(React.createElement(RolesAndPermissions, {
    mode: "checkbox",
    roles: [{ key: "admin", label: "Admin" }],
    permissions: [{ key: "billing", label: "Billing" }],
    values: { admin: { billing: false } },
    actions: [{ key: "apply", label: "Apply permissions" }],
    onPermissionChange: (role, permission, checked, meta, event) => permissionEvents.push(["permission", role, permission, checked, event.type]),
    onAction: (key, event) => permissionEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(permissionView.getByLabelText(/admin: billing/i));
  fireEvent.click(permissionView.getByRole("button", { name: /apply permissions/i }));
  assert.deepEqual(permissionEvents.map((event) => event[0]), ["permission", "action"]);
  assert.equal(permissionEvents[0][1], "admin");
  assert.equal(permissionEvents[0][2], "billing");
  cleanup();


  console.log("react pattern operations interaction tests passed");
} finally {
  cleanup();
  dom.window.close();
}
