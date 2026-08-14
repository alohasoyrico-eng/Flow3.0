#!/usr/bin/env node

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-publication-boundary.json");
const markdownOutput = path.join(outputDir, "system-react-publication-boundary.md");
const checkMode = process.argv.includes("--check");

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(absolute) : [absolute];
  });
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function collectExportTargets(value) {
  const targets = [];
  function visit(entry) {
    if (!entry) return;
    if (typeof entry === "string") {
      targets.push(entry);
      return;
    }
    if (Array.isArray(entry)) {
      entry.forEach(visit);
      return;
    }
    if (typeof entry === "object") Object.values(entry).forEach(visit);
  }
  visit(value);
  return [...new Set(targets)];
}

function runPackDryRun() {
  const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), "flow-react-publication-boundary-cache-"));
  try {
    const result = spawnSync("npm", ["pack", "--json", "--ignore-scripts", "--dry-run"], {
      cwd: root,
      env: { ...process.env, npm_config_cache: cacheDir },
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    });
    if (result.status !== 0) {
      throw new Error(`npm pack --dry-run failed:\n${result.stdout}\n${result.stderr}`);
    }
    return JSON.parse(result.stdout)[0];
  } finally {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  }
}

function findImportLeaksInDist() {
  const distFiles = walk(path.join(root, "packages/react/dist")).filter((file) => /\.(?:js|mjs|cjs|d\.ts)$/.test(file));
  return distFiles.flatMap((file) => {
    const text = fs.readFileSync(file, "utf8");
    const leaks = [];
    const patterns = [
      { id: "react-src-path", pattern: /packages\/react\/src|(?:^|["'])\.\.?\/(?:\.\.\/)*src\//g },
      { id: "react-src-private-alias", pattern: /#design-system\/react|#flow\/react/g },
    ];
    for (const definition of patterns) {
      for (const match of text.matchAll(definition.pattern)) {
        leaks.push({
          file: relative(file),
          type: definition.id,
          match: match[0].replace(/^["']/, ""),
        });
      }
    }
    return leaks;
  });
}

function buildReport() {
  const packageJson = readJson("package.json");
  const reactPackageJson = readJson("packages/react/package.json");
  const pack = runPackDryRun();
  const packedFiles = (pack.files ?? []).map((file) => file.path).sort();
  const packageFiles = packageJson.files ?? [];
  const rootExportEntries = Object.entries(packageJson.exports ?? {});
  const rootReactExportTargets = rootExportEntries
    .filter(([key]) => key === "./react" || key.startsWith("./react/"))
    .flatMap(([, value]) => collectExportTargets(value));
  const reactPackageExportTargets = Object.values(reactPackageJson.exports ?? {}).flatMap(collectExportTargets);
  const rootImports = packageJson.imports ?? {};
  const reactPrivateImportTargets = Object.entries(rootImports)
    .filter(([key]) => key.includes("react"))
    .map(([key, target]) => ({ key, target }));

  const packageFilesIncludeReactSrc = packageFiles.filter((entry) => entry === "packages/react/src" || entry.startsWith("packages/react/src/"));
  const publishedReactSrcFiles = packedFiles.filter((file) => file === "packages/react/src" || file.startsWith("packages/react/src/"));
  const rootReactExportTargetsToSrc = rootReactExportTargets.filter((target) => target.includes("packages/react/src"));
  const reactPackageExportTargetsToSrc = reactPackageExportTargets.filter((target) => target.includes("./src/") || target.startsWith("./src"));
  const reactPrivateImportTargetsToSrc = reactPrivateImportTargets.filter((entry) => String(entry.target).includes("packages/react/src"));
  const distImportLeaks = findImportLeaksInDist();
  const publicationBoundaryDebt = packageFilesIncludeReactSrc.length
    + publishedReactSrcFiles.length
    + rootReactExportTargetsToSrc.length
    + reactPackageExportTargetsToSrc.length
    + distImportLeaks.length;

  return {
    schemaVersion: "flow-system-react-publication-boundary@1",
    generatedAt: "2026-08-14",
    status: publicationBoundaryDebt ? "fail" : "pass",
    inventory: {
      packedFiles: packedFiles.length,
      packageFileEntries: packageFiles.length,
      rootReactExportTargets: rootReactExportTargets.length,
      reactPackageExportTargets: reactPackageExportTargets.length,
      reactPrivateImportTargets: reactPrivateImportTargets.length,
      packageFilesIncludeReactSrc: packageFilesIncludeReactSrc.length,
      publishedReactSrcFiles: publishedReactSrcFiles.length,
      rootReactExportTargetsToSrc: rootReactExportTargetsToSrc.length,
      reactPackageExportTargetsToSrc: reactPackageExportTargetsToSrc.length,
      reactPrivateImportTargetsToSrc: reactPrivateImportTargetsToSrc.length,
      distImportLeaks: distImportLeaks.length,
      publicationBoundaryDebt,
    },
    issues: {
      packageFilesIncludeReactSrc,
      publishedReactSrcFiles,
      rootReactExportTargetsToSrc,
      reactPackageExportTargetsToSrc,
      reactPrivateImportTargetsToSrc,
      distImportLeaks,
    },
    policy: {
      publishedFiles: "The installable package must not include packages/react/src files.",
      publicExports: "Root ./react exports and @design-system/react package exports must target dist runtime and declaration files.",
      privateImports: "Root private react import aliases may target source for repository tooling, but published dist runtime must not import those aliases.",
      distRuntime: "Published dist runtime/declarations must not import packages/react/src or private aliases that resolve to the src mirror.",
    },
  };
}

function renderMarkdown(report) {
  const issueRows = Object.entries(report.issues)
    .filter(([, rows]) => rows.length)
    .map(([key, rows]) => `- ${key}: ${rows.length}`)
    .join("\n");
  return [
    "# System React publication boundary",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Packed files: ${report.inventory.packedFiles}`,
    `- Package file entries: ${report.inventory.packageFileEntries}`,
    `- Root React export targets: ${report.inventory.rootReactExportTargets}`,
    `- React package export targets: ${report.inventory.reactPackageExportTargets}`,
    `- React private import targets: ${report.inventory.reactPrivateImportTargets}`,
    `- Package file entries including React src: ${report.inventory.packageFilesIncludeReactSrc}`,
    `- Published React src files: ${report.inventory.publishedReactSrcFiles}`,
    `- Root React export targets to src: ${report.inventory.rootReactExportTargetsToSrc}`,
    `- React package export targets to src: ${report.inventory.reactPackageExportTargetsToSrc}`,
    `- Internal React private import targets to source: ${report.inventory.reactPrivateImportTargetsToSrc}`,
    `- Dist import leaks: ${report.inventory.distImportLeaks}`,
    `- Publication boundary debt: ${report.inventory.publicationBoundaryDebt}`,
    "",
    "## Issues",
    "",
    issueRows || "- None.",
    "",
    "## Policy",
    "",
    `- Published files: ${report.policy.publishedFiles}`,
    `- Public exports: ${report.policy.publicExports}`,
    `- Private imports: ${report.policy.privateImports}`,
    `- Dist runtime: ${report.policy.distRuntime}`,
    "",
  ].join("\n");
}

function main() {
  const report = buildReport();
  if (checkMode) {
    if (!fs.existsSync(jsonOutput)) {
      console.error("React publication boundary report is missing. Run: node packages/audit/scripts/report-system-react-publication-boundary.js");
      process.exit(1);
    }
    const existing = fs.readFileSync(jsonOutput, "utf8");
    const expected = `${JSON.stringify(report, null, 2)}\n`;
    if (existing !== expected) {
      console.error("React publication boundary report is stale. Run: node packages/audit/scripts/report-system-react-publication-boundary.js");
      process.exit(1);
    }
    if (report.inventory.publicationBoundaryDebt) {
      console.error(`React publication boundary debt detected: ${report.inventory.publicationBoundaryDebt}`);
      process.exit(1);
    }
    console.log(JSON.stringify({
      status: report.status,
      publicationBoundaryDebt: report.inventory.publicationBoundaryDebt,
      publishedReactSrcFiles: report.inventory.publishedReactSrcFiles,
      rootReactExportTargetsToSrc: report.inventory.rootReactExportTargetsToSrc,
      distImportLeaks: report.inventory.distImportLeaks,
    }, null, 2));
    return;
  }
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    publicationBoundaryDebt: report.inventory.publicationBoundaryDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput),
    ],
  }, null, 2));
  if (report.inventory.publicationBoundaryDebt) process.exit(1);
}

main();
