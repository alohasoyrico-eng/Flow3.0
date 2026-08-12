#!/usr/bin/env node

const { fs, path, patternArtifacts: patternArtifactIds, root } = require("./audit-context.js");
const { packageCssClassRoots } = require("./class-root-governance.js");

const checkMode = process.argv.includes("--check");
const docsRootCandidates = [
  path.join(root, "../FlowDocs"),
  path.join(root, "apps/docs/../.."),
];
const docsRoot = docsRootCandidates.find((candidate) => fs.existsSync(path.join(candidate, "apps/docs")));
const docsPackageFile = docsRoot ? path.join(docsRoot, "package.json") : "";
const docsAppDir = docsRoot ? path.join(docsRoot, "apps/docs") : "";
const docsBoundaryFile = path.join(root, "packages/content/content/docs-system-boundary.json");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "docs-system-boundary-audit.json");
const markdownOutput = path.join(outputDir, "docs-system-boundary-audit.md");

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

const docsBoundaryPolicy = readJson(docsBoundaryFile) ?? {};
const requiredFlowAliases = Array.isArray(docsBoundaryPolicy.requiredFlowAliases)
  ? docsBoundaryPolicy.requiredFlowAliases
  : [];
const expectedInventory = docsBoundaryPolicy.expectedInventory && typeof docsBoundaryPolicy.expectedInventory === "object"
  ? docsBoundaryPolicy.expectedInventory
  : {};

function docsBoundaryPolicyIssues() {
  const issues = [];
  if (!Array.isArray(docsBoundaryPolicy.requiredFlowAliases) || !docsBoundaryPolicy.requiredFlowAliases.length) {
    issues.push("requiredFlowAliases must not be empty");
  }
  for (const alias of requiredFlowAliases) {
    if (typeof alias !== "string" || !alias.startsWith("#design-system/")) {
      issues.push(`invalid requiredFlowAlias: ${alias}`);
    }
  }
  if (!docsBoundaryPolicy.expectedInventory || typeof docsBoundaryPolicy.expectedInventory !== "object") {
    issues.push("expectedInventory must be an object");
  }
  for (const [key, expected] of Object.entries(expectedInventory)) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key) || !Number.isInteger(expected) || expected < 0) {
      issues.push(`invalid expectedInventory entry: ${key}`);
    }
  }
  return issues;
}

function docsPatternClassPolicy() {
  const policy = docsBoundaryPolicy.docsPatternClassPolicy ?? null;
  const issues = [];
  if (!policy) {
    issues.push("docsPatternClassPolicy is missing");
    return { approvedRootPrefixes: [], blockedFormalRootStrategy: "", reason: "", issues };
  }
  const approvedRootPrefixes = Array.isArray(policy.approvedRootPrefixes) ? policy.approvedRootPrefixes : [];
  if (!approvedRootPrefixes.length) issues.push("approvedRootPrefixes must not be empty");
  for (const prefix of approvedRootPrefixes) {
    if (typeof prefix !== "string" || !/^[a-z0-9_-]+-$/.test(prefix)) {
      issues.push(`invalid approvedRootPrefix: ${prefix}`);
    }
  }
  if (policy.blockedFormalRootStrategy !== "pattern-artifact-id") {
    issues.push("blockedFormalRootStrategy must be pattern-artifact-id");
  }
  if (typeof policy.reason !== "string" || !policy.reason.trim()) {
    issues.push("reason must explain the docs/system boundary");
  }
  return {
    approvedRootPrefixes,
    blockedFormalRootStrategy: policy.blockedFormalRootStrategy ?? "",
    reason: policy.reason ?? "",
    issues,
  };
}

function allowedPackageClassRoots() {
  const entries = docsBoundaryPolicy.allowedPackageClassRoots ?? [];
  return new Set(entries
    .map((entry) => entry.root)
    .filter((rootToken) => typeof rootToken === "string" && rootToken.trim()));
}

function protectedFlowClassRoots() {
  const allowedRoots = allowedPackageClassRoots();
  return [...packageCssClassRoots(root)]
    .filter((rootToken) => !allowedRoots.has(rootToken))
    .sort();
}

function isApprovedDocsPatternClassRoot(classRoot, policy) {
  return policy.approvedRootPrefixes.some((prefix) => classRoot.startsWith(prefix));
}

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(file, predicate));
    else if (predicate(file)) out.push(file);
  }
  return out.sort();
}

function relative(file) {
  return path.relative(root, file);
}

function isGeneratedOrVendor(file) {
  return file.includes(`${path.sep}generated${path.sep}`) || file.includes(`${path.sep}vendor${path.sep}`);
}

function sourceFiles() {
  return walkFiles(docsAppDir, (file) => /\.(?:js|css|html)$/.test(file) && !isGeneratedOrVendor(file));
}

function generatedFiles() {
  return walkFiles(path.join(docsAppDir, "generated"), (file) => fs.statSync(file).isFile());
}

function componentTokenDefinitions(files) {
  const definitions = [];
  for (const file of files.filter((item) => item.endsWith(".css"))) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(/--comp-[a-z0-9-]+\s*:/g)) {
      definitions.push({
        file: relative(file),
        line: text.slice(0, match.index).split("\n").length,
        token: match[0].replace(":", ""),
      });
    }
  }
  return definitions;
}

function componentClassDefinitions(files) {
  const definitions = [];
  const roots = protectedFlowClassRoots().map((rootToken) => rootToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  if (!roots) return definitions;
  const selectorPattern = new RegExp(`(^|[,{\\s])\\.(${roots})(?=$|[\\s.#:[>{,+~]|__|--)`, "gm");
  for (const file of files.filter((item) => item.endsWith(".css"))) {
    const text = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const match of text.matchAll(selectorPattern)) {
      definitions.push({
        file: relative(file),
        line: text.slice(0, match.index).split("\n").length,
        classRoot: match[2],
      });
    }
  }
  return definitions;
}

function formalPatternClassRoots() {
  return new Set(patternArtifactIds.map((id) => `pattern-${id}`));
}

function patternClassDefinitions(files) {
  const definitions = [];
  const contractualRoots = formalPatternClassRoots();
  const selectorPattern = /(^|[,{\s])\.(pattern[a-z0-9_-]*)(?=$|[\s.#:[>{,+~]|__|--)/gm;
  for (const file of files.filter((item) => item.endsWith(".css"))) {
    const text = fs.readFileSync(file, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    for (const match of text.matchAll(selectorPattern)) {
      const classRoot = match[2];
      const contractualRoot = [...contractualRoots].find((root) => classRoot === root || classRoot.startsWith(`${root}__`) || classRoot.startsWith(`${root}--`)) ?? "";
      definitions.push({
        file: relative(file),
        line: text.slice(0, match.index).split("\n").length,
        classRoot,
        contractualRoot,
      });
    }
  }
  return definitions;
}

function localFlowImportViolations(files) {
  const violations = [];
  const forbidden = /(?:\.\.\/Flow3\.0|packages\/(?:components|react|tokens|specs|content)|#design-system\/docs)/g;
  for (const file of files.filter((item) => /\.(?:js|html)$/.test(item))) {
    const text = fs.readFileSync(file, "utf8");
    for (const match of text.matchAll(forbidden)) {
      violations.push({
        file: relative(file),
        line: text.slice(0, match.index).split("\n").length,
        value: match[0],
      });
    }
  }
  return violations;
}

function createReport() {
  const pkg = readJson(docsPackageFile) ?? {};
  const imports = pkg.imports ?? {};
  const scanned = sourceFiles();
  const generated = generatedFiles();
  const missingFlowAliases = requiredFlowAliases.filter((alias) => !imports[alias]);
  const nonFlowAliases = Object.entries(imports)
    .filter(([alias, target]) => alias.startsWith("#design-system/") && typeof target === "string" && !target.startsWith("flow/"))
    .map(([alias, target]) => ({ alias, target }));
  const tokenDefinitions = componentTokenDefinitions(scanned);
  const classDefinitions = componentClassDefinitions(scanned);
  const protectedClassRoots = protectedFlowClassRoots();
  const patternDefinitions = patternClassDefinitions(scanned);
  const patternPolicy = docsPatternClassPolicy();
  const policyIssues = docsBoundaryPolicyIssues();
  const contractualPatternDefinitions = patternDefinitions.filter((item) => item.contractualRoot);
  const unapprovedPatternClassRoots = [...new Set(patternDefinitions
    .map((item) => item.classRoot)
    .filter((classRoot) => !isApprovedDocsPatternClassRoot(classRoot, patternPolicy)))]
    .sort();
  const importViolations = localFlowImportViolations(scanned);
  const inventory = {
    sourceFilesScanned: scanned.length,
    generatedFiles: generated.length,
    flowDependencyPresent: pkg.dependencies?.flow ? 1 : 0,
    flowBoundaryAliases: Object.entries(imports).filter(([alias, target]) => alias.startsWith("#design-system/") && typeof target === "string" && target.startsWith("flow/")).length,
    missingFlowAliases: missingFlowAliases.length,
    localFlowImportViolations: importViolations.length + nonFlowAliases.length,
    docsComponentTokenDefinitions: tokenDefinitions.length,
    docsComponentTokenDefinitionFiles: new Set(tokenDefinitions.map((item) => item.file)).size,
    docsProtectedFlowClassRoots: protectedClassRoots.length,
    docsComponentClassDefinitions: classDefinitions.length,
    docsComponentClassDefinitionFiles: new Set(classDefinitions.map((item) => item.file)).size,
    docsPatternClassDefinitions: patternDefinitions.length,
    docsPatternClassRoots: new Set(patternDefinitions.map((item) => item.classRoot)).size,
    docsUnapprovedPatternClassRoots: unapprovedPatternClassRoots.length,
    docsPatternClassPolicyIssues: patternPolicy.issues.length + policyIssues.length,
    docsContractualPatternClassDefinitions: contractualPatternDefinitions.length,
    docsContractualPatternClassDefinitionFiles: new Set(contractualPatternDefinitions.map((item) => item.file)).size,
    generatedComponentCssPresent: fs.existsSync(path.join(docsAppDir, "generated/components.css")) ? 1 : 0,
    generatedTokenCssPresent: fs.existsSync(path.join(docsAppDir, "generated/tokens.css")) ? 1 : 0,
  };
  inventory.docsSystemBoundaryDebt = inventory.missingFlowAliases
    + inventory.localFlowImportViolations
    + inventory.docsComponentTokenDefinitions
    + inventory.docsComponentClassDefinitions
    + inventory.docsUnapprovedPatternClassRoots
    + inventory.docsPatternClassPolicyIssues
    + inventory.docsContractualPatternClassDefinitions
    + (inventory.flowDependencyPresent ? 0 : 1)
    + (inventory.generatedComponentCssPresent ? 0 : 1)
    + (inventory.generatedTokenCssPresent ? 0 : 1);
  const baselineMismatches = Object.entries(expectedInventory)
    .filter(([key, expected]) => inventory[key] !== expected)
    .map(([key, expected]) => ({ key, expected, actual: inventory[key] }));
  const unexpectedInventoryMetrics = Object.keys(inventory)
    .filter((key) => expectedInventory[key] === undefined)
    .sort()
    .map((key) => ({ key, actual: inventory[key] }));
  inventory.docsSystemBoundaryDebt += baselineMismatches.length + unexpectedInventoryMetrics.length;
  return {
    status: inventory.docsSystemBoundaryDebt ? "fail" : "pass",
    audit: "docs system boundary",
    principle: "FlowDocs must consume Flow through package exports and generated assets; any docs-owned component tokens or missing aliases are tracked debt, not invisible system behavior. The actionable debt metric is docsSystemBoundaryDebt.",
    docsRoot: relative(docsRoot),
    inventory,
    baseline: {
      inventory: expectedInventory,
      mismatches: baselineMismatches,
      unexpectedInventoryMetrics,
    },
    missingFlowAliases,
    nonFlowAliases,
    localFlowImportViolations: importViolations,
    protectedFlowClassRoots: protectedClassRoots,
    docsPatternClassPolicy: {
      file: relative(docsBoundaryFile),
      ...patternPolicy,
      boundaryIssues: policyIssues,
    },
    docsComponentTokenDefinitions: tokenDefinitions,
    docsComponentClassDefinitions: classDefinitions,
    docsPatternClassDefinitions: patternDefinitions,
    docsUnapprovedPatternClassRoots: unapprovedPatternClassRoots,
    docsContractualPatternClassDefinitions: contractualPatternDefinitions,
  };
}

function toMarkdown(report) {
  const baselineRows = Object.entries(report.baseline.inventory)
    .map(([key, expected]) => `| ${key} | ${expected} | ${report.inventory[key]} |`);
  const mismatchRows = report.baseline.mismatches
    .map((item) => `| ${item.key} | ${item.expected} | ${item.actual} |`);
  const unexpectedMetricRows = report.baseline.unexpectedInventoryMetrics
    .map((item) => `| ${item.key} | ${item.actual} |`);
  const missingAliasRows = report.missingFlowAliases.map((alias) => `| ${alias} |`);
  const tokenRows = report.docsComponentTokenDefinitions
    .slice(0, 80)
    .map((item) => `| ${item.file}:${item.line} | ${item.token} |`);
  const classRows = report.docsComponentClassDefinitions
    .slice(0, 80)
    .map((item) => `| ${item.file}:${item.line} | .${item.classRoot} |`);
  const unapprovedPatternRows = report.docsUnapprovedPatternClassRoots
    .map((classRoot) => `| .${classRoot} |`);
  const contractualPatternRows = report.docsContractualPatternClassDefinitions
    .slice(0, 80)
    .map((item) => `| ${item.file}:${item.line} | .${item.classRoot} | ${item.contractualRoot} |`);
  return [
    "# Docs System Boundary Audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Docs root: ${report.docsRoot}`,
    `- Source files scanned: ${report.inventory.sourceFilesScanned}`,
    `- Generated files: ${report.inventory.generatedFiles}`,
    `- Flow dependency present: ${report.inventory.flowDependencyPresent}`,
    `- Flow boundary aliases: ${report.inventory.flowBoundaryAliases}`,
    `- Missing Flow aliases: ${report.inventory.missingFlowAliases}`,
    `- Local Flow import violations: ${report.inventory.localFlowImportViolations}`,
    `- Docs component token definitions: ${report.inventory.docsComponentTokenDefinitions}`,
    `- Docs component token definition files: ${report.inventory.docsComponentTokenDefinitionFiles}`,
    `- Docs protected Flow class roots: ${report.inventory.docsProtectedFlowClassRoots}`,
    `- Docs component class definitions: ${report.inventory.docsComponentClassDefinitions}`,
    `- Docs component class definition files: ${report.inventory.docsComponentClassDefinitionFiles}`,
    `- Docs pattern class definitions: ${report.inventory.docsPatternClassDefinitions}`,
    `- Docs pattern class roots: ${report.inventory.docsPatternClassRoots}`,
    `- Docs unapproved pattern class roots: ${report.inventory.docsUnapprovedPatternClassRoots}`,
    `- Docs pattern class policy issues: ${report.inventory.docsPatternClassPolicyIssues}`,
    `- Docs contractual pattern class definitions: ${report.inventory.docsContractualPatternClassDefinitions}`,
    `- Docs contractual pattern class definition files: ${report.inventory.docsContractualPatternClassDefinitionFiles}`,
    `- Docs system boundary debt: ${report.inventory.docsSystemBoundaryDebt}`,
    `- Unexpected inventory metrics: ${report.baseline.unexpectedInventoryMetrics.length}`,
    "",
    "## Baseline Budget",
    "",
    "| Metric | Expected | Actual |",
    "| --- | ---: | ---: |",
    ...baselineRows,
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
    "## Missing Flow Aliases",
    "",
    "| Alias |",
    "| --- |",
    ...(missingAliasRows.length ? missingAliasRows : ["| None |"]),
    "",
    "## Docs Component Token Definitions",
    "",
    "| Location | Token |",
    "| --- | --- |",
    ...(tokenRows.length ? tokenRows : ["| None | None |"]),
    "",
    "## Docs Component Class Definitions",
    "",
    "| Location | Class Root |",
    "| --- | --- |",
    ...(classRows.length ? classRows : ["| None | None |"]),
    "",
    "## Docs Unapproved Pattern Class Roots",
    "",
    `Policy file: ${report.docsPatternClassPolicy.file}. Approved prefixes: ${report.docsPatternClassPolicy.approvedRootPrefixes.join(", ") || "None"}. Formal root strategy: ${report.docsPatternClassPolicy.blockedFormalRootStrategy || "None"}.`,
    "",
    "Docs may use editorial/demo `.pattern-*` roots under the approved namespace. Formal pattern roots generated from Flow artifacts remain blocked so FlowDocs cannot grow a second pattern implementation surface by accident.",
    "",
    "| Class Root |",
    "| --- |",
    ...(unapprovedPatternRows.length ? unapprovedPatternRows : ["| None |"]),
    "",
    "## Docs Contractual Pattern Class Definitions",
    "",
    "Docs may own demo/editorial `.pattern-*` wrappers, but must not define a formal Pattern root such as `.pattern-search` or `.pattern-search__item`.",
    "",
    "| Location | Class Root | Formal Pattern Root |",
    "| --- | --- | --- |",
    ...(contractualPatternRows.length ? contractualPatternRows : ["| None | None | None |"]),
    "",
  ].join("\n");
}

function main() {
  if (!docsRoot) {
    console.log(JSON.stringify({
      status: "skipped",
      scope: "external-docs-not-available",
      reason: "docs system boundary audit requires apps/docs or sibling FlowDocs/apps/docs.",
      json: path.relative(root, jsonOutput),
      markdown: path.relative(root, markdownOutput),
    }, null, 2));
    return;
  }

  const report = createReport();
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;

  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("Docs system boundary report is stale. Run: node packages/audit/scripts/report-docs-system-boundary.js");
      process.exit(1);
    }
  } else {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }

  console.log(JSON.stringify({
    status: report.status,
    sourceFilesScanned: report.inventory.sourceFilesScanned,
    generatedFiles: report.inventory.generatedFiles,
    missingFlowAliases: report.inventory.missingFlowAliases,
    localFlowImportViolations: report.inventory.localFlowImportViolations,
    docsComponentTokenDefinitions: report.inventory.docsComponentTokenDefinitions,
    docsProtectedFlowClassRoots: report.inventory.docsProtectedFlowClassRoots,
    docsComponentClassDefinitions: report.inventory.docsComponentClassDefinitions,
    docsPatternClassDefinitions: report.inventory.docsPatternClassDefinitions,
    docsPatternClassRoots: report.inventory.docsPatternClassRoots,
    docsUnapprovedPatternClassRoots: report.inventory.docsUnapprovedPatternClassRoots,
    docsPatternClassPolicyIssues: report.inventory.docsPatternClassPolicyIssues,
    docsContractualPatternClassDefinitions: report.inventory.docsContractualPatternClassDefinitions,
    docsSystemBoundaryDebt: report.inventory.docsSystemBoundaryDebt,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
