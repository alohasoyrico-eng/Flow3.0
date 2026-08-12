#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const componentsSourceDir = path.join(root, "packages/components/src");
const sourceFile = path.join(root, "packages/components/src/index.ts");
const targetFile = path.join(root, "packages/components/src/index.js");
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-components-index-"));
const tscBin = path.join(root, "node_modules/.bin/tsc");

const result = spawnSync(tscBin, [
  "--ignoreConfig",
  "--target", "ES2020",
  "--module", "ESNext",
  "--moduleResolution", "bundler",
  "--skipLibCheck",
  "--rootDir", componentsSourceDir,
  "--outDir", outDir,
  sourceFile,
], {
  cwd: root,
  encoding: "utf8",
});

if (result.status !== 0) {
  if (result.stdout) process.stdout.write(result.stdout);
  if (result.stderr) process.stderr.write(result.stderr);
  fs.rmSync(outDir, { recursive: true, force: true });
  process.exit(result.status ?? 1);
}

const compiledFile = path.join(outDir, "index.js");
fs.writeFileSync(targetFile, fs.readFileSync(compiledFile, "utf8"));
fs.rmSync(outDir, { recursive: true, force: true });
