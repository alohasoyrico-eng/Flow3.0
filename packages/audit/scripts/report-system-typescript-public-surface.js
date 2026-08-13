#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-typescript-public-surface.json");
const markdownOutput = path.join(outputDir, "system-typescript-public-surface.md");

const publicPackageFiles = [
  "package.json",
  "packages/tokens/package.json",
  "packages/components/package.json",
  "packages/react/package.json"
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function walk(dir, extensions) {
  const absolute = path.join(root, dir);
  if (!fs.existsSync(absolute)) return [];
  return fs.readdirSync(absolute, { withFileTypes: true }).flatMap((entry) => {
    const child = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(child, extensions);
    return extensions.some((extension) => entry.name.endsWith(extension)) ? [child] : [];
  });
}

function normalizeExportTargets(exportsValue) {
  const targets = [];
  function visit(value) {
    if (!value) return;
    if (typeof value === "string") {
      targets.push(value);
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(visit);
      return;
    }
    if (typeof value === "object") {
      Object.values(value).forEach(visit);
    }
  }
  visit(exportsValue);
  return [...new Set(targets)]
    .filter((target) => target.startsWith("./"))
    .map((target) => target.slice(2));
}

function sourceForDeclaration(file) {
  return file.replace(/\.d\.ts$/, "");
}

function classifyFile(file) {
  if (file.includes("/dist/")) return "generated-dist";
  if (file.includes("/test/")) return "test";
  if (file.includes("/scripts/")) return "script";
  if (file.includes("/src/")) return "source";
  return "other";
}

function buildPublicExportRows() {
  return publicPackageFiles.flatMap((packageFile) => {
    const packageJson = readJson(path.join(root, packageFile));
    const packageDir = path.dirname(packageFile);
    return normalizeExportTargets(packageJson.exports).map((target) => {
      const relativePath = path.normalize(path.join(packageDir, target));
      const extension = path.extname(relativePath);
      const isTypesOnly = relativePath.endsWith(".d.ts");
      const implementationPath = isTypesOnly ? null : relativePath;
      const sourceCandidate = implementationPath && implementationPath.endsWith(".js")
        ? implementationPath.replace("/dist/", "/src/").replace(/\.js$/, "")
        : null;
      return {
        packageFile,
        target: relativePath,
        extension,
        kind: isTypesOnly ? "types" : extension === ".css" ? "style" : "runtime",
        exists: exists(relativePath),
        jsRuntime: implementationPath ? implementationPath.endsWith(".js") : false,
        tsRuntime: implementationPath ? implementationPath.endsWith(".ts") || implementationPath.endsWith(".tsx") : false,
        tsSourceExists: sourceCandidate ? exists(`${sourceCandidate}.ts`) || exists(`${sourceCandidate}.tsx`) : false
      };
    });
  });
}

function buildSourceInventory() {
  const files = walk("packages", [".js", ".mjs", ".cjs", ".ts", ".tsx", ".d.ts"]);
  const counts = files.reduce((acc, file) => {
    const extension = file.endsWith(".d.ts") ? ".d.ts" : path.extname(file);
    const area = classifyFile(file);
    acc.byExtension[extension] = (acc.byExtension[extension] || 0) + 1;
    acc.byArea[area] = (acc.byArea[area] || 0) + 1;
    return acc;
  }, { byExtension: {}, byArea: {} });
  const sourceDeclarations = files
    .filter((file) => file.endsWith(".d.ts") && file.includes("/src/"))
    .map((file) => ({
      file,
      pairedJs: exists(`${sourceForDeclaration(file)}.js`),
      pairedTs: exists(`${sourceForDeclaration(file)}.ts`) || exists(`${sourceForDeclaration(file)}.tsx`)
    }));
  return {
    files,
    counts,
    sourceDeclarations,
    sourceDeclarationsWithoutTs: sourceDeclarations.filter((entry) => entry.pairedJs && !entry.pairedTs)
  };
}

function renderMarkdown(report) {
  const publicRows = report.publicExports
    .filter((row) => row.kind === "runtime" && row.jsRuntime)
    .slice(0, 80)
    .map((row) => `| ${row.packageFile} | ${row.target} | ${row.tsSourceExists ? "yes" : "no"} |`)
    .join("\n");
  const publicDebtRows = report.publicJsRuntimeExportsWithoutTsSource
    .slice(0, 80)
    .map((row) => `| ${row.packageFile} | ${row.target} |`)
    .join("\n");
  const declarationRows = report.sourceDeclarationsWithoutTs
    .slice(0, 80)
    .map((row) => `| ${row.file} | ${row.pairedJs ? "yes" : "no"} | ${row.pairedTs ? "yes" : "no"} |`)
    .join("\n");
  return [
    "# System TypeScript public surface",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This is a baseline report for P0.2 TypeScript remediation. It does not migrate files.",
    "",
    "## Summary",
    "",
    `- Public export targets: ${report.publicExports.length}`,
    `- Unique public export targets: ${report.uniquePublicExportTargets}`,
    `- Public JS runtime exports: ${report.publicJsRuntimeExports}`,
    `- Unique public JS runtime export targets: ${report.uniquePublicJsRuntimeTargets}`,
    `- Public JS runtime exports with TS/TSX source: ${report.publicJsRuntimeExportsWithTsSource}`,
    `- Public JS runtime exports without TS/TSX source: ${report.publicJsRuntimeExportsWithoutTsSource.length}`,
    `- Source declarations paired with JS but not TS/TSX: ${report.sourceDeclarationsWithoutTs.length}`,
    `- TypeScript surface debt: ${report.typescriptPublicSurfaceDebt}`,
    `- Unique TypeScript surface debt: ${report.uniqueTypescriptPublicSurfaceDebt}`,
    "",
    "## File Counts",
    "",
    `- By extension: ${JSON.stringify(report.sourceInventory.counts.byExtension)}`,
    `- By area: ${JSON.stringify(report.sourceInventory.counts.byArea)}`,
    "",
    "## Public JS Runtime Exports",
    "",
    "| Package | Target | TS/TSX source |",
    "| --- | --- | --- |",
    publicRows || "| None | None | None |",
    "",
    "## Public JS Runtime Exports Without TS Source",
    "",
    "| Package | Target |",
    "| --- | --- |",
    publicDebtRows || "| None | None |",
    "",
    "## Source Declarations Without TS Source",
    "",
    "| Declaration | Paired JS | Paired TS/TSX |",
    "| --- | --- | --- |",
    declarationRows || "| None | None | None |",
    "",
    "## Interpretation",
    "",
    "A public runtime export is not considered TypeScript-real when it points to JS and the maintained source is not TS/TSX. Generated .d.ts files are useful for consumers, but they are not a substitute for typed implementation source.",
    "",
  ].join("\n");
}

function main() {
  const publicExports = buildPublicExportRows();
  const sourceInventory = buildSourceInventory();
  const publicJsRuntimeExports = publicExports.filter((row) => row.kind === "runtime" && row.jsRuntime);
  const publicJsRuntimeExportsWithTsSource = publicJsRuntimeExports.filter((row) => row.tsSourceExists);
  const publicJsRuntimeExportsWithoutTsSource = publicJsRuntimeExports.filter((row) => !row.tsSourceExists);
  const sourceDeclarationsWithoutTs = sourceInventory.sourceDeclarationsWithoutTs;
  const uniquePublicExportTargets = new Set(publicExports.map((row) => row.target));
  const uniquePublicJsRuntimeTargets = new Set(publicJsRuntimeExports.map((row) => row.target));
  const uniquePublicJsRuntimeTargetsWithoutTsSource = new Set(publicJsRuntimeExportsWithoutTsSource.map((row) => row.target));
  const report = {
    schemaVersion: "flow-system-typescript-public-surface@1",
    generatedAt: "2026-08-12",
    status: publicJsRuntimeExportsWithoutTsSource.length || sourceDeclarationsWithoutTs.length ? "baseline_only" : "pass",
    publicExports,
    uniquePublicExportTargets: uniquePublicExportTargets.size,
    publicJsRuntimeExports: publicJsRuntimeExports.length,
    uniquePublicJsRuntimeTargets: uniquePublicJsRuntimeTargets.size,
    publicJsRuntimeExportsWithTsSource: publicJsRuntimeExportsWithTsSource.length,
    publicJsRuntimeExportsWithoutTsSource,
    sourceDeclarationsWithoutTs,
    sourceInventory: {
      counts: sourceInventory.counts
    },
    typescriptPublicSurfaceDebt: publicJsRuntimeExportsWithoutTsSource.length + sourceDeclarationsWithoutTs.length,
    uniqueTypescriptPublicSurfaceDebt: uniquePublicJsRuntimeTargetsWithoutTsSource.size + sourceDeclarationsWithoutTs.length
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    publicExports: report.publicExports.length,
    uniquePublicExportTargets: report.uniquePublicExportTargets,
    publicJsRuntimeExports: report.publicJsRuntimeExports,
    uniquePublicJsRuntimeTargets: report.uniquePublicJsRuntimeTargets,
    sourceDeclarationsWithoutTs: report.sourceDeclarationsWithoutTs.length,
    publicJsRuntimeExportsWithoutTsSource: report.publicJsRuntimeExportsWithoutTsSource.length,
    typescriptPublicSurfaceDebt: report.typescriptPublicSurfaceDebt,
    uniqueTypescriptPublicSurfaceDebt: report.uniqueTypescriptPublicSurfaceDebt,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput)
    ]
  }, null, 2));
}

main();
