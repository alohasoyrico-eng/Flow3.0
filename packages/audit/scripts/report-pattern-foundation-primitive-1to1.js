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
const jsonOutput = path.join(outputDir, "pattern-foundation-primitive-1to1-audit.json");
const markdownOutput = path.join(outputDir, "pattern-foundation-primitive-1to1-audit.md");
const patternDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const foundationDir = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations");
const reactPatternDir = path.join(root, "packages/react/src/patterns");
const platformDir = path.join(root, "packages/components/src/platforms");
const primitiveContractDir = path.join(root, "packages/content/content/primitive-contracts/primitives");
const foundationContractDir = path.join(root, "packages/content/content/foundation-contracts/foundations");
const componentsIndexFile = path.join(root, "packages/components/src/index.js");
const tokensFile = path.join(root, "packages/tokens/tokens.json");
const foundationPrimitiveExportReport = path.join(outputDir, "foundation-primitive-export-contract-audit.json");
const patternBacklogFile = path.join(root, "packages/content/content/pattern-backlog.json");
const templateBlueprintsFile = path.join(root, "packages/content/content/template-blueprints.json");
const taxonomyBoundariesFile = path.join(root, "packages/content/content/taxonomy-boundaries.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

const patternArchitecturePolicy = readPatternArchitecturePolicy();
const {
  structuralSlotNames,
  structuralSurfacePrimitive,
  componentSurfaceOwners,
  componentObjectSurfaces,
  structuralSurfaceExemptComponents,
  allowedPatternDomRoots,
  emailChannelPatternIds,
  emailChannelAllowedTags,
  knownAliasNames,
  primitiveRuntimeExports,
  primitiveTemplateNeedles,
  taxonomySignals,
  taxonomyRequiredLayerChecks,
  approvedCrossLayerArtifactIds,
  unusedPrimitiveClassifications,
  foundationPrimitiveDebtWeights,
  foundationPrimitiveExpectedInventory: expectedInventory,
} = patternArchitecturePolicy;

function titleFromId(id) {
  return id.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function reactComponentName(name) {
  return slug(name)
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function artifactNameSet(dir, kind) {
  const rows = new Map();
  if (!fs.existsSync(dir)) return rows;
  for (const file of fs.readdirSync(dir).filter((item) => item.endsWith(".json"))) {
    const id = file.replace(/\.json$/, "");
    const data = readJson(path.join(dir, file));
    const record = data.artifacts?.[kind]?.[id] ?? data;
    const names = unique([id, record.name, titleFromId(id), knownAliasNames.get(record.name), knownAliasNames.get(titleFromId(id))]);
    for (const name of names) rows.set(slug(name), { id, name });
  }
  return rows;
}

function artifactRecords(dir, kind) {
  const rows = new Map();
  if (!fs.existsSync(dir)) return rows;
  for (const file of fs.readdirSync(dir).filter((item) => item.endsWith(".json"))) {
    const id = file.replace(/\.json$/, "");
    const data = readJson(path.join(dir, file));
    const record = data.artifacts?.[kind]?.[id] ?? data;
    rows.set(id, {
      id,
      name: record.name ?? titleFromId(id),
      file: rel(path.join(dir, file)),
      raw: record,
    });
  }
  return rows;
}

function readMaybe(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function platformContractFor(componentName) {
  const id = slug(knownAliasNames.get(componentName) ?? componentName);
  const file = path.join(platformDir, `${id}.js`);
  if (!fs.existsSync(file)) {
    return {
      id,
      exists: false,
      file: rel(file),
      foundations: [],
      primitives: [],
      tokens: [],
    };
  }
  const source = fs.readFileSync(file, "utf8");
  return {
    id,
    exists: true,
    file: rel(file),
    foundations: extractStringArray(source, "foundations"),
    primitives: extractStringArray(source, "primitives"),
    tokens: extractStringArray(source, "tokens"),
  };
}

function extractStringArray(source, key) {
  const match = source.match(new RegExp(`${key}:\\s*\\[([\\s\\S]*?)\\]`));
  if (!match) return [];
  return unique([...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]));
}

function primitiveMaturityRows(primitiveRecords) {
  const indexSource = readMaybe(componentsIndexFile);
  const exportReport = fs.existsSync(foundationPrimitiveExportReport)
    ? readJson(foundationPrimitiveExportReport)
    : null;
  const tokenContractOk = exportReport?.tokenContract?.format === "flow-token-contract@2"
    && exportReport?.tokenContract?.compatibleWith?.includes("style-dictionary")
    && fs.existsSync(tokensFile);
  const rows = new Map();
  for (const primitive of primitiveRecords.values()) {
    const contractFile = path.join(primitiveContractDir, `${primitive.id}.md`);
    const implementationFile = path.join(root, "packages/components/src/primitives", `${primitive.id}.js`);
    const requiresRuntimeExport = primitiveRuntimeExports.has(primitive.id);
    rows.set(primitive.id, {
      id: primitive.id,
      name: primitive.name,
      artifactFile: primitive.file,
      contractFile: rel(contractFile),
      hasContract: fs.existsSync(contractFile),
      implementationFile: rel(implementationFile),
      hasImplementation: fs.existsSync(implementationFile),
      requiresRuntimeExport,
      exportedFromComponents: !requiresRuntimeExport || indexSource.includes(`./primitives/${primitive.id}.js`),
      tokenContractOk,
      gaps: [],
    });
  }
  for (const row of rows.values()) {
    if (!row.hasContract) row.gaps.push("missing primitive contract markdown");
    if (row.requiresRuntimeExport && !row.hasImplementation) row.gaps.push("missing runtime primitive implementation");
    if (row.requiresRuntimeExport && !row.exportedFromComponents) row.gaps.push("missing components package export");
    if (!row.tokenContractOk) row.gaps.push("foundation/primitive token export contract is not passing");
  }
  return rows;
}

function foundationMaturityRows(foundationRecords) {
  const exportReport = fs.existsSync(foundationPrimitiveExportReport)
    ? readJson(foundationPrimitiveExportReport)
    : null;
  const exportOk = exportReport?.status === "pass";
  const rows = new Map();
  for (const foundation of foundationRecords.values()) {
    const contractFile = path.join(foundationContractDir, `${foundation.id}.md`);
    rows.set(foundation.id, {
      id: foundation.id,
      name: foundation.name,
      artifactFile: foundation.file,
      contractFile: rel(contractFile),
      hasContract: fs.existsSync(contractFile),
      exportContractOk: exportOk,
      gaps: [],
    });
  }
  for (const row of rows.values()) {
    if (!row.hasContract) row.gaps.push("missing foundation contract markdown");
    if (!row.exportContractOk) row.gaps.push("foundation/primitive export contract is not passing");
  }
  return rows;
}

function idsToNames(ids, records) {
  return unique(ids.map((id) => records.get(id)?.name ?? titleFromId(id)));
}

function namesToIds(names) {
  return unique(names.map((name) => slug(name)));
}

function coverageRows(records, patterns, patternKey, inferredKey) {
  return [...records.values()].map((record) => {
    const declaredByPatterns = patterns
      .filter((pattern) => namesToIds(pattern[patternKey]).includes(record.id))
      .map((pattern) => pattern.id);
    const inferredByPatterns = patterns
      .filter((pattern) => namesToIds(pattern[inferredKey]).includes(record.id))
      .map((pattern) => pattern.id);
    return {
      id: record.id,
      name: record.name,
      declaredByPatterns,
      inferredByPatterns,
      patternCount: unique([...declaredByPatterns, ...inferredByPatterns]).length,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function primitiveFoundationClosure(names, primitiveRecords) {
  return unique(namesToIds(names).flatMap((id) => {
    const record = primitiveRecords.get(id);
    return record?.raw?.governingFoundations ?? [];
  }));
}

function primitiveCoordinationRows(records) {
  return [...records.values()].map((record) => {
    const coordinatedByPrimitives = [...records.values()]
      .filter((candidate) => (candidate.raw?.coordinatesPrimitives ?? []).some((name) => slug(name) === record.id))
      .map((candidate) => candidate.name)
      .sort();
    return {
      id: record.id,
      name: record.name,
      coordinatesPrimitives: record.raw?.coordinatesPrimitives ?? [],
      coordinatedByPrimitives,
    };
  }).sort((a, b) => a.name.localeCompare(b.name));
}

function templateMentions(name, id = slug(name)) {
  if (!fs.existsSync(templateBlueprintsFile)) return [];
  const needles = unique([name, id, ...(primitiveTemplateNeedles[id] ?? [])].map(slug));
  const mentions = [];
  const data = readJson(templateBlueprintsFile);
  for (const [templateId, template] of Object.entries(data.templates ?? {})) {
    const haystack = slug(JSON.stringify(template));
    if (needles.some((needle) => haystack.includes(needle))) mentions.push(templateId);
  }
  return unique(mentions);
}

function classifyUnusedPrimitive(row, coordination) {
  const templates = templateMentions(row.name, row.id);
  const governedClassification = unusedPrimitiveClassifications[row.id];
  if (governedClassification) {
    return {
      ...row,
      classification: templates.length
        ? (governedClassification.classificationWithTemplateMentions ?? governedClassification.classification)
        : (governedClassification.classificationWithoutTemplateMentions ?? governedClassification.classification),
      directPatternRequired: typeof governedClassification.directPatternRequired === "boolean"
        ? governedClassification.directPatternRequired
        : Boolean(templates.length && governedClassification.directPatternRequiredWhenTemplateMentioned),
      reason: governedClassification.reason,
      coordinatedByPrimitives: coordination?.coordinatedByPrimitives ?? [],
      templateMentions: templates,
      migrationAction: governedClassification.migrationAction,
    };
  }
  return {
    ...row,
    classification: templates.length ? "template-adjacent-primitive" : "unclassified-unused-primitive",
    directPatternRequired: templates.length > 0,
    reason: templates.length ? "Template demand exists without a formal pattern dependency." : "No direct pattern or template demand found.",
    coordinatedByPrimitives: coordination?.coordinatedByPrimitives ?? [],
    templateMentions: templates,
    migrationAction: templates.length ? "Formalize or declare the pattern before template React migration." : "Review whether this primitive is still part of the active system.",
  };
}

function knownTaxonomyPatternIds() {
  if (!fs.existsSync(patternBacklogFile)) return new Set();
  const backlog = readJson(patternBacklogFile);
  return new Set((backlog.classificationRules?.knownPatternExamples ?? []).map((id) => slug(id)));
}

function taxonomyLayerAlignmentIssues() {
  if (!fs.existsSync(taxonomyBoundariesFile)) {
    return [{
      id: "taxonomy-boundaries",
      expectedLayer: "present",
      actualLayer: "missing",
      message: "Pattern architecture policy requires taxonomy boundary alignment, but taxonomy-boundaries.json is missing.",
    }];
  }
  const taxonomy = readJson(taxonomyBoundariesFile);
  const cases = new Map((taxonomy.requiredBoundaryCases ?? []).map((item) => [slug(item.id), item]));
  return [...taxonomyRequiredLayerChecks.entries()].flatMap(([name, expectedLayer]) => {
    const id = slug(name);
    const boundaryCase = cases.get(id);
    if (!boundaryCase) {
      return [{
        id,
        name,
        expectedLayer,
        actualLayer: "missing",
        message: `${name} must be listed in taxonomy requiredBoundaryCases as ${expectedLayer}.`,
      }];
    }
    if (boundaryCase.layer !== expectedLayer) {
      return [{
        id,
        name,
        expectedLayer,
        actualLayer: boundaryCase.layer,
        message: `${name} is ${boundaryCase.layer} in taxonomy requiredBoundaryCases, but pattern architecture requires ${expectedLayer}.`,
      }];
    }
    return [];
  });
}

function patternArtifacts() {
  return patternArtifactIds
    .map((id) => {
      const file = `${id}.json`;
      const data = readJson(path.join(patternDir, file));
      const pattern = data.artifacts?.patterns?.[id] ?? data;
      return {
        id,
        artifactFile: rel(path.join(patternDir, file)),
        components: pattern.componentDependencies ?? [],
        primitives: pattern.primitiveDependencies ?? [],
        foundations: pattern.foundationDependencies ?? pattern.governingFoundations ?? [],
        patternDependencies: pattern.patternDependencies ?? [],
        slots: pattern.slots ?? [],
        states: pattern.states ?? [],
        instructions: pattern.agentInstructions ?? [],
      };
    });
}

function dependencyLayerErrors(pattern, componentNames, primitiveNames, foundationNames, patternNames) {
  const errors = [];
  function layerFor(name) {
    const id = slug(name);
    const layers = [
      componentNames.has(id) ? "component" : "",
      primitiveNames.has(id) ? "primitive" : "",
      foundationNames.has(id) ? "foundation" : "",
      patternNames.has(id) ? "pattern" : "",
    ].filter(Boolean);
    return { id, layers };
  }
  function inspect(field, expectedLayer, values) {
    for (const name of values) {
      const { id, layers } = layerFor(name);
      const approvedCrossLayer = approvedCrossLayerArtifactIds.has(id)
        && layers.includes(expectedLayer);
      if (!layers.includes(expectedLayer)) {
        errors.push({
          field,
          name,
          id,
          expectedLayer,
          resolvedLayers: layers,
          message: `${pattern.id} ${field} declares "${name}", but it does not resolve to a ${expectedLayer} artifact.`,
        });
      } else if (layers.length > 1 && !approvedCrossLayer) {
        errors.push({
          field,
          name,
          id,
          expectedLayer,
          resolvedLayers: layers,
          message: `${pattern.id} ${field} declares "${name}", but it resolves to multiple layers: ${layers.join(", ")}.`,
        });
      }
    }
  }
  inspect("componentDependencies", "component", pattern.components);
  inspect("primitiveDependencies", "primitive", pattern.primitives);
  inspect("foundationDependencies", "foundation", pattern.foundations);
  inspect("patternDependencies", "pattern", pattern.patternDependencies);
  return errors;
}

function reactPatterns() {
  if (!fs.existsSync(reactPatternDir)) return new Map();
  const rows = new Map();
  for (const file of fs.readdirSync(reactPatternDir).filter((item) => /^[A-Z].*\.js$/.test(item)).sort()) {
    const source = fs.readFileSync(path.join(reactPatternDir, file), "utf8");
    const id = source.match(/"data-flow-pattern": "([^"]+)"/)?.[1] ?? slug(file.replace(/\.js$/, ""));
    const imports = [...source.matchAll(/import \{ ([^}]+) \} from "\.\.\/([^".]+)\.js"/g)]
      .map((match) => match[2])
      .filter((importPath) => !importPath.includes("/"));
    rows.set(id, {
      file: rel(path.join(reactPatternDir, file)),
      imports,
      rawDomRoots: unique([...source.matchAll(/React\.createElement\(\s*"([a-z]+)/g)].map((match) => match[1])),
      usesCard: imports.includes("Card"),
      source,
    });
  }
  return rows;
}

function isStructuralSlot(slot) {
  const name = String(slot.name ?? "");
  return structuralSlotNames.some((part) => slug(name).includes(part));
}

function surfaceSlotDebt(pattern, slot, use) {
  if (emailChannelPatternIds.has(pattern.id) && slot.owner === "channel") return null;
  if (!isStructuralSlot(slot)) return null;
  if (use === structuralSurfacePrimitive) return null;
  if (componentSurfaceOwners.has(use)) return null;
  if (structuralSurfaceExemptComponents.has(use)) return null;
  if (componentObjectSurfaces.has(use)) {
    const isCardWrapper = use === "Card";
    return {
      slot: slot.name,
      use,
      severity: "high",
      cardStructuralWrapperViolation: isCardWrapper,
      message: isCardWrapper
        ? `${pattern.id} maps structural slot "${slot.name}" to Card. Structural grouping must use Surface; Card is only valid for a formal card content unit.`
        : `${pattern.id} maps structural slot "${slot.name}" to ${use}. This is only valid when the slot is one scannable object; otherwise it must be Surface/Frame primitive ownership.`,
    };
  }
  return {
    slot: slot.name,
    use,
    severity: "medium",
    cardStructuralWrapperViolation: false,
    message: `${pattern.id} maps structural slot "${slot.name}" to ${use}; verify this is not layout/surface ownership hidden inside a component dependency.`,
  };
}

function createReport() {
  const taxonomyAlignmentIssues = taxonomyLayerAlignmentIssues();
  const primitiveRecords = artifactRecords(primitiveDir, "primitives");
  const foundationRecords = artifactRecords(foundationDir, "foundations");
  const primitiveMaturity = primitiveMaturityRows(primitiveRecords);
  const foundationMaturity = foundationMaturityRows(foundationRecords);
  const primitiveNames = artifactNameSet(primitiveDir, "primitives");
  const foundationNames = artifactNameSet(foundationDir, "foundations");
  const componentNames = artifactNameSet(componentDir, "components");
  const rawPatterns = patternArtifacts();
  const patternNames = new Set(rawPatterns.flatMap((pattern) => [
    pattern.id,
    titleFromId(pattern.id),
  ]).map(slug));
  const knownPatternIds = knownTaxonomyPatternIds();
  const react = reactPatterns();
  const patterns = rawPatterns.map((pattern) => {
    const missingPrimitives = pattern.primitives.filter((name) => !primitiveNames.has(slug(name)));
    const missingFoundations = pattern.foundations.filter((name) => !foundationNames.has(slug(name)));
    const missingComponents = pattern.components.filter((name) => !componentNames.has(slug(name)));
    const formalDependencyLayerErrors = dependencyLayerErrors(pattern, componentNames, primitiveNames, foundationNames, patternNames);
    const platformContracts = pattern.components.map((name) => ({
      component: name,
      ...platformContractFor(name),
    }));
    const componentPrimitiveIds = unique(platformContracts.flatMap((contract) => contract.primitives));
    const componentFoundationIds = unique(platformContracts.flatMap((contract) => contract.foundations));
    const componentTokenRefs = unique(platformContracts.flatMap((contract) => contract.tokens));
    const componentPrimitiveNames = idsToNames(componentPrimitiveIds, primitiveRecords);
    const componentFoundationNames = idsToNames(componentFoundationIds, foundationRecords);
    const undeclaredComponentPrimitives = componentPrimitiveNames.filter((name) => !pattern.primitives.includes(name));
    const undeclaredComponentFoundations = componentFoundationNames.filter((name) => !pattern.foundations.includes(name));
    const emailChannelPattern = emailChannelPatternIds.has(pattern.id);
    const slotRequiresSurfacePrimitive = !emailChannelPattern && pattern.slots.some((slot) => isStructuralSlot(slot))
      || pattern.components.some((name) => componentObjectSurfaces.has(name));
    const inferredPrimitiveNames = unique([
      ...pattern.primitives,
      ...componentPrimitiveNames,
      ...(slotRequiresSurfacePrimitive ? [structuralSurfacePrimitive] : []),
    ]);
    const inferredFoundations = unique([
      ...primitiveFoundationClosure(inferredPrimitiveNames, primitiveRecords),
      ...componentFoundationNames,
    ]);
    const missingExplicitFoundations = inferredFoundations.filter((name) => !pattern.foundations.includes(name));
    const missingInferredPrimitiveArtifacts = inferredPrimitiveNames.filter((name) => !primitiveNames.has(slug(name)));
    const missingInferredFoundationArtifacts = inferredFoundations.filter((name) => !foundationNames.has(slug(name)));
    const primitiveMaturityGaps = inferredPrimitiveNames.flatMap((name) => {
      const row = primitiveMaturity.get(slug(name));
      if (!row) return [{ primitive: name, gap: "missing primitive artifact" }];
      return row.gaps.map((gap) => ({ primitive: name, gap }));
    });
    const foundationMaturityGaps = inferredFoundations.flatMap((name) => {
      const row = foundationMaturity.get(slug(name));
      if (!row) return [{ foundation: name, gap: "missing foundation artifact" }];
      return row.gaps.map((gap) => ({ foundation: name, gap }));
    });
    const slotUseRows = pattern.slots.flatMap((slot) => (slot.uses ?? []).map((use) => ({
      slot: slot.name,
      owner: slot.owner,
      use,
      structural: isStructuralSlot(slot),
    })));
    const directSurfaceRuntimeRequired = slotUseRows.some((slot) => slot.structural && slot.use === structuralSurfacePrimitive);
    const structuralSlotDebts = pattern.slots.flatMap((slot) => (slot.uses ?? [])
      .map((use) => surfaceSlotDebt(pattern, slot, use))
      .filter(Boolean));
    const patternOwnedSlots = slotUseRows.filter((slot) => slot.owner === "pattern");
    const reactPattern = react.get(pattern.id) ?? null;
    const reactDebts = [];
    if (reactPattern) {
      const requiredComponents = pattern.components.map((name) => reactComponentName(knownAliasNames.get(name) ?? name));
      const missingImports = requiredComponents.filter((component) => !reactPattern.imports.includes(component));
      if (missingImports.length) reactDebts.push(`React implementation is missing imports: ${missingImports.join(", ")}.`);
      const cardOwnsStructuralSlot = slotUseRows.some((slot) => slot.structural && slot.use === "Card");
      if (reactPattern.usesCard && cardOwnsStructuralSlot && pattern.primitives.includes(structuralSurfacePrimitive)) {
        reactDebts.push("React implementation imports Card while the formal pattern requires Surface primitive ownership for structural layout.");
      }
      if (reactPattern.usesCard && missingInferredPrimitiveArtifacts.includes(structuralSurfacePrimitive)) {
        reactDebts.push("React implementation depends on Card while the required Surface primitive is not formalized/exportable.");
      }
      if (directSurfaceRuntimeRequired && !reactPattern.imports.includes(structuralSurfacePrimitive)) {
        reactDebts.push("React implementation is missing Surface import for a structural slot owned by the Surface primitive.");
      }
      const disallowedDomRoots = reactPattern.rawDomRoots.filter((tag) => !allowedPatternDomRoots.has(tag))
        .filter((tag) => !(emailChannelPattern && emailChannelAllowedTags.has(tag)));
      if (disallowedDomRoots.length) {
        reactDebts.push(`React pattern renders raw DOM roots beyond wrapper div and semantic text: ${reactPattern.rawDomRoots.join(", ")}.`);
      }
    }
    const taxonomyWarnings = knownPatternIds.has(pattern.id)
      ? []
      : taxonomySignals.filter((signal) => pattern.id.includes(signal) && !(emailChannelPattern && signal === "template"));
    const debtScore = missingPrimitives.length * foundationPrimitiveDebtWeights.missingPrimitive
      + missingInferredPrimitiveArtifacts.length * foundationPrimitiveDebtWeights.missingInferredPrimitiveArtifact
      + missingComponents.length * foundationPrimitiveDebtWeights.missingComponent
      + missingExplicitFoundations.length * foundationPrimitiveDebtWeights.missingExplicitFoundation
      + missingInferredFoundationArtifacts.length * foundationPrimitiveDebtWeights.missingInferredFoundationArtifact
      + undeclaredComponentPrimitives.length * foundationPrimitiveDebtWeights.undeclaredComponentPrimitive
      + undeclaredComponentFoundations.length * foundationPrimitiveDebtWeights.undeclaredComponentFoundation
      + primitiveMaturityGaps.length * foundationPrimitiveDebtWeights.primitiveMaturityGap
      + foundationMaturityGaps.length * foundationPrimitiveDebtWeights.foundationMaturityGap
      + structuralSlotDebts.length * foundationPrimitiveDebtWeights.structuralSlotDebt
      + formalDependencyLayerErrors.length * foundationPrimitiveDebtWeights.formalDependencyLayerError
      + (reactDebts.length * foundationPrimitiveDebtWeights.reactDebt);
    const readiness = debtScore === 0
      ? "ready"
      : structuralSlotDebts.length || missingPrimitives.length || missingInferredPrimitiveArtifacts.length || reactDebts.length
        ? "blocked"
        : "needs-foundation-contract";
    return {
      id: pattern.id,
      artifactFile: pattern.artifactFile,
      components: pattern.components,
      primitives: pattern.primitives,
      foundations: pattern.foundations,
      patternDependencies: pattern.patternDependencies,
      formalDependencyLayerErrors,
      platformContracts,
      componentPrimitiveNames,
      componentFoundationNames,
      componentTokenRefs,
      inferredPrimitiveNames,
      inferredFoundations,
      missingExplicitFoundations,
      missingPrimitives,
      missingInferredPrimitiveArtifacts,
      missingInferredFoundationArtifacts,
      missingFoundations,
      missingComponents,
      undeclaredComponentPrimitives,
      undeclaredComponentFoundations,
      primitiveMaturityGaps,
      foundationMaturityGaps,
      slotRequiresSurfacePrimitive,
      directSurfaceRuntimeRequired,
      structuralSlots: slotUseRows.filter((slot) => slot.structural),
      structuralSlotDebts,
      patternOwnedSlots,
      taxonomyWarnings,
      react: reactPattern ? {
        file: reactPattern.file,
        imports: reactPattern.imports,
        debts: reactDebts,
      } : null,
      readiness,
      debtScore,
    };
  });

  const primitiveCoverage = coverageRows(primitiveRecords, patterns, "primitives", "inferredPrimitiveNames");
  const foundationCoverage = coverageRows(foundationRecords, patterns, "foundations", "inferredFoundations");
  const primitiveCoordination = primitiveCoordinationRows(primitiveRecords);
  const unusedPrimitiveArtifacts = primitiveCoverage.filter((row) => row.patternCount === 0);
  const unusedFoundationArtifacts = foundationCoverage.filter((row) => row.patternCount === 0);
  const primitiveArtifactsMissingGoverningFoundations = [...primitiveRecords.values()]
    .filter((primitive) => !Array.isArray(primitive.raw?.governingFoundations) || !primitive.raw.governingFoundations.length)
    .map((primitive) => ({
      id: primitive.id,
      name: primitive.name,
      artifactFile: primitive.file,
      message: "Primitive artifact must declare governingFoundations so pattern foundation inference has one source of truth.",
    }));
  const unusedPrimitiveClassifications = unusedPrimitiveArtifacts.map((row) => classifyUnusedPrimitive(
    row,
    primitiveCoordination.find((item) => item.id === row.id),
  ));
  const unreferencedPrimitiveArtifacts = unusedPrimitiveArtifacts.filter((row) => {
    const coordination = primitiveCoordination.find((item) => item.id === row.id);
    return !coordination?.coordinatedByPrimitives.length;
  });
  const unusedPrimitiveDirectPatternRequired = unusedPrimitiveClassifications
    .filter((row) => row.directPatternRequired);
  const governedUnusedPrimitiveArtifacts = unusedPrimitiveClassifications
    .filter((row) => !row.directPatternRequired && row.classification !== "unclassified-unused-primitive");
  const unclassifiedUnusedPrimitiveArtifacts = unusedPrimitiveClassifications
    .filter((row) => row.classification === "unclassified-unused-primitive");
  const cardStructuralWrapperViolations = patterns.flatMap((pattern) => pattern.structuralSlotDebts
    .filter((debt) => debt.cardStructuralWrapperViolation)
    .map((debt) => ({
      pattern: pattern.id,
      artifactFile: pattern.artifactFile,
      slot: debt.slot,
      use: debt.use,
      message: debt.message,
    })));
  const inventory = {
    formalPatternArtifacts: patterns.length,
    primitiveArtifacts: primitiveNames.size,
    foundationArtifacts: foundationNames.size,
    componentArtifacts: componentNames.size,
    patternArchitecturePolicyIssues: patternArchitecturePolicy.issues.length,
    patternArchitectureStructuralSlotNames: patternArchitecturePolicy.structuralSlotNames.length,
    patternArchitectureSurfaceOwnerComponents: patternArchitecturePolicy.componentSurfaceOwners.size,
    patternArchitectureObjectSurfaceComponents: patternArchitecturePolicy.componentObjectSurfaces.size,
    patternArchitectureStructuralSurfaceExemptComponents: patternArchitecturePolicy.structuralSurfaceExemptComponents.size,
    patternArchitectureAllowedDomRoots: patternArchitecturePolicy.allowedPatternDomRoots.size,
    patternArchitectureEmailChannelPatterns: patternArchitecturePolicy.emailChannelPatternIds.size,
    patternArchitectureEmailChannelAllowedTags: patternArchitecturePolicy.emailChannelAllowedTags.size,
    patternArchitectureRuntimePrimitiveExports: patternArchitecturePolicy.primitiveRuntimeExports.size,
    patternArchitectureApprovedCrossLayerArtifacts: patternArchitecturePolicy.approvedCrossLayerArtifactIds.size,
    patternArchitectureTaxonomyLayerChecks: patternArchitecturePolicy.taxonomyRequiredLayerChecks.size,
    patternArchitectureTaxonomyLayerIssues: taxonomyAlignmentIssues.length,
    patternArchitectureUnusedPrimitiveClassifications: Object.keys(patternArchitecturePolicy.unusedPrimitiveClassifications).length,
    foundationPrimitiveDebtWeightPolicy: Object.keys(patternArchitecturePolicy.foundationPrimitiveDebtWeights).length,
    implementedReactPatterns: [...react.keys()].length,
    patternsWithExplicitFoundations: patterns.filter((pattern) => pattern.foundations.length).length,
    patternsMissingExplicitFoundations: patterns.filter((pattern) => pattern.missingExplicitFoundations.length).length,
    patternsWithMissingPrimitiveRefs: patterns.filter((pattern) => pattern.missingPrimitives.length).length,
    patternsWithMissingInferredPrimitiveArtifacts: patterns.filter((pattern) => pattern.missingInferredPrimitiveArtifacts.length).length,
    formalDependencyLayerErrors: patterns.reduce((sum, pattern) => sum + pattern.formalDependencyLayerErrors.length, 0),
    patternsWithUndeclaredComponentPrimitives: patterns.filter((pattern) => pattern.undeclaredComponentPrimitives.length).length,
    patternsRequiringSurfacePrimitive: patterns.filter((pattern) => pattern.slotRequiresSurfacePrimitive).length,
    patternsRequiringDirectSurfaceRuntime: patterns.filter((pattern) => pattern.directSurfaceRuntimeRequired).length,
    patternsMissingDirectSurfaceRuntime: patterns.filter((pattern) => pattern.directSurfaceRuntimeRequired && !pattern.react?.imports.includes(structuralSurfacePrimitive)).length,
    patternsWithStructuralSurfaceDebt: patterns.filter((pattern) => pattern.structuralSlotDebts.length).length,
    cardStructuralWrapperViolations: cardStructuralWrapperViolations.length,
    implementedReactPatternsWithArchitectureDebt: patterns.filter((pattern) => pattern.react?.debts.length).length,
    patternsWithTaxonomyWarnings: patterns.filter((pattern) => pattern.taxonomyWarnings.length).length,
    primitiveArtifactsUnusedByPatterns: unusedPrimitiveArtifacts.length,
    governedPrimitiveArtifactsUnusedByPatterns: governedUnusedPrimitiveArtifacts.length,
    unclassifiedPrimitiveArtifactsUnusedByPatterns: unclassifiedUnusedPrimitiveArtifacts.length,
    primitiveArtifactsUnreferencedBySystem: unreferencedPrimitiveArtifacts.length,
    primitiveArtifactsMissingGoverningFoundations: primitiveArtifactsMissingGoverningFoundations.length,
    unusedPrimitiveArtifactsRequiringPattern: unusedPrimitiveDirectPatternRequired.length,
    foundationArtifactsUnusedByPatterns: unusedFoundationArtifacts.length,
    readyPatterns: patterns.filter((pattern) => pattern.readiness === "ready").length,
    blockedPatterns: patterns.filter((pattern) => pattern.readiness === "blocked").length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "foundationPrimitiveBlockingDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  const architectureDebt = patterns.reduce((sum, pattern) => sum + pattern.debtScore, 0)
    + primitiveArtifactsMissingGoverningFoundations.length
    + unclassifiedUnusedPrimitiveArtifacts.length
    + unusedPrimitiveDirectPatternRequired.length
    + taxonomyAlignmentIssues.length
    + patternArchitecturePolicy.issues.length;
  const debt = architectureDebt + baselineMismatches.length + unexpectedInventoryMetrics.length;
  inventory.foundationPrimitiveBlockingDebt = debt;
  return {
    status: debt === 0 ? "pass" : "fail",
    audit: "pattern foundation primitive 1:1",
    principle: "Patterns may orchestrate components, but structural surface/layout ownership must resolve through primitives/foundations before React implementation.",
    inventory,
    debt,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    missingPrimitiveRefs: unique(patterns.flatMap((pattern) => pattern.missingPrimitives)),
    missingInferredPrimitiveArtifacts: unique(patterns.flatMap((pattern) => pattern.missingInferredPrimitiveArtifacts)),
    formalDependencyLayerErrors: patterns.flatMap((pattern) => pattern.formalDependencyLayerErrors),
    patternArchitecturePolicyIssues: patternArchitecturePolicy.issues,
    taxonomyAlignmentIssues,
    undeclaredComponentPrimitives: unique(patterns.flatMap((pattern) => pattern.undeclaredComponentPrimitives)),
    primitiveMaturity: [...primitiveMaturity.values()],
    foundationMaturity: [...foundationMaturity.values()],
    primitiveCoverage,
    primitiveCoordination,
    foundationCoverage,
    unusedPrimitiveArtifacts,
    governedUnusedPrimitiveArtifacts,
    unclassifiedUnusedPrimitiveArtifacts,
    unusedPrimitiveClassifications,
    cardStructuralWrapperViolations,
    unreferencedPrimitiveArtifacts,
    primitiveArtifactsMissingGoverningFoundations,
    unusedPrimitiveDirectPatternRequired,
    unusedFoundationArtifacts,
    globalGaps: [
      ...patternArchitecturePolicy.issues.map((issue) => `Pattern architecture policy issue: ${issue}`),
      ...taxonomyAlignmentIssues.map((issue) => `Taxonomy alignment issue: ${issue.message}`),
      ...(primitiveNames.has(slug("Surface")) ? [] : ["Surface primitive is not formalized/exportable as a primitive artifact, despite surface ownership appearing in pattern slots."]),
      ...primitiveArtifactsMissingGoverningFoundations.map((primitive) => `${primitive.name} primitive is missing governingFoundations.`),
      ...(patterns.every((pattern) => pattern.foundations.length === 0) ? ["All pattern artifacts currently omit explicit foundationDependencies."] : []),
      ...(unique(patterns.flatMap((pattern) => pattern.missingPrimitives)).includes("Field Action") ? ["Field Action is declared as a primitive dependency but has no primitive artifact."] : []),
      ...(patterns.some((pattern) => pattern.undeclaredComponentPrimitives.length) ? ["Pattern primitiveDependencies do not yet include the primitives inherited from their component platform contracts."] : []),
      ...(patterns.some((pattern) => pattern.taxonomyWarnings.length) ? ["Several pattern artifacts carry template/product-flow signals and need taxonomy review before React migration."] : []),
      ...(cardStructuralWrapperViolations.length ? ["Card is being used as a structural wrapper in pattern slots; replace that ownership with Surface."] : []),
    ],
    patterns,
  };
}

function renderMarkdown(report) {
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const lines = [
    "# Pattern Foundation/Primitive 1:1 Audit",
    "",
    `Status: ${report.status}`,
    "",
    "## Principle",
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Formal pattern artifacts: ${report.inventory.formalPatternArtifacts}`,
    `- Pattern architecture policy issues: ${report.inventory.patternArchitecturePolicyIssues}`,
    `- Pattern architecture structural slot names: ${report.inventory.patternArchitectureStructuralSlotNames}`,
    `- Pattern architecture surface-owner components: ${report.inventory.patternArchitectureSurfaceOwnerComponents}`,
    `- Pattern architecture object-surface components: ${report.inventory.patternArchitectureObjectSurfaceComponents}`,
    `- Pattern architecture structural Surface exemptions: ${report.inventory.patternArchitectureStructuralSurfaceExemptComponents}`,
    `- Pattern architecture allowed DOM roots: ${report.inventory.patternArchitectureAllowedDomRoots}`,
    `- Pattern architecture runtime primitive exports: ${report.inventory.patternArchitectureRuntimePrimitiveExports}`,
    `- Pattern architecture approved cross-layer artifacts: ${report.inventory.patternArchitectureApprovedCrossLayerArtifacts}`,
    `- Pattern architecture taxonomy layer checks: ${report.inventory.patternArchitectureTaxonomyLayerChecks}`,
    `- Pattern architecture taxonomy layer issues: ${report.inventory.patternArchitectureTaxonomyLayerIssues}`,
    `- Pattern architecture unused primitive classifications: ${report.inventory.patternArchitectureUnusedPrimitiveClassifications}`,
    `- Foundation/primitive debt weight policy entries: ${report.inventory.foundationPrimitiveDebtWeightPolicy}`,
    `- Implemented React patterns detected: ${report.inventory.implementedReactPatterns}`,
    `- Patterns with explicit foundations: ${report.inventory.patternsWithExplicitFoundations}`,
    `- Patterns missing inferred foundations: ${report.inventory.patternsMissingExplicitFoundations}`,
    `- Patterns with missing primitive refs: ${report.inventory.patternsWithMissingPrimitiveRefs}`,
    `- Patterns with missing inferred primitive artifacts: ${report.inventory.patternsWithMissingInferredPrimitiveArtifacts}`,
    `- Formal dependency layer errors: ${report.inventory.formalDependencyLayerErrors}`,
    `- Patterns with undeclared component primitives: ${report.inventory.patternsWithUndeclaredComponentPrimitives}`,
    `- Patterns requiring Surface primitive: ${report.inventory.patternsRequiringSurfacePrimitive}`,
    `- Patterns requiring direct Surface runtime: ${report.inventory.patternsRequiringDirectSurfaceRuntime}`,
    `- Patterns missing direct Surface runtime: ${report.inventory.patternsMissingDirectSurfaceRuntime}`,
    `- Patterns with structural surface debt: ${report.inventory.patternsWithStructuralSurfaceDebt}`,
    `- Card structural wrapper violations: ${report.inventory.cardStructuralWrapperViolations}`,
    `- Implemented React patterns with architecture debt: ${report.inventory.implementedReactPatternsWithArchitectureDebt}`,
    `- Patterns with taxonomy warnings: ${report.inventory.patternsWithTaxonomyWarnings}`,
    `- Primitive artifacts unused by patterns: ${report.inventory.primitiveArtifactsUnusedByPatterns}`,
    `- Governed primitive artifacts unused by patterns: ${report.inventory.governedPrimitiveArtifactsUnusedByPatterns}`,
    `- Unclassified primitive artifacts unused by patterns: ${report.inventory.unclassifiedPrimitiveArtifactsUnusedByPatterns}`,
    `- Primitive artifacts unreferenced by system: ${report.inventory.primitiveArtifactsUnreferencedBySystem}`,
    `- Primitive artifacts missing governing foundations: ${report.inventory.primitiveArtifactsMissingGoverningFoundations}`,
    `- Unused primitive artifacts requiring pattern: ${report.inventory.unusedPrimitiveArtifactsRequiringPattern}`,
    `- Foundation artifacts unused by patterns: ${report.inventory.foundationArtifactsUnusedByPatterns}`,
    `- Ready patterns: ${report.inventory.readyPatterns}`,
    `- Blocked patterns: ${report.inventory.blockedPatterns}`,
    `- Foundation/primitive blocking debt: ${report.inventory.foundationPrimitiveBlockingDebt}`,
    "",
    "## Baseline Mismatches",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...(mismatchRows.length ? mismatchRows : ["| None | None | None |"]),
    "",
    "## Unexpected Inventory Metrics",
    "",
    "| Metric | Actual |",
    "| --- | ---: |",
    ...(unexpectedMetricRows.length ? unexpectedMetricRows : ["| None | None |"]),
    "",
    "## Global Gaps",
    "",
    ...report.globalGaps.map((gap) => `- ${gap}`),
    "",
    "## Blockers",
    "",
  ];
  for (const pattern of report.patterns.filter((item) => item.readiness === "blocked")) {
    lines.push(`### ${pattern.id}`);
    lines.push(`- Artifact: ${pattern.artifactFile}`);
    if (pattern.missingPrimitives.length) lines.push(`- Missing primitive artifacts: ${pattern.missingPrimitives.join(", ")}`);
    if (pattern.missingInferredPrimitiveArtifacts.length) lines.push(`- Missing inferred primitive artifacts: ${pattern.missingInferredPrimitiveArtifacts.join(", ")}`);
    if (pattern.missingComponents.length) lines.push(`- Missing component artifacts: ${pattern.missingComponents.join(", ")}`);
    if (pattern.formalDependencyLayerErrors.length) lines.push(`- Formal dependency layer errors: ${pattern.formalDependencyLayerErrors.map((error) => error.message).join("; ")}`);
    if (pattern.undeclaredComponentPrimitives.length) lines.push(`- Undeclared component primitives: ${pattern.undeclaredComponentPrimitives.join(", ")}`);
    if (pattern.undeclaredComponentFoundations.length) lines.push(`- Undeclared component foundations: ${pattern.undeclaredComponentFoundations.join(", ")}`);
    if (pattern.primitiveMaturityGaps.length) lines.push(`- Primitive maturity gaps: ${pattern.primitiveMaturityGaps.map((gap) => `${gap.primitive}: ${gap.gap}`).join("; ")}`);
    if (pattern.foundationMaturityGaps.length) lines.push(`- Foundation maturity gaps: ${pattern.foundationMaturityGaps.map((gap) => `${gap.foundation}: ${gap.gap}`).join("; ")}`);
    if (pattern.structuralSlotDebts.length) {
      lines.push(`- Structural slot debt: ${pattern.structuralSlotDebts.map((debt) => `${debt.slot} -> ${debt.use}`).join("; ")}`);
    }
    if (pattern.taxonomyWarnings.length) lines.push(`- Taxonomy warning signals: ${pattern.taxonomyWarnings.join(", ")}`);
    if (pattern.react?.debts.length) {
      lines.push(`- React debt: ${pattern.react.debts.join(" ")}`);
    }
    lines.push("");
  }
  lines.push("## Implemented React Pattern Review");
  lines.push("");
  for (const pattern of report.patterns.filter((item) => item.react)) {
    lines.push(`- ${pattern.id}: ${pattern.react.debts.length ? "architecture debt" : "composition clean"}${pattern.react.debts.length ? ` (${pattern.react.debts.join(" ")})` : ""}`);
  }
  lines.push("");
  lines.push("## Primitive/Foundation Maturity");
  lines.push("");
  lines.push("| Layer | Item | Artifact | Contract | Runtime Export | Gaps |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const primitive of report.primitiveMaturity) {
    lines.push(`| Primitive | ${primitive.name} | yes | ${primitive.hasContract ? "yes" : "no"} | ${primitive.requiresRuntimeExport ? (primitive.exportedFromComponents ? "yes" : "no") : "n/a"} | ${primitive.gaps.join("; ") || "-"} |`);
  }
  for (const foundation of report.foundationMaturity) {
    lines.push(`| Foundation | ${foundation.name} | yes | ${foundation.hasContract ? "yes" : "no"} | export contract ${foundation.exportContractOk ? "pass" : "fail"} | ${foundation.gaps.join("; ") || "-"} |`);
  }
  lines.push("");
  lines.push("## Primitive/Foundation Pattern Coverage");
  lines.push("");
  lines.push("| Layer | Item | Pattern Count | Declared By | Inferred By |");
  lines.push("| --- | --- | ---: | --- | --- |");
  for (const primitive of report.primitiveCoverage) {
    lines.push(`| Primitive | ${primitive.name} | ${primitive.patternCount} | ${primitive.declaredByPatterns.join(", ") || "-"} | ${primitive.inferredByPatterns.join(", ") || "-"} |`);
  }
  for (const foundation of report.foundationCoverage) {
    lines.push(`| Foundation | ${foundation.name} | ${foundation.patternCount} | ${foundation.declaredByPatterns.join(", ") || "-"} | ${foundation.inferredByPatterns.join(", ") || "-"} |`);
  }
  lines.push("");
  lines.push("## Primitive Coordination Graph");
  lines.push("");
  lines.push("| Primitive | Coordinates | Coordinated By |");
  lines.push("| --- | --- | --- |");
  for (const primitive of report.primitiveCoordination) {
    lines.push(`| ${primitive.name} | ${primitive.coordinatesPrimitives.join(", ") || "-"} | ${primitive.coordinatedByPrimitives.join(", ") || "-"} |`);
  }
  lines.push("");
  lines.push("## Unused By Patterns");
  lines.push("");
  lines.push(`- Primitives: ${report.unusedPrimitiveArtifacts.map((item) => item.name).join(", ") || "None"}`);
  lines.push(`- Governed primitives: ${report.governedUnusedPrimitiveArtifacts.map((item) => item.name).join(", ") || "None"}`);
  lines.push(`- Unclassified primitives: ${report.unclassifiedUnusedPrimitiveArtifacts.map((item) => item.name).join(", ") || "None"}`);
  lines.push(`- Primitives unreferenced by system: ${report.unreferencedPrimitiveArtifacts.map((item) => item.name).join(", ") || "None"}`);
  lines.push(`- Primitives requiring a pattern: ${report.unusedPrimitiveDirectPatternRequired.map((item) => item.name).join(", ") || "None"}`);
  lines.push(`- Foundations: ${report.unusedFoundationArtifacts.map((item) => item.name).join(", ") || "None"}`);
  lines.push("");
  lines.push("## Unused Primitive Classification");
  lines.push("");
  lines.push("| Primitive | Classification | Direct Pattern Required | Template Mentions | Coordinated By | Action |");
  lines.push("| --- | --- | --- | --- | --- | --- |");
  for (const primitive of report.unusedPrimitiveClassifications) {
    lines.push(`| ${primitive.name} | ${primitive.classification} | ${primitive.directPatternRequired ? "yes" : "no"} | ${primitive.templateMentions.join(", ") || "-"} | ${primitive.coordinatedByPrimitives.join(", ") || "-"} | ${primitive.migrationAction} |`);
  }
  lines.push("");
  lines.push("## Pattern Rows");
  lines.push("");
  lines.push("| Pattern | Readiness | Components | Declared Primitives | Inferred Primitives | Dependency Layer Errors | Undeclared Component Primitives | Missing Primitive Artifacts | Inferred Foundations Missing | Structural Debt | React |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | --- | --- | --- | --- | --- |");
  for (const pattern of report.patterns) {
    lines.push(`| ${pattern.id} | ${pattern.readiness} | ${pattern.components.length} | ${pattern.primitives.length} | ${pattern.inferredPrimitiveNames.length} | ${pattern.formalDependencyLayerErrors.length} | ${pattern.undeclaredComponentPrimitives.join(", ") || "-"} | ${pattern.missingInferredPrimitiveArtifacts.join(", ") || "-"} | ${pattern.missingExplicitFoundations.join(", ") || "-"} | ${pattern.structuralSlotDebts.map((debt) => `${debt.slot}->${debt.use}`).join("; ") || "-"} | ${pattern.react ? (pattern.react.debts.length ? "debt" : "clean") : "-"} |`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, renderMarkdown(report));

if (checkMode) {
  const currentJson = fs.existsSync(jsonOutput) ? readJson(jsonOutput) : null;
  if (JSON.stringify(currentJson) !== JSON.stringify(report)) {
    console.error("Pattern foundation/primitive 1:1 audit is stale.");
    process.exitCode = 1;
  }
}

console.log(JSON.stringify({
  status: report.status,
  audit: report.audit,
  inventory: report.inventory,
  debt: report.debt,
  globalGaps: report.globalGaps,
  json: rel(jsonOutput),
  markdown: rel(markdownOutput),
}, null, 2));
