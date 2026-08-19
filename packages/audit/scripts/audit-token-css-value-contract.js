const fs = require("fs");
const path = require("path");
const { add, lineNumber } = require("./audit-context.js");

const root = process.cwd();
const tokenSourceDir = path.join(root, "packages/tokens/source");
const generatedTokenOutputs = [
  "packages/tokens/styles/tokens.css",
  "packages/tokens/tokens.json",
  "packages/tokens/dist/flutter/flow_tokens.dart",
  "packages/tokens/dist/android/flow_tokens.xml",
  "packages/tokens/dist/ios/FlowTokens.swift",
];

function walkTokenSourceFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) walkTokenSourceFiles(fullPath, out);
    else if (entry.isFile() && entry.name.endsWith(".tokens.json")) out.push(fullPath);
  }
  return out;
}

function checkTokenCssValueContract() {
  for (const file of walkTokenSourceFiles(tokenSourceDir)) {
    const text = fs.readFileSync(file, "utf8");
    const sourceMixReference = text.match(/color-mix\([^"\n]*\{[a-z0-9-]+\}[^"\n]*\)/i);
    if (sourceMixReference) {
      add(
        "errors",
        file,
        lineNumber(text, sourceMixReference.index),
        "Token source must not place Style Dictionary {token} references inside CSS functions. Use a CSS var() reference so generated CSS remains browser-valid.",
      );
    }
  }

  for (const relativeFile of generatedTokenOutputs) {
    const file = path.join(root, relativeFile);
    if (!fs.existsSync(file)) continue;
    const text = fs.readFileSync(file, "utf8");
    const generatedRawReference = text.match(/\{[a-z0-9-]+\}/i);
    if (generatedRawReference) {
      add(
        "errors",
        file,
        lineNumber(text, generatedRawReference.index),
        "Generated token outputs must not contain unresolved {token} references.",
      );
    }
  }
}

module.exports = { checkTokenCssValueContract };
