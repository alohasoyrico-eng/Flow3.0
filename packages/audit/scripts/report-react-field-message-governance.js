#!/usr/bin/env node

const {
  fs,
  path,
  read,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const reactSrcDir = path.join(root, "packages/react/src");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-field-message-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-field-message-governance-audit.md");

const expectedLegacyLocalFieldHelperSources = new Set([
  "packages/react/src/CardExpiryInput.tsx",
  "packages/react/src/CardNumberInput.tsx",
  "packages/react/src/CardSecurityCodeInput.tsx",
  "packages/react/src/CodeInput.tsx",
  "packages/react/src/Combobox.tsx",
  "packages/react/src/DatePicker.tsx",
  "packages/react/src/DateRangePicker.tsx",
  "packages/react/src/InputAmount.tsx",
  "packages/react/src/PhoneInput.tsx",
  "packages/react/src/Select.tsx",
  "packages/react/src/TextArea.tsx",
]);

function sourceForComponent(name) {
  const tsx = path.join(reactSrcDir, `${name}.tsx`);
  if (fs.existsSync(tsx)) return tsx;
  return path.join(reactSrcDir, `${name}.js`);
}

function componentNames() {
  if (!fs.existsSync(reactSrcDir)) return [];
  const names = fs.readdirSync(reactSrcDir)
    .filter((file) => /^[A-Z].*\.(?:tsx|js)$/.test(file))
    .map((file) => file.replace(/\.(?:tsx|js)$/, ""));
  return [...new Set(names)].sort();
}

function includesAll(source, snippets) {
  return snippets.every((snippet) => source.includes(snippet));
}

function inputContractIssues() {
  const inputFile = sourceForComponent("Input");
  const inputSource = read(inputFile);
  const fieldMessageFile = path.join(reactSrcDir, "internal/field-message.ts");
  const fieldMessageSource = read(fieldMessageFile);
  const inlineValidationFile = sourceForComponent("InlineValidation");
  const inlineValidationSource = read(inlineValidationFile);
  const issues = [];

  if (!inputSource.includes('import { resolveFieldMessage } from "./internal/field-message.js";')) {
    issues.push({
      file: rel(inputFile),
      rule: "input-missing-shared-field-message-import",
      message: "Input must import the shared field-message resolver instead of owning local helper semantics.",
    });
  }
  if (!inputSource.includes("resolveFieldMessage({") || !inputSource.includes('"aria-describedby": fieldMessage.describedBy') || !inputSource.includes('"aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"]')) {
    issues.push({
      file: rel(inputFile),
      rule: "input-missing-shared-field-message-runtime",
      message: "Input must derive describedby, invalid, live-region role, and helper state from resolveFieldMessage.",
    });
  }
  if (!includesAll(inputSource, ['"info"', '"success"', '"warning"', '"error"', '"disabled"'])) {
    issues.push({
      file: rel(inputFile),
      rule: "input-missing-feedback-state-union",
      message: "Input must expose info, success, warning, error, and disabled states so field feedback matches InlineValidation semantics.",
    });
  }
  if (!includesAll(fieldMessageSource, ["FieldMessageState", '"info"', '"success"', '"warning"', '"error"', '"disabled"', 'role?: "alert" | "status"', 'invalid: resolvedState === "error" ? "true" : undefined'])) {
    issues.push({
      file: rel(fieldMessageFile),
      rule: "field-message-missing-semantic-contract",
      message: "The shared field-message helper must preserve state normalization, non-error feedback, alert/status roles, and error-only invalid semantics.",
    });
  }
  if (inlineValidationSource.includes("resolveFieldMessage(")) {
    issues.push({
      file: rel(inlineValidationFile),
      rule: "inline-validation-should-compose-not-own-field-message",
      message: "InlineValidation composes Input for fields; it must not become a second field-message resolver.",
    });
  }
  if (inputSource.includes("InlineValidation")) {
    issues.push({
      file: rel(inputFile),
      rule: "input-must-not-import-inline-validation",
      message: "Input must stay below InlineValidation in the dependency direction; importing InlineValidation would create a circular feedback stack.",
    });
  }

  return issues;
}

function createReport() {
  const fieldHelperSources = componentNames()
    .map((name) => sourceForComponent(name))
    .filter((file) => fs.existsSync(file))
    .map((file) => ({ file, source: read(file) }))
    .filter((item) => item.source.includes("field__helper"))
    .map((item) => ({
      file: rel(item.file),
      component: path.basename(item.file).replace(/\.(?:tsx|js)$/, ""),
      contract: item.source.includes("resolveFieldMessage") ? "shared-field-message" : "local-field-helper",
      hasErrorOnlyInvalid: /aria-invalid["']?\s*:\s*(?:error|resolvedError|state === "error"|resolvedState === "error")/.test(item.source),
      hasLiveRole: /role:\s*(?:fieldMessage\.role|error\s*\?\s*"alert"|messageRole)/.test(item.source),
    }));
  const localFieldHelpers = fieldHelperSources.filter((item) => item.contract === "local-field-helper");
  const unexpectedLocalFieldHelpers = localFieldHelpers
    .filter((item) => !expectedLegacyLocalFieldHelperSources.has(item.file));
  const resolvedLegacySources = [...expectedLegacyLocalFieldHelperSources]
    .filter((file) => !localFieldHelpers.some((item) => item.file === file));
  const contractIssues = inputContractIssues();
  const governanceIssues = [
    ...contractIssues,
    ...unexpectedLocalFieldHelpers.map((item) => ({
      file: item.file,
      rule: "new-local-field-helper",
      message: `${item.component} introduced a local field helper. New field feedback must use the shared field-message contract or InlineValidation composition.`,
    })),
  ];
  const inventory = {
    fieldMessageSources: fieldHelperSources.length,
    sharedFieldMessageSources: fieldHelperSources.filter((item) => item.contract === "shared-field-message").length,
    legacyLocalFieldMessageBacklog: localFieldHelpers.length,
    expectedLegacyLocalFieldMessageBacklog: expectedLegacyLocalFieldHelperSources.size,
    resolvedLegacyLocalFieldMessageSources: resolvedLegacySources.length,
    unexpectedLocalFieldMessageSources: unexpectedLocalFieldHelpers.length,
    contractIssues: contractIssues.length,
    fieldMessageGovernanceDebt: governanceIssues.length,
  };

  return {
    schemaVersion: "react-field-message-governance@1",
    status: inventory.fieldMessageGovernanceDebt ? "fail" : "pass",
    audit: "react field message governance",
    principle: "Field feedback must have one semantic contract for message id, aria-describedby, aria-invalid, live-region role, and feedback state. Existing local helpers are migration backlog; new local helpers are blocked.",
    inventory,
    fieldMessageGovernanceDebt: inventory.fieldMessageGovernanceDebt,
    fieldHelperSources,
    expectedLegacyLocalFieldHelperSources: [...expectedLegacyLocalFieldHelperSources].sort(),
    resolvedLegacySources,
    unexpectedLocalFieldHelpers,
    issues: governanceIssues,
  };
}

function toMarkdown(report) {
  const helperRows = report.fieldHelperSources
    .map((item) => `| ${item.component} | ${item.contract} | ${item.hasErrorOnlyInvalid ? "yes" : "no"} | ${item.hasLiveRole ? "yes" : "no"} | ${item.file} |`);
  const issueRows = report.issues
    .map((issue) => `| ${issue.rule} | ${issue.file} | ${issue.message} |`);
  return [
    "# React Field Message Governance Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Field message sources: ${report.inventory.fieldMessageSources}`,
    `- Shared field-message sources: ${report.inventory.sharedFieldMessageSources}`,
    `- Legacy local field-message backlog: ${report.inventory.legacyLocalFieldMessageBacklog}`,
    `- Expected legacy local backlog: ${report.inventory.expectedLegacyLocalFieldMessageBacklog}`,
    `- Resolved legacy local sources: ${report.inventory.resolvedLegacyLocalFieldMessageSources}`,
    `- Unexpected local field-message sources: ${report.inventory.unexpectedLocalFieldMessageSources}`,
    `- Contract issues: ${report.inventory.contractIssues}`,
    `- Field message governance debt: ${report.inventory.fieldMessageGovernanceDebt}`,
    "",
    "## Field Helper Sources",
    "",
    "| Component | Contract | Error-only invalid | Live role | File |",
    "| --- | --- | --- | --- | --- |",
    ...helperRows,
    "",
    "## Issues",
    "",
    "| Rule | File | Message |",
    "| --- | --- | --- |",
    ...(issueRows.length ? issueRows : ["| None | None | None |"]),
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
      console.error("React field message governance report is stale. Run: node packages/audit/scripts/report-react-field-message-governance.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    debt: report.inventory.fieldMessageGovernanceDebt,
    backlog: report.inventory.legacyLocalFieldMessageBacklog,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") {
    process.exit(1);
  }
}

main();
