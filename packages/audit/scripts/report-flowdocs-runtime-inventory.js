#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const docsDir = path.resolve(root, "../FlowDocs/apps/docs");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "flowdocs-runtime-inventory.json");
const markdownOutput = path.join(outputDir, "flowdocs-runtime-inventory.md");

const entryFile = "index.html";
const generatedPrefixes = ["generated/"];
const vendorPrefixes = ["vendor/"];
const assetPrefixes = ["assets/"];
const sourceExtensions = new Set([".js", ".css", ".html", ".json"]);

function walk(dir, base = dir) {
  const files = [];
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(absolute, base));
    else files.push(path.relative(base, absolute).split(path.sep).join("/"));
  }
  return files.sort();
}

function readRelative(file) {
  try {
    return fs.readFileSync(path.join(docsDir, file), "utf8");
  } catch {
    return "";
  }
}

function stripQuery(value) {
  return String(value).split("#")[0].split("?")[0];
}

function normalizeDependency(fromFile, raw) {
  const value = stripQuery(raw).trim();
  if (!value || value.startsWith("http:") || value.startsWith("https:") || value.startsWith("data:")) return null;
  if (!value.startsWith("./") && !value.startsWith("../")) return null;
  const baseDir = path.posix.dirname(fromFile);
  const resolved = path.posix.normalize(path.posix.join(baseDir, value));
  return resolved.startsWith("../") ? null : resolved.replace(/^\.\//, "");
}

function extractDependencies(file, source) {
  const deps = new Set();
  const ext = path.extname(file);
  const add = (raw) => {
    const dep = normalizeDependency(file, raw);
    if (dep) deps.add(dep);
  };

  if (ext === ".html") {
    for (const match of source.matchAll(/\b(?:src|href)=["']([^"']+)["']/g)) add(match[1]);
    for (const match of source.matchAll(/"([^"]*\.js(?:\?[^"]*)?|[^"]*\.css(?:\?[^"]*)?)"\s*:/g)) add(match[1]);
    for (const match of source.matchAll(/:\s*"([^"]+)"/g)) add(match[1]);
  }

  if (ext === ".css") {
    for (const match of source.matchAll(/@import\s+["']([^"']+)["']/g)) add(match[1]);
    for (const match of source.matchAll(/url\((?!["']?(?:data:|http:|https:))["']?([^"')]+)["']?\)/g)) add(match[1]);
  }

  if (ext === ".js" || ext === ".mjs") {
    for (const match of source.matchAll(/\bimport\s+(?:[^"'()]+?\s+from\s+)?["']([^"']+)["']/g)) add(match[1]);
    for (const match of source.matchAll(/\bexport\s+[^"'()]+?\s+from\s+["']([^"']+)["']/g)) add(match[1]);
    for (const match of source.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) add(match[1]);
    for (const match of source.matchAll(/\b(?:fetch|loadContentBundle)\(\s*["']([^"']+)["']\s*\)/g)) add(match[1]);
  }

  return [...deps].sort();
}

function classify(file, reachable) {
  if (file === entryFile) return "entry";
  const isGenerated = generatedPrefixes.some((prefix) => file.startsWith(prefix));
  const isVendor = vendorPrefixes.some((prefix) => file.startsWith(prefix));
  const isAsset = assetPrefixes.some((prefix) => file.startsWith(prefix));
  const ext = path.extname(file);

  if (file.endsWith(".d.ts") || file.startsWith("types/")) return reachable ? "type-artifact-used" : "type-artifact";
  if (file.startsWith("vendor/country-flag-icons/3x2/")) return "vendor-dynamic-asset";
  if (/^vendor\/[^/]+\/(?:LICENSE|LICENSE\.md|LICENSE\.txt)$/.test(file) || file === "vendor/echarts.LICENSE") return "vendor-license";
  if (file === "README.md" || file.endsWith(".md")) return reachable ? "runtime-used" : "nonruntime-doc";

  if (reachable && isGenerated) return "generated-used";
  if (!reachable && isGenerated) return "generated-unreferenced";
  if (reachable && isVendor) return "vendor-used";
  if (!reachable && isVendor) return "vendor-unreferenced";
  if (reachable && isAsset) return "asset-used";
  if (!reachable && isAsset) return "asset-unreferenced";
  if (reachable) return "runtime-used";
  if (sourceExtensions.has(ext)) return "source-orphan";
  return "asset-unreferenced";
}

function buildGraph(files) {
  const fileSet = new Set(files);
  const graph = {};
  const missing = [];
  for (const file of files) {
    const source = readRelative(file);
    const deps = extractDependencies(file, source);
    graph[file] = deps;
    for (const dep of deps) {
      if (!fileSet.has(dep)) missing.push({ from: file, dependency: dep });
    }
  }
  return { graph, missing };
}

function traverse(graph) {
  const reachable = new Set();
  const queue = [entryFile];
  while (queue.length) {
    const file = queue.shift();
    if (reachable.has(file)) continue;
    reachable.add(file);
    for (const dep of graph[file] ?? []) {
      if (!reachable.has(dep)) queue.push(dep);
    }
  }
  return reachable;
}

const files = walk(docsDir);
const { graph, missing } = buildGraph(files);
const reachable = traverse(graph);
const rows = files.map((file) => ({
  file,
  status: classify(file, reachable.has(file)),
  reachable: reachable.has(file),
  imports: graph[file]?.length ?? 0,
}));

const summary = rows.reduce((acc, row) => {
  acc[row.status] = (acc[row.status] ?? 0) + 1;
  return acc;
}, {});

const report = {
  schemaVersion: "flowdocs-runtime-inventory@1",
  generatedAt: new Date().toISOString(),
  docsDir: path.relative(root, docsDir),
  entryFile,
  totalFiles: files.length,
  reachableFiles: reachable.size,
  unreferencedFiles: files.length - reachable.size,
  summary,
  missingDependencies: missing.sort((a, b) => a.from.localeCompare(b.from) || a.dependency.localeCompare(b.dependency)),
  rows,
  nextActions: [
    "Review source-orphan files before deletion; some may be intentionally loaded by route/content indirection not visible to static import tracing.",
    "Treat generated-unreferenced files as rebuild or clean-output candidates, never canonical source.",
    "Treat vendor-unreferenced files as dependency cleanup candidates after visual/runtime smoke.",
  ],
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, renderMarkdown(report));

console.log(JSON.stringify({
  totalFiles: report.totalFiles,
  reachableFiles: report.reachableFiles,
  unreferencedFiles: report.unreferencedFiles,
  summary: report.summary,
  missingDependencies: report.missingDependencies.length,
  json: path.relative(root, jsonOutput),
  markdown: path.relative(root, markdownOutput),
}, null, 2));

function renderMarkdown(report) {
  const topOrphans = report.rows
    .filter((row) => row.status === "source-orphan")
    .slice(0, 80)
    .map((row) => `- ${row.file}`)
    .join("\n") || "- None";

  const missing = report.missingDependencies
    .slice(0, 80)
    .map((row) => `- ${row.from} -> ${row.dependency}`)
    .join("\n") || "- None";

  return `# FlowDocs Runtime Inventory

Entry: ${report.entryFile}

Total files: ${report.totalFiles}
Reachable files: ${report.reachableFiles}
Unreferenced files: ${report.unreferencedFiles}

## Summary

${Object.entries(report.summary).sort(([a], [b]) => a.localeCompare(b)).map(([status, count]) => `- ${status}: ${count}`).join("\n")}

## Source Orphans

${topOrphans}

## Missing Dependencies

${missing}

## Next Actions

${report.nextActions.map((action) => `- ${action}`).join("\n")}
`;
}
