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
const { ChartPanel, KpiTile } = await import("../dist/index.js");

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
    const view = render(React.createElement(ChartPanel, {
      label: "Authorizations by day",
      value: "842",
      caption: "Last 7 days",
      values: [12, 28, Number.NaN, -4],
      labels: ["Mon", "Tue", "Wed", "Thu"],
      variant: "bars",
      state: "warning",
      tone: "warning",
      density: "sm",
      fullWidth: true,
    }));
    const panel = view.container.querySelector(".chart-panel");
    const group = view.getByRole("group", { name: /authorizations by day/i });
    const bars = view.container.querySelectorAll(".chart-panel__bar-group");
    const option = JSON.parse(view.container.querySelector(".chart-panel__option")?.textContent ?? "{}");

    assert.equal(panel?.tagName, "ARTICLE");
    assert.equal(panel?.dataset.chartPrimitive, "charts");
    assert.equal(panel?.dataset.chartEngine, "echarts-option");
    assert.equal(panel?.dataset.variant, "bars");
    assert.equal(panel?.dataset.state, "warning");
    assert.equal(panel?.dataset.tone, "warning");
    assert.equal(panel?.dataset.density, "sm");
    assert.equal(panel?.dataset.fullWidth, "true");
    assert.match(group.getAttribute("aria-label") ?? "", /Authorizations by day/);
    assert.equal(view.getByText("842").tagName, "OUTPUT");
    assert.equal(bars.length, 4);
    assert.equal(bars[0]?.getAttribute("role"), "listitem");
    assert.equal(bars[0]?.getAttribute("tabindex"), "0");
    assert.equal(bars[0]?.getAttribute("data-tooltip"), "Mon: 12");
    bars[0]?.focus();
    assert.equal(globalThis.document.activeElement, bars[0]);
    await user.tab();
    assert.equal(globalThis.document.activeElement, bars[1]);
    assert.equal(option.engine, "apache-echarts");
    assert.equal(option.type, "bars");
    assert.deepEqual(option.echartsOption.series[0].data, [12, 28, 0, 0]);
    assert.equal(Array.isArray(option.tableFallback), true);
    assert.deepEqual(option.tableFallback.map((row) => row.label), ["Mon", "Tue", "Wed", "Thu"]);

    view.rerender(React.createElement(ChartPanel, {
      label: "Fuel comparison",
      values: [50, 30],
      labels: ["Diesel", "EV"],
      comparisons: [
        { id: "actual", label: "Actual", values: [50, 30] },
        { id: "", label: "Invalid", values: [99] },
        { id: "target", label: "Target", values: [45, 40] },
      ],
      variant: "comparison",
      state: "unknown",
      tone: "unknown",
    }));
    const comparisonPanel = view.container.querySelector(".chart-panel");
    const comparisonMarks = view.container.querySelectorAll(".chart-panel__comparison-group");
    const comparisonOption = JSON.parse(view.container.querySelector(".chart-panel__option")?.textContent ?? "{}");
    assert.equal(comparisonPanel?.dataset.variant, "comparison");
    assert.equal(comparisonPanel?.dataset.state, "default");
    assert.equal(comparisonPanel?.dataset.tone, "neutral");
    assert.equal(comparisonMarks.length, 2);
    assert.equal(comparisonMarks[0]?.getAttribute("tabindex"), "0");
    assert.equal(comparisonOption.echartsOption.series.length, 2);

    view.rerender(React.createElement(ChartPanel, {
      label: "",
      values: [1, 2],
    }));
    assert.equal(view.container.textContent, "");
    view.rerender(React.createElement(ChartPanel, {
      label: "No data",
      values: [],
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  {
    const user = createUser();
    const selected = [];
    const clickEvents = [];
    const view = render(React.createElement(KpiTile, {
      label: "Fuel spend",
      value: "$84.2k",
      delta: "+12% vs last week",
      trend: "up",
      tone: "warning",
      variant: "drill-in",
      state: "selected",
      density: "lg",
      selected: true,
      icon: "local_gas_station",
      values: [4, 10, 6],
      onClick: (event) => clickEvents.push(event.type),
      onSelect: (metric, event) => selected.push({ metric, eventType: event.type }),
    }));
    const tile = view.getByRole("button", { name: /fuel spend \$84\.2k, \+12% vs last week/i });

    assert.equal(tile.tagName, "ARTICLE");
    assert.equal(tile.tabIndex, 0);
    assert.equal(tile.dataset.variant, "drill-in");
    assert.equal(tile.dataset.state, "selected");
    assert.equal(tile.dataset.density, "lg");
    assert.equal(tile.dataset.selected, "true");
    assert.equal(tile.getAttribute("aria-pressed"), "true");
    assert.equal(view.container.querySelector(".kpi-tile__icon")?.getAttribute("aria-hidden"), "true");
    await user.click(tile);
    assert.deepEqual(clickEvents, ["click"]);
    assert.deepEqual(selected.at(-1), {
      metric: {
        label: "Fuel spend",
        value: "$84.2k",
        delta: "+12% vs last week",
        tone: "warning",
        variant: "drill-in",
      },
      eventType: "click",
    });

    tile.focus();
    await user.keyboard("[Enter]");
    assert.equal(selected.at(-1)?.eventType, "keydown");
    await user.keyboard("[Space]");
    assert.equal(selected.at(-1)?.eventType, "keydown");

    view.rerender(React.createElement(KpiTile, {
      label: "Open blockers",
      value: "7",
      href: "/blockers",
      variant: "drill-in",
      tone: "danger",
    }));
    const link = view.getByRole("link", { name: /open blockers 7/i });
    assert.equal(link.getAttribute("href"), "/blockers");

    view.rerender(React.createElement(KpiTile, {
      label: "Open blockers",
      value: "7",
      loading: true,
      onSelect: (metric, event) => selected.push({ metric, eventType: event.type }),
    }));
    const loadingTile = view.container.querySelector(".kpi-tile");
    const beforeLoading = selected.length;
    assert.equal(loadingTile?.dataset.state, "loading");
    await user.click(loadingTile);
    assert.equal(selected.length, beforeLoading);

    view.rerender(React.createElement(KpiTile, {
      label: "Open blockers",
      value: "7",
      disabled: true,
      onSelect: (metric, event) => selected.push({ metric, eventType: event.type }),
    }));
    const disabledTile = view.container.querySelector(".kpi-tile");
    const beforeDisabled = selected.length;
    assert.equal(disabledTile?.getAttribute("aria-disabled"), "true");
    await user.click(disabledTile);
    assert.equal(selected.length, beforeDisabled);

    view.rerender(React.createElement(KpiTile, {
      label: "Invalid props",
      value: "12",
      variant: "unknown",
      tone: "unknown",
      trend: "unknown",
      state: "unknown",
    }));
    const fallback = view.container.querySelector(".kpi-tile");
    assert.equal(fallback?.dataset.variant, "standard");
    assert.equal(fallback?.dataset.state, "default");
    assert.equal(fallback?.className, "kpi-tile kpi-tile--neutral");

    view.rerender(React.createElement(KpiTile, {
      label: "Missing value",
      value: "",
    }));
    assert.equal(view.container.textContent, "");
    await assertNoAxeViolations(view.container);
    cleanup();
  }

  console.log("P2 data-display production evidence passed");
} catch (error) {
  cleanup();
  console.error(error);
  process.exit(1);
}
