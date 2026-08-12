#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const root = process.cwd();
const componentsSourceDir = path.join(root, "packages/components/src");
const sourceDir = path.join(root, "packages/components/src/primitives");
const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-components-primitives-"));
const tscBin = path.join(root, "node_modules/.bin/tsc");

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

const files = listFiles(sourceDir)
  .filter((file) => file.endsWith(".ts") && !file.endsWith(".d.ts"))
  .sort();

const result = spawnSync(tscBin, [
  "--ignoreConfig",
  "--target", "ES2020",
  "--module", "ESNext",
  "--moduleResolution", "bundler",
  "--skipLibCheck",
  "--rootDir", componentsSourceDir,
  "--outDir", outDir,
  ...files,
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

const compiledPrimitivesDir = path.join(outDir, "primitives");
for (const compiledFile of listFiles(compiledPrimitivesDir).filter((file) => file.endsWith(".js")).sort()) {
  const relative = path.relative(compiledPrimitivesDir, compiledFile);
  const target = path.join(sourceDir, relative);
  fs.writeFileSync(target, fs.readFileSync(compiledFile, "utf8"));
}

fs.rmSync(outDir, { recursive: true, force: true });
