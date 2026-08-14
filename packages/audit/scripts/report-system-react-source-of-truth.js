#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-source-of-truth.json");
const markdownOutput = path.join(outputDir, "system-react-source-of-truth.md");
const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const tokenOutputManifestFile = path.join(root, "packages/tokens/dist/token-output-manifest.json");
const sourceRuntimeGeneratedHeader = "/* @generated from packages/react/src TypeScript source.";

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function relative(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function withoutExtension(file) {
  return file
    .replace(/\.d\.ts$/, "")
    .replace(/\.(?:ts|tsx|js)$/, "");
}

function readPackageJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function readGeneratedOutputFiles() {
  if (!fs.existsSync(tokenOutputManifestFile)) return new Set();
  const manifest = JSON.parse(fs.readFileSync(tokenOutputManifestFile, "utf8"));
  return new Set((manifest.outputs ?? []).map((output) => output.file));
}

function collectExportTargets(exportsValue) {
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
    if (typeof value === "object") Object.values(value).forEach(visit);
  }
  visit(exportsValue);
  return targets.filter((target) => target.startsWith("./"));
}

function buildReport() {
  const srcFiles = walk(reactSrcDir);
  const distFiles = walk(reactDistDir);
  const generatedOutputFiles = readGeneratedOutputFiles();
  const tsSources = srcFiles.filter((file) => /\.(?:ts|tsx)$/.test(file) && !file.endsWith(".d.ts"));
  const srcRuntimeFiles = srcFiles.filter((file) => file.endsWith(".js"));
  const srcDeclarationFiles = srcFiles.filter((file) => file.endsWith(".d.ts"));
  const distRuntimeFiles = distFiles.filter((file) => file.endsWith(".js"));
  const distDeclarationFiles = distFiles.filter((file) => file.endsWith(".d.ts"));
  const tsSourceBases = new Set(tsSources.map(withoutExtension));
  const srcRuntimeWithTsSource = srcRuntimeFiles.filter((file) => tsSourceBases.has(withoutExtension(file)));
  const srcRuntimeMirrorMissingGeneratedHeader = srcRuntimeWithTsSource
    .filter((file) => !fs.readFileSync(file, "utf8").startsWith(sourceRuntimeGeneratedHeader));
  const srcRuntimeWithoutTsSourceAll = srcRuntimeFiles.filter((file) => !tsSourceBases.has(withoutExtension(file)));
  const srcRuntimeWithoutTsSource = srcRuntimeWithoutTsSourceAll.filter((file) => !generatedOutputFiles.has(relative(file)));
  const generatedSrcRuntimeWithoutTsSource = srcRuntimeWithoutTsSourceAll.filter((file) => generatedOutputFiles.has(relative(file)));
  const srcDeclarationsWithTsSource = srcDeclarationFiles.filter((file) => tsSourceBases.has(withoutExtension(file)));
  const srcDeclarationsWithoutTsSource = srcDeclarationFiles.filter((file) => !tsSourceBases.has(withoutExtension(file)));

  const rootPackage = readPackageJson("package.json");
  const reactPackage = readPackageJson("packages/react/package.json");
  const rootReactExports = collectExportTargets(rootPackage.exports)
    .filter((target) => target.startsWith("./packages/react/"));
  const packageReactExports = collectExportTargets(reactPackage.exports)
    .map((target) => `./packages/react/${target.slice(2)}`);
  const publicReactTargets = [...new Set([...rootReactExports, ...packageReactExports])];
  const publicRuntimeTargets = publicReactTargets.filter((target) => target.endsWith(".js"));
  const publicRuntimeTargetsOutsideDist = publicRuntimeTargets.filter((target) => !target.startsWith("./packages/react/dist/"));
  const publicDeclarationTargets = publicReactTargets.filter((target) => target.endsWith(".d.ts"));
  const publicDeclarationTargetsOutsideDist = publicDeclarationTargets.filter((target) => !target.startsWith("./packages/react/dist/"));

  const srcRuntimeMirrorCount = srcRuntimeWithTsSource.length;
  const sourceTruthDebt = srcRuntimeWithoutTsSource.length
    + srcDeclarationsWithoutTsSource.length
    + publicRuntimeTargetsOutsideDist.length
    + publicDeclarationTargetsOutsideDist.length
    + srcRuntimeMirrorMissingGeneratedHeader.length;

  return {
    schemaVersion: "flow-system-react-source-of-truth@1",
    generatedAt: "2026-08-14",
    status: sourceTruthDebt === 0 ? "pass" : "fail",
    decision: {
      sourceOfTruth: "packages/react/src/**/*.ts and packages/react/src/**/*.tsx",
      temporaryRuntimeMirror: "packages/react/src/**/*.js exists only as generated compatibility runtime for current tests/audits",
      publicationRuntime: "packages/react/dist/**/*.js",
      publicationTypes: "packages/react/dist/**/*.d.ts",
      nextRequiredDecision: "remove or quarantine src runtime mirrors after tests/audits stop importing ../src/*.js"
    },
    counts: {
      tsSources: tsSources.length,
      srcRuntimeFiles: srcRuntimeFiles.length,
      srcDeclarationFiles: srcDeclarationFiles.length,
      distRuntimeFiles: distRuntimeFiles.length,
      distDeclarationFiles: distDeclarationFiles.length,
      publicRuntimeTargets: publicRuntimeTargets.length,
      publicDeclarationTargets: publicDeclarationTargets.length,
      generatedSrcRuntimeWithoutTsSource: generatedSrcRuntimeWithoutTsSource.length,
      srcRuntimeMirrorMissingGeneratedHeader: srcRuntimeMirrorMissingGeneratedHeader.length
    },
    sourceTruthDebt,
    srcRuntimeMirrorCount,
    metrics: {
      sourceTruthDebt,
      srcRuntimeMirrorCount,
      publicRuntimeTargetsOutsideDistDebt: publicRuntimeTargetsOutsideDist.length,
      publicDeclarationTargetsOutsideDistDebt: publicDeclarationTargetsOutsideDist.length,
      srcRuntimeWithoutTsSourceDebt: srcRuntimeWithoutTsSource.length,
      srcDeclarationsWithoutTsSourceDebt: srcDeclarationsWithoutTsSource.length,
      srcRuntimeMirrorMissingGeneratedHeaderDebt: srcRuntimeMirrorMissingGeneratedHeader.length
    },
    srcRuntimeWithoutTsSource: srcRuntimeWithoutTsSource.map(relative),
    generatedSrcRuntimeWithoutTsSource: generatedSrcRuntimeWithoutTsSource.map(relative),
    srcDeclarationsWithoutTsSource: srcDeclarationsWithoutTsSource.map(relative),
    srcRuntimeMirrorMissingGeneratedHeader: srcRuntimeMirrorMissingGeneratedHeader.map(relative),
    publicRuntimeTargetsOutsideDist,
    publicDeclarationTargetsOutsideDist,
    temporaryRuntimeMirrorSamples: srcRuntimeWithTsSource.slice(0, 40).map(relative),
    notes: [
      "This report does not claim src JS is authored source.",
      "Generated token outputs under packages/react/src are governed by the token output manifest, not by React source authorship.",
      "The current compatibility mirror is allowed only when every mirrored src JS file carries the generated compatibility header.",
      "Iteration 8 must reduce or quarantine the mirror by moving internal tests/audits to dist/package imports or by making the compatibility mirror explicit outside source."
    ]
  };
}

function renderMarkdown(report) {
  return [
    "# System React source of truth",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Decision",
    "",
    `- Source of truth: \`${report.decision.sourceOfTruth}\``,
    `- Temporary runtime mirror: \`${report.decision.temporaryRuntimeMirror}\``,
    `- Publication runtime: \`${report.decision.publicationRuntime}\``,
    `- Publication types: \`${report.decision.publicationTypes}\``,
    `- Next required decision: ${report.decision.nextRequiredDecision}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- TS/TSX source files: ${report.counts.tsSources}`,
    `- Runtime JS files in src: ${report.counts.srcRuntimeFiles}`,
    `- Declaration files in src: ${report.counts.srcDeclarationFiles}`,
    `- Runtime JS files in dist: ${report.counts.distRuntimeFiles}`,
    `- Declaration files in dist: ${report.counts.distDeclarationFiles}`,
    `- Generated src runtime without TS source: ${report.counts.generatedSrcRuntimeWithoutTsSource}`,
    `- src runtime mirrors missing generated header: ${report.counts.srcRuntimeMirrorMissingGeneratedHeader}`,
    `- Source truth debt: ${report.sourceTruthDebt}`,
    `- Temporary src runtime mirror count: ${report.srcRuntimeMirrorCount}`,
    "",
    "## Blocking Debt",
    "",
    `- Public runtime targets outside dist: ${report.metrics.publicRuntimeTargetsOutsideDistDebt}`,
    `- Public declaration targets outside dist: ${report.metrics.publicDeclarationTargetsOutsideDistDebt}`,
    `- src JS without TS/TSX source: ${report.metrics.srcRuntimeWithoutTsSourceDebt}`,
    `- src declarations without TS/TSX source: ${report.metrics.srcDeclarationsWithoutTsSourceDebt}`,
    `- src runtime mirrors missing generated header: ${report.metrics.srcRuntimeMirrorMissingGeneratedHeaderDebt}`,
    "",
    "## Temporary Runtime Mirror Samples",
    "",
    "| File |",
    "| --- |",
    ...(report.temporaryRuntimeMirrorSamples.length
      ? report.temporaryRuntimeMirrorSamples.map((file) => `| ${file} |`)
      : ["| None |"]),
    "",
    "## Notes",
    "",
    ...report.notes.map((note) => `- ${note}`),
    "",
  ].join("\n");
}

function outputsMatch(report) {
  const expectedJson = `${JSON.stringify(report, null, 2)}\n`;
  const expectedMarkdown = renderMarkdown(report);
  const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
  const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
  return currentJson === expectedJson && currentMarkdown === expectedMarkdown;
}

const report = buildReport();
if (checkMode) {
  if (!outputsMatch(report)) {
    console.error("React source-of-truth report is stale. Run: npm run audit:react-source-of-truth");
    process.exit(1);
  }
} else {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
}

console.log(JSON.stringify({
  status: report.status,
  sourceTruthDebt: report.sourceTruthDebt,
  srcRuntimeMirrorCount: report.srcRuntimeMirrorCount,
  outputs: [
    path.relative(root, jsonOutput),
    path.relative(root, markdownOutput)
  ]
}, null, 2));
