#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-gate-boundary-classification.json");
const markdownOutput = path.join(outputDir, "system-gate-boundary-classification.md");

const layers = [
  {
    id: "flow-core",
    owner: "Flow package source",
    purpose: "Validate tokens, specs, package CSS, React source, public exports, runtime install, accessibility, interaction, and component contracts.",
    sourceOfTruth: [
      "packages/tokens/src/**",
      "packages/tokens/tokens.json",
      "packages/specs/specs/**",
      "packages/components/src/**",
      "packages/components/styles/components.css",
      "packages/react/src/**",
      "packages/react/dist/**",
      "packages/react/test/**",
    ],
    allowedGeneratedEvidence: [
      "docs/audits/react-production-readiness.json",
      "docs/audits/react-interaction-coverage-audit.json",
    ],
    scripts: [
      "audit-ds-release-gate.js",
      "audit-ds-fast-gate.js",
      "report-ds-qa-performance.js",
      "report-ds-qa-topology.js",
      "audit-consumer-install.mjs",
      "audit-component-css-contracts.js",
      "audit-package-css-contracts.js",
      "audit-density-contracts.js",
      "audit-energy-contracts.js",
      "audit-voice-contracts.js",
      "audit-state-contracts.js",
      "audit-motion-contracts.js",
      "audit-accessibility-contracts.js",
      "audit-react-primary-contract.js",
      "report-react-production-readiness.js",
      "report-react-interaction-coverage.js",
    ],
  },
  {
    id: "flowdocs-consumer",
    owner: "FlowDocs app",
    purpose: "Validate FlowDocs as a consumer of Flow, not as package source or generated proof.",
    sourceOfTruth: [
      "../FlowDocs/apps/docs/**",
      "packages/content/content/**",
      "packages/react/dist/templates/**",
    ],
    allowedGeneratedEvidence: [
      "../FlowDocs/apps/docs/generated/docs-content.bundle.json",
    ],
    scripts: [
      "audit-docs-runtime.mjs",
      "audit-docs-component-demo-ownership.js",
      "audit-docs-content.js",
      "audit-template-composition.js",
      "report-system-phase6-flowdocs-consumer-checkpoint.js",
    ],
  },
  {
    id: "generated-reports",
    owner: "Audit runner",
    purpose: "Store reproducible outputs. These files may be checked for freshness but must not be treated as canonical source.",
    sourceOfTruth: [],
    allowedGeneratedEvidence: [
      "docs/audits/component-1to1-quality-matrix.json",
      "docs/audits/react-production-readiness.json",
      "docs/audits/react-interaction-coverage-audit.json",
      "docs/audits/system-debt-ledger.json",
    ],
    scripts: [
      "report-system-debt-ledger.js",
      "report-system-audit-contract-governance.js",
      "report-system-phase4-component-cascade-checkpoint.js",
    ],
  },
  {
    id: "legacy-forensics",
    owner: "Historical evidence",
    purpose: "Preserve prior forensic observations for context only. These files must not gate current readiness without an explicit migration decision.",
    sourceOfTruth: [],
    allowedGeneratedEvidence: [
      "docs/forensics/**",
    ],
    scripts: [
      "report-system-p0-forensic-detail.js",
      "report-system-p0-owner-decision-matrix.js",
      "report-system-remediation-matrix.js",
    ],
  },
];

const rules = [
  "The authoritative Flow package release command is npm run validate:flow-core; npm run validate:system is a compatibility alias to that command.",
  "Generated reports are never canonical source; they are reproducible evidence only.",
  "Flow core gates must not require FlowDocs renderers unless the gate is explicitly a consumer gate.",
  "FlowDocs gates may validate consumption of Flow packages but must not define component API, state, token, or accessibility truth.",
  "Legacy forensic files can inform decisions but must not block current gates unless promoted to an active contract.",
  "A combined audit may exist only as an aggregator that reports layer status separately.",
  "Legacy mixed gates may remain for historical coverage but must be marked non-authoritative for Flow core release readiness.",
];

function readIfExists(file) {
  try {
    return fs.readFileSync(path.join(root, file), "utf8");
  } catch {
    return "";
  }
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

const integrationSource = readIfExists("packages/audit/scripts/audit-integration.js");
const systemScopeSource = readIfExists("packages/audit/scripts/audit-system-scope.js");
const packageJson = JSON.parse(readIfExists("package.json") || "{}");
const expectedFlowCoreCommand = "npm run build:tokens && npm run build:react && npm run typecheck && npm run test:react:release && npm run audit:ds-release-gate";
const authoritativeCommands = [
  packageJson?.scripts?.["validate:flow-core"] ?? "",
  packageJson?.scripts?.["validate:system"] ?? "",
  packageJson?.scripts?.["audit:ds-release-gate"] ?? "",
  packageJson?.scripts?.["audit:ds-fast-gate"] ?? "",
].join(" ");
const mixedGatesAreAuthoritative = /audit-integration|audit-system-scope|audit-system\.js|audit-complete/.test(authoritativeCommands);

const issues = [];
if (integrationSource.includes("checkComponent1to1QualityMatrix()")) {
  issues.push({
    layer: "generated-reports",
    file: "packages/audit/scripts/audit-integration.js",
    severity: mixedGatesAreAuthoritative ? "high" : "info",
    message: "audit-integration uses component-1to1 generated report validation inside the mixed gate.",
  });
}
if (integrationSource.includes("checkTemplateComposition()")) {
  issues.push({
    layer: "flowdocs-consumer",
    file: "packages/audit/scripts/audit-integration.js",
    severity: mixedGatesAreAuthoritative ? "high" : "info",
    message: "audit-integration mixes FlowDocs template composition with Flow core validation.",
  });
}
if (systemScopeSource.includes("checkDocsComponentDemoOwnership()")) {
  issues.push({
    layer: "flowdocs-consumer",
    file: "packages/audit/scripts/audit-system-scope.js",
    severity: mixedGatesAreAuthoritative ? "high" : "info",
    message: "audit-system-scope includes FlowDocs demo ownership in the system/core scope.",
  });
}
if (packageJson?.scripts?.["validate:flow-core"] !== expectedFlowCoreCommand) {
  issues.push({
    layer: "flow-core",
    file: "package.json",
    severity: "high",
    message: "validate:flow-core must be the authoritative DS release gate.",
  });
}
if (packageJson?.scripts?.["validate:system"] !== "npm run validate:flow-core") {
  issues.push({
    layer: "flow-core",
    file: "package.json",
    severity: "high",
    message: "validate:system must alias validate:flow-core instead of calling mixed legacy gates.",
  });
}
if (!packageJson?.scripts?.["audit:ds-release-gate"]?.includes("audit-ds-release-gate.js")) {
  issues.push({
    layer: "flow-core",
    file: "package.json",
    severity: "high",
    message: "Package scripts must expose audit:ds-release-gate.",
  });
}
if (!packageJson?.scripts?.["audit:ds-fast-gate"]?.includes("audit-ds-fast-gate.js")) {
  issues.push({
    layer: "flow-core",
    file: "package.json",
    severity: "high",
    message: "Package scripts must expose audit:ds-fast-gate.",
  });
}
if (!packageJson?.scripts?.["audit:ds-qa-topology"]?.includes("report-ds-qa-topology.js")) {
  issues.push({
    layer: "flow-core",
    file: "package.json",
    severity: "high",
    message: "Package scripts must expose audit:ds-qa-topology.",
  });
}
if (!packageJson?.scripts?.["audit:ds-qa-performance"]?.includes("report-ds-qa-performance.js")) {
  issues.push({
    layer: "flow-core",
    file: "package.json",
    severity: "high",
    message: "Package scripts must expose audit:ds-qa-performance.",
  });
}

for (const report of [
  "docs/audits/component-1to1-quality-matrix.json",
  "docs/audits/react-production-readiness.json",
  "docs/audits/react-interaction-coverage-audit.json",
]) {
  if (!exists(report)) continue;
  issues.push({
    layer: "generated-reports",
    file: report,
    severity: "info",
    message: "Generated report exists and must be treated as evidence, not source of truth.",
  });
}

const report = {
  schemaVersion: "system-gate-boundary-classification@1",
  generatedAt: new Date().toISOString(),
  status: issues.some((issue) => issue.severity === "high") ? "action_required" : "pass",
  summary: {
    highIssues: issues.filter((issue) => issue.severity === "high").length,
    boundaryClassificationDebt: issues.filter((issue) => issue.severity === "high").length,
    mixedGatesAreAuthoritative,
  },
  rules,
  layers,
  issues,
  nextIteration: {
    id: "flowdocs-runtime-inventory",
    goal: "Map FlowDocs files as used, generated, stale, orphan, or unknown.",
  },
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, renderMarkdown(report));
console.log(JSON.stringify({
  status: report.status,
  layers: report.layers.length,
  issues: report.issues.length,
  highIssues: report.issues.filter((issue) => issue.severity === "high").length,
  json: path.relative(root, jsonOutput),
  markdown: path.relative(root, markdownOutput),
}, null, 2));

function renderMarkdown(report) {
  return `# System Gate Boundary Classification

Status: ${report.status}

## Rules

${report.rules.map((rule) => `- ${rule}`).join("\n")}

## Layers

${report.layers.map((layer) => `### ${layer.id}

- Owner: ${layer.owner}
- Purpose: ${layer.purpose}
- Source of truth: ${layer.sourceOfTruth.length ? layer.sourceOfTruth.join(", ") : "None"}
- Allowed generated evidence: ${layer.allowedGeneratedEvidence.length ? layer.allowedGeneratedEvidence.join(", ") : "None"}
- Scripts: ${layer.scripts.join(", ")}
`).join("\n")}

## Issues

${report.issues.length ? report.issues.map((issue) => `- [${issue.severity}] ${issue.layer}: ${issue.file} - ${issue.message}`).join("\n") : "- None"}

## Next Iteration

- ${report.nextIteration.id}: ${report.nextIteration.goal}
`;
}
