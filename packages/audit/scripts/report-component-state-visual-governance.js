#!/usr/bin/env node

const { fs, path, read, rel, root } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "component-state-visual-governance.json");
const markdownOutput = path.join(outputDir, "component-state-visual-governance.md");
const componentCssFile = path.join(root, "packages/components/styles/components.css");

const toneNames = ["danger", "warning", "error", "success", "info"];
const actionLeakPatterns = [
  /--component-color-action\b/,
  /--component-tone-action\b/,
  /--sys-color-action\b/,
  /--sys-energy-action\b/,
  /--comp-[a-z0-9-]+-(?:bg|border|fg)-primary(?:-|\\b)/,
  /--comp-[a-z0-9-]+-(?:bg|border|fg)-accent(?:-|\\b)/,
];

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function collectCssRules(css) {
  const rules = [];
  const pattern = /(?<selector>[^{}]+)\{(?<body>[^{}]*)\}/g;
  let match;
  while ((match = pattern.exec(css))) {
    rules.push({
      selector: match.groups.selector.trim(),
      body: match.groups.body.trim(),
      line: lineNumber(css, match.index),
    });
  }
  return rules;
}

function parseDeclarations(body) {
  const declarations = {};
  for (const part of body.split(";")) {
    const index = part.indexOf(":");
    if (index === -1) continue;
    const property = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (property && value) declarations[property] = value;
  }
  return declarations;
}

function normalizeSelectorForInteraction(selector) {
  return selector
    .replace(/:hover(?:\([^)]*\))?/g, "")
    .replace(/:active(?:\([^)]*\))?/g, "")
    .replace(/\[data-state=["'](?:hover|pressed)["']\]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function interactionKind(selector) {
  if (/:hover|\[data-state=["']hover["']\]/.test(selector)) return "hover";
  if (/:active|\[data-state=["']pressed["']\]/.test(selector)) return "pressed";
  return null;
}

function containsTone(selector) {
  return toneNames.some((tone) => new RegExp(`(?:--|data-(?:tone|intent|variant|state)=["'])${tone}\\b`).test(selector));
}

function hasActionLeak(body) {
  return actionLeakPatterns.some((pattern) => pattern.test(body));
}

function addFinding(findings, rule) {
  findings.push({
    file: rel(componentCssFile),
    ...rule,
  });
}

function createReport() {
  const css = read(componentCssFile);
  const rules = collectCssRules(css);
  const blockers = [];
  const reviews = [];

  for (const rule of rules) {
    const selector = rule.selector;
    const stateSelector = selector.replace(/:not\(\[data-state=["']loading["']\]\)/g, "");
    const body = rule.body;
    const hasDisabledSelector = /(?:\[data-state=["']disabled["']\]|:disabled|\[aria-disabled=["']true["']\])/.test(stateSelector);
    const hasLoadingSelector = /(?:\[data-state=["']loading["']\]|\[aria-busy=["']true["']\]|\.is-loading|\bloading\b)/.test(stateSelector);

    if (hasDisabledSelector && hasLoadingSelector) {
      addFinding(blockers, {
        rule: "loading-disabled-shared-selector",
        severity: "blocker",
        line: rule.line,
        selector,
        message: "Loading and disabled are styled by the same selector group; this is the same class of bug that made a busy Button look disabled.",
      });
    }

    if (hasLoadingSelector && /(?:disabled|--component-disabled|--sys-disabled|--comp-[a-z0-9-]+-disabled)/.test(body)) {
      addFinding(blockers, {
        rule: "loading-uses-disabled-alias",
        severity: "blocker",
        line: rule.line,
        selector,
        message: "Loading state consumes disabled aliases. Busy/pending and disabled must remain visually distinct.",
      });
    }

    const kind = interactionKind(selector);
    if (kind && containsTone(selector) && hasActionLeak(body)) {
      addFinding(blockers, {
        rule: "semantic-tone-action-leak",
        severity: "blocker",
        line: rule.line,
        selector,
        message: "A semantic tone interaction uses action/primary/accent aliases. Danger, warning, error, success, and info interactions must stay inside their semantic range.",
      });
    }
  }

  const interactionByBase = new Map();
  for (const rule of rules) {
    const kind = interactionKind(rule.selector);
    if (!kind) continue;
    const base = normalizeSelectorForInteraction(rule.selector);
    if (!interactionByBase.has(base)) {
      interactionByBase.set(base, {});
    }
    interactionByBase.get(base)[kind] = {
      selector: rule.selector,
      line: rule.line,
      declarations: parseDeclarations(rule.body),
    };
  }

  for (const [base, pair] of interactionByBase.entries()) {
    if (!pair.hover || !pair.pressed) continue;
    const comparedProperties = ["background", "background-color", "border-color", "color", "box-shadow"];
    const identical = comparedProperties
      .filter((property) => pair.hover.declarations[property] && pair.pressed.declarations[property])
      .filter((property) => pair.hover.declarations[property] === pair.pressed.declarations[property]);
    if (!identical.length) continue;
    addFinding(reviews, {
      rule: "hover-pressed-same-visual",
      severity: "review",
      line: pair.pressed.line,
      selector: base,
      message: `Hover and pressed share ${identical.join(", ")}. Confirm whether pressed needs a stronger affordance.`,
    });
  }

  const inventory = {
    blockerDebt: blockers.length,
    reviewDebt: reviews.length,
    componentStateVisualDebt: blockers.length,
    componentStateVisualReviewDebt: reviews.length,
    cssRulesScanned: rules.length,
  };

  return {
    schemaVersion: "component-state-visual-governance@1",
    status: blockers.length ? "fail" : reviews.length ? "review" : "pass",
    principle: "Interactive states must not borrow the wrong visual language: loading is not disabled, pressed is not hover, and semantic tones must not fall back to action blue.",
    inventory,
    componentStateVisualDebt: inventory.componentStateVisualDebt,
    componentStateVisualReviewDebt: inventory.componentStateVisualReviewDebt,
    blockers,
    reviews,
  };
}

function renderMarkdown(report) {
  const blockerRows = report.blockers
    .map((item) => `| ${item.rule} | ${item.file}:${item.line} | \`${item.selector}\` | ${item.message} |`)
    .join("\n");
  const reviewRows = report.reviews
    .map((item) => `| ${item.rule} | ${item.file}:${item.line} | \`${item.selector}\` | ${item.message} |`)
    .join("\n");
  return [
    "# Component State Visual Governance",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    `- Blocking debt: ${report.inventory.blockerDebt}`,
    `- Review debt: ${report.inventory.reviewDebt}`,
    `- CSS rules scanned: ${report.inventory.cssRulesScanned}`,
    "",
    "## Blocking Findings",
    "",
    "| Rule | Location | Selector | Finding |",
    "| --- | --- | --- | --- |",
    blockerRows || "| None | None | None | None |",
    "",
    "## Review Findings",
    "",
    "| Rule | Location | Selector | Finding |",
    "| --- | --- | --- | --- |",
    reviewRows || "| None | None | None | None |",
    "",
  ].join("\n");
}

function readExisting(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function main() {
  const report = createReport();
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = `${renderMarkdown(report)}\n`;

  if (checkMode) {
    if (readExisting(jsonOutput) !== json || readExisting(markdownOutput) !== markdown) {
      console.error("Component state visual governance report is stale. Run: node packages/audit/scripts/report-component-state-visual-governance.js");
      process.exit(1);
    }
    if (report.status === "fail") {
      console.error(`Component state visual governance failed with ${report.inventory.blockerDebt} blocking findings.`);
      process.exit(1);
    }
    return;
  }

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
  console.log(JSON.stringify({
    status: report.status,
    blockerDebt: report.inventory.blockerDebt,
    reviewDebt: report.inventory.reviewDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
}

main();
