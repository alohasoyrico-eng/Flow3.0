const { path, read, add, lineNumber } = require("./audit-context.js");

const repoRoot = process.cwd();
const tokensCssFile = path.join(repoRoot, "packages/tokens/styles/tokens.css");
const tokenContextsCssFile = path.join(repoRoot, "packages/tokens/styles/token-contexts.css");

function checkDarkModeCssContract({ text, packageCssFile }) {
  const docsShellDarkComponentSelector = /\[data-flow-template="docs-shell-template"\]\[data-theme="dark"\]\s+(?:\.(?:button|badge|field|field-control|card)\b)/g;
  for (const match of text.matchAll(docsShellDarkComponentSelector)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Component dark mode must be scoped to the public theme contract, not docs-shell-template. Use [data-theme=\"dark\"] component selectors so Flow React works outside FlowDocs.");
  }

  if (text.includes('[data-flow-template="docs-shell-template"][data-theme="dark"] {')) {
    add("errors", packageCssFile, lineNumber(text, text.indexOf('[data-flow-template="docs-shell-template"][data-theme="dark"] {')), "Dark mode system and component aliases must be exposed through the public [data-theme=\"dark\"] contract, not only through DocsShell.");
  }

  const tokenContexts = read(tokenContextsCssFile);
  const darkThemeBlock = tokenContexts.match(/:root\[data-theme="dark"\],[\s\S]*?\n}/)?.[0] ?? "";
  for (const snippet of [
    ":root[data-theme=\"dark\"],",
    "body[data-theme=\"dark\"],",
    "[data-theme=\"dark\"] {",
    "--component-action-bg-secondary:",
    "--component-action-bg-tertiary:",
    "--component-action-bg-outlined:",
    "--component-action-bg-ghost-hover:",
    "--component-action-bg-danger-secondary:",
    "--ref-depth-shadow-color-rgb: var(--ref-depth-shadow-dark-color-rgb);",
    "--sys-depth-elevation-1: var(--sys-depth-elevation-dark-1);",
    "--sys-depth-elevation-2: var(--sys-depth-elevation-dark-2);",
    "--sys-depth-elevation-3: var(--sys-depth-elevation-dark-3);",
    "--sys-depth-elevation-4: var(--sys-depth-elevation-dark-4);",
  ]) {
    if (!tokenContexts.includes(snippet)) {
      add("errors", tokenContextsCssFile, 1, `Dark mode system roles must be emitted by token contexts, not components.css: missing ${snippet}`);
    }
  }
  if (!darkThemeBlock.includes("--component-action-bg-secondary:")) {
    add("errors", tokenContextsCssFile, 1, "Token contexts must expose dark theme action appearance roles in the public [data-theme=\"dark\"] contract.");
  }
  const componentActionDarkOverride = /\[data-theme="dark"\][^{]*\{[^}]*--component-action-/g;
  for (const match of text.matchAll(componentActionDarkOverride)) {
    add("errors", packageCssFile, lineNumber(text, match.index), "Action appearance dark mode must be owned by packages/tokens/styles/token-contexts.css, not components.css.");
  }
  const tokensCss = read(tokensCssFile);
  for (const tokenName of [
    "--ref-depth-shadow-dark-color-rgb:",
    "--sys-depth-elevation-dark-1:",
    "--sys-depth-elevation-dark-2:",
    "--sys-depth-elevation-dark-3:",
    "--sys-depth-elevation-dark-4:",
  ]) {
    if (!tokensCss.includes(tokenName)) {
      add("errors", tokensCssFile, 1, `Dark depth scale must be generated from token source: missing ${tokenName}`);
    }
  }

  checkDarkModeContrast({ text, packageCssFile });
}

function checkDarkModeContrast({ text, packageCssFile }) {
  const variables = new Map();
  const tokenContexts = read(tokenContextsCssFile);
  const darkThemeBlock = tokenContexts.match(/:root\[data-theme="dark"\],[\s\S]*?\n}/)?.[0] ?? "";
  collectVariables(variables, read(tokensCssFile));
  collectVariables(variables, text.match(/:root\s*{[\s\S]*?\n}/)?.[0] ?? "");
  collectVariables(variables, text.match(/:root\[data-theme="dark"\],[\s\S]*?\n}/)?.[0] ?? "");
  collectVariables(variables, darkThemeBlock);

  const pairs = [
    ["text on surface", "--component-color-text", "--component-color-surface", 4.5],
    ["muted text on surface", "--component-color-text-muted", "--component-color-surface", 4.5],
    ["subtle text on surface", "--component-color-text-subtle", "--component-color-surface", 3],
    ["text on raised surface", "--component-color-text", "--component-color-surface-raised", 4.5],
    ["muted text on raised surface", "--component-color-text-muted", "--component-color-surface-raised", 4.5],
    ["text on muted surface", "--component-color-text", "--component-color-surface-muted", 4.5],
    ["action text on action", "--component-color-action-text", "--component-color-action", 4.5],
    ["danger text on surface", "--component-color-danger", "--component-color-surface", 4.5],
    ["success text on surface", "--component-color-success", "--component-color-surface", 4.5],
    ["warning text on surface", "--component-color-warning", "--component-color-surface", 3],
    ["field placeholder on raised surface", "--component-field-placeholder-fg", "--component-color-surface-raised", 4.5],
    ["field error helper on surface", "--component-field-error-helper-fg", "--component-color-surface", 4.5],
    ["text on listbox", "--component-color-text", "--component-listbox-bg", 4.5],
    ["muted text on listbox", "--component-color-text-muted", "--component-listbox-bg", 4.5],
    ["text on selected option row", "--component-color-text", "--component-option-row-selected-bg", 4.5],
    ["small action indicator on surface", "--component-color-action-indicator", "--component-color-surface", 4.5],
    ["small action indicator on raised surface", "--component-color-action-indicator", "--component-color-surface-raised", 4.5],
    ["small action indicator text", "--component-color-action-indicator-text", "--component-color-action-indicator", 4.5],
  ];

  for (const [label, foregroundToken, backgroundToken, minimum] of pairs) {
    const foreground = resolveColor(foregroundToken, variables);
    const background = resolveColor(backgroundToken, variables);
    if (!foreground || !background) {
      add("errors", packageCssFile, 1, `Dark mode contrast audit could not resolve ${label}: ${foregroundToken} on ${backgroundToken}.`);
      continue;
    }
    const ratio = contrastRatio(foreground, background);
    if (ratio < minimum) {
      add("errors", packageCssFile, 1, `Dark mode contrast ${label} is ${ratio.toFixed(2)}:1; required ${minimum}:1 (${foregroundToken} on ${backgroundToken}).`);
    }
  }
}

function collectVariables(target, source) {
  for (const match of source.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) target.set(match[1], match[2].trim());
}

function resolveColor(value, variables, seen = new Set()) {
  const raw = value.startsWith("--") ? `var(${value})` : value.trim();
  const varMatch = raw.match(/^var\((--[\w-]+)(?:,[^)]+)?\)$/);
  if (varMatch) {
    const name = varMatch[1];
    if (seen.has(name)) return null;
    seen.add(name);
    const next = variables.get(name);
    return next ? resolveColor(next, variables, seen) : null;
  }
  const hexMatch = raw.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hexMatch) return hexToRgb(hexMatch[1]);
  const mixMatch = raw.match(/^color-mix\(in srgb,\s*(.+?)\s+([0-9.]+)%,\s*(.+?)\)$/);
  if (mixMatch) {
    const first = resolveColor(mixMatch[1], variables, new Set(seen));
    const second = mixMatch[3].trim() === "transparent" ? [255, 255, 255] : resolveColor(mixMatch[3], variables, new Set(seen));
    if (!first || !second) return null;
    const weight = Number(mixMatch[2]) / 100;
    return first.map((channel, index) => channel * weight + second[index] * (1 - weight));
  }
  return null;
}

function hexToRgb(hex) {
  const full = hex.length === 3 ? hex.split("").map((char) => char + char).join("") : hex;
  return [0, 2, 4].map((index) => Number.parseInt(full.slice(index, index + 2), 16));
}

function contrastRatio(foreground, background) {
  const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
  const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance(rgb) {
  const [r, g, b] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

module.exports = { checkDarkModeCssContract };
