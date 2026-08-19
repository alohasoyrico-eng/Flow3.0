const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "../../..");
const flowDocsRoot = path.resolve(root, "../FlowDocs/apps/docs");
const outDir = path.join(root, "docs/audits");
const jsonOut = path.join(outDir, "flowdocs-template-boundary.json");
const mdOut = path.join(outDir, "flowdocs-template-boundary.md");

const templateSourceDir = path.join(root, "packages/react/src/templates");
const templateSpecDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const generatedTemplateDir = path.join(flowDocsRoot, "generated/react/templates");

function exists(value) {
  return fs.existsSync(value);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function listFiles(dir, predicate = () => true) {
  if (!exists(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(full, predicate);
    return predicate(full) ? [full] : [];
  });
}

function rel(file) {
  return path.relative(root, file);
}

function flowDocsRel(file) {
  return path.relative(flowDocsRoot, file);
}

function countMatches(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function unique(values) {
  return [...new Set(values)].sort();
}

function mdTable(rows, columns) {
  if (!rows.length) return "_No rows._";
  const header = `| ${columns.join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map((row) => `| ${columns.map((column) => String(row[column] ?? "").replaceAll("\n", "<br>")).join(" | ")} |`);
  return [header, divider, ...body].join("\n");
}

const sourceTemplates = listFiles(templateSourceDir, (file) => file.endsWith(".ts") && !file.endsWith(".d.ts")).map((file) => ({
  name: path.basename(file, ".ts"),
  file: rel(file),
}));

const generatedTemplates = listFiles(generatedTemplateDir, (file) => file.endsWith(".js")).map((file) => ({
  name: path.basename(file, ".js"),
  file: path.relative(root, file),
}));

const templateSpecs = listFiles(templateSpecDir, (file) => file.endsWith(".json")).map((file) => ({
  name: path.basename(file, ".json"),
  file: rel(file),
}));

const docsJsFiles = listFiles(flowDocsRoot, (file) => {
  const relative = flowDocsRel(file);
  if (!file.endsWith(".js")) return false;
  if (relative.startsWith("generated/")) return false;
  if (relative.startsWith("vendor/")) return false;
  return true;
});

const pageRendererExports = [
  "renderHomeContent",
  "renderStackContent",
  "renderCollectionContent",
  "renderDetailContent",
  "renderReferenceDetailContent",
  "renderShell",
];

const localRendererNamePattern = /(?:layout|renderer|tabs|template|island|demo)/i;
const sourceTemplateNames = new Set(sourceTemplates.map((item) => item.name));

const docsTemplateUsages = [];
const localRendererFiles = [];
const htmlBoundaryFiles = [];

for (const file of docsJsFiles) {
  const source = read(file);
  const relative = flowDocsRel(file);
  const exportedRenderers = pageRendererExports.filter((name) => source.includes(`export function ${name}`));
  const hasReactTemplateIsland = /data-react-component=["'](?:docs-|[A-Z][A-Za-z]+Template)/.test(source) || /data-component-source=["']react-template/.test(source);
  const importsGeneratedTemplates = /generated\/react\/templates|generated\/react\/index/.test(source);
  const usesKnownTemplateName = [...sourceTemplateNames].filter((name) => source.includes(name));
  const htmlBoundary = {
    bodyHtml: countMatches(source, /\bbodyHtml\b/g),
    previewHtml: countMatches(source, /\bpreviewHtml\b/g),
    innerHTML: countMatches(source, /\.innerHTML\b/g),
    dangerouslySetInnerHTML: countMatches(source, /dangerouslySetInnerHTML/g),
    componentDemo: countMatches(source, /\bcomponentDemo\(/g),
    documentationSectionIsland: countMatches(source, /\bdocumentationSectionIsland\(/g),
  };
  const totalHtmlBoundarySignals = Object.values(htmlBoundary).reduce((sum, value) => sum + value, 0);

  if (localRendererNamePattern.test(path.basename(file)) || exportedRenderers.length) {
    localRendererFiles.push({
      file: relative,
      exportedRenderers,
      hasReactTemplateIsland,
      importsGeneratedTemplates,
      usesKnownTemplateName,
      htmlBoundarySignals: totalHtmlBoundarySignals,
    });
  }

  if (totalHtmlBoundarySignals > 0) {
    htmlBoundaryFiles.push({
      file: relative,
      ...htmlBoundary,
      total: totalHtmlBoundarySignals,
    });
  }

  const matches = [...source.matchAll(/data-react-component=["']([^"']+)["']/g)].map((match) => match[1]);
  const templateMatches = [...source.matchAll(/data-component-source=["']react-template["']/g)].length;
  if (matches.length || templateMatches) {
    docsTemplateUsages.push({
      file: relative,
      reactComponents: unique(matches).slice(0, 12),
      reactTemplateMarkers: templateMatches,
    });
  }
}

const requiredDocsTemplates = [
  "DocsShellTemplate",
  "DocsHomeTemplate",
  "DocsCollectionTemplate",
  "DocsArtifactDetailTemplate",
  "ReferenceDetailTemplate",
  "ComponentDetailTemplate",
  "PatternDetailTemplate",
  "TemplateDetailTemplate",
];

const missingSourceTemplates = requiredDocsTemplates.filter((name) => !sourceTemplateNames.has(name));
const missingGeneratedTemplates = requiredDocsTemplates.filter((name) => !generatedTemplates.some((item) => item.name === name));

const knownTemplateBoundary = {
  home: localRendererFiles.find((item) => item.file === "home-stack-renderers.js") ?? null,
  collection: localRendererFiles.find((item) => item.file === "docs-layout.js") ?? null,
  detailTabs: localRendererFiles.find((item) => item.file === "detail-tabs-core.js") ?? null,
  reference: localRendererFiles.find((item) => item.file === "reference-layout.js") ?? null,
  shell: localRendererFiles.find((item) => item.file === "docs-layout.js") ?? null,
};

const findings = [
  {
    severity: "high",
    title: "FlowDocs detail pages are still hybrid templates",
    evidence:
      "docs-layout.js mounts DocsArtifactDetailTemplate through a React island, but bodyHtml/tab bodies are still string HTML produced by local tab renderers.",
    files: ["../FlowDocs/apps/docs/docs-layout.js", "../FlowDocs/apps/docs/detail-tabs-core.js"],
  },
  {
    severity: "high",
    title: "Home and collection pages still have local page renderers",
    evidence:
      "renderHomeContent/renderStackContent/renderCollectionContent produce page sections and grids in FlowDocs instead of using DocsHomeTemplate/DocsCollectionTemplate as the full page contract.",
    files: ["../FlowDocs/apps/docs/home-stack-renderers.js", "../FlowDocs/apps/docs/docs-layout.js"],
  },
  {
    severity: "medium",
    title: "Foundation and primitive reference pages remain local body adapters",
    evidence:
      "reference-layout.js uses Flow islands for some sections/lists/grids, but still owns reference headers, breadcrumbs, peer nav, dividers and body composition.",
    files: ["../FlowDocs/apps/docs/reference-layout.js"],
  },
  {
    severity: "medium",
    title: "Generated templates exist, but generated runtime copy is not proof of template ownership",
    evidence:
      "FlowDocs has generated React templates, yet local renderers still decide page structure and content slots. The source of truth must remain packages/react plus specs.",
    files: ["../FlowDocs/apps/docs/generated/react/templates", "packages/react/src/templates"],
  },
];

const report = {
  generatedAt: new Date().toISOString(),
  status: "action_required",
  decision: "package-templates-exist-but-flowdocs-pages-are-hybrid",
  sourceOfTruth: {
    reactTemplates: sourceTemplates,
    templateSpecs,
    generatedFlowDocsTemplates: generatedTemplates,
    requiredDocsTemplates,
    missingSourceTemplates,
    missingGeneratedTemplates,
  },
  flowdocsBoundary: {
    docsJsFiles: docsJsFiles.length,
    localRendererFiles: localRendererFiles.length,
    htmlBoundaryFiles: htmlBoundaryFiles.length,
    reactTemplateUsageFiles: docsTemplateUsages.length,
    knownTemplateBoundary,
    localRendererFiles,
    htmlBoundaryFiles: htmlBoundaryFiles.sort((a, b) => b.total - a.total),
    docsTemplateUsages,
  },
  findings,
  remediationGate: [
    "DocsHomeTemplate owns home layout; home-stack-renderers.js can only provide typed content sections, not raw page layout.",
    "DocsCollectionTemplate owns collection index layout; docs-layout.js cannot render docs-page-intro/group-block/catalog-grid directly.",
    "DocsArtifactDetailTemplate owns detail structure and tabs; tab changes cannot mutate #tabPanel.innerHTML.",
    "ReferenceDetailTemplate owns foundation/primitive detail layout; reference-layout.js becomes content adapter or is removed.",
    "FlowDocs local HTML adapters must be named LegacyHtmlPageSlot/LegacyHtmlTabSlot with expiration gate.",
    "Consumer QA must cover home, collection, component detail, pattern detail, template detail, foundation detail and primitive detail.",
  ],
};

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`);

const md = `# FlowDocs Template Boundary

Status: **${report.status}**

Decision: **${report.decision}**

## Summary

- React template sources: **${sourceTemplates.length}**
- Template specs: **${templateSpecs.length}**
- Generated FlowDocs React templates: **${generatedTemplates.length}**
- FlowDocs JS files scanned: **${docsJsFiles.length}**
- Local renderer/template/demo/island files: **${localRendererFiles.length}**
- Files with HTML boundary signals: **${htmlBoundaryFiles.length}**
- Files using React template markers: **${docsTemplateUsages.length}**
- Missing required source templates: **${missingSourceTemplates.length ? missingSourceTemplates.join(", ") : "none"}**
- Missing required generated templates: **${missingGeneratedTemplates.length ? missingGeneratedTemplates.join(", ") : "none"}**

## Findings

${findings.map((finding) => `### ${finding.severity.toUpperCase()}: ${finding.title}\n\n${finding.evidence}\n\nFiles: ${finding.files.map((file) => `\`${file}\``).join(", ")}`).join("\n\n")}

## Known Template Boundary

${mdTable(
  Object.entries(knownTemplateBoundary).map(([boundary, item]) => ({
    boundary,
    file: item?.file ?? "missing",
    exportedRenderers: item?.exportedRenderers?.join(", ") || "",
    reactTemplateIsland: item?.hasReactTemplateIsland ? "yes" : "no",
    htmlBoundarySignals: item?.htmlBoundarySignals ?? 0,
  })),
  ["boundary", "file", "exportedRenderers", "reactTemplateIsland", "htmlBoundarySignals"],
)}

## Highest HTML Boundary Files

${mdTable(htmlBoundaryFiles.slice(0, 20), ["file", "bodyHtml", "previewHtml", "innerHTML", "dangerouslySetInnerHTML", "componentDemo", "documentationSectionIsland", "total"])}

## Local Renderer Files

${mdTable(
  localRendererFiles.map((item) => ({
    file: item.file,
    exportedRenderers: item.exportedRenderers.join(", "),
    reactTemplateIsland: item.hasReactTemplateIsland ? "yes" : "no",
    generatedImports: item.importsGeneratedTemplates ? "yes" : "no",
    knownTemplateNames: item.usesKnownTemplateName.join(", "),
    htmlBoundarySignals: item.htmlBoundarySignals,
  })),
  ["file", "exportedRenderers", "reactTemplateIsland", "generatedImports", "knownTemplateNames", "htmlBoundarySignals"],
)}

## Remediation Gate

${report.remediationGate.map((item) => `- ${item}`).join("\n")}
`;

fs.writeFileSync(mdOut, md);

console.log(JSON.stringify({
  status: report.status,
  decision: report.decision,
  reactTemplates: sourceTemplates.length,
  generatedTemplates: generatedTemplates.length,
  localRendererFiles: localRendererFiles.length,
  htmlBoundaryFiles: htmlBoundaryFiles.length,
  reactTemplateUsageFiles: docsTemplateUsages.length,
  findings: findings.length,
}, null, 2));
