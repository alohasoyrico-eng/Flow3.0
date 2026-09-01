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
const { cleanup, render, waitFor } = await import("@testing-library/react");
const { Accordion, Breadcrumbs } = await import("../dist/index.js");

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
    const itemClicks = [];
    const items = [
      {
        id: "profile",
        title: "Profile",
        content: React.createElement("p", null, "Driver profile detail"),
        open: true,
        icon: "person",
        meta: "Ready",
      },
      {
        id: "documents",
        title: "Documents",
        content: "Insurance and license",
        onClick: (event) => itemClicks.push(event.type),
      },
      {
        id: "disabled",
        title: "Disabled",
        content: "Unavailable",
        disabled: true,
      },
    ];
    const view = render(React.createElement(Accordion, {
      items,
      density: "sm",
      multiple: true,
      onExpandedChange: (expandedIds, event) => changes.push({ expandedIds, eventType: event.type }),
    }));
    const accordion = view.container.querySelector(".accordion");
    const profile = view.getByRole("button", { name: /profile/i });
    const documents = view.getByRole("button", { name: /documents/i });
    const disabled = view.getByRole("button", { name: /disabled/i });

    assert.equal(accordion.dataset.variant, "multiple");
    assert.equal(accordion.dataset.multiple, "true");
    assert.equal(accordion.dataset.density, "sm");
    assert.equal(profile.getAttribute("aria-expanded"), "true");
    assert.equal(profile.getAttribute("aria-controls"), view.container.querySelector("[data-accordion-panel]")?.id);
    assert.equal(globalThis.document.getElementById(profile.getAttribute("aria-controls"))?.getAttribute("aria-hidden"), "false");

    await user.click(documents);
    await waitFor(() => assert.equal(documents.getAttribute("aria-expanded"), "true"));
    assert.deepEqual(itemClicks, ["click"]);
    assert.deepEqual(changes.at(-1), { expandedIds: ["profile", "documents"], eventType: "click" });

    documents.focus();
    assert.equal(globalThis.document.activeElement, documents);
    await user.keyboard("[ArrowDown]");
    assert.equal(globalThis.document.activeElement, profile);
    await user.keyboard("[ArrowUp]");
    assert.equal(globalThis.document.activeElement, documents);
    await user.keyboard("[Home]");
    assert.equal(globalThis.document.activeElement, profile);
    await user.keyboard("[End]");
    assert.equal(globalThis.document.activeElement, documents);
    await user.keyboard("[Escape]");
    await waitFor(() => assert.equal(documents.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(changes.at(-1), { expandedIds: ["profile"], eventType: "keydown" });

    await user.click(documents);
    await waitFor(() => assert.equal(documents.getAttribute("aria-expanded"), "true"));
    documents.focus();
    await user.keyboard("[Space]");
    await waitFor(() => assert.equal(documents.getAttribute("aria-expanded"), "false"));
    assert.deepEqual(changes.at(-1), { expandedIds: ["profile"], eventType: "click" });

    const before = changes.length;
    await user.click(disabled);
    assert.equal(disabled.disabled, true);
    assert.equal(changes.length, before);

    view.rerender(React.createElement(Accordion, {
      items,
      variant: "single",
      expandedIds: ["documents", "profile"],
      onExpandedChange: (expandedIds, event) => changes.push({ expandedIds, eventType: event.type }),
    }));
    assert.equal(profile.getAttribute("aria-expanded"), "false");
    assert.equal(documents.getAttribute("aria-expanded"), "true");
    await user.click(profile);
    assert.deepEqual(changes.at(-1), { expandedIds: ["profile"], eventType: "click" });
    assert.equal(documents.getAttribute("aria-expanded"), "true");

    view.rerender(React.createElement(Accordion, {
      items: [
        { id: "", title: "Invalid", content: "No stable id" },
        { id: "missing-content", title: "Missing" },
      ],
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Accordion, {
      defaultOpen: "documents",
      items: [
        { id: "profile", title: "Profile", content: "Driver profile", open: true },
        { id: "documents", title: "Documents", content: "Insurance" },
      ],
    }));
    assert.equal(view.getByRole("button", { name: /profile/i }).getAttribute("aria-expanded"), "false");
    assert.equal(view.getByRole("button", { name: /documents/i }).getAttribute("aria-expanded"), "true");
    cleanup();
  }

  {
    const user = createUser();
    const clicks = [];
    const items = [
      { id: "home", label: "Home", href: "/home" },
      { id: "docs", label: "Docs", onClick: (item, event) => clicks.push({ label: item.label, eventType: event.type }) },
      { id: "components", label: "Components", href: "/components" },
      { id: "button", label: "Button", current: true },
    ];
    const view = render(React.createElement(Breadcrumbs, {
      items,
      label: "Design system path",
      collapsedLabel: "More ancestors",
      variant: "overflow",
      state: "collapsed",
      density: "lg",
      maxItems: 3,
      fullWidth: true,
    }));
    const nav = view.getByRole("navigation", { name: /design system path/i });
    const list = view.container.querySelector("ol");
    const home = view.getByRole("link", { name: /home/i });
    const collapsed = view.container.querySelector(".breadcrumbs__target--collapsed");
    const current = view.getByText("Button").closest(".breadcrumbs__target");

    assert.equal(nav.className, "breadcrumbs");
    assert.equal(nav.dataset.variant, "overflow");
    assert.equal(nav.dataset.state, "collapsed");
    assert.equal(nav.dataset.density, "lg");
    assert.equal(nav.dataset.fullWidth, "true");
    assert.equal(list?.children.length, 3);
    assert.equal(home.getAttribute("href"), "/home");
    assert.equal(collapsed?.getAttribute("aria-label"), "More ancestors");
    assert.equal(current.getAttribute("aria-current"), "page");
    assert.equal(view.container.querySelectorAll(".breadcrumbs__separator[aria-hidden='true']").length, 2);

    view.rerender(React.createElement(Breadcrumbs, {
      items,
      label: "Design system path",
      variant: "standard",
    }));
    await user.click(view.getByRole("button", { name: /docs/i }));
    assert.deepEqual(clicks, [{ label: "Docs", eventType: "click" }]);

    view.rerender(React.createElement(Breadcrumbs, {
      items,
      label: "Design system path",
      variant: "mobile",
      disabled: true,
      state: "focus",
    }));
    const disabledNav = view.getByRole("navigation", { name: /design system path/i });
    assert.equal(disabledNav.getAttribute("aria-disabled"), "true");
    assert.equal(disabledNav.dataset.variant, "mobile");
    assert.equal(disabledNav.dataset.state, "disabled");
    assert.equal(view.container.querySelectorAll("li").length, 2);
    assert.equal(view.queryByRole("link", { name: /components/i }), null);
    assert.equal(view.queryByRole("button", { name: /docs/i }), null);

    view.rerender(React.createElement(Breadcrumbs, {
      items: [
        { label: "No key" },
        { id: "current", label: "Current" },
      ],
      label: "Filtered path",
      variant: "unknown",
      state: "unknown",
    }));
    const filteredNav = view.getByRole("navigation", { name: /filtered path/i });
    assert.equal(filteredNav.dataset.variant, "standard");
    assert.equal(filteredNav.dataset.state, "default");
    assert.equal(view.container.querySelectorAll("li").length, 2);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 navigation/disclosure production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
