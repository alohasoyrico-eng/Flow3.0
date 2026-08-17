#!/usr/bin/env node

const { spawnSync } = require("node:child_process");
const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "system-audit-contract-governance.json");
const markdownOutput = path.join(outputDir, "system-audit-contract-governance.md");
const governanceFile = path.join(root, "packages/content/content/system-debt-governance.json");

function git(args) {
  const result = spawnSync("git", args, {
    cwd: root,
    encoding: "utf8",
    stdio: "pipe",
  });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function numericDebtEntries(file, report) {
  const entries = [
    ...Object.entries(report),
    ...Object.entries(report.inventory ?? {}),
    ...Object.entries(report.summary ?? {}),
  ].filter(([key, value]) => /(?:debt|debtMetrics)$/i.test(key) && typeof value === "number");
  if (!entries.some(([key]) => key === "gapsDebt") && Array.isArray(report.gaps)) {
    return [...entries, ["gapsDebt", report.gaps.length]];
  }
  return entries;
}

function categoryForReport(file, reportCategories) {
  if (/^foundation-[a-z0-9-]+-cascade-audit\.json$/.test(file)) return "cascade";
  return reportCategories[file] ?? null;
}

function createReport({ enforceClean = false } = {}) {
  const governance = readJson(governanceFile);
  const contractArtifactFiles = new Set(governance.contractArtifactFiles ?? []);
  const reportCategories = governance.reportCategories ?? {};
  const trackedJson = git(["ls-files", "docs/audits/*.json"]).split("\n").filter(Boolean).sort();
  const trackedMarkdown = git(["ls-files", "docs/audits/*.md"]).split("\n").filter(Boolean).sort();
  const docsAuditStatus = enforceClean
    ? git(["status", "--porcelain=v1", "--", "docs/audits"]).split("\n").filter(Boolean)
    : [];
  const jsonRows = trackedJson.map((file) => {
    const basename = path.basename(file);
    const report = readJson(path.join(root, file));
    const isContractArtifact = contractArtifactFiles.has(basename);
    const category = categoryForReport(basename, reportCategories);
    const debtEntries = numericDebtEntries(file, report);
    const issues = [
      ...(!isContractArtifact && typeof report.status !== "string" ? ["missing status"] : []),
      ...(!isContractArtifact && !category ? ["missing report category"] : []),
      ...(!isContractArtifact && !debtEntries.length ? ["missing numeric debt metric"] : []),
      ...(!isContractArtifact && report.status && !["pass", "fail", "warning"].includes(String(report.status).toLowerCase()) ? [`unsupported status ${report.status}`] : []),
    ];
    return {
      file,
      kind: isContractArtifact ? "contract-artifact" : "gate-report",
      category,
      status: report.status ?? null,
      debtMetrics: debtEntries.map(([key, value]) => ({ key, value })),
      issues,
    };
  });
  const markdownRows = trackedMarkdown.map((file) => {
    const jsonPair = file.replace(/\.md$/, ".json");
    const hasJsonPair = trackedJson.includes(jsonPair);
    return {
      file,
      jsonPair,
      status: hasJsonPair ? "pass" : "fail",
      issues: hasJsonPair ? [] : ["markdown audit output without JSON source"],
    };
  });
  const issues = [
    ...jsonRows.flatMap((row) => row.issues.map((issue) => `${row.file}: ${issue}.`)),
    ...markdownRows.flatMap((row) => row.issues.map((issue) => `${row.file}: ${issue}.`)),
    ...docsAuditStatus.map((line) => `docs/audits dirty state after gates: ${line}.`),
  ];
  return {
    schemaVersion: "system-audit-contract-governance@1",
    status: issues.length ? "fail" : "pass",
    audit: "system audit contract governance",
    principle: "Audit outputs are evidence, not narrative ledgers: every gate report must have status, category, numeric debt, and stable check mode; Markdown is allowed only as a JSON-backed human rendering.",
    inventory: {
      trackedJsonReports: trackedJson.length,
      gateReports: jsonRows.filter((row) => row.kind === "gate-report").length,
      contractArtifacts: jsonRows.filter((row) => row.kind === "contract-artifact").length,
      markdownReports: trackedMarkdown.length,
      orphanMarkdownReports: markdownRows.filter((row) => row.status !== "pass").length,
      dirtyDocsAuditEntries: docsAuditStatus.length,
      reportsMissingCategory: jsonRows.filter((row) => row.issues.includes("missing report category")).length,
      reportsMissingStatus: jsonRows.filter((row) => row.issues.includes("missing status")).length,
      reportsMissingDebtMetric: jsonRows.filter((row) => row.issues.includes("missing numeric debt metric")).length,
      auditContractGovernanceDebt: issues.length,
    },
    jsonReports: jsonRows,
    markdownReports: markdownRows,
    dirtyDocsAuditEntries: docsAuditStatus,
    issues,
  };
}

function renderMarkdown(report) {
  return [
    "# System Audit Contract Governance",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ].join("\n");
}

function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const report = createReport({ enforceClean: false });
  const nextJson = `${JSON.stringify(report, null, 2)}\n`;
  const nextMarkdown = `${renderMarkdown(report)}\n`;
  if (checkMode) {
    const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
    const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
    if (currentJson !== nextJson || currentMarkdown !== nextMarkdown) {
      throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-system-audit-contract-governance.js.`);
    }
    const dirtyDocsAuditEntries = git(["status", "--porcelain=v1", "--", "docs/audits"]).split("\n").filter(Boolean);
    if (dirtyDocsAuditEntries.length) {
      throw new Error(`docs/audits dirty state after gates: ${dirtyDocsAuditEntries.join("; ")}.`);
    }
  } else {
    fs.writeFileSync(jsonOutput, nextJson);
    fs.writeFileSync(markdownOutput, nextMarkdown);
  }
  console.log(JSON.stringify({
    status: report.status,
    debt: report.inventory.auditContractGovernanceDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") {
    throw new Error(`System audit contract governance failed with ${report.issues.length} issue(s).`);
  }
}

main();
