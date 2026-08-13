#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase5-data-domain-mobile-patterns-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase5-data-domain-mobile-patterns-checkpoint.md");
const patternArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");

const patternFamilies = {
  dataAndVisualization: [
    "calendar-view",
    "chart-legend-item",
    "chart-wrapper",
    "expandable-detail-table",
    "filterable-editable-table",
    "gantt-chart",
    "kanban-board",
    "kpi-card",
    "polar-chart",
    "virtual-data-table",
    "waterfall-chart",
  ],
  domainOperations: [
    "account-operations",
    "agent-conversation",
    "backoffice-approval",
    "case-management",
    "dense-operational-list",
    "driver-and-vehicle-administration",
    "fleet-manager-onboarding-desktop",
    "preference-management",
    "pricing-operations",
    "roles-and-permissions",
    "status-feedback-view",
    "ticket-queue",
  ],
  mobileChannelAndTask: [
    "authentication-login-biometrics-and-otp",
    "driver-onboarding-mobile",
    "email-template-layout",
    "help-center",
    "payment-form",
    "pull-to-refresh",
    "section-header",
    "station-discovery",
  ],
};

const patternIds = Object.values(patternFamilies).flat();

const requiredReports = [
  {
    id: "pattern-behavior",
    file: "docs/audits/react-pattern-behavior-governance-audit.json",
    debtKey: "reactPatternBehaviorDebt",
  },
  {
    id: "pattern-composition",
    file: "docs/audits/react-pattern-composition-governance-audit.json",
    debtKey: "reactPatternCompositionDebt",
  },
  {
    id: "pattern-migration",
    file: "docs/audits/pattern-react-migration-audit.json",
    debtKey: "migrationAuditDebt",
  },
  {
    id: "foundation-primitive-1to1",
    file: "docs/audits/pattern-foundation-primitive-1to1-audit.json",
    debtKey: "foundationPrimitiveBlockingDebt",
  },
  {
    id: "template-cascade-governance",
    file: "docs/audits/template-cascade-governance-audit.json",
    debtKey: "templateCascadeGovernanceDebt",
  },
];

function pascalCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")
    .replace(/^KPI/, "Kpi")
    .replace(/OTP/g, "Otp");
}

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));
  } catch {
    return fallback;
  }
}

function readPatternArtifact(patternId) {
  const file = path.join(patternArtifactDir, `${patternId}.json`);
  if (!fs.existsSync(file)) return null;
  const json = JSON.parse(fs.readFileSync(file, "utf8"));
  return json.artifacts?.patterns?.[patternId] ?? null;
}

function reportRows(report) {
  return Array.isArray(report.patterns) ? report.patterns : [];
}

function findPatternRow(report, patternId) {
  return reportRows(report).find((row) => row.patternId === patternId || row.id === patternId || row.pattern === patternId);
}

function sourceFiles(patternId) {
  const name = pascalCase(patternId);
  return {
    artifact: path.join("packages/specs/specs/unison-system/artifacts/patterns", `${patternId}.json`),
    contract: path.join("packages/content/content/pattern-contracts/patterns", `${patternId}.md`),
    ts: path.join("packages/react/src/patterns", `${name}.ts`),
    js: path.join("packages/react/src/patterns", `${name}.js`),
    types: path.join("packages/react/src/patterns", `${name}.d.ts`),
  };
}

function fileExists(file) {
  return fs.existsSync(path.join(root, file));
}

function familyOf(patternId) {
  return Object.entries(patternFamilies).find(([, ids]) => ids.includes(patternId))?.[0] ?? "unclassified";
}

function createReport() {
  const reports = requiredReports.map((definition) => {
    const report = readJson(definition.file);
    return {
      ...definition,
      status: String(report.status ?? "missing").toLowerCase(),
      debt: Number((report.inventory ?? report.summary ?? report)[definition.debtKey] ?? 0),
      report,
    };
  });

  const patterns = patternIds.map((patternId) => {
    const artifact = readPatternArtifact(patternId);
    const files = sourceFiles(patternId);
    const behavior = findPatternRow(reports.find((report) => report.id === "pattern-behavior")?.report ?? {}, patternId);
    const composition = findPatternRow(reports.find((report) => report.id === "pattern-composition")?.report ?? {}, patternId);
    const migration = findPatternRow(reports.find((report) => report.id === "pattern-migration")?.report ?? {}, patternId);
    const foundationPrimitive = findPatternRow(reports.find((report) => report.id === "foundation-primitive-1to1")?.report ?? {}, patternId);
    const fileStatus = Object.entries(files).map(([kind, file]) => ({ kind, file, exists: fileExists(file) }));
    const debts = [
      ...(behavior?.debts ?? []),
      ...(composition?.debts ?? []),
      ...(migration?.debts ?? []),
      ...(foundationPrimitive?.debts ?? []),
      ...fileStatus.filter((file) => !file.exists).map((file) => `${file.kind} missing: ${file.file}`),
      ...(!artifact ? [`artifact missing: ${patternId}`] : []),
      ...(artifact && (!Array.isArray(artifact.states) || artifact.states.length === 0) ? [`states missing: ${patternId}`] : []),
      ...(artifact && patternId !== "email-template-layout" && (!Array.isArray(artifact.componentDependencies) || artifact.componentDependencies.length === 0) ? [`component dependencies missing: ${patternId}`] : []),
      ...(behavior && behavior.missingCallbackTests?.length ? behavior.missingCallbackTests.map((item) => `missing callback test: ${item}`) : []),
      ...(composition && composition.docsDependencies?.length ? composition.docsDependencies.map((item) => `docs dependency: ${item}`) : []),
      ...(composition && composition.workspaceDependencies?.length ? composition.workspaceDependencies.map((item) => `workspace dependency: ${item}`) : []),
      ...(composition && composition.rawDomVisuals?.length ? composition.rawDomVisuals.map((item) => `raw DOM visual: ${item}`) : []),
      ...(composition && composition.slotIssues?.length ? composition.slotIssues.map((item) => `slot issue: ${item}`) : []),
      ...(composition && composition.tokenIssues?.length ? composition.tokenIssues.map((item) => `token issue: ${item}`) : []),
    ];
    return {
      id: patternId,
      family: familyOf(patternId),
      status: debts.length ? "fail" : "pass",
      files: fileStatus,
      states: artifact?.states?.length ?? 0,
      components: artifact?.componentDependencies?.length ?? 0,
      patternDependencies: artifact?.patternDependencies?.length ?? 0,
      callbacks: behavior?.callbacks?.length ?? 0,
      testedCallbacks: behavior?.testedCallbacks?.length ?? 0,
      slots: composition?.slotCount ?? 0,
      slotUses: composition?.slotUseCount ?? 0,
      tokenDependencies: composition?.tokenDependencyCount ?? 0,
      primitiveDependencies: artifact?.primitiveDependencies?.length ?? 0,
      foundationDependencies: artifact?.foundationDependencies?.length ?? 0,
      debts,
    };
  });

  const familyIssues = Object.entries(patternFamilies).flatMap(([family, ids]) => [
    ...(ids.length ? [] : [`${family} is empty.`]),
    ...ids.filter((id) => !patternIds.includes(id)).map((id) => `${family} missing ${id}`),
  ]);

  const issues = [
    ...(patternIds.length === 31 ? [] : [`Expected 31 data/domain/mobile patterns, got ${patternIds.length}.`]),
    ...reports.filter((report) => report.status !== "pass").map((report) => `${report.file} is not pass.`),
    ...reports.filter((report) => report.debt !== 0).map((report) => `${report.id} debt is ${report.debt}.`),
    ...familyIssues,
    ...patterns.flatMap((pattern) => pattern.debts.map((debt) => `${pattern.id}: ${debt}`)),
  ];

  return {
    status: issues.length ? "fail" : "pass",
    audit: "system phase 5 data/domain/mobile patterns checkpoint",
    principle: "Data/domain/mobile patterns close only when data visualization, operational domain orchestration, mobile task, channel, and template-facing patterns have formal artifacts, Markdown contracts, TS/JS/d.ts runtime surfaces, governed component/pattern/template dependencies, state/type parity, slot/token governance, no docs/runtime duplication, and zero debt.",
    scope: "Original plan iteration 28: data/domain/mobile patterns. Phase 5 governance remains for iteration 29.",
    inventory: {
      dataDomainMobilePatterns: patterns.length,
      passingDataDomainMobilePatterns: patterns.filter((pattern) => pattern.status === "pass").length,
      families: Object.keys(patternFamilies).length,
      requiredReports: reports.length,
      passingRequiredReports: reports.filter((report) => report.status === "pass").length,
      reportDebt: reports.reduce((total, report) => total + report.debt, 0),
      runtimeFiles: patterns.length * 5,
      runtimeFilesPresent: patterns.reduce((total, pattern) => total + pattern.files.filter((file) => file.exists).length, 0),
      states: patterns.reduce((total, pattern) => total + pattern.states, 0),
      componentDependencies: patterns.reduce((total, pattern) => total + pattern.components, 0),
      patternDependencies: patterns.reduce((total, pattern) => total + pattern.patternDependencies, 0),
      primitiveDependencies: patterns.reduce((total, pattern) => total + pattern.primitiveDependencies, 0),
      foundationDependencies: patterns.reduce((total, pattern) => total + pattern.foundationDependencies, 0),
      callbacks: patterns.reduce((total, pattern) => total + pattern.callbacks, 0),
      testedCallbacks: patterns.reduce((total, pattern) => total + pattern.testedCallbacks, 0),
      slots: patterns.reduce((total, pattern) => total + pattern.slots, 0),
      slotUses: patterns.reduce((total, pattern) => total + pattern.slotUses, 0),
      tokenDependencies: patterns.reduce((total, pattern) => total + pattern.tokenDependencies, 0),
      dataDomainMobilePatternDebt: issues.length,
    },
    families: patternFamilies,
    reports: reports.map(({ id, file, status, debt }) => ({ id, file, status, debt })),
    patterns,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Phase 5 Data/Domain/Mobile Patterns Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Data/domain/mobile patterns: ${report.inventory.passingDataDomainMobilePatterns}/${report.inventory.dataDomainMobilePatterns}`,
    `- Families: ${report.inventory.families}`,
    `- Required reports: ${report.inventory.passingRequiredReports}/${report.inventory.requiredReports}`,
    `- Runtime/contract files: ${report.inventory.runtimeFilesPresent}/${report.inventory.runtimeFiles}`,
    `- States: ${report.inventory.states}`,
    `- Component dependencies: ${report.inventory.componentDependencies}`,
    `- Pattern dependencies: ${report.inventory.patternDependencies}`,
    `- Primitive dependencies: ${report.inventory.primitiveDependencies}`,
    `- Foundation dependencies: ${report.inventory.foundationDependencies}`,
    `- Callbacks tested: ${report.inventory.testedCallbacks}/${report.inventory.callbacks}`,
    `- Slots: ${report.inventory.slots}`,
    `- Slot uses: ${report.inventory.slotUses}`,
    `- Token dependencies: ${report.inventory.tokenDependencies}`,
    `- Data/domain/mobile pattern debt: ${report.inventory.dataDomainMobilePatternDebt}`,
    "",
    "## Families",
    "",
    "| Family | Patterns |",
    "| --- | ---: |",
    ...Object.entries(report.families).map(([family, ids]) => `| ${family} | ${ids.length} |`),
    "",
    "## Patterns",
    "",
    "| Pattern | Family | Status | States | Components | Pattern deps | Callbacks | Slots | Debt |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.patterns.map((pattern) => `| ${pattern.id} | ${pattern.family} | ${pattern.status} | ${pattern.states} | ${pattern.components} | ${pattern.patternDependencies} | ${pattern.testedCallbacks}/${pattern.callbacks} | ${pattern.slots} | ${pattern.debts.length} |`),
    "",
    "## Reports",
    "",
    "| Report | Status | Debt |",
    "| --- | --- | ---: |",
    ...report.reports.map((row) => `| ${row.id} | ${row.status} | ${row.debt} |`),
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
      console.error("Phase 5 data/domain/mobile patterns checkpoint is stale. Run: node packages/audit/scripts/report-system-phase5-data-domain-mobile-patterns-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    dataDomainMobilePatterns: `${report.inventory.passingDataDomainMobilePatterns}/${report.inventory.dataDomainMobilePatterns}`,
    reports: `${report.inventory.passingRequiredReports}/${report.inventory.requiredReports}`,
    callbacks: `${report.inventory.testedCallbacks}/${report.inventory.callbacks}`,
    debt: report.inventory.dataDomainMobilePatternDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
