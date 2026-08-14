#!/usr/bin/env node

const {
  fs,
  path,
  patternArtifacts,
  rel,
  root,
} = require("./audit-context.js");
const { pathToFileURL } = require("url");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-pattern-artifact-tests.json");
const markdownOutput = path.join(outputDir, "system-pattern-artifact-tests.md");
const reactPatternDistIndex = path.join(root, "packages/react/dist/patterns/index.js");
const reactPatternDistDir = path.join(root, "packages/react/dist/patterns");
const reactPatternSrcDir = path.join(root, "packages/react/src/patterns");
const patternArtifactDir = path.join(root, "packages/specs/specs/unison-system/artifacts/patterns");
const behaviorReportFile = path.join(root, "docs/audits/react-pattern-behavior-governance-audit.json");
const compositionReportFile = path.join(root, "docs/audits/react-pattern-composition-governance-audit.json");

function pascalCase(value) {
  return String(value)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join("")
    .replace(/^KPI/, "Kpi")
    .replace(/OTP/g, "Otp");
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function artifactFor(patternId) {
  const file = path.join(patternArtifactDir, `${patternId}.json`);
  if (!fs.existsSync(file)) return { file, artifact: null };
  const json = readJson(file);
  return { file, artifact: json.artifacts?.patterns?.[patternId] ?? null };
}

function metadata() {
  return [{ key: "status", label: "Status", value: "Ready" }];
}

function fixtureForPattern(patternName) {
  const commonItems = [
    { key: "one", id: "one", label: "One", title: "One", content: "One content", value: "one" },
    { key: "two", id: "two", label: "Two", title: "Two", content: "Two content", value: "two" },
  ];
  const fixtures = {
    ArtifactMetadataBar: { items: metadata() },
    AvatarGroup: { label: "Team", identities: [{ key: "ana", name: "Ana" }, { key: "leo", name: "Leo" }] },
    AvatarMenu: { name: "Ana Torres", items: [{ key: "profile", label: "Profile" }] },
    CalendarView: { selectedDate: "2026-08-14", events: [{ key: "inspection", label: "Inspection" }] },
    CheckboxGroup: { label: "Checks", options: commonItems },
    DemoPreviewFrame: { label: "Preview", preview: React.createElement("button", null, "Action") },
    DocumentationHero: { title: "Title", description: "Description", metadata: metadata() },
    DocumentationPageShell: {
      sidebar: React.createElement("nav", null, "Docs"),
      topbar: React.createElement("header", null, "Flow"),
      children: React.createElement("main", null, "Content"),
    },
    DocumentationPrimitiveDemo: { label: "Primitive demo", children: React.createElement("span", null, "Primitive") },
    DocumentationReferenceGrid: { items: [{ key: "button", label: "Button", description: "Action" }] },
    DocumentationSection: { title: "Section", description: "Description", children: React.createElement("span", null, "Child") },
    DocumentationTokenGrid: { items: [{ key: "token", token: "color.brand.primary", label: "Brand primary" }] },
    FileUpload: { label: "Upload file", files: [{ key: "one", name: "file.pdf", status: "uploaded" }] },
    FilterChipGroup: { label: "Filters", filters: [{ key: "status", label: "Active" }] },
    GanttChart: { rows: [{ key: "route", label: "Route", start: "2026-08-14", end: "2026-08-16" }] },
    KanbanBoard: { label: "Board", columns: [{ key: "todo", label: "To do", items: commonItems }] },
    MultiSelect: { label: "Options", options: commonItems },
    OnThisPageNav: { label: "On this page", items: [{ key: "intro", label: "Intro", href: "#intro" }] },
    RadioGroup: { label: "Radios", options: commonItems },
    RolesAndPermissions: { roles: [{ key: "admin", label: "Admin", permissions: ["read"] }], permissions: [{ key: "read", label: "Read" }] },
    Search: { label: "Search", query: "one", value: "one", results: [{ key: "one", label: "One" }] },
    SelectOptionLayer: { label: "Vehicle", options: commonItems },
    Sidebar: { label: "Nav", groups: [{ title: "Components", open: true, routes: [{ key: "button", label: "Button", active: true }] }], activeKey: "button", expandedIds: ["Components"] },
    Timeline: { events: [{ key: "created", label: "Created", time: "09:00" }] },
    Topbar: { label: "Topbar", search: { label: "Search", value: "button", results: [{ key: "button", label: "Button" }] }, actions: [{ key: "theme", label: "Theme", ariaLabel: "Theme" }] },
    TransferList: { sourceItems: commonItems, targetItems: [] },
  };
  return fixtures[patternName] ?? {};
}

function issueListFromBehavior(row) {
  if (!row) return ["missing behavior governance row"];
  return [
    ...(row.densityCascadeIssues ?? []),
    ...(row.stateCascadeIssues ?? []),
    ...(row.literalContractIssues ?? []),
    ...(row.propContractIssues ?? []),
    ...(row.contractStateIssues ?? []),
    ...(row.contractGovernanceIssues ?? []),
    ...(row.controlledIssues ?? []),
    ...(row.debts ?? []),
    ...(row.missingCallbackTests ?? []).map((callback) => `missing callback test ${callback}`),
    ...(row.unusedDeclaredProps ?? []).map((prop) => `unused declared prop ${prop}`),
    ...(row.unusedCallbacks ?? []).map((callback) => `unused callback ${callback}`),
    ...(row.statesMissingFromTypes ?? []).map((state) => `state missing from types ${state}`),
    ...(row.statesMissingFromArtifact ?? []).map((state) => `state missing from artifact ${state}`),
    ...(row.forbiddenPropsDeclared ?? []).map((prop) => `forbidden prop declared ${prop}`),
    ...(row.hasUnsafeRestSpread ? ["unsafe rest spread"] : []),
    ...(row.missingSurfaceSlotMarkers ?? []),
    ...(row.missingStructuralSurfaceUsage ? ["missing structural Surface usage"] : []),
    ...(row.missingAccessibilityImplementation ? ["missing accessibility implementation"] : []),
    ...(!row.hasSource ? ["missing source"] : []),
    ...(!row.hasTypes ? ["missing types"] : []),
    ...(!row.hasForwardRef ? ["missing forwardRef"] : []),
    ...(!row.hasRefAttributes ? ["missing RefAttributes"] : []),
    ...(!row.hasDataFlowPattern ? ["missing data-flow-pattern"] : []),
    ...(!row.hasDensityProp ? ["missing density prop"] : []),
  ];
}

function issueListFromComposition(row) {
  if (!row) return ["missing composition governance row"];
  const boundaryOnlyPatternDependencies = new Set(row.boundaryOnlyPatternDependencies ?? []);
  return [
    ...(row.missingFormalArtifact ? ["missing formal artifact"] : []),
    ...(row.missingRequiredComponentImports ?? []).map((item) => `missing component import ${item}`),
    ...(row.undeclaredComponentImports ?? []).map((item) => `undeclared component import ${item}`),
    ...(row.missingRuntimePatternImports ?? [])
      .filter((item) => !boundaryOnlyPatternDependencies.has(item))
      .map((item) => `missing runtime pattern import ${item}`),
    ...(row.undocumentedPatternBoundaries ?? []).map((item) => `undocumented pattern boundary ${item}`),
    ...(row.undeclaredPatternImports ?? []).map((item) => `undeclared pattern import ${item}`),
    ...(row.slotIssues ?? []),
    ...(row.slotRenderEvidenceIssues ?? []),
    ...(row.tokenIssues ?? []),
    ...(row.copyComponentIssues ?? []),
    ...(row.copyFoundationIssues ?? []),
    ...(row.copySurfaceIssues ?? []),
    ...(row.copyPrimitiveSlotIssues ?? []),
    ...(row.copyPatternDependencyIssues ?? []),
    ...(row.copyBoundaryDependencyIssues ?? []),
    ...(row.contractDependencyIssues ?? []),
    ...(row.contractSlotIssues ?? []),
    ...(row.rawDomVisuals ?? []),
    ...(row.rawDivIssues ?? []),
    ...(row.docsDependencies ?? []),
    ...(row.workspaceDependencies ?? []),
    ...(row.visualClassLiterals ?? []),
  ];
}

function rootTag(markup) {
  return markup.match(/^<[^>]+>/)?.[0] ?? "";
}

function renderPattern(Component, patternId, patternName) {
  const props = {
    label: "Reference",
    title: "Reference",
    description: "Reference description",
    density: "sm",
    state: "default",
    "data-pattern-artifact-test": patternId,
    style: { color: "rgb(255, 0, 0)", marginTop: 77 },
    dangerouslySetInnerHTML: { __html: "<strong>Injected markup</strong>" },
    ...fixtureForPattern(patternName),
  };
  let markup = "";
  const issues = [];
  try {
    markup = renderToStaticMarkup(React.createElement(Component, props));
  } catch (error) {
    issues.push(`render threw: ${error.message}`);
  }
  if (!markup.length) issues.push("empty render");
  if (/apps\/docs|docs-demo|gold-/i.test(markup)) issues.push("docs-only markup leaked into pattern render");
  if (/rgb\(255,\s*0,\s*0\)|margin-top:\s*77px|Injected markup|contenteditable=/i.test(markup)) {
    issues.push("external style or DOM escape prop leaked into pattern render");
  }
  if (!new RegExp(`data-flow-pattern="${patternId}"`).test(markup)) issues.push("missing data-flow-pattern marker in rendered output");
  return {
    status: issues.length ? "fail" : "pass",
    markupLength: markup.length,
    rootTag: rootTag(markup),
    issues,
  };
}

async function createReport() {
  const reactPatterns = await import(pathToFileURL(reactPatternDistIndex).href);
  const behaviorReport = readJson(behaviorReportFile);
  const compositionReport = readJson(compositionReportFile);
  const behaviorById = new Map(behaviorReport.patterns.map((row) => [row.patternId, row]));
  const compositionById = new Map(compositionReport.patterns.map((row) => [row.patternId, row]));
  const rows = patternArtifacts.map((patternId) => {
    const patternName = pascalCase(patternId);
    const Component = reactPatterns[patternName];
    const { file: artifactFile, artifact } = artifactFor(patternId);
    const typeFile = path.join(reactPatternDistDir, `${patternName}.d.ts`);
    const sourceFile = path.join(reactPatternSrcDir, `${patternName}.js`);
    const behavior = behaviorById.get(patternId);
    const composition = compositionById.get(patternId);
    const issues = [];
    if (!artifact) issues.push("missing formal pattern artifact");
    if (!Component) issues.push(`missing React pattern export ${patternName}`);
    if (!fs.existsSync(typeFile)) issues.push(`missing generated type file ${rel(typeFile)}`);
    if (!fs.existsSync(sourceFile)) issues.push(`missing source file ${rel(sourceFile)}`);
    const renderCheck = Component
      ? renderPattern(Component, patternId, patternName)
      : { status: "fail", markupLength: 0, rootTag: "", issues: ["not rendered"] };
    issues.push(...renderCheck.issues);
    const behaviorIssues = issueListFromBehavior(behavior);
    const compositionIssues = issueListFromComposition(composition);
    issues.push(...behaviorIssues, ...compositionIssues);
    const callbacks = behavior?.callbacks ?? [];
    const testedCallbacks = behavior?.testedCallbacks ?? [];
    const slotCount = composition?.slotCount ?? artifact?.slots?.length ?? 0;
    const slotUseCount = composition?.slotUseCount ?? 0;
    const declaredPatternDependencies = composition?.expectedPatternDependencies?.length ?? artifact?.patternDependencies?.length ?? 0;
    const runtimePatternImports = composition?.patternImports?.length ?? 0;
    return {
      patternId,
      pattern: patternName,
      status: issues.length ? "fail" : "pass",
      evidence: {
        artifact: rel(artifactFile),
        source: rel(sourceFile),
        types: rel(typeFile),
        runtime: "packages/react/dist/patterns/index.js",
        behavior: rel(behaviorReportFile),
        composition: rel(compositionReportFile),
      },
      checks: {
        export: Boolean(Component),
        render: renderCheck.status,
        callbacks: callbacks.length === testedCallbacks.length ? "pass" : "fail",
        slots: compositionIssues.some((issue) => /slot/i.test(issue)) ? "fail" : "pass",
        dependencies: compositionIssues.some((issue) => /dependency|import/i.test(issue)) ? "fail" : "pass",
        behavior: behaviorIssues.length ? "fail" : "pass",
        composition: compositionIssues.length ? "fail" : "pass",
      },
      metrics: {
        markupLength: renderCheck.markupLength,
        callbacks: callbacks.length,
        testedCallbacks: testedCallbacks.length,
        formalStates: behavior?.formalStates?.length ?? 0,
        typedStates: behavior?.typedStates?.length ?? 0,
        slotCount,
        slotUseCount,
        declaredPatternDependencies,
        runtimePatternImports,
        componentDependencies: artifact?.componentDependencies?.length ?? 0,
        primitiveDependencies: artifact?.primitiveDependencies?.length ?? 0,
        tokenDependencies: artifact?.tokenDependencies?.length ?? 0,
      },
      issues,
    };
  });
  const inventory = {
    patternArtifacts: patternArtifacts.length,
    runtimePatternExports: Object.keys(reactPatterns).length,
    testedPatterns: rows.length,
    passingPatterns: rows.filter((row) => row.status === "pass").length,
    failingPatterns: rows.filter((row) => row.status === "fail").length,
    renderedPatterns: rows.filter((row) => row.checks.render === "pass").length,
    callbackPropsDeclared: rows.reduce((total, row) => total + row.metrics.callbacks, 0),
    callbackPropsTested: rows.reduce((total, row) => total + row.metrics.testedCallbacks, 0),
    slotCount: rows.reduce((total, row) => total + row.metrics.slotCount, 0),
    slotUseCount: rows.reduce((total, row) => total + row.metrics.slotUseCount, 0),
    declaredPatternDependencies: rows.reduce((total, row) => total + row.metrics.declaredPatternDependencies, 0),
    runtimePatternImports: rows.reduce((total, row) => total + row.metrics.runtimePatternImports, 0),
    behaviorDebt: behaviorReport.inventory.reactPatternBehaviorDebt,
    compositionDebt: compositionReport.inventory.reactPatternCompositionDebt,
  };
  inventory.patternArtifactTestDebt = inventory.failingPatterns
    + inventory.behaviorDebt
    + inventory.compositionDebt;
  return {
    status: inventory.patternArtifactTestDebt ? "fail" : "pass",
    audit: "system pattern artifact tests",
    planIteration: 16,
    principle: "Every public React pattern artifact must be tested one by one from the built package boundary, with behavior, callbacks, slots, and declared dependency governance joined into the same matrix.",
    inventory,
    patterns: rows,
  };
}

function toMarkdown(report) {
  const rows = report.patterns.map((row) => `| ${row.patternId} | ${row.pattern} | ${row.status} | ${row.checks.render} | ${row.metrics.callbacks}/${row.metrics.testedCallbacks} | ${row.metrics.slotUseCount} | ${row.metrics.declaredPatternDependencies}/${row.metrics.runtimePatternImports} | ${row.issues.join("; ") || "None"} |`);
  return [
    "# System Pattern Artifact Tests",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Pattern artifacts: ${report.inventory.patternArtifacts}`,
    `- Runtime pattern exports: ${report.inventory.runtimePatternExports}`,
    `- Tested patterns: ${report.inventory.testedPatterns}`,
    `- Passing patterns: ${report.inventory.passingPatterns}`,
    `- Failing patterns: ${report.inventory.failingPatterns}`,
    `- Rendered patterns: ${report.inventory.renderedPatterns}`,
    `- Callback props declared/tested: ${report.inventory.callbackPropsDeclared}/${report.inventory.callbackPropsTested}`,
    `- Slot count/use count: ${report.inventory.slotCount}/${report.inventory.slotUseCount}`,
    `- Declared/runtime pattern dependencies: ${report.inventory.declaredPatternDependencies}/${report.inventory.runtimePatternImports}`,
    `- Behavior debt: ${report.inventory.behaviorDebt}`,
    `- Composition debt: ${report.inventory.compositionDebt}`,
    `- Pattern artifact test debt: ${report.inventory.patternArtifactTestDebt}`,
    "",
    "## Pattern Matrix",
    "",
    "| Pattern id | React pattern | Status | Render | Callbacks | Slot uses | Deps declared/runtime | Issues |",
    "| --- | --- | --- | --- | ---: | ---: | ---: | --- |",
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
      console.error("System pattern artifact tests report is stale. Run: node packages/audit/scripts/report-system-pattern-artifact-tests.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    testedPatterns: report.inventory.testedPatterns,
    passingPatterns: report.inventory.passingPatterns,
    patternArtifactTestDebt: report.inventory.patternArtifactTestDebt,
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
