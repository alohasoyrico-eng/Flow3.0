import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Dialog,
  Drawer,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const dialogOpenChanges = [];
  const dialogActions = [];
  const dialogActionClicks = [];
  const { getByRole: getDialogRole, rerender: rerenderDialog } = render(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm", onClick: (event) => dialogActionClicks.push(event.type) }],
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key, event) => dialogActions.push({ key, eventType: event.type }),
  }));

  const dialogTrigger = getDialogRole("button", { name: /open review/i });
  fireEvent.click(dialogTrigger);
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getDialogRole("dialog", { name: /confirm route/i }).hidden, false);
  assert.deepEqual(dialogOpenChanges, [{ open: true, eventType: "click" }]);

  fireEvent.click(getDialogRole("button", { name: /confirm/i }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(dialogActionClicks, ["click"]);
  assert.deepEqual(dialogActions, [{ key: "confirm", eventType: "click" }]);
  assert.deepEqual(dialogOpenChanges, [{ open: true, eventType: "click" }, { open: false, eventType: "click" }]);

  const preventedDialogActions = [];
  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm", onClick: (event) => event.preventDefault() }],
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => preventedDialogActions.push(key),
  }));
  fireEvent.click(dialogTrigger);
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getDialogRole("button", { name: /confirm/i }));
  assert.deepEqual(preventedDialogActions, []);
  assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true");

  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm" }],
    open: true,
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => dialogActions.push(key),
  }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDialog(React.createElement(Dialog, {
    label: "Confirm route",
    description: "Review before assigning.",
    triggerLabel: "Open review",
    closeLabel: "Close route modal",
    actions: [{ key: "confirm", label: "Confirm" }],
    open: false,
    onOpenChange: (open, event) => dialogOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => dialogActions.push(key),
  }));
  await waitFor(() => assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(dialogTrigger.closest(".dialog").dataset.state, "closed"));
  fireEvent.click(dialogTrigger);
  assert.equal(dialogOpenChanges.at(-1).open, true);
  assert.equal(dialogTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(dialogTrigger.closest(".dialog").dataset.state, "closed");

  cleanup();

  const drawerOpenChanges = [];
  const drawerActions = [];
  const { getByRole: getDrawerRole, rerender: rerenderDrawer } = render(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save" }],
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key, event) => drawerActions.push({ key, eventType: event.type }),
  }));

  const drawerTrigger = getDrawerRole("button", { name: /open details/i });
  fireEvent.click(drawerTrigger);
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(getDrawerRole("dialog", { name: /vehicle details/i }).hidden, false);
  assert.deepEqual(drawerOpenChanges, [{ open: true, eventType: "click" }]);

  fireEvent.click(getDrawerRole("button", { name: /save/i }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false"));
  assert.deepEqual(drawerActions, [{ key: "save", eventType: "click" }]);
  assert.deepEqual(drawerOpenChanges, [{ open: true, eventType: "click" }, { open: false, eventType: "click" }]);

  const preventedDrawerActions = [];
  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save", onClick: (event) => event.preventDefault() }],
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => preventedDrawerActions.push(key),
  }));
  fireEvent.click(drawerTrigger);
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));
  fireEvent.click(getDrawerRole("button", { name: /save/i }));
  assert.deepEqual(preventedDrawerActions, []);
  assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true");

  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save" }],
    open: true,
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => drawerActions.push(key),
  }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "true"));

  rerenderDrawer(React.createElement(Drawer, {
    label: "Vehicle details",
    description: "Review route documents.",
    triggerLabel: "Open details",
    closeLabel: "Close vehicle details",
    actions: [{ key: "save", label: "Save" }],
    open: false,
    onOpenChange: (open, event) => drawerOpenChanges.push({ open, eventType: event?.type }),
    onAction: (key) => drawerActions.push(key),
  }));
  await waitFor(() => assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false"));
  await waitFor(() => assert.equal(drawerTrigger.closest(".drawer").dataset.state, "closed"));
  fireEvent.click(drawerTrigger);
  assert.equal(drawerOpenChanges.at(-1).open, true);
  assert.equal(drawerTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(drawerTrigger.closest(".drawer").dataset.state, "closed");

  cleanup();
  console.log("interaction modal overlays passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
