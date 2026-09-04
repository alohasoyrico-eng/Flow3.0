#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/inline-validation-2026-09-04/interactive/react-runtime.html?fresh=inline-validation-runtime-3";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/inline-validation-2026-09-04/interactive/react-runtime.html");
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
  console.error(`Missing InlineValidation runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=inline-validation`);
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

const results = await page.evaluate(() => {
  const inspect = (root) => {
    const field = root.querySelector(".field");
    const input = root.querySelector("input");
    const message = root.querySelector(".inline-validation__message");
    const messageStyle = message ? getComputedStyle(message) : null;
    const iconStyle = message ? getComputedStyle(message, "::before") : null;
    const fieldRect = field?.getBoundingClientRect();
    const messageRect = message?.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();
    return {
      label: root.getAttribute("aria-label") || root.querySelector("label")?.textContent?.trim(),
      state: root.getAttribute("data-state"),
      density: root.getAttribute("data-density"),
      fullWidth: root.getAttribute("data-full-width"),
      hasField: Boolean(field),
      fieldCount: root.querySelectorAll(".field").length,
      rootWidth: Math.round(rootRect.width),
      inputDescribedBy: input?.getAttribute("aria-describedby") || null,
      inputInvalid: input?.getAttribute("aria-invalid") || null,
      inputDisabled: input?.disabled || false,
      messageId: message?.id || null,
      messageRole: message?.getAttribute("role") || null,
      messageFontSize: messageStyle?.fontSize || null,
      messageLineHeight: messageStyle?.lineHeight || null,
      iconFontSize: iconStyle?.fontSize || null,
      iconContent: iconStyle?.content || null,
      iconWeight: iconStyle?.fontWeight || null,
      verticalGap: fieldRect && messageRect ? Math.round((messageRect.top - fieldRect.bottom) * 100) / 100 : null,
    };
  };
  return [...document.querySelectorAll(".inline-validation")].map(inspect);
});

await page.getByRole("button", { name: "Dark" }).click();
await page.waitForTimeout(200);
const darkResults = await page.evaluate(() => [...document.querySelectorAll(".inline-validation")].slice(0, 4).map((root) => {
  const message = root.querySelector(".inline-validation__message");
  return {
    state: root.getAttribute("data-state"),
    color: message ? getComputedStyle(message).color : null,
  };
}));

await browser.close();
server.close();

const errors = [];
if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (results.length !== 16) errors.push(`Expected 16 inline-validation fixtures from generated demo, got ${results.length}.`);
for (const result of results) {
  if (result.fieldCount > 1) errors.push(`${result.label} must not render duplicate fields.`);
  if (result.hasField && result.messageId && result.inputDescribedBy !== result.messageId) {
    errors.push(`${result.label} must connect input aria-describedby to message id.`);
  }
  if (result.state === "error" && result.hasField && result.inputInvalid !== "true") {
    errors.push(`${result.label} error field must set aria-invalid=true.`);
  }
  if (result.state !== "error" && result.hasField && result.inputInvalid === "true") {
    errors.push(`${result.label} non-error field must not set aria-invalid=true.`);
  }
  if (result.state === "disabled" && result.hasField && !result.inputDisabled) {
    errors.push(`${result.label} disabled field must disable the composed input.`);
  }
  if (!result.hasField && result.rootWidth > 360) {
    errors.push(`${result.label} message-only mode must not stretch like a field.`);
  }
  if (result.hasField && result.verticalGap !== null && result.verticalGap < 6) {
    errors.push(`${result.label} message must have field clearance; got ${result.verticalGap}px.`);
  }
  if (result.messageFontSize && result.iconFontSize) {
    const messageSize = parseFloat(result.messageFontSize);
    const iconSize = parseFloat(result.iconFontSize);
    if (iconSize > messageSize + 6) {
      errors.push(`${result.label} message icon must stay optically balanced with helper text; got ${iconSize}px icon over ${messageSize}px text.`);
    }
  }
}

const liveErrors = results.filter((result) => result.state === "error" && result.messageRole === "alert");
if (liveErrors.length < 2) errors.push("live=true error demos must expose role=alert.");

const density = Object.fromEntries(results.filter((result) => ["Small field", "Medium field", "Large field"].includes(result.label)).map((result) => [result.label, result]));
if (!(parseFloat(density["Small field"]?.messageFontSize) < parseFloat(density["Medium field"]?.messageFontSize) && parseFloat(density["Medium field"]?.messageFontSize) < parseFloat(density["Large field"]?.messageFontSize))) {
  errors.push("InlineValidation message typography must scale sm < md < lg.");
}
if (!(parseFloat(density["Small field"]?.iconFontSize) < parseFloat(density["Medium field"]?.iconFontSize) && parseFloat(density["Medium field"]?.iconFontSize) < parseFloat(density["Large field"]?.iconFontSize))) {
  errors.push("InlineValidation icon size must scale sm < md < lg.");
}
if (new Set(darkResults.map((result) => result.color).filter(Boolean)).size < 3) {
  errors.push("InlineValidation dark-mode message tones must remain distinguishable across semantic states.");
}

const payload = { status: errors.length ? "fail" : "pass", url, results, darkResults, errors };
console.log(JSON.stringify(payload, null, 2));
if (errors.length) process.exit(1);
