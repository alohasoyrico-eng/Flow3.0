#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/tag-2026-09-05/interactive/react-runtime.html?fresh=tag-1to1-runtime-1";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/tag-2026-09-05/interactive/react-runtime.html");
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
  console.error("Missing Tag runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=tag");
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

const before = await page.evaluate(() => {
  const inspectTag = (tag) => {
    const style = getComputedStyle(tag);
    const icon = tag.querySelector(".tag__icon");
    const iconStyle = icon ? getComputedStyle(icon) : null;
    const rect = tag.getBoundingClientRect();
    return {
      label: tag.textContent.trim(),
      tagName: tag.tagName,
      variant: tag.getAttribute("data-variant"),
      tone: tag.getAttribute("data-tone"),
      state: tag.getAttribute("data-state"),
      density: tag.getAttribute("data-density") || "md",
      interactive: tag.getAttribute("data-interactive"),
      disabled: tag.disabled || tag.getAttribute("aria-disabled") === "true",
      tabIndex: tag.tabIndex,
      ariaPressed: tag.getAttribute("aria-pressed"),
      hasRemove: Boolean(tag.querySelector(".chip__remove, .tag__remove, [aria-label^='Quitar'], [aria-label^='Remove']")),
      height: Math.round(rect.height),
      paddingLeft: Number.parseFloat(style.paddingLeft),
      paddingRight: Number.parseFloat(style.paddingRight),
      radius: style.borderRadius,
      fontSize: Number.parseFloat(style.fontSize),
      fontWeight: style.fontWeight,
      iconSize: iconStyle ? Number.parseFloat(iconStyle.fontSize) : null,
      boxShadow: style.boxShadow,
    };
  };
  return {
    h1: document.querySelector("h1")?.textContent || "",
    count: document.querySelectorAll(".tag").length,
    buttons: [...document.querySelectorAll("button.tag")].map(inspectTag),
    spans: [...document.querySelectorAll("span.tag")].map(inspectTag),
    density: ["sm", "md", "lg"].map((density) => inspectTag(document.querySelector(`.tag[data-density="${density}"]`))).filter(Boolean),
    hoverFixture: inspectTag(document.querySelector('.tag[data-state="hover"][data-interactive="true"]')),
    hasSelectedSemantics: [...document.querySelectorAll(".tag")].some((tag) => tag.hasAttribute("aria-pressed") || tag.getAttribute("data-selected") === "true"),
    hasRemoveUi: [...document.querySelectorAll(".tag")].some((tag) => Boolean(tag.querySelector(".chip__remove, .tag__remove, [aria-label^='Quitar'], [aria-label^='Remove']"))),
  };
});

await page.getByRole("button", { name: /docs/i }).click();
await page.waitForTimeout(100);
const afterClick = await page.evaluate(() => document.querySelector("[data-audit-log]")?.textContent || "");

await page.getByRole("button", { name: /focus/i }).focus();
await page.keyboard.press("Enter");
await page.waitForTimeout(100);
const afterEnter = await page.evaluate(() => document.querySelector("[data-audit-log]")?.textContent || "");

await page.keyboard.press("Space");
await page.waitForTimeout(100);
const afterSpace = await page.evaluate(() => document.querySelector("[data-audit-log]")?.textContent || "");

await browser.close();
server.close();

const errors = [];
if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (before.h1 !== "Tag") errors.push(`Expected Tag demo title, got ${before.h1 || "missing"}.`);
if (before.count < 13) errors.push(`Expected broad Tag fixtures, got ${before.count}.`);
if (before.buttons.length !== 5) errors.push(`Expected exactly 5 interactive Tag buttons including disabled, got ${before.buttons.length}.`);
if (before.buttons.filter((tag) => !tag.disabled).length !== 4) {
  errors.push(`Expected exactly 4 enabled action Tags, got ${before.buttons.filter((tag) => !tag.disabled).length}.`);
}
if (before.spans.length < 9) errors.push(`Expected static Tag span fixtures, got ${before.spans.length}.`);
if (before.spans.some((tag) => tag.interactive === "true" || tag.tabIndex >= 0)) {
  errors.push("Static Tag fixtures must not enter tab order or expose data-interactive.");
}
if (before.buttons.some((tag) => tag.tagName !== "BUTTON" || tag.interactive !== "true")) {
  errors.push("Interactive Tags must render native buttons with data-interactive=true.");
}
if (before.hasSelectedSemantics) errors.push("Tag must not expose selected semantics; use Chip for selected filters.");
if (before.hasRemoveUi) errors.push("Tag must not expose removable UI; use Chip for removable values.");
if (!before.hoverFixture || before.hoverFixture.boxShadow !== "none") {
  errors.push(`Interactive Tag hover must stay flat metadata, got box-shadow=${before.hoverFixture?.boxShadow || "missing"}.`);
}
const density = Object.fromEntries(before.density.map((item) => [item.density, item]));
if (!(density.sm?.height < density.md?.height && density.md?.height < density.lg?.height)) {
  errors.push(`Tag density height must scale sm < md < lg, got ${JSON.stringify(before.density)}.`);
}
if (!(density.sm?.fontSize < density.md?.fontSize && density.md?.fontSize < density.lg?.fontSize)) {
  errors.push(`Tag density font size must scale sm < md < lg, got ${JSON.stringify(before.density)}.`);
}
if (!(density.sm?.iconSize < density.md?.iconSize && density.md?.iconSize < density.lg?.iconSize)) {
  errors.push(`Tag density icon size must scale sm < md < lg, got ${JSON.stringify(before.density)}.`);
}
for (const tag of before.density) {
  if (Math.abs(tag.paddingLeft - tag.paddingRight) > 1) {
    errors.push(`${tag.label} must keep symmetric horizontal padding, got ${tag.paddingLeft}/${tag.paddingRight}.`);
  }
}
if (!/Docs/.test(afterClick)) errors.push("Click on Docs tag did not write to runtime log.");
if (!/Focus/.test(afterEnter)) errors.push("Enter on focused action Tag did not activate runtime log.");
if (!/Focus/.test(afterSpace)) errors.push("Space on focused action Tag did not activate runtime log.");

const payload = { status: errors.length ? "fail" : "pass", url, before, interactions: { afterClick, afterEnter, afterSpace }, errors };
console.log(JSON.stringify(payload, null, 2));
if (errors.length) process.exit(1);
