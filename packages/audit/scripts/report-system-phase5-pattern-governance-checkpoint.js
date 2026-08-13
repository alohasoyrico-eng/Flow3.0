#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase5-pattern-governance-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase5-pattern-governance-checkpoint.md");

const checkpointReports = [
  {
    id: "pattern-1to1",
    file: "docs/audits/system-phase5-pattern-1to1-checkpoint.json",
    countKey: "patterns",
    passKey: "patterns",
    debtKey: "patternAuditDebt",
  },
  {
    id: "shell-patterns",
    file: "docs/audits/system-phase5-shell-patterns-checkpoint.json",
    countKey: "shellPatterns",
    passKey: "shellPatternsPassing",
    debtKey: "shellPatternDebt",
    patternListKey: "shellPatterns",
  },
  {
    id: "interaction-patterns",
    file: "docs/audits/system-phase5-interaction-patterns-checkpoint.json",
    countKey: "interactionPatterns",
    passKey: "passingInteractionPatterns",
    debtKey: "interactionPatternDebt",
    patternListKey: "patterns",
  },
  {
    id: "data-domain-mobile-patterns",
    file: "docs/audits/system-phase5-data-domain-mobile-patterns-checkpoint.json",
    countKey: "dataDomainMobilePatterns",
    passKey: "passingDataDomainMobilePatterns",
    debtKey: "dataDomainMobilePatternDebt",
    patternListKey: "patterns",
  },
];

const globalReports = [
  ["pattern-readiness", "docs/audits/pattern-readiness-audit.json", "patternReadinessDebt"],
  ["pattern-contracts", "docs/audits/pattern-contract-governance-audit.json", "patternContractGovernanceDebt"],
  ["pattern-architecture", "docs/audits/pattern-1to1-architecture-audit.json", "patternArchitectureDebt"],
  ["foundation-primitive-1to1", "docs/audits/pattern-foundation-primitive-1to1-audit.json", "foundationPrimitiveBlockingDebt"],
  ["react-migration", "docs/audits/pattern-react-migration-audit.json", "migrationAuditDebt"],
  ["react-behavior", "docs/audits/react-pattern-behavior-governance-audit.json", "reactPatternBehaviorDebt"],
  ["react-composition", "docs/audits/react-pattern-composition-governance-audit.json", "reactPatternCompositionDebt"],
  ["shell-contracts", "docs/audits/shell-pattern-contract-governance-audit.json", "shellPatternContractDebt"],
];

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return fallback;
  }
}

function inventoryOf(report) {
  return report.inventory ?? report.summary ?? report;
}

function statusOf(report) {
  return String(report?.status ?? "").toLowerCase();
}

function patternIdsFrom(report, key) {
  if (!key || !Array.isArray(report[key])) return [];
  return report[key].map((row) => row.id ?? row.patternId ?? row.pattern).filter(Boolean);
}

function createReport() {
  const checkpointRows = checkpointReports.map((definition) => {
    const report = readJson(definition.file);
    const inventory = inventoryOf(report);
    const patterns = patternIdsFrom(report, definition.patternListKey);
    const count = Number(inventory[definition.countKey] ?? 0);
    const passing = Number(inventory[definition.passKey] ?? 0);
    const debt = Number(inventory[definition.debtKey] ?? 0);
    return {
      id: definition.id,
      file: definition.file,
      status: statusOf(report) || "missing",
      count,
      passing,
      debt,
      patterns,
    };
  });

  const globalRows = globalReports.map(([id, file, debtKey]) => {
    const report = readJson(file);
    const inventory = inventoryOf(report);
    return {
      id,
      file,
      status: statusOf(report) || "missing",
      debt: Number(inventory[debtKey] ?? 0),
    };
  });

  const classifiedPatternIds = checkpointRows
    .filter((row) => row.patterns.length)
    .flatMap((row) => row.patterns);
  const uniqueClassifiedPatternIds = [...new Set(classifiedPatternIds)].sort();
  const duplicates = classifiedPatternIds.filter((id, index) => classifiedPatternIds.indexOf(id) !== index).sort();
  const reference = readJson("docs/audits/pattern-readiness-audit.json");
  const referencePatternIds = Array.isArray(reference.patterns)
    ? reference.patterns.map((row) => row.id ?? row.patternId ?? row.pattern).filter(Boolean).sort()
    : uniqueClassifiedPatternIds;
  const missing = referencePatternIds.filter((id) => !uniqueClassifiedPatternIds.includes(id));
  const unexpected = uniqueClassifiedPatternIds.filter((id) => !referencePatternIds.includes(id));
  const shellCount = checkpointRows.find((row) => row.id === "shell-patterns")?.count ?? 0;
  const interactionCount = checkpointRows.find((row) => row.id === "interaction-patterns")?.count ?? 0;
  const dataDomainMobileCount = checkpointRows.find((row) => row.id === "data-domain-mobile-patterns")?.count ?? 0;
  const classifiedCount = shellCount + interactionCount + dataDomainMobileCount;

  const issues = [
    ...(classifiedCount === 63 ? [] : [`Expected shell + interaction + data/domain/mobile to equal 63, got ${classifiedCount}.`]),
    ...(uniqueClassifiedPatternIds.length === 63 ? [] : [`Expected 63 unique classified pattern ids, got ${uniqueClassifiedPatternIds.length}.`]),
    ...checkpointRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...checkpointRows.filter((row) => row.count !== row.passing).map((row) => `${row.id} passing mismatch: ${row.passing}/${row.count}.`),
    ...checkpointRows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...globalRows.filter((row) => row.status !== "pass").map((row) => `${row.file} is not pass.`),
    ...globalRows.filter((row) => row.debt !== 0).map((row) => `${row.id} debt is ${row.debt}.`),
    ...duplicates.map((id) => `duplicate classified pattern: ${id}`),
    ...missing.map((id) => `missing classified pattern: ${id}`),
    ...unexpected.map((id) => `unexpected classified pattern: ${id}`),
  ];

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 5 pattern governance checkpoint",
    principle: "Phase 5 can close only when all 63 patterns are covered exactly once by shell, interaction, and data/domain/mobile governance groups, all pattern global reports pass, every checkpoint reports zero debt, and no docs/runtime duplicate behavior or ungoverned pattern dependency remains.",
    scope: "Original plan iteration 29: pattern governance checkpoint and Phase 5 closure.",
    inventory: {
      patterns: 63,
      classifiedPatterns: classifiedCount,
      uniqueClassifiedPatterns: uniqueClassifiedPatternIds.length,
      shellPatterns: shellCount,
      interactionPatterns: interactionCount,
      dataDomainMobilePatterns: dataDomainMobileCount,
      checkpointReports: checkpointRows.length,
      passingCheckpointReports: checkpointRows.filter((row) => row.status === "pass").length,
      globalReports: globalRows.length,
      passingGlobalReports: globalRows.filter((row) => row.status === "pass").length,
      checkpointDebt: checkpointRows.reduce((total, row) => total + row.debt, 0),
      globalDebt: globalRows.reduce((total, row) => total + row.debt, 0),
      duplicatePatternClassifications: duplicates.length,
      missingPatternClassifications: missing.length,
      unexpectedPatternClassifications: unexpected.length,
      patternGovernanceDebt: issues.length,
    },
    checkpoints: checkpointRows,
    globalReports: globalRows,
    classifiedPatternIds: uniqueClassifiedPatternIds,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 5 Pattern Governance Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Patterns: ${report.inventory.patterns}`,
    `- Classified patterns: ${report.inventory.classifiedPatterns}`,
    `- Unique classified patterns: ${report.inventory.uniqueClassifiedPatterns}`,
    `- Shell patterns: ${report.inventory.shellPatterns}`,
    `- Interaction patterns: ${report.inventory.interactionPatterns}`,
    `- Data/domain/mobile patterns: ${report.inventory.dataDomainMobilePatterns}`,
    `- Checkpoint reports: ${report.inventory.passingCheckpointReports}/${report.inventory.checkpointReports}`,
    `- Global reports: ${report.inventory.passingGlobalReports}/${report.inventory.globalReports}`,
    `- Checkpoint debt: ${report.inventory.checkpointDebt}`,
    `- Global debt: ${report.inventory.globalDebt}`,
    `- Duplicate classifications: ${report.inventory.duplicatePatternClassifications}`,
    `- Missing classifications: ${report.inventory.missingPatternClassifications}`,
    `- Unexpected classifications: ${report.inventory.unexpectedPatternClassifications}`,
    `- Pattern governance debt: ${report.inventory.patternGovernanceDebt}`,
    "",
    "## Checkpoints",
    "",
    "| Checkpoint | Status | Count | Passing | Debt |",
    "| --- | --- | ---: | ---: | ---: |",
    ...report.checkpoints.map((row) => `| ${row.id} | ${row.status} | ${row.count} | ${row.passing} | ${row.debt} |`),
    "",
    "## Global Reports",
    "",
    "| Report | Status | Debt |",
    "| --- | --- | ---: |",
    ...report.globalReports.map((row) => `| ${row.id} | ${row.status} | ${row.debt} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None"]),
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
      console.error("Phase 5 pattern governance checkpoint is stale. Run: node packages/audit/scripts/report-system-phase5-pattern-governance-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    patterns: report.inventory.patterns,
    classified: report.inventory.classifiedPatterns,
    unique: report.inventory.uniqueClassifiedPatterns,
    checkpoints: `${report.inventory.passingCheckpointReports}/${report.inventory.checkpointReports}`,
    globalReports: `${report.inventory.passingGlobalReports}/${report.inventory.globalReports}`,
    debt: report.inventory.patternGovernanceDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
