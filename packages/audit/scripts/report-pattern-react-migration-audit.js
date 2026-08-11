#!/usr/bin/env node

const {
  fs,
  path,
  patternArtifacts: patternArtifactIds,
  rel,
  root,
} = require("./audit-context.js");
const { readPatternArchitecturePolicy } = require("./pattern-architecture-policy.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "pattern-react-migration-audit.json");
const markdownOutput = path.join(outputDir, "pattern-react-migration-audit.md");
const patternArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const reactPatternDir = path.join(root, "packages/react/src/patterns");
const templateBlueprintsFile = path.join(root, "packages/content/content/template-blueprints.json");
const behaviorAuditFile = path.join(outputDir, "react-pattern-behavior-governance-audit.json");
const patternArchitecturePolicy = readPatternArchitecturePolicy();
const {
  runtimePrimitivePatternDependencies: runtimePrimitiveNames,
  templateFacingSignals,
  migrationWaveLabels,
  migrationClassificationPolicy,
  nonNegotiableMigrationRules,
  migrationExpectedInventory: expectedInventory,
  emailChannelPatternIds,
} = patternArchitecturePolicy;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function mergeContentJson(base, next) {
  const merged = { ...base, ...next };
  for (const [key, value] of Object.entries(next)) {
    if (Array.isArray(value)) {
      merged[key] = [
        ...(Array.isArray(base[key]) ? base[key] : []),
        ...value,
      ];
    } else if (
      value
      && typeof value === "object"
      && !Array.isArray(value)
      && base[key]
      && typeof base[key] === "object"
      && !Array.isArray(base[key])
    ) {
      merged[key] = {
        ...base[key],
        ...value,
      };
    }
  }
  return merged;
}

function readContentJson(file) {
  const raw = readJson(file);
  if (!Array.isArray(raw.$systemShards)) return raw;
  const { $systemShards, ...manifest } = raw;
  return $systemShards.reduce((merged, shard) => {
    const shardFile = path.join(path.dirname(file), shard);
    return mergeContentJson(merged, readContentJson(shardFile));
  }, manifest);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function pascalCase(value) {
  return slug(value)
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")
    .replace(/^Kpi$/, "Kpi");
}

function patternArtifacts() {
  return patternArtifactIds
    .map((id) => {
      const fullPath = path.join(patternArtifactDir, `${id}.json`);
      const data = readJson(fullPath);
      return {
        id,
        file: fullPath,
        artifact: data.artifacts?.patterns?.[id] ?? {},
      };
    });
}

function templateReferenceMap() {
  if (!fs.existsSync(templateBlueprintsFile)) return new Map();
  const blueprints = readContentJson(templateBlueprintsFile).templates ?? {};
  const refs = new Map();
  for (const [templateName, template] of Object.entries(blueprints)) {
    for (const patternName of Object.keys(template.patternDetails ?? {})) {
      const id = slug(patternName.replace(/, Login,/, " Login"));
      if (!refs.has(id)) refs.set(id, []);
      refs.get(id).push(templateName);
    }
  }
  return refs;
}

function behaviorAuditByPattern() {
  if (!fs.existsSync(behaviorAuditFile)) {
    return {
      inventory: {},
      patterns: new Map(),
      missing: true,
    };
  }
  const report = readJson(behaviorAuditFile);
  return {
    inventory: report.inventory ?? {},
    patterns: new Map((report.patterns ?? []).map((pattern) => [pattern.patternId, pattern])),
    missing: false,
  };
}

function classify(row) {
  if (row.templateRefs.length || templateFacingSignals.some((signal) => row.id.includes(signal))) {
    return migrationClassificationPolicy.templateFacingMode;
  }
  if (row.runtimePrimitives.length) return migrationClassificationPolicy.primitiveRuntimeMode;
  if (row.patternDependencies.length >= migrationClassificationPolicy.patternDependencyCrossPatternMin) {
    return migrationClassificationPolicy.crossPatternMode;
  }
  if (
    row.stateCount >= migrationClassificationPolicy.statefulStateMin
    || (migrationClassificationPolicy.statefulRequiresSurface && row.requiresSurface)
    || migrationClassificationPolicy.statefulPrimitiveDependencies.some((primitive) => row.primitiveDependencies.includes(primitive))
  ) {
    return migrationClassificationPolicy.statefulMode;
  }
  return migrationClassificationPolicy.baseMode;
}

function migrationScore(row) {
  const scoreWeights = migrationClassificationPolicy.scoreWeights;
  return row.componentCount
    + row.stateCount
    + (row.primitiveCount > scoreWeights.primitiveCountHighThreshold ? scoreWeights.primitiveCountHighWeight : 0)
    + (row.requiresSurface ? scoreWeights.surfaceRequired : 0)
    + (row.runtimePrimitives.length * scoreWeights.runtimePrimitive)
    + (row.patternDependencies.length * scoreWeights.patternDependency)
    + (row.templateRefs.length * scoreWeights.templateReference);
}

function localPatternImports(sourceFile) {
  if (!fs.existsSync(sourceFile)) return new Set();
  const source = fs.readFileSync(sourceFile, "utf8");
  return new Set([...source.matchAll(/import \{ ([^}]+) \} from "\.\/([^".]+)\.js"/g)]
    .flatMap((match) => match[1]
      .split(",")
      .map((name) => name.trim().split(/\s+as\s+/).pop())
      .filter(Boolean)));
}

function slotCoverageFindings(artifact, sourceFile) {
  const slotUses = new Set((artifact.slots ?? [])
    .flatMap((slot) => slot.uses ?? [])
    .map(slug));
  const imports = localPatternImports(sourceFile);
  const missingPatternSlots = (artifact.patternDependencies ?? [])
    .filter((name) => !slotUses.has(slug(name)))
    .sort();
  return {
    missingComponentSlots: (artifact.componentDependencies ?? [])
      .filter((name) => !slotUses.has(slug(name)))
      .sort(),
    missingRuntimePatternSlots: missingPatternSlots
      .filter((name) => imports.has(pascalCase(name)))
      .sort(),
    boundaryOnlyPatternDependencies: missingPatternSlots
      .filter((name) => !imports.has(pascalCase(name)))
      .sort(),
  };
}

function createReport() {
  const templateRefsByPattern = templateReferenceMap();
  const behaviorAudit = behaviorAuditByPattern();
  const rows = patternArtifacts().map(({ id, file, artifact }) => {
    const componentName = pascalCase(id);
    const sourceFile = path.join(reactPatternDir, `${componentName}.js`);
    const typeFile = path.join(reactPatternDir, `${componentName}.d.ts`);
    const primitiveDependencies = artifact.primitiveDependencies ?? [];
    const componentDependencies = artifact.componentDependencies ?? [];
    const patternDependencies = artifact.patternDependencies ?? [];
    const foundationDependencies = artifact.foundationDependencies ?? artifact.governingFoundations ?? [];
    const slots = artifact.slots ?? [];
    const coverageFindings = slotCoverageFindings(artifact, sourceFile);
    const behavior = behaviorAudit.patterns.get(id) ?? null;
    const row = {
      id,
      artifactFile: rel(file),
      reactFile: rel(sourceFile),
      typeFile: rel(typeFile),
      hasReactSource: fs.existsSync(sourceFile),
      hasTypeSource: fs.existsSync(typeFile),
      foundationDependencies,
      primitiveDependencies,
      componentDependencies,
      patternDependencies,
      templateRefs: templateRefsByPattern.get(id) ?? [],
      slots,
      states: artifact.states ?? [],
      requiresSurface: primitiveDependencies.includes("Surface") || slots.some((slot) => (slot.uses ?? []).includes("Surface")),
      runtimePrimitives: primitiveDependencies.filter((primitive) => runtimePrimitiveNames.has(primitive)),
      componentCount: componentDependencies.length,
      primitiveCount: primitiveDependencies.length,
      foundationCount: foundationDependencies.length,
      stateCount: (artifact.states ?? []).length,
      slotCount: slots.length,
      reactContract: behavior ? {
        hasForwardRef: behavior.hasForwardRef,
        hasRefAttributes: behavior.hasRefAttributes,
        hasDensityProp: behavior.hasDensityProp,
        callbacks: behavior.callbacks ?? [],
        testedCallbacks: behavior.testedCallbacks ?? [],
        missingCallbackTests: behavior.missingCallbackTests ?? [],
        controlledIssues: behavior.controlledIssues ?? [],
        formalStates: behavior.formalStates ?? [],
        typedStates: behavior.typedStates ?? [],
        statesMissingFromTypes: behavior.statesMissingFromTypes ?? [],
        statesMissingFromArtifact: behavior.statesMissingFromArtifact ?? [],
        densityCascadeIssues: behavior.densityCascadeIssues ?? [],
        stateCascadeIssues: behavior.stateCascadeIssues ?? [],
        propContractIssues: behavior.propContractIssues ?? [],
        literalContractIssues: behavior.literalContractIssues ?? [],
        missingAccessibilityImplementation: behavior.missingAccessibilityImplementation,
        structuralSurfaceSlots: behavior.structuralSurfaceSlots ?? [],
        missingSurfaceSlotMarkers: behavior.missingSurfaceSlotMarkers ?? [],
        missingStructuralSurfaceUsage: behavior.missingStructuralSurfaceUsage,
        unsafeRestSpread: behavior.hasUnsafeRestSpread,
        rawGlobalDomRefs: behavior.rawGlobalDomRefs ?? [],
        debts: behavior.debts ?? [],
      } : null,
      ...coverageFindings,
    };
    row.migrationMode = classify(row);
    row.migrationScore = migrationScore(row);
    row.blockers = [
      ...(!row.hasReactSource ? ["missing React pattern source"] : []),
      ...(!row.hasTypeSource ? ["missing React pattern types"] : []),
      ...(!row.foundationDependencies.length ? ["missing foundation dependencies"] : []),
      ...(!row.primitiveDependencies.length ? ["missing primitive dependencies"] : []),
      ...(!row.componentDependencies.length && !emailChannelPatternIds.has(row.id) ? ["missing component dependencies"] : []),
      ...(!row.states.length ? ["missing formal state model"] : []),
      ...(!row.slots.length ? ["missing formal slots"] : []),
      ...(behaviorAudit.missing ? ["missing react pattern behavior audit"] : []),
      ...(!behavior ? ["missing react behavior contract row"] : []),
      ...(behavior?.debts ?? []).map((debt) => `react behavior debt: ${debt}`),
    ];
    return row;
  }).sort((a, b) => a.migrationScore - b.migrationScore || a.id.localeCompare(b.id));

  const boundaryOnlyPatternDependencyPatterns = new Set(rows
    .filter((row) => row.boundaryOnlyPatternDependencies.length)
    .map((row) => row.id));
  const inventory = {
    patterns: rows.length,
    patternArchitecturePolicyIssues: patternArchitecturePolicy.issues.length,
    runtimePrimitivePatternDependencyPolicy: runtimePrimitiveNames.size,
    templateFacingSignalPolicy: templateFacingSignals.length,
    migrationWavePolicy: migrationWaveLabels.size,
    nonNegotiableMigrationRules: nonNegotiableMigrationRules.length,
    reactSources: rows.filter((row) => row.hasReactSource).length,
    typeSources: rows.filter((row) => row.hasTypeSource).length,
    reactContractRows: rows.filter((row) => row.reactContract).length,
    forwardRefPatterns: rows.filter((row) => row.reactContract?.hasForwardRef).length,
    refAttributePatterns: rows.filter((row) => row.reactContract?.hasRefAttributes).length,
    densityPropPatterns: rows.filter((row) => row.reactContract?.hasDensityProp).length,
    patternsWithSlots: rows.filter((row) => row.slotCount > 0).length,
    patternsWithFoundations: rows.filter((row) => row.foundationCount > 0).length,
    patternsWithPrimitives: rows.filter((row) => row.primitiveCount > 0).length,
    patternsWithComponents: rows.filter((row) => row.componentCount > 0).length,
    patternsWithStateModel: rows.filter((row) => row.stateCount > 0).length,
    callbackPropsDeclared: rows.reduce((total, row) => total + (row.reactContract?.callbacks.length ?? 0), 0),
    callbackPropsTested: rows.reduce((total, row) => total + (row.reactContract?.testedCallbacks.length ?? 0), 0),
    missingCallbackTests: rows.reduce((total, row) => total + (row.reactContract?.missingCallbackTests.length ?? 0), 0),
    controlledPairIssues: rows.reduce((total, row) => total + (row.reactContract?.controlledIssues.length ?? 0), 0),
    statesMissingFromTypes: rows.reduce((total, row) => total + (row.reactContract?.statesMissingFromTypes.length ?? 0), 0),
    statesMissingFromArtifact: rows.reduce((total, row) => total + (row.reactContract?.statesMissingFromArtifact.length ?? 0), 0),
    densityCascadeIssues: rows.reduce((total, row) => total + (row.reactContract?.densityCascadeIssues.length ?? 0), 0),
    stateCascadeIssues: rows.reduce((total, row) => total + (row.reactContract?.stateCascadeIssues.length ?? 0), 0),
    propContractIssues: rows.reduce((total, row) => total + (row.reactContract?.propContractIssues.length ?? 0), 0),
    literalContractIssues: rows.reduce((total, row) => total + (row.reactContract?.literalContractIssues.length ?? 0), 0),
    missingAccessibilityImplementation: rows.filter((row) => row.reactContract?.missingAccessibilityImplementation).length,
    missingSurfaceSlotMarkers: rows.reduce((total, row) => total + (row.reactContract?.missingSurfaceSlotMarkers.length ?? 0), 0),
    missingStructuralSurfaceUsage: rows.filter((row) => row.reactContract?.missingStructuralSurfaceUsage).length,
    unsafeRestSpreads: rows.filter((row) => row.reactContract?.unsafeRestSpread).length,
    rawGlobalDomRefs: rows.reduce((total, row) => total + (row.reactContract?.rawGlobalDomRefs.length ?? 0), 0),
    reactBehaviorDebt: behaviorAudit.inventory.reactPatternBehaviorDebt ?? (behaviorAudit.missing ? 1 : 0),
    baseFlowComposition: rows.filter((row) => row.migrationMode === "base Flow composition").length,
    statefulFlowComposition: rows.filter((row) => row.migrationMode === "stateful Flow composition").length,
    crossPatternComposition: rows.filter((row) => row.migrationMode === "cross-pattern composition").length,
    primitiveRuntimeComposition: rows.filter((row) => row.migrationMode === "primitive-runtime composition").length,
    templateFacingOrchestrators: rows.filter((row) => row.migrationMode === "template-facing orchestrator").length,
    surfaceRequired: rows.filter((row) => row.requiresSurface).length,
    primitiveRuntimeRequired: rows.filter((row) => row.runtimePrimitives.length).length,
    patternDependencyBoundaries: rows.reduce((total, row) => total + row.patternDependencies.length, 0),
    templateReferences: rows.reduce((total, row) => total + row.templateRefs.length, 0),
    patternsWithDependencySlotCoverageFindings: rows
      .filter((row) => row.missingComponentSlots.length || row.missingRuntimePatternSlots.length).length,
    componentDependencySlotCoverageFindings: rows
      .reduce((total, row) => total + row.missingComponentSlots.length, 0),
    runtimePatternDependencySlotCoverageFindings: rows
      .reduce((total, row) => total + row.missingRuntimePatternSlots.length, 0),
    boundaryOnlyPatternDependencyPatterns: boundaryOnlyPatternDependencyPatterns.size,
    boundaryOnlyPatternDependencies: rows
      .reduce((total, row) => total + row.boundaryOnlyPatternDependencies.length, 0),
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "migrationAuditDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  const blockers = rows.flatMap((row) => row.blockers.map((blocker) => ({ pattern: row.id, blocker })));
  inventory.migrationAuditDebt = blockers.length
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length
    + patternArchitecturePolicy.issues.length;

  return {
    status: inventory.migrationAuditDebt ? "fail" : "pass",
    audit: "pattern react migration audit",
    principle: "Pattern React migration must start from formal Flow artifacts, preserve foundation and primitive ownership, and classify composition complexity before implementation work begins.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    patternArchitecturePolicy: {
      file: rel(patternArchitecturePolicy.file),
      issues: patternArchitecturePolicy.issues,
      migrationExpectedInventoryMetrics: Object.keys(expectedInventory).length,
    },
    blockers,
    boundaryOnlyPatternDependencies: rows.flatMap((row) => row.boundaryOnlyPatternDependencies.map((dependency) => ({
      pattern: row.id,
      dependency,
      reason: `${row.id} declares ${dependency} as a documented boundary, but React does not import it at runtime.`,
      artifactFile: row.artifactFile,
      reactFile: row.reactFile,
    }))),
    recommendedOrder: rows.map((row, index) => ({
      order: index + 1,
      pattern: row.id,
      mode: row.migrationMode,
      score: row.migrationScore,
      components: row.componentDependencies,
      primitives: row.primitiveDependencies,
      foundations: row.foundationDependencies,
      patternDependencies: row.patternDependencies,
      templateRefs: row.templateRefs,
      slots: row.slots.map((slot) => ({
        name: slot.name,
        owner: slot.owner,
        uses: slot.uses ?? [],
        required: slot.required,
      })),
      slotCoverageFindings: {
        missingComponentSlots: row.missingComponentSlots,
        missingRuntimePatternSlots: row.missingRuntimePatternSlots,
        boundaryOnlyPatternDependencies: row.boundaryOnlyPatternDependencies,
      },
      reactContract: row.reactContract,
      runtimePrimitives: row.runtimePrimitives,
      requiresSurface: row.requiresSurface,
      states: row.states,
      files: {
        artifact: row.artifactFile,
        react: row.reactFile,
        types: row.typeFile,
      },
    })),
  };
}

function listCell(values) {
  return values?.length ? values.map((value) => `\`${value}\``).join(", ") : "None";
}

function slotCell(slots) {
  return slots?.length
    ? slots.map((slot) => `\`${slot.name}\`:${slot.owner}->${(slot.uses ?? []).join("+")}`).join("<br>")
    : "None";
}

function countCell(values) {
  return values?.length ? `${values.length}: ${listCell(values)}` : "0: None";
}

function reactReadinessCell(contract) {
  if (!contract) return "Missing";
  const issues = [
    ...(!contract.hasForwardRef ? ["no forwardRef"] : []),
    ...(!contract.hasRefAttributes ? ["no RefAttributes"] : []),
    ...(!contract.hasDensityProp ? ["no density prop"] : []),
    ...(contract.missingCallbackTests ?? []).map((item) => `untested ${item}`),
    ...(contract.controlledIssues ?? []),
    ...(contract.statesMissingFromTypes ?? []).map((item) => `state not typed: ${item}`),
    ...(contract.statesMissingFromArtifact ?? []).map((item) => `state not formal: ${item}`),
    ...(contract.densityCascadeIssues ?? []),
    ...(contract.stateCascadeIssues ?? []),
    ...(contract.propContractIssues ?? []),
    ...(contract.literalContractIssues ?? []),
    ...(contract.missingAccessibilityImplementation ? ["missing a11y implementation"] : []),
    ...(contract.missingSurfaceSlotMarkers ?? []).map((item) => `Surface marker missing: ${item}`),
    ...(contract.missingStructuralSurfaceUsage ? ["missing Surface primitive usage"] : []),
    ...(contract.unsafeRestSpread ? ["unsafe rest spread"] : []),
    ...(contract.rawGlobalDomRefs ?? []).map((item) => `browser global: ${item}`),
  ];
  return issues.length ? issues.join("<br>") : "Ready";
}

function reactContractRows(rows) {
  return rows.map((row) => {
    const contract = row.reactContract;
    return `| \`${row.pattern}\` | ${contract?.hasForwardRef ? "yes" : "no"} | ${contract?.hasRefAttributes ? "yes" : "no"} | ${contract?.hasDensityProp ? "yes" : "no"} | ${contract ? `${contract.testedCallbacks.length}/${contract.callbacks.length}` : "0/0"} | ${contract ? `${contract.typedStates.length}/${contract.formalStates.length}` : "0/0"} | ${(contract?.structuralSurfaceSlots ?? []).join(", ") || "None"} | ${reactReadinessCell(contract)} |`;
  });
}

function dependencyRows(rows) {
  return rows.map((row) => `| \`${row.pattern}\` | ${row.mode} | ${countCell(row.foundations)} | ${countCell(row.primitives)} | ${countCell(row.components)} | ${countCell(row.patternDependencies)} | ${countCell(row.templateRefs)} | ${countCell(row.states)} | ${slotCell(row.slots)} |`);
}

function waveRows(rows) {
  const waveLabels = [...migrationWaveLabels.entries()];
  return waveLabels.map(([mode, label]) => {
    const patterns = rows.filter((row) => row.mode === mode).map((row) => row.pattern);
    return `| ${label} | ${patterns.length} | ${listCell(patterns)} |`;
  });
}

function toMarkdown(report) {
  const inventoryLines = Object.entries(report.inventory)
    .map(([key, value]) => `- ${key}: ${value}`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const blockerRows = report.blockers.map((item) => `| \`${item.pattern}\` | ${item.blocker} |`);
  const boundaryOnlyRows = report.boundaryOnlyPatternDependencies
    .map((item) => `| \`${item.pattern}\` | \`${item.dependency}\` | ${item.reason} | \`${item.artifactFile}\` |`);
  const orderRows = report.recommendedOrder.map((row) => `| ${row.order} | \`${row.pattern}\` | ${row.mode} | ${row.score} | ${listCell(row.patternDependencies)} | ${listCell(row.templateRefs)} | ${listCell(row.runtimePrimitives)} | ${row.requiresSurface ? "Yes" : "No"} | ${slotCell(row.slots)} | ${reactReadinessCell(row.reactContract)} | ${listCell([...(row.slotCoverageFindings?.missingComponentSlots ?? []), ...(row.slotCoverageFindings?.missingRuntimePatternSlots ?? [])])} | ${listCell(row.slotCoverageFindings?.boundaryOnlyPatternDependencies ?? [])} |`);
  return [
    "# Pattern React Migration Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...inventoryLines,
    "",
    "## Governance Source",
    "",
    `- Architecture policy: ${report.patternArchitecturePolicy.file}`,
    `- Migration baseline metrics: ${report.patternArchitecturePolicy.migrationExpectedInventoryMetrics}`,
    `- Policy issues: ${report.patternArchitecturePolicy.issues.length}`,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(mismatchRows.length ? mismatchRows : ["| None | None | None |"]),
    "",
    "## Unexpected Inventory Metrics",
    "",
    "Every migration inventory metric must be declared in the runtime policy baseline before the audit can pass.",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None |"]),
    "",
    "## Blockers",
    "",
    "| Pattern | Blocker |",
    "| --- | --- |",
    ...(blockerRows.length ? blockerRows : ["| None | None |"]),
    "",
    "## Boundary-Only Pattern Dependencies",
    "",
    "These dependencies are contract boundaries, not runtime slots. React should not import them unless the pattern actually composes that behavior.",
    "",
    "| Pattern | Dependency | Reason | Artifact |",
    "| --- | --- | --- | --- |",
    ...(boundaryOnlyRows.length ? boundaryOnlyRows : ["| None | None | None | None |"]),
    "",
    "## Formal Dependency Matrix",
    "",
    "This is the 1:1 map used before changing React. Foundations define governing behavior, primitives define reusable substrate, components define rendered Flow parts, pattern dependencies define crossings, and templates define product ownership boundaries.",
    "",
    "| Pattern | Mode | Foundations | Primitives | Components | Pattern deps | Template refs | States | Slots |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...dependencyRows(report.recommendedOrder),
    "",
    "## React Contract Readiness",
    "",
    "This matrix is sourced from React pattern behavior governance. Migration is blocked when refs, typed props, callback wiring, controlled pairs, state unions, accessibility, density/state cascade, or Surface primitive ownership regress.",
    "",
    "| Pattern | forwardRef | RefAttributes | Density prop | Callback tests | Typed/formal states | Surface slots | Readiness |",
    "| --- | --- | --- | --- | ---: | ---: | --- | --- |",
    ...reactContractRows(report.recommendedOrder),
    "",
    "## Migration Waves",
    "",
    "| Wave | Count | Patterns |",
    "| --- | ---: | --- |",
    ...waveRows(report.recommendedOrder),
    "",
    "## Recommended Migration Order",
    "",
    "| # | Pattern | Mode | Score | Pattern deps | Template refs | Runtime primitives | Surface | Slots | React readiness | Slot coverage findings | Boundary-only deps |",
    "| ---: | --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...orderRows,
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = toMarkdown(report);
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== json || currentMarkdown !== markdown) {
      throw new Error("Pattern React migration audit is stale. Run: node packages/audit/scripts/report-pattern-react-migration-audit.js");
    }
    if (report.status !== "pass") {
      throw new Error(`Pattern React migration audit has ${report.inventory.migrationAuditDebt} debt.`);
    }
    return;
  }
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
}

try {
  const report = createReport();
  writeReport(report);
  console.log(JSON.stringify({
    status: report.status,
    patterns: report.inventory.patterns,
    migrationAuditDebt: report.inventory.migrationAuditDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
