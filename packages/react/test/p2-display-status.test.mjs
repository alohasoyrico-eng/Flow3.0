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
const { cleanup, render } = await import("@testing-library/react");
const { Avatar, Badge, Chip, Tag } = await import("../dist/index.js");

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
    const view = render(React.createElement(Avatar, {
      name: "Ana Torres",
      density: "lg",
      status: "busy",
    }));
    const avatar = view.getByLabelText("Ana Torres");

    assert.equal(avatar.className, "avatar");
    assert.equal(avatar.dataset.density, "lg");
    assert.equal(avatar.dataset.status, "busy");
    assert.equal(avatar.dataset.state, "busy");
    assert.equal(view.getByText("AT").className, "avatar__initials");
    assert.equal(view.container.querySelector(".avatar__status")?.getAttribute("aria-hidden"), "true");
    assert.match(avatar.getAttribute("style") ?? "", /--comp-avatar-identity-bg/);

    view.rerender(React.createElement(Avatar, {
      name: "Ana Torres",
      src: "ana.png",
      state: "online",
    }));
    const image = view.getByRole("img", { name: "Ana Torres" });
    assert.equal(image.getAttribute("src"), "ana.png");
    assert.equal(view.getByLabelText("Ana Torres").dataset.state, "online");

    view.rerender(React.createElement(Avatar, {
      name: "",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const view = render(React.createElement(Badge, {
      label: "3",
      ariaLabel: "3 pending approvals",
      variant: "count",
      tone: "warning",
      state: "overflow",
      density: "sm",
      live: true,
    }));
    const badge = view.getByRole("status");

    assert.equal(badge.dataset.variant, "count");
    assert.equal(badge.dataset.tone, "warning");
    assert.equal(badge.dataset.state, "overflow");
    assert.equal(badge.dataset.density, "sm");
    assert.equal(badge.dataset.live, "true");
    assert.equal(badge.getAttribute("aria-live"), "polite");
    assert.equal(badge.getAttribute("aria-label"), "3 pending approvals");
    assert.equal(view.getByText("3").className, "badge__label");

    view.rerender(React.createElement(Badge, {
      label: "",
      ariaLabel: "Online",
      variant: "dot",
      tone: "success",
    }));
    assert.equal(view.getByLabelText("Online").dataset.variant, "dot");
    assert.equal(view.getByLabelText("Online").textContent, "");

    view.rerender(React.createElement(Badge, {
      label: "",
      variant: "dot",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const selectedChanges = [];
    const view = render(React.createElement(Chip, {
      label: "Fuel cards",
      variant: "filter",
      tone: "warning",
      density: "md",
      selected: true,
      icon: "local_gas_station",
      onSelectedChange: (selected, event) => selectedChanges.push({ selected, eventType: event.type }),
    }));
    const chip = view.getByRole("button", { name: /fuel cards/i });

    assert.equal(chip.dataset.variant, "filter");
    assert.equal(chip.dataset.tone, "warning");
    assert.equal(chip.dataset.state, "selected");
    assert.equal(chip.dataset.density, "md");
    assert.equal(chip.dataset.selected, "true");
    assert.equal(chip.getAttribute("aria-pressed"), "true");
    await user.click(chip);
    assert.deepEqual(selectedChanges, [{ selected: false, eventType: "click" }]);

    const removals = [];
    view.rerender(React.createElement(Chip, {
      label: "Expired",
      removable: true,
      onRemoveLabel: "Remove expired filter",
      onRemove: (label, event) => removals.push({ label, eventType: event.type }),
    }));
    const removable = view.getByRole("button", { name: /remove expired filter/i });
    assert.equal(removable.dataset.chipRemove, "true");
    await user.click(removable);
    assert.deepEqual(removals, [{ label: "Expired", eventType: "click" }]);

    view.rerender(React.createElement(Chip, {
      label: "Disabled",
      disabled: true,
      onSelectedChange: (selected, event) => selectedChanges.push({ selected, eventType: event.type }),
    }));
    assert.equal(view.getByRole("button", { name: /disabled/i }).disabled, true);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const clicks = [];
    const view = render(React.createElement(Tag, {
      label: "React",
      variant: "link",
      tone: "info",
      state: "focus",
      density: "lg",
      icon: "code",
      onClick: (event) => clicks.push(event.type),
    }));
    const tag = view.getByRole("button", { name: /react/i });

    assert.equal(tag.dataset.variant, "link");
    assert.equal(tag.dataset.tone, "info");
    assert.equal(tag.dataset.state, "focus");
    assert.equal(tag.dataset.density, "lg");
    assert.equal(tag.dataset.interactive, "true");
    assert.equal(view.getByText("code").className, "tag__icon");
    await user.click(tag);
    assert.deepEqual(clicks, ["click"]);

    view.rerender(React.createElement(Tag, {
      label: "Metadata",
      variant: "unknown",
      tone: "unknown",
      state: "unknown",
      density: "xl",
    }));
    const staticTag = view.getByText("Metadata").closest(".tag");
    assert.equal(staticTag.tagName, "SPAN");
    assert.equal(staticTag.dataset.variant, "metadata");
    assert.equal(staticTag.dataset.tone, "neutral");
    assert.equal(staticTag.dataset.state, "default");
    assert.equal(staticTag.hasAttribute("data-density"), false);
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 display/status production evidence passed");
} catch (error) {
  console.error(error);
  cleanup();
  process.exit(1);
}
