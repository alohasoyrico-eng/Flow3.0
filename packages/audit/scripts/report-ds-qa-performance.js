#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "ds-qa-performance.json");
const markdownOutput = path.join(outputDir, "ds-qa-performance.md");

const checks = [
  {
    id: "test-react-fast",
    command: "npm",
    args: ["run", "test:react:fast"],
    budgetMs: 8000,
    lane: "fast",
  },
  {
    id: "audit-ds-fast-gate",
    command: "npm",
    args: ["run", "audit:ds-fast-gate"],
    budgetMs: 5000,
    lane: "fast",
  },
  {
    id: "validate-flow-core-fast",
    command: "npm",
    args: ["run", "validate:flow-core:fast"],
    budgetMs: 15000,
    lane: "fast",
  },
  {
    id: "test-react-release",
    command: "npm",
    args: ["run", "test:react:release"],
    budgetMs: 35000,
    lane: "release",
  },
  {
    id: "audit-ds-release-gate",
    command: "npm",
    args: ["run", "audit:ds-release-gate"],
    budgetMs: 25000,
    lane: "release",
  },
];

function runCheck(check) {
  const startedAt = Date.now();
  const child = spawnSync(check.command, check.args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const durationMs = Date.now() - startedAt;
  return {
    ...check,
    commandLine: [check.command, ...check.args].join(" "),
    durationMs,
    status: child.status === 0 && durationMs <= check.budgetMs ? "pass" : "fail",
    exitCode: child.status,
    overBudgetMs: Math.max(0, durationMs - check.budgetMs),
    stdoutTail: String(child.stdout ?? "").split("\n").filter(Boolean).slice(-10),
    stderrTail: String(child.stderr ?? "").split("\n").filter(Boolean).slice(-10),
  };
}

function renderMarkdown(report) {
  const rows = report.checks.map((check) => (
    `| ${check.id} | ${check.lane} | ${check.status} | ${check.durationMs} | ${check.budgetMs} | ${check.overBudgetMs} | ${check.commandLine} |`
  ));
  return `# DS QA Performance

Status: **${report.status}**

Decision: **${report.decision}**

This report measures QA execution budgets. It is intentionally separate from \`validate:flow-core\` so release does not rerun itself just to measure itself.

## Budgets

| Check | Lane | Status | Duration ms | Budget ms | Over budget ms | Command |
| --- | --- | --- | ---: | ---: | ---: | --- |
${rows.join("\n")}

## Failures

${report.failures.length ? report.failures.map((failure) => `- ${failure.id}: ${failure.durationMs}ms / ${failure.budgetMs}ms`).join("\n") : "- None"}
`;
}

function main() {
  const results = checks.map(runCheck);
  const failures = results.filter((check) => check.status !== "pass");
  const report = {
    schemaVersion: "ds-qa-performance@1",
    generatedAt: new Date().toISOString(),
    status: failures.length ? "fail" : "pass",
    decision: failures.length
      ? "QA budget exceeded; split or move work out of the affected lane before adding more tests."
      : "QA lanes are within the current execution budgets.",
    checks: results,
    failures: failures.map(({ id, lane, commandLine, durationMs, budgetMs, overBudgetMs, exitCode, stdoutTail, stderrTail }) => ({
      id,
      lane,
      commandLine,
      durationMs,
      budgetMs,
      overBudgetMs,
      exitCode,
      stdoutTail,
      stderrTail,
    })),
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    checks: report.checks.length,
    pass: report.checks.filter((check) => check.status === "pass").length,
    fail: report.failures.length,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

main();
