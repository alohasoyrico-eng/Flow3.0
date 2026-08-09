#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { antiDuplicationCoverage, checkAntiDuplicationGovernance } = require("./audit-anti-duplication.js");
const { result } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "anti-duplication-coverage.json");
const markdownOutput = path.join(outputDir, "anti-duplication-coverage.md");

function renderMarkdown(report) {
  const concepts = report.duplicateConcepts
    .map((item) => `| ${item.concept} | ${item.classNames.join(", ")} |`)
    .join("\n");
  const checks = report.checks.map((item) => `- ${item}`).join("\n");
  const missingOwnerRows = report.rootRegistry.missingOwnerRoots
    .map((item) => `| ${item.component} | ${item.reactComponent} | ${item.ownerRoot} |`)
    .join("\n");
  const extensionRootRows = report.rootRegistry.extensionRoots
    .map((rootToken) => `| ${rootToken} |`)
    .join("\n");
  return [
    "# Anti-Duplication Coverage",
    "",
    `Status: ${report.status}`,
    "",
    `- Component class roots protected: ${report.componentClassRoots.length}`,
    `- Accepted components with owner roots: ${report.rootRegistry.ownerRoots}/${report.rootRegistry.acceptedComponents}`,
    `- Missing owner roots: ${report.rootRegistry.missingOwnerRoots.length}`,
    `- Extension class roots: ${report.rootRegistry.extensionRoots.length}`,
    `- Protected high-risk roots: ${report.protectedComponentRoots.join(", ")}`,
    `- Duplicate concept rules: ${report.duplicateConcepts.length}`,
    `- Docs apps scanned: ${report.docsApps.join(", ") || "none"}`,
    "",
    "## Checks",
    "",
    checks,
    "",
    "## Root Registry Alignment",
    "",
    "| Component | React component | Missing owner root |",
    "| --- | --- | --- |",
    missingOwnerRows || "| None | None | None |",
    "",
    "## Extension Roots",
    "",
    "| Root |",
    "| --- |",
    extensionRootRows || "| None |",
    "",
    "## Duplicate Concepts",
    "",
    "| Concept | Blocked class names |",
    "| --- | --- |",
    concepts,
    "",
  ].join("\n");
}

function main() {
  checkAntiDuplicationGovernance();
  const coverage = antiDuplicationCoverage();
  const report = {
    status: result.errors.length ? "fail" : "pass",
    errors: result.errors,
    ...coverage,
  };

  if (!checkMode) {
    fs.mkdirSync(outputDir, { recursive: true });
    fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
    fs.writeFileSync(markdownOutput, renderMarkdown(report));
  }

  console.log(JSON.stringify({
    status: report.status,
    checks: report.checks.length,
    componentClassRoots: report.componentClassRoots.length,
    acceptedComponents: report.rootRegistry.acceptedComponents,
    ownerRoots: report.rootRegistry.ownerRoots,
    missingOwnerRoots: report.rootRegistry.missingOwnerRoots.length,
    extensionRoots: report.rootRegistry.extensionRoots.length,
    protectedComponentRoots: report.protectedComponentRoots.length,
    duplicateConcepts: report.duplicateConcepts.length,
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));

  if (report.status !== "pass") process.exitCode = 1;
}

main();
