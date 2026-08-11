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
const jsonOutput = path.join(outputDir, "template-cascade-governance-audit.json");
const markdownOutput = path.join(outputDir, "template-cascade-governance-audit.md");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const patternDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const primitiveDir = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives");
const foundationDir = path.join(root, "packages/specs/specs/unison-system/artifacts/foundations");
const reactPatternDir = path.join(root, "packages/react/src/patterns");
const reactPatternIndexFile = path.join(reactPatternDir, "index.js");
const reactTemplateDir = path.join(root, "packages/react/src/templates");
const reactTemplateIndexFile = path.join(reactTemplateDir, "index.js");
const reactIndexFile = path.join(root, "packages/react/src/index.js");
const rootPackageFile = path.join(root, "package.json");
const reactPackageFile = path.join(root, "packages/react/package.json");
const templateBlueprintsFile = path.join(root, "packages/content/content/template-blueprints.json");
const templateCatalogFile = path.join(root, "packages/content/content/catalog/templates.json");
const requiredRuntimeTemplateIds = new Set(["agent-workspace", "configuration-console", "driver-card-wallet", "driver-mobile-app", "fleet-dashboard-suite", "fleet-manager-desktop", "internal-operations-console", "routes-and-stations", "settings-workspace"]);
const templateSelectionContracts = new Map([
  ["agent-workspace", ["selectedConversation", "defaultSelectedConversation", "onSelectedConversationChange"]],
  ["configuration-console", ["selectedModule", "defaultSelectedModule", "onSelectedModuleChange"]],
  ["driver-card-wallet", ["selectedSection", "defaultSelectedSection", "onSelectedSectionChange"]],
  ["driver-mobile-app", ["selectedTab", "defaultSelectedTab", "onSelectedTabChange"]],
  ["fleet-dashboard-suite", ["selectedDashboard", "defaultSelectedDashboard", "onSelectedDashboardChange"]],
  ["fleet-manager-desktop", ["selectedDashboard", "defaultSelectedDashboard", "onSelectedDashboardChange"]],
  ["internal-operations-console", ["selectedModule", "defaultSelectedModule", "onSelectedModuleChange"]],
  ["routes-and-stations", ["selectedStationKey", "defaultSelectedStationKey", "onSelectedStationChange"]],
  ["settings-workspace", ["selectedSection", "defaultSelectedSection", "onSelectedSectionChange"]],
]);
const templateDrawerContracts = new Set(["configuration-console", "fleet-dashboard-suite", "fleet-manager-desktop", "internal-operations-console"]);

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function mergeContentJson(target, source) {
  const merged = { ...target };
  for (const [key, value] of Object.entries(source ?? {})) {
    if (key === "$systemShards") continue;
    if (Array.isArray(value)) {
      merged[key] = [...(Array.isArray(merged[key]) ? merged[key] : []), ...value];
    } else if (value && typeof value === "object" && !Array.isArray(value)) {
      merged[key] = mergeContentJson(merged[key] && typeof merged[key] === "object" && !Array.isArray(merged[key]) ? merged[key] : {}, value);
    } else {
      merged[key] = value;
    }
  }
  return merged;
}

function readContentJson(file) {
  const data = readJson(file);
  const shards = data.$systemShards ?? [];
  if (!shards.length) return data;
  return shards.reduce((merged, shard) => {
    const shardFile = path.join(path.dirname(file), shard);
    return mergeContentJson(merged, readContentJson(shardFile));
  }, mergeContentJson({}, data));
}

function titleFromId(id) {
  return id.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join(" ");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function pascalCase(value) {
  return slug(value).split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("");
}

function artifactRecords(dir, kind) {
  const rows = new Map();
  if (!fs.existsSync(dir)) return rows;
  for (const fileName of fs.readdirSync(dir).filter((file) => file.endsWith(".json")).sort()) {
    const file = path.join(dir, fileName);
    const id = fileName.replace(/\.json$/, "");
    const data = readJson(file);
    const record = data.artifacts?.[kind]?.[id] ?? data;
    rows.set(id, {
      id,
      name: record.name ?? titleFromId(id),
      file,
      relFile: rel(file),
      raw: record,
    });
  }
  return rows;
}

function nameIndex(records) {
  const index = new Map();
  for (const record of records.values()) {
    for (const name of unique([record.id, record.name, titleFromId(record.id)])) {
      index.set(slug(name), record);
    }
  }
  return index;
}

function dependencyRows(names, index) {
  return (names ?? []).map((name) => {
    const record = index.get(slug(name));
    return {
      name,
      id: record?.id ?? slug(name),
      found: Boolean(record),
      file: record?.relFile,
      record: record?.raw,
    };
  });
}

function missingFoundationTokens(template) {
  const tokens = new Set(template.tokenDependencies ?? []);
  return (template.governingFoundations ?? [])
    .map((name) => `sys.${slug(name)}.*`)
    .filter((token) => !tokens.has(token));
}

function missingPrimitiveTokens(template) {
  const primitiveIds = new Set((template.primitiveDependencies ?? []).map(slug));
  const tokens = new Set(template.tokenDependencies ?? []);
  const required = [
    ...(primitiveIds.has("surface") ? ["surface.*"] : []),
    ...(primitiveIds.has("charts") ? ["sys.charts.*"] : []),
    ...(primitiveIds.has("maps") ? ["sys.maps.*"] : []),
  ];
  return required.filter((token) => !tokens.has(token));
}

function createReport() {
  const templates = artifactRecords(templateDir, "templates");
  const patterns = artifactRecords(patternDir, "patterns");
  const primitives = artifactRecords(primitiveDir, "primitives");
  const foundations = artifactRecords(foundationDir, "foundations");
  const patternIndex = nameIndex(patterns);
  const primitiveIndex = nameIndex(primitives);
  const foundationIndex = nameIndex(foundations);
  const reactPatternIndex = read(reactPatternIndexFile);
  const reactTemplateIndex = read(reactTemplateIndexFile);
  const reactIndex = read(reactIndexFile);
  const rootPackage = fs.existsSync(rootPackageFile) ? readJson(rootPackageFile) : {};
  const reactPackage = fs.existsSync(reactPackageFile) ? readJson(reactPackageFile) : {};
  const blueprints = fs.existsSync(templateBlueprintsFile) ? readContentJson(templateBlueprintsFile).templates ?? {} : {};
  const catalogTemplates = fs.existsSync(templateCatalogFile) ? readJson(templateCatalogFile).templates ?? [] : [];
  const catalogIds = new Set(catalogTemplates.map((item) => item.id));
  const blueprintIds = new Set(Object.keys(blueprints).map(slug));

  const rows = [...templates.values()].map((templateRecord) => {
    const template = templateRecord.raw;
    const foundationDeps = dependencyRows(template.governingFoundations, foundationIndex);
    const primitiveDeps = dependencyRows(template.primitiveDependencies, primitiveIndex);
    const patternDeps = dependencyRows(template.patternDependencies, patternIndex);
    const surfaceDeclared = primitiveDeps.some((dep) => dep.id === "surface" && dep.found);
    const densityDeclared = primitiveDeps.some((dep) => dep.id === "density" && dep.found);
    const templateComponentName = pascalCase(templateRecord.id);
    const templateSourceFile = path.join(reactTemplateDir, `${templateComponentName}.js`);
    const templateTypesFile = path.join(reactTemplateDir, `${templateComponentName}.d.ts`);
    const templateSource = read(templateSourceFile);
    const selectionContract = templateSelectionContracts.get(templateRecord.id) ?? ["selectedModule", "defaultSelectedModule", "onSelectedModuleChange"];
    const templateRuntime = {
      required: requiredRuntimeTemplateIds.has(templateRecord.id),
      source: rel(templateSourceFile),
      types: rel(templateTypesFile),
      sourceExists: fs.existsSync(templateSourceFile),
      typesExist: fs.existsSync(templateTypesFile),
      templateIndexExport: reactTemplateIndex.includes(`export { ${templateComponentName} } from "./${templateComponentName}.js";`),
      packageIndexExport: reactIndex.includes(`export { ${templateComponentName} } from "./templates/${templateComponentName}.js";`),
      rootPackageExport: Boolean(rootPackage.exports?.[`./react/templates/${templateRecord.id}`]),
      reactPackageExport: Boolean(reactPackage.exports?.[`./templates/${templateRecord.id}`]),
      forwardRef: templateSource.includes(`forwardRef(function ${templateComponentName}`),
      importsSurface: templateSource.includes('import { Surface } from "../Surface.js"'),
      dataFlowTemplate: templateSource.includes(`"data-flow-template": "${templateRecord.id}"`),
      surfaceRoot: templateSource.includes("React.createElement(\n    Surface") || templateSource.includes("React.createElement(Surface"),
      controlledSelectedModule: selectionContract.every((needle) => templateSource.includes(needle)),
      controlledDrawer: !templateDrawerContracts.has(templateRecord.id) || (templateSource.includes("drawerOpen") && templateSource.includes("defaultDrawerOpen") && templateSource.includes("onDrawerOpenChange")),
      docsRuntimeReferences: /apps\/docs|docs-demo|gold-/.test(templateSource) ? 1 : 0,
      vanillaDomReferences: /document\.createElement|querySelector|innerHTML/.test(templateSource) ? 1 : 0,
    };
    const patternRuntimeRows = patternDeps.map((dep) => {
      const componentName = pascalCase(dep.id);
      const sourceFile = path.join(reactPatternDir, `${componentName}.js`);
      const typesFile = path.join(reactPatternDir, `${componentName}.d.ts`);
      const source = read(sourceFile);
      const patternPrimitiveIds = (dep.record?.primitiveDependencies ?? []).map(slug);
      const requiresSurface = patternPrimitiveIds.includes("surface");
      return {
        id: dep.id,
        name: dep.name,
        source: rel(sourceFile),
        types: rel(typesFile),
        sourceExists: fs.existsSync(sourceFile),
        typesExist: fs.existsSync(typesFile),
        exported: reactPatternIndex.includes(`export { ${componentName} } from "./${componentName}.js";`),
        dataFlowPattern: source.includes(`"data-flow-pattern": "${dep.id}"`),
        requiresSurface,
        importsSurface: source.includes('import { Surface } from "../Surface.js"'),
        surfaceDebt: requiresSurface && !source.includes('import { Surface } from "../Surface.js"'),
        templateBacklink: (dep.record?.templateDependencies ?? []).map(slug).includes(templateRecord.id),
      };
    });
    const missingRequiredSections = [
      ...((template.layer === "Template") ? [] : ["layer"]),
      ...(template.platform ? [] : ["platform"]),
      ...((template.governingFoundations ?? []).length ? [] : ["governingFoundations"]),
      ...((template.primitiveDependencies ?? []).length ? [] : ["primitiveDependencies"]),
      ...(((template.patternDependencies ?? []).length || (template.modules ?? []).length || (template.templateModuleDependencies ?? []).length) ? [] : ["patternDependencies or modules"]),
      ...((template.tokenDependencies ?? []).length ? [] : ["tokenDependencies"]),
      ...((template.states ?? []).length ? [] : ["states"]),
      ...((template.surfaces ?? []).length ? [] : ["surfaces"]),
      ...((template.qualityGates ?? []).length ? [] : ["qualityGates"]),
    ];
    const gaps = [
      ...missingRequiredSections.map((field) => `missing template section ${field}`),
      ...foundationDeps.filter((dep) => !dep.found).map((dep) => `unknown foundation ${dep.name}`),
      ...primitiveDeps.filter((dep) => !dep.found).map((dep) => `unknown primitive ${dep.name}`),
      ...patternDeps.filter((dep) => !dep.found).map((dep) => `unknown pattern ${dep.name}`),
      ...((template.surfaces ?? []).length && !surfaceDeclared ? ["template declares surfaces without Surface primitive dependency"] : []),
      ...((template.densityContext ?? []).length && !densityDeclared ? ["template declares densityContext without Density primitive dependency"] : []),
      ...missingFoundationTokens(template).map((token) => `missing foundation token dependency ${token}`),
      ...missingPrimitiveTokens(template).map((token) => `missing primitive token dependency ${token}`),
      ...(blueprintIds.has(templateRecord.id) ? [] : ["missing template blueprint"]),
      ...(catalogIds.has(templateRecord.id) ? [] : ["missing template catalog entry"]),
      ...(templateRuntime.required && !templateRuntime.sourceExists ? ["required React template source missing"] : []),
      ...(templateRuntime.required && !templateRuntime.typesExist ? ["required React template types missing"] : []),
      ...(templateRuntime.required && !templateRuntime.templateIndexExport ? ["required React template index export missing"] : []),
      ...(templateRuntime.required && !templateRuntime.packageIndexExport ? ["required React package index export missing"] : []),
      ...(templateRuntime.required && !templateRuntime.rootPackageExport ? ["required root package template subpath export missing"] : []),
      ...(templateRuntime.required && !templateRuntime.reactPackageExport ? ["required react package template subpath export missing"] : []),
      ...(templateRuntime.required && !templateRuntime.forwardRef ? ["required React template missing forwardRef"] : []),
      ...(templateRuntime.required && !templateRuntime.importsSurface ? ["required React template missing Surface import"] : []),
      ...(templateRuntime.required && !templateRuntime.dataFlowTemplate ? ["required React template missing data-flow-template"] : []),
      ...(templateRuntime.required && !templateRuntime.surfaceRoot ? ["required React template missing Surface root"] : []),
      ...(templateRuntime.required && !templateRuntime.controlledSelectedModule ? ["required React template missing controlled/uncontrolled selectedModule contract"] : []),
      ...(templateRuntime.required && !templateRuntime.controlledDrawer ? ["required React template missing controlled/uncontrolled drawer contract"] : []),
      ...(templateRuntime.docsRuntimeReferences ? ["React template references Docs runtime"] : []),
      ...(templateRuntime.vanillaDomReferences ? ["React template references vanilla DOM APIs"] : []),
      ...patternRuntimeRows.filter((row) => !row.sourceExists).map((row) => `React pattern source missing for ${row.name}`),
      ...patternRuntimeRows.filter((row) => !row.typesExist).map((row) => `React pattern types missing for ${row.name}`),
      ...patternRuntimeRows.filter((row) => !row.exported).map((row) => `React pattern index export missing for ${row.name}`),
      ...patternRuntimeRows.filter((row) => !row.dataFlowPattern).map((row) => `React pattern missing data-flow-pattern for ${row.name}`),
      ...patternRuntimeRows.filter((row) => row.surfaceDebt).map((row) => `React pattern ${row.name} declares Surface but does not import it`),
      ...patternRuntimeRows.filter((row) => !row.templateBacklink).map((row) => `Pattern ${row.name} does not backlink template ${templateRecord.name}`),
    ];
    return {
      id: templateRecord.id,
      name: templateRecord.name,
      file: templateRecord.relFile,
      platform: template.platform,
      foundations: foundationDeps.map(({ name, id, found, file }) => ({ name, id, found, file })),
      primitives: primitiveDeps.map(({ name, id, found, file }) => ({ name, id, found, file })),
      patterns: patternRuntimeRows,
      modules: template.modules ?? template.templateModuleDependencies ?? [],
      states: template.states ?? [],
      surfaces: template.surfaces ?? [],
      tokenDependencies: template.tokenDependencies ?? [],
      runtime: templateRuntime,
      missingRequiredSections,
      missingFoundationTokens: missingFoundationTokens(template),
      missingPrimitiveTokens: missingPrimitiveTokens(template),
      gaps,
    };
  });

  const gaps = rows.flatMap((row) => row.gaps.map((gap) => `${row.id}: ${gap}`));
  return {
    status: gaps.length ? "fail" : "pass",
    audit: "template cascade governance",
    principle: "Templates must prove the full cascade from formal Flow artifacts through foundations, primitives, Surface ownership, pattern dependencies, and React pattern contracts without relying on Docs renderers.",
    inventory: {
      templates: rows.length,
      templateArtifacts: templates.size,
      catalogTemplates: catalogIds.size,
      templateBlueprints: blueprintIds.size,
      templatesWithSurfacePrimitive: rows.filter((row) => row.primitives.some((dep) => dep.id === "surface" && dep.found)).length,
      templatesWithDensityPrimitive: rows.filter((row) => row.primitives.some((dep) => dep.id === "density" && dep.found)).length,
      templatePatternDependencies: rows.reduce((sum, row) => sum + row.patterns.length, 0),
      uniqueTemplatePatternDependencies: unique(rows.flatMap((row) => row.patterns.map((pattern) => pattern.id))).length,
      reactPatternSources: rows.reduce((sum, row) => sum + row.patterns.filter((pattern) => pattern.sourceExists).length, 0),
      reactPatternTypes: rows.reduce((sum, row) => sum + row.patterns.filter((pattern) => pattern.typesExist).length, 0),
      reactPatternExports: rows.reduce((sum, row) => sum + row.patterns.filter((pattern) => pattern.exported).length, 0),
      patternSurfaceContracts: rows.reduce((sum, row) => sum + row.patterns.filter((pattern) => pattern.requiresSurface).length, 0),
      patternSurfaceImports: rows.reduce((sum, row) => sum + row.patterns.filter((pattern) => pattern.importsSurface).length, 0),
      requiredReactTemplateRuntimes: requiredRuntimeTemplateIds.size,
      templatesWithReactRuntime: rows.filter((row) => row.runtime.sourceExists && row.runtime.typesExist).length,
      templateReactRuntimeBacklog: rows.filter((row) => !row.runtime.sourceExists || !row.runtime.typesExist).length,
      missingRequiredReactTemplateRuntimes: rows.filter((row) => row.runtime.required && (!row.runtime.sourceExists || !row.runtime.typesExist)).length,
      missingRequiredTemplateSurfaceRoots: rows.filter((row) => row.runtime.required && (!row.runtime.importsSurface || !row.runtime.surfaceRoot)).length,
      missingRequiredTemplateExports: rows.filter((row) => row.runtime.required && (!row.runtime.templateIndexExport || !row.runtime.packageIndexExport || !row.runtime.rootPackageExport || !row.runtime.reactPackageExport)).length,
      requiredTemplateControlledStateGaps: rows.filter((row) => row.runtime.required && (!row.runtime.controlledSelectedModule || !row.runtime.controlledDrawer)).length,
      templateDocsRuntimeReferences: rows.reduce((sum, row) => sum + row.runtime.docsRuntimeReferences, 0),
      templateVanillaDomReferences: rows.reduce((sum, row) => sum + row.runtime.vanillaDomReferences, 0),
      missingRequiredSections: rows.reduce((sum, row) => sum + row.missingRequiredSections.length, 0),
      missingFoundationTokens: rows.reduce((sum, row) => sum + row.missingFoundationTokens.length, 0),
      missingPrimitiveTokens: rows.reduce((sum, row) => sum + row.missingPrimitiveTokens.length, 0),
      templateCascadeGovernanceDebt: gaps.length,
    },
    rows,
    gaps,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.inventory).map(([key, value]) => `| ${key} | ${value} |`);
  const templateRows = report.rows.map((row) => [
    `| ${row.id}`,
    row.platform,
    row.primitives.map((primitive) => primitive.name).join(", "),
    row.patterns.map((pattern) => pattern.name).join(", ") || "Modules only",
    row.gaps.length,
    "|",
  ].join(" | "));
  const gapRows = report.gaps.map((gap) => `| ${gap} |`);
  return [
    "# Template Cascade Governance Audit",
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
    "## Template Matrix",
    "",
    "| Template | Platform | Primitives | React pattern path | Gaps |",
    "| --- | --- | --- | --- | ---: |",
    ...templateRows,
    "",
    "## Gaps",
    "",
    "| Gap |",
    "| --- |",
    ...(gapRows.length ? gapRows : ["| None |"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

const report = createReport();

if (checkMode) {
  const previous = fs.existsSync(jsonOutput) ? readJson(jsonOutput) : null;
  if (!previous || JSON.stringify(previous, null, 2) !== JSON.stringify(report, null, 2)) {
    console.error("Template cascade governance report is stale. Run: node packages/audit/scripts/report-template-cascade-governance.js");
    process.exit(1);
  }
  if (report.status !== "pass") {
    console.error(`Template cascade governance failed with ${report.gaps.length} gap(s).`);
    process.exit(1);
  }
} else {
  writeReport(report);
  if (report.status !== "pass") {
    console.error(`Template cascade governance failed with ${report.gaps.length} gap(s).`);
    process.exit(1);
  }
}
