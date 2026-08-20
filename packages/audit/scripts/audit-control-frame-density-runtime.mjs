#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const cssFile = path.join(root, "packages/components/styles/components.css");
const expectedHeights = { sm: 36, md: 44, lg: 52 };
const browserCandidates = [
  process.env.FLOW_RUNTIME_BROWSER_EXECUTABLE,
  "/Users/r1c0/Library/Caches/ms-playwright/chromium-1234/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Users/r1c0/Library/Caches/ms-playwright/chromium-1228/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
].filter(Boolean);

function browserLaunchOptions() {
  const executablePath = browserCandidates.find((candidate) => fs.existsSync(candidate));
  return executablePath ? { executablePath, headless: true } : { headless: true };
}

function html() {
  const cssHref = pathToFileURL(cssFile).href;
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${cssHref}">
    <style>
      body { margin: 0; padding: 24px; background: white; color: #172033; font-family: system-ui, sans-serif; }
      .fixture { display: grid; gap: 12px; inline-size: 360px; }
    </style>
  </head>
  <body>
    <main class="fixture">
      ${["sm", "md", "lg"].map((density) => `
        <button class="button button--secondary" data-density="${density}"><span class="button__label">Button ${density}</span></button>
        <button class="icon-button icon-button--ghost" data-density="${density}" aria-label="Icon ${density}"><span class="icon-button__icon">more_horiz</span></button>
        <label class="field" data-density="${density}">
          <span class="field__control"><input class="field-input" value="Input ${density}"></span>
        </label>
        <label class="field" data-density="${density}">
          <span class="field__control combobox" data-open="false" data-state="default" data-density="${density}">
            <span class="field__icon combobox__icon" aria-hidden="true">search</span>
            <input class="input combobox__input" value="Combobox ${density}" role="combobox" aria-expanded="false">
            <span class="select-control__chevron combobox__chevron" aria-hidden="true">expand_more</span>
          </span>
        </label>
        <div class="select-control" data-density="${density}">
          <button class="select-control__trigger" type="button"><span class="select-control__value">Select ${density}</span><span class="select-control__icon">expand_more</span></button>
        </div>
        <div class="tabs" data-density="${density}" role="tablist">
          <button class="tabs__tab" type="button" role="tab" aria-selected="true">Tab ${density}</button>
        </div>
        <nav class="pagination" data-density="${density}" aria-label="Pagination ${density}">
          <button class="pagination__button" type="button" aria-current="page">1</button>
        </nav>
        <div class="segmented-control" data-density="${density}" role="tablist" aria-label="Segmented ${density}">
          <button class="segmented-control__item" type="button" role="tab" aria-selected="true">
            <span class="segmented-control__label">Segment ${density}</span>
          </button>
        </div>
        <nav class="breadcrumbs" data-density="${density}" aria-label="Breadcrumbs ${density}">
          <ol>
            <li class="breadcrumbs__item"><a class="breadcrumbs__target" href="#">Home ${density}</a></li>
          </ol>
        </nav>
        <label class="field date-picker" data-density="${density}">
          <button class="field__control date-picker__control" type="button">
            <span class="field__icon date-picker__icon">calendar_month</span>
            <span class="date-picker__value">Date ${density}</span>
          </button>
        </label>
        <label class="field date-picker date-range-picker" data-density="${density}">
          <button class="field__control date-picker__control date-range-picker__control" type="button">
            <span class="field__icon date-picker__icon date-range-picker__icon">date_range</span>
            <span class="date-picker__value date-range-picker__value">Range ${density}</span>
          </button>
        </label>
      `).join("")}
    </main>
  </body>
</html>`;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function assertFrame(result, errors) {
  const expected = expectedHeights[result.density];
  if (result.height !== expected) {
    errors.push(`${result.component} ${result.density} rendered ${result.height}px; expected ${expected}px.`);
  }
  if (result.boxSizing !== "border-box") {
    errors.push(`${result.component} ${result.density} must use border-box; got ${result.boxSizing}.`);
  }
}

const fixtureFile = path.join(os.tmpdir(), "flow-control-frame-density-runtime.html");
fs.writeFileSync(fixtureFile, html());

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 800, height: 900 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(fixtureFile).href, { waitUntil: "networkidle" });
const results = await page.evaluate(() => {
  const selectors = [
    ["button", ".button"],
    ["iconButton", ".icon-button"],
    ["input", ".field:not(.date-picker) .field__control:not(.combobox)"],
    ["combobox", ".field__control.combobox"],
    ["select", ".select-control__trigger"],
    ["tabs", ".tabs__tab"],
    ["pagination", ".pagination__button"],
    ["segmentedControl", ".segmented-control__item"],
    ["breadcrumbs", ".breadcrumbs__target"],
    ["datePicker", ".date-picker:not(.date-range-picker) .date-picker__control"],
    ["dateRangePicker", ".date-range-picker .date-range-picker__control"],
  ];
  return selectors.flatMap(([component, selector]) => [...document.querySelectorAll(selector)].map((node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      component,
      density: node.closest("[data-density]")?.getAttribute("data-density"),
      height: Math.round(rect.height * 100) / 100,
      radius: style.borderRadius,
      boxSizing: style.boxSizing,
    };
  }));
});
await browser.close();

const errors = [];
for (const result of results) assertFrame(result, errors);

const actionRadius = results.find((result) => result.component === "button" && result.density === "md")?.radius;
const fieldRadii = results.filter((result) => result.component !== "button").map((result) => result.radius);
if (!actionRadius || fieldRadii.filter((radius) => radius !== actionRadius).length < 2) {
  errors.push("Action and field controls must not collapse to the same radius role.");
}

const report = {
  status: errors.length ? "fail" : "pass",
  expectedHeights,
  results: results.map((result) => ({ ...result, height: round(result.height) })),
  errors,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
