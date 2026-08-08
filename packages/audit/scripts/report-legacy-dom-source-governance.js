#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "legacy-dom-source-governance-audit.json");
const markdownOutput = path.join(outputDir, "legacy-dom-source-governance-audit.md");
const selfFile = __filename;

const scanRoots = [
  path.join(root, "packages/audit/scripts"),
  path.join(root, "packages/react/src"),
  path.join(root, "packages/components/src"),
].filter((target) => fs.existsSync(target));

const legacyComponentFamilies = [
  "actions",
  "choices",
  "commerce",
  "display",
  "feedback",
  "fields",
  "interactions",
  "motion",
  "navigation",
  "overlays",
  "security",
  "specialized-inputs",
  "status",
  "surfaces",
];

const forbiddenRules = [
  {
    id: "legacy-component-dir",
    label: "Legacy DOM component directory",
    pattern: /packages\/components\/src\/components\//g,
  },
  {
    id: "legacy-component-family-file",
    label: "Legacy DOM component family file",
    pattern: new RegExp(`src/components/(?:${legacyComponentFamilies.join("|")})\\.js`, "g"),
  },
];

function walk(target) {
  const stat = fs.statSync(target);
  if (stat.isDirectory()) {
    return fs.readdirSync(target)
      .sort()
      .flatMap((entry) => walk(path.join(target, entry)));
  }
  if (!/\.(?:cjs|js|mjs|ts|tsx)$/.test(target)) return [];
  if (path.resolve(target) === path.resolve(selfFile)) return [];
  return [target];
}

function lineForIndex(source, index) {
  return source.slice(0, index).split("\n").length;
}

function createReport() {
  const files = [...new Set(scanRoots.flatMap((target) => walk(target)))]
    .sort((a, b) => rel(a).localeCompare(rel(b)));
  const violations = files.flatMap((file) => {
    const source = read(file);
    return forbiddenRules.flatMap((rule) => [...source.matchAll(rule.pattern)].map((match) => ({
      rule: rule.id,
      label: rule.label,
      file: rel(file),
      line: lineForIndex(source, match.index),
      match: match[0],
    })));
  });

  return {
    status: violations.length ? "fail" : "pass",
    audit: "legacy DOM source governance",
    principle: "Executable audits and package sources must target Flow React/system contracts, not the retired DOM component implementation paths.",
    inventory: {
      scanRoots: scanRoots.map((target) => rel(target)),
      filesScanned: files.length,
      violations: violations.length,
    },
    forbiddenRules: forbiddenRules.map((rule) => ({
      id: rule.id,
      label: rule.label,
    })),
    violations,
  };
}

function toMarkdown(report) {
  const violationRows = report.violations.map((violation) => (
    `| ${violation.rule} | ${violation.file}:${violation.line} | \`${violation.match.replaceAll("|", "\\|")}\` |`
  ));

  return [
    "# Legacy DOM Source Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Scan roots: ${report.inventory.scanRoots.join(", ")}`,
    `- Files scanned: ${report.inventory.filesScanned}`,
    `- Violations: ${report.inventory.violations}`,
    "",
    "## Violations",
    "",
    "| Rule | Location | Match |",
    "| --- | --- | --- |",
    ...(violationRows.length ? violationRows : ["| None | None | None |"]),
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
      console.error("Legacy DOM source governance report is stale. Run: node packages/audit/scripts/report-legacy-dom-source-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    filesScanned: report.inventory.filesScanned,
    violations: report.inventory.violations,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
