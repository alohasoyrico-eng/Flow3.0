#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");
const { readPatternArchitecturePolicy } = require("./pattern-architecture-policy.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const auditFile = path.join(outputDir, "pattern-react-migration-audit.json");
const architectureAuditFile = path.join(outputDir, "pattern-1to1-architecture-audit.json");
const foundationPrimitiveAuditFile = path.join(outputDir, "pattern-foundation-primitive-1to1-audit.json");
const jsonOutput = path.join(outputDir, "pattern-react-migration-plan.json");
const markdownOutput = path.join(outputDir, "pattern-react-migration-plan.md");
const patternArchitecturePolicy = readPatternArchitecturePolicy();
const docsAppDir = [
  path.resolve(root, "../../apps/docs"),
  path.resolve(root, "../FlowDocs/apps/docs"),
  path.resolve(root, "apps/docs"),
].find((dir) => fs.existsSync(dir));
const docsReactPatternMigrations = [
  {
    pattern: "timeline",
    demoFile: "pattern-utility-demos.js",
    islandFile: "react-component-islands.js",
    requiredDemoSignals: [
      'data-react-component="${pattern}"',
      'data-component-source="react-pattern"',
      'data-doc-pattern="${pattern}"',
    ],
    forbiddenDemoSignals: [
      "pattern-timeline-demo__filters",
      "pattern-timeline-demo__events",
      "data-timeline-filter",
      "data-timeline-event",
      "data-timeline-count",
      "data-timeline-empty",
    ],
    requiredIslandSignals: [
      'import { Timeline } from "./generated/react/patterns/Timeline.js?v=1";',
      "timeline: Timeline",
      "function TimelineIsland",
      'node.dataset.reactComponent === "timeline"',
    ],
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listCell(values) {
  return values?.length ? values.map((value) => `\`${value}\``).join(", ") : "none";
}

function plainList(values) {
  return values?.length ? values.join(", ") : "-";
}

function signal(value) {
  return value ? "yes" : "no";
}

function slotSummary(slots) {
  if (!slots?.length) return "none";
  return slots
    .map((slot) => {
      const owner = slot.owner ? `${slot.owner}:` : "";
      const uses = slot.uses?.length ? slot.uses.join("+") : "slot";
      const required = slot.required ? " required" : "";
      return `${owner}${slot.name}->${uses}${required}`;
    })
    .join("<br>");
}

function waveRows(rows) {
  const waveLabels = [...patternArchitecturePolicy.migrationWaveLabels.entries()];
  return waveLabels.map(([mode, label]) => {
    const patterns = rows.filter((row) => row.mode === mode).map((row) => row.pattern);
    return `| ${label} | ${patterns.length} | ${listCell(patterns)} |`;
  });
}

function workQueueRows(rows) {
  return rows.map((row) => [
    `- \`${row.pattern}\`: ${row.mode}`,
    `score ${row.score}`,
    `components ${row.components.length}`,
    `primitives ${row.primitives.length}`,
    `foundations ${row.foundations.length}`,
    `pattern deps ${listCell(row.patternDependencies)}`,
    `templates ${listCell(row.templateRefs)}`,
    `React ${row.reactContract?.debts?.length ? "blocked" : "ready"}.`,
  ].join("; "));
}

function doLastRows(rows) {
  const doLast = rows
    .filter((row) => row.mode === "template-facing orchestrator")
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
  return doLast.map((row) => {
    const reasons = [
      ...(row.patternDependencies.length ? [`pattern boundaries: ${listCell(row.patternDependencies)}`] : []),
      ...(row.templateRefs.length ? [`template boundaries: ${listCell(row.templateRefs)}`] : []),
      ...(row.runtimePrimitives.length ? [`runtime primitives: ${listCell(row.runtimePrimitives)}`] : []),
      `score ${row.score}`,
    ];
    return `- \`${row.pattern}\`: ${reasons.join("; ")}.`;
  });
}

function oneToOneRows(rows) {
  return rows.map((row) => [
    `| ${row.order}`,
    `\`${row.pattern}\``,
    row.mode,
    row.score,
    signal(row.requiresSurface),
    plainList(row.runtimePrimitives),
    plainList(row.foundations),
    plainList(row.primitives),
    plainList(row.components),
    plainList(row.patternDependencies),
    plainList(row.templateRefs),
    slotSummary(row.slots),
    plainList(row.states),
    row.reactContract?.debts?.length ? row.reactContract.debts.join("<br>") : "ready",
    "|",
  ].join(" | "));
}

function boundaryOnlyRows(report) {
  return (report.boundaryOnlyPatternDependencies ?? []).map((row) => [
    `| \`${row.pattern}\``,
    row.dependency,
    row.reason,
    row.artifactFile,
    row.reactFile,
    "|",
  ].join(" | "));
}

function sourceMapRows(rows) {
  return rows.map((row) => [
    `| \`${row.pattern}\``,
    row.files?.artifact ?? "-",
    row.files?.react ?? "-",
    row.files?.types ?? "-",
    "|",
  ].join(" | "));
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) => a.localeCompare(b));
}

function waveExecutionPackages(rows) {
  return [...patternArchitecturePolicy.migrationWaveLabels.entries()].map(([mode, label], index) => {
    const wavePatterns = rows.filter((row) => row.mode === mode);
    const patternIds = wavePatterns.map((row) => row.pattern);
    const surfacePatterns = wavePatterns.filter((row) => row.requiresSurface).map((row) => row.pattern);
    const runtimePrimitives = uniqueSorted(wavePatterns.flatMap((row) => row.runtimePrimitives ?? []));
    const patternBoundaries = uniqueSorted(wavePatterns.flatMap((row) => row.patternDependencies ?? []));
    const templateRefs = uniqueSorted(wavePatterns.flatMap((row) => row.templateRefs ?? []));
    const componentRefs = uniqueSorted(wavePatterns.flatMap((row) => row.components ?? []));
    return {
      order: index + 1,
      mode,
      label,
      patterns: patternIds,
      counts: {
        patterns: patternIds.length,
        surfacePatterns: surfacePatterns.length,
        runtimePrimitives: runtimePrimitives.length,
        patternBoundaries: patternBoundaries.length,
        templateRefs: templateRefs.length,
        componentRefs: componentRefs.length,
      },
      surfacePatterns,
      runtimePrimitives,
      patternBoundaries,
      templateRefs,
      componentRefs,
      exitGates: [
        "No React behavior debt in every Pattern in the wave.",
        "No unqualified raw DOM visual wrappers.",
        "No local Docs-owned style or behavior dependency.",
        "Every structural group uses Surface when the formal Pattern contract requires Surface.",
        "Pattern boundaries stay documented unless the formal artifact declares a runtime dependency.",
      ],
    };
  });
}

function waveExecutionRows(rows) {
  return waveExecutionPackages(rows).map((wave) => [
    `| ${wave.order}`,
    wave.label,
    plainList(wave.patterns),
    wave.counts.surfacePatterns,
    plainList(wave.runtimePrimitives),
    plainList(wave.patternBoundaries),
    plainList(wave.templateRefs),
    wave.exitGates.join("<br>"),
    "|",
  ].join(" | "));
}

function patternExecutionChecklist(row) {
  return [
    {
      id: "formal-artifact",
      gate: "Use the formal Pattern artifact as source of truth.",
      evidence: row.files?.artifact ?? "",
    },
    {
      id: "react-primary",
      gate: "Keep React as the primary runtime with forwardRef, typed props, callbacks, states, and density cascade.",
      evidence: row.files?.react ?? "",
    },
    {
      id: "types-contract",
      gate: "Keep the .d.ts contract aligned with formal states, callback props, controlled pairs, and inherited DOM props.",
      evidence: row.files?.types ?? "",
    },
    {
      id: "flow-composition",
      gate: "Compose Flow components and declared primitives instead of local visual DOM or docs-owned styles.",
      evidence: plainList(row.components ?? []),
    },
    ...(row.requiresSurface ? [{
      id: "surface-primitive",
      gate: "Use Surface as the structural grouping primitive; do not substitute Card as a generic wrapper.",
      evidence: "Surface required by formal Pattern primitive dependencies.",
    }] : []),
    ...(row.runtimePrimitives?.length ? [{
      id: "runtime-primitives",
      gate: "Use runtime primitive exports directly only where the formal Pattern requires them.",
      evidence: plainList(row.runtimePrimitives),
    }] : []),
    ...(row.patternDependencies?.length ? [{
      id: "pattern-boundaries",
      gate: "Keep Pattern dependencies as documented boundaries unless the artifact declares runtime composition.",
      evidence: plainList(row.patternDependencies),
    }] : []),
    ...(row.templateRefs?.length ? [{
      id: "template-boundaries",
      gate: "Do not move Pattern behavior into templates; templates may only orchestrate formal Pattern contracts.",
      evidence: plainList(row.templateRefs),
    }] : []),
    {
      id: "docs-system-boundary",
      gate: "Docs may demonstrate the Pattern but must not define core behavior, class roots, or component tokens.",
      evidence: "docs-system-boundary-audit.json",
    },
    {
      id: "verification",
      gate: "Regenerate Pattern audits and run audit-complete before considering the Pattern migrated.",
      evidence: "node packages/audit/scripts/audit-complete.mjs",
    },
  ];
}

function firstWaveChecklistRows(rows) {
  const firstWave = rows.filter((row) => row.mode === "base Flow composition");
  return firstWave.map((row) => [
    `| \`${row.pattern}\``,
    row.files?.react ?? "-",
    row.files?.types ?? "-",
    patternExecutionChecklist(row).map((item) => `${item.id}: ${item.gate}`).join("<br>"),
    "|",
  ].join(" | "));
}

function governedUnusedPrimitiveRows(foundationPrimitiveReport) {
  return (foundationPrimitiveReport.governedUnusedPrimitiveArtifacts ?? []).map((row) => [
    `| \`${row.id}\``,
    row.name,
    row.classification,
    signal(row.directPatternRequired),
    row.reason,
    row.migrationAction,
    "|",
  ].join(" | "));
}

function templateDependencyRows(architectureReport) {
  return (architectureReport.templatePatternDependencies ?? []).map((row) => [
    `| ${row.template}`,
    row.dependency,
    signal(row.formalPatternPresent),
    row.classification,
    "|",
  ].join(" | "));
}

function docsReactPatternDemoRows(rows) {
  return rows.map((row) => [
    `| \`${row.pattern}\``,
    row.status,
    row.docsDemo,
    row.island,
    row.debts.length ? row.debts.join("<br>") : "none",
    "|",
  ].join(" | "));
}

function globalGateLines(architectureReport, foundationPrimitiveReport) {
  return Object.entries(globalGates(architectureReport, foundationPrimitiveReport))
    .map(([key, value]) => `- ${key}: ${value}`);
}

function globalGates(architectureReport, foundationPrimitiveReport) {
  const architecture = architectureReport.inventory ?? {};
  const foundationPrimitive = foundationPrimitiveReport.inventory ?? {};
  return {
    architectureDebt: architecture.patternArchitectureDebt ?? null,
    architectureBlockingDebt: architecture.patternArchitectureBlockingDebt ?? null,
    patternsWithDeclaredPrimitives: architecture.patternsWithDeclaredPrimitives ?? null,
    patternsWithOnlyInferredPrimitives: architecture.patternsWithOnlyInferredPrimitives ?? null,
    templateDependencyGaps: architecture.templatePatternDependencyGaps ?? null,
    surfaceRequiredPatterns: foundationPrimitive.patternsRequiringSurfacePrimitive ?? null,
    directSurfaceRuntimeRequired: foundationPrimitive.patternsRequiringDirectSurfaceRuntime ?? null,
    missingDirectSurfaceRuntime: foundationPrimitive.patternsMissingDirectSurfaceRuntime ?? null,
    structuralSurfaceDebt: foundationPrimitive.patternsWithStructuralSurfaceDebt ?? null,
    cardStructuralWrapperViolations: foundationPrimitive.cardStructuralWrapperViolations ?? null,
    unclassifiedUnusedPrimitiveArtifacts: foundationPrimitive.unclassifiedPrimitiveArtifactsUnusedByPatterns ?? null,
    foundationPrimitiveBlockingDebt: foundationPrimitive.foundationPrimitiveBlockingDebt ?? null,
  };
}

function docsReactPatternDemoCoverage() {
  return docsReactPatternMigrations.map((migration) => {
    const demoFile = path.join(docsAppDir, migration.demoFile);
    const islandFile = path.join(docsAppDir, migration.islandFile);
    const demoSource = fs.existsSync(demoFile) ? fs.readFileSync(demoFile, "utf8") : "";
    const islandSource = fs.existsSync(islandFile) ? fs.readFileSync(islandFile, "utf8") : "";
    const missingDemoSignals = migration.requiredDemoSignals.filter((signalText) => !demoSource.includes(signalText));
    const forbiddenDemoSignals = migration.forbiddenDemoSignals.filter((signalText) => demoSource.includes(signalText));
    const missingIslandSignals = migration.requiredIslandSignals.filter((signalText) => !islandSource.includes(signalText));
    const debts = [
      ...missingDemoSignals.map((signalText) => `missing demo signal: ${signalText}`),
      ...forbiddenDemoSignals.map((signalText) => `forbidden docs-owned timeline signal: ${signalText}`),
      ...missingIslandSignals.map((signalText) => `missing island signal: ${signalText}`),
    ];
    return {
      pattern: migration.pattern,
      status: debts.length ? "fail" : "pass",
      docsDemo: rel(demoFile),
      island: rel(islandFile),
      requiredDemoSignals: migration.requiredDemoSignals,
      forbiddenDemoSignals: migration.forbiddenDemoSignals,
      requiredIslandSignals: migration.requiredIslandSignals,
      debts,
    };
  });
}

function duplicateValues(values) {
  return uniqueSorted(values.filter((value, index) => values.indexOf(value) !== index));
}

function validatePlan(plan) {
  const issues = [];
  const patternIds = plan.patterns.map((pattern) => pattern.id);
  const wavePatternIds = plan.waveExecutionPackages.flatMap((wave) => wave.patterns);
  const requiredBaseChecklist = [
    "formal-artifact",
    "react-primary",
    "types-contract",
    "flow-composition",
    "docs-system-boundary",
    "verification",
  ];
  const duplicatePatterns = duplicateValues(patternIds);
  const duplicateWavePatterns = duplicateValues(wavePatternIds);
  if (duplicatePatterns.length) issues.push(`duplicate plan patterns: ${duplicatePatterns.join(", ")}`);
  if (duplicateWavePatterns.length) issues.push(`duplicate wave patterns: ${duplicateWavePatterns.join(", ")}`);
  const missingFromWaves = patternIds.filter((id) => !wavePatternIds.includes(id)).sort();
  const extraWavePatterns = wavePatternIds.filter((id) => !patternIds.includes(id)).sort();
  if (missingFromWaves.length) issues.push(`patterns missing from wave packages: ${missingFromWaves.join(", ")}`);
  if (extraWavePatterns.length) issues.push(`wave packages reference unknown patterns: ${extraWavePatterns.join(", ")}`);

  for (const wave of plan.waveExecutionPackages) {
    const wavePatterns = plan.patterns.filter((pattern) => pattern.wave === wave.mode);
    const countChecks = {
      patterns: wavePatterns.length,
      surfacePatterns: wavePatterns.filter((pattern) => pattern.requiresSurface).length,
      runtimePrimitives: uniqueSorted(wavePatterns.flatMap((pattern) => pattern.runtimePrimitives)).length,
      patternBoundaries: uniqueSorted(wavePatterns.flatMap((pattern) => pattern.patternDependencies)).length,
      templateRefs: uniqueSorted(wavePatterns.flatMap((pattern) => pattern.templateRefs)).length,
      componentRefs: uniqueSorted(wavePatterns.flatMap((pattern) => pattern.components)).length,
    };
    for (const [key, actual] of Object.entries(countChecks)) {
      if (wave.counts[key] !== actual) {
        issues.push(`wave ${wave.mode} count mismatch for ${key}: expected ${actual}, got ${wave.counts[key]}`);
      }
    }
    if (wave.exitGates.length < 5) {
      issues.push(`wave ${wave.mode} must keep at least five exit gates`);
    }
  }

  for (const pattern of plan.patterns) {
    const checklistIds = pattern.executionChecklist.map((item) => item.id);
    const duplicateChecklistIds = duplicateValues(checklistIds);
    if (duplicateChecklistIds.length) {
      issues.push(`${pattern.id} has duplicate checklist gates: ${duplicateChecklistIds.join(", ")}`);
    }
    for (const gate of requiredBaseChecklist) {
      if (!checklistIds.includes(gate)) {
        issues.push(`${pattern.id} missing required checklist gate: ${gate}`);
      }
    }
    if (pattern.requiresSurface && !checklistIds.includes("surface-primitive")) {
      issues.push(`${pattern.id} requires Surface but lacks surface-primitive checklist gate`);
    }
    if (!pattern.requiresSurface && checklistIds.includes("surface-primitive")) {
      issues.push(`${pattern.id} does not require Surface but includes surface-primitive checklist gate`);
    }
    if (pattern.runtimePrimitives.length && !checklistIds.includes("runtime-primitives")) {
      issues.push(`${pattern.id} uses runtime primitives but lacks runtime-primitives checklist gate`);
    }
    if (pattern.patternDependencies.length && !checklistIds.includes("pattern-boundaries")) {
      issues.push(`${pattern.id} has Pattern dependencies but lacks pattern-boundaries checklist gate`);
    }
    if (pattern.templateRefs.length && !checklistIds.includes("template-boundaries")) {
      issues.push(`${pattern.id} has template refs but lacks template-boundaries checklist gate`);
    }
    if (pattern.executionChecklist.some((item) => /Card as a generic wrapper/i.test(item.gate) && item.id !== "surface-primitive")) {
      issues.push(`${pattern.id} references Card wrapper rules outside the Surface primitive gate`);
    }
  }
  for (const row of plan.docsReactPatternDemoCoverage) {
    if (row.debts.length) {
      issues.push(`${row.pattern} docs React pattern demo coverage failed: ${row.debts.join("; ")}`);
    }
  }
  return issues;
}

function createPlanJson(report, architectureReport, foundationPrimitiveReport) {
  const rows = report.recommendedOrder ?? [];
  const docsCoverage = docsReactPatternDemoCoverage();
  const plan = {
    status: report.status,
    audit: "pattern react migration plan",
    principle: "Pattern migration planning must be machine-readable and sourced from Flow audits so implementation order cannot drift from foundations, primitives, Surface, components, taxonomy, or template boundaries.",
    sourceReports: [
      rel(auditFile),
      rel(architectureAuditFile),
      rel(foundationPrimitiveAuditFile),
    ],
    inventory: report.inventory ?? {},
    globalGates: globalGates(architectureReport, foundationPrimitiveReport),
    migrationWaves: [...patternArchitecturePolicy.migrationWaveLabels.entries()].map(([mode, label]) => ({
      mode,
      label,
      patterns: rows.filter((row) => row.mode === mode).map((row) => row.pattern),
    })),
    waveExecutionPackages: waveExecutionPackages(rows),
    patterns: rows.map((row) => ({
      order: row.order,
      id: row.pattern,
      wave: row.mode,
      score: row.score,
      requiresSurface: Boolean(row.requiresSurface),
      runtimePrimitives: row.runtimePrimitives ?? [],
      foundations: row.foundations ?? [],
      primitives: row.primitives ?? [],
      components: row.components ?? [],
      patternDependencies: row.patternDependencies ?? [],
      templateRefs: row.templateRefs ?? [],
      slots: row.slots ?? [],
      states: row.states ?? [],
      reactStatus: row.reactContract?.debts?.length ? "blocked" : "ready",
      reactDebts: row.reactContract?.debts ?? [],
      executionChecklist: patternExecutionChecklist(row),
      files: row.files ?? {},
    })),
    boundaryOnlyPatternDependencies: report.boundaryOnlyPatternDependencies ?? [],
    templatePatternDependencies: architectureReport.templatePatternDependencies ?? [],
    governedUnusedPrimitives: foundationPrimitiveReport.governedUnusedPrimitiveArtifacts ?? [],
    docsReactPatternDemoCoverage: docsCoverage,
  };
  const validationIssues = validatePlan(plan);
  plan.validationIssues = validationIssues;
  plan.inventory = {
    ...plan.inventory,
    docsReactPatternDemosMigrated: docsCoverage.filter((row) => row.status === "pass").length,
    docsReactPatternDemoCoverageDebt: docsCoverage.flatMap((row) => row.debts).length,
    migrationPlanValidationDebt: validationIssues.length,
  };
  plan.status = plan.status === "pass" && validationIssues.length === 0 ? "pass" : "fail";
  return plan;
}

function toMarkdown(report, architectureReport, foundationPrimitiveReport) {
  const inventory = report.inventory ?? {};
  const rows = report.recommendedOrder ?? [];
  const plan = createPlanJson(report, architectureReport, foundationPrimitiveReport);
  const unusedPrimitiveRows = governedUnusedPrimitiveRows(foundationPrimitiveReport);
  const templateRows = templateDependencyRows(architectureReport);
  const validationIssueRows = plan.validationIssues.map((issue) => `| ${issue} |`);
  return [
    "# Pattern React Migration Plan",
    "",
    "This plan is derived from `pattern-react-migration-audit.json`, `pattern-1to1-architecture-audit.json`, and `pattern-foundation-primitive-1to1-audit.json`. The audits, not docs markup or visual demos, are the source of truth for migration order, dependency boundaries, React readiness, foundations, primitives, components, slots, Surface ownership, and template ownership.",
    "",
    "## Current Baseline",
    "",
    `- Patterns audited: ${inventory.patterns}`,
    `- React pattern sources: ${inventory.reactSources}`,
    `- Type declarations: ${inventory.typeSources}`,
    `- React contract rows: ${inventory.reactContractRows}`,
    `- \`forwardRef\` patterns: ${inventory.forwardRefPatterns}`,
    `- Ref attribute declarations: ${inventory.refAttributePatterns}`,
    `- Density prop declarations: ${inventory.densityPropPatterns}`,
    `- Callback props declared/tested: ${inventory.callbackPropsDeclared}/${inventory.callbackPropsTested}`,
    `- Formal/typed state mismatches: ${inventory.statesMissingFromTypes + inventory.statesMissingFromArtifact}`,
    `- Density cascade issues: ${inventory.densityCascadeIssues}`,
    `- State cascade issues: ${inventory.stateCascadeIssues}`,
    `- Component dependency slot findings: ${inventory.componentDependencySlotCoverageFindings}`,
    `- Runtime pattern dependency slot findings: ${inventory.runtimePatternDependencySlotCoverageFindings}`,
    `- Patterns with boundary-only pattern dependencies: ${inventory.boundaryOnlyPatternDependencyPatterns}`,
    `- Boundary-only pattern dependencies: ${inventory.boundaryOnlyPatternDependencies}`,
    `- Migration baseline mismatches: ${(report.baseline?.mismatches ?? []).length}`,
    `- Unexpected migration inventory metrics: ${(report.baseline?.unexpectedInventoryMetrics ?? []).length}`,
    `- React behavior debt: ${inventory.reactBehaviorDebt}`,
    `- Migration audit debt: ${inventory.migrationAuditDebt}`,
    `- Docs React Pattern demos migrated: ${plan.inventory.docsReactPatternDemosMigrated}`,
    `- Docs React Pattern demo coverage debt: ${plan.inventory.docsReactPatternDemoCoverageDebt}`,
    `- Migration plan validation debt: ${plan.inventory.migrationPlanValidationDebt}`,
    "",
    "## Plan Validation",
    "",
    "| Issue |",
    "| --- |",
    ...(validationIssueRows.length ? validationIssueRows : ["| None |"]),
    "",
    "## Global Migration Gates",
    "",
    ...globalGateLines(architectureReport, foundationPrimitiveReport),
    "",
    "## Non-Negotiable Migration Rules",
    "",
    ...patternArchitecturePolicy.nonNegotiableMigrationRules.map((rule) => `- ${rule}`),
    "",
    "## Migration Waves",
    "",
    "| Wave | Count | Pattern order |",
    "| --- | ---: | --- |",
    ...waveRows(rows),
    "",
    "## Wave Execution Packages",
    "",
    "Each package is the smallest governed execution batch. The gates are intentionally repeated per wave so implementation work cannot skip Surface, Docs/System, or Pattern-boundary checks.",
    "",
    "| Order | Wave | Patterns | Surface Count | Runtime Primitives | Pattern Boundaries | Templates | Exit Gates |",
    "| ---: | --- | --- | ---: | --- | --- | --- | --- |",
    ...waveExecutionRows(rows),
    "",
    "## First Wave Execution Checklist",
    "",
    "Wave 1 is the intended starting slice because it has no Surface runtime pressure and no runtime primitive ownership work. These rows are still required to pass the same Flow composition and Docs/System gates as the rest of the system.",
    "",
    "| Pattern | React Source | Types | Checklist |",
    "| --- | --- | --- | --- |",
    ...firstWaveChecklistRows(rows),
    "",
    "## Docs React Pattern Demo Coverage",
    "",
    "This gate covers patterns whose FlowDocs demos have been migrated from local visual DOM into generated React Pattern islands. A row must not keep docs-owned substructure for the migrated Pattern.",
    "",
    "| Pattern | Status | Docs Demo | Island Runtime | Debt |",
    "| --- | --- | --- | --- | --- |",
    ...docsReactPatternDemoRows(plan.docsReactPatternDemoCoverage),
    "",
    "## Pattern Work Queue",
    "",
    ...workQueueRows(rows),
    "",
    "## 1:1 Migration Matrix",
    "",
    "This table keeps migration planning anchored to Flow ownership. Surface is treated as a primitive dependency; Card is only a component dependency when the formal Pattern contract declares it.",
    "",
    "| Order | Pattern | Wave | Score | Surface | Runtime Primitives | Foundations | Primitives | Components | Pattern Boundaries | Templates | Slots | States | React Status |",
    "| ---: | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...oneToOneRows(rows),
    "",
    "## Boundary-Only Pattern Dependencies",
    "",
    "These are documented Pattern boundaries, not runtime imports. They should stay explicit so migration work does not accidentally convert a boundary into duplicated UI composition.",
    "",
    "| Pattern | Boundary | Reason | Artifact | React Source |",
    "| --- | --- | --- | --- | --- |",
    ...(boundaryOnlyRows(report).length ? boundaryOnlyRows(report) : ["| None | None | None | None | None |"]),
    "",
    "## Template Pattern Dependencies",
    "",
    "Template references are migration pressure, not permission to move Pattern behavior into templates. A Pattern should only migrate after its template dependencies remain formal and zero-gap.",
    "",
    "| Template | Pattern Dependency | Formal Pattern Present | Classification |",
    "| --- | --- | --- | --- |",
    ...(templateRows.length ? templateRows : ["| None | None | None | None |"]),
    "",
    "## Governed Unused Primitives",
    "",
    "Unused primitives are allowed only when governance says they are coordination or asset primitives. They are not backlog for fake Pattern usage.",
    "",
    "| Primitive | Name | Classification | Direct Pattern Required | Reason | Migration Action |",
    "| --- | --- | --- | --- | --- | --- |",
    ...(unusedPrimitiveRows.length ? unusedPrimitiveRows : ["| None | None | None | None | None | None |"]),
    "",
    "## Source Map",
    "",
    "| Pattern | Formal Artifact | React Source | Types |",
    "| --- | --- | --- | --- |",
    ...sourceMapRows(rows),
    "",
    "## Do Last",
    "",
    ...doLastRows(rows),
    "",
  ].join("\n");
}

function createPlan() {
  if (!fs.existsSync(auditFile)) {
    throw new Error("Pattern React migration audit is missing. Run: node packages/audit/scripts/report-pattern-react-migration-audit.js");
  }
  if (!fs.existsSync(architectureAuditFile)) {
    throw new Error("Pattern 1:1 architecture audit is missing. Run: node packages/audit/scripts/report-pattern-1to1-architecture.js");
  }
  if (!fs.existsSync(foundationPrimitiveAuditFile)) {
    throw new Error("Pattern foundation primitive 1:1 audit is missing. Run: node packages/audit/scripts/report-pattern-foundation-primitive-1to1.js");
  }
  const report = readJson(auditFile);
  const architectureReport = readJson(architectureAuditFile);
  const foundationPrimitiveReport = readJson(foundationPrimitiveAuditFile);
  return {
    json: createPlanJson(report, architectureReport, foundationPrimitiveReport),
    markdown: toMarkdown(report, architectureReport, foundationPrimitiveReport),
  };
}

function writePlan(plan) {
  fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(plan.json, null, 2)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== json || currentMarkdown !== plan.markdown) {
      throw new Error("Pattern React migration plan is stale. Run: node packages/audit/scripts/report-pattern-react-migration-plan.js");
    }
    return;
  }
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, plan.markdown);
}

try {
  const plan = createPlan();
  writePlan(plan);
  if (plan.json.status !== "pass") {
    throw new Error(`Pattern React migration plan failed validation: ${plan.json.validationIssues.join("; ") || "unknown issue"}`);
  }
  console.log(JSON.stringify({
    status: plan.json.status,
    migrationPlanValidationDebt: plan.json.inventory.migrationPlanValidationDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
