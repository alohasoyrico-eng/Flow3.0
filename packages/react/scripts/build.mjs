import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const src = path.join(root, "src");
const dist = path.join(root, "dist");
const checkMode = process.argv.includes("--check");

function rewritePublishedImports(source) {
  return source
    .replaceAll('"@design-system/components/platforms"', '"#flow/platforms"')
    .replaceAll('"@design-system/components"', '"#flow/components"');
}

function buildEntries(fromDir, baseDir = fromDir) {
  const entries = [];
  for (const entry of fs.readdirSync(fromDir, { withFileTypes: true })) {
    const from = path.join(fromDir, entry.name);
    if (entry.isDirectory()) {
      entries.push(...buildEntries(from, baseDir));
      continue;
    }
    if (!entry.name.endsWith(".js") && !entry.name.endsWith(".d.ts")) continue;
    entries.push({
      relative: path.relative(baseDir, from),
      source: rewritePublishedImports(fs.readFileSync(from, "utf8")),
    });
  }
  return entries.sort((a, b) => a.relative.localeCompare(b.relative));
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

const entries = buildEntries(src);
if (checkMode) checkEntries(entries);
else writeEntries(entries);

console.log(JSON.stringify({ status: "pass", package: "@design-system/react", outDir: "dist", files: entries.length }));
