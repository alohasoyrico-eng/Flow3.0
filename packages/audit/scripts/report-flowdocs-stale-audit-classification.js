#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const scriptsDir = path.join(root, "packages/audit/scripts");
const outputDir = path.join(root, "docs/audits");
const outputJson = path.join(outputDir, "flowdocs-stale-audit-classification.json");
const outputMd = path.join(outputDir, "flowdocs-stale-audit-classification.md");
const docsAppDir = fs.existsSync(path.join(root, "../FlowDocs/apps/docs"))
  ? path.join(root, "../FlowDocs/apps/docs")
  : path.join(root, "apps/docs");

const topLevelGates = [
  "audit-system.js",
  "audit-integration.js",
  "audit-system-scope.js",
  "audit-complete.mjs",
];

const flowCoreKeepPatterns = [
  /^audit-(?:architecture-gate|adoption-readiness|spec|component-contracts|pattern-contracts|taxonomy-boundaries|component-behavior-contracts|component-modules|package-api|package-css-namespace|package-css-contracts|platform-adapters|density-contracts|breakpoint-contracts|react-primary-contract|react-contract-triangle|react-copy-contract|anti-duplication|manual-accessibility)\.js$/,
  /^audit-(?:foundation-contracts|primitive-contracts|motion-contracts|accessibility-contracts|layout-contracts|state-contracts|energy-contracts|voice-contracts|table-contracts)\.js$/,
  /^report-react-(?:accessibility-governance|interaction-coverage|production-readiness)\.js$/,
  /^report-component-visual-cascade\.js$/,
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function rel(file) {
  return path.relative(root, file);
}

function listScripts() {
  return fs.readdirSync(scriptsDir)
    .filter((file) => /\.(?:js|mjs)$/.test(file))
    .sort();
}

function extractRequires(source) {
  const imports = [];
  source.replace(/require\(["']\.\/([^"']+)["']\)/g, (_, requested) => {
    imports.push(requested.endsWith(".js") || requested.endsWith(".mjs") ? requested : `${requested}.js`);
    return _;
  });
  source.replace(/from\s+["']\.\/([^"']+)["']/g, (_, requested) => {
    imports.push(requested.endsWith(".js") || requested.endsWith(".mjs") ? requested : `${requested}.js`);
    return _;
  });
  return [...new Set(imports)].sort();
}

function extractDocsAppFileRefs(source) {
  const refs = [];
  source.replace(/path\.join\(docsAppDir,\s*["']([^"']+)["']\)/g, (_, file) => {
    refs.push({
      file: path.join(docsAppDir, file),
      relative: `../FlowDocs/apps/docs/${file}`,
      exists: fs.existsSync(path.join(docsAppDir, file)),
    });
    return _;
  });
  return refs;
}

function classifyScript(file, source, importedByTopGates) {
  const smells = [];
  const docsRefs = extractDocsAppFileRefs(source);
  const missingDocsRefs = docsRefs.filter((ref) => !ref.exists);

  const flags = {
    importedByTopGates,
    readsFlowDocsRuntime: /\bdocsAppDir\b|FlowDocs|apps\/docs|\.\.\/FlowDocs/.test(source),
    readsGeneratedAuditEvidence: /docs\/audits\/[^"']+\.json|component-1to1-quality-matrix\.json|readinessEvidencePath|evidenceFilePath/.test(source),
    readsContentCopy: /componentCopyFile|componentDocsFile|foundationCopyFile|primitiveCopyFile|referenceCopyFile|patternCopyFile|templateBlueprintsFile|content\/content/.test(source),
    legacyNarrativeSignals: /gold-|zip|parity|1to1|quality-matrix/i.test(file) || /gold-|ZIP|zip|parity|1to1|quality matrix/i.test(source),
    missingDocsRuntimeRefs: missingDocsRefs.length > 0,
    writesAuditReport: /docs\/audits|outputDir|outputJson|outputMd/.test(source),
  };

  if (flags.readsFlowDocsRuntime) smells.push("reads-flowdocs-runtime");
  if (flags.readsGeneratedAuditEvidence) smells.push("reads-generated-audit-evidence");
  if (flags.readsContentCopy) smells.push("reads-content-copy");
  if (flags.legacyNarrativeSignals) smells.push("legacy-narrative-or-zip-signal");
  if (flags.missingDocsRuntimeRefs) smells.push("missing-flowdocs-runtime-reference");

  let classification = "keep-flow-core-candidate";
  let action = "May remain in a Flow core/system gate if its inputs are source contracts or package runtime.";

  if (topLevelGates.includes(file)) {
    classification = "mixed-top-level-gate";
    action = "Split before trusting as a monolithic gate.";
  } else if (flags.missingDocsRuntimeRefs) {
    classification = "rewrite-before-gating";
    action = "Fix stale FlowDocs path assumptions before this can gate anything.";
  } else if (flags.readsFlowDocsRuntime) {
    classification = "scope-flowdocs-consumer";
    action = "Move to an explicit FlowDocs consumer gate; do not run as Flow core proof.";
  } else if (flags.readsGeneratedAuditEvidence) {
    classification = "generated-evidence-only";
    action = "Use as checkpoint/report evidence, not as source-of-truth gate.";
  } else if (flags.legacyNarrativeSignals) {
    classification = "legacy-forensics-only";
    action = "Keep only as forensic reference unless rewritten against source contracts.";
  } else if (flags.readsContentCopy) {
    classification = "content-governance";
    action = "Keep outside Flow runtime gates; content truth should be its own boundary.";
  } else if (flowCoreKeepPatterns.some((pattern) => pattern.test(file))) {
    classification = "keep-flow-core";
    action = "Eligible for Flow core/system gate.";
  }

  return {
    file: `packages/audit/scripts/${file}`,
    classification,
    action,
    importedByTopGates,
    smells,
    missingDocsRefs: missingDocsRefs.map((ref) => ({
      file: rel(ref.file),
      expectedRuntimePath: ref.relative,
    })),
  };
}

function buildReport() {
  const files = listScripts();
  const sources = Object.fromEntries(files.map((file) => [file, read(path.join(scriptsDir, file))]));
  const topGateImports = {};

  for (const gate of topLevelGates) {
    if (!sources[gate]) continue;
    topGateImports[gate] = extractRequires(sources[gate]);
  }

  const importedBy = {};
  for (const [gate, imports] of Object.entries(topGateImports)) {
    for (const imported of imports) {
      importedBy[imported] ??= [];
      importedBy[imported].push(`packages/audit/scripts/${gate}`);
    }
  }

  const classifications = files
    .map((file) => classifyScript(file, sources[file], importedBy[file] ?? []))
    .filter((entry) => entry.importedByTopGates.length || entry.smells.length || topLevelGates.includes(path.basename(entry.file)))
    .sort((a, b) => {
      const severity = {
        "mixed-top-level-gate": 0,
        "rewrite-before-gating": 1,
        "scope-flowdocs-consumer": 2,
        "generated-evidence-only": 3,
        "legacy-forensics-only": 4,
        "content-governance": 5,
        "keep-flow-core": 6,
        "keep-flow-core-candidate": 7,
      };
      return (severity[a.classification] ?? 99) - (severity[b.classification] ?? 99) || a.file.localeCompare(b.file);
    });

  const summary = classifications.reduce((acc, entry) => {
    acc[entry.classification] = (acc[entry.classification] ?? 0) + 1;
    return acc;
  }, {});

  const blockingFindings = [
    {
      gate: "packages/audit/scripts/audit-system.js",
      issue: "Legacy all-in-one gate still mixes Flow core, FlowDocs app files, content ownership, generated reports, and visual/doc parity checks.",
      action: "Do not use as the trustworthy system gate until split into core, consumer, content, and forensic gates.",
    },
    {
      gate: "packages/audit/scripts/audit-integration.js",
      issue: "Runs generated evidence checks such as component 1:1 matrix and FlowDocs template composition alongside package contracts.",
      action: "Keep package/runtime checks; move template composition and generated quality matrix checks out of the integration gate.",
    },
    {
      gate: "packages/audit/scripts/audit-system-scope.js",
      issue: "Includes FlowDocs demo ownership and generated reporting in the same scope as React/package boundary checks.",
      action: "Split FlowDocs consumer ownership from Flow core readiness.",
    },
  ];

  const report = {
    generatedAt: new Date().toISOString(),
    status: blockingFindings.length ? "action_required" : "pass",
    purpose: "Classify stale, generated, FlowDocs-consumer, and Flow-core audit scripts so gates stop mixing source-of-truth layers.",
    sourceOfTruthRules: [
      "Flow core gates may read package source, generated runtime from package builds, token outputs, specs, and package tests.",
      "FlowDocs gates may prove docs consume Flow, but must not define component API, accessibility, state, motion, or token truth.",
      "docs/audits/*.json reports are evidence snapshots, not source contracts.",
      "Legacy ZIP/gold/parity narratives are forensic references unless rewritten into source-backed contracts.",
    ],
    summary,
    blockingFindings,
    topGateImports: Object.fromEntries(
      Object.entries(topGateImports).map(([gate, imports]) => [`packages/audit/scripts/${gate}`, imports.map((file) => `packages/audit/scripts/${file}`)])
    ),
    classifications,
    nextIteration: {
      id: 4,
      name: "Fuente De Verdad De Contenido",
      goal: "Decide which FlowDocs content files are source, generated bundle, orphan, or legacy before deleting/migrating files.",
    },
  };

  return report;
}

function writeMarkdown(report) {
  const lines = [
    "# FlowDocs Stale Audit Classification",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    "",
    "## Summary",
    "",
    ...Object.entries(report.summary).map(([key, count]) => `- ${key}: ${count}`),
    "",
    "## Blocking Findings",
    "",
    ...report.blockingFindings.flatMap((finding) => [
      `### ${finding.gate}`,
      "",
      `- Issue: ${finding.issue}`,
      `- Action: ${finding.action}`,
      "",
    ]),
    "## Source Of Truth Rules",
    "",
    ...report.sourceOfTruthRules.map((rule) => `- ${rule}`),
    "",
    "## Classified Scripts",
    "",
    "| Script | Classification | Smells | Action |",
    "| --- | --- | --- | --- |",
    ...report.classifications.map((entry) => [
      entry.file,
      entry.classification,
      entry.smells.length ? entry.smells.join(", ") : "none",
      entry.action,
    ].map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | ")).map((row) => `| ${row} |`),
    "",
    "## Missing FlowDocs Runtime References",
    "",
  ];

  const missing = report.classifications.flatMap((entry) =>
    entry.missingDocsRefs.map((ref) => ({ script: entry.file, ...ref }))
  );

  if (missing.length) {
    lines.push("| Script | Missing ref | Expected |", "| --- | --- | --- |");
    for (const item of missing) {
      lines.push(`| ${item.script} | ${item.file} | ${item.expectedRuntimePath} |`);
    }
  } else {
    lines.push("None.");
  }

  lines.push(
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
  blockingFindings: report.blockingFindings.length,
  output: {
    json: rel(outputJson),
    markdown: rel(outputMd),
  },
}, null, 2));
