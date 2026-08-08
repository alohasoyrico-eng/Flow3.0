#!/usr/bin/env node

const { fs, path, root } = require("./audit-context.js");
const { componentCssContractCoverage } = require("./audit-component-css-contracts.js");

const checkMode = process.argv.includes("--check");
const cssFile = path.join(root, "packages/components/styles/components.css");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "family-css-contract-maturity.json");
const markdownOutput = path.join(outputDir, "family-css-contract-maturity.md");

const thresholds = {
  selectorCount: 20,
  aliasCount: 40,
};

const sharedExtensionRoots = new Set([
  "country-flag",
  "field",
]);

function countMatches(text, pattern) {
  return [...text.matchAll(pattern)].length;
}

function selectorPatternFor(rootName) {
  return new RegExp(`\\.${rootName}(?:\\b|__|\\[|[\\s:{.#>+~])`, "g");
}

function aliasPatternFor(rootName) {
  return new RegExp(`--comp-${rootName}-`, "g");
}

function maturityReason(item) {
  const reasons = [];
  if (item.selectorCount >= thresholds.selectorCount) {
    reasons.push(`selector surface ${item.selectorCount} >= ${thresholds.selectorCount}`);
  }
  if (item.aliasCount >= thresholds.aliasCount) {
    reasons.push(`component aliases ${item.aliasCount} >= ${thresholds.aliasCount}`);
  }
  return reasons;
}

function createReport() {
  const css = fs.existsSync(cssFile) ? fs.readFileSync(cssFile, "utf8") : "";
  const coverage = componentCssContractCoverage();
  const familyComponents = coverage.components
    .filter((item) => item.coverage === "family")
    .map((item) => {
      const extensionRoots = item.allowedExtensionRoots ?? [];
      const ownRoots = extensionRoots.filter((rootName) => rootName !== item.requiredRoot && !sharedExtensionRoots.has(rootName));
      const sharedRoots = extensionRoots.filter((rootName) => sharedExtensionRoots.has(rootName));
      const selectorCount = ownRoots.reduce((sum, rootName) => sum + countMatches(css, selectorPatternFor(rootName)), 0);
      const aliasCount = ownRoots.reduce((sum, rootName) => sum + countMatches(css, aliasPatternFor(rootName)), 0);
      const maturity = {
        component: item.component,
        familyContract: item.contract,
        requiredRoot: item.requiredRoot,
        extensionRoots,
        ownExtensionRoots: ownRoots,
        sharedExtensionRoots: sharedRoots,
        selectorCount,
        aliasCount,
        recommendation: "keep-family",
        reasons: [],
      };
      maturity.reasons = maturityReason(maturity);
      if (maturity.reasons.length) maturity.recommendation = "review-for-direct-contract";
      return maturity;
    });
  const reviewCandidates = familyComponents.filter((item) => item.recommendation === "review-for-direct-contract");
  return {
    status: "pass",
    audit: "family CSS contract maturity",
    principle: "Family CSS contracts are allowed when a component shares a visual cascade; large component-specific selector or alias surface should be visible as a graduation candidate before it becomes accidental duplication.",
    thresholds,
    inventory: {
      familyComponents: familyComponents.length,
      reviewCandidates: reviewCandidates.length,
    },
    reviewCandidates,
    familyComponents,
  };
}

function toMarkdown(report) {
  const candidateRows = report.reviewCandidates.map((item) => `| ${item.component} | ${item.familyContract} | ${item.ownExtensionRoots.join(", ") || "None"} | ${item.selectorCount} | ${item.aliasCount} | ${item.reasons.join("; ")} |`);
  const rows = report.familyComponents.map((item) => `| ${item.component} | ${item.familyContract} | ${item.requiredRoot} | ${item.ownExtensionRoots.join(", ") || "None"} | ${item.sharedExtensionRoots.join(", ") || "None"} | ${item.selectorCount} | ${item.aliasCount} | ${item.recommendation} |`);
  return [
    "# Family CSS Contract Maturity",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Family components: ${report.inventory.familyComponents}`,
    `- Review candidates: ${report.inventory.reviewCandidates}`,
    `- Shared extension roots excluded from maturity counts: ${[...sharedExtensionRoots].join(", ")}`,
    `- Selector threshold: ${report.thresholds.selectorCount}`,
    `- Alias threshold: ${report.thresholds.aliasCount}`,
    "",
    "## Review Candidates",
    "",
    "| Component | Family contract | Own extension roots | Selectors | Aliases | Reason |",
    "| --- | --- | --- | ---: | ---: | --- |",
    ...(candidateRows.length ? candidateRows : ["| None | None | None | 0 | 0 | None |"]),
    "",
    "## Family Components",
    "",
    "| Component | Family contract | Required root | Own extension roots | Shared extension roots | Selectors | Aliases | Recommendation |",
    "| --- | --- | --- | --- | --- | ---: | ---: | --- |",
    ...rows,
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
      console.error("Family CSS contract maturity report is stale. Run: node packages/audit/scripts/report-family-css-contract-maturity.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }

  console.log(JSON.stringify({
    status: report.status,
    familyComponents: report.inventory.familyComponents,
    reviewCandidates: report.inventory.reviewCandidates,
    candidates: report.reviewCandidates.map((item) => item.component),
    json: path.relative(root, jsonOutput),
    markdown: path.relative(root, markdownOutput),
  }, null, 2));
}

main();
