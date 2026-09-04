#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const cssFile = path.join(root, "packages/components/styles/components.css");
const tokensFile = path.join(root, "packages/tokens/styles/tokens.css");
const tokenContextsFile = path.join(root, "packages/tokens/styles/token-contexts.css");
const expectedFrame = { sm: 36, md: 44, lg: 52 };
const expectedIcon = { sm: 16, md: 20, lg: 24 };
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
  const tokensHref = pathToFileURL(tokensFile).href;
  const tokenContextsHref = pathToFileURL(tokenContextsFile).href;
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="${tokensHref}">
    <link rel="stylesheet" href="${tokenContextsHref}">
    <link rel="stylesheet" href="${cssHref}">
    <style>
      body { margin: 0; padding: 24px; background: white; color: #172033; font-family: system-ui, sans-serif; }
      .fixture { display: grid; gap: 16px; inline-size: 520px; padding: 20px; }
      :root[data-theme="dark"] body { background: #020617; color: white; }
      .row { align-items: center; display: flex; gap: 12px; }
    </style>
  </head>
  <body>
      <main class="fixture">
        ${["sm", "md", "lg"].map((density) => `
          <div class="row" data-density="${density}">
            <button class="icon-button icon-button--ghost" data-density="${density}" aria-label="ghost ${density}">
              <span class="icon-button__icon" aria-hidden="true">more_horiz</span>
            </button>
            <button class="icon-button icon-button--secondary" data-density="${density}" aria-label="secondary ${density}">
              <span class="icon-button__icon" aria-hidden="true">grid_view</span>
            </button>
            <button class="icon-button icon-button--tertiary" data-density="${density}" aria-label="tertiary ${density}">
              <span class="icon-button__icon" aria-hidden="true">edit</span>
            </button>
            <button class="icon-button icon-button--outlined" data-density="${density}" aria-label="outlined ${density}">
              <span class="icon-button__icon" aria-hidden="true">language</span>
            </button>
            <button class="icon-button icon-button--primary" data-density="${density}" aria-label="primary ${density}">
              <span class="icon-button__icon" aria-hidden="true">check</span>
            </button>
            <button class="icon-button icon-button--ghost" data-density="${density}" aria-label="selected ${density}" aria-pressed="true">
              <span class="icon-button__icon" aria-hidden="true">dark_mode</span>
            </button>
            <button class="icon-button icon-button--ghost" data-density="${density}" aria-label="badge ${density}">
              <span class="icon-button__icon" aria-hidden="true">notifications</span>
              <span class="icon-button__badge" aria-hidden="true"></span>
            </button>
            <button class="icon-button icon-button--ghost" data-density="${density}" aria-label="disabled ${density}" disabled>
              <span class="icon-button__icon" aria-hidden="true">lock</span>
            </button>
          </div>
        `).join("")}
      </main>
  </body>
</html>`;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function transformScale(value) {
  if (!value || value === "none") return 1;
  const matrix = value.match(/^matrix\(([^)]+)\)$/);
  if (!matrix) return null;
  return round(parseFloat(matrix[1].split(",")[0]));
}

const fixtureFile = path.join(os.tmpdir(), "flow-icon-button-runtime.html");
fs.writeFileSync(fixtureFile, html());

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 900, height: 760 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(fixtureFile).href, { waitUntil: "networkidle" });

const results = [];
for (const theme of ["light", "dark"]) {
  await page.evaluate((nextTheme) => {
    document.documentElement.dataset.theme = nextTheme;
  }, theme);
  await page.waitForTimeout(120);
  const themeResults = await page.evaluate((currentTheme) => {
  const inspect = (button) => {
    const rect = button.getBoundingClientRect();
    const style = getComputedStyle(button);
    const icon = button.querySelector(".icon-button__icon");
    const iconStyle = getComputedStyle(icon);
    const badge = button.querySelector(".icon-button__badge");
    const badgeRect = badge?.getBoundingClientRect();
    return {
      theme: currentTheme,
      density: button.getAttribute("data-density"),
      variant: [...button.classList].find((className) => className.startsWith("icon-button--"))?.replace("icon-button--", "") ?? "ghost",
      selected: button.getAttribute("aria-pressed") === "true",
      disabled: button.disabled,
      badge: Boolean(badge),
      width: Math.round(rect.width * 100) / 100,
      height: Math.round(rect.height * 100) / 100,
      radius: Math.round(parseFloat(style.borderRadius) * 100) / 100,
      boxSizing: style.boxSizing,
      color: style.color,
      backgroundColor: style.backgroundColor,
      opacity: Math.round(parseFloat(style.opacity) * 100) / 100,
      transitionProperty: style.transitionProperty,
      transform: style.transform,
      iconFontSize: Math.round(parseFloat(iconStyle.fontSize) * 100) / 100,
      iconColor: iconStyle.color,
      iconVariation: iconStyle.fontVariationSettings,
      badgeWidth: badgeRect ? Math.round(badgeRect.width * 100) / 100 : 0,
      badgeHeight: badgeRect ? Math.round(badgeRect.height * 100) / 100 : 0,
    };
  };
  return [...document.querySelectorAll(".icon-button")].map(inspect);
  }, theme);
  results.push(...themeResults);
}

const hoverScales = [];
const pressScales = [];
await page.evaluate(() => {
  document.documentElement.dataset.theme = "light";
});
for (const density of ["sm", "md", "lg"]) {
  const selector = `.icon-button[data-density="${density}"]:not([disabled])`;
  const button = page.locator(selector).first();
  await button.hover();
  await page.waitForTimeout(180);
  hoverScales.push({ density, scale: transformScale(await button.evaluate((node) => getComputedStyle(node).transform)) });
  const box = await button.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.waitForTimeout(180);
  pressScales.push({ density, scale: transformScale(await button.evaluate((node) => getComputedStyle(node).transform)) });
  await page.mouse.up();
  await page.waitForTimeout(60);
}
await browser.close();

const errors = [];
for (const result of results) {
  const frame = expectedFrame[result.density];
  const icon = expectedIcon[result.density];
  if (result.width !== frame || result.height !== frame) {
    errors.push(`${result.theme} ${result.variant} ${result.density} frame must be ${frame}x${frame}; got ${result.width}x${result.height}.`);
  }
  if (result.boxSizing !== "border-box") {
    errors.push(`${result.theme} ${result.variant} ${result.density} must use border-box; got ${result.boxSizing}.`);
  }
  if (result.radius < frame / 2) {
    errors.push(`${result.theme} ${result.variant} ${result.density} must remain circular; radius ${result.radius}px is less than ${frame / 2}px.`);
  }
  if (result.iconFontSize !== icon) {
    errors.push(`${result.theme} ${result.variant} ${result.density} icon must be ${icon}px; got ${result.iconFontSize}px.`);
  }
  if (!result.transitionProperty.includes("transform")) {
    errors.push(`${result.theme} ${result.variant} ${result.density} must include transform in motion transition.`);
  }
  if (result.badge && (result.badgeWidth <= 0 || result.badgeHeight <= 0)) {
    errors.push(`${result.theme} ${result.variant} ${result.density} badge must render without changing the frame.`);
  }
  if (result.selected && !/FILL|1/.test(result.iconVariation)) {
    errors.push(`${result.theme} ${result.variant} ${result.density} selected icon must expose filled symbol variation.`);
  }
  if (result.disabled && result.opacity < 0.5) {
    errors.push(`${result.theme} ${result.variant} ${result.density} disabled must stay readable; got opacity ${result.opacity}.`);
  }
}

const lightGhost = results.find((result) => result.theme === "light" && result.density === "md" && result.variant === "ghost" && !result.selected && !result.badge && !result.disabled);
const darkGhost = results.find((result) => result.theme === "dark" && result.density === "md" && result.variant === "ghost" && !result.selected && !result.badge && !result.disabled);
const lightSecondary = results.find((result) => result.theme === "light" && result.density === "md" && result.variant === "secondary");
const darkSecondary = results.find((result) => result.theme === "dark" && result.density === "md" && result.variant === "secondary");
if (!lightGhost || !darkGhost || lightGhost.color === darkGhost.color) {
  errors.push("IconButton runtime must load token-contexts.css and prove dark theme changes icon foreground tokens.");
}
if (!lightSecondary || !darkSecondary || lightSecondary.backgroundColor === darkSecondary.backgroundColor) {
  errors.push("IconButton runtime must prove dark theme changes surfaced variant backgrounds.");
}

for (const hover of hoverScales) {
  if (!(hover.scale > 1)) errors.push(`icon-button ${hover.density} hover must scale up; got ${hover.scale}.`);
}
for (const press of pressScales) {
  if (!(press.scale < 1)) errors.push(`icon-button ${press.density} press must scale down; got ${press.scale}.`);
}

const report = {
  status: errors.length ? "fail" : "pass",
  expectedFrame,
  expectedIcon,
  results,
  hoverScales,
  pressScales,
  errors,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
