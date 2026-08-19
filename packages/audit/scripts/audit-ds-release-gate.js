#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.resolve(__dirname, "../../..");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "ds-release-gate.json");
const markdownOutput = path.join(outputDir, "ds-release-gate.md");

const checks = [
  {
    id: "ds-qa-topology",
    command: "node",
    args: ["packages/audit/scripts/report-ds-qa-topology.js"],
    owns: "fast/release/deep/quarantine QA lanes and release test boundary",
  },
  {
    id: "flow-core-contracts",
    command: "npm",
    args: ["run", "audit:flow-core-gate"],
    owns: "architecture, package API, CSS namespace/contracts, tokens, specs, React primary contracts, accessibility policy",
  },
  {
    id: "react-production-readiness",
    command: "node",
    args: ["packages/audit/scripts/report-react-production-readiness.js"],
    owns: "public React component inventory, contracts, exports, test evidence, readiness status",
  },
  {
    id: "react-interaction-coverage",
    command: "node",
    args: ["packages/audit/scripts/report-react-interaction-coverage.js"],
    owns: "callbacks, event parameters, required keyboard behavior, required state semantics",
  },
  {
    id: "component-artifact-tests",
    command: "node",
    args: ["packages/audit/scripts/report-system-component-artifact-tests.js"],
    owns: "per-component artifact test coverage",
  },
  {
    id: "component-runtime",
    command: "node",
    args: ["packages/audit/scripts/report-system-component-runtime-audit.js"],
    owns: "component runtime evidence independent from FlowDocs pages",
  },
  {
    id: "public-runtime-boundary",
    command: "node",
    args: ["packages/audit/scripts/report-system-public-runtime-boundary.js"],
    owns: "public runtime artifact boundary",
  },
  {
    id: "consumer-runtime-smoke",
    command: "node",
    args: ["packages/audit/scripts/report-system-consumer-runtime-smoke.js"],
    owns: "clean consumer app React render smoke",
  },
  {
    id: "consumer-css-token-cascade",
    command: "node",
    args: ["packages/audit/scripts/report-system-consumer-css-token-cascade.js"],
    owns: "clean consumer CSS and token cascade",
  },
  {
    id: "consumer-type-smoke",
    command: "node",
    args: ["packages/audit/scripts/report-system-consumer-type-smoke.js"],
    owns: "clean consumer TypeScript/import smoke",
  },
  {
    id: "consumer-install",
    command: "node",
    args: ["packages/audit/scripts/audit-consumer-install.mjs"],
    owns: "installable package boundary in an isolated consumer",
  },
];

const forbiddenFlowDocsTargets = [
  "../FlowDocs",
  "FlowDocs/apps/docs",
  "apps/docs/index.html",
  "audit:flowdocs",
  "validate:docs",
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function runCheck(check) {
  const startedAt = Date.now();
  const child = spawnSync(check.command, check.args, {
    cwd: root,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  const stdout = String(child.stdout ?? "");
  const stderr = String(child.stderr ?? "");
  return {
    ...check,
    commandLine: [check.command, ...check.args].join(" "),
    status: child.status === 0 ? "pass" : "fail",
    exitCode: child.status,
    durationMs: Date.now() - startedAt,
    stdoutTail: stdout.split("\n").filter(Boolean).slice(-12),
    stderrTail: stderr.split("\n").filter(Boolean).slice(-12),
  };
}

function renderMarkdown(report) {
  const rows = report.checks.map((check) => (
    `| ${check.id} | ${check.status} | ${check.commandLine} | ${check.owns} | ${check.durationMs} |`
  ));
  const forbiddenRows = report.flowdocsBoundary.forbiddenTargetFindings.map((item) => (
    `| ${item.check} | ${item.target} |`
  ));

  return `# DS Release Gate

Status: **${report.status}**

Decision: **${report.decision}**

This gate is authoritative for Flow Design System core release readiness. It must not certify FlowDocs layout, visual parity, legacy HTML slots, or documentation shell remediation.

## Checks

| Check | Status | Command | Owns | Duration ms |
| --- | --- | --- | --- | ---: |
${rows.join("\n")}

## FlowDocs Boundary

- FlowDocs consumer checks live in \`npm run audit:flowdocs-consumer-gate\`.
- FlowDocs visual/layout/template debt is not allowed to block this DS release gate unless package imports, generated package APIs, examples, or consumer installation are false.
- Forbidden FlowDocs targets in this gate: ${report.flowdocsBoundary.forbiddenTargets.join(", ")}

${forbiddenRows.length ? `| Check | Forbidden target |\n| --- | --- |\n${forbiddenRows.join("\n")}` : "_No forbidden FlowDocs targets are part of this gate._"}

## Test Boundary

- React package test command excludes unstable legacy monolith: ${report.testBoundary.reactTestExcludesLegacyInteraction ? "yes" : "no"}
- Legacy interaction quarantine command exists: ${report.testBoundary.legacyInteractionQuarantineExists ? "yes" : "no"}
- Legacy command: \`${report.testBoundary.legacyInteractionCommand ?? "missing"}\`

## Failures

${report.failures.length ? report.failures.map((failure) => `- ${failure.id}: ${failure.commandLine}`).join("\n") : "- None"}
`;
}

function main() {
  const reactPackage = readJson(path.join(root, "packages/react/package.json"));
  const reactTestCommand = reactPackage.scripts?.test ?? "";
  const legacyInteractionCommand = reactPackage.scripts?.["test:quarantine"];
  const testBoundary = {
    reactTestExcludesLegacyInteraction: !reactTestCommand.includes("test/interaction.test.mjs"),
    reactReleaseExcludesLegacyInteraction: !String(reactPackage.scripts?.["test:release"] ?? "").includes("test/interaction.test.mjs"),
    legacyInteractionQuarantineExists: legacyInteractionCommand === "node test/interaction.test.mjs",
    legacyInteractionCommand,
  };
  const forbiddenTargetFindings = [];
  for (const check of checks) {
    const haystack = [check.command, ...check.args].join(" ");
    for (const target of forbiddenFlowDocsTargets) {
      if (haystack.includes(target)) {
        forbiddenTargetFindings.push({ check: check.id, target });
      }
    }
  }

  const results = checks.map(runCheck);
  const failures = results.filter((check) => check.status !== "pass");
  const testBoundaryFailures = [];
  if (!testBoundary.reactTestExcludesLegacyInteraction) {
    testBoundaryFailures.push("packages/react test command must not run unstable legacy interaction monolith.");
  }
  if (!testBoundary.reactReleaseExcludesLegacyInteraction) {
    testBoundaryFailures.push("packages/react test:release command must not run unstable legacy interaction monolith.");
  }
  if (!testBoundary.legacyInteractionQuarantineExists) {
    testBoundaryFailures.push("packages/react must expose test:quarantine for explicit quarantine reruns.");
  }
  const status = failures.length || forbiddenTargetFindings.length || testBoundaryFailures.length ? "fail" : "pass";
  const report = {
    schemaVersion: "ds-release-gate@1",
    generatedAt: new Date().toISOString(),
    status,
    decision: status === "pass"
      ? "Flow core is releasable by package/runtime gates; FlowDocs remains separately audited."
      : "Flow core is not releasable until failing DS package/runtime gates are fixed.",
    authority: {
      releaseGate: "npm run validate:flow-core",
      compatibilityAlias: "npm run validate:system",
      nonAuthoritativeForCore: [
        "npm run audit",
        "npm run audit:complete",
        "npm run audit:flowdocs-consumer-gate",
        "npm run audit:forensic-gate",
      ],
    },
    flowdocsBoundary: {
      forbiddenTargets: forbiddenFlowDocsTargets,
      forbiddenTargetFindings,
    },
    testBoundary,
    checks: results,
    failures: failures.map(({ id, commandLine, exitCode, stdoutTail, stderrTail }) => ({
      id,
      commandLine,
      exitCode,
      stdoutTail,
      stderrTail,
    })),
    testBoundaryFailures,
  };

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));

  console.log(JSON.stringify({
    status: report.status,
    checks: report.checks.length,
    pass: report.checks.filter((check) => check.status === "pass").length,
    fail: report.failures.length,
    forbiddenFlowDocsTargets: forbiddenTargetFindings.length,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (status !== "pass") process.exitCode = 1;
}

main();
