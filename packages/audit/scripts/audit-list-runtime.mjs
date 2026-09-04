#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/list-2026-09-04/interactive/react-runtime.html?fresh=list-runtime-1";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/list-2026-09-04/interactive/react-runtime.html");
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
  console.error("Missing List runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=list");
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

const errors = [];
const initial = await page.evaluate(() => {
  const lists = [...document.querySelectorAll(".list")];
  const listboxes = [...document.querySelectorAll(".list[role='listbox']")];
  return {
    count: lists.length,
    listboxCount: listboxes.length,
    staticCount: document.querySelectorAll(".list[role='list']").length,
    selectedOptions: document.querySelectorAll(".list[role='listbox'] [role='option'][aria-selected='true']").length,
    rowTabStops: document.querySelectorAll(".list[data-interactive='true'] [role='option'][tabindex], .list[data-interactive='true'] button").length,
    firstShadow: getComputedStyle(lists[0]).boxShadow,
    densityHeights: [...document.querySelectorAll(".list[data-density]")].map((list) => ({
      density: list.getAttribute("data-density"),
      height: Math.round(list.querySelector(".list__item")?.getBoundingClientRect().height || 0),
      metaSize: getComputedStyle(list.querySelector(".list__content small") || list).fontSize,
      iconSize: getComputedStyle(list.querySelector(".list__icon") || list).width,
    })),
  };
});

const list = page.getByRole("listbox", { name: /cola operativa/i });
await list.focus();
const keyboard = [];
keyboard.push(await list.getAttribute("aria-activedescendant"));
await page.keyboard.press("ArrowDown");
keyboard.push(await list.getAttribute("aria-activedescendant"));
await page.keyboard.press("End");
keyboard.push(await list.getAttribute("aria-activedescendant"));
await page.keyboard.press("Home");
keyboard.push(await list.getAttribute("aria-activedescendant"));
await page.keyboard.press("f");
keyboard.push(await list.getAttribute("aria-activedescendant"));
await page.keyboard.press("Enter");
await page.waitForTimeout(80);
const afterKeyboard = await page.evaluate(() => {
  const activeId = document.querySelector("[aria-label='Cola operativa']")?.getAttribute("aria-activedescendant") || "";
  const active = activeId ? document.getElementById(activeId) : null;
  return {
    activeText: active?.textContent?.trim() || "",
    activeSelected: active?.getAttribute("aria-selected") || "",
    log: document.querySelector("[data-audit-log]")?.textContent || "",
    focusStayedOnListbox: document.activeElement?.getAttribute("role") === "listbox",
  };
});

await page.getByRole("option", { name: /unidad bloqueada/i }).first().click({ force: true });
await page.waitForTimeout(80);
const afterDisabledClickLog = await page.locator("[data-audit-log]").textContent();

await browser.close();
server.close();

if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (initial.count !== 14) errors.push(`Expected 14 List fixtures, got ${initial.count}.`);
if (initial.listboxCount !== 6) errors.push(`Expected 6 interactive listboxes, got ${initial.listboxCount}.`);
if (initial.staticCount !== 8) errors.push(`Expected 8 static lists, got ${initial.staticCount}.`);
if (initial.selectedOptions < 5) errors.push(`Expected selected options in interactive demos, got ${initial.selectedOptions}.`);
if (initial.rowTabStops) errors.push(`Interactive rows must not become extra tab stops or nested buttons: ${initial.rowTabStops}.`);
if (initial.firstShadow !== "none") errors.push(`List must not own default elevation; got ${initial.firstShadow}.`);
if (!initial.densityHeights.some((item) => item.density === "sm") || !initial.densityHeights.some((item) => item.density === "lg")) {
  errors.push(`Density fixtures missing: ${JSON.stringify(initial.densityHeights)}`);
}
const heights = Object.fromEntries(initial.densityHeights.map((item) => [item.density, item.height]));
if (!(heights.sm < heights.md && heights.md < heights.lg)) {
  errors.push(`List row height must scale by density: ${JSON.stringify(initial.densityHeights)}`);
}
if (!(keyboard[0]?.endsWith("option-0") && keyboard[1]?.endsWith("option-1") && keyboard[2]?.endsWith("option-2") && keyboard[3]?.endsWith("option-0") && keyboard[4]?.endsWith("option-2"))) {
  errors.push(`Keyboard navigation must update aria-activedescendant through enabled options: ${JSON.stringify(keyboard)}`);
}
if (!afterKeyboard.activeText.includes("Factura")) errors.push(`Typeahead should land on Factura row, got ${afterKeyboard.activeText}.`);
if (afterKeyboard.activeSelected !== "true") errors.push("Enter must select the active option.");
if (!afterKeyboard.log.includes("Cola operativa=invoice:keydown")) errors.push(`Keyboard selection missing from runtime log: ${afterKeyboard.log}`);
if (!afterKeyboard.focusStayedOnListbox) errors.push("List keyboard focus must stay on the listbox container.");
if (afterDisabledClickLog !== afterKeyboard.log) errors.push("Disabled list rows must not select or log actions.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "pass",
  component: "list",
  fixtures: initial.count,
  listboxes: initial.listboxCount,
  densityHeights: initial.densityHeights,
}, null, 2));
