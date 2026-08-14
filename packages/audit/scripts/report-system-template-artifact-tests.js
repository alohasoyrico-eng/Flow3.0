#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
  slug,
} = require("./audit-context.js");
const { pathToFileURL } = require("url");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-template-artifact-tests.json");
const markdownOutput = path.join(outputDir, "system-template-artifact-tests.md");
const templateArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const reactTemplateDistIndex = path.join(root, "packages/react/dist/templates/index.js");
const reactTemplateDistDir = path.join(root, "packages/react/dist/templates");
const reactTemplateSrcDir = path.join(root, "packages/react/src/templates");
const compositionReportFile = path.join(root, "docs/audits/react-template-composition-governance-audit.json");
const interactionReportFile = path.join(root, "docs/audits/react-template-interaction-governance-audit.json");
const runtimeReportFile = path.join(root, "docs/audits/react-template-runtime-governance-audit.json");
const visualReportFile = path.join(root, "docs/audits/react-template-visual-governance-audit.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function kebabCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^A-Za-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function pascalCase(value) {
  return String(value)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("");
}

function exportedTemplates() {
  const source = fs.readFileSync(reactTemplateDistIndex, "utf8");
  return [...source.matchAll(/export\s+\{\s*([A-Za-z0-9]+)\s*\}\s+from\s+"\.\/([A-Za-z0-9]+)\.js"/g)]
    .map((match) => ({ componentName: match[1], id: kebabCase(match[1]) }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

function artifactRecords() {
  return fs.readdirSync(templateArtifactDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const id = file.replace(/\.json$/, "");
      const json = readJson(path.join(templateArtifactDir, file));
      return {
        id,
        file: path.join(templateArtifactDir, file),
        artifact: json.artifacts?.templates?.[id] ?? null,
      };
    });
}

function metadata() {
  return [{ key: "status", label: "Status", value: "Ready" }];
}

function navItems() {
  return [{ key: "usage", label: "Usage", href: "#usage" }];
}

function docsChildren() {
  return React.createElement("section", { id: "usage" }, "Reference content");
}

function fixtureForTemplate(templateName) {
  const docsDetail = {
    title: "Reference artifact",
    description: "Reference description",
    metadata: metadata(),
    navItems: navItems(),
    demo: React.createElement("button", null, "Preview"),
    children: docsChildren(),
  };
  const fixtures = {
    ComponentDetailTemplate: docsDetail,
    DocsArtifactDetailTemplate: {
      artifactType: "Component",
      title: "Reference artifact",
      description: "Reference description",
      breadcrumbs: [{ key: "components", label: "Components" }],
      metadata: metadata(),
      tabs: [{ key: "usage", label: "Usage" }],
      selectedTabKey: "usage",
      body: docsChildren(),
    },
    DocsCollectionTemplate: {
      title: "Components",
      description: "Collection",
      metadata: metadata(),
      search: { label: "Search", query: "button", results: [{ key: "button", label: "Button" }] },
      toolbar: { label: "Toolbar", actions: [{ key: "filter", label: "Filter" }] },
      children: docsChildren(),
    },
    DocsHomeTemplate: {
      title: "Flow",
      description: "Documentation",
      metadata: metadata(),
      coverage: React.createElement("p", null, "Coverage"),
      status: React.createElement("p", null, "Status"),
      children: docsChildren(),
    },
    DocsShellTemplate: {
      label: "Flow documentation",
      sidebar: { label: "Docs", groups: [{ title: "Components", open: true, routes: [{ key: "button", label: "Button" }] }] },
      topbar: { label: "Flow" },
      search: { label: "Search", query: "button", results: [{ key: "button", label: "Button" }] },
      children: docsChildren(),
    },
    PatternDetailTemplate: {
      ...docsDetail,
      scenario: React.createElement("p", null, "Scenario"),
    },
    ReferenceDetailTemplate: docsDetail,
    TemplateDetailTemplate: docsDetail,
  };
  return fixtures[templateName] ?? {};
}

function renderTemplate(Component, templateId, templateName) {
  let markup = "";
  const issues = [];
  try {
    markup = renderToStaticMarkup(React.createElement(Component, {
      density: "sm",
      state: "loaded",
      "data-template-artifact-test": templateId,
      style: { color: "rgb(255, 0, 0)", marginTop: 77 },
      dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
      ...fixtureForTemplate(templateName),
    }));
  } catch (error) {
    issues.push(`render threw: ${error.message}`);
  }
  if (!markup.length) issues.push("empty render");
  if (!new RegExp(`data-flow-template="${templateId}"`).test(markup)) issues.push("missing data-flow-template marker in rendered output");
  if (/apps\/docs|docs-demo|gold-/i.test(markup)) issues.push("docs-only markup leaked into template render");
  if (/rgb\(255,\s*0,\s*0\)|margin-top:\s*77px|Injected markup|contenteditable=/i.test(markup)) {
    issues.push("external style or DOM escape prop leaked into template render");
  }
  return {
    status: issues.length ? "fail" : "pass",
    markupLength: markup.length,
    issues,
  };
}

function byId(rows, key = "id") {
  return new Map((rows ?? []).map((row) => [row[key], row]));
}

async function createReport() {
  const templateExports = exportedTemplates();
  const artifacts = artifactRecords();
  const artifactById = new Map(artifacts.map((record) => [record.id, record]));
  const reactTemplates = await import(pathToFileURL(reactTemplateDistIndex).href);
  const compositionReport = readJson(compositionReportFile);
  const interactionReport = readJson(interactionReportFile);
  const runtimeReport = readJson(runtimeReportFile);
  const visualReport = readJson(visualReportFile);
  const compositionById = byId(compositionReport.templates);
  const interactionById = byId(interactionReport.templates);
  const runtimeById = byId(runtimeReport.sourceChecks, "template");
  const runtimeRowsById = new Map();
  for (const row of runtimeReport.renderRows ?? []) {
    if (!runtimeRowsById.has(row.template)) runtimeRowsById.set(row.template, []);
    runtimeRowsById.get(row.template).push(row);
  }
  const visualRowsById = new Map();
  for (const row of visualReport.visualRows ?? []) {
    if (!visualRowsById.has(row.template)) visualRowsById.set(row.template, []);
    visualRowsById.get(row.template).push(row);
  }
  const rows = templateExports.map(({ id, componentName }) => {
    const Component = reactTemplates[componentName];
    const artifact = artifactById.get(id);
    const sourceFile = path.join(reactTemplateSrcDir, `${componentName}.js`);
    const typeFile = path.join(reactTemplateDistDir, `${componentName}.d.ts`);
    const composition = compositionById.get(id);
    const interaction = interactionById.get(id);
    const runtime = runtimeById.get(id);
    const renderRows = runtimeRowsById.get(id) ?? [];
    const visualRows = visualRowsById.get(id) ?? [];
    const renderCheck = Component
      ? renderTemplate(Component, id, componentName)
      : { status: "fail", markupLength: 0, issues: ["not rendered"] };
    const issues = [
      ...(!artifact ? ["missing formal template artifact"] : []),
      ...(!Component ? [`missing React template export ${componentName}`] : []),
      ...(!fs.existsSync(sourceFile) ? [`missing source file ${rel(sourceFile)}`] : []),
      ...(!fs.existsSync(typeFile) ? [`missing generated type file ${rel(typeFile)}`] : []),
      ...renderCheck.issues,
      ...(composition?.issues ?? []).map((issue) => `composition: ${issue}`),
      ...(interaction?.issues ?? []).map((issue) => `interaction: ${issue}`),
      ...(runtime?.missingSourceNeedles ?? []).map((item) => `runtime source gap: ${item.label ?? item}`),
      ...(runtime?.missingTypeNeedles ?? []).map((item) => `runtime type gap: ${item.label ?? item}`),
      ...(runtime?.exportGaps ?? []).map((item) => `runtime export gap: ${item}`),
      ...renderRows.flatMap((row) => (row.failures ?? []).map((failure) => `runtime render ${row.id}: ${failure}`)),
      ...visualRows.flatMap((row) => (row.failures ?? []).map((failure) => `visual ${row.case}: ${failure}`)),
    ];
    return {
      id,
      componentName,
      status: issues.length ? "fail" : "pass",
      evidence: {
        artifact: artifact ? rel(artifact.file) : null,
        source: rel(sourceFile),
        types: rel(typeFile),
        runtime: "packages/react/dist/templates/index.js",
        composition: rel(compositionReportFile),
        interaction: interaction ? rel(interactionReportFile) : null,
        runtimeGovernance: runtime ? rel(runtimeReportFile) : null,
        visualGovernance: visualRows.length ? rel(visualReportFile) : null,
      },
      checks: {
        export: Boolean(Component),
        formalArtifact: Boolean(artifact),
        render: renderCheck.status,
        composition: composition ? ((composition.issues ?? []).length ? "fail" : "pass") : "not-applicable",
        interaction: interaction ? ((interaction.issues ?? []).length ? "fail" : "pass") : "not-applicable",
        runtime: runtime ? (renderRows.every((row) => row.status === "pass") ? "pass" : "fail") : "not-applicable",
        visual: visualRows.length ? (visualRows.every((row) => row.status === "pass") ? "pass" : "fail") : "not-applicable",
      },
      metrics: {
        markupLength: renderCheck.markupLength,
        formalPatterns: composition?.formalPatterns?.length ?? artifact?.artifact?.patternDependencies?.length ?? 0,
        runtimePatternImports: composition?.runtimePatternImports?.length ?? 0,
        formalModules: composition?.formalModules?.length ?? artifact?.artifact?.modules?.length ?? 0,
        runtimeModules: composition?.runtimeModules?.length ?? 0,
        renderCases: renderRows.length,
        visualCases: visualRows.length,
        interactionCovered: Boolean(interaction),
      },
      issues,
    };
  });
  const exportedIds = new Set(templateExports.map((template) => template.id));
  const unexportedArtifacts = artifacts.filter((record) => !exportedIds.has(record.id)).map((record) => record.id);
  const inventory = {
    templateArtifacts: artifacts.length,
    runtimeTemplateExports: templateExports.length,
    testedTemplates: rows.length,
    passingTemplates: rows.filter((row) => row.status === "pass").length,
    failingTemplates: rows.filter((row) => row.status === "fail").length,
    renderedTemplates: rows.filter((row) => row.checks.render === "pass").length,
    templatesWithFormalArtifact: rows.filter((row) => row.checks.formalArtifact).length,
    unexportedTemplateArtifacts: unexportedArtifacts.length,
    compositionTemplates: compositionReport.inventory.templatesAudited,
    interactionTemplates: interactionReport.inventory.templatesAudited,
    runtimeTemplates: runtimeReport.inventory.templatesAudited,
    visualTemplates: visualReport.inventory.templatesAudited,
    compositionDebt: compositionReport.inventory.reactTemplateCompositionGovernanceDebt,
    interactionDebt: interactionReport.inventory.reactTemplateInteractionGovernanceDebt,
    runtimeDebt: runtimeReport.inventory.reactTemplateRuntimeGovernanceDebt,
    visualDebt: visualReport.inventory.reactTemplateVisualGovernanceDebt,
  };
  inventory.templateArtifactTestDebt = inventory.failingTemplates
    + inventory.unexportedTemplateArtifacts
    + inventory.compositionDebt
    + inventory.interactionDebt
    + inventory.runtimeDebt
    + inventory.visualDebt;
  return {
    status: inventory.templateArtifactTestDebt ? "fail" : "pass",
    audit: "system template artifact tests",
    planIteration: 17,
    principle: "Every public React template export must have a formal template artifact, render from the built package boundary, and link to applicable composition, interaction, runtime, and visual governance.",
    inventory,
    unexportedArtifacts,
    templates: rows,
  };
}

function toMarkdown(report) {
  const rows = report.templates.map((row) => `| ${row.id} | ${row.componentName} | ${row.status} | ${row.checks.formalArtifact ? "yes" : "no"} | ${row.checks.render} | ${row.checks.composition} | ${row.checks.interaction} | ${row.checks.runtime} | ${row.checks.visual} | ${row.issues.join("; ") || "None"} |`);
  return [
    "# System Template Artifact Tests",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Template artifacts: ${report.inventory.templateArtifacts}`,
    `- Runtime template exports: ${report.inventory.runtimeTemplateExports}`,
    `- Tested templates: ${report.inventory.testedTemplates}`,
    `- Passing templates: ${report.inventory.passingTemplates}`,
    `- Failing templates: ${report.inventory.failingTemplates}`,
    `- Rendered templates: ${report.inventory.renderedTemplates}`,
    `- Templates with formal artifact: ${report.inventory.templatesWithFormalArtifact}`,
    `- Unexported template artifacts: ${report.inventory.unexportedTemplateArtifacts}`,
    `- Composition/interaction/runtime/visual templates: ${report.inventory.compositionTemplates}/${report.inventory.interactionTemplates}/${report.inventory.runtimeTemplates}/${report.inventory.visualTemplates}`,
    `- Composition/interaction/runtime/visual debt: ${report.inventory.compositionDebt}/${report.inventory.interactionDebt}/${report.inventory.runtimeDebt}/${report.inventory.visualDebt}`,
    `- Template artifact test debt: ${report.inventory.templateArtifactTestDebt}`,
    "",
    "## Template Matrix",
    "",
    "| Template id | React template | Status | Artifact | Render | Composition | Interaction | Runtime | Visual | Issues |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...rows,
    "",
  ].join("\n");
}

function writeReport(report) {
  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${toMarkdown(report)}\n`);
}

async function main() {
  const report = await createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("System template artifact tests report is stale. Run: node packages/audit/scripts/report-system-template-artifact-tests.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    testedTemplates: report.inventory.testedTemplates,
    passingTemplates: report.inventory.passingTemplates,
    templateArtifactTestDebt: report.inventory.templateArtifactTestDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { createReport };
