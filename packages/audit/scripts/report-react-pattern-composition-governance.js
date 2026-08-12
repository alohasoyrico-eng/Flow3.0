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
const jsonOutput = path.join(outputDir, "react-pattern-composition-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-pattern-composition-governance-audit.md");
const reactPatternDir = path.join(root, "packages/react/src/patterns");
const patternArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const patternCopyDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const patternContractDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const reactSrcDir = path.join(root, "packages/react/src");
const patternArchitecturePolicy = readPatternArchitecturePolicy();
const {
  forbiddenVisualTags,
  emailChannelPatternIds,
  emailChannelAllowedTags,
  primitiveReactImports,
  structuralSurfaceForbiddenCopyComponents,
  structuralSurfacePrimitive,
  patternBoundaryArtifactFields,
  patternBoundaryLanguageTerms,
  patternContractDependencyGroups,
  patternTokenDependencyPolicy,
  primitiveSlotRuntimeEvidence,
  patternRuntimeMarkers,
  patternContractRequiredHeadings,
  rawDivWrapperPolicy,
  forbiddenPatternImportNeedles,
  compositionExpectedInventory: expectedInventory,
} = patternArchitecturePolicy;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function pascalCase(value) {
  const normalized = String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
  return normalized
    .replace(/^KPI/, "Kpi")
    .replace(/OTP/g, "Otp");
}

function kebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .flatMap((entry) => {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) return listFiles(file, predicate);
      return predicate(file) ? [file] : [];
    })
    .sort();
}

function listPatternArtifactIds() {
  return [...patternArtifactIds];
}

function artifactFor(patternId) {
  const file = path.join(patternArtifactDir, `${patternId}.json`);
  if (!fs.existsSync(file)) return null;
  const json = readJson(file);
  return json.artifacts?.patterns?.[patternId] ?? null;
}

function patternCopyFor(patternId) {
  const file = path.join(patternCopyDir, patternId, "all.json");
  if (!fs.existsSync(file)) return null;
  const json = readJson(file);
  return json.patterns?.[patternId] ?? null;
}

function importNames(source) {
  return [...source.matchAll(/import\s+\{\s*([^}]+)\s*\}\s+from\s+"([^"]+)"/g)]
    .flatMap((match) => match[1]
      .split(",")
      .map((entry) => {
        const [name, alias] = entry.trim().split(/\s+as\s+/).map((part) => part.trim());
        return alias || name;
      })
      .filter(Boolean)
      .map((name) => ({ name, from: match[2] })));
}

function importEntries(source) {
  return [...source.matchAll(/import\s+\{\s*([^}]+)\s*\}\s+from\s+"([^"]+)"/g)]
    .flatMap((match) => match[1]
      .split(",")
      .map((entry) => {
        const [importedName, localName] = entry.trim().split(/\s+as\s+/).map((part) => part.trim());
        return { importedName, localName: localName || importedName, from: match[2] };
      })
      .filter((entry) => entry.importedName && entry.localName));
}

function boundaryText(artifact) {
  return JSON.stringify(patternBoundaryArtifactFields.map((field) => artifact?.[field] ?? [])).toLowerCase();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function documentsPatternBoundary(artifact, dependencyName) {
  const text = boundaryText(artifact);
  const needle = dependencyName
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .trim()
    .toLowerCase();
  const compactNeedle = dependencyName.toLowerCase();
  const hasDependencyMention = text.includes(needle) || text.includes(compactNeedle);
  const boundaryLanguagePattern = new RegExp(`\\b(${patternBoundaryLanguageTerms.map(escapeRegExp).join("|")})\\b`);
  const hasBoundaryLanguage = boundaryLanguagePattern.test(text);
  return hasDependencyMention && hasBoundaryLanguage;
}

function rawVisualTags(source, patternId) {
  const emailChannelPattern = emailChannelPatternIds.has(patternId);
  return [...source.matchAll(/React\.createElement\(\s*"([^"]+)"/g)]
    .map((match) => match[1])
    .filter((tag) => forbiddenVisualTags.has(tag))
    .filter((tag) => !(emailChannelPattern && emailChannelAllowedTags.has(tag)));
}

function lineForIndex(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function collectRawDivContracts(source, patternId) {
  if (emailChannelPatternIds.has(patternId)) return [];
  return [...source.matchAll(/React\.createElement\(\s*"div"\s*,/g)].map((match) => {
    const snippet = source.slice(match.index, match.index + rawDivWrapperPolicy.scanWindow);
    const isRoot = snippet.includes(`"${patternRuntimeMarkers.pattern}"`);
    const hasNullProps = /React\.createElement\(\s*"div"\s*,\s*null\b/.test(snippet);
    const hasQualifier = rawDivWrapperPolicy.qualifierNeedles.some((needle) => snippet.includes(needle));
    const hasOwnedStyling = !isRoot && rawDivWrapperPolicy.ownedStylingProps.some((prop) => new RegExp(`\\b${escapeRegExp(prop)}\\s*:`).test(snippet));
    const issues = [
      ...(hasNullProps ? ["unqualified div wrapper"] : []),
      ...(!hasNullProps && !hasQualifier ? ["div wrapper missing role/aria/data qualifier"] : []),
      ...(hasOwnedStyling ? ["internal div wrapper owns className/style"] : []),
    ];
    return {
      line: lineForIndex(source, match.index),
      root: isRoot,
      qualified: hasQualifier,
      issues,
    };
  });
}

function slotUseIssues({
  artifact,
  expectedComponents,
  expectedPatternDependencies,
  componentImports,
  patternImports,
}) {
  const componentSet = new Set(expectedComponents);
  const componentImportSet = new Set(componentImports);
  const primitiveSet = new Set(artifact?.primitiveDependencies ?? []);
  const patternSet = new Set(expectedPatternDependencies);
  const patternImportSet = new Set(patternImports);
  return (artifact?.slots ?? []).flatMap((slot) => (slot.uses ?? []).flatMap((use) => {
    const normalizedUse = pascalCase(use);
    if (slot.owner === "component") {
      return [
        ...(!componentSet.has(normalizedUse) ? [`${slot.name}: component use ${use} missing from componentDependencies`] : []),
        ...(!componentImportSet.has(normalizedUse) ? [`${slot.name}: component use ${use} not imported by React`] : []),
      ];
    }
    if (slot.owner === "primitive") {
      return [
        ...(!primitiveSet.has(use) ? [`${slot.name}: primitive use ${use} missing from primitiveDependencies`] : []),
        ...(use === structuralSurfacePrimitive && !componentImportSet.has(structuralSurfacePrimitive) ? [`${slot.name}: ${structuralSurfacePrimitive} primitive not imported by React`] : []),
      ];
    }
    if (slot.owner === "pattern") {
      return [
        ...(!patternSet.has(normalizedUse) ? [`${slot.name}: pattern use ${use} missing from patternDependencies`] : []),
        ...(!patternImportSet.has(normalizedUse) ? [`${slot.name}: pattern use ${use} not imported by React`] : []),
      ];
    }
    if (slot.owner === "channel") return [];
    return [`${slot.name}: unknown slot owner ${slot.owner}`];
  }));
}

function slotRenderEvidenceIssues({ patternId, artifact, source }) {
  return (artifact?.slots ?? []).flatMap((slot) => (slot.uses ?? []).flatMap((use) => {
    const normalizedUse = pascalCase(use);
    if (slot.owner === "component" || slot.owner === "pattern") {
      return new RegExp(`React\\.createElement\\(\\s*${normalizedUse}\\b`).test(source)
        ? []
        : [`${slot.name}: ${slot.owner} use ${use} has no React render evidence`];
    }
    if (slot.owner === "primitive" && use === structuralSurfacePrimitive) {
      return source.includes(`"${patternRuntimeMarkers.slot}": "${slot.name}"`) || source.includes(`"${patternRuntimeMarkers.slot}": '${slot.name}'`)
        ? []
        : [`${slot.name}: ${structuralSurfacePrimitive} primitive slot missing ${patternRuntimeMarkers.slot} evidence`];
    }
    if (slot.owner === "primitive" && primitiveSlotRuntimeEvidence[use]) {
      const needles = primitiveSlotRuntimeEvidence[use];
      return needles.some((needle) => source.includes(needle))
        ? []
        : [`${slot.name}: ${use} primitive slot has no primitive runtime evidence`];
    }
    return [];
  })).map((issue) => `${patternId}: ${issue}`);
}

function tokenDependencyIssues(artifact) {
  const tokens = new Set(artifact?.tokenDependencies ?? []);
  const expectedComponentTokens = new Set((artifact?.componentDependencies ?? [])
    .map((component) => `${patternTokenDependencyPolicy.componentPrefix}${slug(component)}${patternTokenDependencyPolicy.componentSuffix}`));
  const expectedFoundationTokens = new Set((artifact?.governingFoundations ?? [])
    .map((foundation) => `${patternTokenDependencyPolicy.foundationPrefix}${slug(foundation)}${patternTokenDependencyPolicy.foundationSuffix}`));
  const componentTokenIssues = (artifact?.componentDependencies ?? [])
    .map((component) => `${patternTokenDependencyPolicy.componentPrefix}${slug(component)}${patternTokenDependencyPolicy.componentSuffix}`)
    .filter((token) => !tokens.has(token))
    .map((token) => `missing component token dependency ${token}`);
  const foundationTokenIssues = (artifact?.governingFoundations ?? [])
    .map((foundation) => `${patternTokenDependencyPolicy.foundationPrefix}${slug(foundation)}${patternTokenDependencyPolicy.foundationSuffix}`)
    .filter((token) => !tokens.has(token))
    .map((token) => `missing governing foundation token dependency ${token}`);
  const primitiveTokenIssues = (artifact?.primitiveDependencies ?? [])
    .map((primitive) => patternTokenDependencyPolicy.primitiveTokens[primitive])
    .filter(Boolean)
    .filter((token) => !tokens.has(token))
    .map((token) => `missing primitive token dependency ${token}`);
  const unknownTokenIssues = (artifact?.tokenDependencies ?? [])
    .filter((token) => !(token.startsWith(patternTokenDependencyPolicy.componentPrefix)
      || token.startsWith(patternTokenDependencyPolicy.foundationPrefix)
      || patternTokenDependencyPolicy.allowedExactTokens.includes(token)))
    .map((token) => `unknown token dependency namespace ${token}`);
  const extraComponentTokenIssues = (artifact?.tokenDependencies ?? [])
    .filter((token) => token.startsWith(patternTokenDependencyPolicy.componentPrefix) && !expectedComponentTokens.has(token))
    .map((token) => `component token dependency ${token} has no matching componentDependencies entry`);
  const extraFoundationTokenIssues = (artifact?.tokenDependencies ?? [])
    .filter((token) => token.startsWith(patternTokenDependencyPolicy.foundationPrefix) && !expectedFoundationTokens.has(token))
    .map((token) => `foundation token dependency ${token} has no matching governingFoundations entry`);
  return [
    ...componentTokenIssues,
    ...foundationTokenIssues,
    ...primitiveTokenIssues,
    ...unknownTokenIssues,
    ...extraComponentTokenIssues,
    ...extraFoundationTokenIssues,
  ];
}

function patternCopyComponentIssues(patternId, artifact) {
  const copy = patternCopyFor(patternId);
  if (!copy) return [`${patternId}: missing pattern-copy contract`];
  const artifactComponents = (artifact?.componentDependencies ?? []).map(pascalCase).sort();
  const copyComponents = (copy.componentsUsed ?? []).map(pascalCase).sort();
  const missing = artifactComponents.filter((component) => !copyComponents.includes(component));
  const extra = copyComponents.filter((component) => !artifactComponents.includes(component));
  return [
    ...(missing.length ? [`${patternId}: pattern-copy missing components ${missing.join(", ")}`] : []),
    ...(extra.length ? [`${patternId}: pattern-copy lists undeclared components ${extra.join(", ")}`] : []),
  ];
}

function patternCopyFoundationIssues(patternId, artifact) {
  const copy = patternCopyFor(patternId);
  if (!copy) return [`${patternId}: missing pattern-copy contract`];
  const artifactFoundations = (artifact?.governingFoundations ?? []).map(slug).sort();
  const copyFoundations = (copy.foundations ?? [])
    .map((entry) => Array.isArray(entry) ? entry[0] : entry)
    .map(slug)
    .sort();
  const missing = artifactFoundations.filter((foundation) => !copyFoundations.includes(foundation));
  const extra = copyFoundations.filter((foundation) => !artifactFoundations.includes(foundation));
  return [
    ...(missing.length ? [`${patternId}: pattern-copy missing foundations ${missing.join(", ")}`] : []),
    ...(extra.length ? [`${patternId}: pattern-copy lists undeclared foundations ${extra.join(", ")}`] : []),
  ];
}

function patternCopySurfaceIssues(patternId, artifact) {
  const copy = patternCopyFor(patternId);
  if (!copy) return [`${patternId}: missing pattern-copy contract`];
  const surfaceSlotNames = (artifact?.slots ?? [])
    .filter((slot) => slot.owner === "primitive" && (slot.uses ?? []).includes(structuralSurfacePrimitive))
    .map((slot) => slug(slot.name));
  if (!surfaceSlotNames.length) return [];
  const copySlots = copy.slots ?? [];
  const surfacePattern = new RegExp(`\\b${escapeRegExp(structuralSurfacePrimitive)}\\b`);
  const forbiddenComponentPattern = structuralSurfaceForbiddenCopyComponents.size
    ? new RegExp(`\\b(${[...structuralSurfaceForbiddenCopyComponents].map(escapeRegExp).join("|")})(?:\\[\\])?\\b`)
    : /$a/;
  const hasSurfaceSlot = copySlots.some((row) => surfacePattern.test(String(row[1] ?? "")));
  const structuralCardRows = copySlots
    .filter((row) => surfaceSlotNames.includes(slug(row[0])))
    .filter((row) => forbiddenComponentPattern.test(String(row[1] ?? "")))
    .map((row) => `${row[0]}: ${row[1]}`);
  return [
    ...(!hasSurfaceSlot ? [`${patternId}: pattern-copy missing ${structuralSurfacePrimitive} slot for structural primitive ${surfaceSlotNames.join(", ")}`] : []),
    ...(structuralCardRows.length ? [`${patternId}: structural ${structuralSurfacePrimitive} slot lists component wrapper ${structuralCardRows.join("; ")}`] : []),
  ];
}

function patternCopyPrimitiveSlotIssues(patternId, artifact) {
  const copy = patternCopyFor(patternId);
  if (!copy) return [`${patternId}: missing pattern-copy contract`];
  const primitiveSlots = (artifact?.slots ?? [])
    .filter((slot) => slot.owner === "primitive")
    .map((slot) => ({ name: slug(slot.name), uses: (slot.uses ?? []).map(slug).sort() }));
  const copySlots = new Map((copy.slots ?? [])
    .map((row) => [slug(row[0]), String(row[1] ?? "").split(/\s*\|\s*/).map((part) => slug(part.replace(/\[\]$/, ""))).filter(Boolean).sort()]));
  return primitiveSlots.flatMap((slot) => {
    const copyUses = copySlots.get(slot.name);
    if (!copyUses) return [`${patternId}: pattern-copy missing primitive slot ${slot.name}`];
    const missingUses = slot.uses.filter((use) => !copyUses.includes(use));
    return missingUses.length
      ? [`${patternId}: pattern-copy primitive slot ${slot.name} missing ${missingUses.join(", ")}`]
      : [];
  });
}

function normalizedSearchText(value) {
  const raw = JSON.stringify(value ?? {}).toLowerCase();
  return `${raw} ${slug(raw)}`;
}

function hasDependencyMention(text, dependency) {
  const dependencySlug = slug(dependency);
  return text.includes(dependencySlug) || text.includes(dependencySlug.replace(/-/g, " "));
}

function hasBoundaryLanguage(text) {
  return new RegExp(`\\b(${patternBoundaryLanguageTerms.map(escapeRegExp).join("|")})\\b`).test(text);
}

function patternCopyPatternDependencyIssues(patternId, artifact) {
  const copy = patternCopyFor(patternId);
  if (!copy) return [`${patternId}: missing pattern-copy contract`];
  const text = normalizedSearchText(copy);
  return (artifact?.patternDependencies ?? [])
    .filter((dependency) => !hasDependencyMention(text, dependency))
    .map((dependency) => `${patternId}: pattern-copy missing pattern dependency ${dependency}`);
}

function patternCopyBoundaryDependencyIssues(patternId, boundaryOnlyDependencies) {
  if (!boundaryOnlyDependencies.length) return [];
  const copy = patternCopyFor(patternId);
  if (!copy) return [`${patternId}: missing pattern-copy contract`];
  const text = normalizedSearchText(copy);
  return boundaryOnlyDependencies
    .filter((dependency) => !hasDependencyMention(text, dependency) || !hasBoundaryLanguage(text))
    .map((dependency) => `${patternId}: pattern-copy missing boundary language for ${dependency}`);
}

function patternContractDependencyIssues(patternId, artifact) {
  const contractFile = path.join(patternContractDir, `${patternId}.md`);
  const dependencyGroups = [...patternContractDependencyGroups.entries()]
    .map(([label, field]) => [label, artifact?.[field] ?? []])
    .filter(([, values]) => values.length);
  if (!dependencyGroups.length) return [];
  if (!fs.existsSync(contractFile)) {
    return [`${patternId}: missing portable pattern contract ${rel(contractFile)}`];
  }
  const markdown = fs.readFileSync(contractFile, "utf8");
  if (!new RegExp(`^${escapeRegExp(patternContractRequiredHeadings.dependencies)}$`, "m").test(markdown)) {
    return [`${patternId}: portable pattern contract missing Formal Dependencies section`];
  }
  return dependencyGroups.flatMap(([label, values]) => {
    const missingHeading = !new RegExp(`^### ${label}$`, "m").test(markdown);
    const missingValues = values.filter((value) => !markdown.includes(`\`${value}\``));
    return [
      ...(missingHeading ? [`${patternId}: portable pattern contract missing ${label} dependency group`] : []),
      ...(missingValues.length ? [`${patternId}: portable pattern contract missing ${label} dependencies ${missingValues.join(", ")}`] : []),
    ];
  });
}

function patternContractSlotIssues(patternId, artifact) {
  const formalSlots = artifact?.slots ?? [];
  if (!formalSlots.length) return [];
  const contractFile = path.join(patternContractDir, `${patternId}.md`);
  if (!fs.existsSync(contractFile)) {
    return [`${patternId}: missing portable pattern contract ${rel(contractFile)}`];
  }
  const markdown = fs.readFileSync(contractFile, "utf8");
  if (!new RegExp(`^${escapeRegExp(patternContractRequiredHeadings.slots)}$`, "m").test(markdown)) {
    return [`${patternId}: portable pattern contract missing Formal Slots section`];
  }
  return formalSlots.flatMap((slot) => {
    const missingSlot = !markdown.includes(`\`${slot.name}\``);
    const missingOwner = !markdown.includes(`\`${slot.owner}\``);
    const missingUses = (slot.uses ?? []).filter((use) => !markdown.includes(`\`${use}\``));
    return [
      ...(missingSlot ? [`${patternId}: portable pattern contract missing formal slot ${slot.name}`] : []),
      ...(missingOwner ? [`${patternId}: portable pattern contract missing owner ${slot.owner} for slot ${slot.name}`] : []),
      ...(missingUses.length ? [`${patternId}: portable pattern contract slot ${slot.name} missing uses ${missingUses.join(", ")}`] : []),
    ];
  });
}

function createReport() {
  const artifactIds = listPatternArtifactIds();
  const implementationFiles = listFiles(reactPatternDir, (file) => /^[A-Z].*\.js$/.test(path.basename(file)));
  const componentFiles = new Set(listFiles(reactSrcDir, (file) => /^[A-Z].*\.js$/.test(path.basename(file)))
    .map((file) => path.basename(file, ".js")));
  const patterns = implementationFiles.map((file) => {
    const componentName = path.basename(file, ".js");
    const patternId = kebabCase(componentName);
    const source = fs.readFileSync(file, "utf8");
    const artifact = artifactFor(patternId);
    const expectedComponents = (artifact?.componentDependencies ?? []).map(pascalCase).sort();
    const expectedPatternDependencies = (artifact?.patternDependencies ?? []).map(pascalCase).sort();
    const imports = importNames(source);
    const importEntryList = importEntries(source);
    const componentImports = imports
      .filter((item) => item.from.startsWith("../") && !item.from.startsWith("../internal/"))
      .map((item) => item.name)
      .sort();
    const patternImports = imports
      .filter((item) => item.from.startsWith("./"))
      .map((item) => item.name)
      .sort();
    const allowedPrimitiveImports = [...primitiveReactImports.entries()]
      .filter(([component, primitive]) => (artifact?.primitiveDependencies ?? []).includes(primitive)
        && componentImports.includes(component))
      .map(([component]) => component);
    const unknownComponentImports = componentImports.filter((name) => !componentFiles.has(name));
    const aliasedFlowImports = importEntryList
      .filter((item) => (item.from.startsWith("../") || item.from.startsWith("./")) && item.importedName !== item.localName)
      .map((item) => `${item.importedName} as ${item.localName}`);
    const missingRequiredComponentImports = expectedComponents.filter((name) => !componentImports.includes(name));
    const undeclaredComponentImports = componentImports.filter((name) => !expectedComponents.includes(name)
      && !allowedPrimitiveImports.includes(name)
      && componentFiles.has(name));
    const missingRuntimePatternImports = expectedPatternDependencies.filter((name) => !patternImports.includes(name));
    const undeclaredPatternImports = patternImports.filter((name) => !expectedPatternDependencies.includes(name));
    const boundaryOnlyPatternDependencies = missingRuntimePatternImports
      .filter((name) => documentsPatternBoundary(artifact, name));
    const undocumentedPatternBoundaries = missingRuntimePatternImports
      .filter((name) => !boundaryOnlyPatternDependencies.includes(name));
    const rawDomVisuals = rawVisualTags(source, patternId);
    const rawDivContracts = collectRawDivContracts(source, patternId);
    const rawDivIssues = rawDivContracts
      .flatMap((contract) => contract.issues.map((issue) => `line ${contract.line}: ${issue}`));
    const slotIssues = slotUseIssues({
      artifact,
      expectedComponents,
      expectedPatternDependencies,
      componentImports,
      patternImports,
    });
    const slotRenderEvidenceIssuesList = slotRenderEvidenceIssues({ patternId, artifact, source });
    const primitiveSlots = (artifact?.slots ?? []).flatMap((slot) => (slot.uses ?? [])
      .filter(() => slot.owner === "primitive")
      .map((use) => ({ slot: slot.name, use })));
    const primitiveSlotsWithRuntimeEvidence = primitiveSlots.filter((slot) => {
      if (slot.use === structuralSurfacePrimitive) {
        return source.includes(`"${patternRuntimeMarkers.slot}": "${slot.slot}"`) || source.includes(`"${patternRuntimeMarkers.slot}": '${slot.slot}'`);
      }
      return (primitiveSlotRuntimeEvidence[slot.use] ?? []).some((needle) => source.includes(needle));
    });
    const tokenIssues = tokenDependencyIssues(artifact);
    const copyComponentIssues = patternCopyComponentIssues(patternId, artifact);
    const copyFoundationIssues = patternCopyFoundationIssues(patternId, artifact);
    const copySurfaceIssues = patternCopySurfaceIssues(patternId, artifact);
    const copyPrimitiveSlotIssues = patternCopyPrimitiveSlotIssues(patternId, artifact);
    const copyPatternDependencyIssues = patternCopyPatternDependencyIssues(patternId, artifact);
    const copyBoundaryDependencyIssues = patternCopyBoundaryDependencyIssues(patternId, boundaryOnlyPatternDependencies);
    const contractDependencyIssues = patternContractDependencyIssues(patternId, artifact);
    const contractSlotIssues = patternContractSlotIssues(patternId, artifact);
    const docsDependencies = imports
      .filter((item) => (forbiddenPatternImportNeedles.docs ?? []).some((needle) => item.from.includes(needle)))
      .map((item) => item.from);
    const workspaceDependencies = imports
      .filter((item) => (forbiddenPatternImportNeedles.workspace ?? []).some((needle) => item.from.includes(needle)))
      .map((item) => item.from);
    const visualClassLiterals = [...source.matchAll(/className:\s*"([^"]+)"/g)].map((match) => match[1]);
    return {
      patternId,
      source: rel(file),
      artifact: artifact ? rel(path.join(patternArtifactDir, `${patternId}.json`)) : null,
      expectedComponents,
      expectedPatternDependencies,
      componentImports,
      patternImports,
      allowedPrimitiveImports,
      primitiveDependencies: artifact?.primitiveDependencies ?? [],
      governingFoundations: artifact?.governingFoundations ?? [],
      missingFormalArtifact: artifact ? 0 : 1,
      missingRequiredComponentImports,
      undeclaredComponentImports,
      missingRuntimePatternImports,
      boundaryOnlyPatternDependencies,
      undocumentedPatternBoundaries,
      undeclaredPatternImports,
      slotCount: artifact?.slots?.length ?? 0,
      slotUseCount: (artifact?.slots ?? []).reduce((total, slot) => total + (slot.uses ?? []).length, 0),
      slotIssues,
      slotRenderEvidenceIssues: slotRenderEvidenceIssuesList,
      primitiveSlotUses: primitiveSlots.length,
      primitiveSurfaceSlotUses: primitiveSlots.filter((slot) => slot.use === structuralSurfacePrimitive).length,
      primitiveMapsSlotUses: primitiveSlots.filter((slot) => slot.use === "Maps").length,
      primitiveSlotRuntimeEvidence: primitiveSlotsWithRuntimeEvidence.length,
      tokenDependencyCount: artifact?.tokenDependencies?.length ?? 0,
      tokenIssues,
      copyComponentIssues,
      copyFoundationIssues,
      copySurfaceIssues,
      copyPrimitiveSlotIssues,
      copyPatternDependencyIssues,
      copyBoundaryDependencyIssues,
      contractDependencyIssues,
      contractSlotIssues,
      unknownComponentImports,
      aliasedFlowImports,
      rawDomVisuals,
      rawDivCount: rawDivContracts.length,
      qualifiedRawDivs: rawDivContracts.filter((contract) => contract.qualified).length,
      rawDivIssues,
      docsDependencies,
      workspaceDependencies,
      visualClassLiterals,
      hasDataFlowPattern: source.includes(`${patternRuntimeMarkers.pattern}": "${patternId}"`) || source.includes(`${patternRuntimeMarkers.pattern}": '${patternId}'`),
    };
  });
  const inventory = {
    formalPatternArtifacts: artifactIds.length,
    implementedReactPatterns: patterns.length,
    patternArchitecturePolicyIssues: patternArchitecturePolicy.issues.length,
    patternArchitectureForbiddenVisualTags: forbiddenVisualTags.size,
    patternArchitectureEmailChannelPatterns: emailChannelPatternIds.size,
    patternArchitectureEmailChannelAllowedTags: emailChannelAllowedTags.size,
    patternArchitecturePrimitiveReactImports: primitiveReactImports.size,
    structuralSurfaceForbiddenCopyComponents: structuralSurfaceForbiddenCopyComponents.size,
    patternBoundaryArtifactFieldPolicy: patternBoundaryArtifactFields.length,
    patternBoundaryLanguageTermPolicy: patternBoundaryLanguageTerms.length,
    patternContractDependencyGroupPolicy: patternContractDependencyGroups.size,
    patternPrimitiveTokenPolicy: Object.keys(patternTokenDependencyPolicy.primitiveTokens).length,
    patternAllowedExactTokenPolicy: patternTokenDependencyPolicy.allowedExactTokens.length,
    primitiveSlotRuntimeEvidencePolicy: Object.values(primitiveSlotRuntimeEvidence).reduce((total, needles) => total + needles.length, 0),
    patternRuntimeMarkerPolicy: Object.keys(patternRuntimeMarkers).length,
    patternContractRequiredHeadingPolicy: Object.keys(patternContractRequiredHeadings).length,
    rawDivWrapperPolicyEntries: rawDivWrapperPolicy.qualifierNeedles.length + rawDivWrapperPolicy.ownedStylingProps.length + 1,
    forbiddenPatternImportNeedlePolicy: Object.values(forbiddenPatternImportNeedles).reduce((total, needles) => total + needles.length, 0),
    missingFormalArtifacts: patterns.reduce((total, pattern) => total + pattern.missingFormalArtifact, 0),
    patternsWithDeclaredFoundations: patterns.filter((pattern) => pattern.governingFoundations.length > 0).length,
    patternsWithDeclaredPrimitives: patterns.filter((pattern) => pattern.primitiveDependencies.length > 0).length,
    missingRequiredComponentImports: patterns.reduce((total, pattern) => total + pattern.missingRequiredComponentImports.length, 0),
    undeclaredComponentImports: patterns.reduce((total, pattern) => total + pattern.undeclaredComponentImports.length, 0),
    unknownComponentImports: patterns.reduce((total, pattern) => total + pattern.unknownComponentImports.length, 0),
    aliasedFlowImports: patterns.reduce((total, pattern) => total + pattern.aliasedFlowImports.length, 0),
    rawDomVisuals: patterns.reduce((total, pattern) => total + pattern.rawDomVisuals.length, 0),
    rawDivWrappers: patterns.reduce((total, pattern) => total + pattern.rawDivCount, 0),
    qualifiedRawDivWrappers: patterns.reduce((total, pattern) => total + pattern.qualifiedRawDivs, 0),
    unqualifiedRawDivs: patterns.reduce((total, pattern) => total + pattern.rawDivIssues.length, 0),
    docsDependencies: patterns.reduce((total, pattern) => total + pattern.docsDependencies.length, 0),
    workspaceDependencies: patterns.reduce((total, pattern) => total + pattern.workspaceDependencies.length, 0),
    visualClassLiterals: patterns.reduce((total, pattern) => total + pattern.visualClassLiterals.length, 0),
    declaredPatternDependencies: patterns.reduce((total, pattern) => total + pattern.expectedPatternDependencies.length, 0),
    runtimePatternImports: patterns.reduce((total, pattern) => total + pattern.patternImports.length, 0),
    boundaryOnlyPatternDependencies: patterns.reduce((total, pattern) => total + pattern.boundaryOnlyPatternDependencies.length, 0),
    undocumentedPatternBoundaries: patterns.reduce((total, pattern) => total + pattern.undocumentedPatternBoundaries.length, 0),
    undeclaredPatternImports: patterns.reduce((total, pattern) => total + pattern.undeclaredPatternImports.length, 0),
    slotCount: patterns.reduce((total, pattern) => total + pattern.slotCount, 0),
    slotUseCount: patterns.reduce((total, pattern) => total + pattern.slotUseCount, 0),
    slotIssues: patterns.reduce((total, pattern) => total + pattern.slotIssues.length, 0),
    slotRenderEvidenceIssues: patterns.reduce((total, pattern) => total + pattern.slotRenderEvidenceIssues.length, 0),
    primitiveSlotUses: patterns.reduce((total, pattern) => total + pattern.primitiveSlotUses, 0),
    primitiveSurfaceSlotUses: patterns.reduce((total, pattern) => total + pattern.primitiveSurfaceSlotUses, 0),
    primitiveMapsSlotUses: patterns.reduce((total, pattern) => total + pattern.primitiveMapsSlotUses, 0),
    primitiveSlotRuntimeEvidence: patterns.reduce((total, pattern) => total + pattern.primitiveSlotRuntimeEvidence, 0),
    tokenDependencies: patterns.reduce((total, pattern) => total + pattern.tokenDependencyCount, 0),
    tokenIssues: patterns.reduce((total, pattern) => total + pattern.tokenIssues.length, 0),
    patternCopyComponentIssues: patterns.reduce((total, pattern) => total + pattern.copyComponentIssues.length, 0),
    patternCopyFoundationIssues: patterns.reduce((total, pattern) => total + pattern.copyFoundationIssues.length, 0),
    patternCopySurfaceIssues: patterns.reduce((total, pattern) => total + pattern.copySurfaceIssues.length, 0),
    patternCopyPrimitiveSlotIssues: patterns.reduce((total, pattern) => total + pattern.copyPrimitiveSlotIssues.length, 0),
    patternCopyPatternDependencyIssues: patterns.reduce((total, pattern) => total + pattern.copyPatternDependencyIssues.length, 0),
    patternCopyBoundaryDependencyIssues: patterns.reduce((total, pattern) => total + pattern.copyBoundaryDependencyIssues.length, 0),
    patternContractDependencyIssues: patterns.reduce((total, pattern) => total + pattern.contractDependencyIssues.length, 0),
    patternContractSlotIssues: patterns.reduce((total, pattern) => total + pattern.contractSlotIssues.length, 0),
    missingDataFlowPattern: patterns.filter((pattern) => !pattern.hasDataFlowPattern).length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "reactPatternCompositionDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  inventory.reactPatternCompositionDebt = inventory.missingFormalArtifacts
    + inventory.patternArchitecturePolicyIssues
    + inventory.missingRequiredComponentImports
    + inventory.undeclaredComponentImports
    + inventory.unknownComponentImports
    + inventory.aliasedFlowImports
    + inventory.rawDomVisuals
    + inventory.unqualifiedRawDivs
    + inventory.docsDependencies
    + inventory.workspaceDependencies
    + inventory.visualClassLiterals
    + inventory.undocumentedPatternBoundaries
    + inventory.undeclaredPatternImports
    + inventory.slotIssues
    + inventory.slotRenderEvidenceIssues
    + inventory.tokenIssues
    + inventory.patternCopyComponentIssues
    + inventory.patternCopyFoundationIssues
    + inventory.patternCopySurfaceIssues
    + inventory.patternCopyPrimitiveSlotIssues
    + inventory.patternCopyPatternDependencyIssues
    + inventory.patternCopyBoundaryDependencyIssues
    + inventory.patternContractDependencyIssues
    + inventory.patternContractSlotIssues
    + inventory.missingDataFlowPattern
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length;
  return {
    status: inventory.reactPatternCompositionDebt ? "fail" : "pass",
    audit: "react pattern composition governance",
    principle: "React patterns must compose governed Flow components, foundations, and primitives declared by their formal artifact instead of recreating visual behavior or docs-only markup.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    patterns,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.inventory).map(([key, value]) => `| ${key} | ${value} |`);
  const mismatchRows = report.baseline.mismatches.map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics.map((item) => `| ${item.key} | ${item.actual} |`);
  const patternRows = report.patterns.map((pattern) => `| ${pattern.patternId} | ${pattern.expectedComponents.join(", ")} | ${pattern.componentImports.join(", ")} | ${pattern.expectedPatternDependencies.join(", ") || "None"} | ${pattern.patternImports.join(", ") || "None"} | ${pattern.boundaryOnlyPatternDependencies.join(", ") || "None"} | ${pattern.undocumentedPatternBoundaries.join(", ") || "None"} | ${pattern.undeclaredPatternImports.join(", ") || "None"} | ${pattern.slotCount}/${pattern.slotUseCount} | ${pattern.slotIssues.join("; ") || "None"} | ${pattern.slotRenderEvidenceIssues.join("; ") || "None"} | ${pattern.tokenDependencyCount} | ${pattern.tokenIssues.join("; ") || "None"} | ${pattern.copyComponentIssues.join("; ") || "None"} | ${pattern.copyFoundationIssues.join("; ") || "None"} | ${pattern.copySurfaceIssues.join("; ") || "None"} | ${pattern.copyPrimitiveSlotIssues.join("; ") || "None"} | ${pattern.copyPatternDependencyIssues.join("; ") || "None"} | ${pattern.copyBoundaryDependencyIssues.join("; ") || "None"} | ${pattern.contractDependencyIssues.join("; ") || "None"} | ${pattern.contractSlotIssues.join("; ") || "None"} | ${pattern.allowedPrimitiveImports.join(", ") || "None"} | ${pattern.primitiveDependencies.join(", ")} | ${pattern.governingFoundations.join(", ")} | ${pattern.missingRequiredComponentImports.join(", ") || "None"} | ${pattern.undeclaredComponentImports.join(", ") || "None"} | ${pattern.aliasedFlowImports.join(", ") || "None"} | ${pattern.rawDomVisuals.join(", ") || "None"} | ${pattern.rawDivIssues.join("; ") || "None"} |`);
  return [
    "# React Pattern Composition Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    ...inventoryRows,
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
    "## Implemented Patterns",
    "",
    "| Pattern | Artifact components | React component imports | Pattern dependencies | Runtime pattern imports | Boundary-only dependencies | Undocumented boundaries | Undeclared pattern imports | Slots/uses | Slot issues | Slot render evidence issues | Token deps | Token issues | Pattern-copy component issues | Pattern-copy foundation issues | Pattern-copy Surface issues | Pattern-copy primitive slot issues | Pattern-copy pattern dependency issues | Pattern-copy boundary dependency issues | Pattern contract dependency issues | Pattern contract slot issues | Allowed primitive imports | Primitives | Foundations | Missing components | Undeclared component imports | Aliased Flow imports | Raw DOM visuals | Raw div issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...(patternRows.length ? patternRows : ["| None | None | None | None | None | None | None | None | 0/0 | None | None | 0 | None | None | None | None | None | None | None | None | None | None | None | None | None | None | None | None | None |"]),
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
  if (checkMode) {
    const existing = fs.existsSync(jsonOutput) ? readJson(jsonOutput) : null;
    if (!existing || JSON.stringify(existing) !== JSON.stringify(report)) {
      console.error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-react-pattern-composition-governance.js.`);
      process.exitCode = 1;
      return;
    }
  } else {
    writeReport(report);
  }
  if (report.status !== "pass") process.exitCode = 1;
  console.log(JSON.stringify({
    status: report.status,
    audit: report.audit,
    inventory: report.inventory,
  }, null, 2));
}

main();
