const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const OUT_JSON = path.join(ROOT, "docs/audits/system-phase1-style-dictionary-checkpoint.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-phase1-style-dictionary-checkpoint.md");
const CHECK = process.argv.includes("--check");

const REQUIRED_REPORTS = [
  {
    id: "token-source-gates",
    file: "docs/audits/system-p0-token-source-gates.json",
    debtMetric: null,
    requiredStatus: "pass",
  },
  {
    id: "token-ownership-matrix",
    file: "docs/audits/system-token-ownership-matrix.json",
    debtMetric: "ownershipDebt",
    requiredStatus: "pass",
  },
  {
    id: "token-output-gates",
    file: "docs/audits/system-token-output-gates.json",
    debtMetric: null,
    requiredStatus: "pass",
  },
  {
    id: "generated-token-output-governance",
    file: "docs/audits/system-generated-token-output-governance.json",
    debtMetric: null,
    requiredStatus: "pass",
  },
  {
    id: "raw-token-value-governance",
    file: "docs/audits/system-raw-token-value-governance.json",
    debtMetric: ["totals", "violations"],
    requiredStatus: "pass",
  },
];

function readJson(file) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, file), "utf8"));
}

function normalizedStatus(report) {
  return String(report.status ?? "").toLowerCase();
}

function metric(report, pathOrKey) {
  if (!pathOrKey) return 0;
  if (Array.isArray(pathOrKey)) {
    return pathOrKey.reduce((value, key) => value?.[key], report);
  }
  return report[pathOrKey];
}

function gate(id, passed, evidence, failMessage) {
  return {
    id,
    status: passed ? "PASS" : "FAIL",
    evidence,
    failMessage: passed ? null : failMessage,
  };
}

function main() {
  const reportRows = REQUIRED_REPORTS.map((required) => {
    const exists = fs.existsSync(path.join(ROOT, required.file));
    const report = exists ? readJson(required.file) : null;
    const status = report ? normalizedStatus(report) : "missing";
    const debt = report ? metric(report, required.debtMetric) : null;
    return {
      id: required.id,
      file: required.file,
      exists,
      status,
      requiredStatus: required.requiredStatus,
      debtMetric: required.debtMetric,
      debt: debt ?? 0,
      pass: exists && status === required.requiredStatus && (debt == null || debt === 0),
    };
  });
  const gates = [
    gate(
      "style-dictionary-source-owned",
      reportRows.find((row) => row.id === "token-source-gates")?.pass === true
        && reportRows.find((row) => row.id === "token-ownership-matrix")?.pass === true,
      {
        reports: reportRows.filter((row) => ["token-source-gates", "token-ownership-matrix"].includes(row.id)),
      },
      "Token source or ownership gates are not clean.",
    ),
    gate(
      "style-dictionary-outputs-reproducible",
      reportRows.find((row) => row.id === "token-output-gates")?.pass === true
        && reportRows.find((row) => row.id === "generated-token-output-governance")?.pass === true,
      {
        reports: reportRows.filter((row) => ["token-output-gates", "generated-token-output-governance"].includes(row.id)),
      },
      "Token outputs are not reproducible from the Style Dictionary manifest.",
    ),
    gate(
      "raw-token-values-blocked",
      reportRows.find((row) => row.id === "raw-token-value-governance")?.pass === true,
      {
        report: reportRows.find((row) => row.id === "raw-token-value-governance"),
      },
      "Raw visual values exist outside token source or generated output policy.",
    ),
  ];
  const status = gates.every((item) => item.status === "PASS") ? "pass" : "fail";
  const phase1Debt = gates.filter((item) => item.status !== "PASS").length
    + reportRows.filter((row) => !row.pass).length
    + reportRows.reduce((total, row) => total + (typeof row.debt === "number" ? row.debt : 0), 0);
  const report = {
    generatedAt: new Date().toISOString(),
    scope: "Phase 1 Style Dictionary checkpoint",
    status,
    phase1Debt,
    definitionOfDone: [
      "Token source lives in governed family files under packages/tokens/source.",
      "No legacy flat source can bypass family ownership.",
      "Style Dictionary produces every required token output.",
      "Generated outputs match the current build manifest.",
      "Raw visual values are blocked in public Flow source outside token source/generated outputs.",
    ],
    gates,
    reports: reportRows,
  };
  const summary = {
    status,
    phase1Debt,
    gates: gates.map((item) => [item.id, item.status]),
    reports: reportRows.map((row) => [row.id, row.status, row.debt]),
  };

  if (CHECK) {
    console.log(JSON.stringify(summary, null, 2));
    if (status !== "pass") process.exitCode = 1;
    return;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);

  const lines = [
    "# Phase 1 Style Dictionary Checkpoint",
    "",
    `Status: **${status}**`,
    "",
    `Phase 1 debt: ${phase1Debt}`,
    "",
    "## Definition Of Done",
    "",
    ...report.definitionOfDone.map((item) => `- ${item}`),
    "",
    "## Gates",
    "",
    "| Gate | Status | Evidence |",
    "| --- | --- | --- |",
    ...gates.map((item) => `| \`${item.id}\` | ${item.status} | \`${JSON.stringify(item.evidence)}\` |`),
    "",
    "## Required Reports",
    "",
    "| Report | Status | Debt | File |",
    "| --- | --- | ---: | --- |",
    ...reportRows.map((row) => `| ${row.id} | ${row.status} | ${row.debt ?? 0} | \`${row.file}\` |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);
  console.log(JSON.stringify(summary, null, 2));
  if (status !== "pass") process.exitCode = 1;
}

main();
