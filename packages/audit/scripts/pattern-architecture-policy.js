const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const patternArchitecturePolicyFile = path.join(root, "packages/content/content/pattern-architecture-policy.json");
const patternReactRuntimePolicyFile = path.join(root, "packages/content/content/pattern-react-runtime-policy.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function readPolicyJson(file) {
  const raw = readJson(file);
  if (!Array.isArray(raw.$systemShards)) return raw;
  const { $systemShards, ...manifest } = raw;
  return $systemShards.reduce((merged, shard) => {
    const shardFile = path.join(path.dirname(file), shard);
    return {
      ...merged,
      ...readPolicyJson(shardFile),
    };
  }, manifest);
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function stringArrayPolicy(policy, key, issues, { required = true } = {}) {
  const value = policy[key];
  if (!Array.isArray(value)) {
    if (required) issues.push(`${key} must be an array.`);
    return [];
  }
  const normalized = value.filter((item) => typeof item === "string" && item.trim());
  if (normalized.length !== value.length) issues.push(`${key} must contain only non-empty strings.`);
  const duplicates = normalized.filter((item, index) => normalized.indexOf(item) !== index);
  if (duplicates.length) issues.push(`${key} has duplicate values: ${unique(duplicates).join(", ")}.`);
  return unique(normalized);
}

function stringMapPolicy(policy, key, issues, { required = true } = {}) {
  const value = policy[key];
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    if (required) issues.push(`${key} must be an object.`);
    return new Map();
  }
  return new Map(Object.entries(value).filter(([from, to]) => {
    const valid = typeof from === "string" && from.trim() && typeof to === "string" && to.trim();
    if (!valid) issues.push(`${key} must contain only non-empty string keys and values.`);
    return valid;
  }));
}

function arrayMapPolicy(policy, key, issues, { slugKeys = false } = {}) {
  const value = policy[key] ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push(`${key} must be an object keyed by id.`);
    return {};
  }
  return Object.fromEntries(Object.entries(value).map(([id, entries]) => [
    slugKeys ? slug(id) : id,
    Array.isArray(entries) ? stringArrayPolicy({ entries }, "entries", issues, { required: false }) : [],
  ]));
}

function numberMapPolicy(policy, key, issues) {
  const value = policy[key] ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push(`${key} must be an object keyed by metric name.`);
    return {};
  }
  return Object.fromEntries(Object.entries(value).filter(([name, amount]) => {
    const validName = typeof name === "string" && name.trim();
    const validAmount = Number.isFinite(amount) && amount >= 0;
    if (!validName || !validAmount) issues.push(`${key} must contain non-empty string keys and non-negative numeric values.`);
    return validName && validAmount;
  }));
}

function unusedPrimitiveClassificationPolicy(policy, issues) {
  const value = policy.unusedPrimitiveClassifications ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push("unusedPrimitiveClassifications must be an object keyed by primitive id.");
    return {};
  }
  return Object.fromEntries(Object.entries(value).filter(([id, rule]) => {
    const hasStaticClassification = typeof rule?.classification === "string" && rule.classification.trim();
    const hasTemplateClassifications = typeof rule?.classificationWithTemplateMentions === "string"
      && rule.classificationWithTemplateMentions.trim()
      && typeof rule?.classificationWithoutTemplateMentions === "string"
      && rule.classificationWithoutTemplateMentions.trim();
    const hasDirectPatternPolicy = typeof rule?.directPatternRequired === "boolean"
      || typeof rule?.directPatternRequiredWhenTemplateMentioned === "boolean";
    const valid = typeof id === "string"
      && id.trim()
      && (hasStaticClassification || hasTemplateClassifications)
      && hasDirectPatternPolicy
      && typeof rule?.reason === "string"
      && rule.reason.trim()
      && typeof rule?.migrationAction === "string"
      && rule.migrationAction.trim();
    if (!valid) {
      issues.push(`unusedPrimitiveClassifications.${id} must declare classification, directPattern policy, reason, and migrationAction.`);
    }
    return valid;
  }).sort(([a], [b]) => a.localeCompare(b)));
}

function tokenDependencyPolicy(policy, issues) {
  const value = policy.patternTokenDependencyPolicy ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push("patternTokenDependencyPolicy must be an object.");
    return {
      primitiveTokens: {},
      allowedExactTokens: [],
    };
  }
  ["componentPrefix", "componentSuffix", "foundationPrefix", "foundationSuffix"].forEach((key) => {
    if (typeof value[key] !== "string" || !value[key].trim()) {
      issues.push(`patternTokenDependencyPolicy.${key} must be a non-empty string.`);
    }
  });
  return {
    componentPrefix: value.componentPrefix,
    componentSuffix: value.componentSuffix,
    foundationPrefix: value.foundationPrefix,
    foundationSuffix: value.foundationSuffix,
    primitiveTokens: Object.fromEntries(stringMapPolicy(value, "primitiveTokens", issues)),
    allowedExactTokens: stringArrayPolicy(value, "allowedExactTokens", issues),
  };
}

function rawDivWrapperPolicy(policy, issues) {
  const value = policy.rawDivWrapperPolicy ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push("rawDivWrapperPolicy must be an object.");
    return {
      scanWindow: 0,
      qualifierNeedles: [],
      ownedStylingProps: [],
    };
  }
  if (!Number.isInteger(value.scanWindow) || value.scanWindow <= 0) {
    issues.push("rawDivWrapperPolicy.scanWindow must be a positive integer.");
  }
  return {
    scanWindow: value.scanWindow,
    qualifierNeedles: stringArrayPolicy(value, "qualifierNeedles", issues),
    ownedStylingProps: stringArrayPolicy(value, "ownedStylingProps", issues),
  };
}

function architectureWavePolicy(policy, issues) {
  const value = policy.architectureWavePolicy ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push("architectureWavePolicy must be an object.");
    return { waves: [] };
  }
  const waves = Array.isArray(value.waves) ? value.waves.map((wave, index) => {
    const id = typeof wave?.id === "string" && wave.id.trim() ? wave.id : "";
    const label = typeof wave?.label === "string" && wave.label.trim() ? wave.label : "";
    const maxScore = wave?.maxScore === null || wave?.maxScore === undefined ? null : wave.maxScore;
    if (!id) issues.push(`architectureWavePolicy.waves.${index}.id must be a non-empty string.`);
    if (!label) issues.push(`architectureWavePolicy.waves.${index}.label must be a non-empty string.`);
    if (maxScore !== null && !Number.isFinite(maxScore)) {
      issues.push(`architectureWavePolicy.waves.${index}.maxScore must be finite or null.`);
    }
    return {
      id,
      label,
      maxScore,
      formalized: Boolean(wave?.formalized),
      maxPatternCrossings: Number.isFinite(wave?.maxPatternCrossings) ? wave.maxPatternCrossings : null,
      maxTemplateRefs: Number.isFinite(wave?.maxTemplateRefs) ? wave.maxTemplateRefs : null,
      requiresKnownComponents: Boolean(wave?.requiresKnownComponents),
    };
  }) : [];
  if (!Array.isArray(value.waves)) issues.push("architectureWavePolicy.waves must be an array.");
  return { waves };
}

function migrationClassificationPolicy(policy, issues) {
  const value = policy.migrationClassificationPolicy ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push("migrationClassificationPolicy must be an object.");
    return {
      patternDependencyCrossPatternMin: 0,
      statefulStateMin: 0,
      statefulPrimitiveDependencies: [],
      scoreWeights: {},
    };
  }
  if (!Number.isFinite(value.patternDependencyCrossPatternMin)) {
    issues.push("migrationClassificationPolicy.patternDependencyCrossPatternMin must be a finite number.");
  }
  if (!Number.isFinite(value.statefulStateMin)) {
    issues.push("migrationClassificationPolicy.statefulStateMin must be a finite number.");
  }
  return {
    templateFacingMode: value.templateFacingMode,
    primitiveRuntimeMode: value.primitiveRuntimeMode,
    crossPatternMode: value.crossPatternMode,
    statefulMode: value.statefulMode,
    baseMode: value.baseMode,
    patternDependencyCrossPatternMin: value.patternDependencyCrossPatternMin,
    statefulStateMin: value.statefulStateMin,
    statefulRequiresSurface: value.statefulRequiresSurface !== false,
    statefulPrimitiveDependencies: stringArrayPolicy(value, "statefulPrimitiveDependencies", issues),
    scoreWeights: numberMapPolicy(value, "scoreWeights", issues),
  };
}

function readPatternArchitecturePolicy() {
  const issues = [];
  const architectureRaw = fs.existsSync(patternArchitecturePolicyFile)
    ? readPolicyJson(patternArchitecturePolicyFile)
    : {};
  const runtimeRaw = fs.existsSync(patternReactRuntimePolicyFile)
    ? readPolicyJson(patternReactRuntimePolicyFile)
    : {};
  if (!fs.existsSync(patternArchitecturePolicyFile)) {
    issues.push("pattern architecture policy file is missing.");
  }
  if (!fs.existsSync(patternReactRuntimePolicyFile)) {
    issues.push("pattern React runtime policy file is missing.");
  }
  if (!architectureRaw.version) issues.push("pattern architecture policy is missing version.");
  if (!architectureRaw.reason) issues.push("pattern architecture policy is missing reason.");
  if (!runtimeRaw.version) issues.push("pattern React runtime policy is missing version.");
  if (!runtimeRaw.reason) issues.push("pattern React runtime policy is missing reason.");
  const raw = {
    ...architectureRaw,
    ...runtimeRaw,
  };
  const structuralSurfacePrimitive = typeof raw.structuralSurfacePrimitive === "string" && raw.structuralSurfacePrimitive.trim()
    ? raw.structuralSurfacePrimitive
    : "";
  if (!structuralSurfacePrimitive) issues.push("structuralSurfacePrimitive must be a non-empty string.");
  return {
    file: patternArchitecturePolicyFile,
    files: [patternArchitecturePolicyFile, patternReactRuntimePolicyFile],
    runtimeFile: patternReactRuntimePolicyFile,
    raw,
    issues,
    structuralSlotNames: stringArrayPolicy(raw, "structuralSlotNames", issues),
    structuralSurfacePrimitive,
    componentSurfaceOwners: new Set(stringArrayPolicy(raw, "componentSurfaceOwners", issues)),
    componentObjectSurfaces: new Set(stringArrayPolicy(raw, "componentObjectSurfaces", issues)),
    structuralSurfaceExemptComponents: new Set(stringArrayPolicy(raw, "structuralSurfaceExemptComponents", issues)),
    structuralSurfaceForbiddenCopyComponents: new Set(stringArrayPolicy(raw, "structuralSurfaceForbiddenCopyComponents", issues)),
    allowedPatternDomRoots: new Set(stringArrayPolicy(raw, "allowedPatternDomRoots", issues)),
    knownAliasNames: stringMapPolicy(raw, "knownAliasNames", issues),
    primitiveRuntimeExports: new Set(stringArrayPolicy(raw, "primitiveRuntimeExports", issues)),
    primitiveTemplateNeedles: arrayMapPolicy(raw, "primitiveTemplateNeedles", issues, { slugKeys: true }),
    taxonomySignals: stringArrayPolicy(raw, "taxonomySignals", issues),
    taxonomyRequiredLayerChecks: stringMapPolicy(raw, "taxonomyRequiredLayerChecks", issues),
    approvedCrossLayerArtifactIds: new Set(stringArrayPolicy(raw, "approvedCrossLayerArtifactIds", issues)),
    forbiddenVisualTags: new Set(stringArrayPolicy(raw, "forbiddenVisualTags", issues)),
    emailChannelPatternIds: new Set(stringArrayPolicy(raw, "emailChannelPatternIds", issues, { required: false })),
    emailChannelAllowedTags: new Set(stringArrayPolicy(raw, "emailChannelAllowedTags", issues, { required: false })),
    primitiveReactImports: stringMapPolicy(raw, "primitiveReactImports", issues),
    foundationPrimitiveHints: arrayMapPolicy(raw, "foundationPrimitiveHints", issues),
    complexityWeights: numberMapPolicy(raw, "complexityWeights", issues),
    foundationPrimitiveDebtWeights: numberMapPolicy(raw, "foundationPrimitiveDebtWeights", issues),
    architectureExpectedInventory: numberMapPolicy(raw, "architectureExpectedInventory", issues),
    foundationPrimitiveExpectedInventory: numberMapPolicy(raw, "foundationPrimitiveExpectedInventory", issues),
    runtimePrimitivePatternDependencies: new Set(stringArrayPolicy(raw, "runtimePrimitivePatternDependencies", issues)),
    templateFacingSignals: stringArrayPolicy(raw, "templateFacingSignals", issues),
    migrationWaveLabels: stringMapPolicy(raw, "migrationWaveLabels", issues),
    architectureWavePolicy: architectureWavePolicy(raw, issues),
    migrationClassificationPolicy: migrationClassificationPolicy(raw, issues),
    nonNegotiableMigrationRules: stringArrayPolicy(raw, "nonNegotiableMigrationRules", issues),
    forbiddenTypeProps: stringArrayPolicy(raw, "forbiddenTypeProps", issues),
    controlledPropPairs: arrayMapPolicy(raw, "controlledPropPairs", issues),
    displayOnlyProps: Object.fromEntries(Object.entries(arrayMapPolicy(raw, "displayOnlyProps", issues))
      .map(([name, props]) => [name, new Set(props)])),
    inheritedDomProps: new Set(stringArrayPolicy(raw, "inheritedDomProps", issues)),
    inheritedDomPropPrefixes: stringArrayPolicy(raw, "inheritedDomPropPrefixes", issues),
    accessibilityDelegatingComponents: new Set(stringArrayPolicy(raw, "accessibilityDelegatingComponents", issues)),
    patternContractGovernanceGroups: stringMapPolicy(raw, "patternContractGovernanceGroups", issues),
    patternBoundaryArtifactFields: stringArrayPolicy(raw, "patternBoundaryArtifactFields", issues),
    patternBoundaryLanguageTerms: stringArrayPolicy(raw, "patternBoundaryLanguageTerms", issues),
    patternContractDependencyGroups: stringMapPolicy(raw, "patternContractDependencyGroups", issues),
    patternTokenDependencyPolicy: tokenDependencyPolicy(raw, issues),
    primitiveSlotRuntimeEvidence: arrayMapPolicy(raw, "primitiveSlotRuntimeEvidence", issues),
    patternRuntimeMarkers: Object.fromEntries(stringMapPolicy(raw, "patternRuntimeMarkers", issues)),
    patternContractRequiredHeadings: Object.fromEntries(stringMapPolicy(raw, "patternContractRequiredHeadings", issues)),
    rawDivWrapperPolicy: rawDivWrapperPolicy(raw, issues),
    forbiddenPatternImportNeedles: arrayMapPolicy(raw, "forbiddenPatternImportNeedles", issues),
    literalContractProps: stringArrayPolicy(raw, "literalContractProps", issues),
    stateCascadeCarrierProps: stringArrayPolicy(raw, "stateCascadeCarrierProps", issues),
    unusedPrimitiveClassifications: unusedPrimitiveClassificationPolicy(raw, issues),
    behaviorExpectedInventory: numberMapPolicy(raw, "behaviorExpectedInventory", issues),
    migrationExpectedInventory: numberMapPolicy(raw, "migrationExpectedInventory", issues),
    compositionExpectedInventory: numberMapPolicy(raw, "compositionExpectedInventory", issues),
  };
}

module.exports = {
  readPatternArchitecturePolicy,
};
