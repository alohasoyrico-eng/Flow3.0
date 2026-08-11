#!/usr/bin/env node

import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  fs,
  path,
  rel,
  root,
  slug,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "react-template-composition-governance-audit.json");
const markdownOutput = path.join(outputDir, "react-template-composition-governance-audit.md");
const templateDir = path.join(root, "packages/specs/specs/unison-system/artifacts/templates");
const reactTemplateDir = path.join(root, "packages/react/src/templates");

const moduleAliases = {
  "card-hero-with-limits": ["mobile-card-overview"],
  "nearby-station-shortcut": ["routes-and-nearby-stations-mobile"],
};

const allowedSupportModules = {
  "configuration-console": {
    "authentication-gate": "Authentication, Login, Biometrics and OTP pattern owns the permission recovery gate.",
  },
  "driver-card-wallet": {
    "wallet-navigation": "Template shell navigation for module-only wallet sections.",
  },
  "driver-mobile-app": {
    "mobile-navigation": "Template shell navigation for app tabs.",
    "driver-readiness-onboarding": "Driver Onboarding Mobile pattern owns onboarding readiness.",
  },
  "fleet-manager-desktop": {
    "cost-center-scope-permissions": "Roles and Permissions pattern owns permission-scoped fleet filters.",
  },
  "routes-and-stations": {
    "routes-and-nearby-stations-mobile": "Template shell handoff for Station Discovery context.",
  },
};

const allowedDirectComponents = {
  "agent-workspace": ["Badge", "Button", "ChatComposer", "ChatThread"],
  "driver-card-wallet": ["CardSummary", "MovementRow", "QuickAction"],
  "settings-workspace": ["Tabs"],
};

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function pascalCase(value) {
  return String(value)
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function artifactRecords() {
  return fs.readdirSync(templateDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => {
      const id = file.replace(/\.json$/, "");
      const json = readJson(path.join(templateDir, file));
      return {
        id,
        file: path.join(templateDir, file),
        raw: json.artifacts?.templates?.[id] ?? {},
      };
    });
}

function importRows(source) {
  return [...source.matchAll(/import\s+\{\s*([A-Z][A-Za-z0-9]+)\s*\}\s+from\s+"([^"]+)"/g)]
    .map((match) => ({ name: match[1], from: match[2] }));
}

function runtimeModules(source) {
  return [...source.matchAll(/"data-template-module"\s*:\s*"([^"]+)"/g)]
    .map((match) => match[1])
    .filter((value, index, all) => all.indexOf(value) === index)
    .sort();
}

function expectedModuleIds(template) {
  return (template.modules ?? [])
    .flatMap((name) => moduleAliases[slug(name)] ?? [slug(name)])
    .sort();
}

const rows = artifactRecords().map((record) => {
  const componentName = pascalCase(record.id);
  const sourceFile = path.join(reactTemplateDir, `${componentName}.js`);
  const source = read(sourceFile);
  const imports = importRows(source);
  const patternImports = imports
    .filter((item) => item.from.startsWith("../patterns/"))
    .map((item) => item.name)
    .sort();
  const directComponentImports = imports
    .filter((item) => item.from.startsWith("../") && item.from !== "../Surface.js" && !item.from.startsWith("../patterns/"))
    .map((item) => item.name)
    .sort();
  const expectedPatterns = (record.raw.patternDependencies ?? []).map((name) => pascalCase(slug(name))).sort();
  const expectedModules = expectedModuleIds(record.raw);
  const observedModules = runtimeModules(source);
  const supportModules = Object.keys(allowedSupportModules[record.id] ?? {}).sort();
  const allowedModuleIds = [...new Set([...expectedModules, ...supportModules])].sort();
  const allowedComponents = allowedDirectComponents[record.id] ?? [];
  const missingPatterns = expectedPatterns.filter((name) => !patternImports.includes(name));
  const undeclaredPatterns = patternImports.filter((name) => !expectedPatterns.includes(name));
  const missingModules = expectedModules.filter((name) => !observedModules.includes(name));
  const undeclaredModules = observedModules.filter((name) => !allowedModuleIds.includes(name));
  const unapprovedComponents = directComponentImports.filter((name) => !allowedComponents.includes(name));
  const missingSurface = (record.raw.primitiveDependencies ?? []).map(slug).includes("surface")
    && !imports.some((item) => item.name === "Surface" && item.from === "../Surface.js");
  const issues = [
    ...(source ? [] : [`Missing React template source ${rel(sourceFile)}.`]),
    ...missingPatterns.map((name) => `Missing declared pattern import ${name}.`),
    ...undeclaredPatterns.map((name) => `Undeclared pattern import ${name}.`),
    ...missingModules.map((name) => `Missing formal module marker ${name}.`),
    ...undeclaredModules.map((name) => `Runtime module marker is not formal or approved support: ${name}.`),
    ...unapprovedComponents.map((name) => `Unapproved direct component import ${name}.`),
    ...(missingSurface ? ["Template declares Surface primitive but does not import Surface."] : []),
  ];
  return {
    id: record.id,
    componentName,
    source: rel(sourceFile),
    formalPatterns: expectedPatterns,
    runtimePatternImports: patternImports,
    formalModules: expectedModules,
    approvedSupportModules: supportModules.map((id) => ({
      id,
      reason: allowedSupportModules[record.id][id],
    })),
    runtimeModules: observedModules,
    directComponentImports,
    approvedDirectComponentImports: allowedComponents,
    issues,
  };
});

const issues = rows.flatMap((row) => row.issues.map((issue) => `${row.id}: ${issue}`));
const inventory = {
  templatesAudited: rows.length,
  templatesWithPassingComposition: rows.filter((row) => row.issues.length === 0).length,
  formalPatternDependencies: rows.reduce((sum, row) => sum + row.formalPatterns.length, 0),
  runtimePatternImports: rows.reduce((sum, row) => sum + row.runtimePatternImports.length, 0),
  missingDeclaredPatternImports: rows.reduce((sum, row) => sum + row.issues.filter((issue) => issue.startsWith("Missing declared pattern import")).length, 0),
  undeclaredPatternImports: rows.reduce((sum, row) => sum + row.issues.filter((issue) => issue.startsWith("Undeclared pattern import")).length, 0),
  formalModuleMarkers: rows.reduce((sum, row) => sum + row.formalModules.length, 0),
  approvedSupportModuleMarkers: rows.reduce((sum, row) => sum + row.approvedSupportModules.length, 0),
  runtimeModuleMarkers: rows.reduce((sum, row) => sum + row.runtimeModules.length, 0),
  missingFormalModuleMarkers: rows.reduce((sum, row) => sum + row.issues.filter((issue) => issue.startsWith("Missing formal module marker")).length, 0),
  undeclaredRuntimeModuleMarkers: rows.reduce((sum, row) => sum + row.issues.filter((issue) => issue.startsWith("Runtime module marker")).length, 0),
  directComponentImports: rows.reduce((sum, row) => sum + row.directComponentImports.length, 0),
  unapprovedDirectComponentImports: rows.reduce((sum, row) => sum + row.issues.filter((issue) => issue.startsWith("Unapproved direct component import")).length, 0),
  surfacePrimitiveImports: rows.filter((row) => !row.issues.includes("Template declares Surface primitive but does not import Surface.")).length,
  compositionContractGaps: issues.length,
  reactTemplateCompositionGovernanceDebt: issues.length,
};

const report = {
  status: issues.length ? "fail" : "pass",
  audit: "react template composition governance",
  principle: "React templates must derive runtime composition from formal template artifacts: pattern imports, module markers, Surface primitive ownership, and approved direct component exceptions must stay explicit.",
  generatedAt: new Date().toISOString(),
  inventory,
  templates: rows,
  issues,
};

function markdown(report) {
  const lines = [
    "# React template composition governance audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Templates",
    "",
    "| Template | Patterns | Modules | Support modules | Direct components | Issues |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
    ...report.templates.map((row) => `| ${row.id} | ${row.runtimePatternImports.length}/${row.formalPatterns.length} | ${row.runtimeModules.length}/${row.formalModules.length} | ${row.approvedSupportModules.length} | ${row.directComponentImports.length}/${row.approvedDirectComponentImports.length} | ${row.issues.length} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ];
  return `${lines.join("\n")}\n`;
}

fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-react-template-composition-governance.mjs.`);
  }
}
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, markdown(report));

if (report.status !== "pass") {
  throw new Error(`React template composition governance failed with ${issues.length} issue(s).`);
}

console.log(JSON.stringify({
  status: report.status,
  check: "react template composition governance",
  inventory: report.inventory,
}, null, 2));
