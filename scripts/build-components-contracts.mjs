#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const sourceFile = path.join(root, "packages/components/src/contracts.ts");
const runtimeFile = path.join(root, "packages/components/src/contracts.js");
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-components-contracts-"));
const tscBin = path.join(root, "node_modules/.bin/tsc");

const result = spawnSync(tscBin, [
  "--ignoreConfig",
  "--target", "ES2020",
  "--module", "ESNext",
  "--moduleResolution", "bundler",
  "--skipLibCheck",
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

fs.writeFileSync(runtimeFile, fs.readFileSync(path.join(outDir, "contracts.js"), "utf8"));
fs.rmSync(outDir, { recursive: true, force: true });
