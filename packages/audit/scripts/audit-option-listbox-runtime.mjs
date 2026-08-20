#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const tokensCssFile = path.join(root, "packages/tokens/styles/tokens.css");
const tokenContextsCssFile = path.join(root, "packages/tokens/styles/token-contexts.css");
const cssFile = path.join(root, "packages/components/styles/components.css");
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
  const tokensHref = pathToFileURL(tokensCssFile).href;
  const tokenContextsHref = pathToFileURL(tokenContextsCssFile).href;
  const cssHref = pathToFileURL(cssFile).href;
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${tokensHref}">
    <link rel="stylesheet" href="${tokenContextsHref}">
    <link rel="stylesheet" href="${cssHref}">
    <style>
      body { margin: 0; padding: 24px; background: white; color: #172033; font-family: system-ui, sans-serif; }
      .fixture { display: grid; gap: 24px; inline-size: 720px; padding: 20px; }
      .fixture[data-theme="dark"] { background: #020617; color: white; }
      .fixture-grid { align-items: start; display: grid; gap: 16px; grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .select-control, .combobox, .menu { inline-size: 220px; }
      .select-control__listbox, .combobox__listbox, .menu__panel { position: static; opacity: 1; pointer-events: auto; transform: none; visibility: visible; }
    </style>
  </head>
  <body>
    ${["light", "dark"].map((theme) => `
      <main class="fixture" data-theme="${theme}">
        <div class="fixture-grid">
          <div class="select-control" data-open="true" data-density="md">
            <div class="select-control__listbox" role="listbox">
              <div class="select-control__option" role="option">Select rest</div>
              <div class="select-control__option" data-active="true" role="option">Select active</div>
              <div class="select-control__option" data-selected="true" role="option">
                <span>Select selected</span><span></span><span class="select-control__option-check">check</span>
              </div>
              <div class="select-control__option" data-disabled="true" role="option">Select disabled</div>
            </div>
          </div>
          <div class="field__control combobox" data-open="true" data-density="md">
            <div class="combobox__listbox" role="listbox">
              <div class="combobox__option" role="option">Combobox rest</div>
              <div class="combobox__option" data-active="true" role="option">Combobox active</div>
              <div class="combobox__option" data-selected="true" role="option">
                <span class="combobox__option-label">Combobox selected</span><span></span><span class="combobox__option-check">check</span>
              </div>
              <div class="combobox__option" data-disabled="true" role="option">Combobox disabled</div>
            </div>
          </div>
          <div class="menu" data-open="true" data-density="md">
            <div class="menu__panel" role="menu">
              <button class="menu__item" type="button"><span></span><span class="menu__item-label">Menu rest</span><span></span></button>
              <button class="menu__item" type="button" data-active="true"><span></span><span class="menu__item-label">Menu active</span><span></span></button>
              <button class="menu__item" type="button" disabled><span></span><span class="menu__item-label">Menu disabled</span><span></span></button>
            </div>
          </div>
        </div>
      </main>
    `).join("")}
  </body>
</html>`;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function normalizeColor(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function colorToRgb(value) {
  const rgb = String(value).match(/^rgba?\(([^)]+)\)$/);
  if (rgb) return rgb[1].split(/\s*,\s*/).slice(0, 3).map(Number);
  const srgb = String(value).match(/^color\(srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)/);
  if (srgb) return srgb.slice(1, 4).map((channel) => Number(channel) * 255);
  return null;
}

function luminance(color) {
  const rgb = colorToRgb(color);
  if (!rgb) return null;
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const fixtureFile = path.join(os.tmpdir(), "flow-option-listbox-runtime.html");
fs.writeFileSync(fixtureFile, html());

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 900, height: 760 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(fixtureFile).href, { waitUntil: "networkidle" });
const results = await page.evaluate(() => {
  const inspect = (node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      height: Math.round(rect.height * 100) / 100,
      paddingInlineStart: Math.round(parseFloat(style.paddingInlineStart) * 100) / 100,
      paddingInlineEnd: Math.round(parseFloat(style.paddingInlineEnd) * 100) / 100,
      borderRadius: Math.round(parseFloat(style.borderRadius) * 100) / 100,
      backgroundColor: style.backgroundColor,
      color: style.color,
      opacity: Math.round(parseFloat(style.opacity) * 100) / 100,
      outlineStyle: style.outlineStyle,
      outlineWidth: Math.round(parseFloat(style.outlineWidth) * 100) / 100,
    };
  };
  const pick = (root, selector) => inspect(root.querySelector(selector));
  return ["light", "dark"].flatMap((theme) => {
    const root = document.querySelector(`.fixture[data-theme="${theme}"]`);
    return [
      { component: "select", theme, state: "rest", ...pick(root, ".select-control__option:not([data-active]):not([data-selected]):not([data-disabled])") },
      { component: "select", theme, state: "active", ...pick(root, ".select-control__option[data-active=\"true\"]") },
      { component: "select", theme, state: "selected", ...pick(root, ".select-control__option[data-selected=\"true\"]") },
      { component: "select", theme, state: "disabled", ...pick(root, ".select-control__option[data-disabled=\"true\"]") },
      { component: "combobox", theme, state: "rest", ...pick(root, ".combobox__option:not([data-active]):not([data-selected]):not([data-disabled])") },
      { component: "combobox", theme, state: "active", ...pick(root, ".combobox__option[data-active=\"true\"]") },
      { component: "combobox", theme, state: "selected", ...pick(root, ".combobox__option[data-selected=\"true\"]") },
      { component: "combobox", theme, state: "disabled", ...pick(root, ".combobox__option[data-disabled=\"true\"]") },
      { component: "menu", theme, state: "rest", ...pick(root, ".menu__item:not([data-active]):not(:disabled)") },
      { component: "menu", theme, state: "active", ...pick(root, ".menu__item[data-active=\"true\"]") },
      { component: "menu", theme, state: "disabled", ...pick(root, ".menu__item:disabled") },
    ];
  });
});
await browser.close();

const errors = [];
const byKey = new Map(results.map((result) => [`${result.theme}:${result.component}:${result.state}`, result]));

for (const theme of ["light", "dark"]) {
  const selectRest = byKey.get(`${theme}:select:rest`);
  const comboboxRest = byKey.get(`${theme}:combobox:rest`);
  const menuRest = byKey.get(`${theme}:menu:rest`);
  for (const [component, row] of [["combobox", comboboxRest], ["menu", menuRest]]) {
    if (Math.abs(row.height - selectRest.height) > 1) errors.push(`${theme} ${component} rest height ${row.height}px must match select ${selectRest.height}px within 1px.`);
    if (row.paddingInlineStart !== selectRest.paddingInlineStart || row.paddingInlineEnd !== selectRest.paddingInlineEnd) {
      errors.push(`${theme} ${component} rest horizontal padding must match select; got ${row.paddingInlineStart}/${row.paddingInlineEnd}px vs ${selectRest.paddingInlineStart}/${selectRest.paddingInlineEnd}px.`);
    }
    if (row.borderRadius !== selectRest.borderRadius) errors.push(`${theme} ${component} rest radius ${row.borderRadius}px must match select ${selectRest.borderRadius}px.`);
  }

  const selectActive = byKey.get(`${theme}:select:active`);
  const comboboxActive = byKey.get(`${theme}:combobox:active`);
  const menuActive = byKey.get(`${theme}:menu:active`);
  if (normalizeColor(comboboxActive.backgroundColor) !== normalizeColor(selectActive.backgroundColor)) {
    errors.push(`${theme} combobox active background must match select active background.`);
  }
  if (comboboxActive.outlineStyle === "none" || comboboxActive.outlineWidth <= 0) errors.push(`${theme} combobox active option must expose a keyboard ring.`);
  if (menuActive.outlineStyle === "none" || menuActive.outlineWidth <= 0) errors.push(`${theme} menu active option must expose a keyboard ring.`);

  const selectSelected = byKey.get(`${theme}:select:selected`);
  const comboboxSelected = byKey.get(`${theme}:combobox:selected`);
  if (normalizeColor(comboboxSelected.backgroundColor) !== normalizeColor(selectSelected.backgroundColor)) {
    errors.push(`${theme} combobox selected background must match select selected background.`);
  }
  if (normalizeColor(comboboxSelected.color) !== normalizeColor(selectSelected.color)) {
    errors.push(`${theme} combobox selected color must match select selected color.`);
  }

  for (const component of ["select", "combobox", "menu"]) {
    const disabled = byKey.get(`${theme}:${component}:disabled`);
    if (disabled.opacity < 1) errors.push(`${theme} ${component} disabled option must stay legible through color, not opacity; got ${disabled.opacity}.`);
  }
  if (theme === "dark") {
    for (const component of ["select", "combobox", "menu"]) {
      for (const state of ["rest", "active", "selected", "disabled"]) {
        if (component === "menu" && state === "selected") continue;
        const row = byKey.get(`${theme}:${component}:${state}`);
        const rowLuminance = luminance(row.color);
        if (rowLuminance !== null && rowLuminance < 0.45) {
          errors.push(`${theme} ${component} ${state} text must resolve to a light foreground; got ${row.color}.`);
        }
      }
    }
  }
}

const report = {
  status: errors.length ? "fail" : "pass",
  results: results.map((result) => Object.fromEntries(Object.entries(result).map(([key, value]) => [key, typeof value === "number" ? round(value) : value]))),
  errors,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
