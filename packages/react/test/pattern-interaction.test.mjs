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
} = await import("../src/patterns/index.js");

try {
  const actionSheetEvents = [];
  const actionSheetView = render(React.createElement(ActionSheet, {
    label: "Bulk actions",
    open: false,
    actions: [{ key: "archive", label: "Archive" }],
    dialog: { triggerLabel: "Open actions" },
    onOpenChange: (open, event) => actionSheetEvents.push(["open", open, event.type]),
    onAction: (key, event) => actionSheetEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(actionSheetView.getByRole("button", { name: /open actions/i }));
  fireEvent.click(actionSheetView.getByRole("button", { name: /archive/i }));
  assert.deepEqual(actionSheetEvents.map((event) => event[0]), ["open", "action"]);
  cleanup();

  const autocompleteEvents = [];
  const autocompleteView = render(React.createElement(Autocomplete, {
    label: "Station autocomplete",
    value: "",
    suggestions: [{ key: "mx-4821", label: "MX-4821", value: "mx-4821" }],
    onOpenChange: (open, event) => autocompleteEvents.push(["open", open, event.type]),
    onValueChange: (value, meta, event) => autocompleteEvents.push(["value", value, event.type]),
    onSuggestionSelect: (key, suggestion, event) => autocompleteEvents.push(["suggestion", key, suggestion.label, event.type]),
  }));
  fireEvent.focus(autocompleteView.getByRole("combobox", { name: /station autocomplete/i }));
  fireEvent.input(autocompleteView.getByRole("combobox", { name: /station autocomplete/i }), { target: { value: "mx" } });
  fireEvent.click(autocompleteView.getByRole("option", { name: /mx-4821/i }));
  assert.deepEqual(autocompleteEvents.map((event) => event[0]), ["open", "open", "value", "open", "value"]);
  cleanup();

  const avatarGroupEvents = [];
  const avatarGroupView = render(React.createElement(AvatarGroup, {
    label: "Dispatch team",
    maxVisible: 1,
    identities: [{ key: "ana", name: "Ana" }, { key: "luis", name: "Luis" }],
    overflow: { triggerLabel: "View more people" },
    onOverflowOpenChange: (open, event) => avatarGroupEvents.push(["overflow", open, event.type]),
    onIdentitySelect: (key, event) => avatarGroupEvents.push(["identity", key, event.type]),
  }));
  fireEvent.click(avatarGroupView.getByRole("button", { name: /view more people/i }));
  fireEvent.click(avatarGroupView.getByRole("button", { name: /luis/i }));
  assert.deepEqual(avatarGroupEvents.map((event) => event[0]), ["overflow", "identity"]);
  cleanup();

  const calendarEvents = [];
  const calendarView = render(React.createElement(CalendarView, {
    label: "Maintenance calendar",
    selectedDate: "2026-08-09",
    events: [{ key: "inspection", label: "Inspection", time: "09:00" }],
    onDateChange: (range, event) => calendarEvents.push(["date", range.from, range.to, event.type]),
    onEventSelect: (key, event) => calendarEvents.push(["event", key, event.type]),
  }));
  fireEvent.change(calendarView.container.querySelector("[data-date-range-picker-from]"), { target: { value: "2026-08-10" } });
  fireEvent.click(calendarView.getByRole("button", { name: /inspection/i }));
  assert.deepEqual(calendarEvents.map((event) => event[0]), ["date", "event"]);
  cleanup();

  const commandEvents = [];
  const commandView = render(React.createElement(CommandPalette, {
    label: "Command palette",
    triggerLabel: "Open command palette",
    open: false,
    query: "veh",
    commands: [{ key: "vehicle-open", label: "Open vehicle" }],
    primaryAction: { label: "Run command" },
    onOpenChange: (open, event) => commandEvents.push(["open", open, event.type]),
    onQueryChange: (value, meta, event) => commandEvents.push(["query", value, event.type]),
    onCommandSelect: (command, event) => commandEvents.push(["command", command.key, event.type]),
    onPrimaryAction: (event) => commandEvents.push(["primary", event.type]),
  }));
  fireEvent.click(commandView.getByRole("button", { name: /open command palette/i }));
  fireEvent.input(commandView.getAllByLabelText(/command palette query/i).at(-1), { target: { value: "vehicle" } });
  fireEvent.click(commandView.getByRole("button", { name: /command palette commands/i }));
  fireEvent.click(commandView.getByRole("menuitem", { name: /open vehicle/i }));
  fireEvent.click(commandView.getByRole("button", { name: /run command/i }));
  assert.deepEqual(commandEvents.map((event) => event[0]), ["open", "query", "command", "primary"]);
  cleanup();

  const confirmationEvents = [];
  const confirmationView = render(React.createElement(ConfirmationDialog, {
    label: "Delete vehicle",
    open: true,
    closeLabel: "Close dialog",
    confirm: { key: "delete", label: "Delete" },
    cancel: { key: "cancel", label: "Cancel" },
    recovery: { secondaryAction: { key: "restore", label: "Restore" } },
    onConfirm: (event) => confirmationEvents.push(["confirm", event.type]),
    onCancel: (event) => confirmationEvents.push(["cancel", event.type]),
    onOpenChange: (open, event) => confirmationEvents.push(["open", open, event.type]),
    onRecoveryAction: (key, event) => confirmationEvents.push(["recovery", key, event.type]),
  }));
  fireEvent.click(confirmationView.getByRole("button", { name: /cancel/i }));
  fireEvent.click(confirmationView.getByRole("button", { name: /delete/i }));
  fireEvent.click(confirmationView.getByRole("button", { name: /close dialog/i }));
  fireEvent.click(confirmationView.getByRole("button", { name: /restore/i }));
  assert.deepEqual(confirmationEvents.map((event) => event[0]), ["cancel", "open", "confirm", "open", "open", "recovery"]);
  cleanup();

  const columnEvents = [];
  const columnView = render(React.createElement(ColumnConfigurator, {
    columns: [{ key: "plate", label: "Plate", visible: true }, { key: "driver", label: "Driver", visible: false }],
    rows: [{ id: "mx-4821", plate: "MX-4821", driver: "Ana" }],
    onColumnVisibilityChange: (key, checked, meta, event) => columnEvents.push(["column", key, checked, event.type]),
  }));
  fireEvent.click(columnView.getByRole("checkbox", { name: /driver/i }));
  assert.deepEqual(columnEvents.map((event) => event[0]), ["column"]);
  cleanup();

  const dragEvents = [];
  const dragView = render(React.createElement(DragSortableList, {
    items: [{ key: "first", label: "First" }, { key: "second", label: "Second" }],
    undoAction: { label: "Undo order" },
    onMoveItem: (key, direction, event) => dragEvents.push(["move", key, direction, event.type]),
    onUndo: (event) => dragEvents.push(["undo", event.type]),
  }));
  fireEvent.click(dragView.getByRole("button", { name: /move second up/i }));
  fireEvent.click(dragView.getByRole("button", { name: /undo order/i }));
  assert.deepEqual(dragEvents.map((event) => event[0]), ["move", "undo"]);
  cleanup();

  const kanbanEvents = [];
  const kanbanView = render(React.createElement(KanbanBoard, {
    label: "Growth board",
    sortable: true,
    actions: [{ key: "add", label: "Add card" }],
    columns: [
      { key: "todo", label: "To do", items: [{ key: "brief", label: "Brief" }] },
      { key: "doing", label: "Doing", items: [{ key: "activate", label: "Activation" }, { key: "review", label: "Review" }] },
    ],
    onCardSelect: (key, columnKey, event) => kanbanEvents.push(["select", key, columnKey, event.type]),
    onMoveCard: (key, columnKey, direction, event) => kanbanEvents.push(["move", key, columnKey, direction, event.type]),
    onColumnAction: (key, event) => kanbanEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(kanbanView.container.querySelector('[data-key="activate"]'));
  fireEvent.click(kanbanView.getByRole("button", { name: /move review up/i }));
  fireEvent.click(kanbanView.getByRole("button", { name: /add card/i }));
  assert.deepEqual(kanbanEvents.map((event) => event[0]), ["select", "move", "action"]);
  assert.deepEqual(kanbanEvents[0].slice(1, 3), ["activate", "doing"]);
  assert.deepEqual(kanbanEvents[1].slice(1, 4), ["review", "doing", "up"]);
  cleanup();

  const administrationEvents = [];
  const administrationView = render(React.createElement(DriverAndVehicleAdministration, {
    records: [{ id: "mx-4821", name: "MX-4821", status: "Active" }],
    dialog: {
      open: true,
      label: "Confirm action",
      actions: [{ key: "approve", label: "Approve" }],
    },
    onDialogAction: (key, event) => administrationEvents.push(["dialog", key, event.type]),
  }));
  fireEvent.click(administrationView.getByRole("button", { name: /approve/i }));
  assert.deepEqual(administrationEvents.map((event) => event[0]), ["dialog"]);
  cleanup();

  const searchEvents = [];
  const searchView = render(React.createElement(Search, {
    label: "Station search",
    query: "mx",
    scopes: [{ value: "active", label: "Active" }, { value: "all", label: "All" }],
    scopeValue: "active",
    results: [{ key: "mx-4821", label: "MX-4821" }],
    submitAction: { label: "Search" },
    clearAction: { label: "Clear" },
    onScopeChange: (value, meta, event) => searchEvents.push(["scope", value, event.type]),
    onQueryChange: (value, meta, event) => searchEvents.push(["query", value, event.type]),
    onResultSelect: (key, event) => searchEvents.push(["select", key, event.type]),
    onSubmit: (query, event) => searchEvents.push(["submit", query, event.type]),
    onClear: (event) => searchEvents.push(["clear", event.type]),
  }));
  fireEvent.click(searchView.getByRole("combobox", { name: /search scope/i }));
  fireEvent.click(searchView.getByRole("option", { name: /all/i }));
  fireEvent.input(searchView.getByRole("searchbox", { name: /station search/i }), { target: { value: "mx 4" } });
  fireEvent.click(searchView.getByRole("button", { name: /mx-4821/i }));
  fireEvent.click(searchView.getByRole("button", { name: /^search$/i }));
  fireEvent.click(searchView.getByRole("button", { name: /^clear$/i }));
  assert.deepEqual(searchEvents.map((event) => event[0]), ["scope", "query", "select", "submit", "clear"]);
  cleanup();

  const filterEvents = [];
  const filterView = render(React.createElement(FilterChipGroup, {
    filters: [{ key: "status", label: "Status: active" }],
    reset: { label: "Reset filters" },
    onRemoveFilter: (key, event) => filterEvents.push(["remove", key, event.type]),
    onReset: (event) => filterEvents.push(["reset", event.type]),
  }));
  fireEvent.click(filterView.getByRole("button", { name: /remove status: active/i }));
  fireEvent.click(filterView.getByRole("button", { name: /reset filters/i }));
  assert.deepEqual(filterEvents, [["remove", "status", "click"], ["reset", "click"]]);
  cleanup();

  const filterFeedbackEvents = [];
  const filterFeedbackView = render(React.createElement(FilterChipGroup, {
    filters: [{ key: "status", label: "Status: active" }],
    feedback: {
      label: "Filters applied",
      actionLabel: "Review filters",
      dismissible: true,
      dismissLabel: "Dismiss filters feedback",
    },
    onFeedbackAction: (event) => filterFeedbackEvents.push(["feedback-action", event.type]),
    onFeedbackDismiss: (event) => filterFeedbackEvents.push(["feedback-dismiss", event.type]),
  }));
  fireEvent.click(filterFeedbackView.getByRole("button", { name: /review filters/i }));
  fireEvent.click(filterFeedbackView.getByRole("button", { name: /dismiss filters feedback/i }));
  assert.deepEqual(filterFeedbackEvents.map((event) => event[0]), ["feedback-action", "feedback-dismiss"]);
  cleanup();

  const fileUploadEvents = [];
  const fileUploadView = render(React.createElement(FileUpload, {
    label: "Upload documents",
    state: "error",
    files: [{ key: "insurance", name: "insurance.pdf", status: "Failed" }],
    chooseAction: { label: "Choose file" },
    removeAction: { label: "Remove file" },
    retryAction: { label: "Retry upload" },
    onChoose: (event) => fileUploadEvents.push(["choose", event.type]),
    onRemove: (key, event) => fileUploadEvents.push(["remove", key, event.type]),
    onRetry: (event) => fileUploadEvents.push(["retry", event.type]),
  }));
  fireEvent.click(fileUploadView.getByRole("button", { name: /choose file/i }));
  fireEvent.click(fileUploadView.getByRole("button", { name: /remove file/i }));
  fireEvent.click(fileUploadView.getByRole("button", { name: /retry upload/i }));
  assert.deepEqual(fileUploadEvents.map((event) => event[0]), ["choose", "remove", "retry"]);
  cleanup();

  const fleetEvents = [];
  const fleetView = render(React.createElement(FleetManagerOnboardingDesktop, {
    tasks: [{ key: "profile", label: "Profile setup", checked: false }],
    onTaskChange: (key, checked, meta, event) => fleetEvents.push(["task", key, checked, event.type]),
  }));
  fireEvent.click(fleetView.getByRole("checkbox", { name: /profile setup/i }));
  assert.deepEqual(fleetEvents.map((event) => event[0]), ["task"]);
  cleanup();

  const formSectionEvents = [];
  const formSectionView = render(React.createElement(FormSection, {
    title: "Vehicle details",
    fields: [{
      key: "plate",
      label: "Plate",
      value: "MX-4821",
      onValueChange: (value, meta, event) => formSectionEvents.push(["field-slot", value, event.type]),
    }],
    primaryAction: { key: "save", label: "Save vehicle" },
    onFieldValueChange: (key, value, meta, event) => formSectionEvents.push(["field", key, value, event.type]),
    onAction: (key, event) => formSectionEvents.push(["action", key, event.type]),
  }));
  fireEvent.input(formSectionView.getByLabelText(/plate/i), { target: { value: "MX-9000" } });
  fireEvent.click(formSectionView.getByRole("button", { name: /save vehicle/i }));
  assert.deepEqual(formSectionEvents.map((event) => event[0]), ["field-slot", "field", "action"]);
  cleanup();

  const helpEvents = [];
  const helpView = render(React.createElement(HelpCenter, {
    label: "Help center",
    open: false,
    query: "route",
    topics: [{ key: "routes", label: "Routes", count: 3 }],
    articles: [{ id: "route-setup", title: "Route setup", topic: "Routes", summary: "Create routes" }],
    recovery: { action: { key: "retry", label: "Retry help" } },
    drawer: { triggerLabel: "Open help" },
    onDrawerOpenChange: (open, event) => helpEvents.push(["drawer", open, event.type]),
    onQueryChange: (value, meta, event) => helpEvents.push(["query", value, event.type]),
    onTopicSelect: (key, topic, event) => helpEvents.push(["topic", key, topic.label, event.type]),
    onRecoveryAction: (key, event) => helpEvents.push(["recovery", key, event.type]),
  }));
  fireEvent.click(helpView.getByRole("button", { name: /open help/i }));
  fireEvent.input(helpView.getByRole("searchbox", { name: /help center search/i }), { target: { value: "route setup" } });
  fireEvent.click(helpView.getAllByRole("button", { name: /^routes$/i }).at(-1));
  assert.deepEqual(helpEvents.map((event) => event[0]), ["drawer", "query", "topic"]);
  cleanup();

  const helpRecoveryEvents = [];
  const helpRecoveryView = render(React.createElement(HelpCenter, {
    label: "Help center",
    empty: true,
    recovery: { action: { key: "retry", label: "Retry help" } },
    onRecoveryAction: (key, event) => helpRecoveryEvents.push(["recovery", key, event.type]),
  }));
  fireEvent.click(helpRecoveryView.getAllByRole("button", { name: /retry help/i })[0]);
  assert.deepEqual(helpRecoveryEvents.map((event) => event[0]), ["recovery"]);
  cleanup();

  const fullscreenEvents = [];
  const fullscreenView = render(React.createElement(FullscreenSheet, {
    open: true,
    closeAction: { label: "Close sheet" },
    onClose: (event) => fullscreenEvents.push(["close", event.type]),
  }));
  fireEvent.click(fullscreenView.getByRole("button", { name: /close sheet/i }));
  assert.deepEqual(fullscreenEvents.map((event) => event[0]), ["close"]);
  cleanup();

  const pullEvents = [];
  const pullView = render(React.createElement(PullToRefresh, {
    label: "Refresh routes",
    fallbackAction: { label: "Refresh routes now" },
    onRefresh: (event) => pullEvents.push(["refresh", event.type]),
  }));
  fireEvent.click(pullView.getByRole("button", { name: /refresh routes now/i }));
  assert.deepEqual(pullEvents, [["refresh", "click"]]);
  cleanup();

  const selectLayerEvents = [];
  const selectLayerView = render(React.createElement(SelectOptionLayer, {
    label: "Assign station",
    value: "north",
    options: [{ value: "north", label: "North" }, { value: "south", label: "South" }],
    action: { key: "apply", label: "Apply station" },
    onValueChange: (value, meta, event) => selectLayerEvents.push(["value", value, event.type]),
    onAction: (key, event) => selectLayerEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(selectLayerView.getByRole("combobox", { name: /assign station/i }));
  fireEvent.click(selectLayerView.getByRole("option", { name: /south/i }));
  fireEvent.click(selectLayerView.getByRole("button", { name: /apply station/i }));
  assert.deepEqual(selectLayerEvents.map((event) => event[0]), ["value", "action"]);
  cleanup();

  const settingsEvents = [];
  const settingsView = render(React.createElement(Settings, {
    dirty: true,
    groups: [{
      key: "profile",
      title: "Profile",
      controls: [{ key: "name", label: "Name", value: "Ana" }],
    }],
    saveAction: { label: "Save settings" },
    resetAction: { label: "Reset settings" },
    onControlChange: (key, value, meta, event) => settingsEvents.push(["control", key, value, event.type]),
    onSave: (event) => settingsEvents.push(["save", event.type]),
    onReset: (event) => settingsEvents.push(["reset", event.type]),
  }));
  fireEvent.input(settingsView.getByLabelText(/name/i), { target: { value: "Ana Torres" } });
  fireEvent.click(settingsView.getByRole("button", { name: /save settings/i }));
  fireEvent.click(settingsView.getByRole("button", { name: /reset settings/i }));
  assert.deepEqual(settingsEvents.map((event) => event[0]), ["control", "save", "reset"]);
  cleanup();

  const preferenceEvents = [];
  const preferenceView = render(React.createElement(PreferenceManagement, {
    label: "Workspace preferences",
    dirty: true,
    settings: {
      dirty: true,
      groups: [{
        key: "notifications",
        title: "Notifications",
        controls: [{ key: "email", kind: "switch", label: "Email updates", checked: true }],
      }],
      saveAction: { label: "Save preferences" },
      resetAction: { label: "Reset preferences" },
    },
    sections: [{
      key: "profile",
      title: "Profile copy",
      fields: [{ key: "display-name", label: "Display name", value: "Ana" }],
      primaryAction: { key: "save-profile", label: "Save profile" },
    }],
    dangerZone: {
      label: "Delete workspace",
      open: true,
      closeLabel: "Close delete dialog",
      confirm: { key: "delete", label: "Delete workspace" },
      cancel: { key: "cancel", label: "Keep workspace" },
      recovery: {
        label: "Owner approval required",
        secondaryAction: { key: "contact-owner", label: "Contact owner" },
      },
    },
    onSettingsControlChange: (key, value, meta, event) => preferenceEvents.push(["settings-control", key, value, event.type]),
    onSettingsSave: (event) => preferenceEvents.push(["settings-save", event.type]),
    onSettingsReset: (event) => preferenceEvents.push(["settings-reset", event.type]),
    onSectionFieldValueChange: (sectionKey, fieldKey, value, meta, event) => preferenceEvents.push(["section-field", sectionKey, fieldKey, value, event.type]),
    onSectionAction: (sectionKey, actionKey, event) => preferenceEvents.push(["section-action", sectionKey, actionKey, event.type]),
    onDangerOpenChange: (open, event) => preferenceEvents.push(["danger-open", open, event.type]),
    onDangerCancel: (event) => preferenceEvents.push(["danger-cancel", event.type]),
    onDangerConfirm: (event) => preferenceEvents.push(["danger-confirm", event.type]),
    onDangerRecoveryAction: (key, event) => preferenceEvents.push(["danger-recovery", key, event.type]),
  }));
  fireEvent.click(preferenceView.getByLabelText(/email updates/i));
  fireEvent.click(preferenceView.getByRole("button", { name: /save preferences/i }));
  fireEvent.click(preferenceView.getByRole("button", { name: /reset preferences/i }));
  fireEvent.input(preferenceView.getByLabelText(/display name/i), { target: { value: "Ana Torres" } });
  fireEvent.click(preferenceView.getByRole("button", { name: /save profile/i }));
  fireEvent.click(preferenceView.getByRole("button", { name: /close delete dialog/i }));
  fireEvent.click(preferenceView.getByRole("button", { name: /keep workspace/i }));
  fireEvent.click(preferenceView.getByRole("button", { name: /delete workspace/i }));
  fireEvent.click(preferenceView.getByRole("button", { name: /contact owner/i }));
  assert.deepEqual(preferenceEvents.map((event) => event[0]), [
    "settings-control",
    "settings-save",
    "settings-reset",
    "section-field",
    "section-action",
    "danger-open",
    "danger-cancel",
    "danger-open",
    "danger-confirm",
    "danger-open",
    "danger-recovery",
  ]);
  cleanup();

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

  const notificationEvents = [];
  const notificationView = render(React.createElement(NotificationPanel, {
    open: true,
    notifications: [{ key: "sync", label: "Sync failed", unread: true }],
    selectedKey: "sync",
    markAllAction: { label: "Mark all read" },
    onMarkAll: (event) => notificationEvents.push(["mark-all", event.type]),
    onDismiss: (key, event) => notificationEvents.push(["dismiss", key, event.type]),
    onOpenChange: (open, event) => notificationEvents.push(["open", open, event.type]),
    onSelect: (key, event) => notificationEvents.push(["select", key, event.type]),
  }));
  fireEvent.click(notificationView.getByRole("button", { name: /mark all read/i }));
  fireEvent.click(notificationView.getByRole("button", { name: /dismiss notification: sync failed/i }));
  fireEvent.click(notificationView.getByRole("button", { name: /close notifications/i }));
  fireEvent.click(notificationView.getByRole("button", { name: /open notification/i }));
  assert.deepEqual(notificationEvents.map((event) => event[0]), ["mark-all", "dismiss", "open", "select"]);
  cleanup();

  const sidebarEvents = [];
  const sidebarView = render(React.createElement(Sidebar, {
    label: "Operations nav",
    drawerOpen: true,
    groups: [{ key: "main", title: "Main", open: true, routes: [{ key: "dashboard", label: "Dashboard" }] }],
    collapseAction: { label: "Collapse navigation" },
    onExpandedChange: (ids, event) => sidebarEvents.push(["expanded", ids.join(","), event.type]),
    onDrawerOpenChange: (open, event) => sidebarEvents.push(["drawer", open, event.type]),
    onRouteSelect: (key, route, event) => sidebarEvents.push(["route", key, route.label, event.type]),
    onCollapse: (collapsed, event) => sidebarEvents.push(["collapse", collapsed, event.type]),
  }));
  fireEvent.click(sidebarView.getByRole("button", { name: /close navigation/i }));
  fireEvent.click(sidebarView.getByRole("button", { name: /collapse navigation/i }));
  fireEvent.click(sidebarView.getByRole("button", { name: /main/i }));
  fireEvent.click(sidebarView.getByRole("button", { name: /dashboard/i }));
  assert.deepEqual(sidebarEvents.map((event) => event[0]), ["drawer", "collapse", "expanded", "route"]);
  cleanup();

  const snackbarEvents = [];
  const snackbarView = render(React.createElement(SnackbarProvider, {
    messages: [{
      key: "sync",
      label: "Sync failed",
      actionLabel: "Retry sync",
      dismissible: true,
      dismissLabel: "Dismiss sync",
    }],
    action: { key: "queue", label: "Open queue" },
    onMessageAction: (key, event) => snackbarEvents.push(["message-action", key, event.type]),
    onMessageDismiss: (key, event) => snackbarEvents.push(["message-dismiss", key, event.type]),
    onQueueAction: (key, event) => snackbarEvents.push(["queue", key, event.type]),
  }));
  fireEvent.click(snackbarView.getByRole("button", { name: /retry sync/i }));
  fireEvent.click(snackbarView.getByRole("button", { name: /dismiss sync/i }));
  fireEvent.click(snackbarView.getByRole("button", { name: /open queue/i }));
  assert.deepEqual(snackbarEvents.map((event) => event[0]), ["message-action", "message-dismiss", "queue"]);
  cleanup();

  const tableEvents = [];
  const tableView = render(React.createElement(VirtualDataTable, {
    label: "Vehicles",
    columns: [{ key: "label", label: "Vehicle", sortable: true }],
    rows: [{ id: "mx-4821", label: "MX-4821" }],
    selectedKeys: ["mx-4821"],
    selection: { enabled: true, rowLabel: "Select vehicle" },
    bulkActions: [{ key: "assign", label: "Assign" }],
    page: 1,
    pageCount: 2,
    onAction: (key, event) => tableEvents.push(["action", key, event.type]),
    onRowSelect: (key, event) => tableEvents.push(["row", key, event.type]),
    onSortChange: (sort, event) => tableEvents.push(["sort", sort.key, sort.direction, event.type]),
    onPageChange: (page, event) => tableEvents.push(["page", page, event.type]),
    onBulkAction: (key, event) => tableEvents.push(["bulk", key, event.type]),
    selection: {
      enabled: true,
      rowLabel: "Select vehicle",
      onSelectionChange: (key, checked, meta, event) => tableEvents.push(["selection", key, checked, event.type]),
    },
  }));
  fireEvent.click(tableView.getByRole("button", { name: /^vehicle$/i }));
  fireEvent.click(tableView.getByLabelText(/select vehicle mx-4821/i));
  fireEvent.click(tableView.getByRole("button", { name: /assign/i }));
  fireEvent.click(tableView.getByRole("button", { name: /next page/i }));
  assert.deepEqual(tableEvents.map((event) => event[0]), ["sort", "row", "selection", "bulk", "page"]);
  cleanup();

  const stationEvents = [];
  const stationView = render(React.createElement(StationDiscovery, {
    query: "mx",
    stations: [{ id: "mx-4821", key: "mx-4821", label: "MX-4821", value: "MX-4821" }],
    search: { submitAction: { label: "Find station" } },
    action: { key: "refresh", label: "Refresh stations" },
    onQueryChange: (value, meta, event) => stationEvents.push(["query", value, event.type]),
    onStationSelect: (key, station, event) => stationEvents.push(["station", key, station.label, event.type]),
    onSubmit: (value, event) => stationEvents.push(["submit", value, event.type]),
    onAction: (key, event) => stationEvents.push(["action", key, event.type]),
  }));
  fireEvent.input(stationView.getByRole("searchbox", { name: /station discovery search/i }), { target: { value: "mx 4" } });
  fireEvent.click(stationView.getAllByRole("button", { name: /mx-4821/i })[0]);
  fireEvent.click(stationView.getByRole("button", { name: /find station/i }));
  fireEvent.click(stationView.getByRole("button", { name: /refresh stations/i }));
  assert.deepEqual(stationEvents.map((event) => event[0]), ["query", "station", "submit", "action"]);
  cleanup();

  const stationRouteEvents = [];
  const stationRouteView = render(React.createElement(StationDiscovery, {
    query: "mx",
    stations: [{ id: "mx-4821", key: "mx-4821", label: "MX-4821", value: "MX-4821" }],
    selectedStationKey: "mx-4821",
    route: {
      label: "Route to MX-4821",
      actions: [{ key: "route", label: "Route there", icon: "navigation" }],
    },
    onRouteAction: (key, action, event) => stationRouteEvents.push(["route-action", key, action.label, event.type]),
  }));
  fireEvent.click(stationRouteView.getByRole("button", { name: /route there/i }));
  assert.deepEqual(stationRouteEvents.map((event) => event[0]), ["route-action"]);
  cleanup();

  const statusEvents = [];
  const statusView = render(React.createElement(StatusFeedbackView, {
    kind: "toast",
    label: "Saved",
    action: { key: "undo", label: "Undo" },
    onAction: (key, event) => statusEvents.push(["action", key, event.type]),
    onDismissChange: (dismissed, event) => statusEvents.push(["dismiss", dismissed, event.type]),
  }));
  fireEvent.click(statusView.getByRole("button", { name: /undo/i }));
  fireEvent.click(statusView.getByRole("button", { name: /dismiss status feedback/i }));
  assert.deepEqual(statusEvents.map((event) => event[0]), ["action", "dismiss"]);
  assert.deepEqual(statusEvents[0].slice(1, 3), ["undo", "click"]);
  cleanup();

  const statusNotificationEvents = [];
  const statusNotificationView = render(React.createElement(StatusFeedbackView, {
    kind: "notifications",
    label: "Driver notifications",
    open: true,
    notifications: [{ key: "risk", label: "Risk review", unread: true }],
    onOpenChange: (open, event) => statusNotificationEvents.push(["open", open, event?.type ?? "unknown"]),
    onSelect: (key, event) => statusNotificationEvents.push(["select", key, event.type]),
  }));
  fireEvent.click(statusNotificationView.getAllByRole("button", { name: /risk review/i })[0]);
  fireEvent.click(statusNotificationView.getByRole("button", { name: /close notifications/i }));
  assert.deepEqual(statusNotificationEvents.map((event) => event[0]), ["select", "open"]);
  assert.deepEqual(statusNotificationEvents[0].slice(1, 3), ["risk", "click"]);
  assert.deepEqual(statusNotificationEvents[1].slice(1, 3), [false, "click"]);
  cleanup();

  const statusQueueEvents = [];
  const statusQueueView = render(React.createElement(StatusFeedbackView, {
    kind: "snackbar",
    label: "Queue",
    messages: [{ key: "saved", label: "Saved to queue", actionLabel: "Review queue" }],
    action: { key: "open-queue", label: "Open queue" },
    onMessageAction: (key, event) => statusQueueEvents.push(["message", key, event.type]),
    onMessageDismiss: (key, event) => statusQueueEvents.push(["dismiss", key, event.type]),
    onQueueAction: (key, event) => statusQueueEvents.push(["queue", key, event.type]),
  }));
  fireEvent.click(statusQueueView.getByRole("button", { name: /review queue/i }));
  fireEvent.click(statusQueueView.getByRole("button", { name: /dismiss notification/i }));
  fireEvent.click(statusQueueView.getByRole("button", { name: /open queue/i }));
  assert.deepEqual(statusQueueEvents.map((event) => event[0]), ["message", "dismiss", "queue"]);
  assert.deepEqual(statusQueueEvents[2].slice(1, 3), ["open-queue", "click"]);
  cleanup();

  const paymentEvents = [];
  const paymentView = render(React.createElement(PaymentForm, {
    label: "Card payment",
    density: "sm",
    cardNumber: { value: "" },
    expiry: { value: "" },
    securityCode: { value: "", revealable: true },
    amount: { value: "", currency: "MXN" },
    feedback: { kind: "toast", title: "Payment ready", action: { key: "review", label: "Review" } },
    submitAction: { key: "pay", label: "Pay now" },
    secondaryAction: { key: "cancel", label: "Cancel" },
    onCardNumberChange: (value, meta, event) => paymentEvents.push(["card-number", value, meta.validity, event.type]),
    onExpiryChange: (value, meta, event) => paymentEvents.push(["expiry", value, meta.validity, event.type]),
    onSecurityCodeChange: (value, meta, event) => paymentEvents.push(["security-code", value, meta.complete, event.type]),
    onAmountChange: (value, meta, event) => paymentEvents.push(["amount", value, meta.currency, event.type]),
    onFeedbackAction: (key, event) => paymentEvents.push(["feedback", key, event.type]),
    onSecondaryAction: (key, event) => paymentEvents.push(["secondary", key, event.type]),
    onSubmit: (key, event) => paymentEvents.push(["submit", key, event.type]),
  }));
  fireEvent.change(paymentView.getByLabelText(/card number/i), { target: { value: "4242 4242 4242 4242" } });
  fireEvent.change(paymentView.getByLabelText(/expiry date/i), { target: { value: "12/28" } });
  fireEvent.change(paymentView.getByLabelText(/security code/i), { target: { value: "123" } });
  fireEvent.change(paymentView.getByLabelText(/amount/i), { target: { value: "820.00" } });
  fireEvent.click(paymentView.getByRole("button", { name: /review/i }));
  fireEvent.click(paymentView.getByRole("button", { name: /cancel/i }));
  fireEvent.click(paymentView.getByRole("button", { name: /pay now/i }));
  assert.deepEqual(paymentEvents.map((event) => event[0]), ["card-number", "expiry", "security-code", "amount", "feedback", "secondary", "submit"]);
  assert.deepEqual(paymentEvents[0].slice(1, 4), ["4242424242424242", "valid", "change"]);
  assert.deepEqual(paymentEvents[3].slice(1, 4), ["820.00", "MXN", "change"]);
  assert.deepEqual(paymentEvents[6].slice(1, 3), ["pay", "click"]);
  cleanup();

  const timelineEvents = [];
  const timelineView = render(React.createElement(Timeline, {
    label: "Audit timeline",
    filtered: true,
    events: [{ key: "created", label: "Created", timestamp: "09:00" }],
    filters: [{ key: "status", label: "Status" }],
    onEventSelect: (key, event) => timelineEvents.push(["event", key, event.type]),
    onFilterRemove: (key, event) => timelineEvents.push(["filter", key, event.type]),
    onClear: (event) => timelineEvents.push(["clear", event.type]),
  }));
  fireEvent.click(timelineView.getByRole("button", { name: /remove status/i }));
  fireEvent.click(timelineView.getByRole("button", { name: /clear filters/i }));
  fireEvent.click(timelineView.getByRole("button", { name: /created/i }));
  assert.deepEqual(timelineEvents.map((event) => event[0]), ["filter", "clear", "event"]);
  cleanup();

  const topbarEvents = [];
  const topbarView = render(React.createElement(Topbar, {
    mobile: true,
    sidebar: {
      drawerOpen: true,
      onDrawerOpenChange: (open, event) => topbarEvents.push(["drawer", open, event.type]),
    },
  }));
  fireEvent.click(topbarView.getAllByRole("button", { name: /close navigation/i })[0]);
  assert.deepEqual(topbarEvents.map((event) => event[0]), ["drawer"]);
  cleanup();

  const transferEvents = [];
  const transferView = render(React.createElement(TransferList, {
    label: "Assign drivers",
    source: [{ key: "ana", label: "Ana" }],
    target: [{ key: "luis", label: "Luis" }],
    selectedSourceKeys: ["ana"],
    selectedTargetKeys: ["luis"],
    onSourceSelect: (key, event) => transferEvents.push(["source", key, event.type]),
    onTargetSelect: (key, event) => transferEvents.push(["target", key, event.type]),
    onItemCheckedChange: (side, key, checked, meta, event) => transferEvents.push(["checked", side, key, checked, event.type]),
  }));
  fireEvent.click(transferView.getByRole("button", { name: /ana/i }));
  fireEvent.click(transferView.getByRole("button", { name: /luis/i }));
  fireEvent.click(transferView.getByRole("checkbox", { name: /^ana$/i }));
  assert.deepEqual(transferEvents.map((event) => event[0]), ["source", "target", "checked"]);
  cleanup();

  const actionSheetDelegatedEvents = [];
  const actionSheetDelegatedView = render(React.createElement(ActionSheet, {
    label: "Delegated actions",
    actions: [{ key: "pin", label: "Pin" }],
    overflow: {
      triggerLabel: "More delegated actions",
      items: [{ key: "share", label: "Share" }],
      onSelect: (item, event) => actionSheetDelegatedEvents.push(["overflow-select", item.key, event.type]),
    },
    onSelect: (key, event) => actionSheetDelegatedEvents.push(["select", key, event.type]),
    onAction: (key, event) => actionSheetDelegatedEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(actionSheetDelegatedView.getByRole("button", { name: /more delegated actions/i }));
  fireEvent.click(actionSheetDelegatedView.getByRole("menuitem", { name: /share/i }));
  assert.deepEqual(actionSheetDelegatedEvents.map((event) => event[0]), ["overflow-select", "action"]);
  cleanup();

  const authenticationEvents = [];
  const authenticationView = render(React.createElement(AuthenticationLoginBiometricsAndOtp, {
    primaryAction: { label: "Continue authentication" },
    recovery: { action: { key: "recover", label: "Recover account" } },
    otpInvalid: true,
    onSubmit: (event) => authenticationEvents.push(["submit", event.type]),
    onRecover: (key, event) => authenticationEvents.push(["recover", key, event.type]),
  }));
  fireEvent.click(authenticationView.getByRole("button", { name: /continue authentication/i }));
  fireEvent.click(authenticationView.getByRole("button", { name: /recover account/i }));
  assert.deepEqual(authenticationEvents.map((event) => event[0]), ["submit", "recover"]);
  cleanup();

  const autocompleteEmptyEvents = [];
  const autocompleteEmptyView = render(React.createElement(Autocomplete, {
    label: "Empty autocomplete",
    suggestions: [],
    empty: {
      action: { key: "create", label: "Create suggestion" },
      onAction: (key, event) => autocompleteEmptyEvents.push(["action", key, event.type]),
    },
  }));
  fireEvent.click(autocompleteEmptyView.getByRole("button", { name: /create suggestion/i }));
  assert.deepEqual(autocompleteEmptyEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const avatarActionEvents = [];
  const avatarActionView = render(React.createElement(AvatarGroup, {
    label: "Avatar actions",
    identities: [{ key: "ana", name: "Ana" }],
    action: { key: "invite", label: "Invite person" },
    onAction: (key, event) => avatarActionEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(avatarActionView.getByRole("button", { name: /invite person/i }));
  assert.deepEqual(avatarActionEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const avatarMenuEvents = [];
  const avatarMenuView = render(React.createElement(AvatarMenu, {
    name: "Ana Torres",
    open: false,
    items: [{ key: "profile", label: "Profile" }],
    onOpenChange: (open, event) => avatarMenuEvents.push(["open", open, event.type]),
    onSelect: (item, event) => avatarMenuEvents.push(["select", item.key, event.type]),
  }));
  fireEvent.click(avatarMenuView.getByRole("button", { name: /ana torres account menu/i }));
  fireEvent.click(avatarMenuView.getByRole("menuitem", { name: /profile/i, hidden: true }));
  assert.deepEqual(avatarMenuEvents.map((event) => event[0]), ["open", "select", "open"]);
  cleanup();

  const calendarActionEvents = [];
  const calendarActionView = render(React.createElement(CalendarView, {
    label: "Action calendar",
    events: [{ key: "dispatch", label: "Dispatch", time: "10:00" }],
    actions: [{ key: "export", label: "Export calendar" }],
    onAction: (key, event) => calendarActionEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(calendarActionView.getByRole("button", { name: /export calendar/i }));
  assert.deepEqual(calendarActionEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const chartEvents = [];
  const chartView = render(React.createElement(ChartWrapper, {
    label: "Route chart",
    chart: { type: "bar" },
    primaryAction: { key: "inspect", label: "Inspect chart" },
    onAction: (key, event) => chartEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(chartView.getByRole("button", { name: /inspect chart/i }));
  assert.deepEqual(chartEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const ganttEvents = [];
  const ganttView = render(React.createElement(GanttChart, {
    label: "Launch schedule",
    tasks: [{ key: "task-1", label: "Design review", start: "2026-08-01", end: "2026-08-04" }],
    primaryAction: { key: "inspect", label: "Inspect schedule" },
    onAction: (key, event) => ganttEvents.push(["action", key, event.type]),
    onTaskSelect: (key, event) => ganttEvents.push(["task", key, event.type]),
  }));
  fireEvent.click(ganttView.getByRole("button", { name: /inspect schedule/i }));
  fireEvent.click(ganttView.getByText("Design review"));
  assert.deepEqual(ganttEvents.map((event) => event[0]), ["action", "task"]);
  cleanup();

  const waterfallEvents = [];
  const waterfallView = render(React.createElement(WaterfallChart, {
    label: "Margin bridge",
    steps: [{ key: "fuel", label: "Fuel variance", value: -12 }],
    primaryAction: { key: "inspect", label: "Inspect bridge" },
    onAction: (key, event) => waterfallEvents.push(["action", key, event.type]),
    onStepSelect: (key, event) => waterfallEvents.push(["step", key, event.type]),
  }));
  fireEvent.click(waterfallView.getByRole("button", { name: /inspect bridge/i }));
  fireEvent.click(waterfallView.getByText("Fuel variance"));
  assert.deepEqual(waterfallEvents.map((event) => event[0]), ["action", "step"]);
  cleanup();

  const polarEvents = [];
  const polarView = render(React.createElement(PolarChart, {
    label: "Risk distribution",
    segments: [{ key: "fuel", label: "Fuel risk", value: 42 }],
    primaryAction: { key: "inspect", label: "Inspect distribution" },
    onAction: (key, event) => polarEvents.push(["action", key, event.type]),
    onSegmentSelect: (key, event) => polarEvents.push(["segment", key, event.type]),
  }));
  fireEvent.click(polarView.getByRole("button", { name: /inspect distribution/i }));
  fireEvent.click(polarView.getByText("Fuel risk"));
  assert.deepEqual(polarEvents.map((event) => event[0]), ["action", "segment"]);
  cleanup();

  const columnDelegatedEvents = [];
  const columnDelegatedView = render(React.createElement(ColumnConfigurator, {
    columns: [{ key: "plate", label: "Plate", visible: true }],
    rows: [{ id: "mx-1", plate: "MX-1" }],
    surface: { mode: "menu", triggerLabel: "Open column menu" },
    applyAction: {
      key: "apply",
      label: "Apply columns",
      onClick: (event) => columnDelegatedEvents.push(["click", event.type]),
    },
    onOpenChange: (open, event) => columnDelegatedEvents.push(["open", open, event.type]),
    onAction: (key, event) => columnDelegatedEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(columnDelegatedView.getByRole("button", { name: /open column menu/i }));
  fireEvent.click(columnDelegatedView.getByRole("menuitem", { name: /apply columns/i, hidden: true }));
  assert.deepEqual(columnDelegatedEvents.map((event) => event[0]), ["open", "click", "action", "open"]);
  cleanup();

  const commandEmptyEvents = [];
  const commandEmptyView = render(React.createElement(CommandPalette, {
    label: "Empty command palette",
    open: true,
    query: "missing",
    commands: [],
    empty: {
      action: { key: "request", label: "Request command" },
      onAction: (key, event) => commandEmptyEvents.push(["action", key, event.type]),
    },
  }));
  fireEvent.click(commandEmptyView.getByRole("button", { name: /request command/i }));
  assert.deepEqual(commandEmptyEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const dragDelegatedEvents = [];
  const dragDelegatedView = render(React.createElement(DragSortableList, {
    items: [{ key: "first", label: "First" }, { key: "second", label: "Second" }],
    selectedKey: "first",
    saveAction: { label: "Save order" },
    resetAction: { label: "Reset order" },
    onSelect: (key, event) => dragDelegatedEvents.push(["select", key, event.type]),
    onSave: (event) => dragDelegatedEvents.push(["save", event.type]),
    onReset: (event) => dragDelegatedEvents.push(["reset", event.type]),
  }));
  fireEvent.click(dragDelegatedView.getByRole("button", { name: /second2 of 2/i }));
  fireEvent.click(dragDelegatedView.getByRole("button", { name: /save order/i }));
  fireEvent.click(dragDelegatedView.getByRole("button", { name: /reset order/i }));
  assert.deepEqual(dragDelegatedEvents.map((event) => event[0]), ["select", "save", "reset"]);
  cleanup();

  const drawerAdapterEvents = [];
  const drawerAdapterView = render(React.createElement(DrawerAdapter, {
    label: "Drawer adapter callbacks",
    drawer: { triggerLabel: "Open adapter drawer" },
    actions: [{ key: "apply", label: "Apply drawer" }],
    onOpenChange: (open, event) => drawerAdapterEvents.push(["open", open, event.type]),
    onAction: (key, event) => drawerAdapterEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(drawerAdapterView.getByRole("button", { name: /open adapter drawer/i }));
  fireEvent.click(drawerAdapterView.getByRole("button", { name: /apply drawer/i }));
  assert.deepEqual(drawerAdapterEvents.map((event) => event[0]), ["open", "action"]);
  cleanup();

  const adminDelegatedEvents = [];
  const adminDelegatedView = render(React.createElement(DriverAndVehicleAdministration, {
    records: [{ id: "mx-4821", name: "MX-4821", status: "active" }],
    actions: [{ key: "suspend", label: "Suspend driver" }],
    onRowSelect: (key, event) => adminDelegatedEvents.push(["row", key, event.type]),
    onAction: (key, event) => adminDelegatedEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(adminDelegatedView.getByRole("row", { name: /mx-4821 record active/i }));
  fireEvent.click(adminDelegatedView.getByRole("button", { name: /suspend driver/i }));
  assert.deepEqual(adminDelegatedEvents.map((event) => event[0]), ["row", "action"]);
  cleanup();

  const driverOnboardingEvents = [];
  const driverOnboardingView = render(React.createElement(DriverOnboardingMobile, {
    primaryAction: { label: "Submit onboarding" },
    onSubmit: (event) => driverOnboardingEvents.push(["submit", event.type]),
  }));
  fireEvent.click(driverOnboardingView.getByRole("button", { name: /submit onboarding/i }));
  assert.deepEqual(driverOnboardingEvents.map((event) => event[0]), ["submit"]);
  cleanup();

  const filterEmptyEvents = [];
  const filterEmptyView = render(React.createElement(FilterChipGroup, {
    filters: [],
    empty: {
      action: { key: "add", label: "Add filter" },
      onAction: (key, event) => filterEmptyEvents.push(["action", key, event.type]),
    },
  }));
  fireEvent.click(filterEmptyView.getByRole("button", { name: /add filter/i }));
  assert.deepEqual(filterEmptyEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const fleetActionEvents = [];
  const fleetActionView = render(React.createElement(FleetManagerOnboardingDesktop, {
    tasks: [{ key: "profile", label: "Profile setup" }],
    primaryAction: { key: "continue", label: "Continue setup" },
    onAction: (key, event) => fleetActionEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(fleetActionView.getByRole("button", { name: /continue setup/i }));
  assert.deepEqual(fleetActionEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const helpRouteEvents = [];
  const helpRouteView = render(React.createElement(HelpCenter, {
    label: "Help route center",
    topics: [{ key: "billing", label: "Billing" }],
    articles: [{ id: "billing", title: "Billing help", topic: "Billing" }],
    sidebar: {
      groups: [{ title: "Help", routes: [{ key: "billing", label: "Billing route" }] }],
      onRouteSelect: (key, route, event) => helpRouteEvents.push(["route", key, route.label, event.type]),
    },
    onRouteSelect: (key, route, event) => helpRouteEvents.push(["root-route", key, route.label, event.type]),
  }));
  fireEvent.click(helpRouteView.getByRole("button", { name: /billing route/i, hidden: true }));
  assert.deepEqual(helpRouteEvents.map((event) => event[0]), ["route", "root-route"]);
  cleanup();

  const kpiEvents = [];
  const kpiView = render(React.createElement(KpiCard, {
    label: "Availability",
    value: "96",
    action: { key: "review", label: "Review KPI" },
    onSelect: (event) => kpiEvents.push(["select", event.type]),
    onAction: (key, event) => kpiEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(kpiView.getByRole("button", { name: /availability/i }));
  fireEvent.click(kpiView.getByRole("button", { name: /review kpi/i }));
  assert.deepEqual(kpiEvents.map((event) => event[0]), ["select", "action"]);
  cleanup();

  const multiSelectEvents = [];
  const multiSelectView = render(React.createElement(MultiSelect, {
    label: "Regions",
    open: false,
    value: ["north"],
    options: [{ label: "North", value: "north" }, { label: "South", value: "south" }],
    clearAction: { label: "Clear regions" },
    onOpenChange: (open, event) => multiSelectEvents.push(["open", open, event.type]),
    onValueChange: (values, meta, event) => multiSelectEvents.push(["value", values.join(","), event.type]),
    onRemove: (value, event) => multiSelectEvents.push(["remove", value, event.type]),
    onClear: (event) => multiSelectEvents.push(["clear", event.type]),
  }));
  fireEvent.click(multiSelectView.getByRole("combobox", { name: /regions/i }));
  fireEvent.click(multiSelectView.getByRole("checkbox", { name: /south/i }));
  fireEvent.click(multiSelectView.getByRole("button", { name: /remove north/i }));
  fireEvent.click(multiSelectView.getByRole("button", { name: /clear regions/i }));
  assert.deepEqual(multiSelectEvents.map((event) => event[0]), ["open", "value", "remove", "value", "clear", "value"]);
  cleanup();

  const notificationActionEvents = [];
  const notificationActionView = render(React.createElement(NotificationPanel, {
    open: true,
    notifications: [{ key: "sync", label: "Sync failed" }],
    error: {
      action: { key: "retry", label: "Retry notification" },
      onAction: (key, event) => notificationActionEvents.push(["action", key, event.type]),
    },
  }));
  fireEvent.click(notificationActionView.getByRole("button", { name: /retry notification/i }));
  assert.deepEqual(notificationActionEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const quickActionEvents = [];
  const quickActionView = render(React.createElement(QuickActionsGrid, {
    actions: [{ key: "dispatch", label: "Dispatch now" }],
    onAction: (key, action, event) => quickActionEvents.push(["action", key, action.label, event.type]),
  }));
  fireEvent.click(quickActionView.getByRole("button", { name: /dispatch now/i }));
  assert.deepEqual(quickActionEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const searchEmptyEvents = [];
  const searchEmptyView = render(React.createElement(Search, {
    label: "Empty search",
    query: "missing",
    results: [],
    empty: {
      action: { key: "create", label: "Create result" },
      onAction: (key, event) => searchEmptyEvents.push(["action", key, event.type]),
    },
  }));
  fireEvent.click(searchEmptyView.getByRole("button", { name: /create result/i }));
  assert.deepEqual(searchEmptyEvents.map((event) => event[0]), ["action"]);
  cleanup();

  const settingsDialogEvents = [];
  const settingsDialogView = render(React.createElement(Settings, {
    dirty: true,
    groups: [{ key: "profile", title: "Profile", controls: [] }],
    confirmation: {
      label: "Confirm settings",
      open: true,
      closeLabel: "Close settings dialog",
      actions: [{ key: "apply", label: "Apply settings" }],
      onOpenChange: (open, event) => settingsDialogEvents.push(["open", open, event.type]),
      onAction: (key, event) => settingsDialogEvents.push(["action", key, event.type]),
    },
  }));
  fireEvent.click(settingsDialogView.getByRole("button", { name: /close settings dialog/i }));
  fireEvent.click(settingsDialogView.getByRole("button", { name: /apply settings/i }));
  assert.deepEqual(settingsDialogEvents.map((event) => event[0]), ["open", "action", "open"]);
  cleanup();

  const swipeEvents = [];
  const swipeView = render(React.createElement(SwipeActions, {
    revealed: true,
    actions: [{
      key: "archive",
      label: "Archive item",
      onFallbackClick: (event) => swipeEvents.push(["fallback", event.type]),
    }],
    onAction: (key, action, event) => swipeEvents.push(["action", key, action.label, event.type]),
  }));
  fireEvent.click(swipeView.getAllByRole("button", { name: /archive item/i })[0]);
  fireEvent.click(swipeView.getByRole("button", { name: /archive item without swipe/i }));
  assert.deepEqual(swipeEvents.map((event) => event[0]), ["action", "fallback"]);
  cleanup();

  const topbarDelegatedEvents = [];
  const topbarDelegatedView = render(React.createElement(Topbar, {
    search: {
      label: "Global search",
      query: "",
      onQueryChange: (value, meta, event) => topbarDelegatedEvents.push(["query", value, event.type]),
    },
    account: {
      name: "Ana Torres",
      open: false,
      items: [{ key: "profile", label: "Profile" }],
      onOpenChange: (open, event) => topbarDelegatedEvents.push(["account-open", open, event.type]),
      onSelect: (item, event) => topbarDelegatedEvents.push(["account-select", item.key, event.type]),
    },
  }));
  fireEvent.input(topbarDelegatedView.getByRole("searchbox", { name: /global search/i }), { target: { value: "route" } });
  fireEvent.click(topbarDelegatedView.getByRole("button", { name: /ana torres menu/i }));
  fireEvent.click(topbarDelegatedView.getByRole("menuitem", { name: /profile/i, hidden: true }));
  assert.deepEqual(topbarDelegatedEvents.map((event) => event[0]), ["query", "account-open", "account-select", "account-open"]);
  cleanup();

  const denseListEvents = [];
  const denseListView = render(React.createElement(DenseOperationalList, {
    label: "Accounts operations",
    selectedKeys: ["acct-1"],
    filters: [{ key: "risk", label: "Risk review" }],
    resultCount: 1,
    search: { query: "", placeholder: "Search accounts" },
    toolbar: {
      overflow: {
        triggerLabel: "More list actions",
        items: [{ key: "columns", label: "Columns" }],
      },
    },
    bulkActions: {
      actions: [{ key: "assign", label: "Assign reviewer" }],
    },
    table: {
      columns: [
        { key: "label", label: "Account", sortable: true },
        { key: "status", label: "Status" },
      ],
      rows: [{ id: "acct-1", label: "Ana Torres", status: "Review" }],
      page: 1,
      pageCount: 2,
    },
    feedback: {
      kind: "toast",
      title: "List synced",
      action: { key: "review", label: "Review now" },
    },
    onSearchChange: (value, event) => denseListEvents.push(["search", value, event.type]),
    onFilterRemove: (key, event) => denseListEvents.push(["filter-remove", key, event.type]),
    onFiltersReset: (event) => denseListEvents.push(["filters-reset", event.type]),
    onSortChange: (sort, event) => denseListEvents.push(["sort", sort.key, sort.direction, event.type]),
    onRowSelect: (key, event) => denseListEvents.push(["row", key, event.type]),
    onPageChange: (page, event) => denseListEvents.push(["page", String(page), event.type]),
    onBulkAction: (key, event) => denseListEvents.push(["bulk", key, event.type]),
    onToolbarOverflowSelect: (item, event) => denseListEvents.push(["overflow", item.key, event.type]),
    onFeedbackAction: (key, event) => denseListEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.input(denseListView.getByRole("searchbox", { name: /accounts operations search/i }), { target: { value: "ana" } });
  fireEvent.click(denseListView.getByRole("button", { name: /remove risk review/i }));
  fireEvent.click(denseListView.getByRole("button", { name: /reset filters/i }));
  fireEvent.click(denseListView.getByRole("button", { name: /account/i }));
  fireEvent.click(denseListView.container.querySelector("tbody tr[data-key='acct-1']"));
  fireEvent.click(denseListView.getByRole("button", { name: /page 2/i }));
  fireEvent.click(denseListView.getByRole("button", { name: /assign reviewer/i }));
  fireEvent.click(denseListView.getByRole("button", { name: /more list actions/i }));
  fireEvent.click(denseListView.getByRole("menuitem", { name: /columns/i, hidden: true }));
  fireEvent.click(denseListView.getByRole("button", { name: /review now/i }));
  assert.deepEqual(denseListEvents.map((event) => event[0]), [
    "search",
    "filter-remove",
    "filters-reset",
    "sort",
    "row",
    "page",
    "bulk",
    "overflow",
    "feedback",
  ]);
  cleanup();

  const conversationEvents = [];
  const conversationView = render(React.createElement(AgentConversation, {
    label: "Agent support",
    handoff: {
      active: true,
      action: { key: "join", label: "Join handoff" },
    },
    thread: {
      messages: [{
        key: "m1",
        author: "agent",
        body: "Try again.",
        action: { label: "Retry answer" },
      }],
    },
    composer: {
      defaultValue: "",
      attachLabel: "Attach file",
      sendLabel: "Send message",
    },
    onMessageAction: (key, event) => conversationEvents.push(["message", key, event.type]),
    onComposerChange: (value, meta, event) => conversationEvents.push(["change", value, event.type]),
    onAttach: (event) => conversationEvents.push(["attach", event.type]),
    onSend: (value, event) => conversationEvents.push(["send", value, event.type]),
    onHandoffAction: (key, event) => conversationEvents.push(["handoff", key, event.type]),
    onFeedbackAction: (key, event) => conversationEvents.push(["feedback", key, event.type]),
  }));
  fireEvent.click(conversationView.getByRole("button", { name: /retry answer/i }));
  fireEvent.input(conversationView.getByRole("textbox", { name: /agent support message/i }), { target: { value: "Please escalate" } });
  fireEvent.click(conversationView.getByRole("button", { name: /attach file/i }));
  fireEvent.click(conversationView.getByRole("button", { name: /send message/i }));
  fireEvent.click(conversationView.getByRole("button", { name: /join handoff/i }));
  assert.deepEqual(conversationEvents.map((event) => event[0]), [
    "message",
    "change",
    "attach",
    "send",
    "handoff",
    "feedback",
  ]);
  cleanup();

  const bottomSheetEvents = [];
  const bottomSheetView = render(React.createElement(BottomSheet, {
    label: "Mobile actions",
    triggerLabel: "Open mobile actions",
    items: [{ key: "route", label: "Route details" }],
    actions: [{ key: "confirm", label: "Confirm action" }],
    onOpenChange: (open, event) => bottomSheetEvents.push(["open", open, event.type]),
    onAction: (key, event) => bottomSheetEvents.push(["action", key, event.type]),
    onSelect: (item, event) => bottomSheetEvents.push(["select", item.key, event.type]),
  }));
  fireEvent.click(bottomSheetView.getByRole("button", { name: /open mobile actions/i }));
  fireEvent.click(bottomSheetView.getAllByRole("button", { name: /route details/i }).at(-1));
  fireEvent.click(bottomSheetView.getAllByRole("button", { name: /confirm action/i }).at(-1));
  assert.deepEqual(bottomSheetEvents.map((event) => event[0]), ["open", "select", "action"]);
  cleanup();

  const checkboxGroupEvents = [];
  const checkboxGroupView = render(React.createElement(CheckboxGroup, {
    label: "Notification channels",
    defaultValue: ["email"],
    selectAllLabel: "Select all channels",
    clearLabel: "Clear channels",
    applyAction: { label: "Apply channels" },
    options: [
      { value: "email", label: "Email" },
      { value: "sms", label: "SMS" },
    ],
    onValueChange: (value, meta, event) => checkboxGroupEvents.push(["value", value.join(","), meta.value, event.type]),
    onClear: (event) => checkboxGroupEvents.push(["clear", event.type]),
    onApply: (value, event) => checkboxGroupEvents.push(["apply", value.join(","), event.type]),
  }));
  fireEvent.click(checkboxGroupView.getByRole("checkbox", { name: /^sms$/i }));
  fireEvent.click(checkboxGroupView.getByRole("button", { name: /apply channels/i }));
  fireEvent.click(checkboxGroupView.getByRole("button", { name: /clear channels/i }));
  assert.deepEqual(checkboxGroupEvents.map((event) => event[0]), ["value", "apply", "clear", "value"]);
  cleanup();

  const radioGroupEvents = [];
  const radioGroupView = render(React.createElement(RadioGroup, {
    label: "Default payout",
    defaultValue: "bank",
    clearLabel: "Clear payout",
    applyAction: { label: "Apply payout" },
    options: [
      { value: "bank", label: "Bank account" },
      { value: "card", label: "Card wallet" },
    ],
    onValueChange: (value, meta, event) => radioGroupEvents.push(["value", value, meta.value, event.type]),
    onClear: (event) => radioGroupEvents.push(["clear", event.type]),
    onApply: (value, event) => radioGroupEvents.push(["apply", value, event.type]),
  }));
  fireEvent.click(radioGroupView.getByRole("radio", { name: /card wallet/i }));
  fireEvent.click(radioGroupView.getByRole("button", { name: /apply payout/i }));
  fireEvent.click(radioGroupView.getByRole("button", { name: /clear payout/i }));
  assert.deepEqual(radioGroupEvents.map((event) => event[0]), ["value", "apply", "clear", "value"]);
  cleanup();

  console.log("react pattern interaction tests passed");
} finally {
  cleanup();
}
