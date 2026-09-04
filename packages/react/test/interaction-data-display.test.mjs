import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  KpiTile,
  List,
  RouteSummary,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const routeClicks = [];
  const routeActions = [];
  const { container: routeContainer, getByRole: getRouteRole } = render(React.createElement(RouteSummary, {
    label: "Route 24",
    description: "Centro to Norte",
    metrics: [{ label: "ETA", value: "18 min" }],
    actions: [{ key: "assign", label: "Assign", onAction: (...args) => routeActions.push(args) }],
    onClick: (event) => routeClicks.push(event.type),
  }));

  const routeSummary = routeContainer.querySelector(".route-summary");
  fireEvent.click(routeSummary);
  assert.deepEqual(routeClicks, ["click"]);

  fireEvent.click(getRouteRole("button", { name: /assign/i }));
  assert.equal(routeActions.length, 1);
  assert.equal(routeActions[0][0], "assign");
  assert.equal(routeActions[0][1].label, "Assign");
  assert.equal(routeActions[0][2].type, "click");
  assert.deepEqual(routeClicks, ["click"]);

  cleanup();

  const preventedRouteActions = [];
  const { getByRole: getPreventedRouteRole } = render(React.createElement(RouteSummary, {
    label: "Route 25",
    metrics: [{ key: "eta", label: "ETA", value: "22 min" }],
    actions: [{
      key: "assign",
      label: "Assign",
      onClick: (event) => event.preventDefault(),
      onAction: (...args) => preventedRouteActions.push(args),
    }],
  }));

  fireEvent.click(getPreventedRouteRole("button", { name: /assign/i }));
  assert.deepEqual(preventedRouteActions, []);

  cleanup();

  const kpiClicks = [];
  const kpiSelections = [];
  const { getByRole: getKpiRole } = render(React.createElement(KpiTile, {
    label: "Cards at risk",
    value: "18",
    variant: "drill-in",
    onClick: (event) => kpiClicks.push(event.type),
    onSelect: (meta, event) => kpiSelections.push({ meta, eventType: event.type }),
  }));

  const kpiTile = getKpiRole("button", { name: /cards at risk 18/i });
  fireEvent.click(kpiTile);
  assert.deepEqual(kpiClicks, ["click"]);
  assert.deepEqual(kpiSelections, [{ meta: { label: "Cards at risk", value: "18", delta: "", tone: "neutral", variant: "drill-in" }, eventType: "click" }]);

  cleanup();

  const listSelections = [];
  const { getByRole: getListRole, rerender: rerenderList } = render(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key, event) => listSelections.push({ key, eventType: event.type }),
  }));

  const documentsRow = getListRole("option", { name: /documents/i });
  const fuelRow = getListRole("option", { name: /fuel card/i });
  const documentsFrame = documentsRow.querySelector(".list__item");
  const fuelFrame = fuelRow.querySelector(".list__item");
  assert.equal(documentsFrame.getAttribute("aria-current"), null);
  fireEvent.click(documentsRow);
  await waitFor(() => assert.equal(documentsFrame.getAttribute("aria-current"), "true"));
  assert.deepEqual(listSelections, [{ key: "docs", eventType: "click" }]);

  rerenderList(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    selectedKey: "fuel",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key, event) => listSelections.push({ key, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(fuelFrame.getAttribute("aria-current"), "true"));
  assert.equal(documentsFrame.getAttribute("aria-current"), null);
  fireEvent.click(documentsRow);
  assert.deepEqual(listSelections.at(-1), { key: "docs", eventType: "click" });
  assert.equal(documentsFrame.getAttribute("aria-current"), null);
  rerenderList(React.createElement(List, {
    label: "Fleet tasks",
    variant: "action",
    selectedKey: "docs",
    items: [
      { key: "docs", label: "Documents", meta: "3 pending" },
      { key: "fuel", label: "Fuel card", meta: "Needs review" },
    ],
    onSelect: (key, event) => listSelections.push({ key, eventType: event.type }),
  }));
  assert.equal(documentsFrame.getAttribute("aria-current"), "true");
  assert.equal(fuelFrame.getAttribute("aria-current"), null);

  cleanup();

  const preventedListSelections = [];
  const preventedListClicks = [];
  const { getByRole: getPreventedListRole } = render(React.createElement(List, {
    label: "Prevented tasks",
    variant: "action",
    items: [
      {
        key: "docs",
        label: "Documents",
        onClick: (event) => {
          preventedListClicks.push(event.type);
          event.preventDefault();
        },
      },
    ],
    onSelect: (key) => preventedListSelections.push(key),
  }));

  const preventedDocumentsRow = getPreventedListRole("option", { name: /documents/i });
  fireEvent.click(preventedDocumentsRow);
  assert.deepEqual(preventedListClicks, ["click"]);
  assert.equal(preventedDocumentsRow.querySelector(".list__item").getAttribute("aria-current"), null);
  assert.deepEqual(preventedListSelections, []);

  cleanup();
  console.log("interaction data display passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
