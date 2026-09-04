#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/popover-2026-08-25/interactive/react-runtime.html?fresh=popover-keyboard-runtime-3";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/popover-2026-08-25/interactive/react-runtime.html");
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
  console.error("Missing Popover runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=popover");
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

async function snapshotPopovers() {
  return page.evaluate(() => [...document.querySelectorAll(".popover:not(.popover--portal)")].map((popover) => {
    const trigger = popover.querySelector("[data-popover-trigger]");
    return {
      trigger: trigger?.textContent?.trim() || "",
      density: popover.getAttribute("data-density"),
      variant: popover.getAttribute("data-variant"),
      state: popover.getAttribute("data-state"),
      placement: popover.getAttribute("data-placement"),
      open: popover.getAttribute("data-open"),
      expanded: trigger?.getAttribute("aria-expanded"),
      disabled: Boolean(trigger?.disabled),
      hasInlinePanel: Boolean(popover.querySelector(".popover__panel")),
    };
  }));
}

const initialPopovers = await snapshotPopovers();
const errors = [];

const firstTrigger = page.locator("[data-popover-trigger]:not(:disabled)").first();
await firstTrigger.click();
await page.waitForTimeout(160);
const afterOpen = await page.evaluate(() => {
  const trigger = document.querySelector("[data-popover-trigger]");
  const root = document.querySelector(".popover:not(.popover--portal)");
  const panel = document.querySelector(".popover--portal .popover__panel");
  const panelStyle = panel ? getComputedStyle(panel) : null;
  const rect = panel?.getBoundingClientRect();
  return {
    rootOpen: root?.getAttribute("data-open") || null,
    expanded: trigger?.getAttribute("aria-expanded") || null,
    portalPanel: Boolean(panel),
    panelParent: panel?.parentElement?.parentElement === document.body ? "body" : panel?.parentElement?.parentElement?.tagName || null,
    panelPosition: panelStyle?.position || null,
    panelBg: panelStyle?.backgroundColor || null,
    panelShadow: panelStyle?.boxShadow || null,
    rect: rect ? { left: Math.round(rect.left), top: Math.round(rect.top), width: Math.round(rect.width), height: Math.round(rect.height) } : null,
  };
});

await page.keyboard.press("Escape");
await page.waitForTimeout(120);
const afterEscape = await page.evaluate(() => ({
  open: document.querySelector(".popover:not(.popover--portal)")?.getAttribute("data-open") || null,
  focusedTrigger: document.activeElement?.matches("[data-popover-trigger]") || false,
}));

await firstTrigger.click();
await page.waitForTimeout(120);
await page.mouse.click(8, 8);
await page.waitForTimeout(120);
const afterOutsideClick = await page.locator(".popover:not(.popover--portal)").first().getAttribute("data-open");

await firstTrigger.click();
await page.waitForTimeout(120);
await page.keyboard.press("Tab");
await page.waitForTimeout(120);
const afterTabOutOfNonInteractiveContent = await page.evaluate(() => ({
  open: document.querySelector(".popover:not(.popover--portal)")?.getAttribute("data-open") || null,
  panelExists: Boolean(document.querySelector(".popover--portal .popover__panel")),
  activeText: document.activeElement?.textContent?.trim() || "",
  activeIsTrigger: document.activeElement?.matches("[data-popover-trigger]") || false,
}));

const actionTrigger = page.getByRole("button", { name: /Actions/i }).first();
await actionTrigger.click();
await page.waitForTimeout(120);
await page.keyboard.press("Tab");
await page.waitForTimeout(80);
const afterTabIntoAction = await page.evaluate(() => ({
  open: [...document.querySelectorAll(".popover:not(.popover--portal)")].find((popover) => popover.textContent?.includes("Actions"))?.getAttribute("data-open") || null,
  activeText: document.activeElement?.textContent?.trim() || "",
  activeIsAction: document.activeElement?.matches("[data-popover-action]") || false,
}));
await page.keyboard.press("Tab");
await page.waitForTimeout(80);
const afterTabToSecondAction = await page.evaluate(() => ({
  open: [...document.querySelectorAll(".popover:not(.popover--portal)")].find((popover) => popover.textContent?.includes("Actions"))?.getAttribute("data-open") || null,
  activeText: document.activeElement?.textContent?.trim() || "",
  activeIsAction: document.activeElement?.matches("[data-popover-action]") || false,
}));
await page.keyboard.press("Tab");
await page.waitForTimeout(120);
const afterTabOutOfAction = await page.evaluate(() => ({
  open: [...document.querySelectorAll(".popover:not(.popover--portal)")].find((popover) => popover.textContent?.includes("Actions"))?.getAttribute("data-open") || null,
  panelExists: Boolean(document.querySelector(".popover--portal .popover__panel")),
  activeText: document.activeElement?.textContent?.trim() || "",
  activeIsAction: document.activeElement?.matches("[data-popover-action]") || false,
  activeIsTrigger: document.activeElement?.matches("[data-popover-trigger]") || false,
}));
await actionTrigger.click();
await page.waitForTimeout(120);
await page.locator(".popover--portal [data-popover-action]").last().click();
await page.waitForTimeout(120);
const afterAction = await page.evaluate(() => ({
  open: [...document.querySelectorAll(".popover:not(.popover--portal)")].find((popover) => popover.textContent?.includes("Actions"))?.getAttribute("data-open") || null,
  focusedTrigger: document.activeElement?.matches("[data-popover-trigger]") || false,
  log: document.querySelector("[data-audit-log]")?.textContent || "",
}));

const densityResults = [];
for (const label of ["Small", "Medium", "Large"]) {
  const trigger = page.getByRole("button", { name: new RegExp(label, "i") }).first();
  await trigger.click();
  await page.waitForTimeout(120);
  const result = await page.evaluate((currentLabel) => {
    const trigger = [...document.querySelectorAll("[data-popover-trigger]")].find((node) => node.textContent?.includes(currentLabel));
    const root = trigger?.closest(".popover");
    const panel = document.querySelector(".popover--portal .popover__panel");
    const title = panel?.querySelector("strong");
    const rect = panel?.getBoundingClientRect();
    const titleStyle = title ? getComputedStyle(title) : null;
    return {
      label: currentLabel,
      density: root?.getAttribute("data-density") || null,
      width: rect ? Math.round(rect.width) : null,
      titleSize: titleStyle?.fontSize || null,
      padding: panel ? getComputedStyle(panel).paddingTop : null,
    };
  }, label);
  densityResults.push(result);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
}

await page.setViewportSize({ width: 360, height: 620 });
await page.waitForTimeout(100);
await page.keyboard.press("Escape");
await page.getByRole("button", { name: /Info/i }).first().click();
await page.waitForTimeout(160);
const mobileCollision = await page.evaluate(() => {
  const panel = document.querySelector(".popover--portal .popover__panel");
  const rect = panel?.getBoundingClientRect();
  return rect ? {
    left: Math.round(rect.left),
    right: Math.round(rect.right),
    top: Math.round(rect.top),
    bottom: Math.round(rect.bottom),
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  } : null;
});

await page.getByRole("button", { name: "Dark" }).click();
await page.waitForTimeout(160);
await page.getByRole("button", { name: /Info/i }).first().click();
await page.waitForTimeout(120);
const darkSurface = await page.evaluate(() => {
  const panel = document.querySelector(".popover--portal .popover__panel");
  if (!panel) return null;
  const style = getComputedStyle(panel);
  return { bg: style.backgroundColor, fg: style.color, border: style.borderColor, shadow: style.boxShadow };
});

await browser.close();
server.close();

if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (initialPopovers.length !== 12) errors.push(`Expected 12 popover fixtures from generated demo, got ${initialPopovers.length}.`);
const unexpectedOpen = initialPopovers.filter((popover) => popover.open === "true");
if (unexpectedOpen.length) errors.push(`Popover demo must not start with accidental open fixtures: ${JSON.stringify(unexpectedOpen)}`);
for (const popover of initialPopovers) {
  if (popover.hasInlinePanel) errors.push(`${popover.trigger} keeps an inline panel; Popover must render panel in a portal.`);
}
if (afterOpen.rootOpen !== "true" || afterOpen.expanded !== "true") errors.push(`Clicking trigger must open Popover and set aria-expanded: ${JSON.stringify(afterOpen)}`);
if (!afterOpen.portalPanel || afterOpen.panelParent !== "body") errors.push(`Open Popover panel must be portaled to body: ${JSON.stringify(afterOpen)}`);
if (afterOpen.panelPosition !== "fixed") errors.push(`Portaled Popover panel must be fixed-positioned: ${JSON.stringify(afterOpen)}`);
if (!afterOpen.panelBg || afterOpen.panelBg === "rgba(0, 0, 0, 0)") errors.push("Popover card surface must be opaque.");
if (!afterOpen.panelShadow || afterOpen.panelShadow === "none") errors.push("Popover card surface must use overlay depth.");
if (afterEscape.open !== "false" || !afterEscape.focusedTrigger) errors.push(`Escape must close and restore focus: ${JSON.stringify(afterEscape)}`);
if (afterOutsideClick !== "false") errors.push("Click outside must close Popover.");
if (afterTabOutOfNonInteractiveContent.open !== "false" || afterTabOutOfNonInteractiveContent.panelExists || !afterTabOutOfNonInteractiveContent.activeIsTrigger || !afterTabOutOfNonInteractiveContent.activeText.includes("Actions")) errors.push(`Tab from a Popover with no focusable panel content must close it and focus the next trigger: ${JSON.stringify(afterTabOutOfNonInteractiveContent)}`);
if (afterTabIntoAction.open !== "true" || !afterTabIntoAction.activeIsAction || !afterTabIntoAction.activeText.includes("Dismiss")) errors.push(`Tab from trigger must enter Popover actions instead of closing or skipping panel: ${JSON.stringify(afterTabIntoAction)}`);
if (afterTabToSecondAction.open !== "true" || !afterTabToSecondAction.activeIsAction || !afterTabToSecondAction.activeText.includes("Apply")) errors.push(`Tab inside Popover must continue through internal actions: ${JSON.stringify(afterTabToSecondAction)}`);
if (afterTabOutOfAction.open !== "false" || afterTabOutOfAction.panelExists || afterTabOutOfAction.activeIsAction || !afterTabOutOfAction.activeText.includes("Form")) errors.push(`Tab after the last Popover action must close the panel and focus the next trigger: ${JSON.stringify(afterTabOutOfAction)}`);
if (afterAction.open !== "false" || !afterAction.focusedTrigger || !afterAction.log.includes("Quick actions=apply")) errors.push(`Action click must close, restore focus, and log action: ${JSON.stringify(afterAction)}`);
const [sm, md, lg] = densityResults;
if (!(sm?.width < md?.width && md?.width < lg?.width)) errors.push(`Panel width must scale sm < md < lg: ${JSON.stringify(densityResults)}`);
if (!(parseFloat(sm?.titleSize) < parseFloat(md?.titleSize) && parseFloat(md?.titleSize) < parseFloat(lg?.titleSize))) errors.push(`Title size must scale sm < md < lg: ${JSON.stringify(densityResults)}`);
if (!mobileCollision || mobileCollision.left < 8 || mobileCollision.right > mobileCollision.viewportWidth - 8) errors.push(`Popover must clamp to mobile viewport margin: ${JSON.stringify(mobileCollision)}`);
if (!darkSurface?.bg || darkSurface.bg === "rgba(0, 0, 0, 0)") errors.push(`Dark Popover surface must remain readable and opaque: ${JSON.stringify(darkSurface)}`);

const payload = {
  status: errors.length ? "fail" : "pass",
  url,
  initialPopovers,
  afterOpen,
  afterEscape,
  afterOutsideClick,
  afterTabOutOfNonInteractiveContent,
  afterTabIntoAction,
  afterTabToSecondAction,
  afterTabOutOfAction,
  afterAction,
  densityResults,
  mobileCollision,
  darkSurface,
  errors,
};
console.log(JSON.stringify(payload, null, 2));
if (errors.length) process.exit(1);
