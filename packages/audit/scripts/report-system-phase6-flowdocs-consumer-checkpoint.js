#!/usr/bin/env node

const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const docsRoot = path.join(root, "../FlowDocs");
const docsAppDir = path.join(docsRoot, "apps/docs");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-phase6-flowdocs-consumer-checkpoint.json");
const markdownOutput = path.join(outputDir, "system-phase6-flowdocs-consumer-checkpoint.md");

const sourceReports = [
  {
    id: "docs-system-boundary",
    file: "docs/audits/docs-system-boundary-audit.json",
    debtKeys: ["docsSystemBoundaryDebt"],
    required: {
      status: "pass",
      "inventory.flowDependencyPresent": 1,
      "inventory.missingFlowAliases": 0,
      "inventory.localFlowImportViolations": 0,
      "inventory.docsComponentTokenDefinitions": 0,
      "inventory.docsComponentClassDefinitions": 0,
      "inventory.docsUnapprovedPatternClassRoots": 0,
      "inventory.docsContractualPatternClassDefinitions": 0,
      "inventory.generatedComponentCssPresent": 1,
      "inventory.generatedTokenCssPresent": 1,
    },
  },
  {
    id: "docs-component-demo-ownership",
    file: "docs/audits/docs-component-demo-ownership.json",
    debtKeys: ["docsDemoOwnershipDebt"],
    required: {
      status: "pass",
      "inventory.violations": 0,
      "inventory.docsDemoOwnershipPolicyIssues": 0,
    },
  },
  {
    id: "flowdocs-p0-shell-cleanup",
    file: "docs/audits/flowdocs-p0-shell-cleanup-evidence.json",
    debtKeys: ["flowDocsP0ShellCleanupDebt"],
    required: {
      status: "pass",
      "inventory.failures": 0,
    },
  },
  {
    id: "phase5-public-runtime-readiness",
    file: "docs/audits/system-phase5-public-runtime-readiness.json",
    debtKeys: ["phase5PublicRuntimeReadinessDebt"],
    required: {
      status: "pass",
      "inventory.runtimeArtifacts": 151,
      "inventory.passingRuntimeArtifacts": 151,
    },
  },
];

const requiredFlowDocsTemplates = [
  "DocsShellTemplate",
  "DocsArtifactDetailTemplate",
];

function readJson(file) {
  const absolute = path.join(root, file);
  if (!fs.existsSync(absolute)) return null;
  return JSON.parse(fs.readFileSync(absolute, "utf8"));
}

function readText(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function walkFiles(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(file, predicate));
    else if (predicate(file)) files.push(file);
  }
  return files.sort();
}

function getValue(object, keyPath) {
  return keyPath.split(".").reduce((value, key) => (value == null ? undefined : value[key]), object);
}

function debtValue(report, key) {
  const candidates = [
    getValue(report, key),
    getValue(report, `inventory.${key}`),
    getValue(report, `summary.${key}`),
  ];
  const value = candidates.find((candidate) => candidate !== undefined);
  return Number(value ?? 0);
}

function rowFor(definition) {
  const report = readJson(definition.file);
  if (!report) {
    return {
      id: definition.id,
      file: definition.file,
      status: "missing",
      debt: 1,
      debts: [],
      mismatches: [{ key: "file", expected: "present", actual: "missing" }],
    };
  }
  const mismatches = Object.entries(definition.required)
    .filter(([key, expected]) => getValue(report, key) !== expected)
    .map(([key, expected]) => ({ key, expected, actual: getValue(report, key) }));
  const debts = definition.debtKeys.map((key) => ({ key, value: debtValue(report, key) }));
  const debt = debts.reduce((total, item) => total + item.value, 0) + mismatches.length;
  return {
    id: definition.id,
    file: definition.file,
    status: String(report.status ?? "unknown"),
    debt,
    debts,
    mismatches,
  };
}

function flowDocsEvidence() {
  const packageFile = path.join(docsRoot, "package.json");
  const packageJson = fs.existsSync(packageFile) ? JSON.parse(fs.readFileSync(packageFile, "utf8")) : {};
  const appFiles = walkFiles(docsAppDir, (file) => /\.(?:js|html|css)$/.test(file) && !file.includes(`${path.sep}generated${path.sep}`));
  const generatedFiles = walkFiles(path.join(docsAppDir, "generated"), (file) => fs.statSync(file).isFile());
  const generatedReactFiles = generatedFiles.filter((file) => file.includes(`${path.sep}generated${path.sep}react${path.sep}`));
  const generatedTemplateFiles = generatedReactFiles.filter((file) => file.includes(`${path.sep}templates${path.sep}`) && file.endsWith(".js"));
  const appText = appFiles.map(readText).join("\n");
  const templateUsages = requiredFlowDocsTemplates.map((template) => ({
    template,
    generatedRuntimePresent: generatedTemplateFiles.some((file) => file.endsWith(`${path.sep}${template}.js`)),
    appUsageCount: (appText.match(new RegExp(`\\b${template}\\b`, "g")) ?? []).length,
  }));
  const imports = packageJson.imports ?? {};
  const flowAliases = Object.entries(imports)
    .filter(([alias, target]) => alias.startsWith("#design-system/") && typeof target === "string" && target.startsWith("flow/"));
  const issues = [
    ...(fs.existsSync(docsAppDir) ? [] : ["FlowDocs apps/docs directory is missing"]),
    ...(packageJson.dependencies?.flow === "file:../Flow3.0" ? [] : [`FlowDocs flow dependency expected file:../Flow3.0, got ${packageJson.dependencies?.flow ?? "missing"}`]),
    ...(packageJson.scripts?.["validate:docs"] ? [] : ["FlowDocs validate:docs script is missing"]),
    ...(flowAliases.length >= 21 ? [] : [`expected at least 21 #design-system aliases, got ${flowAliases.length}`]),
    ...templateUsages.filter((usage) => !usage.generatedRuntimePresent).map((usage) => `${usage.template} generated runtime is missing`),
    ...templateUsages.filter((usage) => usage.appUsageCount === 0).map((usage) => `${usage.template} is not used by FlowDocs app source`),
  ];
  return {
    docsRoot: path.relative(root, docsRoot),
    appFiles: appFiles.length,
    generatedFiles: generatedFiles.length,
    generatedReactFiles: generatedReactFiles.length,
    generatedTemplateFiles: generatedTemplateFiles.length,
    flowDependency: packageJson.dependencies?.flow ?? null,
    flowBoundaryAliases: flowAliases.length,
    validateDocsScriptPresent: packageJson.scripts?.["validate:docs"] ? 1 : 0,
    templateUsages,
    issues,
  };
}

function createReport() {
  const rows = sourceReports.map(rowFor);
  const evidence = flowDocsEvidence();
  const sourceDebt = rows.reduce((total, row) => total + row.debt, 0);
  const consumerDebt = sourceDebt + evidence.issues.length;
  return {
    status: consumerDebt ? "fail" : "pass",
    audit: "system phase 6 FlowDocs consumer checkpoint",
    planIteration: 24,
    principle: "FlowDocs must consume Flow through package exports, generated assets, and governed documentation templates before any visual remediation can be trusted.",
    inventory: {
      reports: rows.length,
      passingReports: rows.filter((row) => row.status === "pass" && row.debt === 0).length,
      docsAppFiles: evidence.appFiles,
      docsGeneratedFiles: evidence.generatedFiles,
      docsGeneratedReactFiles: evidence.generatedReactFiles,
      docsGeneratedTemplateFiles: evidence.generatedTemplateFiles,
      flowDependencyPresent: evidence.flowDependency === "file:../Flow3.0" ? 1 : 0,
      flowBoundaryAliases: evidence.flowBoundaryAliases,
      validateDocsScriptPresent: evidence.validateDocsScriptPresent,
      requiredDocsTemplates: requiredFlowDocsTemplates.length,
      requiredDocsTemplatesPresent: evidence.templateUsages.filter((usage) => usage.generatedRuntimePresent).length,
      requiredDocsTemplatesUsed: evidence.templateUsages.filter((usage) => usage.appUsageCount > 0).length,
      sourceReportDebt: sourceDebt,
      flowDocsConsumerIssues: evidence.issues.length,
      phase6FlowDocsConsumerDebt: consumerDebt,
    },
    rows,
    flowDocs: evidence,
    residualRisk: [
      "This checkpoint proves FlowDocs has a governed consumer boundary; it does not claim visual parity with older FlowDocs screenshots.",
      "FlowDocs still contains docs-owned editorial/layout CSS and JS; those are allowed only while they stay outside protected Flow class roots and token ownership.",
      "Shell UX defects such as sidebar interaction, search keyboard navigation, and topbar alignment remain visual/behavior remediation work after this boundary checkpoint.",
    ],
  };
}

function toMarkdown(report) {
  const rows = report.rows.map((row) => `| ${row.id} | ${row.status} | ${row.debt} | ${row.file} | ${row.mismatches.map((mismatch) => `${mismatch.key}: expected ${JSON.stringify(mismatch.expected)}, got ${JSON.stringify(mismatch.actual)}`).join("<br>") || "None"} |`);
  const templateRows = report.flowDocs.templateUsages.map((usage) => `| ${usage.template} | ${usage.generatedRuntimePresent ? "yes" : "no"} | ${usage.appUsageCount} |`);
  return [
    "# System Phase 6 FlowDocs Consumer Checkpoint",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Reports: ${report.inventory.reports}`,
    `- Passing reports: ${report.inventory.passingReports}`,
    `- Docs app files: ${report.inventory.docsAppFiles}`,
    `- Docs generated files: ${report.inventory.docsGeneratedFiles}`,
    `- Docs generated React files: ${report.inventory.docsGeneratedReactFiles}`,
    `- Docs generated template files: ${report.inventory.docsGeneratedTemplateFiles}`,
    `- Flow dependency present: ${report.inventory.flowDependencyPresent}`,
    `- Flow boundary aliases: ${report.inventory.flowBoundaryAliases}`,
    `- validate:docs script present: ${report.inventory.validateDocsScriptPresent}`,
    `- Required docs templates: ${report.inventory.requiredDocsTemplates}`,
    `- Required docs templates present: ${report.inventory.requiredDocsTemplatesPresent}`,
    `- Required docs templates used: ${report.inventory.requiredDocsTemplatesUsed}`,
    `- Source report debt: ${report.inventory.sourceReportDebt}`,
    `- FlowDocs consumer issues: ${report.inventory.flowDocsConsumerIssues}`,
    `- Phase 6 FlowDocs consumer debt: ${report.inventory.phase6FlowDocsConsumerDebt}`,
    "",
    "## Source Matrix",
    "",
    "| Gate | Status | Debt | Report | Mismatches |",
    "| --- | --- | ---: | --- | --- |",
    ...rows,
    "",
    "## Required Docs Template Usage",
    "",
    "| Template | Generated runtime present | App usage count |",
    "| --- | --- | ---: |",
    ...templateRows,
    "",
    "## Residual Risk",
    "",
    ...report.residualRisk.map((risk) => `- ${risk}`),
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
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${toMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      console.error("System phase 6 FlowDocs consumer checkpoint is stale. Run: node packages/audit/scripts/report-system-phase6-flowdocs-consumer-checkpoint.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    requiredDocsTemplatesUsed: report.inventory.requiredDocsTemplatesUsed,
    flowBoundaryAliases: report.inventory.flowBoundaryAliases,
    phase6FlowDocsConsumerDebt: report.inventory.phase6FlowDocsConsumerDebt,
    json: "docs/audits/system-phase6-flowdocs-consumer-checkpoint.json",
    markdown: "docs/audits/system-phase6-flowdocs-consumer-checkpoint.md",
  }, null, 2));
  if (report.status !== "pass") process.exit(1);
}

main();
