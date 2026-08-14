#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
  slug,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-template-parity-audit.json");
const markdownOutput = path.join(outputDir, "zip-template-parity-audit.md");
const parityFile = path.join(root, "packages/content/content/zip-template-parity.json");
const zipRoot = "/private/tmp/flow-zip-audit";
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const patternDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const componentDir = path.join(root, "packages/specs/specs/unison-system/artifacts/components");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const foundationDir = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations");
const reactTemplateDir = path.join(root, "packages/react/src/templates");
const reactPatternDir = path.join(root, "packages/react/src/patterns");

const validClassifications = new Set([
  "covered-by-template",
  "covered-by-pattern",
  "covered-separate-channel",
  "blocked-separate-channel",
  "template-candidate",
]);

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

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

function titleFromId(id) {
  return String(id).split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function pascalCase(value) {
  return slug(value).split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("");
}

function artifactIndex(dir, kind) {
  const index = new Map();
  if (!fs.existsSync(dir)) return index;
  for (const fileName of fs.readdirSync(dir).filter((file) => file.endsWith(".json"))) {
    const id = fileName.replace(/\.json$/, "");
    const file = path.join(dir, fileName);
    const json = readJson(file);
    const record = json.artifacts?.[kind]?.[id] ?? json;
    for (const name of [id, record.name, titleFromId(id)]) {
      if (name) index.set(slug(name), { id, name: record.name ?? titleFromId(id), file: rel(file) });
    }
  }
  return index;
}

function zipKitFiles() {
  if (!fs.existsSync(path.join(zipRoot, "ui_kits"))) return [];
  const files = [];
  const stack = [path.join(zipRoot, "ui_kits")];
  while (stack.length) {
    const dir = stack.pop();
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const file = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        stack.push(file);
      } else if (/\.(html|jsx|md)$/.test(entry.name)) {
        files.push(path.relative(zipRoot, file));
      }
    }
  }
  return files.sort();
}

function ownerRows(names, index, runtimeDir) {
  return (names ?? []).map((name) => {
    const artifact = index.get(slug(name));
    const runtimeFile = runtimeDir ? path.join(runtimeDir, `${pascalCase(name)}.js`) : null;
    return {
      name,
      id: artifact?.id ?? slug(name),
      artifactFound: Boolean(artifact),
      artifactFile: artifact?.file,
      runtimeFile: runtimeFile ? rel(runtimeFile) : undefined,
      runtimeFound: runtimeFile ? fs.existsSync(runtimeFile) : undefined,
    };
  });
}

function sourceSignals(paths) {
  const source = paths.map((zipPath) => read(path.join(zipRoot, zipPath))).join("\n");
  return {
    hasForm: /<form\b/.test(source),
    hasNav: /<nav\b|<aside\b/.test(source),
    hasTable: /<table\b/.test(source),
    hasSvgOrCanvas: /<svg\b|<canvas\b/.test(source),
    hasInlineTheme: /data-theme=|--[a-z0-9-]+:|#[0-9a-fA-F]{3,8}/.test(source),
    hasReactPreset: /data-presets="react"|\.jsx\b/.test(source),
  };
}

function createReport() {
  const parity = readContentJson(parityFile);
  const zipFiles = zipKitFiles();
  const templates = artifactIndex(templateDir, "templates");
  const patterns = artifactIndex(patternDir, "patterns");
  const components = artifactIndex(componentDir, "components");
  const primitives = artifactIndex(primitiveDir, "primitives");
  const foundations = artifactIndex(foundationDir, "foundations");
  const declaredZipPaths = new Set(parity.kits.flatMap((kit) => kit.zipPaths ?? []));
  const relevantZipFiles = zipFiles.filter((file) => !file.startsWith("mailings/"));
  const undeclaredZipFiles = relevantZipFiles.filter((file) => !declaredZipPaths.has(file));

  const rows = parity.kits.map((kit) => {
    const owners = kit.flowOwners ?? {};
    const templateOwners = ownerRows(owners.templates, templates, reactTemplateDir);
    const patternOwners = ownerRows(owners.patterns, patterns, reactPatternDir);
    const componentOwners = ownerRows(owners.components, components);
    const primitiveOwners = ownerRows(owners.primitives, primitives);
    const foundationOwners = ownerRows(owners.foundations, foundations);
    const missingZipPaths = (kit.zipPaths ?? []).filter((zipPath) => !fs.existsSync(path.join(zipRoot, zipPath)));
    const signals = sourceSignals(kit.zipPaths ?? []);
    const issues = [
      ...(validClassifications.has(kit.classification) ? [] : [`Invalid classification ${kit.classification}.`]),
      ...((kit.zipPaths ?? []).length ? [] : ["Missing ZIP path list."]),
      ...missingZipPaths.map((zipPath) => `Missing ZIP reference ${zipPath}.`),
      ...(kit.status ? [] : ["Missing status."]),
      ...(kit.requiredDecision ? [] : ["Missing required decision."]),
      ...((kit.migrationScope ?? []).length ? [] : ["Missing migration scope."]),
      ...((kit.cascadeRisks ?? []).length ? [] : ["Missing cascade risks."]),
      ...(kit.classification === "template-candidate" && !kit.candidateName ? ["Template candidate must name the candidate."] : []),
      ...(kit.classification === "covered-by-template" && !templateOwners.length ? ["Covered-by-template kit must list template owners."] : []),
      ...(kit.classification === "covered-by-pattern" && !patternOwners.length ? ["Covered-by-pattern kit must list pattern owners."] : []),
      ...templateOwners.filter((row) => !row.artifactFound).map((row) => `Unknown template owner ${row.name}.`),
      ...templateOwners.filter((row) => row.runtimeFound === false).map((row) => `Template owner ${row.name} lacks React runtime.`),
      ...patternOwners.filter((row) => !row.artifactFound).map((row) => `Unknown pattern owner ${row.name}.`),
      ...patternOwners.filter((row) => row.runtimeFound === false).map((row) => `Pattern owner ${row.name} lacks React runtime.`),
      ...componentOwners.filter((row) => !row.artifactFound).map((row) => `Unknown component owner ${row.name}.`),
      ...primitiveOwners.filter((row) => !row.artifactFound).map((row) => `Unknown primitive owner ${row.name}.`),
      ...foundationOwners.filter((row) => !row.artifactFound).map((row) => `Unknown foundation owner ${row.name}.`),
      ...(signals.hasTable && !["blocked-separate-channel", "covered-separate-channel"].includes(kit.classification) && !owners.components?.some((name) => slug(name).includes("table")) && !owners.patterns?.some((name) => slug(name).includes("table")) ? ["ZIP source contains table markup but no Table/Virtual Data Table owner is declared."] : []),
      ...(signals.hasSvgOrCanvas && kit.classification !== "blocked-separate-channel" && !owners.primitives?.includes("Charts") && !owners.primitives?.includes("Maps") ? ["ZIP source contains svg/canvas but no Charts or Maps primitive owner is declared."] : []),
    ];
    return {
      id: kit.id,
      classification: kit.classification,
      status: kit.status,
      candidateName: kit.candidateName,
      zipPaths: kit.zipPaths,
      sourceSignals: signals,
      owners: {
        foundations: foundationOwners,
        primitives: primitiveOwners,
        components: componentOwners,
        patterns: patternOwners,
        templates: templateOwners,
      },
      requiredDecision: kit.requiredDecision,
      migrationScope: kit.migrationScope ?? [],
      cascadeRisks: kit.cascadeRisks ?? [],
      issues,
    };
  });

  const inventory = {
    zipKits: rows.length,
    zipScreens: rows.reduce((sum, row) => sum + row.zipPaths.filter((file) => /\.(html|jsx)$/.test(file)).length, 0),
    flowTemplates: fs.existsSync(templateDir) ? fs.readdirSync(templateDir).filter((file) => file.endsWith(".json")).length : 0,
    coveredByTemplate: rows.filter((row) => row.classification === "covered-by-template").length,
    coveredByPattern: rows.filter((row) => row.classification === "covered-by-pattern").length,
    coveredSeparateChannel: rows.filter((row) => row.classification === "covered-separate-channel").length,
    blockedSeparateChannel: rows.filter((row) => row.classification === "blocked-separate-channel").length,
    templateCandidates: rows.filter((row) => row.classification === "template-candidate").length,
    unclassifiedKits: rows.filter((row) => !validClassifications.has(row.classification)).length,
    undeclaredZipFiles: undeclaredZipFiles.length,
    parityGovernanceDebt: rows.reduce((sum, row) => sum + row.issues.length, 0) + undeclaredZipFiles.length,
  };
  const expectedIssues = Object.entries(parity.expectedInventory ?? {})
    .filter(([key, value]) => inventory[key] !== value)
    .map(([key, value]) => `Expected ${key} to be ${value}, got ${inventory[key]}.`);
  const issues = [
    ...expectedIssues,
    ...undeclaredZipFiles.map((file) => `ZIP ui_kits file is not classified: ${file}.`),
    ...rows.flatMap((row) => row.issues.map((issue) => `${row.id}: ${issue}`)),
  ];
  return {
    status: issues.length ? "fail" : "pass",
    audit: "zip template parity",
    principle: parity.principle,
    generatedAt: new Date().toISOString(),
    inventory,
    kits: rows,
    issues,
  };
}

function markdown(report) {
  const lines = [
    "# ZIP template parity audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Kits",
    "",
    "| Kit | Classification | Status | Templates | Patterns | Components | Risks | Issues |",
    "| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |",
    ...report.kits.map((kit) => `| ${kit.id} | ${kit.classification} | ${kit.status} | ${kit.owners.templates.length} | ${kit.owners.patterns.length} | ${kit.owners.components.length} | ${kit.cascadeRisks.length} | ${kit.issues.length} |`),
    "",
    "## Template Candidates",
    "",
    ...(report.kits.filter((kit) => kit.classification === "template-candidate").map((kit) => `- ${kit.candidateName}: ${kit.requiredDecision}`)),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-zip-template-parity.js.`);
  }
}
if (!checkMode) {
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, markdown(report));
}

if (report.status !== "pass") {
  throw new Error(`ZIP template parity failed with ${report.issues.length} issue(s).`);
}
