#!/usr/bin/env node

const {
  fs,
  foundationIds,
  path,
  primitiveNames,
  read,
  rel,
  root,
  slug,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase3-foundations-primitives-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase3-foundations-primitives-checkpoint.md");
const selfFile = __filename;

const scanRoots = [
  "packages/react/src",
  "packages/components/src",
  "packages/tokens/src/primitives",
  "packages/content/content/foundation-contracts",
  "packages/content/content/primitive-contracts",
]
  .map((target) => path.join(root, target))
  .filter((target) => fs.existsSync(target));

const forbiddenSourcePatterns = [
  {
    id: "docs-only-doc-panel",
    label: "Docs-only doc-panel boundary outside token source",
    pattern: /\bdoc-panel\b/g,
  },
  {
    id: "docs-demo-surface",
    label: "Docs demo surface leaking into Flow source",
    pattern: /\bdocs-demo\b/g,
  },
  {
    id: "decorative-gradient",
    label: "Decorative gradient outside token source",
    pattern: /\b(?:linear|radial|conic|repeating-linear)-gradient\(/g,
  },
  {
    id: "local-background-image",
    label: "Local background image/texture outside token source",
    pattern: /\bbackground-image\s*:/g,
  },
  {
    id: "local-font-family",
    label: "Local typography family outside token source",
    pattern: /\bfont-family\s*:/g,
  },
];

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return fallback;
  }
}

function statusOf(report) {
  return String(report?.status ?? "").toLowerCase();
}

function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target)
      .sort()
      .flatMap((entry) => walk(path.join(target, entry)));
  }
  if (!/\.(?:cjs|js|mjs|ts|tsx|md)$/.test(target)) return [];
  if (path.resolve(target) === path.resolve(selfFile)) return [];
  return [target];
}

function lineForIndex(source, index) {
  return source.slice(0, index).split("\n").length;
}

function sourceBoundaryViolations() {
  const files = [...new Set(scanRoots.flatMap((target) => walk(target)))]
    .sort((a, b) => rel(a).localeCompare(rel(b)));
  const violations = files.flatMap((file) => {
    const source = read(file);
    return forbiddenSourcePatterns.flatMap((rule) => (
      [...source.matchAll(rule.pattern)].map((match) => ({
        rule: rule.id,
        label: rule.label,
        file: rel(file),
        line: lineForIndex(source, match.index),
        match: match[0],
      }))
    ));
  });
  return { files, violations };
}

function createReport() {
  const foundationReports = foundationIds.map((id) => ({
    id,
    file: `docs/audits/foundation-${id}-cascade-audit.json`,
    report: readJson(`docs/audits/foundation-${id}-cascade-audit.json`),
  }));
  const primitiveIds = primitiveNames.map(slug);
  const primitiveReports = primitiveIds.map((id) => ({
    id,
    file: `docs/audits/primitive-${id}-cascade-audit.json`,
    report: readJson(`docs/audits/primitive-${id}-cascade-audit.json`),
  }));
  const primitiveGovernance = readJson("docs/audits/primitive-cascade-governance-audit.json");
  const primitiveActivation = readJson("docs/audits/primitive-cascade-activation-plan.json");
  const primitiveRuntime = readJson("docs/audits/system-p0-primitive-runtime-matrix.json");
  const exportContract = readJson("docs/audits/foundation-primitive-export-contract-audit.json");
  const rawTokenGovernance = readJson("docs/audits/system-raw-token-value-governance.json");
  const generatedTokenGovernance = readJson("docs/audits/system-generated-token-output-governance.json");
  const phase1Checkpoint = readJson("docs/audits/system-phase1-style-dictionary-checkpoint.json");
  const { files, violations } = sourceBoundaryViolations();

  const failingFoundationReports = foundationReports.filter((entry) => statusOf(entry.report) !== "pass");
  const failingPrimitiveReports = primitiveReports.filter((entry) => statusOf(entry.report) !== "pass");
  const missingFoundationReports = foundationReports.filter((entry) => !Object.keys(entry.report).length);
  const missingPrimitiveReports = primitiveReports.filter((entry) => !Object.keys(entry.report).length);

  const issues = [
    ...(statusOf(phase1Checkpoint) === "pass" ? [] : ["Phase 3 cannot close while Phase 1 Style Dictionary checkpoint is not pass."]),
    ...(statusOf(generatedTokenGovernance) === "pass" ? [] : ["Phase 3 cannot close while generated token output governance is not pass."]),
    ...(statusOf(rawTokenGovernance) === "pass" ? [] : ["Phase 3 cannot close while raw token value governance is not pass."]),
    ...(statusOf(exportContract) === "pass" ? [] : ["Phase 3 cannot close while foundation/primitive export contract is not pass."]),
    ...(statusOf(primitiveGovernance) === "pass" ? [] : ["Phase 3 cannot close while primitive cascade governance is not pass."]),
    ...(statusOf(primitiveActivation) === "pass" ? [] : ["Phase 3 cannot close while primitive cascade activation plan is not pass."]),
    ...missingFoundationReports.map((entry) => `Missing foundation cascade report: ${entry.file}`),
    ...failingFoundationReports.map((entry) => `Foundation cascade report is not pass: ${entry.file}`),
    ...missingPrimitiveReports.map((entry) => `Missing primitive cascade report: ${entry.file}`),
    ...failingPrimitiveReports.map((entry) => `Primitive cascade report is not pass: ${entry.file}`),
    ...(primitiveGovernance.inventory?.activePrimitiveCascadeReports === primitiveIds.length ? [] : [`Expected ${primitiveIds.length} active primitive gates, got ${primitiveGovernance.inventory?.activePrimitiveCascadeReports ?? "unknown"}.`]),
    ...(primitiveGovernance.inventory?.backlogPrimitiveCascadeReports === 0 ? [] : ["Primitive cascade backlog must be 0 to close Phase 3."]),
    ...(primitiveActivation.inventory?.backlogPrimitiveCascadeReports === 0 ? [] : ["Primitive activation backlog must be 0 to close Phase 3."]),
    ...(primitiveRuntime.totals?.primitives === primitiveIds.length ? [] : [`Expected runtime matrix to cover ${primitiveIds.length} primitives, got ${primitiveRuntime.totals?.primitives ?? "unknown"}.`]),
    ...(primitiveRuntime.totals?.jsRuntimeOnly === 0 ? [] : ["Primitive runtime matrix still has JS-only primitive runtime debt."]),
    ...(primitiveRuntime.totals?.missingP0Runtime === 0 ? [] : ["Primitive runtime matrix still has missing P0 runtime debt."]),
    ...(primitiveRuntime.totals?.policyOrNonRuntimeDecisionNeeded === 0 ? [] : ["Primitive runtime matrix still has unresolved policy/non-runtime decisions."]),
    ...(exportContract.inventory?.foundations === foundationIds.length ? [] : [`Expected export contract to cover ${foundationIds.length} foundations, got ${exportContract.inventory?.foundations ?? "unknown"}.`]),
    ...(exportContract.inventory?.primitives === primitiveIds.length ? [] : [`Expected export contract to cover ${primitiveIds.length} primitives, got ${exportContract.inventory?.primitives ?? "unknown"}.`]),
    ...(exportContract.inventory?.foundationPrimitiveExportDebt === 0 ? [] : ["Foundation/primitive export debt must be 0."]),
    ...(rawTokenGovernance.totals?.violations === 0 ? [] : ["Raw token value violations must be 0."]),
    ...(generatedTokenGovernance.totals?.matchingOutputs === generatedTokenGovernance.totals?.outputs ? [] : ["Generated token outputs must all match the token manifest."]),
    ...violations.map((violation) => `${violation.rule} at ${violation.file}:${violation.line}`),
  ];

  const inventory = {
    foundationCascadeReports: foundationReports.length,
    passingFoundationCascadeReports: foundationReports.length - failingFoundationReports.length - missingFoundationReports.length,
    primitiveCascadeReports: primitiveReports.length,
    passingPrimitiveCascadeReports: primitiveReports.length - failingPrimitiveReports.length - missingPrimitiveReports.length,
    activePrimitiveCascadeReports: primitiveGovernance.inventory?.activePrimitiveCascadeReports ?? 0,
    backlogPrimitiveCascadeReports: primitiveGovernance.inventory?.backlogPrimitiveCascadeReports ?? 0,
    primitiveRuntimeContracts: primitiveRuntime.totals?.typedRuntime ?? 0,
    primitivePolicyContracts: primitiveRuntime.totals?.typedPolicyContract ?? 0,
    jsRuntimeOnlyPrimitives: primitiveRuntime.totals?.jsRuntimeOnly ?? 0,
    missingP0RuntimePrimitives: primitiveRuntime.totals?.missingP0Runtime ?? 0,
    unresolvedPrimitiveRuntimeDecisions: primitiveRuntime.totals?.policyOrNonRuntimeDecisionNeeded ?? 0,
    exportedFoundations: exportContract.inventory?.foundations ?? 0,
    exportedPrimitives: exportContract.inventory?.primitives ?? 0,
    foundationPrimitiveExportDebt: exportContract.inventory?.foundationPrimitiveExportDebt ?? 0,
    generatedTokenOutputs: generatedTokenGovernance.totals?.outputs ?? 0,
    matchingGeneratedTokenOutputs: generatedTokenGovernance.totals?.matchingOutputs ?? 0,
    rawTokenValueViolations: rawTokenGovernance.totals?.violations ?? 0,
    sourceBoundaryFilesScanned: files.length,
    sourceBoundaryViolations: violations.length,
  };
  inventory.phase3FoundationsPrimitivesDebt = issues.length;

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 3 foundations/primitives checkpoint",
    principle: "Foundations and primitives can close only when source tokens, generated outputs, export contracts, runtime/policy primitive contracts, active primitive cascade gates, and source-boundary governance all pass together.",
    scope: "Original plan iteration 19: close Foundations/Primitives cascade base.",
    inventory,
    foundationReports: foundationReports.map(({ id, file, report }) => ({ id, file, status: statusOf(report) || "missing" })),
    primitiveReports: primitiveReports.map(({ id, file, report }) => ({ id, file, status: statusOf(report) || "missing" })),
    forbiddenSourcePatterns: forbiddenSourcePatterns.map(({ id, label }) => ({ id, label })),
    sourceBoundaryViolations: violations,
    issues,
  };
}

function toMarkdown(report) {
  const issueRows = report.issues.map((issue) => `- ${issue}`);
  const violationRows = report.sourceBoundaryViolations.map((violation) => (
    `| ${violation.rule} | ${violation.file}:${violation.line} | \`${violation.match.replaceAll("|", "\\|")}\` |`
  ));
  return [
    "# Phase 3 Foundations/Primitives Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Foundation cascade reports: ${report.inventory.passingFoundationCascadeReports}/${report.inventory.foundationCascadeReports}`,
    `- Primitive cascade reports: ${report.inventory.passingPrimitiveCascadeReports}/${report.inventory.primitiveCascadeReports}`,
    `- Active primitive cascade reports: ${report.inventory.activePrimitiveCascadeReports}`,
    `- Backlog primitive cascade reports: ${report.inventory.backlogPrimitiveCascadeReports}`,
    `- Primitive runtime contracts: ${report.inventory.primitiveRuntimeContracts}`,
    `- Primitive policy contracts: ${report.inventory.primitivePolicyContracts}`,
    `- JS-only primitive runtimes: ${report.inventory.jsRuntimeOnlyPrimitives}`,
    `- Missing P0 primitive runtimes: ${report.inventory.missingP0RuntimePrimitives}`,
    `- Unresolved primitive runtime decisions: ${report.inventory.unresolvedPrimitiveRuntimeDecisions}`,
    `- Exported foundations: ${report.inventory.exportedFoundations}`,
    `- Exported primitives: ${report.inventory.exportedPrimitives}`,
    `- Generated token outputs: ${report.inventory.matchingGeneratedTokenOutputs}/${report.inventory.generatedTokenOutputs}`,
    `- Raw token value violations: ${report.inventory.rawTokenValueViolations}`,
    `- Source boundary files scanned: ${report.inventory.sourceBoundaryFilesScanned}`,
    `- Source boundary violations: ${report.inventory.sourceBoundaryViolations}`,
    `- Phase 3 debt: ${report.inventory.phase3FoundationsPrimitivesDebt}`,
    "",
    "## Source Boundary Violations",
    "",
    "| Rule | Location | Match |",
    "| --- | --- | --- |",
    ...(violationRows.length ? violationRows : ["| None | None | None |"]),
    "",
    "## Issues",
    "",
    ...(issueRows.length ? issueRows : ["- None"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Phase 3 foundations/primitives checkpoint is stale. Run: node packages/audit/scripts/report-system-phase3-foundations-primitives-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    foundations: `${report.inventory.passingFoundationCascadeReports}/${report.inventory.foundationCascadeReports}`,
    primitives: `${report.inventory.passingPrimitiveCascadeReports}/${report.inventory.primitiveCascadeReports}`,
    sourceBoundaryViolations: report.inventory.sourceBoundaryViolations,
    debt: report.inventory.phase3FoundationsPrimitivesDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
