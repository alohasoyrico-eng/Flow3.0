#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "ds-qa-topology.json");
const markdownOutput = path.join(outputDir, "ds-qa-topology.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
}

function addIssue(issues, severity, file, message) {
  issues.push({ severity, file, message });
}

function commandIncludes(command, fragment) {
  return String(command ?? "").includes(fragment);
}

function renderMarkdown(report) {
  const issueRows = report.issues.map((issue) => `| ${issue.severity} | ${issue.file} | ${issue.message} |`);
  const levelRows = report.levels.map((level) => `| ${level.level} | ${level.rootCommand} | ${level.packageCommand} | ${level.intent} |`);
  return `# DS QA Topology

Status: **${report.status}**

Decision: **${report.decision}**

## Levels

| Level | Root command | Package command | Intent |
| --- | --- | --- | --- |
${levelRows.join("\n")}

## Rules

${report.rules.map((rule) => `- ${rule}`).join("\n")}

## Issues

${issueRows.length ? `| Severity | File | Message |\n| --- | --- | --- |\n${issueRows.join("\n")}` : "- None"}
`;
}

function createReport() {
  const rootPackage = readJson("package.json");
  const reactPackage = readJson("packages/react/package.json");
  const rootScripts = rootPackage.scripts ?? {};
  const reactScripts = reactPackage.scripts ?? {};
  const issues = [];

  const expectedRootScripts = {
    "test:react": "npm run test:react:release",
    "test:react:fast": "npm run test:fast --workspace @design-system/react",
    "test:react:release": "npm run test:release --workspace @design-system/react",
    "test:react:deep": "npm run test:deep --workspace @design-system/react",
    "test:react:quarantine": "npm run test:quarantine --workspace @design-system/react",
    "audit:ds-fast-gate": "node packages/audit/scripts/audit-ds-fast-gate.js",
    "audit:ds-qa-performance": "node packages/audit/scripts/report-ds-qa-performance.js",
    "audit:ds-qa-topology": "node packages/audit/scripts/report-ds-qa-topology.js",
  };
  const expectedReactScripts = {
    test: "npm run test:release",
    "test:quarantine": "node test/interaction.test.mjs",
  };

  for (const [script, expected] of Object.entries(expectedRootScripts)) {
    if (rootScripts[script] !== expected) {
      addIssue(issues, "error", "package.json", `${script} must be "${expected}".`);
    }
  }
  for (const [script, expected] of Object.entries(expectedReactScripts)) {
    if (reactScripts[script] !== expected) {
      addIssue(issues, "error", "packages/react/package.json", `${script} must be "${expected}".`);
    }
  }
  for (const script of ["test:fast", "test:release", "test:deep"]) {
    if (!reactScripts[script]) {
      addIssue(issues, "error", "packages/react/package.json", `${script} is required.`);
    }
  }
  if (!commandIncludes(rootScripts["validate:flow-core"], "npm run test:react:release")) {
    addIssue(issues, "error", "package.json", "validate:flow-core must run test:react:release, not the historical monolith.");
  }
  if (!commandIncludes(rootScripts["validate:flow-core"], "npm run audit:ds-release-gate")) {
    addIssue(issues, "error", "package.json", "validate:flow-core must run audit:ds-release-gate.");
  }
  if (!commandIncludes(rootScripts["validate:flow-core:fast"], "npm run test:react:fast")) {
    addIssue(issues, "error", "package.json", "validate:flow-core:fast must run test:react:fast.");
  }
  if (!commandIncludes(rootScripts["validate:flow-core:fast"], "npm run audit:ds-fast-gate")) {
    addIssue(issues, "error", "package.json", "validate:flow-core:fast must run audit:ds-fast-gate.");
  }
  if (commandIncludes(rootScripts["validate:flow-core"], "test:react:quarantine")) {
    addIssue(issues, "error", "package.json", "validate:flow-core must not run quarantine tests.");
  }
  if (commandIncludes(rootScripts["validate:flow-core:fast"], "test:react:quarantine")) {
    addIssue(issues, "error", "package.json", "validate:flow-core:fast must not run quarantine tests.");
  }
  if (commandIncludes(reactScripts["test:release"], "test/interaction.test.mjs")) {
    addIssue(issues, "error", "packages/react/package.json", "test:release must not run unstable legacy interaction monolith.");
  }
  if (commandIncludes(reactScripts["test:fast"], "test/interaction.test.mjs")) {
    addIssue(issues, "error", "packages/react/package.json", "test:fast must not run unstable legacy interaction monolith.");
  }
  if (!commandIncludes(reactScripts["test:fast"], "p0-forms-basic.test.mjs") || !commandIncludes(reactScripts["test:fast"], "p0-overlays-navigation.test.mjs")) {
    addIssue(issues, "error", "packages/react/package.json", "test:fast must include P0 forms and overlays/navigation suites.");
  }
  if (!commandIncludes(reactScripts["test:release"], "p2-final-partials.test.mjs")) {
    addIssue(issues, "error", "packages/react/package.json", "test:release must include the full granular suite through P2 final partials.");
  }
  if (reactScripts["test:deep"] !== "npm run test:release") {
    addIssue(issues, "warning", "packages/react/package.json", "test:deep currently should alias test:release until a stable deep-only suite exists.");
  }

  const report = {
    schemaVersion: "ds-qa-topology@1",
    status: issues.some((issue) => issue.severity === "error") ? "fail" : "pass",
    decision: "Flow React QA is split into fast, release, deep, and quarantine lanes; release lanes must stay deterministic and executable.",
    rules: [
      "Fast tests cover critical P0 runtime evidence and must stay cheap enough for frequent local runs.",
      "Release tests cover the full granular React suite and must exclude unstable legacy monoliths.",
      "Deep tests may grow beyond release only when they remain deterministic.",
      "Quarantine tests are explicit debt and cannot be part of validate:flow-core.",
      "validate:flow-core is the DS release gate and must run test:react:release.",
      "Performance measurement is explicit via audit:ds-qa-performance and must not be nested inside release gates.",
    ],
    levels: [
      {
        level: "fast",
        rootCommand: "npm run test:react:fast",
        packageCommand: "npm run test:fast --workspace @design-system/react",
        intent: "frequent P0 feedback; full fast validation is npm run validate:flow-core:fast",
      },
      {
        level: "release",
        rootCommand: "npm run test:react:release",
        packageCommand: "npm run test:release --workspace @design-system/react",
        intent: "deterministic release evidence",
      },
      {
        level: "deep",
        rootCommand: "npm run test:react:deep",
        packageCommand: "npm run test:deep --workspace @design-system/react",
        intent: "stable extended evidence",
      },
      {
        level: "quarantine",
        rootCommand: "npm run test:react:quarantine",
        packageCommand: "npm run test:quarantine --workspace @design-system/react",
        intent: "known unstable legacy evidence",
      },
    ],
    issues,
  };

  return report;
}

function main() {
  const report = createReport();
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    levels: report.levels.length,
    issues: report.issues.length,
    errors: report.issues.filter((issue) => issue.severity === "error").length,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (require.main === module) main();

module.exports = { createReport };
