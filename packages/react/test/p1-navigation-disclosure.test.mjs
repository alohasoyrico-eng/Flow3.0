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
const { Pagination, SegmentedControl, TreeView } = await import("../dist/index.js");

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
    const changes = [];
    const view = render(React.createElement(SegmentedControl, {
      label: "View mode",
      density: "sm",
      items: [
        { key: "list", label: "List" },
        { key: "grid", label: "Grid", disabled: true },
        { key: "map", label: "Map" },
      ],
      onValueChange: (key, event) => changes.push({ key, eventType: event.type }),
    }));
    const list = view.getByRole("tab", { name: /list/i });
    const map = view.getByRole("tab", { name: /map/i });
    const tablist = view.getByRole("tablist", { name: /view mode/i });

    assert.equal(tablist.dataset.density, "sm");
    assert.equal(list.getAttribute("aria-selected"), "true");
    await user.click(map);
    await waitFor(() => assert.equal(map.getAttribute("aria-selected"), "true"));
    assert.deepEqual(changes.at(-1), { key: "map", eventType: "click" });

    fireEvent.keyDown(map, { key: "ArrowLeft" });
    await waitFor(() => assert.equal(list.getAttribute("aria-selected"), "true"));
    assert.deepEqual(changes.at(-1), { key: "list", eventType: "keydown" });
    fireEvent.keyDown(list, { key: "End" });
    assert.deepEqual(changes.at(-1), { key: "map", eventType: "keydown" });

    view.rerender(React.createElement(SegmentedControl, {
      label: "View mode",
      selectedKey: "list",
      items: [
        { key: "list", label: "List" },
        { key: "map", label: "Map" },
      ],
      onValueChange: (key, event) => changes.push({ key, eventType: event.type }),
    }));
    await user.click(map);
    assert.equal(changes.at(-1).key, "map");
    assert.equal(map.getAttribute("aria-selected"), "false");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const changes = [];
    const getPageLabel = (page) => `Results page ${page}`;
    const view = render(React.createElement(Pagination, {
      label: "Results pages",
      previousLabel: "Previous results page",
      nextLabel: "Next results page",
      pageCount: 6,
      getPageLabel,
      onPageChange: (page, event) => changes.push({ page, eventType: event.type }),
    }));
    const nav = view.getByRole("navigation", { name: /results pages/i });
    const pageOne = view.getByRole("button", { name: /^results page 1$/i });

    assert.equal(nav.dataset.page, "1");
    assert.equal(pageOne.getAttribute("aria-current"), "page");
    await user.click(view.getByRole("button", { name: /next results page/i }));
    await waitFor(() => assert.equal(view.getByRole("button", { name: /^results page 2$/i }).getAttribute("aria-current"), "page"));
    assert.deepEqual(changes.at(-1), { page: 2, eventType: "click" });

    const previous = view.getByRole("button", { name: /previous results page/i });
    previous.focus();
    assert.equal(globalThis.document.activeElement, previous);
    await user.keyboard("[Enter]");
    await waitFor(() => assert.equal(view.getByRole("button", { name: /^results page 1$/i }).getAttribute("aria-current"), "page"));
    assert.deepEqual(changes.at(-1), { page: 1, eventType: "click" });

    view.rerender(React.createElement(Pagination, {
      label: "Results pages",
      previousLabel: "Previous results page",
      nextLabel: "Next results page",
      page: 4,
      pageCount: 6,
      getPageLabel,
      onPageChange: (page, event) => changes.push({ page, eventType: event.type }),
    }));
    assert.equal(view.getByRole("button", { name: /^results page 4$/i }).getAttribute("aria-current"), "page");
    await user.click(view.getByRole("button", { name: /^results page 5$/i }));
    assert.equal(changes.at(-1).page, 5);
    assert.equal(view.getByRole("button", { name: /^results page 4$/i }).getAttribute("aria-current"), "page");

    view.rerender(React.createElement(Pagination, {
      label: "Results pages",
      previousLabel: "Previous results page",
      nextLabel: "Next results page",
      page: 4,
      pageCount: 6,
      getPageLabel,
      disabled: true,
      onPageChange: (page, event) => changes.push({ page, eventType: event.type }),
    }));
    const before = changes.length;
    await user.click(view.getByRole("button", { name: /^results page 5$/i }));
    assert.equal(changes.length, before);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const selected = [];
    const expanded = [];
    const nodes = [
      { key: "root", label: "Workspace", expanded: true },
      { key: "routes", label: "Routes", level: 2, selected: true },
      { key: "stations", label: "Stations", level: 2 },
      { key: "admin", label: "Administration", expanded: false },
      { key: "roles", label: "Roles", level: 2 },
    ];
    const view = render(React.createElement(TreeView, {
      label: "Workspace navigation",
      density: "md",
      nodes,
      onSelect: (key, event) => selected.push({ key, eventType: event.type }),
      onExpandedChange: (keys, event) => expanded.push({ keys, eventType: event.type, key: event.key }),
    }));
    const tree = view.getByRole("tree", { name: /workspace navigation/i });
    const root = view.getByRole("treeitem", { name: /workspace/i });
    const routes = view.getByRole("treeitem", { name: /routes/i });
    const admin = view.getByRole("treeitem", { name: /administration/i });

    assert.equal(tree.dataset.density, "md");
    assert.equal(routes.getAttribute("aria-selected"), "true");
    await user.click(root);
    assert.deepEqual(selected.at(-1), { key: "root", eventType: "click" });
    assert.deepEqual(expanded.at(-1).keys, []);

    fireEvent.keyDown(root, { key: "ArrowRight" });
    assert.deepEqual(expanded.at(-1).keys, ["root"]);
    fireEvent.keyDown(root, { key: "ArrowDown" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.textContent.includes("Routes"), true));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "ArrowUp" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.textContent.includes("Workspace"), true));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "ArrowDown" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.textContent.includes("Routes"), true));
    fireEvent.keyDown(globalThis.document.activeElement, { key: "End" });
    await waitFor(() => assert.equal(globalThis.document.activeElement?.textContent.includes("Administration"), true));

    view.rerender(React.createElement(TreeView, {
      label: "Workspace navigation",
      nodes,
      selectedKey: "routes",
      expandedKeys: ["root"],
      onSelect: (key, event) => selected.push({ key, eventType: event.type }),
      onExpandedChange: (keys, event) => expanded.push({ keys, eventType: event.type, key: event.key }),
    }));
    await user.click(admin);
    assert.equal(selected.at(-1).key, "admin");
    assert.deepEqual(expanded.at(-1).keys, ["root", "admin"]);
    assert.equal(admin.getAttribute("aria-expanded"), "false");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P1 navigation/disclosure production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
