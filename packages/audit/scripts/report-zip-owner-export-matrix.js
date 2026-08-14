#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-owner-export-matrix-audit.json");
const markdownOutput = path.join(outputDir, "zip-owner-export-matrix-audit.md");
const parityReportFile = path.join(root, "docs/audits/zip-template-parity-audit.json");
const packageFile = path.join(root, "package.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function pascalCase(id) {
  return id.split("-").map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`).join("");
}

function exists(file) {
  return fs.existsSync(path.join(root, file));
}

function uniqueOwnerRows(kits, layer) {
  const rows = new Map();
  for (const kit of kits) {
    for (const owner of kit.owners?.[layer] ?? []) {
      const current = rows.get(owner.id) ?? {
        id: owner.id,
        name: owner.name,
        layer,
        kits: [],
      };
      current.kits.push(kit.id);
      rows.set(owner.id, current);
    }
  }
  return [...rows.values()].sort((a, b) => a.id.localeCompare(b.id));
}

function componentRecord(owner, packageExports) {
  const fileBase = pascalCase(owner.id);
  const exportKey = `./react/${owner.id}`;
  const checks = {
    spec: exists(`packages/specs/specs/unison-system/artifacts/components/${owner.id}.json`),
    source: exists(`packages/react/src/${fileBase}.js`),
    sourceTypes: exists(`packages/react/src/${fileBase}.d.ts`),
    dist: exists(`packages/react/dist/${fileBase}.js`),
    distTypes: exists(`packages/react/dist/${fileBase}.d.ts`),
    packageExport: Boolean(packageExports[exportKey]),
  };
  return {
    ...owner,
    fileBase,
    exportKey,
    checks,
    missing: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key),
  };
}

function patternRecord(owner, packageExports) {
  const fileBase = pascalCase(owner.id);
  const exportKey = `./react/patterns/${owner.id}`;
  const checks = {
    spec: exists(`packages/specs/specs/unison-system/artifacts/patterns/${owner.id}.json`),
    source: exists(`packages/react/src/patterns/${fileBase}.js`),
    sourceTypes: exists(`packages/react/src/patterns/${fileBase}.d.ts`),
    dist: exists(`packages/react/dist/patterns/${fileBase}.js`),
    distTypes: exists(`packages/react/dist/patterns/${fileBase}.d.ts`),
    packageExport: Boolean(packageExports[exportKey]),
  };
  return {
    ...owner,
    fileBase,
    exportKey,
    checks,
    missing: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key),
  };
}

function templateRecord(owner, packageExports) {
  const fileBase = pascalCase(owner.id);
  const exportKey = `./react/templates/${owner.id}`;
  const checks = {
    spec: exists(`packages/specs/specs/unison-system/artifacts/templates/${owner.id}.json`),
    source: exists(`packages/react/src/templates/${fileBase}.js`),
    sourceTypes: exists(`packages/react/src/templates/${fileBase}.d.ts`),
    dist: exists(`packages/react/dist/templates/${fileBase}.js`),
    distTypes: exists(`packages/react/dist/templates/${fileBase}.d.ts`),
    packageExport: Boolean(packageExports[exportKey]),
  };
  return {
    ...owner,
    fileBase,
    exportKey,
    checks,
    missing: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key),
  };
}

function primitiveRecord(owner, packageExports) {
  const reactBacked = owner.id === "surface";
  const fileBase = pascalCase(owner.id);
  const checks = {
    spec: exists(`packages/specs/specs/unison-system/artifacts/primitives/${owner.id}.json`),
    contentContract: exists(`packages/content/content/primitive-contracts/primitives/${owner.id}.md`) || !["surface", "field-action"].includes(owner.id),
    reactExport: reactBacked ? Boolean(packageExports[`./react/${owner.id}`]) : true,
    reactSource: reactBacked ? exists(`packages/react/src/${fileBase}.js`) : true,
    reactTypes: reactBacked ? exists(`packages/react/src/${fileBase}.d.ts`) : true,
  };
  return {
    ...owner,
    reactBacked,
    checks,
    missing: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key),
  };
}

function foundationRecord(owner) {
  const checks = {
    spec: exists(`packages/specs/specs/unison-system/artifacts/foundations/${owner.id}.json`),
  };
  return {
    ...owner,
    checks,
    missing: Object.entries(checks).filter(([, value]) => !value).map(([key]) => key),
  };
}

function createReport() {
  const parity = readJson(parityReportFile);
  const packageJson = readJson(packageFile);
  const packageExports = packageJson.exports ?? {};
  const kits = parity.kits ?? [];
  const foundations = uniqueOwnerRows(kits, "foundations").map(foundationRecord);
  const primitives = uniqueOwnerRows(kits, "primitives").map((owner) => primitiveRecord(owner, packageExports));
  const components = uniqueOwnerRows(kits, "components").map((owner) => componentRecord(owner, packageExports));
  const patterns = uniqueOwnerRows(kits, "patterns").map((owner) => patternRecord(owner, packageExports));
  const templates = uniqueOwnerRows(kits, "templates").map((owner) => templateRecord(owner, packageExports));
  const allRows = [...foundations, ...primitives, ...components, ...patterns, ...templates];
  const issues = allRows.flatMap((row) => row.missing.map((missing) => `${row.layer}:${row.id} missing ${missing}.`));
  const inventory = {
    kits: kits.length,
    foundationOwners: foundations.length,
    primitiveOwners: primitives.length,
    componentOwners: components.length,
    patternOwners: patterns.length,
    templateOwners: templates.length,
    componentPackageExports: components.filter((row) => row.checks.packageExport).length,
    patternPackageExports: patterns.filter((row) => row.checks.packageExport).length,
    templatePackageExports: templates.filter((row) => row.checks.packageExport).length,
    reactBackedPrimitiveExports: primitives.filter((row) => row.reactBacked && row.checks.reactExport).length,
    missingSpecs: allRows.reduce((sum, row) => sum + (row.missing.includes("spec") ? 1 : 0), 0),
    missingReactSources: allRows.reduce((sum, row) => sum + (row.missing.includes("source") || row.missing.includes("reactSource") ? 1 : 0), 0),
    missingReactTypes: allRows.reduce((sum, row) => sum + (row.missing.includes("sourceTypes") || row.missing.includes("reactTypes") ? 1 : 0), 0),
    missingPackageExports: allRows.reduce((sum, row) => sum + (row.missing.includes("packageExport") || row.missing.includes("reactExport") ? 1 : 0), 0),
    zipOwnerExportDebt: issues.length,
  };
  return {
    status: issues.length ? "fail" : "pass",
    audit: "zip owner export matrix",
    principle: "Every Flow owner used to absorb ZIP kits must exist as a real spec, runtime, type surface, or governed primitive/foundation contract instead of only a planning label.",
    generatedAt: new Date().toISOString(),
    inventory,
    owners: {
      foundations,
      primitives,
      components,
      patterns,
      templates,
    },
    issues,
  };
}

function markdown(report) {
  const rows = Object.entries(report.owners).flatMap(([layer, owners]) => owners.map((owner) => ({
    layer,
    id: owner.id,
    kits: owner.kits.length,
    missing: owner.missing.length,
  })));
  return [
    "# ZIP owner export matrix audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Owners",
    "",
    "| Layer | Owner | Kits | Missing checks |",
    "| --- | --- | ---: | ---: |",
    ...rows.map((row) => `| ${row.layer} | ${row.id} | ${row.kits} | ${row.missing} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ].join("\n");
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-zip-owner-export-matrix.js.`);
  }
}
if (!checkMode) {
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);
}

if (report.status !== "pass") {
  throw new Error(`ZIP owner export matrix failed with ${report.issues.length} issue(s).`);
}
