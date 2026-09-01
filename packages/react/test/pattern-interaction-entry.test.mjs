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
  assert.deepEqual(autocompleteEvents.map((event) => event[0]), ["open", "value", "value"]);
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


  console.log("react pattern entry interaction tests passed");
} finally {
  cleanup();
  dom.window.close();
}
