#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const cssPath = path.join(root, "packages/tokens/styles/tokens.css");
const outputPath = path.join(root, "packages/tokens/source/flow.tokens.json");

function tokenType(name, value) {
  if (/\b(solid|dashed|dotted)\b/.test(value)) return "border";
  if (/voice-transform/.test(name)) return "textTransform";
  if (/variation/.test(name)) return "fontVariationSettings";
  if (/cursor|pointer-events|role/.test(name)) return "content";
  if (/duration|transition|stagger/.test(name) || /^-?\d*\.?\d+m?s$/.test(value)) return "duration";
  if (/ease|curve/.test(name) || /^cubic-bezier\(/.test(value)) return "cubicBezier";
  if (/^(?:#|rgb\(|color-mix\()/.test(value)) return "color";
  if (/offset/.test(name)) return "dimension";
  if (/transform/.test(name) || /^(?:translate|scale|rotate)/.test(value)) return "transform";
  if (/color|energy|surface|text|action|danger|warning|success/.test(name) && /#|rgb\(|color|var\(--(?:sys|ref)-(?:color|energy|state|disabled)/.test(value)) {
    return "color";
  }
  if (/space|spacing|gap|padding|radius|width|height|size|inline|block|target|breakpoint|content|border|sidebar|grid|ratio|position/.test(name) || /^-?\d*\.?\d+(?:px|rem|em|%|vh|vw|deg)$/.test(value) || /^calc\(/.test(value)) {
    return "dimension";
  }
  if (/family|font/.test(name)) return "fontFamily";
  if (/weight/.test(name)) return "fontWeight";
  if (/line-height/.test(name)) return "lineHeight";
  if (/opacity/.test(name)) return "opacity";
  if (/shadow|depth|elevation/.test(name)) return "shadow";
  if (/z-index/.test(name)) return "zIndex";
  if (/^-?\d*\.?\d+$/.test(value)) return "number";
  if (/^(?:none|uppercase|lowercase|capitalize|status|alert|polite|assertive|off|progress|not-allowed)$/.test(value)) return "content";
  return "unknown";
}

function cssVarToReference(value) {
  const match = value.match(/^var\(--([a-z0-9-]+)\)$/);
  return match ? `{${match[1]}}` : value;
}

function setToken(target, name, value) {
  target[name] = {
    $value: cssVarToReference(value),
    $type: tokenType(name, value),
    $extensions: {
      flow: {
        cssVariable: `--${name}`,
        legacyBootstrapSource: path.relative(root, cssPath),
      },
    },
  };
}

const css = fs.readFileSync(cssPath, "utf8");
const tokens = {};
let tokenCount = 0;
for (const match of css.matchAll(/--(?<name>[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
  setToken(tokens, match.groups.name, match.groups.value.trim());
  tokenCount += 1;
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(tokens, null, 2)}\n`);
console.log(JSON.stringify({
  status: "pass",
  output: path.relative(root, outputPath),
  tokens: tokenCount,
}, null, 2));
