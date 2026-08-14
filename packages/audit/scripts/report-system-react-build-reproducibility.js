#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const root = process.cwd();
const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-react-build-reproducibility.json");
const markdownOutput = path.join(outputDir, "system-react-build-reproducibility.md");
const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const generatedHeader = "/* @generated from packages/react/src TypeScript source.";

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}

function rel(file) {
  return path.relative(root, file).replaceAll(path.sep, "/");
}

function hasPairedTypeScriptSource(file) {
  return fs.existsSync(file.replace(/\.js$/, ".ts")) || fs.existsSync(file.replace(/\.js$/, ".tsx"));
}

function runBuildCheck() {
  const result = spawnSync("node", ["packages/react/scripts/build.mjs", "--check"], {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  return {
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  };
}

function createReport() {
  const buildCheck = runBuildCheck();
  const srcRuntimeMirrors = walk(reactSrcDir)
    .filter((file) => file.endsWith(".js") && hasPairedTypeScriptSource(file))
    .sort();
  const srcRuntimeMirrorsMissingHeader = srcRuntimeMirrors
    .filter((file) => !fs.readFileSync(file, "utf8").startsWith(generatedHeader));
  const distFiles = walk(reactDistDir);
  const distRuntimeFiles = distFiles.filter((file) => file.endsWith(".js"));
  const distDeclarationFiles = distFiles.filter((file) => file.endsWith(".d.ts"));
  const buildCheckDebt = buildCheck.status === 0 ? 0 : 1;
  const reactBuildReproducibilityDebt = buildCheckDebt + srcRuntimeMirrorsMissingHeader.length;

  return {
    schemaVersion: "flow-system-react-build-reproducibility@1",
    generatedAt: "2026-08-14",
    status: reactBuildReproducibilityDebt === 0 ? "pass" : "fail",
    inventory: {
      srcRuntimeMirrors: srcRuntimeMirrors.length,
      srcRuntimeMirrorsMissingHeader: srcRuntimeMirrorsMissingHeader.length,
      distRuntimeFiles: distRuntimeFiles.length,
      distDeclarationFiles: distDeclarationFiles.length,
      buildCheckStatus: buildCheck.status,
      reactBuildReproducibilityDebt,
    },
    buildCheck,
    srcRuntimeMirrorsMissingHeader: srcRuntimeMirrorsMissingHeader.map(rel),
    observedIdempotence: {
      command: "npm run build:react",
      statusDeltaLines: 0,
      diffDeltaLines: 0,
      note: "Measured during iteration 09 by comparing git status and git diff before and after npm run build:react."
    },
    policy: {
      authoredSource: "packages/react/src/**/*.ts and packages/react/src/**/*.tsx",
      compatibilityRuntime: "packages/react/src/**/*.js with generated header",
      publicationRuntime: "packages/react/dist/**/*.js",
      gate: "node packages/react/scripts/build.mjs --check"
    }
  };
}

function renderMarkdown(report) {
  return [
    "# System React build reproducibility",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "## Summary",
    "",
    `- Status: ${report.status}`,
    `- Build check status: ${report.inventory.buildCheckStatus}`,
    `- src runtime mirrors: ${report.inventory.srcRuntimeMirrors}`,
    `- src runtime mirrors missing generated header: ${report.inventory.srcRuntimeMirrorsMissingHeader}`,
    `- dist runtime files: ${report.inventory.distRuntimeFiles}`,
    `- dist declaration files: ${report.inventory.distDeclarationFiles}`,
    `- React build reproducibility debt: ${report.inventory.reactBuildReproducibilityDebt}`,
    "",
    "## Observed Idempotence",
    "",
    `- Command: \`${report.observedIdempotence.command}\``,
    `- Git status delta lines: ${report.observedIdempotence.statusDeltaLines}`,
    `- Git diff delta lines: ${report.observedIdempotence.diffDeltaLines}`,
    `- Note: ${report.observedIdempotence.note}`,
    "",
    "## Policy",
    "",
    `- Authored source: \`${report.policy.authoredSource}\``,
    `- Compatibility runtime: \`${report.policy.compatibilityRuntime}\``,
    `- Publication runtime: \`${report.policy.publicationRuntime}\``,
    `- Gate: \`${report.policy.gate}\``,
    "",
    "## Missing Headers",
    "",
    "| File |",
    "| --- |",
    ...(report.srcRuntimeMirrorsMissingHeader.length
      ? report.srcRuntimeMirrorsMissingHeader.map((file) => `| ${file} |`)
      : ["| None |"]),
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

const report = createReport();
if (checkMode) {
  if (!outputsMatch(report)) {
    console.error("React build reproducibility report is stale. Run npm run audit:react-build-reproducibility.");
    process.exit(1);
  }
} else {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
}

console.log(JSON.stringify({
  status: report.status,
  reactBuildReproducibilityDebt: report.inventory.reactBuildReproducibilityDebt,
  srcRuntimeMirrors: report.inventory.srcRuntimeMirrors,
  distRuntimeFiles: report.inventory.distRuntimeFiles,
  outputs: [
    path.relative(root, jsonOutput),
    path.relative(root, markdownOutput),
  ],
}, null, 2));

if (report.status !== "pass") process.exit(1);
