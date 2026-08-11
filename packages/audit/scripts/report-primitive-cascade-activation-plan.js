#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-cascade-activation-plan.json");
const markdownOutput = path.join(outputDir, "primitive-cascade-activation-plan.md");
const governanceFile = path.join(root, "packages/content/content/primitive-cascade-governance.json");
const scriptsDir = path.join(root, "packages/audit/scripts");

const waveOrder = [
  {
    id: "normalize-lateral-policy",
    label: "Normalize Lateral Policy",
    blockerTypes: ["lateral-policy", "dependency-cycle"],
    principle: "Break primitive dependency cycles by marking lateral coordination separately from upstream blockers.",
  },
  {
    id: "vendor-source-evidence",
    label: "Vendor Source Evidence",
    blockerTypes: ["vendor-source-evidence"],
    principle: "Add local source manifests, generated bridges, CSS/license evidence, and vendor ownership before activating vendor-backed primitives.",
  },
  {
    id: "docs-runtime-evidence",
    label: "Docs Runtime Evidence",
    blockerTypes: ["docs-runtime-evidence"],
    principle: "Prove FlowDocs consumes local Flow runtime/semantic evidence instead of owning behavior.",
  },
  {
    id: "local-consumption-evidence",
    label: "Local Consumption Evidence",
    blockerTypes: ["local-consumption-evidence"],
    principle: "Prove primitives are consumed by components, patterns, templates, or exported contracts before activation.",
  },
];

function readJson(file, fallback = {}) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

function unique(values) {
  return [...new Set(values)].sort();
}

function readReportStatus(id) {
  const reportFile = path.join(outputDir, `primitive-${id}-cascade-audit.json`);
  const report = readJson(reportFile, null);
  return report?.status ?? "missing";
}

function collectPrimitiveDependencies(id) {
  const scriptFile = path.join(scriptsDir, `report-primitive-${id}-cascade.js`);
  if (!fs.existsSync(scriptFile)) return [];
  const source = fs.readFileSync(scriptFile, "utf8");
  const dependencies = new Set();
  for (const match of source.matchAll(/docs\/audits\/primitive-([a-z0-9-]+)-cascade-audit\.json/g)) {
    if (match[1] !== id) dependencies.add(match[1]);
  }
  return [...dependencies].sort();
}

function createReport() {
  const governance = readJson(governanceFile, {});
  const backlog = governance.backlogCascadeReports && typeof governance.backlogCascadeReports === "object"
    ? governance.backlogCascadeReports
    : {};
  const allowedBlockerTypes = governance.backlogSchema?.allowedBlockerTypes ?? [];
  const backlogRows = Object.entries(backlog).map(([id, entry]) => ({
    id,
    blockerTypes: Array.isArray(entry.blockerTypes) ? entry.blockerTypes : [],
    reason: entry.reason ?? "",
    activationEvidence: Array.isArray(entry.activationEvidence) ? entry.activationEvidence : [],
  })).sort((a, b) => a.id.localeCompare(b.id));
  const activeSet = new Set(Array.isArray(governance.activeCascadeReports) ? governance.activeCascadeReports : []);
  const backlogSet = new Set(backlogRows.map((row) => row.id));
  const dependencySignals = Object.fromEntries(backlogRows.map((row) => {
    const dependencies = collectPrimitiveDependencies(row.id).map((dependency) => {
      const disposition = activeSet.has(dependency) ? "active" : backlogSet.has(dependency) ? "backlog" : "undisposed";
      const status = readReportStatus(dependency);
      return {
        primitive: dependency,
        disposition,
        status,
        resolved: disposition === "active" && status === "pass",
      };
    });
    return [row.id, dependencies];
  }));

  const waves = waveOrder.map((wave) => {
    const primitives = backlogRows
      .filter((row) => row.blockerTypes.some((type) => wave.blockerTypes.includes(type)))
      .map((row) => ({
        primitive: row.id,
        blockerTypes: row.blockerTypes.filter((type) => wave.blockerTypes.includes(type)),
        activationEvidence: row.activationEvidence,
      }));
    return {
      ...wave,
      primitives,
      primitiveCount: primitives.length,
      evidenceCount: primitives.reduce((total, row) => total + row.activationEvidence.length, 0),
    };
  });

  const unknownBlockerTypes = unique(backlogRows.flatMap((row) => row.blockerTypes)
    .filter((type) => !allowedBlockerTypes.includes(type)));
  const uncoveredBlockerTypes = unique(backlogRows.flatMap((row) => row.blockerTypes)
    .filter((type) => !waveOrder.some((wave) => wave.blockerTypes.includes(type))));
  const backlogWithoutEvidence = backlogRows.filter((row) => !row.activationEvidence.length).map((row) => row.id);
  const backlogWithoutWave = backlogRows
    .filter((row) => !row.blockerTypes.some((type) => waveOrder.some((wave) => wave.blockerTypes.includes(type))))
    .map((row) => row.id);
  const emptyWaves = waves.filter((wave) => wave.primitiveCount === 0).map((wave) => wave.id);
  const blockedActivationCandidates = backlogRows
    .filter((row) => row.blockerTypes.length === 1 && row.activationEvidence.length)
    .map((row) => ({
      id: row.id,
      unresolvedDependencies: (dependencySignals[row.id] ?? []).filter((dependency) => !dependency.resolved),
    }))
    .filter((row) => row.unresolvedDependencies.length);
  const activationCandidates = backlogRows
    .filter((row) => row.blockerTypes.length === 1 && row.activationEvidence.length)
    .filter((row) => !(dependencySignals[row.id] ?? []).some((dependency) => !dependency.resolved))
    .map((row) => row.id);

  const issues = [
    ...unknownBlockerTypes.map((type) => `unknown blocker type: ${type}`),
    ...uncoveredBlockerTypes.map((type) => `blocker type has no activation wave: ${type}`),
    ...backlogWithoutEvidence.map((id) => `backlog primitive has no activation evidence: ${id}`),
    ...backlogWithoutWave.map((id) => `backlog primitive has no activation wave: ${id}`),
  ];

  const inventory = {
    backlogPrimitiveCascadeReports: backlogRows.length,
    activationWaves: waves.length,
    emptyActivationWaves: emptyWaves.length,
    backlogWithoutActivationEvidence: backlogWithoutEvidence.length,
    backlogWithoutActivationWave: backlogWithoutWave.length,
    unknownBlockerTypes: unknownBlockerTypes.length,
    uncoveredBlockerTypes: uncoveredBlockerTypes.length,
    activationCandidates: activationCandidates.length,
    blockedActivationCandidates: blockedActivationCandidates.length,
  };
  inventory.primitiveCascadeActivationPlanDebt = issues.length;

  return {
    status: issues.length ? "fail" : "pass",
    audit: "primitive cascade activation plan",
    principle: "Primitive cascade backlog must have an activation order derived from blocker types and required evidence so active gates grow systematically without reintroducing dependency cycles.",
    inventory,
    waves,
    dependencySignals,
    activationCandidates,
    blockedActivationCandidates,
    issues,
  };
}

function toMarkdown(report) {
  return [
    "# Primitive Cascade Activation Plan",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    `- Backlog primitive cascade reports: ${report.inventory.backlogPrimitiveCascadeReports}`,
    `- Activation waves: ${report.inventory.activationWaves}`,
    `- Activation candidates: ${report.inventory.activationCandidates}`,
    `- Blocked activation candidates: ${report.inventory.blockedActivationCandidates}`,
    `- Plan debt: ${report.inventory.primitiveCascadeActivationPlanDebt}`,
    "",
    "## Waves",
    "",
    "| Wave | Count | Principle | Primitives |",
    "| --- | ---: | --- | --- |",
    ...report.waves.map((wave) => `| ${wave.label} | ${wave.primitiveCount} | ${wave.principle} | ${wave.primitives.map((row) => `\`${row.primitive}\``).join(", ") || "none"} |`),
    "",
    "## Activation Candidates",
    ...(report.activationCandidates.length ? report.activationCandidates.map((id) => `- \`${id}\``) : ["- None"]),
    "",
    "## Blocked Activation Candidates",
    ...(report.blockedActivationCandidates.length
      ? report.blockedActivationCandidates.map((row) => `- \`${row.id}\`: ${row.unresolvedDependencies.map((dependency) => `${dependency.primitive} (${dependency.disposition}/${dependency.status})`).join(", ")}`)
      : ["- None"]),
    "",
    "## Issues",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None"]),
    "",
  ].join("\n");
}

function writeReport(report) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = toMarkdown(report);

  if (checkMode) {
    if (!fs.existsSync(jsonOutput) || !fs.existsSync(markdownOutput)) {
      console.error("Primitive cascade activation plan is missing. Run: node packages/audit/scripts/report-primitive-cascade-activation-plan.js");
      process.exit(1);
    }
    if (fs.readFileSync(jsonOutput, "utf8") !== json || fs.readFileSync(markdownOutput, "utf8") !== markdown) {
      console.error("Primitive cascade activation plan is stale. Run: node packages/audit/scripts/report-primitive-cascade-activation-plan.js");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive cascade activation plan failed: ${report.issues.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, markdown);
  if (report.status !== "pass") {
    console.error(`Primitive cascade activation plan failed: ${report.issues.join("; ")}`);
    process.exit(1);
  }
  console.log(JSON.stringify({
    status: report.status,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
    waves: report.inventory.activationWaves,
    debt: report.inventory.primitiveCascadeActivationPlanDebt,
  }, null, 2));
}

writeReport(createReport());
