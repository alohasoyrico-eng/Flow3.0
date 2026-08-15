import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

globalThis.window = dom.window;
globalThis.document = dom.window.document;
globalThis.HTMLElement = dom.window.HTMLElement;
globalThis.Node = dom.window.Node;
globalThis.Event = dom.window.Event;
globalThis.KeyboardEvent = dom.window.KeyboardEvent;
globalThis.MouseEvent = dom.window.MouseEvent;
Object.defineProperty(globalThis, "navigator", {
  configurable: true,
  value: dom.window.navigator,
});
globalThis.requestAnimationFrame = (callback) => setTimeout(callback, 0);
globalThis.cancelAnimationFrame = (id) => clearTimeout(id);

const React = await import("react");
const axe = await import("axe-core");
const userEvent = await import("@testing-library/user-event");
const { cleanup, fireEvent, render, waitFor } = await import("@testing-library/react");
const { List, Table } = await import("../dist/index.js");

async function assertNoAxeViolations(container) {
  const results = await axe.default.run(container, {
    rules: {
      "color-contrast": { enabled: false },
      region: { enabled: false },
    },
  });
  assert.deepEqual(results.violations, []);
}

function createUser() {
  return userEvent.default.setup({ document: globalThis.document });
}

try {
  {
    const user = createUser();
    const selections = [];
    const itemClicks = [];
    const view = render(React.createElement(List, {
      label: "Driver work queue",
      variant: "action",
      state: "loading",
      density: "sm",
      items: [
        { key: "ana", label: "Ana Sosa", meta: "Documents pending", value: "2", icon: "person", onClick: (event) => itemClicks.push(event.type) },
        { key: "leo", label: "Leo Ruiz", meta: "Ready", value: "0", state: "selected" },
        { key: "mia", label: "Mia Torres", meta: "Blocked", state: "disabled" },
      ],
      onSelect: (key, event) => selections.push({ key, eventType: event.type }),
    }));
    const list = view.getByRole("list", { name: /driver work queue/i });
    const ana = view.getByRole("button", { name: /ana sosa/i });
    const leo = view.getByRole("button", { name: /leo ruiz/i });
    const mia = view.getByRole("button", { name: /mia torres/i });

    assert.equal(list.dataset.variant, "action");
    assert.equal(list.dataset.state, "loading");
    assert.equal(list.dataset.density, "sm");
    assert.equal(list.dataset.interactive, "true");
    assert.equal(list.getAttribute("aria-busy"), "true");
    assert.equal(leo.getAttribute("aria-current"), "true");

    await user.click(ana);
    assert.deepEqual(itemClicks, ["click"]);
    assert.deepEqual(selections.at(-1), { key: "ana", eventType: "click" });
    await waitFor(() => assert.equal(ana.getAttribute("aria-current"), "true"));

    leo.focus();
    assert.equal(globalThis.document.activeElement, leo);
    await user.keyboard("[Enter]");
    assert.deepEqual(selections.at(-1), { key: "leo", eventType: "click" });

    const beforeDisabled = selections.length;
    await user.click(mia);
    assert.equal(selections.length, beforeDisabled);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(List, {
      label: "Read-only policies",
      variant: "status",
      state: "error",
      items: [
        { key: "fuel", label: "Fuel policy", meta: "Needs review", tone: "danger", state: "error" },
      ],
    }));
    const list = view.getByRole("list", { name: /read-only policies/i });

    assert.equal(list.dataset.interactive, "false");
    assert.equal(view.queryByRole("button"), null);
    assert.equal(view.getByText(/fuel policy/i).closest(".list__item").dataset.state, "error");
    assert.equal(view.getByText(/fuel policy/i).closest(".list__item").dataset.tone, "danger");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const sorts = [];
    const selections = [];
    const expansions = [];
    const rows = [
      { id: "veh-2", label: "Vehicle 2", plate: "TRK-002", status: { label: "Ready", tone: "success" }, score: 9, detail: "Inspection complete" },
      { id: "veh-1", label: "Vehicle 1", plate: "TRK-001", status: { label: "Blocked", tone: "danger" }, score: 3, detail: "Missing document" },
    ];
    const columns = [
      { key: "label", label: "Vehicle", sortable: true, priority: "primary" },
      { key: "status", label: "Status" },
      { key: "score", label: "Score", sortable: true, align: "right", mono: true, sortValue: (row) => row.score },
    ];
    const view = render(React.createElement(Table, {
      label: "Fleet vehicles",
      columns,
      rows,
      rowKey: "id",
      variant: "expandable",
      state: "focus",
      density: "lg",
      getExpandLabel: (row, meta) => `${meta.expanded ? "Collapse" : "Expand"} ${row.label}`,
      renderDetail: (row) => row.detail,
      onSortChange: (sort, event) => sorts.push({ ...sort, eventType: event.type }),
      onRowSelect: (key, event) => selections.push({ key, eventType: event.type }),
      onExpandedChange: (key, event) => expansions.push({ key, eventType: event.type }),
    }));
    const table = view.getByRole("table", { name: /fleet vehicles/i });
    const root = table.closest(".table");
    const vehicleOne = view.getByRole("row", { name: /vehicle 1/i });
    const vehicleTwo = view.getByRole("row", { name: /vehicle 2/i });

    assert.equal(root.dataset.variant, "expandable");
    assert.equal(root.dataset.state, "focus");
    assert.equal(root.dataset.density, "lg");
    assert.equal(view.getByRole("columnheader", { name: /score/i }).getAttribute("aria-sort"), "none");

    await user.click(view.getByRole("button", { name: /^score$/i }));
    assert.deepEqual(sorts.at(-1), { key: "score", direction: "ascending", eventType: "click" });
    await waitFor(() => assert.equal(view.getAllByRole("row")[1].getAttribute("data-key"), "veh-1"));
    assert.equal(view.getByRole("columnheader", { name: /score/i }).getAttribute("aria-sort"), "ascending");

    await user.click(view.getByRole("button", { name: /expand vehicle 1/i }));
    assert.deepEqual(expansions.at(-1), { key: "veh-1", eventType: "click" });
    await waitFor(() => assert.equal(view.getByText(/missing document/i).closest("tr").hidden, false));
    assert.equal(vehicleOne.getAttribute("aria-expanded"), "true");

    vehicleTwo.focus();
    assert.equal(globalThis.document.activeElement, vehicleTwo);
    fireEvent.keyDown(vehicleTwo, { key: "Enter" });
    assert.deepEqual(expansions.at(-1), { key: "veh-2", eventType: "keydown" });
    await waitFor(() => assert.equal(vehicleTwo.getAttribute("aria-expanded"), "true"));

    view.rerender(React.createElement(Table, {
      label: "Fleet vehicles",
      columns,
      rows,
      rowKey: "id",
      variant: "selectable",
      selectedKey: "veh-1",
      sortKey: "score",
      sortDir: "descending",
      onSortChange: (sort, event) => sorts.push({ ...sort, eventType: event.type }),
      onRowSelect: (key, event) => selections.push({ key, eventType: event.type }),
    }));
    assert.equal(view.getByRole("columnheader", { name: /score/i }).getAttribute("aria-sort"), "descending");
    assert.equal(view.getByRole("row", { name: /vehicle 1/i }).dataset.selected, "true");
    await user.click(view.getByRole("row", { name: /vehicle 2/i }));
    assert.deepEqual(selections.at(-1), { key: "veh-2", eventType: "click" });
    assert.equal(view.getByRole("row", { name: /vehicle 1/i }).dataset.selected, "true");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P1 data display production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
