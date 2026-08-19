#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const docsDir = fs.existsSync(path.join(root, "../FlowDocs/apps/docs"))
  ? path.join(root, "../FlowDocs/apps/docs")
  : path.join(root, "apps/docs");
const localQaDir = path.join(root, "../../local-visual-snapshots/Flow3-component-qa");
const outputDir = path.join(root, "docs/audits");
const outputJson = path.join(outputDir, "flowdocs-demo-boundary.json");
const outputMd = path.join(outputDir, "flowdocs-demo-boundary.md");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function rel(file) {
  return path.relative(root, file);
}

function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(file, predicate));
    else if (predicate(file)) out.push(file);
  }
  return out.sort();
}

function count(source, pattern) {
  return [...source.matchAll(pattern)].length;
}

function classifyDocsDemoFile(file) {
  const name = path.basename(file);
  const source = read(file);
  const signals = [];
  const risks = [];
  let classification = "docs-runtime-support";

  if (/^gold-.*-docs\.js$/.test(name)) classification = "docs-component-detail-renderer";
  if (/^pattern-.*(?:demo|demos|island|islands)\.js$/.test(name)) classification = "docs-pattern-demo-renderer";
  if (/^template-.*(?:demo|demos|island|islands)\.js$/.test(name)) classification = "docs-template-demo-renderer";
  if (/interactions\.js$/.test(name)) classification = "docs-manual-interaction-layer";
  if (name === "component-demo.js") classification = "docs-package-demo-bridge";
  if (name === "react-component-islands.js") classification = "docs-react-island-hydrator";
  if (name.endsWith("-island.js")) classification = "docs-react-pattern-island";

  if (/componentDemoProps\(/.test(source)) signals.push("uses-package-demo-props");
  if (/\.\/generated\/react/.test(source)) signals.push("uses-docs-generated-react");
  if (/data-react-component/.test(source)) signals.push("creates-react-island");
  if (/createRoot|React\.createElement/.test(source)) signals.push("hydrates-react");
  if (/innerHTML\s*=|insertAdjacentHTML/.test(source)) signals.push("mutates-html");
  if (/querySelector|querySelectorAll/.test(source)) signals.push("selector-driven");
  if (/addEventListener/.test(source)) signals.push("manual-events");
  if (/buttonDemo|selectDemo|checkboxDemo|comboboxDemo|simpleDemo/.test(source)) signals.push("local-demo-helper");
  if (/data-component-source="react"|data-component-source="react-pattern"/.test(source)) signals.push("declares-flow-source");

  if (signals.includes("selector-driven") || signals.includes("manual-events")) {
    risks.push("Demo behavior may live in FlowDocs instead of the package component.");
  }
  if (signals.includes("mutates-html")) {
    risks.push("Demo can change rendered behavior outside React/package contracts.");
  }
  if (signals.includes("local-demo-helper") && !signals.includes("uses-package-demo-props")) {
    risks.push("Demo may be authored through docs-local helpers instead of package demo props.");
  }
  if (signals.includes("declares-flow-source") && (signals.includes("selector-driven") || signals.includes("manual-events"))) {
    risks.push("Demo claims Flow source while FlowDocs still owns part of the interaction.");
  }

  return {
    file: rel(file),
    classification,
    signals,
    risks,
    metrics: {
      reactIslands: count(source, /data-react-component/g),
      packageDemoProps: count(source, /componentDemoProps\(/g),
      generatedReactImports: count(source, /\.\/generated\/react/g),
      selectors: count(source, /querySelector(?:All)?/g),
      listeners: count(source, /addEventListener/g),
      htmlMutations: count(source, /innerHTML\s*=|insertAdjacentHTML/g),
      componentDemoCalls: count(source, /componentDemo\(/g),
    },
  };
}

function classifyLocalQaFile(file) {
  const source = read(file);
  const relativeParts = path.relative(localQaDir, file).split(path.sep);
  const component = relativeParts[0]?.replace(/-\d{4}-\d{2}-\d{2}$/, "") ?? "unknown";
  const signals = [];
  if (/packages\/tokens\/styles\/tokens\.css/.test(source)) signals.push("uses-flow-token-css");
  if (/packages\/components\/styles\/components\.css/.test(source)) signals.push("uses-flow-component-css");
  if (/packages\/react\/src|packages\/react\/dist|generated\/react/.test(source)) signals.push("uses-flow-react-runtime");
  if (/data-theme|aria-pressed/.test(source)) signals.push("has-theme-control");
  if (/keydown|Arrow|Enter|Escape|Tab/.test(source)) signals.push("keyboard-observation-harness");
  if (/<style>/.test(source)) signals.push("local-harness-css");
  return {
    file,
    component,
    classification: "local-component-qa-harness",
    signals,
    risks: [
      signals.includes("local-harness-css") ? "Harness CSS can affect visual reading; do not use as component source truth." : null,
      !signals.includes("uses-flow-react-runtime") ? "Harness may not prove React runtime unless runtime import is explicit." : null,
    ].filter(Boolean),
    metrics: {
      localStyleBlocks: count(source, /<style>/g),
      flowCssLinks: count(source, /packages\/(?:tokens|components)\/styles/g),
      keyboardTerms: count(source, /Arrow|Enter|Escape|keydown|keyup|Tab/g),
    },
  };
}

function buildReport() {
  const docsDemoFiles = walk(docsDir, (file) => {
    const name = path.basename(file);
    return /\.(js)$/.test(file) && (
      /demo|Demo|island|Island|interactions|gold-.*-docs|react-component-islands|component-demo/.test(name)
    ) && !file.includes(`${path.sep}generated${path.sep}`);
  }).map(classifyDocsDemoFile);

  const localQaFiles = walk(localQaDir, (file) => /flow-current\.html$|manifest\.json$/.test(file)).map(classifyLocalQaFile);
  const docsRiskFiles = docsDemoFiles.filter((entry) => entry.risks.length);
  const mixedFlowClaims = docsDemoFiles.filter((entry) => entry.signals.includes("declares-flow-source") && entry.risks.length);
  const localComponents = [...new Set(localQaFiles.map((entry) => entry.component))].sort();

  const summary = {
    flowdocsDemoFiles: docsDemoFiles.length,
    flowdocsDemoRiskFiles: docsRiskFiles.length,
    mixedFlowClaimFiles: mixedFlowClaims.length,
    localQaFiles: localQaFiles.length,
    localQaComponents: localComponents.length,
    localQaComponentIds: localComponents,
  };

  const findings = [
    ...(mixedFlowClaims.length ? [{
      severity: "high",
      issue: "Some FlowDocs demos declare Flow/React source while still relying on FlowDocs-owned selector/event behavior.",
      action: "Separate package component truth from docs demo choreography; demos must label adapter behavior explicitly.",
      count: mixedFlowClaims.length,
    }] : []),
    ...(docsDemoFiles.some((entry) => entry.file.endsWith("react-component-islands.js")) ? [{
      severity: "high",
      issue: "FlowDocs owns stateful island wrappers for components such as input, checkbox, combobox, select and country selector.",
      action: "These wrappers are acceptable only as docs harness adapters; package behavior must be tested in package-owned tests and local QA harnesses.",
      count: 1,
    }] : []),
    ...(localQaFiles.some((entry) => !entry.signals.includes("uses-flow-react-runtime")) ? [{
      severity: "medium",
      issue: "At least one local QA file may not prove React runtime directly.",
      action: "For each component QA harness, record whether it imports React runtime, generated docs runtime, or static markup.",
      count: localQaFiles.filter((entry) => !entry.signals.includes("uses-flow-react-runtime")).length,
    }] : []),
    ...(localQaFiles.some((entry) => entry.signals.includes("local-harness-css")) ? [{
      severity: "medium",
      issue: "Local QA harnesses include their own layout CSS.",
      action: "Keep them local and out of repo; use them for human inspection, not as component source truth.",
      count: localQaFiles.filter((entry) => entry.signals.includes("local-harness-css")).length,
    }] : []),
  ];

  return {
    generatedAt: new Date().toISOString(),
    status: findings.some((finding) => finding.severity === "high") ? "action_required" : "pass",
    purpose: "Classify FlowDocs demos, React islands, manual interactions, and local QA harnesses so component bugs are not confused with docs demo bugs.",
    rules: [
      "Package-owned React tests define component behavior truth.",
      "Local component QA harnesses are human review tools and must stay outside the repo.",
      "FlowDocs demos may demonstrate composition but must not own component logic, keyboard semantics, or state truth.",
      "Any docs demo wrapper that adds state or interaction must be labelled as an adapter, not proof that the component works.",
      "Pattern/template demos can compose components, but component-level defects must be fixed in package source and package tests first.",
    ],
    summary,
    findings,
    flowdocsDemos: docsDemoFiles,
    localQaHarnesses: localQaFiles,
    nextIteration: {
      id: 7,
      name: "Templates Boundary",
      goal: "Classify docs templates and package templates so FlowDocs pages consume Flow templates without recreating layout rules locally.",
    },
  };
}

function writeMarkdown(report) {
  const lines = [
    "# FlowDocs Demo Boundary",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    "",
    "## Summary",
    "",
    ...Object.entries(report.summary)
      .filter(([key]) => key !== "localQaComponentIds")
      .map(([key, value]) => `- ${key}: ${Array.isArray(value) ? value.join(", ") : value}`),
    `- localQaComponentIds: ${report.summary.localQaComponentIds.join(", ") || "none"}`,
    "",
    "## Rules",
    "",
    ...report.rules.map((rule) => `- ${rule}`),
    "",
    "## Findings",
    "",
  ];

  if (report.findings.length) {
    lines.push("| Severity | Issue | Count | Action |", "| --- | --- | ---: | --- |");
    for (const finding of report.findings) {
      lines.push(`| ${finding.severity} | ${finding.issue} | ${finding.count} | ${finding.action} |`);
    }
  } else {
    lines.push("None.");
  }

  lines.push(
    "",
    "## FlowDocs Demo Classifications",
    "",
    "| File | Classification | Signals | Risks |",
    "| --- | --- | --- | --- |",
    ...report.flowdocsDemos.map((entry) =>
      `| ${entry.file} | ${entry.classification} | ${entry.signals.join(", ") || "none"} | ${entry.risks.join("; ") || "none"} |`
    ),
    "",
    "## Local QA Harnesses",
    "",
    "| File | Component | Signals | Risks |",
    "| --- | --- | --- | --- |",
    ...report.localQaHarnesses.map((entry) =>
      `| ${entry.file} | ${entry.component} | ${entry.signals.join(", ") || "none"} | ${entry.risks.join("; ") || "none"} |`
    ),
    "",
    "## Next Iteration",
    "",
    `Iteration ${report.nextIteration.id}: ${report.nextIteration.name}. ${report.nextIteration.goal}`,
    ""
  );
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
const report = buildReport();
fs.writeFileSync(outputJson, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(outputMd, writeMarkdown(report));
console.log(JSON.stringify({
  status: report.status,
  summary: report.summary,
  findings: report.findings.length,
  output: {
    json: rel(outputJson),
    markdown: rel(outputMd),
  },
}, null, 2));
