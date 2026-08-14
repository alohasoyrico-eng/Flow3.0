import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.HTMLButtonElement = dom.window.HTMLButtonElement;
globalThis.Node = dom.window.Node;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const {
  AgentWorkspace,
  ConfigurationConsole,
  DriverCardWallet,
  DriverMobileApp,
  FleetDashboardSuite,
  FleetManagerDesktop,
  InternalOperationsConsole,
  RoutesAndStations,
  SettingsWorkspace,
} = await import("../dist/templates/index.js");

function templateRoot(view, id) {
  const root = view.container.querySelector(`[data-flow-template="${id}"]`);
  assert.ok(root, `Expected ${id} template root.`);
  return root;
}

function clickFirstButton(view, name) {
  const button = view.getAllByRole("button", { name }).at(-1);
  assert.ok(button, `Expected button ${name}.`);
  fireEvent.click(button);
  return button;
}

function clickTarget(view, { targetName, targetSelector }) {
  if (targetSelector) {
    const target = view.container.querySelector(targetSelector);
    assert.ok(target, `Expected target ${targetSelector}.`);
    fireEvent.click(target);
    return target;
  }
  return clickFirstButton(view, targetName);
}

async function assertUncontrolledSelection({ Component, id, selectedAttribute, defaultProp, initial, targetName, targetSelector, expected }) {
  const events = [];
  const callbackProp = callbackPropByTemplate[id];
  const view = render(React.createElement(Component, {
    [defaultProp]: initial,
    [callbackProp]: (key, _model, event) => events.push([key, event?.type ?? _model?.type]),
  }));

  assert.equal(templateRoot(view, id).getAttribute(selectedAttribute), initial);
  clickTarget(view, { targetName, targetSelector });
  await waitFor(() => assert.equal(templateRoot(view, id).getAttribute(selectedAttribute), expected));
  assert.equal(events.at(-1)?.[0], expected);
  assert.equal(events.at(-1)?.[1], "click");
  cleanup();
}

async function assertControlledSelection({ Component, id, selectedAttribute, selectedProp, targetName, targetSelector, initial, expected }) {
  const events = [];
  const callbackProp = callbackPropByTemplate[id];
  const view = render(React.createElement(Component, {
    [selectedProp]: initial,
    [callbackProp]: (key, _model, event) => events.push([key, event?.type ?? _model?.type]),
  }));

  assert.equal(templateRoot(view, id).getAttribute(selectedAttribute), initial);
  clickTarget(view, { targetName, targetSelector });
  assert.equal(events.at(-1)?.[0], expected);
  assert.equal(events.at(-1)?.[1], "click");
  assert.equal(templateRoot(view, id).getAttribute(selectedAttribute), initial);

  view.rerender(React.createElement(Component, {
    [selectedProp]: expected,
    [callbackProp]: (key, _model, event) => events.push([key, event?.type ?? _model?.type]),
  }));
  await waitFor(() => assert.equal(templateRoot(view, id).getAttribute(selectedAttribute), expected));
  cleanup();
}

async function assertDrawerClose({ Component, id }) {
  const events = [];
  const view = render(React.createElement(Component, {
    drawerOpen: true,
    onDrawerOpenChange: (open, event) => events.push([open, event?.type]),
  }));

  assert.equal(templateRoot(view, id).getAttribute("data-flow-template"), id);
  clickFirstButton(view, /close navigation/i);
  await waitFor(() => assert.deepEqual(events.at(-1), [false, "click"]));
  cleanup();
}

const callbackPropByTemplate = {
  "agent-workspace": "onSelectedConversationChange",
  "configuration-console": "onSelectedModuleChange",
  "driver-card-wallet": "onSelectedSectionChange",
  "driver-mobile-app": "onSelectedTabChange",
  "fleet-dashboard-suite": "onSelectedDashboardChange",
  "fleet-manager-desktop": "onSelectedDashboardChange",
  "internal-operations-console": "onSelectedModuleChange",
  "routes-and-stations": "onSelectedStationChange",
  "settings-workspace": "onSelectedSectionChange",
};

try {
  await assertUncontrolledSelection({
    Component: AgentWorkspace,
    id: "agent-workspace",
    selectedAttribute: "data-selected-conversation",
    defaultProp: "defaultSelectedConversation",
    initial: "handoff",
    targetSelector: '[data-template-conversation="route-help"]',
    expected: "route-help",
  });
  await assertControlledSelection({
    Component: AgentWorkspace,
    id: "agent-workspace",
    selectedAttribute: "data-selected-conversation",
    selectedProp: "selectedConversation",
    initial: "handoff",
    targetSelector: '[data-template-conversation="route-help"]',
    expected: "route-help",
  });

  await assertUncontrolledSelection({
    Component: ConfigurationConsole,
    id: "configuration-console",
    selectedAttribute: "data-selected-module",
    defaultProp: "defaultSelectedModule",
    initial: "permissions",
    targetName: /drivers/i,
    expected: "drivers",
  });
  await assertControlledSelection({
    Component: ConfigurationConsole,
    id: "configuration-console",
    selectedAttribute: "data-selected-module",
    selectedProp: "selectedModule",
    initial: "permissions",
    targetName: /drivers/i,
    expected: "drivers",
  });
  await assertDrawerClose({ Component: ConfigurationConsole, id: "configuration-console" });

  await assertUncontrolledSelection({
    Component: InternalOperationsConsole,
    id: "internal-operations-console",
    selectedAttribute: "data-selected-module",
    defaultProp: "defaultSelectedModule",
    initial: "cases",
    targetName: /tickets/i,
    expected: "tickets",
  });
  await assertControlledSelection({
    Component: InternalOperationsConsole,
    id: "internal-operations-console",
    selectedAttribute: "data-selected-module",
    selectedProp: "selectedModule",
    initial: "cases",
    targetName: /tickets/i,
    expected: "tickets",
  });
  await assertDrawerClose({ Component: InternalOperationsConsole, id: "internal-operations-console" });

  await assertUncontrolledSelection({
    Component: SettingsWorkspace,
    id: "settings-workspace",
    selectedAttribute: "data-selected-section",
    defaultProp: "defaultSelectedSection",
    initial: "profile",
    targetSelector: '[data-template-section="notifications"]',
    expected: "notifications",
  });
  await assertControlledSelection({
    Component: SettingsWorkspace,
    id: "settings-workspace",
    selectedAttribute: "data-selected-section",
    selectedProp: "selectedSection",
    initial: "profile",
    targetSelector: '[data-template-section="notifications"]',
    expected: "notifications",
  });

  await assertUncontrolledSelection({
    Component: DriverCardWallet,
    id: "driver-card-wallet",
    selectedAttribute: "data-selected-section",
    defaultProp: "defaultSelectedSection",
    initial: "card",
    targetSelector: '[data-template-section="help"]',
    expected: "help",
  });
  await assertControlledSelection({
    Component: DriverCardWallet,
    id: "driver-card-wallet",
    selectedAttribute: "data-selected-section",
    selectedProp: "selectedSection",
    initial: "card",
    targetSelector: '[data-template-section="help"]',
    expected: "help",
  });

  await assertUncontrolledSelection({
    Component: DriverMobileApp,
    id: "driver-mobile-app",
    selectedAttribute: "data-selected-tab",
    defaultProp: "defaultSelectedTab",
    initial: "home",
    targetSelector: '[data-template-tab="support"]',
    expected: "support",
  });
  await assertControlledSelection({
    Component: DriverMobileApp,
    id: "driver-mobile-app",
    selectedAttribute: "data-selected-tab",
    selectedProp: "selectedTab",
    initial: "home",
    targetSelector: '[data-template-tab="support"]',
    expected: "support",
  });

  await assertUncontrolledSelection({
    Component: FleetDashboardSuite,
    id: "fleet-dashboard-suite",
    selectedAttribute: "data-selected-dashboard",
    defaultProp: "defaultSelectedDashboard",
    initial: "overview",
    targetName: /finance/i,
    expected: "finance",
  });
  await assertControlledSelection({
    Component: FleetDashboardSuite,
    id: "fleet-dashboard-suite",
    selectedAttribute: "data-selected-dashboard",
    selectedProp: "selectedDashboard",
    initial: "overview",
    targetName: /finance/i,
    expected: "finance",
  });
  await assertDrawerClose({ Component: FleetDashboardSuite, id: "fleet-dashboard-suite" });

  await assertUncontrolledSelection({
    Component: FleetManagerDesktop,
    id: "fleet-manager-desktop",
    selectedAttribute: "data-selected-dashboard",
    defaultProp: "defaultSelectedDashboard",
    initial: "overview",
    targetName: /fuel/i,
    expected: "fuel",
  });
  await assertControlledSelection({
    Component: FleetManagerDesktop,
    id: "fleet-manager-desktop",
    selectedAttribute: "data-selected-dashboard",
    selectedProp: "selectedDashboard",
    initial: "overview",
    targetName: /fuel/i,
    expected: "fuel",
  });
  await assertDrawerClose({ Component: FleetManagerDesktop, id: "fleet-manager-desktop" });

  await assertUncontrolledSelection({
    Component: RoutesAndStations,
    id: "routes-and-stations",
    selectedAttribute: "data-selected-station",
    defaultProp: "defaultSelectedStationKey",
    initial: "centro",
    targetName: /industrial sur/i,
    expected: "industrial",
  });
  await assertControlledSelection({
    Component: RoutesAndStations,
    id: "routes-and-stations",
    selectedAttribute: "data-selected-station",
    selectedProp: "selectedStationKey",
    initial: "centro",
    targetName: /industrial sur/i,
    expected: "industrial",
  });

  console.log("react template interaction tests passed");
} finally {
  cleanup();
}
