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
  fireEvent.click(sidebarView.getByRole("button", { name: /collapse navigation/i }));
  fireEvent.click(sidebarView.getByRole("button", { name: /main/i }));
  fireEvent.click(sidebarView.getByRole("button", { name: /dashboard/i }));
  assert.deepEqual(sidebarEvents.map((event) => event[0]), ["collapse", "expanded", "route"]);
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


  console.log("react pattern panels status interaction tests passed");
} finally {
  cleanup();
  dom.window.close();
}
