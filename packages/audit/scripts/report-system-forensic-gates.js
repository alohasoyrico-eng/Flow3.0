#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const docsRoot = path.resolve(root, "../FlowDocs");
const outputDir = path.join(root, "docs/forensics");
const jsonOutput = path.join(outputDir, "system-forensic-gates.json");
const markdownOutput = path.join(outputDir, "system-forensic-gates.md");
const generatedAt = "2026-08-12";

const definitionOfDone = [
  "Every foundation, primitive, component, pattern, and template appears once in the entity matrix.",
  "Every entity declares source-of-truth owner, allowed runtime locations, current runtime locations, duplicate surface count, and docs hand-authored surface count.",
  "Style Dictionary is the token build source for foundations/primitives outputs.",
  "Public Flow runtime surfaces use real TypeScript source or are explicitly blocked by the TS migration gate.",
  "FlowDocs consumes generated/package Flow surfaces and must not define component or formal pattern implementations.",
  "Docs-only CSS/JS patterns are blocked by named policy instead of tolerated as invisible debt."
];

const blockedDocsOnlyPatterns = [
  {
    id: "component-class-root-css",
    blocked: "FlowDocs CSS selectors that define package component class roots such as .button, .field, .drawer, .accordion, or .card.",
    gate: "docs-system-boundary"
  },
  {
    id: "formal-pattern-root-css",
    blocked: "FlowDocs CSS selectors that define formal pattern roots generated from Flow pattern artifact ids.",
    gate: "docs-system-boundary"
  },
  {
    id: "docs-only-slot-helper",
    blocked: "Local FlowDocs slot helper modules such as search-slot.js, notification-panel-slot.js, or avatar-menu-slot.js.",
    gate: "pattern-contract-governance"
  },
  {
    id: "legacy-dom-runtime",
    blocked: "Hand-authored DOM factories, raw document interactions, or local runtime copies that bypass Flow React.",
    gate: "legacy-dom-source-governance"
  },
  {
    id: "raw-token-values",
    blocked: "Raw hex, px, bezier, shadow, radius, or typography values outside token source/build output policy.",
    gate: "raw-token-value-governance"
  }
];

const layerPolicies = {
  foundation: {
    owner: "Flow token/spec source",
    allowedRuntimeLocations: [
      "packages/tokens/src/foundations/{slug}.json",
      "packages/specs/specs/unison-system/artifacts/foundations/{slug}",
      "packages/tokens/styles/tokens.css",
      "packages/tokens/tokens.json",
      "packages/tokens/src/generated/tokens.ts",
      "packages/tokens/dist/flutter/flow_tokens.dart",
      "packages/tokens/dist/android/flow_tokens.xml",
      "packages/tokens/dist/ios/FlowTokens.swift"
    ],
    docsRuntimePolicy: "Docs may document and visualize foundations, but must not own foundation behavior, tokens, or raw visual constants."
  },
  primitive: {
    owner: "Flow primitive/token source",
    allowedRuntimeLocations: [
      "packages/components/src/primitives/{slug}.js",
      "packages/components/src/primitives/{slug}.d.ts",
      "packages/tokens/src/primitives/{slug}.ts",
      "apps/docs/generated/react/{Pascal}.js",
      "apps/docs/generated/react/{Pascal}.d.ts"
    ],
    docsRuntimePolicy: "Docs may consume generated primitive bridges; hand-authored docs primitive implementations require removal or owner decision."
  },
  component: {
    owner: "Flow React component package",
    allowedRuntimeLocations: [
      "packages/react/src/{Pascal}.tsx",
      "packages/react/src/{Pascal}.ts",
      "packages/react/src/{Pascal}.js",
      "packages/react/src/{Pascal}.d.ts",
      "packages/react/dist/{Pascal}.js",
      "packages/react/dist/{Pascal}.d.ts",
      "apps/docs/generated/react/{Pascal}.js",
      "apps/docs/generated/react/{Pascal}.d.ts"
    ],
    docsRuntimePolicy: "Docs may compose demos through generated React islands; component behavior, class roots, and contract props stay in Flow."
  },
  pattern: {
    owner: "Flow React pattern package",
    allowedRuntimeLocations: [
      "packages/react/src/patterns/{Pascal}.tsx",
      "packages/react/src/patterns/{Pascal}.ts",
      "packages/react/src/patterns/{Pascal}.js",
      "packages/react/src/patterns/{Pascal}.d.ts",
      "packages/react/dist/patterns/{Pascal}.js",
      "packages/react/dist/patterns/{Pascal}.d.ts",
      "apps/docs/generated/react/patterns/{Pascal}.js",
      "apps/docs/generated/react/patterns/{Pascal}.d.ts"
    ],
    docsRuntimePolicy: "Docs may own editorial/demo wrappers only; formal pattern behavior, state, slots, and composition stay in Flow."
  },
  template: {
    owner: "Flow React template package",
    allowedRuntimeLocations: [
      "packages/react/src/templates/{Pascal}.tsx",
      "packages/react/src/templates/{Pascal}.ts",
      "packages/react/src/templates/{Pascal}.js",
      "packages/react/src/templates/{Pascal}.d.ts",
      "packages/react/dist/templates/{Pascal}.js",
      "packages/react/dist/templates/{Pascal}.d.ts",
      "apps/docs/generated/react/templates/{Pascal}.js",
      "apps/docs/generated/react/templates/{Pascal}.d.ts"
    ],
    docsRuntimePolicy: "Docs may render generated template demos; application-level template composition and QA evidence stay in Flow."
  }
};

function exists(file) {
  return fs.existsSync(file);
}

function walk(dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, out);
    else out.push(file);
  }
  return out;
}

function artifactNames(kind) {
  const dir = path.join(root, "packages/specs/specs/unison-system/artifacts", kind);
  const names = new Set();
  if (!exists(dir)) return [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) names.add(entry.name);
    if (entry.isFile() && /\.(json|md)$/.test(entry.name)) names.add(entry.name.replace(/\.(json|md)$/, ""));
  }
  return [...names].sort();
}

function pascal(slug) {
  return String(slug)
    .split("-")
    .map((part) => (part ? part[0].toUpperCase() + part.slice(1) : ""))
    .join("");
}

function renderLocation(template, entity) {
  return template
    .replaceAll("{slug}", entity.slug)
    .replaceAll("{Pascal}", pascal(entity.slug));
}

function jsNames(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith(".js"))
    .map((file) => file.replace(/\.js$/, ""))
    .sort();
}

function dtsNames(dir) {
  if (!exists(dir)) return [];
  return fs.readdirSync(dir)
    .filter((file) => file.endsWith(".d.ts"))
    .map((file) => file.replace(/\.d\.ts$/, ""))
    .sort();
}

function readJson(file, fallback = {}) {
  return exists(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function sourceFiles(repoRoot) {
  return walk(repoRoot).filter((file) => /\.(ts|tsx)$/.test(file) && !file.endsWith(".d.ts"));
}

function typedSourceFile(rootDir, name) {
  const tsxFile = path.join(rootDir, `${name}.tsx`);
  if (exists(tsxFile)) return tsxFile;
  const tsFile = path.join(rootDir, `${name}.ts`);
  if (exists(tsFile)) return tsFile;
  return "";
}

function docsHandSurfaceFiles(entity) {
  const docsApp = path.join(docsRoot, "apps/docs");
  if (!exists(docsApp)) return [];
  const needles = [
    entity.slug,
    pascal(entity.slug),
    entity.slug.replace(/-/g, " "),
  ].map((value) => value.toLowerCase());
  return walk(docsApp)
    .filter((file) => /\.(js|css|html)$/.test(file))
    .filter((file) => !file.includes(`${path.sep}generated${path.sep}`))
    .filter((file) => {
      const content = fs.readFileSync(file, "utf8").toLowerCase();
      return needles.some((needle) => content.includes(needle));
    })
    .map((file) => path.relative(root, file))
    .sort();
}

function makeEntity(layer, slug) {
  const componentRoot = path.join(root, "packages/react/src");
  const patternRoot = path.join(componentRoot, "patterns");
  const templateRoot = path.join(componentRoot, "templates");
  const primitiveRuntimeRoot = path.join(root, "packages/components/src/primitives");
  const primitiveTypedRoot = path.join(root, "packages/tokens/src/primitives");
  const generatedRoot = path.join(docsRoot, "apps/docs/generated/react");
  const name = pascal(slug);
  const entity = {
    layer,
    slug,
    sourceOfTruthOwner: layerPolicies[layer]?.owner ?? "undecided",
    sourceOfTruth: `packages/specs/specs/unison-system/artifacts/${layer}s/${slug}`,
    allowedRuntimeLocations: [],
    currentRuntimeLocations: [],
    blockedDocsOnlyPatterns: blockedDocsOnlyPatterns.map((pattern) => pattern.id),
    docsRuntimePolicy: layerPolicies[layer]?.docsRuntimePolicy ?? "",
    runtime: {
      flowJs: false,
      flowDts: false,
      docsGeneratedJs: false,
      docsGeneratedDts: false,
      tsSource: false
    },
    duplicateSurfaces: [],
    gates: {
      hasSpec: true,
      hasRuntime: false,
      hasTypescriptSource: false,
      hasDocsGeneratedRuntime: false,
      docsHandSurfaceCount: 0,
      docsHandSurfaceFiles: []
    },
    remediationOwnerDecision: "undecided"
  };

  if (layer === "foundation") {
    entity.gates.hasRuntime = false;
  }

  if (layer === "primitive") {
    entity.runtime.flowJs = exists(path.join(primitiveRuntimeRoot, `${slug}.js`));
    entity.runtime.flowDts = exists(path.join(primitiveRuntimeRoot, `${slug}.d.ts`));
    entity.runtime.tsSource = exists(path.join(primitiveTypedRoot, `${slug}.ts`));
    entity.runtime.docsGeneratedJs = exists(path.join(generatedRoot, `${name}.js`));
    entity.runtime.docsGeneratedDts = exists(path.join(generatedRoot, `${name}.d.ts`));
    entity.gates.hasRuntime = entity.runtime.flowJs || entity.runtime.tsSource;
    entity.gates.hasTypescriptSource = entity.runtime.tsSource;
  }

  if (layer === "component") {
    entity.runtime.flowJs = exists(path.join(componentRoot, `${name}.js`));
    entity.runtime.flowDts = exists(path.join(componentRoot, `${name}.d.ts`));
    entity.runtime.tsSource = Boolean(typedSourceFile(componentRoot, name));
    entity.runtime.docsGeneratedJs = exists(path.join(generatedRoot, `${name}.js`));
    entity.runtime.docsGeneratedDts = exists(path.join(generatedRoot, `${name}.d.ts`));
    entity.gates.hasRuntime = entity.runtime.flowJs;
  }

  if (layer === "pattern") {
    entity.runtime.flowJs = exists(path.join(patternRoot, `${name}.js`));
    entity.runtime.flowDts = exists(path.join(patternRoot, `${name}.d.ts`));
    entity.runtime.tsSource = Boolean(typedSourceFile(patternRoot, name));
    entity.runtime.docsGeneratedJs = exists(path.join(generatedRoot, "patterns", `${name}.js`));
    entity.runtime.docsGeneratedDts = exists(path.join(generatedRoot, "patterns", `${name}.d.ts`));
    entity.gates.hasRuntime = entity.runtime.flowJs;
  }

  if (layer === "template") {
    entity.runtime.flowJs = exists(path.join(templateRoot, `${name}.js`));
    entity.runtime.flowDts = exists(path.join(templateRoot, `${name}.d.ts`));
    entity.runtime.tsSource = Boolean(typedSourceFile(templateRoot, name));
    entity.runtime.docsGeneratedJs = exists(path.join(generatedRoot, "templates", `${name}.js`));
    entity.runtime.docsGeneratedDts = exists(path.join(generatedRoot, "templates", `${name}.d.ts`));
    entity.gates.hasRuntime = entity.runtime.flowJs;
  }

  entity.gates.hasDocsGeneratedRuntime = entity.runtime.docsGeneratedJs;
  if (entity.runtime.tsSource) entity.gates.hasTypescriptSource = true;
  entity.gates.docsHandSurfaceFiles = docsHandSurfaceFiles(entity);
  entity.gates.docsHandSurfaceCount = entity.gates.docsHandSurfaceFiles.length;
  if (entity.runtime.flowJs) entity.duplicateSurfaces.push("flow-react-js");
  if (entity.runtime.flowDts) entity.duplicateSurfaces.push("flow-dts");
  if (entity.runtime.tsSource) entity.duplicateSurfaces.push("flow-ts-source");
  if (entity.runtime.docsGeneratedJs) entity.duplicateSurfaces.push("docs-generated-js");
  if (entity.runtime.docsGeneratedDts) entity.duplicateSurfaces.push("docs-generated-dts");
  if (entity.gates.docsHandSurfaceCount > 0) entity.duplicateSurfaces.push("docs-hand-authored-surface");
  entity.allowedRuntimeLocations = (layerPolicies[layer]?.allowedRuntimeLocations ?? []).map((location) => renderLocation(location, entity));
  entity.currentRuntimeLocations = [
    ...(entity.runtime.flowJs ? [entity.allowedRuntimeLocations.find((location) => location.endsWith(".js") && location.includes("packages/"))].filter(Boolean) : []),
    ...(entity.runtime.flowDts ? [entity.allowedRuntimeLocations.find((location) => location.endsWith(".d.ts") && location.includes("packages/"))].filter(Boolean) : []),
    ...(entity.runtime.tsSource ? [entity.allowedRuntimeLocations.find((location) => location.endsWith(".ts") || location.endsWith(".tsx"))].filter(Boolean) : []),
    ...(entity.runtime.docsGeneratedJs ? [entity.allowedRuntimeLocations.find((location) => location.endsWith(".js") && location.includes("apps/docs/generated"))].filter(Boolean) : []),
    ...(entity.runtime.docsGeneratedDts ? [entity.allowedRuntimeLocations.find((location) => location.endsWith(".d.ts") && location.includes("apps/docs/generated"))].filter(Boolean) : [])
  ];
  entity.duplicateSurfaceCount = entity.duplicateSurfaces.length;
  return entity;
}

function gateStatus(condition) {
  return condition ? "pass" : "fail";
}

function renderMarkdown(report) {
  const gateRows = report.gates
    .map((gate) => `| ${gate.id} | ${gate.status} | ${gate.blockers.join("<br>") || "None"} |`)
    .join("\n");
  const layerRows = Object.entries(report.layers)
    .map(([layer, value]) => `| ${layer} | ${value.total} | ${value.withRuntime} | ${value.withDocsGeneratedRuntime} | ${value.withHandDocsSurfaces} | ${value.withTypescriptSource} |`)
    .join("\n");
  const topDebtRows = report.topDuplicateRisk
    .map((entity) => `| ${entity.layer} | ${entity.slug} | ${entity.duplicateSurfaces.length} | ${entity.gates.docsHandSurfaceCount} | ${entity.duplicateSurfaces.join(", ")} |`)
    .join("\n");
  const docOnlyRows = report.docsOnlyCandidates
    .map((item) => `| ${item.layer} | ${item.slug} | ${item.reason} |`)
    .join("\n");
  const dodRows = report.definitionOfDone.map((item) => `- ${item}`).join("\n");
  const blockedRows = report.blockedDocsOnlyPatterns
    .map((item) => `| ${item.id} | ${item.gate} | ${item.blocked} |`)
    .join("\n");
  const policyRows = Object.entries(report.layerPolicies)
    .map(([layer, policy]) => `| ${layer} | ${policy.owner} | ${policy.docsRuntimePolicy} | ${policy.allowedRuntimeLocations.join("<br>")} |`)
    .join("\n");
  const entityRows = report.entities
    .map((entity) => `| ${entity.layer} | ${entity.slug} | ${entity.sourceOfTruthOwner} | ${entity.duplicateSurfaceCount} | ${entity.gates.docsHandSurfaceCount} | ${entity.currentRuntimeLocations.join("<br>") || "None"} |`)
    .join("\n");
  return [
    "# System forensic gates",
    "",
    `Generated: ${report.generatedAt}`,
    "",
    "This report defines the audit gates that must pass before remediation can be called complete. It does not change implementation.",
    "",
    "## Definition Of Done",
    "",
    dodRows,
    "",
    "## Runtime Ownership Policy",
    "",
    "| Layer | Owner | Docs runtime policy | Allowed runtime locations |",
    "| --- | --- | --- | --- |",
    policyRows,
    "",
    "## Blocked Docs-Only Patterns",
    "",
    "| Policy | Gate | Blocked behavior |",
    "| --- | --- | --- |",
    blockedRows,
    "",
    "## Gates",
    "",
    "| Gate | Status | Blockers |",
    "| --- | --- | --- |",
    gateRows,
    "",
    "## Layer matrix summary",
    "",
    "| Layer | Total | With Flow runtime | With docs generated runtime | With hand docs surfaces | With TS source |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    layerRows,
    "",
    "## Highest duplicate risk",
    "",
    "| Layer | Entity | Duplicate surfaces | Hand docs files | Surfaces |",
    "| --- | --- | ---: | ---: | --- |",
    topDebtRows,
    "",
    "## Docs-only candidates",
    "",
    "| Layer | Entity | Reason |",
    "| --- | --- | --- |",
    docOnlyRows || "| None | None | None |",
    "",
    "## Entity Matrix",
    "",
    "| Layer | Entity | Owner | Duplicate surfaces | Hand docs files | Current runtime locations |",
    "| --- | --- | --- | ---: | ---: | --- |",
    entityRows,
    "",
    "## Required next action",
    "",
    "The next iteration must expand this gate model into remediation tickets per entity, starting with foundations and primitives. Code changes remain blocked until each entity has an owner decision.",
    "",
  ].join("\n");
}

function main() {
  const inventory = {
    foundation: artifactNames("foundations"),
    primitive: artifactNames("primitives"),
    component: artifactNames("components"),
    pattern: artifactNames("patterns"),
    template: artifactNames("templates"),
  };
  const entities = Object.entries(inventory).flatMap(([layer, slugs]) => slugs.map((slug) => makeEntity(layer, slug)));
  const flowTsSourceFiles = sourceFiles(root);
  const docsTsSourceFiles = sourceFiles(docsRoot);
  const pkg = readJson(path.join(root, "package.json"));
  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  const hasStyleDictionary = Object.keys(deps).some((name) => name === "style-dictionary" || name === "@tokens-studio/sd-transforms");
  const hasStyleDictionaryConfig = ["style-dictionary.config.js", "style-dictionary.config.cjs", "style-dictionary.config.mjs", "config.style-dictionary.js"]
    .some((file) => exists(path.join(root, file)));
  const layers = {};
  for (const layer of Object.keys(inventory)) {
    const layerEntities = entities.filter((entity) => entity.layer === layer);
    layers[layer] = {
      total: layerEntities.length,
      withRuntime: layerEntities.filter((entity) => entity.gates.hasRuntime).length,
      withDocsGeneratedRuntime: layerEntities.filter((entity) => entity.gates.hasDocsGeneratedRuntime).length,
      withHandDocsSurfaces: layerEntities.filter((entity) => entity.gates.docsHandSurfaceCount > 0).length,
      withTypescriptSource: layerEntities.filter((entity) => entity.gates.hasTypescriptSource).length
    };
  }
  const docsGeneratedSlugs = new Set([
    ...jsNames(path.join(docsRoot, "apps/docs/generated/react")).map((name) => name.toLowerCase()),
    ...jsNames(path.join(docsRoot, "apps/docs/generated/react/patterns")).map((name) => name.toLowerCase()),
    ...jsNames(path.join(docsRoot, "apps/docs/generated/react/templates")).map((name) => name.toLowerCase())
  ]);
  const specPascalSlugs = new Set(entities.map((entity) => pascal(entity.slug).toLowerCase()));
  const generatedOnlyCandidates = [...docsGeneratedSlugs]
    .filter((slug) => slug !== "index" && !specPascalSlugs.has(slug))
    .sort()
    .map((slug) => ({ layer: "unknown", slug, reason: "generated docs runtime does not map cleanly to spec artifact" }));
  const docsBundle = readJson(path.join(docsRoot, "apps/docs/generated/docs-content.bundle.json"));
  const catalog = docsBundle.catalog || {};
  const allowedCatalogCollections = new Set(["foundations", "primitives", "components", "patterns", "templates", "collectionMeta", "collectionIcons"]);
  const catalogOnlyCandidates = Object.entries(catalog)
    .filter(([collection, value]) => !allowedCatalogCollections.has(collection) && Array.isArray(value))
    .flatMap(([collection, value]) => value.map((item) => ({
      layer: collection,
      slug: item.id || item.slug || item.name || item.title || "unknown",
      reason: "docs catalog collection is outside the system taxonomy and needs an owner decision"
    })));
  const docsOnlyCandidates = [...generatedOnlyCandidates, ...catalogOnlyCandidates];
  const gates = [
    {
      id: "forensic-matrix-completeness",
      status: gateStatus(entities.every((entity) =>
        entity.layer &&
        entity.slug &&
        entity.sourceOfTruthOwner &&
        entity.sourceOfTruth &&
        entity.allowedRuntimeLocations.length &&
        Array.isArray(entity.currentRuntimeLocations) &&
        Number.isInteger(entity.duplicateSurfaceCount) &&
        entity.blockedDocsOnlyPatterns.length
      )),
      blockers: entities
        .filter((entity) => !entity.allowedRuntimeLocations.length || !entity.blockedDocsOnlyPatterns.length)
        .map((entity) => `${entity.layer}:${entity.slug} is missing forensic matrix policy`)
        .slice(0, 20)
    },
    {
      id: "style-dictionary-real",
      status: gateStatus(hasStyleDictionary && hasStyleDictionaryConfig),
      blockers: [
        ...(!hasStyleDictionary ? ["missing style-dictionary dependency"] : []),
        ...(!hasStyleDictionaryConfig ? ["missing style-dictionary config"] : [])
      ]
    },
    {
      id: "typescript-source-real",
      status: gateStatus(flowTsSourceFiles.length > 0 && docsTsSourceFiles.length > 0),
      blockers: [
        ...(flowTsSourceFiles.length === 0 ? ["Flow has zero .ts/.tsx implementation files"] : []),
        ...(docsTsSourceFiles.length === 0 ? ["FlowDocs has zero .ts/.tsx source files"] : [])
      ]
    },
    {
      id: "primitive-cascade-runtime",
      status: gateStatus(layers.primitive.withRuntime === layers.primitive.total && layers.primitive.withTypescriptSource === layers.primitive.total),
      blockers: [
        `${layers.primitive.total - layers.primitive.withRuntime} primitives missing Flow runtime`,
        `${layers.primitive.total - layers.primitive.withTypescriptSource} primitives missing TS source`
      ].filter((item) => !item.startsWith("0 "))
    },
    {
      id: "docs-ownership",
      status: gateStatus(docsOnlyCandidates.length === 0 && entities.every((entity) => entity.gates.docsHandSurfaceCount === 0)),
      blockers: [
        ...(docsOnlyCandidates.length ? [`${docsOnlyCandidates.length} docs generated candidates do not map to spec`] : []),
        `${entities.filter((entity) => entity.gates.docsHandSurfaceCount > 0).length} entities have hand-authored docs surfaces`
      ].filter((item) => !item.startsWith("0 "))
    }
  ];
  const report = {
    schemaVersion: "flow-system-forensic-gates@1",
    generatedAt,
    status: gates.every((gate) => gate.status === "pass") ? "pass" : "fail",
    definitionOfDone,
    layerPolicies,
    blockedDocsOnlyPatterns,
    gates,
    layers,
    language: {
      flowTsSourceFiles: flowTsSourceFiles.length,
      docsTsSourceFiles: docsTsSourceFiles.length
    },
    styleDictionary: {
      dependency: hasStyleDictionary,
      config: hasStyleDictionaryConfig
    },
    topDuplicateRisk: entities
      .slice()
      .sort((a, b) => b.duplicateSurfaces.length - a.duplicateSurfaces.length || b.gates.docsHandSurfaceCount - a.gates.docsHandSurfaceCount)
      .slice(0, 30),
    docsOnlyCandidates,
    entities
  };
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, renderMarkdown(report));
  console.log(JSON.stringify({
    status: report.status,
    gates: report.gates,
    layers: report.layers,
    outputs: [
      path.relative(root, jsonOutput),
      path.relative(root, markdownOutput)
    ]
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

main();
