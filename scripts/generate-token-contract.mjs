#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkMode = process.argv.includes("--check");
const cssPath = path.join(root, "packages/tokens/styles/tokens.css");
const outputPath = path.join(root, "packages/tokens/tokens.json");

function tokenType(name, value) {
  if (/color|energy|surface|text|border|action|danger|warning|success|focus/.test(name) && /#|color|var\(--(?:sys|ref)-(?:color|energy|state|disabled)/.test(value)) {
    return "color";
  }
  if (/space|spacing|gap|padding|radius|width|height|size|inline|block|target|breakpoint|content/.test(name)) {
    return "dimension";
  }
  if (/duration|transition|stagger/.test(name)) return "duration";
  if (/ease|curve/.test(name)) return "cubicBezier";
  if (/family|font/.test(name)) return "fontFamily";
  if (/weight/.test(name)) return "fontWeight";
  if (/line-height/.test(name)) return "lineHeight";
  if (/opacity/.test(name)) return "opacity";
  if (/shadow|depth|elevation/.test(name)) return "shadow";
  if (/z-index/.test(name)) return "zIndex";
  return "unknown";
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
