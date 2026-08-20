#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "ds-fast-gate.json");
const markdownOutput = path.join(outputDir, "ds-fast-gate.md");

const checks = [
  {
    id: "ds-qa-topology",
    command: "node",
    args: ["packages/audit/scripts/report-ds-qa-topology.js"],
    owns: "QA lane integrity",
  },
  {
    id: "flow-core-contracts",
    command: "npm",
    args: ["run", "audit:flow-core-gate"],
    owns: "package/spec/token/component/pattern/react contracts",
  },
  {
    id: "control-frame-runtime",
    command: "npm",
    args: ["run", "audit:control-frame-runtime"],
    owns: "rendered field/action/navigation frame density geometry",
  },
  {
    id: "choice-frame-runtime",
    command: "npm",
    args: ["run", "audit:choice-frame-runtime"],
    owns: "rendered choice mark/icon density and light/dark geometry",
  },
  {
    id: "icon-button-runtime",
    command: "npm",
    args: ["run", "audit:icon-button-runtime"],
    owns: "rendered icon action target/icon density geometry",
  },
  {
    id: "option-listbox-runtime",
    command: "npm",
    args: ["run", "audit:option-listbox-runtime"],
    owns: "rendered select/combobox/menu option row geometry and states",
  },
  {
    id: "local-qa-harness-boundary",
    command: "npm",
    args: ["run", "audit:local-qa-harness-boundary"],
    owns: "local component QA demos cannot override Flow component internals",
  },
  {
    id: "react-production-readiness",
    command: "node",
    args: ["packages/audit/scripts/report-react-production-readiness.js"],
    owns: "React public surface readiness evidence",
  },
  {
    id: "react-interaction-coverage",
    command: "node",
    args: ["packages/audit/scripts/report-react-interaction-coverage.js"],
    owns: "callback, keyboard, and state semantics evidence",
  },
  {
    id: "state-variant-public-vocabulary",
    command: "node",
    args: ["packages/audit/scripts/report-state-variant-public-vocabulary.js"],
    owns: "canonical public state/variant/tone/intent vocabulary inventory",
  },
];

function runCheck(check) {
  const child = spawnSync(check.command, check.args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const stdout = String(child.stdout ?? "");
  const stderr = String(child.stderr ?? "");
  const status = child.status === 0 ? "pass" : "fail";
  return {
    ...check,
    commandLine: [check.command, ...check.args].join(" "),
    status,
    exitCode: child.status,
    ...(status === "pass" ? {} : {
      stdoutTail: stdout.split("\n").filter(Boolean).slice(-10),
      stderrTail: stderr.split("\n").filter(Boolean).slice(-10),
    }),
  };
}

function renderMarkdown(report) {
  const rows = report.checks.map((check) => `| ${check.id} | ${check.status} | ${check.commandLine} | ${check.owns} |`);
  return `# DS Fast Gate

Status: **${report.status}**

Decision: **${report.decision}**

This gate is for frequent local/PR feedback. It intentionally excludes consumer install, clean-app smoke, FlowDocs, visual parity, and quarantine tests. It includes the bounded runtime checks that protect shared component geometry.

## Checks

| Check | Status | Command | Owns |
| --- | --- | --- | --- |
${rows.join("\n")}

## Failures

${report.failures.length ? report.failures.map((failure) => `- ${failure.id}: ${failure.commandLine}`).join("\n") : "- None"}
`;
}

function main() {
  const results = checks.map(runCheck);
  const failures = results.filter((check) => check.status !== "pass");
  const report = {
    schemaVersion: "ds-fast-gate@1",
    status: failures.length ? "fail" : "pass",
    decision: failures.length
      ? "Fast DS feedback is blocked by core contract/readiness failures."
      : "Fast DS feedback is green; run validate:flow-core before release.",
    checks: results,
    failures: failures.map(({ id, commandLine, exitCode, stdoutTail, stderrTail }) => ({
      id,
      commandLine,
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
