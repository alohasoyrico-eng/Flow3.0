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

  const onThisPageNavEvents = [];
  const onThisPageNavView = render(React.createElement(OnThisPageNav, {
    items: [{ id: "overview", label: "Overview", active: true, badge: "2", onClick: (event) => onThisPageNavEvents.push(["item", event.type]) }],
  }));
  fireEvent.click(onThisPageNavView.getByRole("button", { name: /overview/i }));
  assert.deepEqual(onThisPageNavEvents, [["item", "click"]]);
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
    onChange: (files, event) => fileUploadEvents.push(["change", files.map((file) => file.name).join(","), event?.type ?? "programmatic"]),
    onRemove: (key, event) => fileUploadEvents.push(["remove", key, event.type]),
    onRetry: (event) => fileUploadEvents.push(["retry", event.type]),
  }));
  fireEvent.click(fileUploadView.getByRole("button", { name: /choose file/i }));
  fireEvent.change(fileUploadView.container.querySelector('input[type="file"]'), {
    target: { files: [new window.File(["pdf"], "license.pdf", { type: "application/pdf" })] },
  });
  fireEvent.click(fileUploadView.getByRole("button", { name: /remove file/i }));
  fireEvent.click(fileUploadView.getByRole("button", { name: /retry upload/i }));
  assert.deepEqual(fileUploadEvents.map((event) => event[0]), ["choose", "change", "change", "remove", "retry"]);
  assert.deepEqual(fileUploadEvents[1], ["change", "license.pdf", "change"]);
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
    fields: [
      {
        key: "plate",
        label: "Plate",
        value: "MX-4821",
        onValueChange: (value, meta, event) => formSectionEvents.push(["field-slot", value, event.type]),
      },
      {
        key: "fleet",
        kind: "select",
        label: "Fleet",
        value: "north",
        options: [{ value: "north", label: "North" }, { value: "south", label: "South" }],
        onOpenChange: (open, event) => formSectionEvents.push(["field-open", open, event.type]),
      },
      {
        key: "active",
        kind: "checkbox",
        label: "Active vehicle",
        value: "active",
        checked: false,
        onCheckedChange: (checked, meta, event) => formSectionEvents.push(["field-checked", checked, meta.value, event.type]),
      },
      {
        key: "more",
        kind: "icon-button",
        label: "More vehicle actions",
        icon: "more_horiz",
        onClick: (event) => formSectionEvents.push(["field-click", event.type]),
      },
    ],
    primaryAction: { key: "save", label: "Save vehicle" },
    onFieldValueChange: (key, value, meta, event) => formSectionEvents.push(["field", key, value, event.type]),
    onAction: (key, event) => formSectionEvents.push(["action", key, event.type]),
  }));
  fireEvent.input(formSectionView.getByLabelText(/plate/i), { target: { value: "MX-9000" } });
  fireEvent.click(formSectionView.getByRole("combobox", { name: /fleet/i }));
  fireEvent.click(formSectionView.getByRole("checkbox", { name: /active vehicle/i }));
  fireEvent.click(formSectionView.getByRole("button", { name: /more vehicle actions/i }));
  fireEvent.click(formSectionView.getByRole("button", { name: /save vehicle/i }));
  assert.deepEqual(formSectionEvents.map((event) => event[0]), [
    "field-slot",
    "field",
    "field-open",
    "field-checked",
    "field",
    "field-click",
    "action",
    "action",
  ]);
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
    onOpenChange: (open, event) => selectLayerEvents.push(["open", open, event.type]),
    onValueChange: (value, meta, event) => selectLayerEvents.push(["value", value, event.type]),
    onAction: (key, event) => selectLayerEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(selectLayerView.getByRole("combobox", { name: /assign station/i }));
  fireEvent.click(selectLayerView.getByRole("option", { name: /south/i }));
  fireEvent.click(selectLayerView.getByRole("button", { name: /apply station/i }));
  assert.deepEqual(selectLayerEvents.map((event) => event[0]), ["open", "open", "value", "action"]);
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


  console.log("react pattern forms search interaction tests passed");
} finally {
  cleanup();
  dom.window.close();
}
