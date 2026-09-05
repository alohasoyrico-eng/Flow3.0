#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/progress-2026-08-25/interactive/react-runtime.html?fresh=progress-linear-circular-runtime-1";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/progress-2026-08-25/interactive/react-runtime.html");
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
  console.error("Missing ProgressIndicator runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=progress");
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

const result = await page.evaluate(() => {
  const progressRoots = [...document.querySelectorAll(".progress")];
  const linearRoots = progressRoots.filter((root) => root.getAttribute("data-variant") === "linear");
  const circularRoots = progressRoots.filter((root) => root.getAttribute("data-variant") === "circular");
  const indeterminateRoot = progressRoots.find((root) => root.getAttribute("data-indeterminate") === "true");
  const circularLoading = [...document.querySelectorAll(".progress__label")].find((label) => label.textContent?.includes("Circular requested while loading"))?.closest(".progress");
  const linearProgress = linearRoots.find((root) => root.querySelector("progress:not(:indeterminate)"))?.querySelector("progress");
  const clampedProgress = [...document.querySelectorAll(".progress__label")]
    .find((label) => label.textContent?.includes("Clamped high"))
    ?.closest(".progress")
    ?.querySelector("progress");
  const densities = ["sm", "md", "lg"].map((density) => {
    const linear = document.querySelector(`.progress[data-density="${density}"][data-variant="linear"] .progress__track`);
    const circular = document.querySelector(`.progress[data-density="${density}"][data-variant="circular"] .progress__ring`);
    const label = document.querySelector(`.progress[data-density="${density}"] .progress__label`);
    const value = document.querySelector(`.progress[data-density="${density}"] .progress__value, .progress[data-density="${density}"] .progress__ring-value`);
    return {
      density,
      trackHeight: Math.round(linear?.getBoundingClientRect().height || 0),
      ringSize: Math.round(circular?.getBoundingClientRect().width || 0),
      labelSize: Number.parseFloat(getComputedStyle(label || document.body).fontSize),
      valueSize: Number.parseFloat(getComputedStyle(value || document.body).fontSize),
      gap: Number.parseFloat(getComputedStyle(linear?.closest(".progress") || document.body).rowGap),
    };
  });
  const circularAria = circularRoots.map((root) => {
    const ring = root.querySelector(".progress__ring");
    return {
      role: ring?.getAttribute("role") || "",
      label: root.querySelector(".progress__label")?.textContent || "",
      now: ring?.getAttribute("aria-valuenow") || "",
      min: ring?.getAttribute("aria-valuemin") || "",
      max: ring?.getAttribute("aria-valuemax") || "",
      labelledby: ring?.getAttribute("aria-labelledby") || "",
      strokeDashoffset: root.querySelector(".progress__ring-meter")?.getAttribute("stroke-dashoffset") || "",
      valueText: root.querySelector(".progress__ring-value")?.textContent || "",
      valueDisplay: getComputedStyle(root.querySelector(".progress__ring-value") || root).display,
    };
  });
  return {
    total: progressRoots.length,
    linearCount: linearRoots.length,
    circularCount: circularRoots.length,
    linearAria: linearProgress
      ? {
          now: linearProgress.getAttribute("aria-valuenow"),
          min: linearProgress.getAttribute("aria-valuemin"),
          max: linearProgress.getAttribute("aria-valuemax"),
          labelledby: linearProgress.getAttribute("aria-labelledby"),
        }
      : null,
    indeterminateVariant: indeterminateRoot?.getAttribute("data-variant") || "",
    indeterminateHasValueAttr: indeterminateRoot?.querySelector("progress")?.hasAttribute("value") || false,
    indeterminateVisibleValue: indeterminateRoot?.querySelector(".progress__value")?.textContent || "",
    circularLoadingVariant: circularLoading?.getAttribute("data-variant") || "",
    circularLoadingHasRing: Boolean(circularLoading?.querySelector(".progress__ring")),
    clampedValue: clampedProgress?.getAttribute("value") || "",
    clampedPercent: clampedProgress?.closest(".progress")?.querySelector(".progress__value")?.textContent || "",
    circularAria,
    densities,
    bodyOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
});

await browser.close();
server.close();

const errors = [];
if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (result.total !== 21) errors.push(`Expected 21 ProgressIndicator fixtures, got ${result.total}.`);
if (result.linearCount < 14) errors.push(`Expected linear fixtures for ZIP/states/tones/limits, got ${result.linearCount}.`);
if (result.circularCount < 6) errors.push(`Expected circular fixtures for ZIP/density/complete, got ${result.circularCount}.`);
if (!result.linearAria?.labelledby || result.linearAria.now !== "3" || result.linearAria.min !== "0" || result.linearAria.max !== "4") {
  errors.push(`Linear determinate progressbar ARIA is incomplete: ${JSON.stringify(result.linearAria)}`);
}
if (result.indeterminateVariant !== "linear" || result.indeterminateHasValueAttr || result.indeterminateVisibleValue) {
  errors.push(`Indeterminate progress must be linear and suppress fake visible values: ${JSON.stringify({
    variant: result.indeterminateVariant,
    hasValue: result.indeterminateHasValueAttr,
    visible: result.indeterminateVisibleValue,
  })}`);
}
if (result.circularLoadingVariant !== "linear" || result.circularLoadingHasRing) {
  errors.push("Circular requested while indeterminate must resolve to linear, not a fake unknown ring.");
}
if (result.clampedValue !== "100" || result.clampedPercent !== "100%") {
  errors.push(`Progress value must clamp to max: value=${result.clampedValue} percent=${result.clampedPercent}`);
}
if (result.circularAria.some((item) => item.role !== "progressbar" || !item.labelledby || item.min !== "0" || !item.max || item.strokeDashoffset === "" || (item.valueText && item.valueDisplay !== "grid"))) {
  errors.push(`Circular progressbar ARIA/layout contract failed: ${JSON.stringify(result.circularAria)}`);
}
const densityByName = Object.fromEntries(result.densities.map((item) => [item.density, item]));
if (!(densityByName.sm.trackHeight < densityByName.md.trackHeight && densityByName.md.trackHeight < densityByName.lg.trackHeight)) {
  errors.push(`Linear track height must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.ringSize < densityByName.md.ringSize && densityByName.md.ringSize < densityByName.lg.ringSize)) {
  errors.push(`Circular ring size must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.labelSize < densityByName.md.labelSize && densityByName.md.labelSize < densityByName.lg.labelSize)) {
  errors.push(`Progress label voice must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.valueSize < densityByName.md.valueSize && densityByName.md.valueSize < densityByName.lg.valueSize)) {
  errors.push(`Progress value voice must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.gap < densityByName.md.gap && densityByName.md.gap < densityByName.lg.gap)) {
  errors.push(`Progress label-to-bar spacing must scale by density: ${JSON.stringify(result.densities)}`);
}
if (result.bodyOverflow) errors.push("ProgressIndicator runtime demo must not create horizontal overflow.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "pass",
  component: "progress-indicator",
  fixtures: result.total,
  linear: result.linearCount,
  circular: result.circularCount,
  densities: result.densities,
}, null, 2));
