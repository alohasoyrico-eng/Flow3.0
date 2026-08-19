#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const root = process.cwd();
const flowDocsDir = fs.existsSync(path.join(root, "../FlowDocs/apps/docs"))
  ? path.join(root, "../FlowDocs/apps/docs")
  : path.join(root, "apps/docs");
const outputDir = path.join(root, "docs/audits");
const outputJson = path.join(outputDir, "flowdocs-content-source-of-truth.json");
const outputMd = path.join(outputDir, "flowdocs-content-source-of-truth.md");
const bundleFile = path.join(flowDocsDir, "generated/docs-content.bundle.json");

const bundleInputs = [
  ["catalog", "#design-system/content/catalog"],
  ["systemSpec", "#design-system/specs/system"],
  ["componentDocs", "#design-system/content/component-docs"],
  ["componentCopy", "#design-system/content/component-copy"],
  ["patternCopy", "#design-system/content/pattern-copy"],
  ["componentImplementationStatus", "#design-system/content/component-implementation-status"],
  ["foundationCopy", "#design-system/content/foundation-copy"],
  ["primitiveCopy", "#design-system/content/primitive-copy"],
  ["referenceCopy", "#design-system/content/reference-copy"],
  ["templateBlueprintContent", "#design-system/content/template-blueprints"],
  ["homeContent", "#design-system/content/home"],
  ["uiCopy", "#design-system/content/i18n-ui"],
];

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function readJson(file) {
  return JSON.parse(read(file));
}

function rel(file) {
  return path.relative(root, file);
}

function hash(value) {
  return crypto.createHash("sha256").update(typeof value === "string" ? value : JSON.stringify(value)).digest("hex");
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

function mergeJson(target, source) {
  if (Array.isArray(target) && Array.isArray(source)) return [...target, ...source];
  if (!target || typeof target !== "object" || Array.isArray(target)) return source;
  if (!source || typeof source !== "object" || Array.isArray(source)) return source;
  return Object.entries(source).reduce((next, [key, value]) => {
    next[key] = key in next ? mergeJson(next[key], value) : value;
    return next;
  }, { ...target });
}

function resolveImport(specifier) {
  const imports = readJson(path.join(root, "package.json")).imports ?? {};
  const target = imports[specifier];
  if (typeof target !== "string" || !target.startsWith("./")) {
    throw new Error(`Cannot resolve package import ${specifier}`);
  }
  return path.join(root, target);
}

function resolveJsonShards(file, deps) {
  deps.add(file);
  const content = readJson(file);
  if (!Array.isArray(content?.$systemShards)) return content;
  const baseDir = path.dirname(file);
  return content.$systemShards
    .map((shardPath) => resolveJsonShards(path.join(baseDir, shardPath), deps))
    .reduce((merged, shard) => mergeJson(merged, shard), {});
}

function buildExpectedBundle() {
  const deps = new Set();
  const content = {};
  const inputs = [];
  for (const [key, specifier] of bundleInputs) {
    const sourceFile = resolveImport(specifier);
    content[key] = resolveJsonShards(sourceFile, deps);
    inputs.push({ key, specifier, sourceFile: rel(sourceFile) });
  }
  return { content, dependencies: [...deps].sort(), inputs };
}

function classifyPackageContent(usedDeps) {
  const contentDir = path.join(root, "packages/content/content");
  const used = new Set(usedDeps.map((file) => path.resolve(file)));
  return walk(contentDir, (file) => /\.(json|md)$/.test(file)).map((file) => {
    let classification = "outside-docs-content-bundle";
    if (used.has(path.resolve(file))) classification = "docs-content-source";
    else if (/\/(?:repo-boundary-audit|component-quality-audit)\.md$/.test(file)) classification = "forensic-doc";
    else if (/\/(?:react-production-readiness-evidence|component-behavior-contracts|pattern-react-runtime-policy|zip-template-parity|template-dependency-audits)\//.test(file)) classification = "governance-evidence-source";
    else if (/\/(?:anti-duplication-concepts|component-css-governance|docs-system-boundary|flowdocs-p0-surface-policy|foundation-primitive-export-governance|pattern-architecture-policy|pattern-backlog|pattern-contract-governance|pattern-react-runtime-policy|primitive-cascade-governance|react-primary-governance|system-debt-governance|taxonomy-boundaries|zip-template-parity)\.json$/.test(file)) classification = "governance-source";
    return { file: rel(file), classification };
  });
}

function classifyFlowDocsContentFiles() {
  const rootFiles = walk(flowDocsDir, (file) => /\.(json|js|css|html|md)$/.test(file));
  const contentLoadPattern = /fetch\(["'`][^"'`]*\.json|loadContent\(|loadContentBundle\(|generated\/docs-content\.bundle\.json|#design-system\/content|#design-system\/specs|packages\/content|packages\/specs/;
  return rootFiles.map((file) => {
    const relative = rel(file);
    let classification = "runtime-or-style";
    let contentSignals = [];
    if (relative.endsWith("generated/docs-content.bundle.json")) classification = "generated-docs-content-bundle";
    else if (relative.includes("/generated/")) classification = "generated-runtime-asset";
    else if (relative.endsWith("content-sources.js")) classification = "content-runtime-bridge";
    else if (relative.endsWith("content-loader.js")) classification = "generic-content-loader";
    else if (/\.json$/.test(file)) classification = "local-docs-json-review";
    else if (/README\.md$/.test(file)) classification = "docs-runtime-boundary-doc";
    if (/\.(js|html)$/.test(file)) {
      const source = read(file);
      if (contentLoadPattern.test(source)) contentSignals.push("content-load-or-source-reference");
      if (/#design-system\/content|#design-system\/specs|packages\/content|packages\/specs/.test(source)) {
        contentSignals.push("forbidden-runtime-source-reference");
      }
      if (/loadContentBundle\(["'`]\.\/generated\/docs-content\.bundle\.json/.test(source)) {
        contentSignals.push("loads-generated-content-bundle");
      }
    }
    return { file: relative, classification, contentSignals };
  });
}

function buildReport() {
  const expected = buildExpectedBundle();
  const actual = fs.existsSync(bundleFile) ? readJson(bundleFile) : null;
  const expectedHash = hash(expected.content);
  const actualHash = actual ? hash(actual) : null;
  const bundleMatchesSource = Boolean(actual) && expectedHash === actualHash;
  const packageContent = classifyPackageContent(expected.dependencies);
  const flowDocsFiles = classifyFlowDocsContentFiles();
  const forbiddenRuntimeRefs = flowDocsFiles.filter((entry) => entry.contentSignals.includes("forbidden-runtime-source-reference"));
  const localDocsJson = flowDocsFiles.filter((entry) => entry.classification === "local-docs-json-review");
  const contentRuntimeLoads = flowDocsFiles.filter((entry) => entry.contentSignals.includes("content-load-or-source-reference"));

  const summary = {
    bundleInputs: expected.inputs.length,
    bundleSourceDependencies: expected.dependencies.length,
    packageContentFiles: packageContent.length,
    packageContentInDocsBundle: packageContent.filter((entry) => entry.classification === "docs-content-source").length,
    packageContentOutsideDocsBundle: packageContent.filter((entry) => entry.classification !== "docs-content-source").length,
    flowdocsContentLoadFiles: contentRuntimeLoads.length,
    localFlowDocsJsonFiles: localDocsJson.length,
    forbiddenRuntimeSourceRefs: forbiddenRuntimeRefs.length,
    bundleMatchesSource,
  };

  const findings = [
    ...(actual ? [] : [{
      severity: "high",
      file: rel(bundleFile),
      issue: "FlowDocs generated content bundle is missing.",
      action: "Run FlowDocs build:docs-content from the FlowDocs package after source truth is stable.",
    }]),
    ...(bundleMatchesSource ? [] : [{
      severity: "high",
      file: rel(bundleFile),
      issue: "FlowDocs generated content bundle does not match package content/spec source.",
      action: "Regenerate the bundle or fix the source mapping before treating FlowDocs content as current.",
    }]),
    ...forbiddenRuntimeRefs.map((entry) => ({
      severity: "high",
      file: entry.file,
      issue: "FlowDocs runtime references package content/spec source directly.",
      action: "Runtime must consume generated/docs-content.bundle.json only.",
    })),
    ...localDocsJson.map((entry) => ({
      severity: "medium",
      file: entry.file,
      issue: "FlowDocs owns a local JSON file outside the generated content bundle.",
      action: "Decide whether it is source, generated evidence, or delete-candidate in a later cleanup iteration.",
    })),
  ];

  return {
    generatedAt: new Date().toISOString(),
    status: findings.some((finding) => finding.severity === "high") ? "fail" : findings.length ? "action_required" : "pass",
    purpose: "Prove the FlowDocs runtime content source of truth and identify content files outside the generated bundle path.",
    rules: [
      "FlowDocs runtime reads generated/docs-content.bundle.json.",
      "The generated bundle is not source; package content/spec imports are source.",
      "Local FlowDocs JSON must be justified before deletion or promotion.",
      "Governance and forensic content may exist outside the docs bundle, but must not masquerade as runtime docs content.",
    ],
    bundle: {
      file: rel(bundleFile),
      exists: Boolean(actual),
      expectedHash,
      actualHash,
      matchesSource: bundleMatchesSource,
      inputs: expected.inputs,
      dependencyFiles: expected.dependencies.map(rel),
    },
    summary,
    findings,
    packageContent,
    flowDocsContentFiles: flowDocsFiles,
    nextIteration: {
      id: 5,
      name: "FlowDocs Shell Decision",
      goal: "Decide whether the current FlowDocs shell is a consumer boundary to repair or a legacy shell to replace.",
    },
  };
}

function writeMarkdown(report) {
  const lines = [
    "# FlowDocs Content Source Of Truth",
    "",
    `Generated: ${report.generatedAt}`,
    `Status: ${report.status}`,
    "",
    "## Summary",
    "",
    ...Object.entries(report.summary).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Bundle",
    "",
    `- File: ${report.bundle.file}`,
    `- Exists: ${report.bundle.exists}`,
    `- Matches source: ${report.bundle.matchesSource}`,
    `- Expected hash: ${report.bundle.expectedHash}`,
    `- Actual hash: ${report.bundle.actualHash ?? "missing"}`,
    "",
    "## Bundle Inputs",
    "",
    "| Key | Import | Source file |",
    "| --- | --- | --- |",
    ...report.bundle.inputs.map((input) => `| ${input.key} | ${input.specifier} | ${input.sourceFile} |`),
    "",
    "## Findings",
    "",
  ];

  if (report.findings.length) {
    lines.push("| Severity | File | Issue | Action |", "| --- | --- | --- | --- |");
    for (const finding of report.findings) {
      lines.push(`| ${finding.severity} | ${finding.file} | ${finding.issue} | ${finding.action} |`);
    }
  } else {
    lines.push("None.");
  }

  lines.push(
    "",
    "## Package Content Classification",
    "",
    "| Classification | Count |",
    "| --- | ---: |",
  );
  const packageCounts = report.packageContent.reduce((acc, entry) => {
    acc[entry.classification] = (acc[entry.classification] ?? 0) + 1;
    return acc;
  }, {});
  for (const [classification, count] of Object.entries(packageCounts).sort()) {
    lines.push(`| ${classification} | ${count} |`);
  }

  lines.push(
    "",
    "## Local FlowDocs JSON Review",
    "",
  );
  const localJson = report.flowDocsContentFiles.filter((entry) => entry.classification === "local-docs-json-review");
  if (localJson.length) {
    lines.push("| File | Signals |", "| --- | --- |");
    for (const entry of localJson) {
      lines.push(`| ${entry.file} | ${entry.contentSignals.join(", ") || "none"} |`);
    }
  } else {
    lines.push("None.");
  }

  lines.push(
    "",
    "## Runtime Content Load Files",
    "",
    "| File | Classification | Signals |",
    "| --- | --- | --- |",
    ...report.flowDocsContentFiles
      .filter((entry) => entry.contentSignals.length)
      .map((entry) => `| ${entry.file} | ${entry.classification} | ${entry.contentSignals.join(", ")} |`),
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
