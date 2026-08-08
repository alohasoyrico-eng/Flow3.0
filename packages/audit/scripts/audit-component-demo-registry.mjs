#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "../../..");
const backlogPath = path.join(repoRoot, "packages/content/content/component-quality-backlog.json");
const backlog = JSON.parse(fs.readFileSync(backlogPath, "utf8"));
const forbiddenDocsSystemImports = /\bimport\s*\{[^}]*\bhydrate[A-Z][A-Za-z0-9_]*\b[^}]*\}\s*from\s*["']#design-system\/components["']/;

function docsModulePath(fileName) {
  const found = docsModulePathOptional(fileName);
  if (!found) throw new Error(`Docs module not found for split audit: ${fileName}`);
  return found;
}

function docsModulePathOptional(fileName) {
  const candidates = [
    path.join(repoRoot, "../FlowDocs/apps/docs", fileName),
    path.join(repoRoot, "apps/docs", fileName),
  ];
  return candidates.find((file) => fs.existsSync(file));
}

class AuditText {
  constructor(text) {
    this.textContent = String(text);
  }

  get outerHTML() {
    return escapeHtml(this.textContent);
  }
}

class AuditNode {
  constructor(tagName = "") {
    this.tagName = String(tagName).toUpperCase();
    this.children = [];
    this.attributes = {};
    this.dataset = {};
    this.className = "";
    this.textContent = "";
    this.style = "";
    this.type = "";
    this.value = "";
    this.id = "";
    this.href = "";
    this.src = "";
    this.alt = "";
    this.name = "";
    this.min = "";
    this.max = "";
    this.step = "";
    this.rows = 0;
    this.maxLength = -1;
    this.placeholder = "";
    this.tabIndex = 0;
    this.disabled = false;
    this.hidden = false;
    this.checked = false;
    this.indeterminate = false;
    this.required = false;
    this.selected = false;
  }

  append(...nodes) {
    for (const node of nodes) {
      this.children.push(typeof node === "string" ? new AuditText(node) : node);
    }
    this.textContent = this.children.map((node) => node.textContent ?? "").join("");
  }

  setAttribute(name, value) {
    this.attributes[name] = String(value);
  }

  getAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name) ? this.attributes[name] : null;
  }

  hasAttribute(name) {
    return Object.prototype.hasOwnProperty.call(this.attributes, name);
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] ?? null;
  }

  querySelectorAll(selector) {
    const matches = [];
    const visit = (node) => {
      if (node instanceof AuditText) return;
      if (matchesSelector(node, selector)) matches.push(node);
      for (const child of node.children) visit(child);
    };
    visit(this);
    return matches;
  }

  get outerHTML() {
    const attrs = serializeAttributes(this);
    const content = this.children.length
      ? this.children.map((node) => node.outerHTML ?? escapeHtml(node.textContent ?? "")).join("")
      : escapeHtml(this.textContent ?? "");
    return `<${this.tagName.toLowerCase()}${attrs}>${content}</${this.tagName.toLowerCase()}>`;
  }
}

globalThis.document = {
  createElement(tagName) {
    return new AuditNode(tagName);
  },
  createTextNode(text) {
    return new AuditText(text);
  },
};

const { componentDemo } = await import(
  pathToFileURL(docsModulePath("component-demo.js")).href
);

for (const fileName of ["component-demo.js"]) {
  const source = fs.readFileSync(docsModulePath(fileName), "utf8");
  assert.equal(
    forbiddenDocsSystemImports.test(source),
    false,
    `${fileName} must consume React/package contracts only; docs must not import DOM hydrators from #design-system/components.`
  );
}

const componentIds = [
  ...backlog.accepted,
  ...backlog.contractPending,
  ...backlog.scopeDecisionPending,
];

const failures = [];
for (const componentId of componentIds) {
  const html = componentDemo(componentId, {});
  const expectedSource = new Set(["accordion", "animated-moment", "audit-event", "avatar", "badge", "biometric-prompt", "breadcrumbs", "button", "card", "card-expiry-input", "card-number-input", "card-security-code-input", "card-summary", "chart-panel", "checkbox", "chip", "code-input", "combobox", "country-selector", "date-picker", "date-range-picker", "dialog", "drawer", "empty-state", "error-panel", "floating-action-button", "icon-button", "inline-validation", "input", "kpi-tile", "list", "menu", "motion-boundary", "movement-row", "pagination", "phone-input", "popover", "progress-indicator", "quick-action", "radio-button", "route-summary", "station-pin", "select", "segmented-control", "skeleton", "slider", "spinner", "stepper", "switch", "tabs", "table", "tag", "text-area", "toast", "tooltip", "tree-view"]).has(componentId) ? 'data-component-source="react"' : 'data-component-source="package"';
  if (!html.includes(expectedSource)) {
    failures.push(componentId);
  }
  assert.ok(
    html.includes(`data-doc-component="${componentId}"`),
    `${componentId} package-backed demo must expose data-doc-component for docs behavior.`
  );
  assert.ok(
    /class="[^"]*\bdocs-package-demo\b/.test(html),
    `${componentId} package-backed demo must expose docs-package-demo for documentation layout only.`
  );
  assert.ok(
    !new RegExp(`class="[^"]*\\b${escapeRegExp(componentId)}-demo\\b`).test(html),
    `${componentId} package-backed demo must not carry legacy *-demo component styling class.`
  );
}

assert.deepEqual(failures, [], `Components fell back to legacy demo markup: ${failures.join(", ")}`);

const strictPackageBackedDocs = backlog.accepted ?? [];
const forbiddenManualDemoPatterns = [
  /if\s*\(\s*implemented\s*\)\s*return\s+implemented\s*;/,
  /data-component-source="missing"/,
  /class="[^"]*\b(?:button|select|input|checkbox|radio|switch|text-area)-demo(?:\s|")/,
];

for (const componentId of strictPackageBackedDocs) {
  const docsFile = docsModulePathOptional(`gold-${componentId}-docs.js`);
  if (!docsFile) continue;
  const source = fs.readFileSync(docsFile, "utf8");
  const violation = forbiddenManualDemoPatterns.find((pattern) => pattern.test(source));
  assert.equal(
    violation,
    undefined,
    `${componentId} docs must not include manual component fallback markup; render through componentDemo()/package only.`
  );
}

console.log(JSON.stringify({
  status: "pass",
  checked: componentIds.length,
  strictPackageBackedDocs,
  source: "system component registry",
}, null, 2));

function serializeAttributes(node) {
  const attrs = { ...node.attributes };
  if (node.className) attrs.class = node.className;
  if (node.id) attrs.id = node.id;
  if (node.href) attrs.href = node.href;
  if (node.src) attrs.src = node.src;
  if (node.alt) attrs.alt = node.alt;
  if (node.name) attrs.name = node.name;
  if (node.type) attrs.type = node.type;
  if (node.value) attrs.value = node.value;
  if (node.min) attrs.min = node.min;
  if (node.max) attrs.max = node.max;
  if (node.step) attrs.step = node.step;
  if (node.rows) attrs.rows = String(node.rows);
  if (node.placeholder) attrs.placeholder = node.placeholder;
  if (node.style) attrs.style = node.style;
  if (node.maxLength >= 0) attrs.maxlength = String(node.maxLength);
  if (node.tabIndex !== 0) attrs.tabindex = String(node.tabIndex);
  if (node.disabled) attrs.disabled = "";
  if (node.hidden) attrs.hidden = "";
  if (node.checked) attrs.checked = "";
  if (node.required) attrs.required = "";
  if (node.selected) attrs.selected = "";
  for (const [key, value] of Object.entries(node.dataset)) {
    attrs[`data-${key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)}`] = value;
  }
  return Object.entries(attrs)
    .map(([key, value]) => value === "" ? ` ${key}` : ` ${key}="${escapeAttribute(value)}"`)
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function matchesSelector(node, selector) {
  if (selector.startsWith(".")) return node.className.split(" ").includes(selector.slice(1));
  if (selector.startsWith("[")) {
    const attr = selector.slice(1, -1).split("=")[0];
    return Object.hasOwn(node.attributes, attr);
  }
  return node.tagName.toLowerCase() === selector.toLowerCase();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
