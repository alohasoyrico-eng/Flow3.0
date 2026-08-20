#!/usr/bin/env node

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { chromium } from "playwright";

const root = process.cwd();
const cssFile = path.join(root, "packages/components/styles/components.css");
const expectedChoiceIndicator = { sm: 16, md: 20, lg: 24 };
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
      .fixture { display: grid; gap: 16px; inline-size: 420px; }
      .slider { inline-size: 320px; }
    </style>
  </head>
  <body>
    <main class="fixture">
      ${["sm", "md", "lg"].map((density) => `
        <label class="choice checkbox" data-density="${density}" data-checked="true">
          <input class="choice__input" type="checkbox" checked aria-label="Checkbox ${density}">
          <span class="choice__mark"><span class="choice__indicator material-symbol" aria-hidden="true">check</span></span>
          <span class="choice__text"><span class="choice__label">Checkbox ${density}</span></span>
        </label>
        <label class="choice radio" data-density="${density}" data-checked="true" data-state="selected">
          <input class="choice__input" type="radio" checked aria-label="Radio ${density}">
          <span class="choice__mark"><span class="choice__indicator" aria-hidden="true"></span></span>
          <span class="choice__text"><span class="choice__label">Radio ${density}</span></span>
        </label>
        <label class="switch" data-density="${density}" data-checked="true">
          <input class="switch__input" type="checkbox" role="switch" checked aria-label="Switch ${density}">
          <span class="switch__track"><span class="switch__thumb"></span></span>
          <span class="switch__text"><span class="switch__label">Switch ${density}</span></span>
        </label>
        <label class="slider" data-density="${density}" style="--comp-slider-percent: 50%;">
          <span class="slider__meta"><span class="slider__label">Slider ${density}</span><span class="slider__value">50</span></span>
          <span class="slider__control">
            <span class="slider__track"></span>
            <span class="slider__fill"></span>
            <span class="slider__thumb"></span>
            <input class="slider__input" type="range" min="0" max="100" value="50" aria-label="Slider ${density}">
          </span>
        </label>
      `).join("")}
    </main>
  </body>
</html>`;
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function assertIncreasing(results, component, key, errors) {
  const byDensity = Object.fromEntries(results.filter((result) => result.component === component).map((result) => [result.density, result[key]]));
  if (!(byDensity.sm < byDensity.md && byDensity.md < byDensity.lg)) {
    errors.push(`${component} ${key} must increase sm < md < lg; got ${JSON.stringify(byDensity)}.`);
  }
}

const fixtureFile = path.join(os.tmpdir(), "flow-choice-frame-runtime.html");
fs.writeFileSync(fixtureFile, html());

const browser = await chromium.launch(browserLaunchOptions());
const page = await browser.newPage({ viewport: { width: 760, height: 980 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(fixtureFile).href, { waitUntil: "networkidle" });
const results = await page.evaluate(() => {
  const rectOf = (node) => {
    const rect = node.getBoundingClientRect();
    const style = getComputedStyle(node);
    return {
      width: Math.round(rect.width * 100) / 100,
      height: Math.round(rect.height * 100) / 100,
      boxSizing: style.boxSizing,
      fontSize: Math.round(parseFloat(style.fontSize) * 100) / 100,
    };
  };
  return ["sm", "md", "lg"].flatMap((density) => {
    const checkbox = document.querySelector(`.checkbox[data-density="${density}"]`);
    const radio = document.querySelector(`.radio[data-density="${density}"]`);
    const switchRoot = document.querySelector(`.switch[data-density="${density}"]`);
    const slider = document.querySelector(`.slider[data-density="${density}"]`);
    const checkboxMark = rectOf(checkbox.querySelector(".choice__mark"));
    const checkboxIndicator = rectOf(checkbox.querySelector(".choice__indicator"));
    const radioMark = rectOf(radio.querySelector(".choice__mark"));
    const radioIndicator = rectOf(radio.querySelector(".choice__indicator"));
    const switchTrack = rectOf(switchRoot.querySelector(".switch__track"));
    const switchThumb = rectOf(switchRoot.querySelector(".switch__thumb"));
    const sliderControl = rectOf(slider.querySelector(".slider__control"));
    const sliderTrack = rectOf(slider.querySelector(".slider__track"));
    const sliderThumb = rectOf(slider.querySelector(".slider__thumb"));
    return [
      { component: "checkbox", density, mark: checkboxMark.height, indicatorFont: checkboxIndicator.fontSize, markBoxSizing: checkboxMark.boxSizing },
      { component: "radioButton", density, mark: radioMark.height, indicator: radioIndicator.height, markBoxSizing: radioMark.boxSizing },
      { component: "switch", density, trackWidth: switchTrack.width, trackHeight: switchTrack.height, thumb: switchThumb.height, trackBoxSizing: switchTrack.boxSizing, thumbBoxSizing: switchThumb.boxSizing },
      { component: "slider", density, touch: sliderControl.height, track: sliderTrack.height, thumb: sliderThumb.height, controlBoxSizing: sliderControl.boxSizing, thumbBoxSizing: sliderThumb.boxSizing },
    ];
  });
});
await browser.close();

const errors = [];
for (const result of results) {
  if (result.component === "checkbox" || result.component === "radioButton") {
    if (result.markBoxSizing !== "border-box") {
      errors.push(`${result.component} ${result.density} mark must use border-box; got ${result.markBoxSizing}.`);
    }
  }
  if (result.component === "radioButton" && !(result.indicator > 0 && result.indicator < result.mark)) {
    errors.push(`radioButton ${result.density} dot must be visible and smaller than the mark; got dot ${result.indicator}px / mark ${result.mark}px.`);
  }
  if (result.component === "checkbox" && result.indicatorFont !== expectedChoiceIndicator[result.density]) {
    errors.push(`checkbox ${result.density} indicator font rendered ${result.indicatorFont}px; expected icon density ${expectedChoiceIndicator[result.density]}px.`);
  }
  if (result.component === "switch") {
    if (result.trackBoxSizing !== "border-box" || result.thumbBoxSizing !== "border-box") {
      errors.push(`switch ${result.density} track/thumb must use border-box; got ${result.trackBoxSizing}/${result.thumbBoxSizing}.`);
    }
    if (!(result.thumb < result.trackWidth && result.thumb <= result.trackHeight)) {
      errors.push(`switch ${result.density} thumb must fit inside track; got thumb ${result.thumb}px, track ${result.trackWidth}x${result.trackHeight}px.`);
    }
  }
  if (result.component === "slider") {
    if (result.controlBoxSizing !== "border-box" || result.thumbBoxSizing !== "border-box") {
      errors.push(`slider ${result.density} control/thumb must use border-box; got ${result.controlBoxSizing}/${result.thumbBoxSizing}.`);
    }
    if (!(result.track < result.thumb && result.thumb < result.touch)) {
      errors.push(`slider ${result.density} must satisfy track < thumb < touch; got ${result.track}px < ${result.thumb}px < ${result.touch}px.`);
    }
  }
}

assertIncreasing(results, "checkbox", "mark", errors);
assertIncreasing(results, "radioButton", "mark", errors);
assertIncreasing(results, "switch", "trackWidth", errors);
assertIncreasing(results, "switch", "thumb", errors);
assertIncreasing(results, "slider", "touch", errors);
assertIncreasing(results, "slider", "thumb", errors);

const report = {
  status: errors.length ? "fail" : "pass",
  expectedChoiceIndicator,
  results: results.map((result) => Object.fromEntries(Object.entries(result).map(([key, value]) => [key, typeof value === "number" ? round(value) : value]))),
  errors,
};

console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exit(1);
