import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const { Accordion, Breadcrumbs, Card, CardExpiryInput, CardNumberInput, CardSecurityCodeInput, ChatComposer, ChatMessage, ChatThread, Checkbox, Chip, CodeBlock, CodeInput, Combobox, CountrySelector, DatePicker, DateRangePicker, Dialog, Drawer, EmptyState, ErrorPanel, Input, InputAmount, KpiTile, List, Menu, MovementRow, Pagination, PhoneInput, Popover, RadioButton, RouteSummary, SegmentedControl, Select, Slider, StationPin, Switch, Table, Tabs, TextArea, Toast, Tooltip, TreeView } = await import("../dist/index.js");

try {
  const stationSelections = [];
  const stationClicks = [];
  const { getByRole: getStationRole, rerender: rerenderStation } = render(React.createElement(StationPin, {
    label: "Station 24",
    value: "Open",
    meta: "2.4 km",
    variant: "ev",
    onClick: (event) => stationClicks.push(event.type),
    onSelect: (meta, event) => stationSelections.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getStationRole("button", { name: /station 24/i }));
  assert.deepEqual(stationClicks, ["click"]);
  assert.deepEqual(stationSelections, [{ meta: { label: "Station 24", value: "Open", variant: "ev", state: "default" }, eventType: "click" }]);

  rerenderStation(React.createElement(StationPin, {
    label: "Station 24",
    value: "Open",
    unavailable: true,
    onClick: (event) => stationClicks.push(event.type),
    onSelect: (meta, event) => stationSelections.push({ meta, eventType: event.type }),
  }));

  fireEvent.click(getStationRole("button", { name: /station 24/i }));
  assert.deepEqual(stationClicks, ["click"]);
  assert.deepEqual(stationSelections, [{ meta: { label: "Station 24", value: "Open", variant: "ev", state: "default" }, eventType: "click" }]);

  cleanup();

  const preventedStationSelections = [];
  const { getByRole: getPreventedStationRole } = render(React.createElement(StationPin, {
    label: "Station 25",
    value: "Closed",
    onClick: (event) => event.preventDefault(),
    onSelect: (meta) => preventedStationSelections.push(meta),
  }));

  fireEvent.click(getPreventedStationRole("button", { name: /station 25/i }));
  assert.deepEqual(preventedStationSelections, []);

  cleanup();

  const switchChanges = [];
  const { getByRole: getSwitchRole, rerender: rerenderSwitch } = render(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));

  const switchInput = getSwitchRole("switch", { name: /enable notifications/i });
  assert.equal(switchInput.getAttribute("aria-checked"), "false");
  fireEvent.click(switchInput);
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "true"));
  assert.deepEqual(switchChanges, [{ checked: true, meta: { name: "notifications" }, eventType: "change" }]);

  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: false,
    disabled: true,
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));

  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "false"));
  fireEvent.click(getSwitchRole("switch", { name: /enable notifications/i }));
  assert.equal(switchChanges.length, 1);
  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: false,
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));
  fireEvent.click(switchInput);
  assert.deepEqual(switchChanges.at(-1), { checked: true, meta: { name: "notifications" }, eventType: "change" });
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "false"));
  rerenderSwitch(React.createElement(Switch, {
    label: "Enable notifications",
    name: "notifications",
    checked: true,
    onCheckedChange: (checked, meta, event) => switchChanges.push({ checked, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(switchInput.getAttribute("aria-checked"), "true"));

  cleanup();

  const tableColumns = [
    { key: "plate", label: "Plate" },
    { key: "driver", label: "Driver" },
  ];
  const tableRows = [
    { id: "unit-24", plate: "ABC-123", driver: "Ana" },
    { id: "unit-31", plate: "XYZ-789", driver: "Luis" },
  ];
  const rowSelections = [];
  const { container: selectableTableContainer, rerender: rerenderTable } = render(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key, event) => rowSelections.push({ key, eventType: event.type }),
  }));

  fireEvent.click(selectableTableContainer.querySelector('tr[data-key="unit-31"]'));
  assert.deepEqual(rowSelections, [{ key: "unit-31", eventType: "click" }]);
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "true");

  rerenderTable(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    selectedKey: "unit-24",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key, event) => rowSelections.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-24"]').getAttribute("data-selected"), "true"));
  fireEvent.click(selectableTableContainer.querySelector('tr[data-key="unit-31"]'));
  assert.deepEqual(rowSelections.at(-1), { key: "unit-31", eventType: "click" });
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "false");
  rerenderTable(React.createElement(Table, {
    label: "Vehicles",
    variant: "selectable",
    selectedKey: "unit-31",
    columns: tableColumns,
    rows: tableRows,
    onRowSelect: (key, event) => rowSelections.push({ key, eventType: event.type }),
  }));
  assert.equal(selectableTableContainer.querySelector('tr[data-key="unit-31"]').getAttribute("data-selected"), "true");

  cleanup();

  const sortChanges = [];
  const { getByRole: getSortableTableRole, rerender: rerenderSortableTable } = render(React.createElement(Table, {
    label: "Sortable vehicles",
    variant: "sortable",
    columns: [
      { key: "plate", label: "Plate", sortable: true },
      { key: "driver", label: "Driver", sortable: true },
    ],
    rows: tableRows,
    onSortChange: (sort, event) => sortChanges.push({ sort, eventType: event.type }),
  }));

  fireEvent.click(getSortableTableRole("button", { name: /plate/i }));
  assert.deepEqual(sortChanges, [{ sort: { key: "plate", direction: "ascending" }, eventType: "click" }]);

  rerenderSortableTable(React.createElement(Table, {
    label: "Sortable vehicles",
    variant: "sortable",
    sortKey: "driver",
    sortDir: "descending",
    columns: [
      { key: "plate", label: "Plate", sortable: true },
      { key: "driver", label: "Driver", sortable: true },
    ],
    rows: tableRows,
    onSortChange: (sort, event) => sortChanges.push({ sort, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(getSortableTableRole("columnheader", { name: /driver/i }).getAttribute("aria-sort"), "descending"));
  fireEvent.click(getSortableTableRole("button", { name: /plate/i }));
  assert.deepEqual(sortChanges.at(-1), { sort: { key: "plate", direction: "ascending" }, eventType: "click" });
  assert.equal(getSortableTableRole("columnheader", { name: /plate/i }).getAttribute("aria-sort"), "none");
  rerenderSortableTable(React.createElement(Table, {
    label: "Sortable vehicles",
    variant: "sortable",
    sortKey: "plate",
    sortDir: "ascending",
    columns: [
      { key: "plate", label: "Plate", sortable: true },
      { key: "driver", label: "Driver", sortable: true },
    ],
    rows: tableRows,
    onSortChange: (sort, event) => sortChanges.push({ sort, eventType: event.type }),
  }));
  assert.equal(getSortableTableRole("columnheader", { name: /plate/i }).getAttribute("aria-sort"), "ascending");

  cleanup();

  const expandedRows = [];
  const { getByRole: getTableRole, rerender: rerenderExpandedTable } = render(React.createElement(Table, {
    label: "Vehicle details",
    getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
    variant: "expandable",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key, event) => expandedRows.push({ key, eventType: event.type }),
  }));

  const expandUnit24 = getTableRole("button", { name: /open abc-123/i });
  assert.equal(expandUnit24.getAttribute("aria-expanded"), "false");
  fireEvent.click(expandUnit24);
  await waitFor(() => assert.equal(expandUnit24.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(expandedRows, [{ key: "unit-24", eventType: "click" }]);

  fireEvent.click(expandUnit24);
  await waitFor(() => assert.equal(expandUnit24.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(expandedRows, [{ key: "unit-24", eventType: "click" }, { key: "", eventType: "click" }]);

  rerenderExpandedTable(React.createElement(Table, {
    label: "Vehicle details",
    getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
    variant: "expandable",
    expandedKey: "unit-31",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key, event) => expandedRows.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(getTableRole("button", { name: /close xyz-789/i }).getAttribute("aria-expanded"), "true"));
  fireEvent.click(getTableRole("button", { name: /open abc-123/i }));
  assert.deepEqual(expandedRows.at(-1), { key: "unit-24", eventType: "click" });
  assert.equal(getTableRole("button", { name: /open abc-123/i }).getAttribute("aria-expanded"), "false");
  rerenderExpandedTable(React.createElement(Table, {
    label: "Vehicle details",
    getExpandLabel: (row, { expanded }) => `${expanded ? "Close" : "Open"} ${row.plate}`,
    variant: "expandable",
    expandedKey: "unit-24",
    columns: tableColumns,
    rows: tableRows,
    renderDetail: (row) => `${row.plate} detail`,
    onExpandedChange: (key, event) => expandedRows.push({ key, eventType: event.type }),
  }));
  assert.equal(getTableRole("button", { name: /close abc-123/i }).getAttribute("aria-expanded"), "true");

  cleanup();

  const tabChanges = [];
  const { getByRole: getTabsRole, rerender: rerenderTabs } = render(React.createElement(Tabs, {
    label: "Component sections",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key, event) => tabChanges.push({ key, eventType: event.type }),
  }));

  const overviewTab = getTabsRole("tab", { name: /overview/i });
  const buildTab = getTabsRole("tab", { name: /build/i });
  assert.equal(overviewTab.getAttribute("aria-selected"), "true");
  fireEvent.click(buildTab);
  await waitFor(() => assert.equal(buildTab.getAttribute("aria-selected"), "true"));
  assert.deepEqual(tabChanges, [{ key: "build", eventType: "click" }]);

  fireEvent.keyDown(overviewTab, { key: "ArrowRight" });
  assert.deepEqual(tabChanges, [{ key: "build", eventType: "click" }, { key: "overview", eventType: "keydown" }]);
  fireEvent.keyDown(buildTab, { key: "Home" });
  assert.deepEqual(tabChanges.at(-1), { key: "overview", eventType: "keydown" });
  const tabsRoot = getTabsRole("tablist", { name: /component sections/i });
  assert.match(tabsRoot.style.getPropertyValue("--comp-tabs-indicator-left"), /px$/);
  assert.match(tabsRoot.style.getPropertyValue("--comp-tabs-indicator-width"), /px$/);

  const preventedTabChanges = [];
  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    items: [
      { key: "overview", label: "Overview" },
      { key: "build", label: "Build", onClick: (event) => event.preventDefault(), onKeyDown: (event) => event.preventDefault() },
    ],
    onValueChange: (key, event) => preventedTabChanges.push({ key, eventType: event.type }),
  }));
  const preventedBuildTab = getTabsRole("tab", { name: /build/i });
  fireEvent.click(preventedBuildTab);
  fireEvent.keyDown(preventedBuildTab, { key: "ArrowLeft" });
  assert.deepEqual(preventedTabChanges, []);

  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    selectedKey: "overview",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key, event) => tabChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(overviewTab.getAttribute("aria-selected"), "true"));
  fireEvent.click(buildTab);
  assert.deepEqual(tabChanges.at(-1), { key: "build", eventType: "click" });
  assert.equal(buildTab.getAttribute("aria-selected"), "false");
  rerenderTabs(React.createElement(Tabs, {
    label: "Component sections",
    selectedKey: "build",
    items: [
      { key: "overview", label: "Overview" },
      { key: "design", label: "Design", disabled: true },
      { key: "build", label: "Build" },
    ],
    onValueChange: (key, event) => tabChanges.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(buildTab.getAttribute("aria-selected"), "true"));

  cleanup();

  const textAreaChanges = [];
  const { getByLabelText: getTextAreaLabel, getByText: getTextAreaText, rerender: rerenderTextArea } = render(React.createElement(TextArea, {
    label: "Notes",
    maxLength: 20,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));

  const notesTextArea = getTextAreaLabel(/notes/i);
  fireEvent.change(notesTextArea, { target: { value: "Route ready" } });
  await waitFor(() => assert.equal(notesTextArea.value, "Route ready"));
  getTextAreaText("11/20");
  assert.deepEqual(textAreaChanges, [{ value: "Route ready", meta: { maxLength: 20, length: 11 }, eventType: "change" }]);

  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Route ready",
    loading: true,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));

  fireEvent.change(getTextAreaLabel(/notes/i), { target: { value: "Blocked" } });
  assert.equal(textAreaChanges.length, 1);

  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Externally updated",
    maxLength: 30,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(notesTextArea.value, "Externally updated"));
  getTextAreaText("18/30");
  fireEvent.change(notesTextArea, { target: { value: "Local draft" } });
  assert.equal(textAreaChanges.at(-1).value, "Local draft");
  await waitFor(() => assert.equal(notesTextArea.value, "Externally updated"));
  getTextAreaText("18/30");
  rerenderTextArea(React.createElement(TextArea, {
    label: "Notes",
    value: "Local draft",
    maxLength: 30,
    onValueChange: (value, meta, event) => textAreaChanges.push({ value, meta, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(notesTextArea.value, "Local draft"));
  getTextAreaText("11/30");

  cleanup();

  const toastActions = [];
  const toastDismissals = [];
  const toastDismissChanges = [];
  const { getByRole: getToastRole } = render(React.createElement(Toast, {
    label: "Route saved",
    description: "Changes are available.",
    actionLabel: "Undo",
    dismissible: true,
    dismissLabel: "Dismiss route saved",
    onAction: (event) => toastActions.push(event.type),
    onDismiss: (event) => toastDismissals.push(event.type),
    onDismissChange: (dismissed, event) => toastDismissChanges.push({ dismissed, eventType: event.type }),
  }));

  const toastRegion = getToastRole("status");
  assert.equal(toastRegion.hidden, false);
  fireEvent.click(getToastRole("button", { name: /undo/i }));
  assert.deepEqual(toastActions, ["click"]);

  fireEvent.click(getToastRole("button", { name: /dismiss route saved/i }));
  assert.deepEqual(toastDismissals, ["click"]);
  assert.deepEqual(toastDismissChanges, [{ dismissed: true, eventType: "click" }]);
  assert.equal(toastRegion.hidden, true);

  cleanup();

  const preventedToastDismissals = [];
  const { getByRole: getPreventedToastRole } = render(React.createElement(Toast, {
    label: "Route pending",
    dismissible: true,
    dismissLabel: "Keep route pending",
    onDismiss: (event) => {
      preventedToastDismissals.push(event.type);
      event.preventDefault();
    },
  }));

  const preventedToastRegion = getPreventedToastRole("status");
  fireEvent.click(getPreventedToastRole("button", { name: /keep route pending/i }));
  assert.deepEqual(preventedToastDismissals, ["click"]);
  assert.equal(preventedToastRegion.hidden, false);

  cleanup();

  const controlledToastDismissChanges = [];
  const { getByRole: getControlledToastRole, rerender: rerenderControlledToast } = render(React.createElement(Toast, {
    label: "Route synced",
    dismissible: true,
    dismissLabel: "Dismiss synced route",
    dismissed: false,
    onDismissChange: (dismissed, event) => controlledToastDismissChanges.push({ dismissed, eventType: event.type }),
  }));

  const controlledToastRegion = getControlledToastRole("status");
  fireEvent.click(getControlledToastRole("button", { name: /dismiss synced route/i }));
  assert.deepEqual(controlledToastDismissChanges, [{ dismissed: true, eventType: "click" }]);
  assert.equal(controlledToastRegion.hidden, false);
  rerenderControlledToast(React.createElement(Toast, {
    label: "Route synced",
    dismissible: true,
    dismissLabel: "Dismiss synced route",
    dismissed: true,
    onDismissChange: (dismissed, event) => controlledToastDismissChanges.push({ dismissed, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(controlledToastRegion.hidden, true));

  cleanup();

  const tooltipOpenChanges = [];
  const { getByRole: getTooltipRole, rerender: rerenderTooltip } = render(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    onOpenChange: (open, event) => tooltipOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));

  const tooltipTrigger = getTooltipRole("button", { name: /help/i });
  const tooltipBubble = getTooltipRole("tooltip", { hidden: true });
  assert.equal(tooltipBubble.hidden, true);
  fireEvent.mouseEnter(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));
  assert.deepEqual(tooltipOpenChanges, [{ open: true, eventType: "mouseenter", key: undefined }]);

  fireEvent.mouseLeave(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));
  assert.deepEqual(tooltipOpenChanges, [
    { open: true, eventType: "mouseenter", key: undefined },
    { open: false, eventType: "mouseleave", key: undefined },
  ]);

  fireEvent.focus(tooltipTrigger);
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));
  fireEvent.keyDown(tooltipTrigger, { key: "Escape" });
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));
  assert.deepEqual(tooltipOpenChanges, [
    { open: true, eventType: "mouseenter", key: undefined },
    { open: false, eventType: "mouseleave", key: undefined },
    { open: true, eventType: "focus", key: undefined },
    { open: false, eventType: "keydown", key: "Escape" },
  ]);

  rerenderTooltip(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    open: true,
    onOpenChange: (open, event) => tooltipOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(tooltipBubble.hidden, false));

  rerenderTooltip(React.createElement(Tooltip, {
    triggerLabel: "Help",
    content: "Helpful context",
    open: false,
    onOpenChange: (open, event) => tooltipOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
  }));
  await waitFor(() => assert.equal(tooltipBubble.hidden, true));

  cleanup();

  const treeSelections = [];
  const treeExpandedChanges = [];
  const { getByRole: getTreeRole, rerender: rerenderTreeView } = render(React.createElement(TreeView, {
    label: "Docs navigation",
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: false, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key, event) => treeSelections.push({ key, eventType: event.type }),
    onExpandedChange: (keys, event) => treeExpandedChanges.push({ keys, eventType: event.type }),
  }));

  const componentsTreeItem = getTreeRole("treeitem", { name: /components/i });
  assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "false");
  fireEvent.click(componentsTreeItem);
  await waitFor(() => assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(treeSelections, [{ key: "components", eventType: "click" }]);
  assert.deepEqual(treeExpandedChanges, [{ keys: ["components"], eventType: "click" }]);

  fireEvent.keyDown(componentsTreeItem, { key: "ArrowLeft" });
  await waitFor(() => assert.equal(componentsTreeItem.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(treeExpandedChanges, [{ keys: ["components"], eventType: "click" }, { keys: [], eventType: "keydown" }]);

  rerenderTreeView(React.createElement(TreeView, {
    label: "Docs navigation",
    selectedKey: "input",
    expandedKeys: ["components"],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: true, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key, event) => treeSelections.push({ key, eventType: event.type }),
    onExpandedChange: (keys, event) => treeExpandedChanges.push({ keys, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(document.querySelector('[data-key="input"] [role="treeitem"]').getAttribute("aria-selected"), "true"));
  fireEvent.click(document.querySelector('[data-key="button"] [role="treeitem"]'));
  assert.deepEqual(treeSelections.at(-1), { key: "button", eventType: "click" });
  assert.equal(document.querySelector('[data-key="button"] [role="treeitem"]').getAttribute("aria-selected"), "false");
  rerenderTreeView(React.createElement(TreeView, {
    label: "Docs navigation",
    selectedKey: "button",
    expandedKeys: ["components"],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: true, icon: "category" },
      { key: "button", label: "Button", level: 2 },
      { key: "input", label: "Input", level: 2 },
    ],
    onSelect: (key, event) => treeSelections.push({ key, eventType: event.type }),
    onExpandedChange: (keys, event) => treeExpandedChanges.push({ keys, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(document.querySelector('[data-key="button"] [role="treeitem"]').getAttribute("aria-selected"), "true"));

  cleanup();

  const controlledTreeExpandedChanges = [];
  const { getByRole: getControlledTreeRole, rerender: rerenderControlledTreeView } = render(React.createElement(TreeView, {
    label: "Controlled docs navigation",
    expandedKeys: [],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: false, icon: "category" },
      { key: "button", label: "Button", level: 2 },
    ],
    onExpandedChange: (keys, event) => controlledTreeExpandedChanges.push({ keys, eventType: event.type }),
  }));

  const controlledComponentsTreeItem = getControlledTreeRole("treeitem", { name: /components/i });
  fireEvent.click(controlledComponentsTreeItem);
  assert.deepEqual(controlledTreeExpandedChanges, [{ keys: ["components"], eventType: "click" }]);
  assert.equal(controlledComponentsTreeItem.getAttribute("aria-expanded"), "false");
  rerenderControlledTreeView(React.createElement(TreeView, {
    label: "Controlled docs navigation",
    expandedKeys: ["components"],
    nodes: [
      { key: "components", label: "Components", level: 1, expanded: false, icon: "category" },
      { key: "button", label: "Button", level: 2 },
    ],
    onExpandedChange: (keys, event) => controlledTreeExpandedChanges.push({ keys, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(controlledComponentsTreeItem.getAttribute("aria-expanded"), "true"));

  cleanup();

  const preventedTreeSelections = [];
  const preventedTreeExpandedChanges = [];
  const preventedTreeEvents = [];
  const { getByRole: getPreventedTreeRole } = render(React.createElement(TreeView, {
    label: "Prevented docs navigation",
    nodes: [
      {
        key: "components",
        label: "Components",
        level: 1,
        expanded: false,
        onClick: (event) => {
          preventedTreeEvents.push(event.type);
          event.preventDefault();
        },
        onKeyDown: (event) => {
          preventedTreeEvents.push(event.key);
          event.preventDefault();
        },
      },
    ],
    onSelect: (key) => preventedTreeSelections.push(key),
    onExpandedChange: (keys) => preventedTreeExpandedChanges.push(keys),
  }));

  const preventedTreeItem = getPreventedTreeRole("treeitem", { name: /components/i });
  fireEvent.click(preventedTreeItem);
  fireEvent.keyDown(preventedTreeItem, { key: "ArrowRight" });
  assert.deepEqual(preventedTreeEvents, ["click", "ArrowRight"]);
  assert.equal(preventedTreeItem.getAttribute("aria-expanded"), "false");
  assert.deepEqual(preventedTreeSelections, []);
  assert.deepEqual(preventedTreeExpandedChanges, []);

  cleanup();

  const chatComposerEvents = [];
  const { getByRole: getChatComposerRole, rerender: rerenderChatComposer } = render(React.createElement(ChatComposer, {
    label: "Reply",
    value: "Draft",
    attachLabel: "Attach file",
    onValueChange: (value, meta, event) => chatComposerEvents.push(["onValueChange", value, meta.length, event.type]),
    onSend: (value, event) => chatComposerEvents.push(["onSend", value, event.type]),
    onAttach: (event) => chatComposerEvents.push(["onAttach", event.type]),
  }));

  const replyTextArea = getChatComposerRole("textbox", { name: /reply/i });
  assert.equal(replyTextArea.value, "Draft");
  fireEvent.change(replyTextArea, { target: { value: "Next draft" } });
  assert.deepEqual(chatComposerEvents.at(-1), ["onValueChange", "Next draft", 10, "change"]);
  assert.equal(replyTextArea.value, "Draft");
  fireEvent.click(getChatComposerRole("button", { name: /send/i }));
  assert.deepEqual(chatComposerEvents.at(-1), ["onSend", "Draft", "click"]);
  fireEvent.click(getChatComposerRole("button", { name: /attach file/i }));
  assert.deepEqual(chatComposerEvents.at(-1), ["onAttach", "click"]);
  rerenderChatComposer(React.createElement(ChatComposer, {
    label: "Reply",
    value: "Next draft",
    attachLabel: "Attach file",
    onValueChange: (value, meta, event) => chatComposerEvents.push(["onValueChange", value, meta.length, event.type]),
    onSend: (value, event) => chatComposerEvents.push(["onSend", value, event.type]),
    onAttach: (event) => chatComposerEvents.push(["onAttach", event.type]),
  }));
  await waitFor(() => assert.equal(replyTextArea.value, "Next draft"));

  cleanup();

  const chatMessageActions = [];
  const { getByRole: getChatMessageRole } = render(React.createElement(ChatMessage, {
    author: "agent",
    body: "Message failed",
    state: "failed",
    action: {
      label: "Retry message",
      onClick: (event) => chatMessageActions.push(["onClick", event.type]),
    },
  }));

  fireEvent.click(getChatMessageRole("button", { name: /retry message/i }));
  assert.deepEqual(chatMessageActions, [["onClick", "click"]]);

  cleanup();

  const chatThreadActions = [];
  const { getByRole: getChatThreadRole } = render(React.createElement(ChatThread, {
    label: "Support thread",
    messages: [
      {
        id: "failed-message",
        author: "agent",
        body: "Message failed",
        state: "failed",
        action: {
          label: "Retry message",
          onClick: (event) => chatThreadActions.push(["onAction", event.type]),
        },
      },
    ],
    onMessageAction: (key, event) => chatThreadActions.push(["onMessageAction", key, event.type]),
  }));

  fireEvent.click(getChatThreadRole("button", { name: /retry message/i }));
  assert.deepEqual(chatThreadActions, [["onAction", "click"], ["onMessageAction", "failed-message", "click"]]);

  cleanup();

  const copiedEvents = [];
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async (value) => copiedEvents.push(["writeText", value]),
    },
  });
  const { getByRole: getCodeBlockRole } = render(React.createElement(CodeBlock, {
    code: "npm install @alohasoyrico-eng/flow",
    copyable: true,
    copyAction: {
      label: "Copy install command",
      onCopied: (meta, event) => copiedEvents.push(["onCopied", meta.value, meta.state, event.type]),
      onCopyError: (meta, event) => copiedEvents.push(["onCopyError", meta.value, meta.state, event.type]),
    },
  }));

  fireEvent.click(getCodeBlockRole("button", { name: /copy install command/i }));
  await waitFor(() => assert.deepEqual(copiedEvents, [
    ["writeText", "npm install @alohasoyrico-eng/flow"],
    ["onCopied", "npm install @alohasoyrico-eng/flow", "copied", "click"],
  ]));

  cleanup();

  const copyErrorEvents = [];
  Object.defineProperty(globalThis.navigator, "clipboard", {
    configurable: true,
    value: {
      writeText: async () => {
        throw new Error("blocked");
      },
    },
  });
  const { getByRole: getCopyErrorButtonRole } = render(React.createElement(CodeBlock, {
    code: "--sys-energy-surface-primary",
    copyable: true,
    copyAction: {
      label: "Copy token path",
      onCopied: (meta, event) => copyErrorEvents.push(["onCopied", meta.value, meta.state, event.type]),
      onCopyError: (meta, event) => copyErrorEvents.push(["onCopyError", meta.value, meta.state, event.type]),
    },
  }));

  fireEvent.click(getCopyErrorButtonRole("button", { name: /copy token path/i }));
  await waitFor(() => assert.deepEqual(copyErrorEvents, [
    ["onCopyError", "--sys-energy-surface-primary", "error", "click"],
  ]));
} finally {
  cleanup();
  dom.window.close();
}

console.log("react interaction tests passed");
