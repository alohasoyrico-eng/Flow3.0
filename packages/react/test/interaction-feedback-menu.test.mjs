import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  EmptyState,
  ErrorPanel,
  Menu,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const emptyStateActions = [];
  const emptyStateClicks = [];
  const { getByRole: getEmptyStateRole } = render(React.createElement(EmptyState, {
    title: "No vehicles match",
    action: {
      key: "clear-filters",
      label: "Clear filters",
      onClick: (event) => emptyStateClicks.push(event.type),
    },
    onAction: (key, event) => emptyStateActions.push({ key, eventType: event.type }),
  }));

  fireEvent.click(getEmptyStateRole("button", { name: /clear filters/i }));
  assert.deepEqual(emptyStateClicks, ["click"]);
  assert.deepEqual(emptyStateActions, [{ key: "clear-filters", eventType: "click" }]);

  cleanup();

  const preventedEmptyStateActions = [];
  const { getByRole: getPreventedEmptyStateRole } = render(React.createElement(EmptyState, {
    title: "No vehicles match",
    action: {
      key: "clear-filters",
      label: "Clear filters",
      onClick: (event) => event.preventDefault(),
    },
    onAction: (key) => preventedEmptyStateActions.push(key),
  }));

  fireEvent.click(getPreventedEmptyStateRole("button", { name: /clear filters/i }));
  assert.deepEqual(preventedEmptyStateActions, []);

  cleanup();

  const errorPanelActions = [];
  const errorPanelClicks = [];
  const { getByRole: getErrorPanelRole } = render(React.createElement(ErrorPanel, {
    label: "Sync failed",
    action: {
      key: "retry",
      label: "Retry",
      onClick: (event) => errorPanelClicks.push(event.type),
    },
    onAction: (key, event) => errorPanelActions.push({ key, eventType: event.type }),
  }));

  fireEvent.click(getErrorPanelRole("button", { name: /retry/i }));
  assert.deepEqual(errorPanelClicks, ["click"]);
  assert.deepEqual(errorPanelActions, [{ key: "retry", eventType: "click" }]);

  cleanup();

  const preventedErrorPanelActions = [];
  const { getByRole: getPreventedErrorPanelRole } = render(React.createElement(ErrorPanel, {
    label: "Sync failed",
    action: {
      key: "retry",
      label: "Retry",
      onClick: (event) => event.preventDefault(),
    },
    onAction: (key) => preventedErrorPanelActions.push(key),
  }));

  fireEvent.click(getPreventedErrorPanelRole("button", { name: /retry/i }));
  assert.deepEqual(preventedErrorPanelActions, []);

  cleanup();

  const menuOpenChanges = [];
  const menuSelections = [];
  const { getByRole: getMenuRole, rerender: rerenderMenu } = render(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    onOpenChange: (open, event) => menuOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
    onSelect: (item, event) => menuSelections.push({ key: item.key, eventType: event.type }),
  }));

  const menuTrigger = getMenuRole("button", { name: /actions/i });
  assert.equal(menuTrigger.getAttribute("aria-expanded"), "false");
  fireEvent.click(menuTrigger);
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));
  assert.deepEqual(menuOpenChanges, [{ open: true, eventType: "click", key: undefined }]);

  const archiveItem = getMenuRole("menuitem", { name: /archive/i });
  fireEvent.click(archiveItem);
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(menuSelections, [{ key: "archive", eventType: "click" }]);
  assert.deepEqual(menuOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
  ]);

  fireEvent.keyDown(menuTrigger, { key: "ArrowDown" });
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.keyDown(getMenuRole("menu", { name: /row actions/i }), { key: "Escape" });
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(menuOpenChanges, [
    { open: true, eventType: "click", key: undefined },
    { open: false, eventType: "click", key: undefined },
    { open: true, eventType: "keydown", key: "ArrowDown" },
    { open: false, eventType: "keydown", key: "Escape" },
  ]);

  rerenderMenu(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    open: true,
    onOpenChange: (open, event) => menuOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
    onSelect: (item, event) => menuSelections.push({ key: item.key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "true"));

  rerenderMenu(React.createElement(Menu, {
    label: "Row actions",
    triggerLabel: "Actions",
    items: [
      { key: "edit", label: "Edit", icon: "edit" },
      { key: "archive", label: "Archive", icon: "archive" },
    ],
    open: false,
    onOpenChange: (open, event) => menuOpenChanges.push({ open, eventType: event?.type, key: event?.key }),
    onSelect: (item, event) => menuSelections.push({ key: item.key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(menuTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(menuTrigger.closest(".menu").dataset.state, "default"));
  fireEvent.click(menuTrigger);
  assert.equal(menuOpenChanges.at(-1).open, true);
  assert.equal(menuTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(menuTrigger.closest(".menu").dataset.state, "default");

  cleanup();

  const preventedMenuOpenChanges = [];
  const preventedMenuSelections = [];
  const preventedMenuClicks = [];
  const { getByRole: getPreventedMenuRole } = render(React.createElement(Menu, {
    label: "Prevented actions",
    triggerLabel: "More actions",
    items: [
      {
        key: "archive",
        label: "Archive",
        onClick: (event) => {
          preventedMenuClicks.push(event.type);
          event.preventDefault();
        },
      },
    ],
    onOpenChange: (open, event) => preventedMenuOpenChanges.push({ open, eventType: event?.type }),
    onSelect: (item) => preventedMenuSelections.push(item.key),
  }));

  const preventedMenuTrigger = getPreventedMenuRole("button", { name: /more actions/i });
  fireEvent.click(preventedMenuTrigger);
  await waitFor(() => assert.equal(preventedMenuTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getPreventedMenuRole("menuitem", { name: /archive/i }));
  assert.deepEqual(preventedMenuClicks, ["click"]);
  assert.deepEqual(preventedMenuSelections, []);
  assert.equal(preventedMenuTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(preventedMenuOpenChanges, [{ open: true, eventType: "click" }]);

  cleanup();
  console.log("interaction feedback menu passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
