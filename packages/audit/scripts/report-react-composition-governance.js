#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");
const { allowedReactComponentComposition, reactComponentCompositionContracts } = require("./react-composition-contract-audit.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-composition-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-composition-governance-audit.md");

function componentFiles() {
  if (!fs.existsSync(reactSrcDir)) return [];
  return fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.js$/.test(file))
    .sort()
    .map((file) => path.join(reactSrcDir, file));
}

function localComponentImports(source) {
  return [...source.matchAll(/import\s+\{\s*([A-Z][A-Za-z0-9]*)\s*\}\s+from\s+"\.\/([A-Z][A-Za-z0-9]*)\.js"/g)]
    .map((match) => match[1])
    .sort();
}

function compositionReasons(component) {
  return new Map((reactComponentCompositionContracts[component] ?? []).map((edge) => [edge.component, edge.reason]));
}

function createReport() {
  const knownComponents = componentFiles().map((file) => path.basename(file, ".js")).sort();
  const knownComponentSet = new Set(knownComponents);
  const components = componentFiles().map((file) => {
    const component = path.basename(file, ".js");
    const source = read(file);
    const actual = localComponentImports(source);
    const allowed = [...(allowedReactComponentComposition[component] ?? [])].sort();
    const reasons = compositionReasons(component);
    const unexpected = actual.filter((item) => !allowed.includes(item));
    const missing = allowed.filter((item) => !actual.includes(item));
    const missingReasons = allowed.filter((item) => !reasons.get(item));
    const duplicateAllowed = allowed.filter((item, index) => allowed.indexOf(item) !== index);
    const unknownAllowed = allowed.filter((item) => !knownComponentSet.has(item));
    return {
      component,
      file: rel(file),
      actual,
      allowed,
      reasons: Object.fromEntries([...reasons.entries()].sort()),
      unexpected,
      missing,
      missingReasons,
      duplicateAllowed,
      unknownAllowed,
      status: unexpected.length || missing.length || missingReasons.length || duplicateAllowed.length || unknownAllowed.length ? "fail" : "pass",
    };
  });
  const unknownContractOwners = Object.keys(allowedReactComponentComposition).filter((component) => !knownComponentSet.has(component)).sort();
  const compositional = components.filter((item) => item.actual.length || item.allowed.length);
  const edges = components.flatMap((item) => item.actual.map((target) => ({
    from: item.component,
    to: target,
    reason: item.reasons[target] ?? "",
  })));
  const unexpectedImports = components.reduce((total, item) => total + item.unexpected.length, 0);
  const missingImports = components.reduce((total, item) => total + item.missing.length, 0);
  const missingReasons = components.reduce((total, item) => total + item.missingReasons.length, 0);
  const duplicateAllowed = components.reduce((total, item) => total + item.duplicateAllowed.length, 0);
  const unknownAllowed = components.reduce((total, item) => total + item.unknownAllowed.length, 0);
  const compositionDebt = unexpectedImports
    + missingImports
    + missingReasons
    + duplicateAllowed
    + unknownAllowed
    + unknownContractOwners.length;
  return {
    status: compositionDebt ? "fail" : "pass",
    audit: "react composition governance",
    principle: "React components may compose other Flow React components only through an explicit allowlist, so visual reuse is intentional and duplicate implementations cannot drift silently. The actionable debt metric is compositionDebt.",
    inventory: {
      components: components.length,
      compositionDebt,
      compositionalComponents: compositional.length,
      compositionEdges: edges.length,
      allowedEntries: Object.keys(allowedReactComponentComposition).length,
      unexpectedImports,
      missingImports,
      missingReasons,
      duplicateAllowed,
      unknownAllowed,
      unknownContractOwners: unknownContractOwners.length,
    },
    knownComponents,
    unknownContractOwners,
    edges,
    components,
  };
}

function toMarkdown(report) {
  const componentRows = report.components
    .filter((item) => item.actual.length || item.allowed.length || item.status !== "pass")
    .map((item) => `| ${item.component} | ${item.status} | ${item.allowed.join(", ") || "None"} | ${item.actual.join(", ") || "None"} | ${item.unexpected.join(", ") || "None"} | ${item.missing.join(", ") || "None"} | ${item.missingReasons.join(", ") || "None"} | ${item.duplicateAllowed.join(", ") || "None"} | ${item.unknownAllowed.join(", ") || "None"} |`);
  const edgeRows = report.edges.map((edge) => `| ${edge.from} | ${edge.to} | ${edge.reason || "None"} |`);
  return [
    "# React Composition Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- React components scanned: ${report.inventory.components}`,
    `- Composition debt: ${report.inventory.compositionDebt}`,
    `- Components with declared composition: ${report.inventory.compositionalComponents}`,
    `- Composition edges: ${report.inventory.compositionEdges}`,
    `- Allowlist entries: ${report.inventory.allowedEntries}`,
    `- Unexpected imports: ${report.inventory.unexpectedImports}`,
    `- Missing expected imports: ${report.inventory.missingImports}`,
    `- Missing composition reasons: ${report.inventory.missingReasons}`,
    `- Duplicate allowed edges: ${report.inventory.duplicateAllowed}`,
    `- Unknown allowed targets: ${report.inventory.unknownAllowed}`,
    `- Unknown contract owners: ${report.inventory.unknownContractOwners}`,
    "",
    "## Components",
    "",
    "| Component | Status | Allowed | Actual | Unexpected | Missing | Missing reasons | Duplicate allowed | Unknown targets |",
    "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
    ...(componentRows.length ? componentRows : ["| None | pass | None | None | None | None | None | None | None |"]),
    "",
    "## Unknown Contract Owners",
    "",
    ...(report.unknownContractOwners.length ? report.unknownContractOwners.map((component) => `- ${component}`) : ["- None"]),
    "",
    "## Edges",
    "",
    "| From | To | Reason |",
    "| --- | --- | --- |",
    ...(edgeRows.length ? edgeRows : ["| None | None | None |"]),
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
      console.error("React composition governance report is stale. Run: node packages/audit/scripts/report-react-composition-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    components: report.inventory.components,
    compositionDebt: report.inventory.compositionDebt,
    compositionalComponents: report.inventory.compositionalComponents,
    compositionEdges: report.inventory.compositionEdges,
    unexpectedImports: report.inventory.unexpectedImports,
    missingImports: report.inventory.missingImports,
    missingReasons: report.inventory.missingReasons,
    duplicateAllowed: report.inventory.duplicateAllowed,
    unknownAllowed: report.inventory.unknownAllowed,
    unknownContractOwners: report.inventory.unknownContractOwners,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
