import assert from "node:assert/strict";
import { createInteractionHarness } from "./interaction-harness.mjs";

const {
  React,
  Accordion,
  Breadcrumbs,
  Card,
  cleanup,
  close,
  fireEvent,
  render,
  waitFor,
} = await createInteractionHarness();

try {
  const expandedChanges = [];
  const { getByRole, rerender: rerenderAccordion } = render(React.createElement(Accordion, {
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => expandedChanges.push({ expandedIds, eventType: event.type }),
  }));

  const overviewTrigger = getByRole("button", { name: /overview/i });
  const pricingTrigger = getByRole("button", { name: /pricing/i });

  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

  fireEvent.click(overviewTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), { expandedIds: ["overview"], eventType: "click" });

  fireEvent.click(pricingTrigger);
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(expandedChanges.at(-1), { expandedIds: ["pricing"], eventType: "click" });

  rerenderAccordion(React.createElement(Accordion, {
    expandedIds: ["overview"],
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => expandedChanges.push({ expandedIds, eventType: event.type }),
  }));
  await waitFor(() => assert.equal(overviewTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");

  fireEvent.click(pricingTrigger);
  assert.deepEqual(expandedChanges.at(-1), { expandedIds: ["pricing"], eventType: "click" });
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "false");
  rerenderAccordion(React.createElement(Accordion, {
    expandedIds: ["pricing"],
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => expandedChanges.push({ expandedIds, eventType: event.type }),
  }));
  assert.equal(pricingTrigger.getAttribute("aria-expanded"), "true");
  assert.equal(overviewTrigger.getAttribute("aria-expanded"), "false");

  cleanup();

  const multipleExpandedChanges = [];
  const { getByRole: getMultipleAccordionRole } = render(React.createElement(Accordion, {
    variant: "multiple",
    items: [
      { id: "overview", title: "Overview", content: "Route overview" },
      { id: "pricing", title: "Pricing", content: "Route pricing" },
    ],
    onExpandedChange: (expandedIds, event) => multipleExpandedChanges.push({ expandedIds, eventType: event.type }),
  }));

  const multipleOverviewTrigger = getMultipleAccordionRole("button", { name: /overview/i });
  const multiplePricingTrigger = getMultipleAccordionRole("button", { name: /pricing/i });
  fireEvent.click(multipleOverviewTrigger);
  fireEvent.click(multiplePricingTrigger);
  await waitFor(() => assert.equal(multipleOverviewTrigger.getAttribute("aria-expanded"), "true"));
  assert.equal(multiplePricingTrigger.getAttribute("aria-expanded"), "true");
  assert.deepEqual(multipleExpandedChanges.at(-1), { expandedIds: ["overview", "pricing"], eventType: "click" });

  cleanup();

  const preventedAccordionChanges = [];
  const accordionTriggerClicks = [];
  const { getByRole: getPreventedAccordionRole } = render(React.createElement(Accordion, {
    items: [
      {
        id: "prevented",
        title: "Prevented",
        content: "Blocked content",
        onClick: (event) => {
          accordionTriggerClicks.push(event.type);
          event.preventDefault();
        },
      },
    ],
    onExpandedChange: (expandedIds) => preventedAccordionChanges.push(expandedIds),
  }));

  const preventedAccordionTrigger = getPreventedAccordionRole("button", { name: /prevented/i });
  fireEvent.click(preventedAccordionTrigger);
  assert.deepEqual(accordionTriggerClicks, ["click"]);
  assert.equal(preventedAccordionTrigger.getAttribute("aria-expanded"), "false");
  assert.deepEqual(preventedAccordionChanges, []);

  cleanup();

  const clickedBreadcrumbs = [];
  const { getByRole: getBreadcrumbRole } = render(React.createElement(Breadcrumbs, {
    items: [
      {
        id: "fleet",
        label: "Fleet",
        href: "/fleet",
        onClick: (item, event) => clickedBreadcrumbs.push({
          item,
          defaultPrevented: event.defaultPrevented,
        }),
      },
      { id: "vehicle", label: "Vehicle", current: true },
    ],
  }));

  fireEvent.click(getBreadcrumbRole("link", { name: /fleet/i }));
  assert.equal(clickedBreadcrumbs.length, 1);
  assert.equal(clickedBreadcrumbs[0].item.id, "fleet");
  assert.equal(clickedBreadcrumbs[0].defaultPrevented, true);

  cleanup();

  const cardActions = [];
  const { getByRole: getCardRole } = render(React.createElement(Card, {
    title: "Wallet balance",
    value: "$8,412.50",
    interactive: true,
    actionKey: "wallet-balance",
    actions: [],
    onAction: (...args) => cardActions.push(args),
  }));

  const interactiveCard = getCardRole("button", { name: /wallet balance/i });
  fireEvent.click(interactiveCard);
  assert.equal(cardActions.length, 1);
  assert.equal(cardActions[0][0], "wallet-balance");
  assert.equal(cardActions[0][1], undefined);
  assert.equal(cardActions[0][2].type, "click");

  fireEvent.keyDown(interactiveCard, { key: "Enter" });
  assert.equal(cardActions.length, 2);
  assert.equal(cardActions[1][0], "wallet-balance");
  assert.equal(cardActions[1][1], undefined);
  assert.equal(cardActions[1][2].key, "Enter");

  cleanup();

  const preventedCardActions = [];
  const { getByRole: getPreventedCardRole } = render(React.createElement(Card, {
    title: "Prevented wallet",
    value: "$8,412.50",
    interactive: true,
    actionKey: "prevented-wallet",
    onClick: (event) => event.preventDefault(),
    onKeyDown: (event) => event.preventDefault(),
    onAction: (...args) => preventedCardActions.push(args),
  }));

  const preventedCard = getPreventedCardRole("button", { name: /prevented wallet/i });
  fireEvent.click(preventedCard);
  fireEvent.keyDown(preventedCard, { key: "Enter" });
  assert.deepEqual(preventedCardActions, []);

  cleanup();

  const nestedCardActions = [];
  const nestedActionClicks = [];
  const { getByRole: getNestedCardRole } = render(React.createElement(Card, {
    title: "Driver card",
    actions: [
      {
        key: "freeze",
        label: "Freeze",
        onClick: (event) => nestedActionClicks.push(event.type),
      },
    ],
    onAction: (...args) => nestedCardActions.push(args),
  }));

  fireEvent.click(getNestedCardRole("button", { name: /freeze/i }));
  assert.deepEqual(nestedActionClicks, ["click"]);
  assert.equal(nestedCardActions.length, 1);
  assert.equal(nestedCardActions[0][0], "freeze");
  assert.equal(nestedCardActions[0][1].label, "Freeze");
  assert.equal(nestedCardActions[0][2].type, "click");

  cleanup();

  const preventedNestedCardActions = [];
  const { getByRole: getPreventedNestedCardRole } = render(React.createElement(Card, {
    title: "Driver card",
    actions: [
      {
        key: "freeze",
        label: "Freeze",
        onClick: (event) => event.preventDefault(),
      },
    ],
    onAction: (...args) => preventedNestedCardActions.push(args),
  }));

  fireEvent.click(getPreventedNestedCardRole("button", { name: /freeze/i }));
  assert.deepEqual(preventedNestedCardActions, []);

  cleanup();
  console.log("interaction surface navigation passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
} finally {
  close();
}
