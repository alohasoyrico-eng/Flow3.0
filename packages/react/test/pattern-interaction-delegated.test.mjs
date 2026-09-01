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

  const chartLegendEvents = [];
  const chartLegendView = render(React.createElement(ChartLegendItem, {
    label: "Fuel spend",
    value: "$84.2k",
    selected: true,
    action: { key: "pin", label: "Pin series" },
    onToggle: (checked, meta, event) => chartLegendEvents.push(["toggle", checked, meta.label, event.type]),
    onAction: (key, event) => chartLegendEvents.push(["action", key, event.type]),
  }));
  fireEvent.click(chartLegendView.getByRole("checkbox", { name: /fuel spend/i }));
  fireEvent.click(chartLegendView.getByRole("button", { name: /pin series/i }));
  assert.deepEqual(chartLegendEvents.map((event) => event[0]), ["toggle", "action"]);
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
      results: [{ key: "route", label: "Route result" }],
      onQueryChange: (value, meta, event) => topbarDelegatedEvents.push(["query", value, event.type]),
      onResultSelect: (key, event) => topbarDelegatedEvents.push(["result", key, event.type]),
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
  fireEvent.click(topbarDelegatedView.getByRole("button", { name: /route result/i }));
  fireEvent.click(topbarDelegatedView.getByRole("button", { name: /ana torres menu/i }));
  fireEvent.click(topbarDelegatedView.getByRole("menuitem", { name: /profile/i, hidden: true }));
  assert.deepEqual(topbarDelegatedEvents.map((event) => event[0]), ["query", "result", "account-open", "account-select", "account-open"]);
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

  console.log("react pattern delegated interaction tests passed");
} finally {
  cleanup();
  dom.window.close();
}
