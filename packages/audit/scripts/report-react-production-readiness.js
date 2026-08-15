#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-production-readiness.json");
const markdownOutput = path.join(outputDir, "react-production-readiness.md");
const reactPackagePath = path.join(root, "packages/react/package.json");
const rootPackagePath = path.join(root, "package.json");
const contractsDir = path.join(root, "packages/content/content/component-contracts/components");
const primitiveContractsDir = path.join(root, "packages/content/content/primitive-contracts/primitives");
const reactSrcDir = path.join(root, "packages/react/src");
const reactDistDir = path.join(root, "packages/react/dist");
const reactTestDir = path.join(root, "packages/react/test");
const readinessEvidencePath = path.join(root, "packages/content/content/react-production-readiness-evidence.json");

const priority = {
  p0: [
    "input",
    "text-area",
    "checkbox",
    "radio-button",
    "switch",
    "slider",
    "select",
    "combobox",
    "country-selector",
    "date-picker",
    "date-range-picker",
    "phone-input",
    "code-input",
    "card-number-input",
    "card-expiry-input",
    "card-security-code-input",
    "dialog",
    "drawer",
    "popover",
    "menu",
    "tabs",
  ],
  p1: [
    "button",
    "icon-button",
    "segmented-control",
    "pagination",
    "tree-view",
    "table",
    "list",
    "toast",
    "tooltip",
    "inline-validation",
    "error-panel",
    "empty-state",
    "quick-action",
    "floating-action-button",
    "copy-button",
    "code-block",
    "progress-indicator",
    "stepper",
  ],
};

const familyBySlug = {
  "accordion": "navigation-disclosure",
  "animated-moment": "motion-feedback",
  "audit-event": "domain-event",
  "avatar": "display-status",
  "badge": "display-status",
  "biometric-prompt": "domain-auth",
  "breadcrumbs": "navigation-disclosure",
  "button": "actions",
  "card": "surface-display",
  "card-expiry-input": "forms-payment",
  "card-number-input": "forms-payment",
  "card-security-code-input": "forms-payment",
  "card-summary": "domain-payment",
  "chart-panel": "data-display",
  "chat-composer": "domain-chat",
  "chat-message": "domain-chat",
  "chat-thread": "domain-chat",
  "checkbox": "forms",
  "chip": "display-status",
  "code-block": "documentation-code",
  "code-input": "forms",
  "combobox": "forms",
  "copy-button": "actions",
  "country-selector": "forms",
  "date-picker": "forms-date",
  "date-range-picker": "forms-date",
  "dialog": "overlays-feedback",
  "drawer": "overlays-feedback",
  "empty-state": "feedback",
  "error-panel": "feedback",
  "floating-action-button": "actions",
  "icon-button": "actions",
  "inline-validation": "feedback",
  "input": "forms",
  "input-amount": "forms-payment",
  "kpi-tile": "data-display",
  "list": "data-display",
  "menu": "overlays-feedback",
  "motion-boundary": "motion-feedback",
  "movement-row": "domain-fleet",
  "pagination": "navigation-disclosure",
  "phone-input": "forms",
  "popover": "overlays-feedback",
  "progress-indicator": "feedback",
  "quick-action": "actions",
  "radio-button": "forms",
  "route-summary": "domain-fleet",
  "segmented-control": "navigation-disclosure",
  "select": "forms",
  "skeleton": "feedback",
  "slider": "forms",
  "spinner": "feedback",
  "station-pin": "domain-fleet",
  "stepper": "progress-feedback",
  "surface": "surface-display",
  "switch": "forms",
  "table": "data-display",
  "tabs": "navigation-disclosure",
  "tag": "display-status",
  "text-area": "forms",
  "toast": "feedback",
  "tooltip": "overlays-feedback",
  "tree-view": "navigation-disclosure",
};

const requiredEvidenceByFamily = {
  actions: ["render", "props", "a11y", "callback", "disabled/prevented"],
  "data-display": ["render", "props", "a11y", "state", "keyboard when interactive"],
  "display-status": ["render", "props", "a11y", "theme/density"],
  "documentation-code": ["render", "props", "a11y", "copy interaction"],
  feedback: ["render", "props", "a11y", "state", "dismiss/action when interactive"],
  "progress-feedback": ["render", "props", "a11y", "state", "static progress semantics"],
  forms: ["render", "props", "a11y", "controlled/uncontrolled", "keyboard/input events", "disabled/invalid"],
  "forms-date": ["render", "props", "a11y", "controlled/uncontrolled", "keyboard/input events", "date constraints"],
  "forms-payment": ["render", "props", "a11y", "controlled/uncontrolled", "formatting/masking"],
  "motion-feedback": ["render", "props", "a11y", "motion preference"],
  "navigation-disclosure": ["render", "props", "a11y", "keyboard navigation", "state"],
  "overlays-feedback": ["render", "props", "a11y", "focus management", "Escape/outside close", "controlled/uncontrolled"],
  "surface-display": ["render", "props", "composition", "theme/density"],
  "domain-auth": ["render", "props", "a11y", "state", "callback"],
  "domain-chat": ["render", "props", "a11y", "state", "callback"],
  "domain-event": ["render", "props", "a11y", "state"],
  "domain-fleet": ["render", "props", "a11y", "state", "callback"],
  "domain-payment": ["render", "props", "a11y", "state"],
};

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function directReactExports() {
  const exportsMap = readJson(reactPackagePath).exports ?? {};
  return Object.entries(exportsMap)
    .filter(([key]) => key !== "." && !key.startsWith("./patterns") && !key.startsWith("./templates"))
    .map(([key, value]) => ({
      slug: key.replace(/^\.\//, ""),
      reactExport: key,
      dist: value.default,
      types: value.types,
    }))
    .sort((a, b) => a.slug.localeCompare(b.slug));
}

function rootReactExportExists(slug) {
  const rootExports = readJson(rootPackagePath).exports ?? {};
  return Boolean(rootExports[`./react/${slug}`]);
}

function componentNameFromTypeFile(typeFile) {
  return String(typeFile ?? "").split("/").pop().replace(/\.d\.ts$/, "");
}

function priorityFor(slug) {
  if (priority.p0.includes(slug)) return "P0";
  if (priority.p1.includes(slug)) return "P1";
  return "P2";
}

function testCorpus() {
  if (!fs.existsSync(reactTestDir)) return "";
  return fs.readdirSync(reactTestDir)
    .filter((file) => /\.(mjs|js|ts|tsx)$/.test(file))
    .sort()
    .map((file) => fs.readFileSync(path.join(reactTestDir, file), "utf8"))
    .join("\n");
}

function testFilesFor(componentName, slug) {
  if (!fs.existsSync(reactTestDir)) return [];
  const tokens = [componentName, slug, slug.replace(/-/g, " ")].filter(Boolean);
  return fs.readdirSync(reactTestDir)
    .filter((file) => /\.(mjs|js|ts|tsx)$/.test(file))
    .filter((file) => {
      const content = fs.readFileSync(path.join(reactTestDir, file), "utf8");
      return tokens.some((token) => content.includes(token));
    })
    .sort()
    .map((file) => rel(path.join(reactTestDir, file)));
}

function contractPathFor(slug) {
  if (slug === "surface") return path.join(primitiveContractsDir, "surface.md");
  return path.join(contractsDir, `${slug}.md`);
}

function availableTestCapabilities(corpus) {
  return {
    testingLibraryRender: (corpus.match(/\brender\(/g) ?? []).length,
    fireEvent: (corpus.match(/\bfireEvent\./g) ?? []).length,
    getByRole: (corpus.match(/\bget(?:All)?ByRole\(/g) ?? []).length,
    getByLabelText: (corpus.match(/\bget(?:All)?ByLabelText\(/g) ?? []).length,
    keyDown: (corpus.match(/\bfireEvent\.keyDown\(/g) ?? []).length,
    escapeKey: (corpus.match(/key:\s*"Escape"/g) ?? []).length,
    arrowKeys: (corpus.match(/key:\s*"Arrow/g) ?? []).length,
    userEvent: (corpus.match(/userEvent/g) ?? []).length,
    axe: (corpus.match(/jest-axe|axe-core|axe\(/g) ?? []).length,
  };
}

function readReadinessEvidence() {
  if (!fs.existsSync(readinessEvidencePath)) {
    return { schemaVersion: null, components: {}, files: [] };
  }
  const manifest = readJson(readinessEvidencePath);
  const files = unique(manifest.evidenceFiles ?? []);
  if (!files.length) {
    return { ...manifest, components: manifest.components ?? {}, files: [] };
  }
  const baseDir = path.dirname(readinessEvidencePath);
  const merged = {
    schemaVersion: manifest.schemaVersion ?? null,
    components: { ...(manifest.components ?? {}) },
    files: files.map((file) => rel(path.join(baseDir, file))),
  };
  files.forEach((file) => {
    const evidenceFilePath = path.join(baseDir, file);
    if (!fs.existsSync(evidenceFilePath)) return;
    const evidence = readJson(evidenceFilePath);
    Object.assign(merged.components, evidence.components ?? {});
  });
  return merged;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function explicitReadinessFor(slug, evidence) {
  const entry = evidence.components?.[slug] ?? null;
  if (!entry) {
    return {
      status: "unreviewed",
      evidenceFiles: [],
      coveredProductionEvidence: [],
      notes: [],
      invalidEvidenceFiles: [],
    };
  }
  const evidenceFiles = unique(entry.evidenceFiles ?? []);
  return {
    status: entry.status ?? "partial",
    evidenceFiles,
    coveredProductionEvidence: unique(entry.coveredProductionEvidence ?? []),
    notes: entry.notes ?? [],
    invalidEvidenceFiles: evidenceFiles.filter((file) => !fs.existsSync(path.join(root, file))),
  };
}

function rowStatus(row) {
  if (row.structuralIssues.length) return "blocked";
  if (row.productionReadiness.status === "blocked") return "blocked";
  if (row.productionReadiness.status === "ready" && !row.evidenceGaps.length && !row.productionReadiness.invalidEvidenceFiles.length) {
    return "ready";
  }
  return "partial";
}

function createReport() {
  const exports = directReactExports();
  const rootPackage = readJson(rootPackagePath);
  const corpus = testCorpus();
  const readinessEvidence = readReadinessEvidence();
  const rows = exports.map((item) => {
    const componentName = componentNameFromTypeFile(item.types);
    const contractPath = contractPathFor(item.slug);
    const srcPath = path.join(reactSrcDir, `${componentName}.tsx`);
    const distPath = path.join(root, "packages/react", item.dist);
    const typePath = path.join(root, "packages/react", item.types);
    const rootExport = rootReactExportExists(item.slug);
    const evidenceFiles = testFilesFor(componentName, item.slug);
    const family = familyBySlug[item.slug] ?? "unknown";
    const requiredProductionEvidence = requiredEvidenceByFamily[family] ?? ["render", "props", "a11y", "state"];
    const productionReadiness = explicitReadinessFor(item.slug, readinessEvidence);
    const structuralIssues = [];
    if (!rootExport) structuralIssues.push("missing root ./react subpath export");
    if (!fs.existsSync(srcPath)) structuralIssues.push("missing React TSX source");
    if (!fs.existsSync(distPath)) structuralIssues.push("missing built JS artifact");
    if (!fs.existsSync(typePath)) structuralIssues.push("missing built declaration artifact");
    const contract = fs.existsSync(contractPath);
    const evidenceGaps = [];
    if (!contract) evidenceGaps.push("missing component contract");
    if (!evidenceFiles.length) evidenceGaps.push("missing direct test evidence");
    const missingProductionEvidence = requiredProductionEvidence.filter((requirement) => !productionReadiness.coveredProductionEvidence.includes(requirement));
    if (productionReadiness.status !== "ready") evidenceGaps.push("family-specific production checks not yet certified");
    evidenceGaps.push(...missingProductionEvidence.map((requirement) => `missing production evidence: ${requirement}`));
    evidenceGaps.push(...productionReadiness.invalidEvidenceFiles.map((file) => `invalid readiness evidence file: ${file}`));
    const row = {
      slug: item.slug,
      component: componentName,
      priority: priorityFor(item.slug),
      family,
      status: "partial",
      evidence: {
        reactExport: item.reactExport,
        rootExport,
        source: fs.existsSync(srcPath) ? rel(srcPath) : null,
        dist: fs.existsSync(distPath) ? rel(distPath) : null,
        types: fs.existsSync(typePath) ? rel(typePath) : null,
        contract: contract ? rel(contractPath) : null,
        tests: evidenceFiles,
      },
      requiredProductionEvidence,
      productionReadiness,
      structuralIssues,
      evidenceGaps,
    };
    row.status = rowStatus(row);
    return row;
  });
  const missingPrioritySlugs = [...priority.p0, ...priority.p1].filter((slug) => !rows.some((row) => row.slug === slug));
  const inventory = {
    publicReactComponents: rows.length,
    readyComponents: rows.filter((row) => row.status === "ready").length,
    partialComponents: rows.filter((row) => row.status === "partial").length,
    blockedComponents: rows.filter((row) => row.status === "blocked").length,
    unknownComponents: rows.filter((row) => row.status === "unknown").length,
    p0Components: rows.filter((row) => row.priority === "P0").length,
    p1Components: rows.filter((row) => row.priority === "P1").length,
    p2Components: rows.filter((row) => row.priority === "P2").length,
    missingContracts: rows.filter((row) => row.evidence.contract === null).length,
    missingDirectTestEvidence: rows.filter((row) => !row.evidence.tests.length).length,
    structuralIssues: rows.reduce((total, row) => total + row.structuralIssues.length, 0),
    invalidReadinessEvidenceFiles: rows.reduce((total, row) => total + row.productionReadiness.invalidEvidenceFiles.length, 0),
    missingPrioritySlugs: missingPrioritySlugs.length,
    reactProductionReadinessHarnessDebt: 0,
  };
  const harnessIssues = [];
  if (inventory.publicReactComponents !== 63) harnessIssues.push(`expected 63 direct public React components, found ${inventory.publicReactComponents}`);
  if (inventory.structuralIssues) harnessIssues.push(`${inventory.structuralIssues} structural component issues found`);
  if (inventory.invalidReadinessEvidenceFiles) harnessIssues.push(`${inventory.invalidReadinessEvidenceFiles} readiness evidence file references are invalid`);
  if (missingPrioritySlugs.length) harnessIssues.push(`priority list references missing components: ${missingPrioritySlugs.join(", ")}`);
  inventory.reactProductionReadinessHarnessDebt = harnessIssues.length;
  return {
    status: harnessIssues.length ? "fail" : "pass",
    audit: "react production readiness",
    planIteration: 1,
    principle: "Production readiness is not inferred from visual parity or TS build success; every public React component needs explicit API, runtime, interaction, accessibility, and family-specific evidence.",
    scope: {
      includes: "Direct public React component subpath exports only.",
      excludes: "Patterns, templates, docs shells, visual parity, and route-level documentation behavior.",
    },
    policy: {
      readyRequires: [
        "public export and root export",
        "TSX source",
        "built JS artifact",
        "built declaration artifact",
        "component contract",
        "direct test evidence",
        "family-specific runtime/API/a11y/keyboard/state evidence",
      ],
      currentCertificationMode: "tooling harness active; components become ready only with explicit per-component evidence.",
      toolingDecision: {
        userEvent: rootPackage.devDependencies?.["@testing-library/user-event"] ?? null,
        axeCore: rootPackage.devDependencies?.["axe-core"] ?? null,
        fireEvent: rootPackage.devDependencies?.["@testing-library/react"] ?? null,
        colorContrastInJsdom: "disabled; JSDOM lacks reliable canvas-backed contrast evaluation",
      },
    },
    inventory,
    readinessEvidence: {
      manifest: rel(readinessEvidencePath),
      files: readinessEvidence.files ?? [],
    },
    testCapabilities: availableTestCapabilities(corpus),
    harnessIssues,
    missingPrioritySlugs,
    components: rows,
  };
}

function toMarkdown(report) {
  const rows = report.components.map((row) => [
    row.slug,
    row.component,
    row.priority,
    row.family,
    row.status,
    row.evidence.contract ? "yes" : "no",
    row.evidence.tests.length,
    row.evidenceGaps.join("; ") || "None",
    row.structuralIssues.join("; ") || "None",
  ].map((cell) => String(cell).replace(/\|/g, "\\|")).join(" | "));
  return [
    "# React Production Readiness",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    `- Plan iteration: ${report.planIteration}`,
    `- Public React components: ${report.inventory.publicReactComponents}`,
    `- Ready components: ${report.inventory.readyComponents}`,
    `- Partial components: ${report.inventory.partialComponents}`,
    `- Blocked components: ${report.inventory.blockedComponents}`,
    `- P0 components: ${report.inventory.p0Components}`,
    `- P1 components: ${report.inventory.p1Components}`,
    `- P2 components: ${report.inventory.p2Components}`,
    `- Missing contracts: ${report.inventory.missingContracts}`,
    `- Missing direct test evidence: ${report.inventory.missingDirectTestEvidence}`,
    `- Structural issues: ${report.inventory.structuralIssues}`,
    `- React production readiness harness debt: ${report.inventory.reactProductionReadinessHarnessDebt}`,
    "",
    "## Test Capability Snapshot",
    "",
    `- Testing Library render calls: ${report.testCapabilities.testingLibraryRender}`,
    `- fireEvent calls: ${report.testCapabilities.fireEvent}`,
    `- getByRole calls: ${report.testCapabilities.getByRole}`,
    `- getByLabelText calls: ${report.testCapabilities.getByLabelText}`,
    `- keyDown calls: ${report.testCapabilities.keyDown}`,
    `- Escape key checks: ${report.testCapabilities.escapeKey}`,
    `- Arrow key checks: ${report.testCapabilities.arrowKeys}`,
    `- user-event usage: ${report.testCapabilities.userEvent}`,
    `- axe usage: ${report.testCapabilities.axe}`,
    "",
    "## Harness Issues",
    "",
    ...(report.harnessIssues.length ? report.harnessIssues.map((issue) => `- ${issue}`) : ["- None"]),
    "",
    "## Component Matrix",
    "",
    "| Slug | Component | Priority | Family | Status | Contract | Test files | Evidence gaps | Structural issues |",
    "| --- | --- | --- | --- | --- | --- | ---: | --- | --- |",
    ...rows.map((row) => `| ${row} |`),
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
      console.error("React production readiness report is stale. Run: node packages/audit/scripts/report-react-production-readiness.js");
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    publicReactComponents: report.inventory.publicReactComponents,
    readyComponents: report.inventory.readyComponents,
    partialComponents: report.inventory.partialComponents,
    missingContracts: report.inventory.missingContracts,
    missingDirectTestEvidence: report.inventory.missingDirectTestEvidence,
    reactProductionReadinessHarnessDebt: report.inventory.reactProductionReadinessHarnessDebt,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

if (require.main === module) {
  main();
}

module.exports = { createReport };
