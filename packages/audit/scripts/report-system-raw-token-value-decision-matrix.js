const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const IN_JSON = path.join(ROOT, "docs/audits/system-raw-token-value-governance.json");
const OUT_JSON = path.join(ROOT, "docs/audits/system-raw-token-value-decision-matrix.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-raw-token-value-decision-matrix.md");

function ownerForViolation(violation) {
  if (violation.file === "packages/react/src/patterns/EmailTemplateLayout.js") {
    return {
      owner: "email-channel",
      decision: "BLOCKED_FROM_PASS",
      requiredAction: "Create governed email-channel token source or move these values behind existing Style Dictionary tokens before treating email as a consumable Flow pattern.",
      phaseImpact: "Blocks Style Dictionary raw-value gate and later Pattern readiness for email.",
    };
  }
  if (violation.file === "packages/components/styles/components.css") {
    return {
      owner: "component-css-cascade",
      decision: "MUST_TOKENIZE",
      requiredAction: "Replace remaining CSS raw literals with existing sys/component vars or add missing source tokens with explicit foundation/primitive ownership.",
      phaseImpact: "Blocks Style Dictionary raw-value gate; also signals component cascade debt.",
    };
  }
  if (violation.file.startsWith("packages/specs/specs/")) {
    return {
      owner: "spec-contract",
      decision: "MUST_REFERENCE_TOKEN",
      requiredAction: "Replace raw spec examples/contracts with token references or explicit non-visual metadata.",
      phaseImpact: "Blocks source-of-truth integrity because specs can reintroduce raw visual decisions.",
    };
  }
  if (violation.file === "packages/react/src/ChartPanel.js") {
    return {
      owner: "react-runtime",
      decision: "MUST_TOKENIZE_OR_EXEMPT",
      requiredAction: "Replace raw duration with motion token or document a zero-duration semantic token.",
      phaseImpact: "Blocks raw-value gate for React runtime source.",
    };
  }
  return {
    owner: "unknown",
    decision: "NEEDS_OWNER",
    requiredAction: "Assign an owner before remediation.",
    phaseImpact: "Cannot close Phase 1 while owner is unknown.",
  };
}

function keyFor(row) {
  return `${row.owner}|${row.decision}|${row.file}`;
}

function main() {
  const report = JSON.parse(fs.readFileSync(IN_JSON, "utf8"));
  const rowsByKey = new Map();
  for (const violation of report.violations) {
    const owner = ownerForViolation(violation);
    const row = {
      ...owner,
      file: violation.file,
      rules: {},
      count: 0,
      examples: [],
    };
    const key = keyFor(row);
    const existing = rowsByKey.get(key) ?? row;
    existing.count += 1;
    existing.rules[violation.rule] = (existing.rules[violation.rule] ?? 0) + 1;
    if (existing.examples.length < 8) {
      existing.examples.push({
        line: violation.line,
        rule: violation.rule,
        value: violation.value,
      });
    }
    rowsByKey.set(key, existing);
  }

  const rows = [...rowsByKey.values()].sort((a, b) => b.count - a.count || a.file.localeCompare(b.file));
  const totalsByDecision = rows.reduce((acc, row) => {
    acc[row.decision] = (acc[row.decision] ?? 0) + row.count;
    return acc;
  }, {});
  const totalsByOwner = rows.reduce((acc, row) => {
    acc[row.owner] = (acc[row.owner] ?? 0) + row.count;
    return acc;
  }, {});
  const status = report.totals.violations === 0
    ? "PASS"
    : rows.every((row) => row.owner !== "unknown") ? "CLASSIFIED_BLOCKED" : "FAIL";
  const data = {
    generatedAt: new Date().toISOString(),
    scope: "Raw token value decision matrix",
    status,
    sourceReport: path.relative(ROOT, IN_JSON),
    totals: {
      violations: report.totals.violations,
      rows: rows.length,
      owners: Object.keys(totalsByOwner).length,
    },
    totalsByDecision,
    totalsByOwner,
    rows,
  };

  fs.writeFileSync(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);

  const lines = [
    "# Raw Token Value Decision Matrix",
    "",
    `Status: **${status}**`,
    "",
    "This matrix classifies every raw token value violation by owner and required action. Classification is not remediation; Phase 1 remains blocked until violations are removed or converted into governed token source.",
    "",
    "## Totals",
    "",
    `- Violations: ${data.totals.violations}`,
    `- Decision rows: ${data.totals.rows}`,
    `- Owners: ${data.totals.owners}`,
    "",
    "## By Decision",
    "",
    "| Decision | Count |",
    "| --- | ---: |",
    ...Object.entries(totalsByDecision).map(([decision, count]) => `| \`${decision}\` | ${count} |`),
    "",
    "## Matrix",
    "",
    "| Owner | Decision | File | Count | Rules | Required action |",
    "| --- | --- | --- | ---: | --- | --- |",
    ...rows.map((row) => `| ${row.owner} | \`${row.decision}\` | \`${row.file}\` | ${row.count} | \`${JSON.stringify(row.rules)}\` | ${row.requiredAction} |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);

  console.log(JSON.stringify({
    status,
    totals: data.totals,
    totalsByDecision,
    totalsByOwner,
  }, null, 2));
}

main();
