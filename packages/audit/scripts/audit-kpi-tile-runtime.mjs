#!/usr/bin/env node

import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, "../../..");
const workspaceRoot = path.resolve(repoRoot, "../..");
const demoPath = "/local-visual-snapshots/Flow3-component-qa/kpi-tile-2026-08-25/interactive/react-runtime.html?fresh=kpi-tile-reference-runtime-9";
const demoFile = path.join(workspaceRoot, "local-visual-snapshots/Flow3-component-qa/kpi-tile-2026-08-25/interactive/react-runtime.html");
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
  console.error("Missing KpiTile runtime demo. Run: node packages/audit/scripts/build-local-react-qa-demo.mjs --component=kpi-tile");
  process.exit(1);
}

const server = createStaticServer(workspaceRoot);
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const url = `http://127.0.0.1:${port}${demoPath}`;

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const logs = [];
const pageErrors = [];
page.on("console", (message) => {
  if (message.type() === "error" || message.type() === "warning") logs.push({ type: message.type(), text: message.text() });
});
page.on("pageerror", (error) => pageErrors.push(error.message));

await page.goto(url, { waitUntil: "networkidle", timeout: 15000 });
await page.waitForTimeout(300);

const result = await page.evaluate(() => {
  const roots = [...document.querySelectorAll(".kpi-tile")];
  const sections = [...document.querySelectorAll(".audit-section")];
  const referenceSection = sections.find((section) => section.querySelector("h2")?.textContent?.trim() === "Referencia ZIP aplicada a Flow");
  const zipUsageSection = sections.find((section) => section.querySelector("h2")?.textContent?.trim() === "Usos derivados del ZIP");
  const flowExtensionSection = sections.find((section) => section.querySelector("h2")?.textContent?.trim() === "Extensiones Flow");
  const referenceTiles = [...(referenceSection?.querySelectorAll(".kpi-tile") || [])];
  const zipUsageTiles = [...(zipUsageSection?.querySelectorAll(".kpi-tile") || [])];
  const flowExtensionTiles = [...(flowExtensionSection?.querySelectorAll(".kpi-tile") || [])];
  const noDeltaTile = roots.find((root) => !root.querySelector(".kpi-tile__delta"));
  const pressedTiles = [...document.querySelectorAll('.kpi-tile[data-state="pressed"]')];
  const pressedTile = pressedTiles[0];
  const hoverTile = document.querySelector('.kpi-tile[data-state="hover"]');
  const firstWithIcon = roots.find((root) => root.querySelector(".kpi-tile__icon"));
  const iconRect = firstWithIcon?.querySelector(".kpi-tile__icon")?.getBoundingClientRect();
  const labelRect = firstWithIcon?.querySelector(".kpi-tile__label")?.getBoundingClientRect();
  const sparkline = document.querySelector('.kpi-tile[data-variant="sparkline"]');
  const sparklineRect = sparkline?.querySelector(".kpi-tile__sparkline")?.getBoundingClientRect();
  const sparklineValueRect = sparkline?.querySelector(".kpi-tile__value")?.getBoundingClientRect();
  const defaultTile = [...document.querySelectorAll('.kpi-tile[data-state="default"]')]
    .find((root) => root.getAttribute("data-variant") !== "compact");
  const defaultValue = defaultTile?.querySelector(".kpi-tile__value");
  const defaultLabel = defaultTile?.querySelector(".kpi-tile__label");
  const compact = document.querySelector('.kpi-tile[data-variant="compact"]');
  const compactValue = compact?.querySelector(".kpi-tile__value");
  const compactLabel = compact?.querySelector(".kpi-tile__label");
  const compactGrid = compact?.closest(".audit-grid--compact-metrics");
  const compactRect = compact?.getBoundingClientRect();
  const compactValueRect = compactValue?.getBoundingClientRect();
  const compactLabelRect = compactLabel?.getBoundingClientRect();
  const compactContentLeft = Math.min(compactValueRect?.left || 0, compactLabelRect?.left || 0);
  const compactContentRight = Math.max(compactValueRect?.right || 0, compactLabelRect?.right || 0);
  const densities = ["sm", "md", "lg"].map((density) => {
    const root = document.querySelector(`.kpi-tile[data-density="${density}"]`);
    const label = root?.querySelector(".kpi-tile__label");
    const value = root?.querySelector(".kpi-tile__value");
    const delta = root?.querySelector(".kpi-tile__delta");
    return {
      density,
      height: root?.getBoundingClientRect().height || 0,
      paddingTop: Number.parseFloat(getComputedStyle(root || document.body).paddingTop),
      labelSize: Number.parseFloat(getComputedStyle(label || document.body).fontSize),
      valueSize: Number.parseFloat(getComputedStyle(value || document.body).fontSize),
      deltaSize: Number.parseFloat(getComputedStyle(delta || document.body).fontSize),
      minBlock: Number.parseFloat(getComputedStyle(root || document.body).minBlockSize),
    };
  });
  return {
    total: roots.length,
    buttons: document.querySelectorAll('.kpi-tile[role="button"]').length,
    referenceTileCount: referenceTiles.length,
    referenceInteractiveCount: referenceTiles.filter((root) => root.matches('[role="button"], a')).length,
    zipUsageTileCount: zipUsageTiles.length,
    zipUsageInteractiveCount: zipUsageTiles.filter((root) => root.matches('[role="button"], a')).length,
    flowExtensionTileCount: flowExtensionTiles.length,
    pressedTileCount: pressedTiles.length,
    pressedTileVariant: pressedTile?.getAttribute("data-variant") || "",
    pressedBackground: getComputedStyle(pressedTile || document.body).backgroundColor,
    pressedBorderColor: getComputedStyle(pressedTile || document.body).borderColor,
    pressedTransform: getComputedStyle(pressedTile || document.body).transform,
    hoverBackground: getComputedStyle(hoverTile || document.body).backgroundColor,
    hoverBorderColor: getComputedStyle(hoverTile || document.body).borderColor,
    nonInteractiveCount: roots.filter((root) => !root.matches('[role="button"], a')).length,
    hasMetricWithoutDelta: Boolean(noDeltaTile),
    labels: roots.map((root) => root.querySelector(".kpi-tile__label")?.textContent?.trim() || ""),
    headerIconBeforeLabel: Boolean(iconRect && labelRect && iconRect.right <= labelRect.left),
    sparklineBesideValue: Boolean(sparklineRect && sparklineValueRect && sparklineRect.left > sparklineValueRect.right),
    defaultBackground: getComputedStyle(defaultTile || document.body).backgroundColor,
    defaultBorderColor: getComputedStyle(defaultTile || document.body).borderColor,
    defaultDepth: getComputedStyle(defaultTile || document.body).boxShadow,
    defaultValueWeight: getComputedStyle(defaultValue || document.body).fontWeight,
    defaultLabelSize: Number.parseFloat(getComputedStyle(defaultLabel || document.body).fontSize),
    compactValueWeight: getComputedStyle(compactValue || document.body).fontWeight,
    compactLabelSize: Number.parseFloat(getComputedStyle(compactLabel || document.body).fontSize),
    compactPaddingLeft: Number.parseFloat(getComputedStyle(compact || document.body).paddingLeft),
    compactContentLeftGap: compactRect ? compactContentLeft - compactRect.left : 0,
    compactContentRightGap: compactRect ? compactRect.right - compactContentRight : 0,
    compactWidth: compact?.getBoundingClientRect().width || 0,
    compactInlineSize: getComputedStyle(compact || document.body).inlineSize,
    compactGridJustify: getComputedStyle(compactGrid || document.body).justifyContent,
    compactGridDisplay: getComputedStyle(compactGrid || document.body).display,
    compactDepth: getComputedStyle(compact || document.body).boxShadow,
    riskHasRail: Number.parseFloat(getComputedStyle(document.querySelector('.kpi-tile[data-state="risk"]') || document.body).borderInlineStartWidth),
    densities,
    bodyOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
  };
});

const drillInAction = page.getByRole("button", { name: /drill in 24, open report/i });
await drillInAction.click();
await page.waitForTimeout(100);
const interactionResult = await page.evaluate(() => ({
  openedTextVisible: document.body.textContent.includes("Report opened") && document.body.textContent.includes("Demo action completed"),
  runtimeLog: document.querySelector("[data-audit-log]")?.textContent || "",
}));

await browser.close();
server.close();

const errors = [];
if (logs.length) errors.push(`Console warnings/errors present: ${JSON.stringify(logs)}`);
if (pageErrors.length) errors.push(`Page errors present: ${JSON.stringify(pageErrors)}`);
if (result.total < 18) errors.push(`Expected KpiTile demo coverage across reference, compact, variants, density, and states; got ${result.total}.`);
if (result.referenceTileCount !== 4) errors.push(`Dashboard reference section must render exactly four ZIP-like KPI tiles, got ${result.referenceTileCount}.`);
if (result.referenceInteractiveCount !== 0) errors.push("Dashboard reference KpiTile examples must be informational metrics, not interactive buttons.");
if (result.zipUsageTileCount !== 4) errors.push(`ZIP-derived usage section must render exactly four StatTile usage modes, got ${result.zipUsageTileCount}.`);
if (result.zipUsageInteractiveCount !== 0) errors.push("ZIP-derived KpiTile usage modes must remain informational metrics.");
if (result.flowExtensionTileCount !== 3) errors.push(`Flow extension section must keep local extensions separate from ZIP usage modes, got ${result.flowExtensionTileCount}.`);
if (result.buttons !== 1) errors.push(`KpiTile runtime demo should reserve interactivity for the drill-in example only, got ${result.buttons} interactive tiles.`);
if (!interactionResult.openedTextVisible) errors.push("KpiTile drill-in demo must show visible feedback after click/activation.");
if (!interactionResult.runtimeLog.includes("Drill in:click")) errors.push(`KpiTile drill-in demo must log the click activation, got ${interactionResult.runtimeLog}.`);
if (result.pressedTileCount !== 1) errors.push(`KpiTile demo must include exactly one pressed example for the drill-in action state, got ${result.pressedTileCount}.`);
if (result.pressedTileVariant !== "drill-in") errors.push(`KpiTile pressed fixture must stay scoped to the drill-in variant, got ${result.pressedTileVariant}.`);
if (result.pressedBackground === result.defaultBackground) errors.push("KpiTile pressed state must have a distinct token-backed pressed surface.");
if (result.pressedTransform === "none") errors.push("KpiTile pressed state must apply a pressed transform.");
if (result.hoverBackground === result.defaultBackground) errors.push("KpiTile hover state must have a visible token-backed hover surface, not only border/depth.");
if (result.hoverBorderColor === result.defaultBorderColor) errors.push("KpiTile hover state must have a visible border change.");
if (result.nonInteractiveCount < 17) errors.push(`KpiTile demo must prioritize dashboard/header read-only metric examples, got ${result.nonInteractiveCount}.`);
if (!result.hasMetricWithoutDelta) errors.push("KpiTile must support a ZIP dashboard metric without delta text.");
if (result.labels.some((label) => !label)) errors.push("Every rendered KpiTile must expose a visible metric label.");
if (!result.headerIconBeforeLabel) errors.push("KpiTile icon must render before the overline label in the ZIP StatTile header anatomy.");
if (!result.sparklineBesideValue) errors.push("KpiTile sparkline variant must position the chart beside, not below, the metric text.");
if (result.defaultDepth !== "none") errors.push(`Default KpiTile must not carry universal elevation, got ${result.defaultDepth}.`);
if (!["300", "350"].includes(result.defaultValueWeight)) errors.push(`KpiTile numeral weight must use the light dashboard data voice, got ${result.defaultValueWeight}.`);
if (result.compactValueWeight !== result.defaultValueWeight) errors.push(`Compact KpiTile numeral weight must inherit the shared KPI voice, got compact ${result.compactValueWeight} and default ${result.defaultValueWeight}.`);
if (result.compactLabelSize !== result.defaultLabelSize) errors.push(`Compact KpiTile label must inherit the shared KPI label voice, got compact ${result.compactLabelSize} and default ${result.defaultLabelSize}.`);
if (!(result.compactPaddingLeft >= 16)) errors.push(`Compact KpiTile needs enough horizontal padding for drawer/header metrics, got ${result.compactPaddingLeft}.`);
if (!(result.compactWidth <= 120)) errors.push(`Compact KpiTile must size intrinsically to its content instead of stretching, got width ${result.compactWidth}.`);
if (Math.abs(result.compactContentLeftGap - result.compactContentRightGap) > 2) {
  errors.push(`Compact KpiTile horizontal whitespace must be balanced around its content, got left ${result.compactContentLeftGap} and right ${result.compactContentRightGap}.`);
}
if (result.compactGridDisplay !== "flex") errors.push(`Compact KpiTile demo must use a flexible intrinsic row, got ${result.compactGridDisplay}.`);
if (result.compactGridJustify !== "flex-start") errors.push(`Compact KpiTile demo row must align compact fixtures to the start, got ${result.compactGridJustify}.`);
if (result.compactDepth !== "none") errors.push(`Compact KpiTile must not carry raised card depth, got ${result.compactDepth}.`);
if (!(result.riskHasRail > 0)) errors.push("Risk/threshold KpiTile must keep a visible semantic rail.");
const densityByName = Object.fromEntries(result.densities.map((item) => [item.density, item]));
if (!(densityByName.sm.labelSize < densityByName.md.labelSize && densityByName.md.labelSize < densityByName.lg.labelSize)) {
  errors.push(`KpiTile label voice must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.valueSize < densityByName.md.valueSize && densityByName.md.valueSize < densityByName.lg.valueSize)) {
  errors.push(`KpiTile numeral voice must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.deltaSize < densityByName.md.deltaSize && densityByName.md.deltaSize < densityByName.lg.deltaSize)) {
  errors.push(`KpiTile delta/helper voice must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.paddingTop < densityByName.md.paddingTop && densityByName.md.paddingTop < densityByName.lg.paddingTop)) {
  errors.push(`KpiTile frame spacing must scale by density: ${JSON.stringify(result.densities)}`);
}
if (!(densityByName.sm.height < densityByName.md.height && densityByName.md.height < densityByName.lg.height)) {
  errors.push(`KpiTile density demo must expose actual rendered height differences instead of grid stretch: ${JSON.stringify(result.densities)}`);
}
if (result.bodyOverflow) errors.push("KpiTile runtime demo must not create horizontal overflow.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

console.log(JSON.stringify({
  status: "pass",
  component: "kpi-tile",
  fixtures: result.total,
  interactiveFixtures: result.buttons,
  referenceFixtures: result.referenceTileCount,
  nonInteractiveFixtures: result.nonInteractiveCount,
  densities: result.densities,
}, null, 2));
