const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const OUT_JSON = path.join(ROOT, "docs/audits/system-raw-token-value-governance.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-raw-token-value-governance.md");

const SCOPES = [
  "packages/components/src",
  "packages/components/styles",
  "packages/react/src",
];

const EXCLUDED_PATH_PARTS = [
  "node_modules",
  "packages/tokens/.build",
  "packages/tokens/dist",
  "packages/tokens/source",
  "packages/tokens/src/generated",
  "packages/react/src/internal/email-token-values.js",
  "packages/tokens/styles/tokens.css",
  "packages/tokens/tokens.json",
];

const EXTENSIONS = new Set([".css", ".js", ".jsx", ".ts", ".tsx", ".json"]);

const RULES = [
  {
    id: "raw-hex-color",
    severity: "critical",
    pattern: /#[0-9a-fA-F]{3,8}\b/g,
    reason: "Hex color must come from Style Dictionary source tokens.",
  },
  {
    id: "raw-rgb-hsl-color",
    severity: "critical",
    pattern: /\b(?:rgba?|hsla?)\([^)]+\)/g,
    reason: "RGB/HSL color must come from Style Dictionary source tokens.",
  },
  {
    id: "raw-px-unit",
    severity: "high",
    pattern: /(?<![\w-])-?\d*\.?\d+px\b/g,
    reason: "Pixel values must be represented by spacing, sizing, border, focus, or motion tokens.",
  },
  {
    id: "raw-radius-property",
    severity: "high",
    pattern: /\bborder-radius\s*:\s*(?!var\()[^;}\n]+/g,
    reason: "Radius decisions must be tokenized.",
  },
  {
    id: "raw-shadow-property",
    severity: "high",
    pattern: /\b(?:box-shadow|text-shadow)\s*:\s*(?!var\()[^;}\n]+/g,
    reason: "Shadow decisions must be tokenized.",
  },
  {
    id: "raw-motion-curve",
    severity: "high",
    pattern: /\bcubic-bezier\([^)]+\)/g,
    reason: "Motion curves must be tokenized.",
  },
  {
    id: "raw-motion-duration",
    severity: "high",
    pattern: /(?<![\w-])(?:\d*\.?\d+ms|\d*\.?\d+s)\b/g,
    reason: "Motion durations must be tokenized.",
  },
  {
    id: "raw-typography-property",
    severity: "high",
    pattern: /\b(?:font-size|font-weight|font-family|line-height|letter-spacing)\s*:\s*(?!var\()[^;}\n]+/g,
    reason: "Typography decisions must be tokenized.",
  },
];

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const rel = path.relative(ROOT, fullPath);
    if (EXCLUDED_PATH_PARTS.some((part) => rel === part || rel.startsWith(`${part}/`))) continue;
    if (entry.isDirectory()) walk(fullPath, files);
    if (entry.isFile() && EXTENSIONS.has(path.extname(entry.name))) files.push(fullPath);
  }
  return files;
}

function lineNumberFor(content, index) {
  return content.slice(0, index).split("\n").length;
}

function isIgnoredMatch(file, content, match, ruleId) {
  const lineStart = content.lastIndexOf("\n", match.index) + 1;
  const lineEnd = content.indexOf("\n", match.index);
  const line = content.slice(lineStart, lineEnd === -1 ? content.length : lineEnd);
  if (line.includes("flow-raw-token-ignore")) return true;
  if (ruleId === "raw-hex-color" && /#[0-9a-fA-F]{3,8}\b/.test(path.basename(file))) return true;
  if (ruleId === "raw-px-unit" && /^\s*@media\b/.test(line)) return true;
  if (ruleId === "raw-motion-duration" && /\b(?:setTimeout|setInterval)\b/.test(line)) return true;
  if (["raw-radius-property", "raw-shadow-property", "raw-typography-property"].includes(ruleId)) {
    const value = match[0].slice(match[0].indexOf(":") + 1).trim();
    if (value.includes("var(")) return true;
    if (/^(?:inherit|initial|unset|revert|none|normal|currentColor|0)(?:\s*!important)?$/i.test(value)) return true;
  }
  return false;
}

function collectViolations() {
  const files = SCOPES.flatMap((scope) => walk(path.join(ROOT, scope))).sort();
  const violations = [];

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const content = fs.readFileSync(file, "utf8");
    for (const rule of RULES) {
      rule.pattern.lastIndex = 0;
      for (const match of content.matchAll(rule.pattern)) {
        if (isIgnoredMatch(rel, content, match, rule.id)) continue;
        violations.push({
          rule: rule.id,
          severity: rule.severity,
          file: rel,
          line: lineNumberFor(content, match.index),
          value: match[0].trim(),
          reason: rule.reason,
        });
      }
    }
  }

  return { files, violations };
}

function summarize(violations) {
  const byRule = {};
  const byFile = {};
  for (const violation of violations) {
    byRule[violation.rule] = (byRule[violation.rule] ?? 0) + 1;
    byFile[violation.file] = (byFile[violation.file] ?? 0) + 1;
  }
  return {
    byRule,
    byFile: Object.fromEntries(Object.entries(byFile).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
  };
}

function main() {
  const { files, violations } = collectViolations();
  const summary = summarize(violations);
  const status = violations.length === 0 ? "PASS" : "FAIL";
  const report = {
    generatedAt: new Date().toISOString(),
    scope: "Raw token value governance for public Flow source",
    status,
    scannedScopes: SCOPES,
    scannedFiles: files.map((file) => path.relative(ROOT, file)),
    totals: {
      files: files.length,
      violations: violations.length,
      rules: RULES.length,
    },
    rules: RULES.map(({ id, severity, reason }) => ({ id, severity, reason })),
    summary,
    violations,
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(report, null, 2)}\n`);

  const topFiles = Object.entries(summary.byFile).slice(0, 20);
  const lines = [
    "# Raw Token Value Governance",
    "",
    `Status: **${status}**`,
    "",
    "This report detects raw visual values in public Flow source. Token source files and generated token outputs are intentionally excluded.",
    "",
    "## Totals",
    "",
    `- Scanned files: ${report.totals.files}`,
    `- Violations: ${report.totals.violations}`,
    `- Rules: ${report.totals.rules}`,
    "",
    "## Violations By Rule",
    "",
    "| Rule | Count |",
    "| --- | ---: |",
    ...Object.entries(summary.byRule).map(([rule, count]) => `| \`${rule}\` | ${count} |`),
    "",
    "## Top Files",
    "",
    "| File | Count |",
    "| --- | ---: |",
    ...topFiles.map(([file, count]) => `| \`${file}\` | ${count} |`),
    "",
    "## First 100 Violations",
    "",
    "| Rule | File | Line | Value |",
    "| --- | --- | ---: | --- |",
    ...violations.slice(0, 100).map((violation) => (
      `| \`${violation.rule}\` | \`${violation.file}\` | ${violation.line} | \`${violation.value.replaceAll("|", "\\|")}\` |`
    )),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);

  console.log(JSON.stringify({
    status,
    totals: report.totals,
    byRule: summary.byRule,
    topFiles,
  }, null, 2));
  if (status !== "PASS") process.exitCode = 1;
}

main();
