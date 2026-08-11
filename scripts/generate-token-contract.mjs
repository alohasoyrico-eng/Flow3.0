#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkMode = process.argv.includes("--check");
const cssPath = path.join(root, "packages/tokens/styles/tokens.css");
const outputPath = path.join(root, "packages/tokens/tokens.json");

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

function resolveAliasTypes(tokens) {
  const memo = new Map();
  function inheritedType(name, seen = new Set()) {
    if (memo.has(name)) return memo.get(name);
    const token = tokens[name];
    if (!token) return "unknown";
    if (token.type !== "unknown") {
      memo.set(name, token.type);
      return token.type;
    }
    const reference = String(token.value).match(/^var\(--([a-z0-9-]+)\)$/)?.[1] ?? null;
    if (!reference || seen.has(reference)) {
      memo.set(name, token.type);
      return token.type;
    }
    seen.add(name);
    const nextType = inheritedType(reference, seen);
    if (nextType !== "unknown") token.type = nextType;
    memo.set(name, token.type);
    return token.type;
  }
  for (const name of Object.keys(tokens)) inheritedType(name);
}

function buildContract(css) {
  const tokens = {};
  for (const match of css.matchAll(/--(?<name>[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    const name = match.groups.name;
    const value = match.groups.value.trim();
    const cssVariable = `--${name}`;
    const reference = value.match(/^var\((--[a-z0-9-]+)\)$/)?.[1] ?? null;
    tokens[name] = {
      value,
      type: tokenType(name, value),
      scope: name.split("-")[0],
      cssVariable,
      ...(reference ? { cssReference: reference } : {}),
    };
  }
  resolveAliasTypes(tokens);
  return {
    name: "Flow design tokens",
    version: "0.1.0",
    format: "flow-token-contract@1",
    source: path.relative(root, cssPath),
    compatibleWith: ["style-dictionary"],
    tokens,
  };
}

const css = fs.readFileSync(cssPath, "utf8");
const next = `${JSON.stringify(buildContract(css), null, 2)}\n`;

if (checkMode) {
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";
  if (current !== next) {
    console.error("Token JSON contract is stale. Run: node scripts/generate-token-contract.mjs");
    process.exit(1);
  }
  console.log(JSON.stringify({ status: "pass", tokens: Object.keys(JSON.parse(next).tokens).length }, null, 2));
} else {
  fs.writeFileSync(outputPath, next);
  console.log(JSON.stringify({ status: "pass", output: path.relative(root, outputPath), tokens: Object.keys(JSON.parse(next).tokens).length }, null, 2));
}
