#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bin = path.join(root, "node_modules/.bin/style-dictionary");
const sourceRoot = path.join(root, "packages/tokens/source");
const mergedSource = path.join(root, "packages/tokens/.build/flow.tokens.json");
const manifestFile = path.join(root, "packages/tokens/dist/token-output-manifest.json");
const reactEmailTokenValues = path.join(root, "packages/react/src/internal/email-token-values.js");
const outputFiles = [
  "packages/tokens/styles/tokens.css",
  "packages/tokens/tokens.json",
  "packages/tokens/src/generated/tokens.ts",
  "packages/tokens/dist/flutter/flow_tokens.dart",
  "packages/tokens/dist/android/flow_tokens.xml",
  "packages/tokens/dist/ios/FlowTokens.swift",
  "packages/react/src/internal/email-token-values.js",
];

function walkTokenFiles(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTokenFiles(file, out);
    if (entry.isFile() && entry.name.endsWith(".tokens.json")) out.push(file);
  }
  return out.sort();
}

const mergedTokens = {};
for (const file of walkTokenFiles(sourceRoot)) {
  const tokens = JSON.parse(fs.readFileSync(file, "utf8"));
  for (const [name, token] of Object.entries(tokens)) {
    if (Object.prototype.hasOwnProperty.call(mergedTokens, name)) {
      throw new Error(`Duplicate token "${name}" while building Style Dictionary source`);
    }
    mergedTokens[name] = token;
  }
}

fs.mkdirSync(path.dirname(mergedSource), { recursive: true });
fs.writeFileSync(mergedSource, `${JSON.stringify(mergedTokens, null, 2)}\n`);

const result = spawnSync(bin, ["build", "--config", "style-dictionary.config.mjs"], {
  cwd: root,
  env: {
    ...process.env,
    FLOW_STYLE_DICTIONARY_SOURCE: path.relative(root, mergedSource),
  },
  stdio: "inherit",
});

if (result.status !== 0) process.exit(result.status ?? 1);

const emailTokens = Object.fromEntries(
  Object.entries(mergedTokens)
    .filter(([name]) => name.startsWith("sys-email-"))
    .map(([name, token]) => [name, token.$value]),
);

fs.mkdirSync(path.dirname(reactEmailTokenValues), { recursive: true });
fs.writeFileSync(
  reactEmailTokenValues,
  [
    "export const emailTokenValues = Object.freeze(",
    `${JSON.stringify(emailTokens, null, 2)});`,
    "",
  ].join("\n"),
);

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const manifest = {
  source: {
    file: path.relative(root, mergedSource),
    sha256: sha256(mergedSource),
    tokenCount: Object.keys(mergedTokens).length,
  },
  outputs: outputFiles.map((file) => ({
    file,
    sha256: sha256(path.join(root, file)),
  })),
};

fs.mkdirSync(path.dirname(manifestFile), { recursive: true });
fs.writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`);
