import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");
const checkMode = process.argv.includes("--check");
const repoRoot = path.resolve(root, "../..");
const sourceRuntimeHeader = [
  "/* @generated from packages/react/src TypeScript source.",
  " * Do not edit this compatibility runtime directly.",
  " * Authored source of truth is the paired .ts/.tsx file.",
  " */",
  "",
].join("\n");

function rewritePublishedImports(source) {
  return source
    .replaceAll('"@design-system/components/platforms"', '"#flow/platforms"')
    .replaceAll('"@design-system/components"', '"#flow/components"');
}

function sourceOutputRelative(relative) {
  return relative.replace(/\.(?:ts|tsx)$/, ".js");
}

function listSourceFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listSourceFiles(file) : [file];
  });
}

function compileTypescriptSources() {
  const files = listSourceFiles(src)
    .filter((file) => /\.(?:ts|tsx)$/.test(file) && !file.endsWith(".d.ts"))
    .sort();
  if (!files.length) return null;

  const outDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-react-ts-"));
  const tscBin = path.join(repoRoot, "node_modules/.bin/tsc");
  const result = spawnSync(tscBin, [
    "--ignoreConfig",
    "--target", "ES2020",
    "--module", "ESNext",
    "--jsx", "react",
    "--moduleResolution", "bundler",
    "--allowSyntheticDefaultImports",
    "--skipLibCheck",
    "--rootDir", src,
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

  return outDir;
}

function sourceOutput(source, relative, compiledTypescriptDir) {
  if (!relative.endsWith(".ts") && !relative.endsWith(".tsx")) return rewritePublishedImports(source);
  const compiled = path.join(compiledTypescriptDir, sourceOutputRelative(relative));
  return rewritePublishedImports(fs.readFileSync(compiled, "utf8"));
}

function buildEntries(fromDir, baseDir = fromDir, compiledTypescriptDir = null) {
  const entries = [];
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...buildEntries(from, baseDir, compiledTypescriptDir));
      continue;
    }
    if (entry.name.endsWith(".d.ts")) {
      const relative = path.relative(baseDir, from);
      entries.push({
        relative,
        source: rewritePublishedImports(fs.readFileSync(from, "utf8")),
      });
      continue;
    }
    if (
      entry.name.endsWith(".js")
      && (fs.existsSync(from.replace(/\.js$/, ".ts")) || fs.existsSync(from.replace(/\.js$/, ".tsx")))
    ) continue;
    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".ts") && !entry.name.endsWith(".tsx")) continue;
    const relative = path.relative(baseDir, from);
    entries.push({
      relative: sourceOutputRelative(relative),
      source: sourceOutput(fs.readFileSync(from, "utf8"), relative, compiledTypescriptDir),
    });
  }
  return entries.sort((a, b) => a.relative.localeCompare(b.relative));
}

function writeSourceRuntimeFromTypescript(compiledTypescriptDir) {
  if (!compiledTypescriptDir) return;
  for (const file of listFiles(compiledTypescriptDir)) {
    if (!file.endsWith(".js")) continue;
    const relative = path.relative(compiledTypescriptDir, file);
    const to = path.join(src, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, `${sourceRuntimeHeader}${fs.readFileSync(file, "utf8")}`);
  }
}

function checkSourceRuntimeFromTypescript(compiledTypescriptDir) {
  if (!compiledTypescriptDir) return;
  const stale = [];
  for (const file of listFiles(compiledTypescriptDir)) {
    if (!file.endsWith(".js")) continue;
    const relative = path.relative(compiledTypescriptDir, file);
    const to = path.join(src, relative);
    const current = fs.existsSync(to) ? fs.readFileSync(to, "utf8") : null;
    const expected = `${sourceRuntimeHeader}${fs.readFileSync(file, "utf8")}`;
    if (current !== expected) stale.push(relative);
  }
  if (stale.length) {
    console.error(`React source runtime is stale. Run: npm run build:react. Stale files: ${stale.slice(0, 20).join(", ")}`);
    process.exit(1);
  }
}

function writeEntries(entries) {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  for (const entry of entries) {
    const to = path.join(dist, entry.relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.writeFileSync(to, entry.source);
  }
}

function checkEntries(entries) {
  const expectedFiles = new Set(entries.map((entry) => entry.relative));
  const stale = [];
  for (const entry of entries) {
    const to = path.join(dist, entry.relative);
    const current = fs.existsSync(to) ? fs.readFileSync(to, "utf8") : null;
    if (current !== entry.source) stale.push(entry.relative);
  }
  if (fs.existsSync(dist)) {
    for (const file of listFiles(dist)) {
      const relative = path.relative(dist, file);
      if ((relative.endsWith(".js") || relative.endsWith(".d.ts")) && !expectedFiles.has(relative)) {
        stale.push(relative);
      }
    }
  }
  if (stale.length) {
    console.error(`React dist is stale. Run: npm run build:react. Stale files: ${stale.slice(0, 20).join(", ")}`);
    process.exit(1);
  }
}

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? listFiles(file) : [file];
  });
}

const compiledTypescriptDir = compileTypescriptSources();
if (checkMode) checkSourceRuntimeFromTypescript(compiledTypescriptDir);
else writeSourceRuntimeFromTypescript(compiledTypescriptDir);
const entries = buildEntries(src, src, compiledTypescriptDir);
if (checkMode) checkEntries(entries);
else writeEntries(entries);
if (compiledTypescriptDir) fs.rmSync(compiledTypescriptDir, { recursive: true, force: true });

console.log(JSON.stringify({ status: "pass", package: "@design-system/react", outDir: "dist", files: entries.length }));
