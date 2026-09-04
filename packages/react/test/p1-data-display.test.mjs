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
    const list = view.getByRole("listbox", { name: /driver work queue/i });
    const ana = view.getByRole("option", { name: /ana sosa/i });
    const leo = view.getByRole("option", { name: /leo ruiz/i });
    const mia = view.getByRole("option", { name: /mia torres/i });
    const anaFrame = ana.querySelector(".list__item");
    const leoFrame = leo.querySelector(".list__item");
    const options = view.getAllByRole("option");

    assert.equal(list.dataset.variant, "action");
    assert.equal(list.dataset.state, "loading");
    assert.equal(list.dataset.density, "sm");
    assert.equal(list.dataset.interactive, "true");
    assert.equal(list.getAttribute("aria-busy"), "true");
    assert.equal(options.length, 3);
    assert.equal(options[1].getAttribute("aria-selected"), "true");
    assert.equal(list.getAttribute("aria-activedescendant"), options[1].id);
    assert.equal(leoFrame.getAttribute("aria-current"), "true");

    await user.click(ana);
    assert.deepEqual(itemClicks, ["click"]);
    assert.deepEqual(selections.at(-1), { key: "ana", eventType: "click" });
    await waitFor(() => assert.equal(anaFrame.getAttribute("aria-current"), "true"));

    list.focus();
    assert.equal(globalThis.document.activeElement, list);
    await user.keyboard("[ArrowDown]");
    assert.equal(list.getAttribute("aria-activedescendant"), options[1].id);
    await user.keyboard("[ArrowUp]");
    assert.equal(list.getAttribute("aria-activedescendant"), options[0].id);
    await user.keyboard("[End]");
    assert.equal(list.getAttribute("aria-activedescendant"), options[1].id);
    await user.keyboard("a");
    assert.equal(list.getAttribute("aria-activedescendant"), options[0].id);
    await user.keyboard("[Enter]");
    assert.deepEqual(selections.at(-1), { key: "ana", eventType: "keydown" });

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
    const rowClicks = [];
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
    assert.equal(view.getByRole("row", { name: /vehicle 1/i }).getAttribute("aria-selected"), "true");
    await user.click(view.getByRole("row", { name: /vehicle 2/i }));
    assert.deepEqual(selections.at(-1), { key: "veh-2", eventType: "click" });
    assert.equal(view.getByRole("row", { name: /vehicle 1/i }).dataset.selected, "true");
    await assertNoAxeViolations(view.container);
    cleanup();

    const parityView = render(React.createElement(Table, {
      label: "Reference data grid parity",
      columns: [
        { key: "plate", label: "Plate", mono: true, sortable: true, width: 128 },
        { key: "driver", label: "Driver", align: "center" },
        { key: "trips", label: "Trips", align: "right", mono: true, sortable: true, sortValue: (row) => row.trips },
        { key: "status", label: "Status" },
      ],
      rows: [
        { id: "u2", plate: "KTR-882-A", driver: "Luis Perez", trips: 42, status: { label: "Ready", tone: "success" } },
        { id: "u1", plate: "JMX-214-B", driver: "Ana Sosa", trips: 18, status: { label: "Review", tone: "warning" } },
      ],
      rowKey: "id",
      selectedKey: "u2",
      defaultSort: { key: "trips", dir: -1 },
      onRowClick: (row, event) => rowClicks.push({ id: row.id, eventType: event.type }),
    }));
    assert.equal(parityView.getByRole("columnheader", { name: /trips/i }).getAttribute("aria-sort"), "descending");
    assert.equal(parityView.getAllByRole("row")[1].getAttribute("data-key"), "u2");
    assert.equal(parityView.getByRole("row", { name: /luis perez/i }).getAttribute("aria-selected"), "true");
    assert.equal(parityView.getByRole("cell", { name: /jmx-214-b/i }).dataset.mono, "true");
    assert.equal(parityView.getByRole("cell", { name: /ana sosa/i }).dataset.align, "center");
    assert.equal(parityView.getByRole("cell", { name: /ktr-882-a/i }).style.getPropertyValue("--comp-table-column-width"), "128px");
    assert.equal(parityView.getByText("Ready").closest(".badge").dataset.density, "sm");
    await user.click(parityView.getByRole("row", { name: /ana sosa/i }));
    assert.deepEqual(rowClicks.at(-1), { id: "u1", eventType: "click" });
    parityView.getByRole("row", { name: /luis perez/i }).focus();
    fireEvent.keyDown(parityView.getByRole("row", { name: /luis perez/i }), { key: "Enter" });
    assert.deepEqual(rowClicks.at(-1), { id: "u2", eventType: "keydown" });
    await assertNoAxeViolations(parityView.container);
    cleanup();

    const bulkChanges = [];
    const bulkView = render(React.createElement(Table, {
      label: "Bulk data grid parity",
      columns,
      rows,
      rowKey: "id",
      selection: ["veh-1"],
      onSelectionChange: (keys) => bulkChanges.push(keys),
      zebra: true,
      stickyHeader: true,
      surface: "embedded",
    }));
    const bulkRoot = bulkView.getByRole("table", { name: /bulk data grid parity/i }).closest(".table");
    assert.equal(bulkRoot.dataset.zebra, "true");
    assert.equal(bulkRoot.dataset.sticky, "true");
    assert.equal(bulkRoot.dataset.surface, "embedded");
    assert.equal(bulkView.getByLabelText(/select all rows/i).getAttribute("aria-checked"), "mixed");
    await user.click(bulkView.getByLabelText(/select vehicle 2/i));
    assert.deepEqual(bulkChanges.at(-1), ["veh-2", "veh-1"]);
    await user.click(bulkView.getByLabelText(/select all rows/i));
    assert.deepEqual(bulkChanges.at(-1), ["veh-2", "veh-1"]);
    await assertNoAxeViolations(bulkView.container);
    cleanup();

    const edits = [];
    const editView = render(React.createElement(Table, {
      label: "Editable data grid parity",
      columns: [
        { key: "label", label: "Vehicle", editable: true },
        { key: "score", label: "Score", align: "right", mono: true, editable: true },
      ],
      rows,
      rowKey: "id",
      onCellEdit: (key, columnKey, value) => edits.push({ key, columnKey, value }),
    }));
    fireEvent.doubleClick(editView.getByRole("cell", { name: /vehicle 1/i }));
    const editInput = editView.container.querySelector(".table__edit-input");
    assert.ok(editInput);
    fireEvent.change(editInput, { target: { value: "Vehicle 1 updated" } });
    fireEvent.keyDown(editInput, { key: "Enter" });
    assert.deepEqual(edits.at(-1), { key: "veh-1", columnKey: "label", value: "Vehicle 1 updated" });
    fireEvent.doubleClick(editView.getByRole("cell", { name: /^9$/i }));
    const cancelInput = editView.container.querySelector(".table__edit-input");
    fireEvent.keyDown(cancelInput, { key: "Escape" });
    assert.equal(editView.container.querySelector(".table__edit-input"), null);
    await assertNoAxeViolations(editView.container);
    cleanup();

    const emptyView = render(React.createElement(Table, {
      label: "Empty data grid parity",
      columns,
      rows: [],
      emptyLabel: "No vehicles match the filter",
    }));
    assert.equal(emptyView.getByText(/no vehicles match the filter/i).closest("td").className, "table__empty");
    assert.equal(emptyView.container.querySelectorAll(".table__empty .empty-state").length, 1);
    await assertNoAxeViolations(emptyView.container);
    cleanup();

    const treeView = render(React.createElement(Table, {
      label: "Tree data grid parity",
      columns: [
        { key: "label", label: "Group" },
        { key: "score", label: "Units", align: "right", mono: true },
      ],
      rows: [
        { id: "fleet", label: "Fleet", score: 2, children: [
          { id: "fleet-a", label: "Fleet A", score: 1 },
        ] },
      ],
      rowKey: "id",
      tree: true,
      defaultExpandedKey: "fleet",
    }));
    assert.equal(treeView.container.querySelectorAll("thead th").length, 3);
    assert.equal(treeView.getByRole("row", { name: /fleet a/i }).getAttribute("aria-level"), "2");
    assert.equal(treeView.container.querySelectorAll(".table__detail-row").length, 0);
    fireEvent.click(treeView.getByRole("button", { name: /collapse fleet/i }));
    assert.equal(treeView.queryByRole("row", { name: /fleet a/i }), null);
    fireEvent.click(treeView.getByRole("button", { name: /expand fleet/i }));
    assert.equal(treeView.getByRole("row", { name: /fleet a/i }).getAttribute("aria-level"), "2");
    await assertNoAxeViolations(treeView.container);
    cleanup();
  }

  console.log("P1 data display production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
