#!/usr/bin/env node

import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

import { AgentWorkspace } from "../../react/src/templates/AgentWorkspace.js";
import { ConfigurationConsole } from "../../react/src/templates/ConfigurationConsole.js";
import { DriverCardWallet } from "../../react/src/templates/DriverCardWallet.js";
import { DriverMobileApp } from "../../react/src/templates/DriverMobileApp.js";
import { FleetDashboardSuite } from "../../react/src/templates/FleetDashboardSuite.js";
import { FleetManagerDesktop } from "../../react/src/templates/FleetManagerDesktop.js";
import { InternalOperationsConsole } from "../../react/src/templates/InternalOperationsConsole.js";
import { RoutesAndStations } from "../../react/src/templates/RoutesAndStations.js";
import { SettingsWorkspace } from "../../react/src/templates/SettingsWorkspace.js";

const require = createRequire(import.meta.url);
const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-template-visual-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-template-visual-governance-audit.md");
const tokensCssFile = path.join(root, "packages/tokens/styles/tokens.css");
const componentsCssFile = path.join(root, "packages/components/styles/components.css");

const codexRuntimeNodeModules = "/Users/r1c0/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules";
const codexChromiumExecutable = "/Users/r1c0/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing";

const templateContracts = [
  {
    id: "settings-workspace",
    Component: SettingsWorkspace,
    selectedProp: "selectedSection",
    defaultProp: "defaultSelectedSection",
    selectedValues: { loaded: "notifications", loading: "profile", permission: "profile" },
    slots: ["settings-navigation", "settings-workspace"],
    modules: ["section-navigation", "preference-management"],
    desktop: true,
  },
  {
    id: "internal-operations-console",
    Component: InternalOperationsConsole,
    selectedProp: "selectedModule",
    defaultProp: "defaultSelectedModule",
    selectedValues: { loaded: "tickets", loading: "cases", permission: "cases" },
    slots: ["global-shell", "operations-navigation", "operations-workspace"],
    modules: ["case-operations", "ticket-operations", "account-operations", "pricing-operations", "backoffice-approvals", "growth-operations"],
    desktop: true,
  },
  {
    id: "agent-workspace",
    Component: AgentWorkspace,
    selectedProp: "selectedConversation",
    defaultProp: "defaultSelectedConversation",
    selectedValues: { loaded: "route-help", loading: "handoff", permission: "handoff" },
    slots: ["global-shell", "conversation-list", "conversation-workspace", "context-panel"],
    modules: ["conversation-queue", "agent-conversation", "handoff-recovery"],
    desktop: true,
  },
  {
    id: "configuration-console",
    Component: ConfigurationConsole,
    selectedProp: "selectedModule",
    defaultProp: "defaultSelectedModule",
    selectedValues: { loaded: "drivers", loading: "permissions", permission: "permissions" },
    slots: ["global-shell", "navigation-region", "workspace"],
    modules: ["permission-matrix", "driver-lifecycle-table", "vehicle-lifecycle-table"],
    desktop: true,
  },
  {
    id: "fleet-dashboard-suite",
    Component: FleetDashboardSuite,
    selectedProp: "selectedDashboard",
    defaultProp: "defaultSelectedDashboard",
    selectedValues: { loaded: "finance", loading: "overview", permission: "overview" },
    slots: ["global-shell", "navigation-region", "workspace"],
    modules: ["dashboard-switcher", "shared-filter-bar", "domain-kpi-stack", "drill-down-table"],
    desktop: true,
  },
  {
    id: "fleet-manager-desktop",
    Component: FleetManagerDesktop,
    selectedProp: "selectedDashboard",
    defaultProp: "defaultSelectedDashboard",
    selectedValues: { loaded: "fuel", loading: "overview", permission: "overview" },
    slots: ["global-shell", "navigation-region", "workspace"],
    modules: ["executive-kpi-band", "exception-inbox", "cost-center-scope-permissions"],
    desktop: true,
  },
  {
    id: "driver-card-wallet",
    Component: DriverCardWallet,
    selectedProp: "selectedSection",
    defaultProp: "defaultSelectedSection",
    selectedValues: { loaded: "movements", loading: "card", permission: "card" },
    slots: ["wallet-shell", "workspace"],
    modules: ["wallet-navigation", "card-status-block", "quick-actions", "movement-receipt-detail", "dispute-entry-point"],
    desktop: false,
  },
  {
    id: "driver-mobile-app",
    Component: DriverMobileApp,
    selectedProp: "selectedTab",
    defaultProp: "defaultSelectedTab",
    selectedValues: { loaded: "routes", loading: "home", permission: "home" },
    slots: ["mobile-shell", "workspace"],
    modules: ["mobile-navigation", "mobile-card-overview", "driver-readiness-onboarding", "routes-and-nearby-stations-mobile", "recent-movement-feed", "support-and-dispute-path"],
    desktop: false,
  },
  {
    id: "routes-and-stations",
    Component: RoutesAndStations,
    selectedProp: "selectedStationKey",
    defaultProp: "defaultSelectedStationKey",
    selectedValues: { loaded: "industrial", loading: "centro", permission: "centro" },
    slots: ["discovery-region", "decision-region"],
    modules: ["routes-and-nearby-stations-mobile", "map-with-station-pins", "fallback-station-list", "station-services-panel", "route-handoff"],
    desktop: false,
  },
];

const visualCases = [
  { id: "loaded-sm", state: "loaded", density: "sm", controlled: true },
  { id: "loading-md", state: "loading", density: "md", controlled: false },
  { id: "permission-lg", state: "permission", density: "lg", controlled: false },
];

const viewports = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 390, height: 844 },
};

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function resolvePlaywright() {
  const candidates = [
    "playwright",
    path.join(codexRuntimeNodeModules, "playwright"),
  ];
  const errors = [];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch (error) {
      errors.push(`${candidate}: ${error.message}`);
    }
  }
  throw new Error(`Playwright is required for real template visual QA. Tried ${errors.join(" | ")}`);
}

function propsForCase(contract, visualCase) {
  const selected = contract.selectedValues[visualCase.state];
  const props = {
    density: visualCase.density,
    state: visualCase.state,
    "data-visual-case": visualCase.id,
  };
  props[visualCase.controlled ? contract.selectedProp : contract.defaultProp] = selected;
  return props;
}

function htmlForCase(contract, visualCase) {
  const markup = renderToStaticMarkup(React.createElement(contract.Component, propsForCase(contract, visualCase)));
  const css = `${read(tokensCssFile)}\n${read(componentsCssFile)}`;
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
${css}
html, body {
  margin: 0;
  min-height: 100%;
  background: var(--sys-color-surface-canvas, #f7f8fa);
}
body {
  box-sizing: border-box;
  color: var(--sys-color-text-primary, #1f2933);
  font-family: var(--sys-typography-font-family-body, system-ui, sans-serif);
  padding: 16px;
}
*, *::before, *::after {
  box-sizing: border-box;
}
[data-flow-template] {
  inline-size: 100%;
  min-block-size: calc(100vh - 32px);
}
</style>
</head>
<body>${markup}</body>
</html>`;
}

function overlapArea(a, b) {
  const x = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
  const y = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
  return x * y;
}

async function inspectCase(page, contract, visualCase) {
  const viewport = contract.desktop ? viewports.desktop : viewports.mobile;
  await page.setViewportSize(viewport);
  await page.setContent(htmlForCase(contract, visualCase), { waitUntil: "load" });
  const rootLocator = page.locator(`[data-flow-template="${contract.id}"]`).first();
  await rootLocator.waitFor({ state: "visible", timeout: 5000 });
  const screenshot = await rootLocator.screenshot({ type: "png" });
  const metrics = await page.evaluate(({ contractId, slots, modules, density, state, viewportWidth }) => {
    const root = document.querySelector(`[data-flow-template="${contractId}"]`);
    const rectToObject = (rect) => ({
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height,
    });
    const visibleElements = [...document.body.querySelectorAll("*")].filter((element) => {
      const rect = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return rect.width > 0 && rect.height > 0 && style.visibility !== "hidden" && style.display !== "none";
    });
    const visualSignatures = new Set(visibleElements.map((element) => {
      const style = window.getComputedStyle(element);
      return [
        style.backgroundColor,
        style.color,
        style.borderColor,
        style.borderRadius,
        style.boxShadow,
        style.paddingBlockStart,
        style.paddingInlineStart,
      ].join("|");
    }));
    const slotRects = slots.map((slot) => {
      const element = document.querySelector(`[data-template-slot="${slot}"]`);
      const rect = element?.getBoundingClientRect();
      return { slot, exists: Boolean(element), rect: rect ? rectToObject(rect) : null };
    });
    const moduleRects = modules.map((module) => {
      const element = document.querySelector(`[data-template-module="${module}"]`);
      const rect = element?.getBoundingClientRect();
      return { module, exists: Boolean(element), rect: rect ? rectToObject(rect) : null };
    });
    return {
      rootRect: root ? rectToObject(root.getBoundingClientRect()) : null,
      documentScrollWidth: document.documentElement.scrollWidth,
      viewportWidth,
      visibleElementCount: visibleElements.length,
      surfaceCount: document.querySelectorAll('[data-flow-primitive="surface"]').length,
      densityMarkers: document.querySelectorAll(`[data-density="${density}"]`).length,
      stateMarkers: document.querySelectorAll(`[data-state="${state}"], [data-template-state="${state}"]`).length,
      visualSignatureCount: visualSignatures.size,
      bodyTextLength: document.body.innerText.trim().length,
      slotRects,
      moduleRects,
    };
  }, {
    contractId: contract.id,
    slots: contract.slots,
    modules: contract.modules,
    density: visualCase.density,
    state: visualCase.state,
    viewportWidth: viewport.width,
  });

  const failures = [];
  if (!metrics.rootRect) failures.push("missing template root");
  if ((metrics.rootRect?.width ?? 0) < viewport.width * 0.72) failures.push(`root width too small (${metrics.rootRect?.width ?? 0}/${viewport.width})`);
  if ((metrics.rootRect?.height ?? 0) < Math.min(420, viewport.height * 0.5)) failures.push(`root height too small (${metrics.rootRect?.height ?? 0}/${viewport.height})`);
  if (metrics.documentScrollWidth > viewport.width + 2) failures.push(`horizontal overflow (${metrics.documentScrollWidth}/${viewport.width})`);
  if (metrics.visibleElementCount < 12) failures.push(`too few visible elements (${metrics.visibleElementCount})`);
  if (metrics.surfaceCount < 4) failures.push(`Surface cascade too shallow (${metrics.surfaceCount})`);
  if (metrics.densityMarkers < 6) failures.push(`density cascade too shallow (${metrics.densityMarkers})`);
  if (metrics.stateMarkers < 1) failures.push(`state marker missing for ${visualCase.state}`);
  if (metrics.visualSignatureCount < 6) failures.push(`visual CSS diversity too low (${metrics.visualSignatureCount})`);
  if (metrics.bodyTextLength < 80) failures.push(`rendered text too short (${metrics.bodyTextLength})`);
  if (screenshot.byteLength < 1500) failures.push(`screenshot too small (${screenshot.byteLength} bytes)`);

  for (const row of [...metrics.slotRects, ...metrics.moduleRects]) {
    const label = row.slot ? `slot ${row.slot}` : `module ${row.module}`;
    if (!row.exists) failures.push(`missing ${label}`);
    if (row.exists && ((row.rect?.width ?? 0) < 1 || (row.rect?.height ?? 0) < 1)) failures.push(`zero-size ${label}`);
  }

  for (let index = 0; index < metrics.slotRects.length; index += 1) {
    const current = metrics.slotRects[index];
    if (!current.rect) continue;
    for (const next of metrics.slotRects.slice(index + 1)) {
      if (!next.rect) continue;
      const area = overlapArea(current.rect, next.rect);
      const smallerArea = Math.min(current.rect.width * current.rect.height, next.rect.width * next.rect.height);
      if (area > 16 && area / smallerArea > 0.12) {
        failures.push(`slot overlap ${current.slot}/${next.slot} (${Math.round(area)}px2)`);
      }
    }
  }

  return {
    template: contract.id,
    case: visualCase.id,
    status: failures.length ? "fail" : "pass",
    viewport: contract.desktop ? "desktop" : "mobile",
    width: viewport.width,
    height: viewport.height,
    state: visualCase.state,
    density: visualCase.density,
    screenshotCaptured: true,
    metrics,
    failures,
  };
}

async function createReport() {
  const { chromium } = resolvePlaywright();
  const launchOptions = {
    headless: true,
  };
  if (fs.existsSync(codexChromiumExecutable)) launchOptions.executablePath = codexChromiumExecutable;
  const browser = await chromium.launch(launchOptions);
  const page = await browser.newPage();
  const visualRows = [];
  try {
    for (const contract of templateContracts) {
      for (const visualCase of visualCases) {
        visualRows.push(await inspectCase(page, contract, visualCase));
      }
    }
  } finally {
    await browser.close();
  }

  const gaps = visualRows.flatMap((row) => row.failures.map((failure) => `${row.template}/${row.case}: ${failure}`));
  const inventory = {
    templatesAudited: templateContracts.length,
    visualCases: visualRows.length,
    passingVisualCases: visualRows.filter((row) => row.status === "pass").length,
    screenshotsCaptured: visualRows.filter((row) => row.screenshotCaptured).length,
    viewportProfiles: new Set(visualRows.map((row) => row.viewport)).size,
    densityCases: new Set(visualRows.map((row) => row.density)).size,
    stateCases: new Set(visualRows.map((row) => row.state)).size,
    horizontalOverflowFindings: visualRows.reduce((total, row) => total + row.failures.filter((failure) => failure.includes("horizontal overflow")).length, 0),
    blankOrShallowRenderFindings: visualRows.reduce((total, row) => total + row.failures.filter((failure) => /too few visible|too shallow|too short|too small|diversity/.test(failure)).length, 0),
    zeroSizeFindings: visualRows.reduce((total, row) => total + row.failures.filter((failure) => failure.includes("zero-size")).length, 0),
    slotOverlapFindings: visualRows.reduce((total, row) => total + row.failures.filter((failure) => failure.includes("slot overlap")).length, 0),
    missingSlotOrModuleFindings: visualRows.reduce((total, row) => total + row.failures.filter((failure) => failure.startsWith("missing slot") || failure.startsWith("missing module")).length, 0),
    reactTemplateVisualGovernanceDebt: gaps.length,
  };

  return {
    status: gaps.length ? "fail" : "pass",
    audit: "react template visual governance",
    principle: "React templates must render the full Flow cascade in a real browser with package CSS, Surface primitives, density/state propagation, visible slots/modules, and no viewport overflow before Docs can be trusted as evidence.",
    scope: {
      css: [rel(tokensCssFile), rel(componentsCssFile)],
      templates: templateContracts.map((contract) => contract.id),
      cases: visualCases.map((visualCase) => visualCase.id),
    },
    inventory,
    visualRows,
    gaps,
  };
}

function renderMarkdown(report) {
  const lines = [
    "# React Template Visual Governance Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Visual Cases",
    "",
    "| Template | Case | Status | Viewport | State | Density | Surfaces | Density markers | Screenshot |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...report.visualRows.map((row) => `| ${row.template} | ${row.case} | ${row.status} | ${row.viewport} ${row.width}x${row.height} | ${row.state} | ${row.density} | ${row.metrics.surfaceCount} | ${row.metrics.densityMarkers} | ${row.screenshotCaptured ? "captured" : "missing"} |`),
    "",
    "## Gates",
    "",
    "- Browser render: required through Playwright.",
    "- CSS cascade: tokens.css and components.css are loaded directly from Flow package styles.",
    "- Root: every template root must be visible and wide enough for its viewport.",
    "- Surface: every visual case must show a non-shallow Surface cascade.",
    "- Density/state: markers must propagate beyond the root.",
    "- Slots/modules: required template slots and modules must exist and have non-zero layout boxes.",
    "- Viewport: horizontal overflow and slot overlap are fail-level findings.",
    "",
    "## Gaps",
    "",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${escapeHtml(gap)}`) : ["- None"]),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

const report = await createReport();
const json = `${JSON.stringify(report, null, 2)}\n`;
const markdown = renderMarkdown(report);

if (checkMode) {
  const previousJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
  const previousMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
  const stale = previousJson !== json || previousMarkdown !== markdown;
  if (stale || report.status !== "pass") {
    console.error(`React template visual governance audit is ${report.status}${stale ? " and outputs are stale" : ""}. Run node ${rel(pathToFileURL(import.meta.url).pathname)}.`);
    if (report.gaps.length) console.error(report.gaps.join("\n"));
    process.exitCode = 1;
  }
} else {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
}

console.log(JSON.stringify({
  status: report.status,
  output: rel(jsonOutput),
  inventory: report.inventory,
}, null, 2));
