#!/usr/bin/env node

const {
  fs,
  goldComponents,
  path,
  patternArtifacts: patternArtifactIds,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { readPatternArchitecturePolicy } = require("./pattern-architecture-policy.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "pattern-1to1-architecture-audit.json");
const markdownOutput = path.join(outputDir, "pattern-1to1-architecture-audit.md");
const copyDir = path.join(root, "packages/content/content/pattern-copy/patterns");
const contractsDir = path.join(root, "packages/content/content/pattern-contracts/patterns");
const artifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const componentArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const catalogDir = path.join(root, "packages/content/content/catalog");
const templateBlueprintsFile = path.join(root, "packages/content/content/template-blueprints.json");
const templateArtifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const docsAppDir = [path.join(root, "../../apps/docs"), path.join(root, "../FlowDocs/apps/docs"), path.join(root, "apps/docs")]
  .find((dir) => fs.existsSync(dir));
const patternArchitecturePolicy = readPatternArchitecturePolicy();
const {
  foundationPrimitiveHints,
  complexityWeights,
  architectureWavePolicy,
  architectureExpectedInventory: expectedInventory,
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

function titleFromId(id) {
  return id.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function flattenStrings(value) {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(flattenStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(flattenStrings);
  return [];
}

function copyPatternIds() {
  return fs.readdirSync(copyDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((id) => fs.existsSync(path.join(copyDir, id, "all.json")))
    .sort();
}

function catalogPatterns() {
  if (!fs.existsSync(catalogDir)) return new Map();
  const rows = fs.readdirSync(catalogDir)
    .filter((file) => /^patterns-.*\.json$/.test(file))
    .flatMap((file) => (readContentJson(path.join(catalogDir, file)).patterns ?? []).map((pattern) => ({
      ...pattern,
      catalogFile: rel(path.join(catalogDir, file)),
    })));
  return new Map(rows.map((pattern) => [pattern.id, pattern]));
}

function patternArtifacts() {
  return new Map(patternArtifactIds
    .map((id) => {
      const file = `${id}.json`;
      const data = readJson(path.join(artifactDir, file)).artifacts?.patterns ?? {};
      return [id, { ...data[id], artifactFile: rel(path.join(artifactDir, file)) }];
    }));
}

function componentArtifacts() {
  const artifacts = fs.existsSync(componentArtifactDir) ? new Map(fs.readdirSync(componentArtifactDir)
    .filter((file) => file.endsWith(".json"))
    .map((file) => {
      const data = readJson(path.join(componentArtifactDir, file)).artifacts?.components ?? {};
      const id = Object.keys(data)[0] ?? file.replace(/\.json$/, "");
      return [id, { ...data[id], artifactFile: rel(path.join(componentArtifactDir, file)) }];
    })) : new Map();
  for (const componentId of goldComponents) {
    if (!artifacts.has(componentId)) {
      artifacts.set(componentId, {
        id: componentId,
        name: titleFromId(componentId),
        primitiveDependencies: [],
        artifactFile: null,
      });
    }
  }
  return artifacts;
}

function docsFiles() {
  if (!docsAppDir) return [];
  return fs.readdirSync(docsAppDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(js|css|html|json)$/.test(entry.name))
    .map((entry) => path.join(docsAppDir, entry.name));
}

function templateReferences(patternNamesBySlug) {
  const refs = new Map();
  function add(id, source, match) {
    refs.set(id, [...(refs.get(id) ?? []), { source, match }]);
  }
  function inspectTemplate(templateName, template, sourcePrefix) {
    for (const text of [
      ...Object.keys(template.patternDetails ?? {}),
      ...(template.patternDependencies ?? []),
    ]) {
      const textSlug = slug(text);
      for (const [id, names] of patternNamesBySlug.entries()) {
        if (names.some((name) => textSlug === slug(name))) {
          add(id, `${sourcePrefix}:${templateName}`, text);
        }
      }
    }
  }
  if (fs.existsSync(templateBlueprintsFile)) {
    const data = readContentJson(templateBlueprintsFile);
    for (const [templateName, template] of Object.entries(data.templates ?? {})) {
      inspectTemplate(templateName, template, "template-blueprints");
    }
  }
  if (fs.existsSync(templateArtifactsDir)) {
    for (const file of fs.readdirSync(templateArtifactsDir).filter((item) => item.endsWith(".json"))) {
      const data = readJson(path.join(templateArtifactsDir, file));
      const templates = data.artifacts?.templates ?? {};
      for (const [templateName, template] of Object.entries(templates)) {
        inspectTemplate(templateName || file, template, `template-artifact:${file}`);
      }
    }
  }
  return refs;
}

function declaredTemplatePatternDependencies(patternNamesBySlug) {
  const knownNames = new Set([...patternNamesBySlug.entries()].flatMap(([id, names]) => [id, ...names].map(slug)));
  const backlog = fs.existsSync(path.join(root, "packages/content/content/pattern-backlog.json"))
    ? readJson(path.join(root, "packages/content/content/pattern-backlog.json"))
    : {};
  const knownTemplateModules = new Set((backlog.classificationRules?.knownTemplateModuleExamples ?? []).map(slug));
  const rows = [];
  function inspect(source, templateName, dependencies) {
    for (const dependency of dependencies ?? []) {
      const dependencyId = slug(dependency);
      rows.push({
        source,
        template: templateName,
        dependency,
        dependencyId,
        formalPatternPresent: knownNames.has(dependencyId),
        knownTemplateModule: knownTemplateModules.has(dependencyId),
        classification: knownNames.has(dependencyId)
          ? "formal-pattern"
          : knownTemplateModules.has(dependencyId)
            ? "template-module-misfiled-as-pattern"
            : "missing-formal-pattern",
      });
    }
  }
  if (fs.existsSync(templateBlueprintsFile)) {
    const data = readContentJson(templateBlueprintsFile);
    for (const [templateName, template] of Object.entries(data.templates ?? {})) {
      inspect("template-blueprints", templateName, Object.keys(template.patternDetails ?? {}));
    }
  }
  if (fs.existsSync(templateArtifactsDir)) {
    for (const file of fs.readdirSync(templateArtifactsDir).filter((item) => item.endsWith(".json"))) {
      const data = readJson(path.join(templateArtifactsDir, file));
      const templates = data.artifacts?.templates ?? {};
      for (const [templateName, template] of Object.entries(templates)) {
        inspect(`template-artifact:${file}`, templateName || file, template.patternDependencies ?? []);
      }
    }
  }
  return rows.sort((a, b) => `${a.template}:${a.dependency}`.localeCompare(`${b.template}:${b.dependency}`));
}

function knownTemplateModuleSet() {
  const backlog = fs.existsSync(path.join(root, "packages/content/content/pattern-backlog.json"))
    ? readJson(path.join(root, "packages/content/content/pattern-backlog.json"))
    : {};
  return new Set((backlog.classificationRules?.knownTemplateModuleExamples ?? []).map(slug));
}

function declaredTemplateModuleDependencies() {
  const knownTemplateModules = knownTemplateModuleSet();
  const rows = [];
  function inspect(source, templateName, dependencies) {
    for (const dependency of dependencies ?? []) {
      const dependencyId = slug(dependency);
      rows.push({
        source,
        template: templateName,
        dependency,
        dependencyId,
        knownTemplateModule: knownTemplateModules.has(dependencyId),
      });
    }
  }
  if (fs.existsSync(templateArtifactsDir)) {
    for (const file of fs.readdirSync(templateArtifactsDir).filter((item) => item.endsWith(".json"))) {
      const data = readJson(path.join(templateArtifactsDir, file));
      const templates = data.artifacts?.templates ?? {};
      for (const [templateName, template] of Object.entries(templates)) {
        inspect(`template-artifact:${file}`, templateName || file, template.templateModuleDependencies ?? []);
      }
    }
  }
  if (fs.existsSync(templateBlueprintsFile)) {
    const data = readJson(templateBlueprintsFile);
    for (const [templateName, template] of Object.entries(data.templates ?? {})) {
      inspect("template-blueprints", templateName, Object.keys(template.templateModuleDetails ?? {}));
    }
  }
  return rows.sort((a, b) => `${a.template}:${a.dependency}`.localeCompare(`${b.template}:${b.dependency}`));
}

function docsReferences(patternNamesBySlug) {
  const refs = new Map();
  for (const file of docsFiles()) {
    const source = read(file);
    const sourceSlug = slug(source);
    for (const [id, names] of patternNamesBySlug.entries()) {
      if (names.some((name) => sourceSlug.includes(slug(name)))) {
        refs.set(id, [...(refs.get(id) ?? []), rel(file)]);
      }
    }
  }
  return refs;
}

function docsEvidenceCategory(file) {
  const name = path.basename(file);
  if (/^pattern-candidate-(?:demos|interactions)\.js$/.test(name)) return "candidate-demo-evidence";
  if (/^pattern-(?:mobile|desktop|utility|process|journey|advanced-filter)-(?:demos|interactions)\.js$/.test(name)) return "pattern-demo-evidence";
  if (/^pattern-(?:business-renderers|shell-renderers)\.js$/.test(name)) return "pattern-renderer-evidence";
  if (/^react-component-islands\.js$/.test(name)) return "react-island-runtime-evidence";
  if (/^(?:avatar-menu|notification-panel|search)-slot\.js$/.test(name)) return "slot-adapter-evidence";
  if (/^pattern-(?:contract-tabs|build-gates|design-lead|focused-design|miel-tabs|tabs)\.js$/.test(name)) return "contract-docs-evidence";
  if (/^(?:gold-|component-demo-|doc-interactions|foundation-visual-sections|icon-system)/.test(name)) return "component-docs-evidence";
  if (/^(?:app|index|navigation|docs-[a-z0-9-]+|shell-controls|styles)\.(?:js|css|html)$/.test(name)) return "docs-shell-evidence";
  if (/^template-/.test(name)) return "template-docs-evidence";
  return "unknown-docs-evidence";
}

function docsEvidenceRows(docsRefs) {
  const files = unique([...docsRefs.values()].flat());
  return files.map((file) => ({
    file,
    category: docsEvidenceCategory(file),
  }));
}

function normalizeComponentName(name) {
  const normalized = slug(name)
    .replace(/^empty-state$/, "empty-state")
    .replace(/^inline-validation$/, "inline-validation")
    .replace(/^progress$/, "progress-indicator")
    .replace(/^progress-indicator$/, "progress-indicator")
    .replace(/^datepicker$/, "date-picker")
    .replace(/^combobox-listbox$/, "combobox")
    .replace(/^menuitem$/, "menu")
    .replace(/^card\[\]$/, "card")
    .replace(/^button\[\]$/, "button")
    .replace(/^avatar\[\]$/, "avatar")
    .replace(/^chip\[\]$/, "chip");
  return normalized;
}

function componentRefsFromText(text, componentNamesById) {
  const haystack = ` ${slug(text)} `;
  return [...componentNamesById.entries()]
    .filter(([, names]) => names.some((name) => haystack.includes(` ${slug(name)} `) || haystack.includes(`${slug(name)}-`) || haystack.includes(`-${slug(name)}`)))
    .map(([id]) => id);
}

function patternRefsFromText(id, text, patternNamesBySlug) {
  const haystack = slug(text);
  return [...patternNamesBySlug.entries()]
    .filter(([candidateId, names]) => candidateId !== id && names.some((name) => haystack.includes(slug(name))))
    .map(([candidateId]) => candidateId);
}

function migrationWave(score, pattern) {
  const waves = architectureWavePolicy.waves;
  const matched = waves.find((wave) => {
    if (wave.formalized && !pattern.formalArtifact) return false;
    if (wave.requiresKnownComponents && pattern.unknownComponents.length > 0) return false;
    if (wave.maxPatternCrossings !== null && pattern.patternCrossings.length > wave.maxPatternCrossings) return false;
    if (wave.maxTemplateRefs !== null && pattern.templateRefs.length > wave.maxTemplateRefs) return false;
    return wave.maxScore === null || score <= wave.maxScore;
  });
  return matched?.id ?? waves.at(-1)?.id ?? "wave-4-template-adjacent";
}

function markdownScopeIssues(id, formalArtifact, markdownContractFile) {
  if (!formalArtifact) return [];
  if (!fs.existsSync(markdownContractFile)) {
    return [`${id}: missing markdown contract`];
  }
  const markdown = read(markdownContractFile);
  const groups = [
    ["layer", [formalArtifact.layer]],
    ["platform", [formalArtifact.platform]],
    ["audiences", formalArtifact.audiences ?? []],
    ["densityContext", formalArtifact.densityContext ?? []],
    ["templateDependencies", formalArtifact.templateDependencies ?? []],
  ].filter(([, values]) => values.filter(Boolean).length);
  if (!groups.length) return [];
  if (!/^## Formal Scope$/m.test(markdown)) {
    return [`${id}: markdown contract missing Formal Scope section`];
  }
  return groups.flatMap(([field, values]) => values
    .filter(Boolean)
    .filter((value) => !markdown.includes(`\`${value}\``) && !markdown.includes(`| ${field.charAt(0).toUpperCase()}${field.slice(1)} | ${value} |`))
    .map((value) => `${id}: markdown contract missing formal scope ${field}=${value}`));
}

function markdownArtifactCoverageIssues(id, formalArtifact, markdownContractFile) {
  if (!formalArtifact) return [];
  if (!fs.existsSync(markdownContractFile)) {
    return [`${id}: missing markdown contract`];
  }
  const markdown = read(markdownContractFile);
  const issues = [];
  if (formalArtifact.purpose) {
    if (!/^## Formal Purpose$/m.test(markdown)) {
      issues.push(`${id}: markdown contract missing Formal Purpose section`);
    } else if (!markdown.includes(formalArtifact.purpose)) {
      issues.push(`${id}: markdown contract missing formal purpose`);
    }
  }
  if ((formalArtifact.foundationDependencies ?? []).length) {
    if (!/^### Foundation Dependencies$/m.test(markdown)) {
      issues.push(`${id}: markdown contract missing Foundation Dependencies group`);
    }
    for (const dependency of formalArtifact.foundationDependencies) {
      if (!markdown.includes(`\`${dependency}\``)) {
        issues.push(`${id}: markdown contract missing foundation dependency ${dependency}`);
      }
    }
  }
  return issues;
}

function createReport() {
  const copyIds = copyPatternIds();
  const catalog = catalogPatterns();
  const artifacts = patternArtifacts();
  const components = componentArtifacts();
  const componentNamesById = new Map([...components.entries()].map(([id, component]) => [
    id,
    unique([id, component.name, titleFromId(id)]),
  ]));
  const patternNamesBySlug = new Map(copyIds.map((id) => {
    const copy = readJson(path.join(copyDir, id, "all.json")).patterns[id];
    const catalogPattern = catalog.get(id);
    return [id, unique([id, copy?.title, catalogPattern?.title, titleFromId(id)])];
  }));
  const templateRefs = templateReferences(patternNamesBySlug);
  const templatePatternDependencies = declaredTemplatePatternDependencies(patternNamesBySlug);
  const templateModuleDependencies = declaredTemplateModuleDependencies();
  const missingTemplatePatternDependencies = templatePatternDependencies.filter((row) => !row.formalPatternPresent);
  const templateModuleDependencyMismatches = missingTemplatePatternDependencies.filter((row) => row.knownTemplateModule);
  const missingFormalTemplatePatternDependencies = missingTemplatePatternDependencies.filter((row) => !row.knownTemplateModule);
  const unknownTemplateModuleDependencies = templateModuleDependencies.filter((row) => !row.knownTemplateModule);
  const docsRefs = docsReferences(patternNamesBySlug);
  const docsEvidence = docsEvidenceRows(docsRefs);
  const unknownDocsEvidence = docsEvidence.filter((row) => row.category === "unknown-docs-evidence");

  const patterns = copyIds.map((id) => {
    const copyFile = path.join(copyDir, id, "all.json");
    const copy = readJson(copyFile).patterns[id];
    const catalogPattern = catalog.get(id);
    const formalArtifact = artifacts.get(id) ?? null;
    const markdownContractFile = path.join(contractsDir, `${id}.md`);
    const contractScopeIssues = markdownScopeIssues(id, formalArtifact, markdownContractFile);
    const contractArtifactCoverageIssues = markdownArtifactCoverageIssues(id, formalArtifact, markdownContractFile);
    const declaredComponents = unique(copy.componentsUsed ?? []);
    const slotRows = (copy.slots ?? []).map(([slot, type, required, notes]) => ({
      slot,
      type,
      required,
      notes,
      componentRefs: unique(componentRefsFromText(type, componentNamesById)),
      patternRefs: unique(patternRefsFromText(id, type, patternNamesBySlug)),
    }));
    const componentIds = unique([
      ...declaredComponents.map(normalizeComponentName),
      ...slotRows.flatMap((slot) => slot.componentRefs),
      ...(formalArtifact?.componentDependencies ?? []).map(normalizeComponentName),
    ]);
    const knownComponents = componentIds.filter((componentId) => components.has(componentId));
    const unknownComponents = componentIds.filter((componentId) => !components.has(componentId));
    const missingComponentArtifacts = knownComponents.filter((componentId) => !components.get(componentId)?.artifactFile);
    const foundationsFromCopy = unique((copy.foundations ?? []).map((row) => row[0]));
    const formalFoundations = unique(formalArtifact?.governingFoundations ?? []);
    const inferredPrimitivesFromComponents = unique(knownComponents.flatMap((componentId) => components.get(componentId)?.primitiveDependencies ?? []));
    const inferredPrimitivesFromFoundations = unique(foundationsFromCopy.flatMap((foundation) => foundationPrimitiveHints[foundation] ?? []));
    const declaredPrimitives = unique(formalArtifact?.primitiveDependencies ?? []);
    const tokenDependencies = unique(formalArtifact?.tokenDependencies ?? []);
    const patternCrossings = unique([
      ...(catalogPattern?.patternDependencies ?? []).map((value) => slug(value)),
      ...slotRows.flatMap((slot) => slot.patternRefs),
      ...flattenStrings(copy).flatMap((text) => patternRefsFromText(id, text, patternNamesBySlug)),
    ]);
    const requiredSlots = slotRows.filter((slot) => String(slot.required).toLowerCase() === "yes").length;
    const conditionalSlots = slotRows.filter((slot) => String(slot.required).toLowerCase() === "conditional").length;
    const score = (
      knownComponents.length * complexityWeights.component
      + unknownComponents.length * complexityWeights.unknownComponent
      + requiredSlots * complexityWeights.requiredSlot
      + conditionalSlots * complexityWeights.conditionalSlot
      + patternCrossings.length * complexityWeights.patternCrossing
      + (templateRefs.get(id)?.length ?? 0) * complexityWeights.templateReference
      + (formalArtifact ? 0 : complexityWeights.missingFormalArtifact)
      + (declaredPrimitives.length ? 0 : complexityWeights.missingPrimitiveDeclaration)
    );
    const pattern = {
      id,
      title: catalogPattern?.title ?? titleFromId(id),
      source: {
        copy: rel(copyFile),
        markdownContract: fs.existsSync(markdownContractFile) ? rel(markdownContractFile) : null,
        catalog: catalogPattern?.catalogFile ?? null,
        formalArtifact: formalArtifact?.artifactFile ?? null,
      },
      purpose: copy.purpose ?? catalogPattern?.summary ?? "",
      components: {
        declared: declaredComponents,
        normalizedIds: componentIds,
        known: knownComponents,
        unknown: unknownComponents,
        missingArtifacts: missingComponentArtifacts,
      },
      slots: slotRows,
      foundations: {
        declared: foundationsFromCopy,
        formal: formalFoundations,
        inferredPrimitiveHints: inferredPrimitivesFromFoundations,
      },
      primitives: {
        declared: declaredPrimitives,
        inferredFromComponents: inferredPrimitivesFromComponents,
        inferredFromFoundations: inferredPrimitivesFromFoundations,
        tokenDependencies,
        declarationGap: declaredPrimitives.length ? 0 : 1,
      },
      crossings: {
        patterns: patternCrossings,
        templates: templateRefs.get(id) ?? [],
        docs: unique(docsRefs.get(id) ?? []),
      },
      contractScopeIssues,
      contractArtifactCoverageIssues,
      tests: copy.tests ?? [],
      accessibility: copy.accessibility ?? [],
      migration: {
        complexityScore: score,
        wave: "",
        blockers: unique([
          formalArtifact ? "" : "missing formal pattern artifact with declared primitives",
          missingComponentArtifacts.length ? `component artifact gaps: ${missingComponentArtifacts.join(", ")}` : "",
          unknownComponents.length ? `unknown component refs: ${unknownComponents.join(", ")}` : "",
          contractScopeIssues.length ? `formal scope contract gaps: ${contractScopeIssues.join("; ")}` : "",
          contractArtifactCoverageIssues.length ? `formal artifact coverage gaps: ${contractArtifactCoverageIssues.join("; ")}` : "",
          patternCrossings.length > 2 ? "high pattern-crossing count" : "",
          (templateRefs.get(id)?.length ?? 0) ? "referenced by templates; migration needs template-boundary review" : "",
        ]),
      },
    };
    pattern.migration.wave = migrationWave(score, {
      formalArtifact,
      patternCrossings,
      unknownComponents,
      templateRefs: templateRefs.get(id) ?? [],
    });
    return pattern;
  });

  const formalArtifactBacklog = patterns.filter((pattern) => !pattern.source.formalArtifact).length;
  const primitiveDeclarationBacklog = patterns.filter((pattern) => pattern.primitives.declarationGap).length;
  const inventory = {
    patterns: patterns.length,
    patternArchitecturePolicyIssues: patternArchitecturePolicy.issues.length,
    foundationPrimitiveHintPolicy: Object.keys(foundationPrimitiveHints).length,
    complexityWeightPolicy: Object.keys(complexityWeights).length,
    formalArtifacts: patterns.filter((pattern) => pattern.source.formalArtifact).length,
    markdownContracts: patterns.filter((pattern) => pattern.source.markdownContract).length,
    catalogEntries: patterns.filter((pattern) => pattern.source.catalog).length,
    patternsWithDeclaredPrimitives: patterns.filter((pattern) => pattern.primitives.declared.length).length,
    patternsWithOnlyInferredPrimitives: patterns.filter((pattern) => !pattern.primitives.declared.length && (pattern.primitives.inferredFromComponents.length || pattern.primitives.inferredFromFoundations.length)).length,
    patternsWithUnknownComponents: patterns.filter((pattern) => pattern.components.unknown.length).length,
    patternsWithComponentArtifactGaps: patterns.filter((pattern) => pattern.components.missingArtifacts.length).length,
    patternContractScopeIssues: patterns.reduce((total, pattern) => total + pattern.contractScopeIssues.length, 0),
    patternContractArtifactCoverageIssues: patterns.reduce((total, pattern) => total + pattern.contractArtifactCoverageIssues.length, 0),
    patternsWithPatternCrossings: patterns.filter((pattern) => pattern.crossings.patterns.length).length,
    patternsReferencedByTemplates: patterns.filter((pattern) => pattern.crossings.templates.length).length,
    templatePatternDependencies: templatePatternDependencies.length,
    templatePatternDependencyGaps: missingTemplatePatternDependencies.length,
    templateModuleDependencyMismatches: templateModuleDependencyMismatches.length,
    missingFormalTemplatePatternDependencies: missingFormalTemplatePatternDependencies.length,
    templateModuleDependencies: templateModuleDependencies.length,
    unknownTemplateModuleDependencies: unknownTemplateModuleDependencies.length,
    docsAppAvailable: docsAppDir ? 1 : 0,
    patternsReferencedByDocs: patterns.filter((pattern) => pattern.crossings.docs.length).length,
    docsEvidenceFiles: docsEvidence.length,
    unknownDocsEvidenceFiles: unknownDocsEvidence.length,
    formalArtifactBacklog,
    primitiveDeclarationBacklog,
    patternArchitectureBacklog: formalArtifactBacklog + primitiveDeclarationBacklog,
    patternArchitectureDebt: patterns.reduce((total, pattern) => total
      + pattern.components.unknown.length
      + pattern.components.missingArtifacts.length
      + pattern.contractScopeIssues.length
      + pattern.contractArtifactCoverageIssues.length, 0)
      + patternArchitecturePolicy.issues.length,
  };
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => key !== "patternArchitectureBlockingDebt" && inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  const blockingDebt = inventory.patternArchitectureBacklog
    + inventory.patternArchitectureDebt
    + inventory.templatePatternDependencyGaps
    + inventory.templateModuleDependencyMismatches
    + inventory.missingFormalTemplatePatternDependencies
    + inventory.unknownTemplateModuleDependencies
    + inventory.unknownDocsEvidenceFiles
    + baselineMismatches.length
    + unexpectedInventoryMetrics.length;
  inventory.patternArchitectureBlockingDebt = blockingDebt;
  return {
    status: blockingDebt ? "fail" : "pass",
    audit: "pattern 1:1 architecture",
    principle: "Every pattern needs an explicit 1:1 architecture map across foundations, primitives, components, pattern crossings, template references, and docs evidence before React migration starts.",
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    docsEvidence: {
      available: Boolean(docsAppDir),
      directory: docsAppDir ? rel(docsAppDir) : null,
      files: docsEvidence,
      unknownFiles: unknownDocsEvidence,
    },
    templatePatternDependencies,
    templateModuleDependencies,
    missingTemplatePatternDependencies,
    templateModuleDependencyMismatches,
    missingFormalTemplatePatternDependencies,
    unknownTemplateModuleDependencies,
    waves: Object.fromEntries(architectureWavePolicy.waves.map((wave) => wave.id)
      .map((wave) => [wave, patterns.filter((pattern) => pattern.migration.wave === wave).map((pattern) => pattern.id)])),
    patterns,
  };
}

function toMarkdown(report) {
  const rows = report.patterns.map((pattern) => `| ${pattern.id} | ${pattern.migration.wave} | ${pattern.migration.complexityScore} | ${pattern.components.known.join(", ") || "None"} | ${pattern.components.missingArtifacts.join(", ") || "None"} | ${pattern.components.unknown.join(", ") || "None"} | ${pattern.foundations.declared.join(", ") || "None"} | ${pattern.primitives.declared.join(", ") || "None"} | ${pattern.primitives.inferredFromComponents.join(", ") || "None"} | ${pattern.crossings.patterns.join(", ") || "None"} | ${pattern.crossings.templates.length} | ${pattern.contractScopeIssues.join("<br>") || "None"} | ${pattern.contractArtifactCoverageIssues.join("<br>") || "None"} | ${pattern.migration.blockers.join("<br>") || "None"} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const docsEvidenceCounts = Object.entries(report.docsEvidence.files.reduce((counts, row) => {
    counts[row.category] = (counts[row.category] ?? 0) + 1;
    return counts;
  }, {})).sort(([a], [b]) => a.localeCompare(b));
  const waveSections = Object.entries(report.waves).flatMap(([wave, ids]) => [
    `### ${wave}`,
    "",
    ...(ids.length ? ids.map((id) => `- ${id}`) : ["- None"]),
    "",
  ]);
  return [
    "# Pattern 1:1 Architecture Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Patterns audited: ${report.inventory.patterns}`,
    `- Pattern architecture policy issues: ${report.inventory.patternArchitecturePolicyIssues}`,
    `- Foundation primitive hint policy entries: ${report.inventory.foundationPrimitiveHintPolicy}`,
    `- Complexity weight policy entries: ${report.inventory.complexityWeightPolicy}`,
    `- Formal artifacts: ${report.inventory.formalArtifacts}`,
    `- Markdown contracts: ${report.inventory.markdownContracts}`,
    `- Catalog entries: ${report.inventory.catalogEntries}`,
    `- Patterns with declared primitives: ${report.inventory.patternsWithDeclaredPrimitives}`,
    `- Patterns with only inferred primitives: ${report.inventory.patternsWithOnlyInferredPrimitives}`,
    `- Patterns with unknown component refs: ${report.inventory.patternsWithUnknownComponents}`,
    `- Patterns with component artifact gaps: ${report.inventory.patternsWithComponentArtifactGaps}`,
    `- Pattern contract scope issues: ${report.inventory.patternContractScopeIssues}`,
    `- Pattern contract artifact coverage issues: ${report.inventory.patternContractArtifactCoverageIssues}`,
    `- Patterns with pattern crossings: ${report.inventory.patternsWithPatternCrossings}`,
    `- Patterns referenced by templates: ${report.inventory.patternsReferencedByTemplates}`,
    `- Template pattern dependencies: ${report.inventory.templatePatternDependencies}`,
    `- Template pattern dependency gaps: ${report.inventory.templatePatternDependencyGaps}`,
    `- Template module dependency mismatches: ${report.inventory.templateModuleDependencyMismatches}`,
    `- Missing formal template pattern dependencies: ${report.inventory.missingFormalTemplatePatternDependencies}`,
    `- Template module dependencies: ${report.inventory.templateModuleDependencies}`,
    `- Unknown template module dependencies: ${report.inventory.unknownTemplateModuleDependencies}`,
    `- Docs app available: ${report.inventory.docsAppAvailable}`,
    `- Patterns referenced by docs: ${report.inventory.patternsReferencedByDocs}`,
    `- Docs evidence files: ${report.inventory.docsEvidenceFiles}`,
    `- Unknown docs evidence files: ${report.inventory.unknownDocsEvidenceFiles}`,
    `- Formal artifact backlog: ${report.inventory.formalArtifactBacklog}`,
    `- Primitive declaration backlog: ${report.inventory.primitiveDeclarationBacklog}`,
    `- Pattern architecture backlog: ${report.inventory.patternArchitectureBacklog}`,
    `- Pattern architecture debt: ${report.inventory.patternArchitectureDebt}`,
    `- Pattern architecture blocking debt: ${report.inventory.patternArchitectureBlockingDebt}`,
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
    "## Migration Waves",
    "",
    ...waveSections,
    "## Docs Evidence",
    "",
    "| Category | Files |",
    "| --- | ---: |",
    ...(docsEvidenceCounts.length ? docsEvidenceCounts.map(([category, count]) => `| ${category} | ${count} |`) : ["| None | 0 |"]),
    "",
    "| Unknown file | Category |",
    "| --- | --- |",
    ...(report.docsEvidence.unknownFiles.length ? report.docsEvidence.unknownFiles.map((row) => `| ${row.file} | ${row.category} |`) : ["| None | None |"]),
    "",
    "## Template Pattern Dependency Gaps",
    "",
    "| Source | Template | Declared dependency | Dependency id | Classification |",
    "| --- | --- | --- | --- | --- |",
    ...(report.missingTemplatePatternDependencies.length
      ? report.missingTemplatePatternDependencies.map((row) => `| ${row.source} | ${row.template} | ${row.dependency} | ${row.dependencyId} | ${row.classification} |`)
      : ["| None | None | None | None | None |"]),
    "",
    "## Template Module Dependency Gaps",
    "",
    "| Source | Template | Declared module | Module id |",
    "| --- | --- | --- | --- |",
    ...(report.unknownTemplateModuleDependencies.length
      ? report.unknownTemplateModuleDependencies.map((row) => `| ${row.source} | ${row.template} | ${row.dependency} | ${row.dependencyId} |`)
      : ["| None | None | None | None |"]),
    "",
    "## 1:1 Matrix",
    "",
    "| Pattern | Wave | Score | Flow components | Component artifact gaps | Unknown refs | Foundations | Declared primitives | Inferred primitives | Pattern crossings | Template refs | Contract scope issues | Contract artifact coverage issues | Blockers |",
    "| --- | --- | ---: | --- | --- | --- | --- | --- | --- | --- | ---: | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function main() {
  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Pattern 1:1 architecture report is stale. Run: node packages/audit/scripts/report-pattern-1to1-architecture.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }
  console.log(JSON.stringify({
    status: report.status,
    patterns: report.inventory.patterns,
    formalArtifacts: report.inventory.formalArtifacts,
    patternsWithDeclaredPrimitives: report.inventory.patternsWithDeclaredPrimitives,
    patternsWithOnlyInferredPrimitives: report.inventory.patternsWithOnlyInferredPrimitives,
    templatePatternDependencyGaps: report.inventory.templatePatternDependencyGaps,
    templateModuleDependencyMismatches: report.inventory.templateModuleDependencyMismatches,
    missingFormalTemplatePatternDependencies: report.inventory.missingFormalTemplatePatternDependencies,
    templateModuleDependencies: report.inventory.templateModuleDependencies,
    unknownTemplateModuleDependencies: report.inventory.unknownTemplateModuleDependencies,
    patternArchitectureDebt: report.inventory.patternArchitectureDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
}

main();
