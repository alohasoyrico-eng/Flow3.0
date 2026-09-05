#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/tabs-2026-08-18/interactive/react-runtime.html?fresh=tabs-focus-inset-runtime-1";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/tabs-2026-08-18/interactive/react-runtime.html");
const browserCandidates = [
  "/Users/r1c0/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Users/r1c0/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
];

function browserLaunchOptions() {
  const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath } : {};
}

function mimeType(filePath) {
  if (filePath.endsWith(".html")) return "text/html; charset=utf-8";
  if (filePath.endsWith(".js") || filePath.endsWith(".mjs")) return "text/javascript; charset=utf-8";
  if (filePath.endsWith(".css")) return "text/css; charset=utf-8";
  if (filePath.endsWith(".json")) return "application/json; charset=utf-8";
  if (filePath.endsWith(".svg")) return "image/svg+xml";
  if (filePath.endsWith(".woff2")) return "font/woff2";
  return "application/octet-stream";
}

function createStaticServer(root) {
  return http.createServer((request, response) => {
    const url = new URL(request.url || "/", "http://127.0.0.1");
    const decodedPath = decodeURIComponent(url.pathname);
    const filePath = path.normalize(path.join(root, decodedPath));
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    fs.readFile(filePath, (error, content) => {
      if (error) {
        response.writeHead(404);
        response.end("Not found");
        return;
      }
      response.writeHead(200, { "content-type": mimeType(filePath) });
      response.end(content);
    });
  });
}

if (!fs.existsSync(demoFile)) {
  console.error("Missing Tabs runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=tabs");
  process.exit(1);
}

const server = createStaticServer(workspaceRoot);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const url = `http://127.0.0.1:${port}${demoPath}`;

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 1 });
const logs = [];
const pageErrors = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") logs.push({ type: message.type(), text: message.text() });
});
page.on("pageerror", (error) => pageErrors.push(error.message));

await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(300);

const before = await page.evaluate(() => {
  const root = document.querySelector('.tabs[aria-label="Pill tabs"]');
  const tabs = [...(root?.querySelectorAll('[role="tab"]') || [])];
  const selected = root?.querySelector('[role="tab"][aria-selected="true"]');
  const beforeStyle = root ? getComputedStyle(root, "::before") : null;
  const selectedStyle = selected ? getComputedStyle(selected) : null;
  const disabled = root?.querySelector('[role="tab"]:disabled');
  const densities = ["sm", "md", "lg"].map((density) => {
    const densityRoot = document.querySelector(`.tabs[data-density="${density}"]`);
    const tab = densityRoot?.querySelector('[role="tab"]');
    return {
      density,
      height: Math.round(tab?.getBoundingClientRect().height || 0),
      fontSize: Number.parseFloat(getComputedStyle(tab || document.body).fontSize),
      paddingLeft: Number.parseFloat(getComputedStyle(tab || document.body).paddingLeft),
    };
  });
  const fitContentChecks = [...document.querySelectorAll(".audit-grid--tabs .audit-card .tabs")].map((tablist) => {
    const card = tablist.closest(".audit-card");
    const style = getComputedStyle(tablist);
    const tablistRect = tablist.getBoundingClientRect();
    const cardRect = card?.getBoundingClientRect();
    return {
      label: tablist.getAttribute("aria-label") || "",
      tablistWidth: Math.round(tablistRect.width),
      cardWidth: Math.round(cardRect?.width || 0),
      rightGap: Math.round((cardRect?.right || 0) - tablistRect.right),
      overflowY: style.overflowY,
      scrollbarWidth: style.scrollbarWidth,
    };
  });
  return {
    tablistCount: document.querySelectorAll('[role="tablist"]').length,
    pillVariantCount: document.querySelectorAll('.tabs[data-variant="pill"]').length,
    underlineVariantCount: document.querySelectorAll('.tabs[data-variant="underline"]').length,
    defaultAliasCount: [...document.querySelectorAll(".tabs")].filter((item) => item.getAttribute("aria-label") === "Default alias" && item.getAttribute("data-variant") === "pill").length,
    tabCount: tabs.length,
    disabledLabel: disabled?.textContent?.trim() || "",
    selectedKey: selected?.getAttribute("data-key") || "",
    selectedTabIndex: selected?.getAttribute("tabindex") || "",
    tabIndexZeroCount: tabs.filter((tab) => tab.getAttribute("tabindex") === "0").length,
    selectedColor: selectedStyle?.color || "",
    inactiveColor: tabs[1] ? getComputedStyle(tabs[1]).color : "",
    selectedWeight: selectedStyle?.fontWeight || "",
    inactiveWeight: tabs[1] ? getComputedStyle(tabs[1]).fontWeight : "",
    indicatorWidth: Number.parseFloat(beforeStyle?.width || "0"),
    indicatorLeft: Number.parseFloat(beforeStyle?.left || "0"),
    indicatorShadow: beforeStyle?.boxShadow || "",
    badgeCount: root?.querySelectorAll(".badge").length || 0,
    bodyOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    densities,
    fitContentChecks,
  };
});

await page.locator('.tabs[aria-label="Pill tabs"] [data-key="route"]').click();
await page.waitForTimeout(120);
const afterClick = await page.evaluate(() => {
  const root = document.querySelector('.tabs[aria-label="Pill tabs"]');
  const selected = root?.querySelector('[role="tab"][aria-selected="true"]');
  const beforeStyle = root ? getComputedStyle(root, "::before") : null;
  return {
    selectedKey: selected?.getAttribute("data-key") || "",
    tabIndexZeroCount: [...(root?.querySelectorAll('[role="tab"]') || [])].filter((tab) => tab.getAttribute("tabindex") === "0").length,
    indicatorWidth: Number.parseFloat(beforeStyle?.width || "0"),
    indicatorLeft: Number.parseFloat(beforeStyle?.left || "0"),
    log: document.querySelector("[data-audit-log]")?.textContent || "",
  };
});

await page.locator('.tabs[aria-label="Pill tabs"] [data-key="route"]').focus();
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(120);
const afterArrowRight = await page.evaluate(() => {
  const root = document.querySelector('.tabs[aria-label="Pill tabs"]');
  const selected = root?.querySelector('[role="tab"][aria-selected="true"]');
  return {
    selectedKey: selected?.getAttribute("data-key") || "",
    focusedKey: document.activeElement?.getAttribute("data-key") || "",
    log: document.querySelector("[data-audit-log]")?.textContent || "",
  };
});

await page.keyboard.press("Home");
await page.waitForTimeout(120);
const afterHome = await page.evaluate(() => {
  const root = document.querySelector('.tabs[aria-label="Pill tabs"]');
  return {
    selectedKey: root?.querySelector('[role="tab"][aria-selected="true"]')?.getAttribute("data-key") || "",
    focusedKey: document.activeElement?.getAttribute("data-key") || "",
  };
});

await page.keyboard.press("End");
await page.waitForTimeout(120);
const afterEnd = await page.evaluate(() => {
  const root = document.querySelector('.tabs[aria-label="Pill tabs"]');
  return {
    selectedKey: root?.querySelector('[role="tab"][aria-selected="true"]')?.getAttribute("data-key") || "",
    focusedKey: document.activeElement?.getAttribute("data-key") || "",
  };
});

await page.keyboard.press("Tab");
await page.waitForTimeout(120);
const afterTabOut = await page.evaluate(() => ({
  focusedKey: document.activeElement?.getAttribute("data-key") || "",
  focusedTablist: document.activeElement?.closest(".tabs")?.getAttribute("aria-label") || "",
}));

await page.keyboard.press("Shift+Tab");
await page.waitForTimeout(120);
const afterShiftTabBack = await page.evaluate(() => ({
  focusedKey: document.activeElement?.getAttribute("data-key") || "",
  focusedTablist: document.activeElement?.closest(".tabs")?.getAttribute("aria-label") || "",
}));

const focusVisual = await page.evaluate(() => {
  const root = document.querySelector('.tabs[aria-label="Pill tabs"]');
  const focusedTab = root?.querySelector('[role="tab"][data-key="documents"]');
  if (!(root instanceof HTMLElement) || !(focusedTab instanceof HTMLElement)) return null;
  focusedTab.focus();
  const rootRect = root.getBoundingClientRect();
  const tabRect = focusedTab.getBoundingClientRect();
  const style = getComputedStyle(focusedTab);
  return {
    boxShadow: style.boxShadow,
    outlineStyle: style.outlineStyle,
    outlineWidth: style.outlineWidth,
    zIndex: style.zIndex,
    withinTrack: tabRect.left >= rootRect.left && tabRect.right <= rootRect.right && tabRect.top >= rootRect.top && tabRect.bottom <= rootRect.bottom,
  };
});

await browser.close();
server.close();

const errors = [];
if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (before.tablistCount < 7) errors.push(`Expected Tabs demo coverage across reference, compatibility, and density; got ${before.tablistCount} tablists.`);
if (before.pillVariantCount < 6) errors.push(`Tabs must render pill as the default ZIP variant; got ${before.pillVariantCount} pill tablists.`);
if (before.underlineVariantCount !== 1) errors.push(`Tabs must render one underline reference fixture, got ${before.underlineVariantCount}.`);
if (before.defaultAliasCount !== 1) errors.push("Tabs default alias must normalize to data-variant=\"pill\".");
if (before.tabCount !== 4) errors.push(`Pill reference fixture must render four tabs, got ${before.tabCount}.`);
if (!before.disabledLabel.includes("Patio")) errors.push(`Pill fixture must include a native disabled tab, got ${before.disabledLabel}.`);
if (before.selectedKey !== "all" || before.selectedTabIndex !== "0" || before.tabIndexZeroCount !== 1) {
  errors.push(`Tabs must keep one selected roving tab index: ${JSON.stringify(before)}`);
}
if (!(before.indicatorWidth > 20)) errors.push(`Tabs indicator must have non-zero width, got ${before.indicatorWidth}.`);
if (before.indicatorShadow === "none") errors.push("Pill tabs indicator must keep the ZIP raised selected surface inside the sunken track.");
if (before.badgeCount < 3) errors.push(`Tabs must compose Badge for explicit count labels, got ${before.badgeCount}.`);
if (before.selectedColor === "rgb(0, 96, 223)" || before.selectedColor === before.inactiveColor) {
  errors.push(`Tabs active state must use primary text plus indicator, not action-color text or muted text: selected ${before.selectedColor}, inactive ${before.inactiveColor}.`);
}
if (!(Number(before.selectedWeight) > Number(before.inactiveWeight))) {
  errors.push(`Tabs active state must distinguish with typographic weight: selected ${before.selectedWeight}, inactive ${before.inactiveWeight}.`);
}
if (afterClick.selectedKey !== "route" || afterClick.tabIndexZeroCount !== 1 || !afterClick.log.includes("Pill tabs=route:click")) {
  errors.push(`Tabs click must update selection/log and preserve one roving tab: ${JSON.stringify(afterClick)}`);
}
if (afterArrowRight.selectedKey !== "documents" || afterArrowRight.focusedKey !== "documents") {
  errors.push(`ArrowRight must skip disabled tabs and focus the selected tab: ${JSON.stringify(afterArrowRight)}`);
}
if (afterHome.selectedKey !== "all" || afterHome.focusedKey !== "all") {
  errors.push(`Home must move to the first enabled tab: ${JSON.stringify(afterHome)}`);
}
if (afterEnd.selectedKey !== "documents" || afterEnd.focusedKey !== "documents") {
  errors.push(`End must move to the last enabled tab: ${JSON.stringify(afterEnd)}`);
}
if (afterTabOut.focusedTablist !== "Underline tabs" || afterTabOut.focusedKey !== "general") {
  errors.push(`Tab must leave the active tablist and move to the next focusable demo tab: ${JSON.stringify(afterTabOut)}`);
}
if (afterShiftTabBack.focusedTablist !== "Pill tabs" || afterShiftTabBack.focusedKey !== "documents") {
  errors.push(`Shift+Tab must return to the previous active tab without resetting selection: ${JSON.stringify(afterShiftTabBack)}`);
}
if (!focusVisual || !focusVisual.boxShadow.includes("inset") || focusVisual.outlineWidth !== "0px" || !focusVisual.withinTrack) {
  errors.push(`Tabs focus must render as an internal, unclipped focus ring inside the scrollable track: ${JSON.stringify(focusVisual)}`);
}
const densityByName = Object.fromEntries(before.densities.map((item) => [item.density, item]));
if (!(densityByName.sm.height < densityByName.md.height && densityByName.md.height < densityByName.lg.height)) {
  errors.push(`Tabs hit target height must scale by density: ${JSON.stringify(before.densities)}`);
}
if (!(densityByName.sm.fontSize < densityByName.md.fontSize && densityByName.md.fontSize < densityByName.lg.fontSize)) {
  errors.push(`Tabs label voice must scale by density: ${JSON.stringify(before.densities)}`);
}
if (!(densityByName.sm.paddingLeft < densityByName.md.paddingLeft && densityByName.md.paddingLeft < densityByName.lg.paddingLeft)) {
  errors.push(`Tabs horizontal padding must scale by density: ${JSON.stringify(before.densities)}`);
}
if (before.bodyOverflow) errors.push("Tabs runtime demo must not create horizontal overflow.");
for (const check of before.fitContentChecks) {
  if (check.cardWidth > 0 && check.tablistWidth > check.cardWidth * 0.92 && check.rightGap > 80) {
    errors.push(`Tabs demo must not stretch compact tablists across wide cards: ${JSON.stringify(check)}`);
  }
  if (check.overflowY !== "hidden" || check.scrollbarWidth !== "none") {
    errors.push(`Tabs must hide non-content scrollbars while preserving horizontal overflow fallback: ${JSON.stringify(check)}`);
  }
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "pass",
  component: "tabs",
  tablists: before.tablistCount,
  variants: {
    pill: before.pillVariantCount,
    underline: before.underlineVariantCount,
  },
  keyboard: {
    arrowRightSkipDisabled: afterArrowRight.selectedKey,
    home: afterHome.selectedKey,
    end: afterEnd.selectedKey,
    tabOut: `${afterTabOut.focusedTablist}:${afterTabOut.focusedKey}`,
    shiftTabBack: afterShiftTabBack.focusedTablist,
    focusVisual: "inset-unclipped",
  },
  densities: before.densities,
}, null, 2));
