#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/menu-2026-08-18/interactive/react-runtime.html?fresh=menu-1to1-runtime-1";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/menu-2026-08-18/interactive/react-runtime.html");
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

if (!fs.existsSync(demoFile)) {
  console.error("Missing Menu runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=menu");
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
  if (message.type() === "error" || message.type() === "warning") {
    logs.push({ type: message.type(), text: message.text() });
  }
});
page.on("pageerror", (error) => pageErrors.push(error.message));

await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(300);

async function snapshotMenus() {
  return page.evaluate(() => [...document.querySelectorAll(".menu")].map((menu) => {
    const trigger = menu.querySelector("[data-menu-trigger]");
    const panel = menu.querySelector("[data-menu-panel]");
    const firstItem = panel?.querySelector(".menu__item");
    const itemStyle = firstItem ? getComputedStyle(firstItem) : null;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    const panelRect = panel?.getBoundingClientRect();
    const itemRect = firstItem?.getBoundingClientRect();
    return {
      label: panel?.getAttribute("aria-label") || trigger?.textContent?.trim() || "",
      density: menu.getAttribute("data-density"),
      variant: menu.getAttribute("data-variant"),
      open: menu.getAttribute("data-open"),
      triggerDisabled: Boolean(trigger?.disabled),
      triggerExpanded: trigger?.getAttribute("aria-expanded"),
      panelHidden: panel?.hidden ?? null,
      panelRole: panel?.getAttribute("role") || null,
      panelMinInlineSize: panelStyle?.minInlineSize || null,
      panelWidth: panelRect ? Math.round(panelRect.width) : null,
      itemHeight: itemRect ? Math.round(itemRect.height) : null,
      itemFontSize: itemStyle?.fontSize || null,
      itemPaddingInline: itemStyle ? `${itemStyle.paddingLeft} ${itemStyle.paddingRight}` : null,
      itemCount: panel?.querySelectorAll(".menu__item").length ?? 0,
      disabledItemCount: panel?.querySelectorAll(".menu__item:disabled").length ?? 0,
      separatorCount: panel?.querySelectorAll(".menu__separator").length ?? 0,
      dangerLast: panel ? [...panel.querySelectorAll(".menu__item")].at(-1)?.getAttribute("data-tone") === "danger" : false,
    };
  }));
}

const initialMenus = await snapshotMenus();
const errors = [];
const firstTrigger = page.locator("[data-menu-trigger]:not(:disabled)").first();
await firstTrigger.click();
await page.waitForTimeout(120);
const firstMenuOpen = await page.locator(".menu").first().getAttribute("data-open");
const firstFocused = await page.evaluate(() => ({
  text: document.activeElement?.textContent?.trim() || "",
  role: document.activeElement?.getAttribute("role") || "",
}));

await page.keyboard.press("ArrowDown");
await page.waitForTimeout(60);
const afterArrowDown = await page.evaluate(() => document.activeElement?.textContent?.trim() || "");
await page.keyboard.press("End");
await page.waitForTimeout(60);
const afterEnd = await page.evaluate(() => document.activeElement?.textContent?.trim() || "");
await page.keyboard.press("Home");
await page.waitForTimeout(60);
const afterHome = await page.evaluate(() => document.activeElement?.textContent?.trim() || "");
await page.keyboard.press("Escape");
await page.waitForTimeout(120);
const afterEscape = await page.evaluate(() => {
  const menu = document.querySelector(".menu");
  return {
    open: menu?.getAttribute("data-open") || null,
    focusedTrigger: document.activeElement?.matches("[data-menu-trigger]") || false,
  };
});

await firstTrigger.click();
await page.waitForTimeout(120);
await page.mouse.click(8, 8);
await page.waitForTimeout(120);
const afterOutsideClick = await page.locator(".menu").first().getAttribute("data-open");

await firstTrigger.click();
await page.waitForTimeout(120);
await page.keyboard.press("Tab");
await page.waitForTimeout(120);
const afterTab = await page.locator(".menu").first().getAttribute("data-open");

await firstTrigger.click();
await page.waitForTimeout(120);
await page.locator(".menu").first().locator("[data-menu-panel]").waitFor({ state: "visible", timeout: 2000 });
await page.locator(".menu").first().locator(".menu__item:not(:disabled)").first().click();
await page.waitForTimeout(120);
const afterSelect = await page.locator(".menu").first().getAttribute("data-open");
const runtimeLog = await page.locator("[data-audit-log]").textContent().catch(() => "");

const densityResults = [];
for (const accessibleName of ["Small menu", "Medium menu", "Large menu"]) {
  const trigger = page.locator(`.menu:has([aria-label="${accessibleName}"]) [data-menu-trigger]`).first();
  await trigger.click();
  await page.waitForTimeout(80);
  const result = await page.locator(`.menu:has([aria-label="${accessibleName}"])`).evaluate((menu, label) => {
    const item = menu.querySelector(".menu__item");
    const panel = menu.querySelector(".menu__panel");
    const itemStyle = item ? getComputedStyle(item) : null;
    const panelStyle = panel ? getComputedStyle(panel) : null;
    return {
      label,
      density: menu.getAttribute("data-density"),
      itemHeight: item ? Math.round(item.getBoundingClientRect().height) : null,
      itemFontSize: itemStyle?.fontSize || null,
      panelMinInlineSize: panelStyle?.minInlineSize || null,
    };
  }, accessibleName);
  densityResults.push(result);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
}

await page.getByRole("button", { name: "Dark" }).click();
await page.waitForTimeout(200);
await firstTrigger.click();
await page.waitForTimeout(120);
const darkResult = await page.locator(".menu").first().evaluate((menu) => {
  const panel = menu.querySelector(".menu__panel");
  const item = menu.querySelector(".menu__item");
  const disabled = menu.querySelector(".menu__item:disabled");
  return {
    panelBg: panel ? getComputedStyle(panel).backgroundColor : null,
    itemFg: item ? getComputedStyle(item).color : null,
    disabledFg: disabled ? getComputedStyle(disabled).color : null,
    disabledBg: disabled ? getComputedStyle(disabled).backgroundColor : null,
  };
});

await browser.close();
server.close();
await sleep(0);

if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (initialMenus.length !== 8) errors.push(`Expected 8 menu fixtures from generated demo, got ${initialMenus.length}.`);
const unexpectedOpen = initialMenus.filter((menu) => menu.open === "true" && menu.label !== "Open menu");
if (unexpectedOpen.length) errors.push(`Only the explicit Open menu fixture may start open: ${JSON.stringify(unexpectedOpen)}`);
const openFixture = initialMenus.find((menu) => menu.label === "Open menu");
if (!openFixture || openFixture.open !== "true" || openFixture.triggerExpanded !== "true") errors.push("Open menu fixture must expose one intentional open state.");
for (const menu of initialMenus) {
  if (menu.panelRole !== "menu") errors.push(`${menu.label} panel must expose role=menu.`);
  if (menu.itemCount !== 4) errors.push(`${menu.label} must render 4 menu items plus a separator.`);
  if (menu.disabledItemCount !== 1) errors.push(`${menu.label} must include one disabled item.`);
  if (menu.separatorCount !== 1) errors.push(`${menu.label} must include one separator before the destructive item.`);
  if (!menu.dangerLast) errors.push(`${menu.label} destructive item must be last after divider.`);
}
if (firstMenuOpen !== "true") errors.push("Clicking a trigger must open the menu.");
if (firstFocused.role !== "menuitem" || !firstFocused.text.includes("Editar")) errors.push(`Opening menu must move focus to first usable item; got ${JSON.stringify(firstFocused)}.`);
if (!afterArrowDown.includes("Duplicar")) errors.push(`ArrowDown must move to next usable item; got ${afterArrowDown}.`);
if (!afterEnd.includes("Eliminar")) errors.push(`End must move to last usable item; got ${afterEnd}.`);
if (!afterHome.includes("Editar")) errors.push(`Home must move to first usable item; got ${afterHome}.`);
if (afterEscape.open !== "false" || !afterEscape.focusedTrigger) errors.push(`Escape must close and restore trigger focus; got ${JSON.stringify(afterEscape)}.`);
if (afterOutsideClick !== "false") errors.push("Outside click must close the menu.");
if (afterTab !== "false") errors.push("Tab out must close the menu.");
if (afterSelect !== "false") errors.push("Selecting an item must close the menu.");
if (!runtimeLog?.includes("Acciones=Editar")) errors.push("Selecting an item must call onSelect in the runtime demo.");
const [sm, md, lg] = densityResults;
if (!(sm?.itemHeight < md?.itemHeight && md?.itemHeight < lg?.itemHeight)) errors.push(`Menu item height must scale sm < md < lg: ${JSON.stringify(densityResults)}.`);
if (!(parseFloat(sm?.itemFontSize) < parseFloat(md?.itemFontSize) && parseFloat(md?.itemFontSize) < parseFloat(lg?.itemFontSize))) errors.push(`Menu item font size must scale sm < md < lg: ${JSON.stringify(densityResults)}.`);
if (!darkResult.panelBg || darkResult.panelBg === "rgba(0, 0, 0, 0)") errors.push("Dark-mode menu panel must have an opaque surface.");
if (darkResult.disabledFg === darkResult.itemFg) errors.push("Dark-mode disabled item must remain distinguishable from enabled items.");

const payload = {
  status: errors.length ? "fail" : "pass",
  url,
  initialMenus,
  firstFocused,
  keyboard: { afterArrowDown, afterEnd, afterHome, afterEscape, afterOutsideClick, afterTab, afterSelect },
  densityResults,
  darkResult,
  errors,
};
console.log(JSON.stringify(payload, null, 2));
if (errors.length) process.exit(1);
