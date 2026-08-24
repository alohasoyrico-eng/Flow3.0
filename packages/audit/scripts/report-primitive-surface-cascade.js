#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
} = require("./audit-context.js");
const { readPatternArchitecturePolicy } = require("./pattern-architecture-policy.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-surface-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-surface-cascade-audit.md");
const artifactFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/surface.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/surface.md");
const sourceFile = path.join(root, "packages/react/src/Surface.js");
const typesFile = path.join(root, "packages/react/src/Surface.d.ts");
const distFile = path.join(root, "packages/react/dist/Surface.js");
const distTypesFile = path.join(root, "packages/react/dist/Surface.d.ts");
const componentCssFile = path.join(root, "packages/components/styles/components.css");
const reactPatternDir = path.join(root, "packages/react/src/patterns");

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function listFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(file, predicate);
    return predicate(file) ? [file] : [];
  }).sort();
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function quotedTypeMembers(types, typeName) {
  const match = types.match(new RegExp(`export type ${typeName} = ([^;]+);`));
  if (!match) return [];
  return [...match[1].matchAll(/"([^"]+)"/g)].map((item) => item[1]).sort();
}

function createReport() {
  const artifact = fs.existsSync(artifactFile) ? readJson(artifactFile).artifacts?.primitives?.surface : null;
  const markdown = read(contractFile);
  const source = read(sourceFile);
  const types = read(typesFile);
  const dist = read(distFile);
  const distTypes = read(distTypesFile);
  const css = read(componentCssFile);
  const patternPolicy = readPatternArchitecturePolicy();
  const roles = (artifact?.roles ?? []).map((role) => role.id).sort();
  const states = (artifact?.states ?? []).sort();
  const apiProps = artifact?.api?.props ?? [];
  const apiOutputs = artifact?.api?.outputs ?? [];
  const tokenDependencies = artifact?.tokenDependencies ?? [];
  const reactSurfaceProps = [
    ...new Set([...types.matchAll(/^\s+([a-z][A-Za-z0-9]*)\??:/gm)].map((match) => match[1])),
  ].sort();
  const propAliases = { role: "surfaceRole" };
  const missingReactProps = apiProps
    .filter((prop) => !reactSurfaceProps.includes(propAliases[prop] ?? prop));
  const roleTypeMembers = quotedTypeMembers(types, "SurfaceRole");
  const stateTypeMembers = quotedTypeMembers(types, "SurfaceState");
  const missingTypeRoles = roles.filter((role) => !roleTypeMembers.includes(role));
  const missingTypeStates = states.filter((state) => !stateTypeMembers.includes(state));
  const missingRuntimeRoles = roles.filter((role) => !source.includes(`"${role}"`));
  const missingRuntimeStates = states.filter((state) => !source.includes(`"${state}"`));
  const missingCssRoleSelectors = roles.filter((role) => !new RegExp(`\\.surface\\[data-surface-role="${escapeRegExp(role)}"\\]`).test(css));
  const missingCssStateSelectors = states.filter((state) => state !== "default" && !new RegExp(`\\.surface\\[data-state="${escapeRegExp(state)}"\\]`).test(css));
  const missingTokenDependencies = tokenDependencies.filter((token) => {
    const normalized = token.replace(/\.\*/g, "").replace(/\*/g, "");
    if (token.endsWith(".*") || token.endsWith("*")) {
      return !(markdown.includes(token) && css.includes(normalized.replace(/\./g, "-")));
    }
    return !(markdown.includes(token) && css.includes(token.replace(/\./g, "-")));
  });
  const requiredSourceSnippets = [
    "forwardRef(function Surface",
    "flowRestProps(rest)",
    "flowDensityProps(resolvedDensity)",
    "flowStateProps(resolvedState)",
    '"data-flow-primitive": "surface"',
    '"data-surface-role": resolvedSurfaceRole',
    '"data-surface-elevation": resolvedElevation',
    '"data-surface-tone": resolvedTone',
    '"data-surface-focus-mode": resolvedFocusMode',
    '"data-surface-breakpoint": resolvedBreakpoint',
  ];
  const missingSourceSnippets = requiredSourceSnippets.filter((snippet) => !source.includes(snippet));
  const requiredTypeSnippets = [
    "ForwardRefExoticComponent",
    "RefAttributes<HTMLDivElement>",
    "FlowDataAttributes",
    "SurfaceElevation",
    "SurfaceTone",
    "SurfaceFocusMode",
    "SurfaceBreakpoint",
  ];
  const missingTypeSnippets = requiredTypeSnippets.filter((snippet) => !types.includes(snippet));
  const requiredCssSelectors = [
    ".surface",
    '.surface[data-surface-elevation="raised"]',
    '.surface[data-surface-tone="selected"]',
    '.surface[data-surface-focus-mode="within"]:focus-within',
    '.surface[data-surface-breakpoint="sm"]',
  ];
  const missingCssSelectors = requiredCssSelectors.filter((selector) => !css.includes(selector));
  const rawVisualCss = [...css.matchAll(/\.surface[\s\S]{0,220}\b(?:#[0-9a-f]{3,8}|rgba?\(|hsla?\(|box-shadow:\s*(?!var\())/gi)]
    .map((match) => match[0].split(/\r?\n/)[0]);
  const patternFiles = listFiles(reactPatternDir, (file) => /^[A-Z].*\.js$/.test(path.basename(file)));
  const patternSourceFiles = listFiles(reactPatternDir, (file) => /^[A-Z].*\.(?:js|ts)$/.test(path.basename(file)));
  const patternSurfaceImports = patternFiles.filter((file) => read(file).includes('import { Surface } from "../Surface.js"')).length;
  const structuralCardContextIssues = patternSourceFiles.flatMap((file) => {
    const body = read(file);
    const issues = [];
    if (/"data-settings-group":\s*group\.key,[\s\S]{0,520}React\.createElement\(Card/.test(body)) {
      issues.push(`${rel(file)} uses Card inside a settings group Surface; group headers and structural settings sections must stay owned by Surface/Settings.`);
    }
    return issues;
  });
  const structuralSurfacePolicyIssues = [
    ...(patternPolicy.structuralSurfacePrimitive === "Surface" ? [] : ["pattern policy structuralSurfacePrimitive must be Surface"]),
    ...(patternPolicy.structuralSurfaceForbiddenCopyComponents.has("Card") ? [] : ["pattern policy must forbid Card as structural Surface copy wrapper"]),
    ...(patternPolicy.structuralSurfaceForbiddenCopyComponents.has("List") ? [] : ["pattern policy must forbid List as structural Surface copy wrapper"]),
    ...structuralCardContextIssues,
  ];
  const distGaps = [
    ...(!dist.includes('"data-flow-primitive": "surface"') ? ["dist Surface.js missing primitive data attribute"] : []),
    ...(!distTypes.includes("SurfaceFocusMode") ? ["dist Surface.d.ts missing expanded Surface API"] : []),
  ];
  const gaps = [
    ...(!artifact ? ["surface primitive artifact is missing"] : []),
    ...missingReactProps.map((prop) => `Surface React API missing contract prop ${prop}`),
    ...missingTypeRoles.map((role) => `SurfaceRole type missing ${role}`),
    ...missingTypeStates.map((state) => `SurfaceState type missing ${state}`),
    ...missingRuntimeRoles.map((role) => `Surface runtime role normalizer missing ${role}`),
    ...missingRuntimeStates.map((state) => `Surface runtime state normalizer missing ${state}`),
    ...missingCssRoleSelectors.map((role) => `Surface CSS missing role selector ${role}`),
    ...missingCssStateSelectors.map((state) => `Surface CSS missing state selector ${state}`),
    ...missingTokenDependencies.map((token) => `Surface CSS/contract missing token dependency ${token}`),
    ...missingSourceSnippets.map((snippet) => `Surface source missing ${snippet}`),
    ...missingTypeSnippets.map((snippet) => `Surface types missing ${snippet}`),
    ...missingCssSelectors.map((selector) => `Surface CSS missing ${selector}`),
    ...rawVisualCss.map((snippet) => `Surface CSS uses raw visual value near ${snippet}`),
    ...structuralSurfacePolicyIssues,
    ...distGaps,
  ];
  return {
    status: gaps.length ? "fail" : "pass",
    audit: "primitive surface cascade",
    principle: "Surface owns structural grouping, background, density, elevation, focus, and breakpoint cascade as a primitive so patterns do not use Card or local CSS as layout structure.",
    inventory: {
      artifactPresent: artifact ? 1 : 0,
      roles: roles.length,
      states: states.length,
      governingFoundations: artifact?.governingFoundations?.length ?? 0,
      coordinatedPrimitives: artifact?.coordinatesPrimitives?.length ?? 0,
      apiProps: apiProps.length,
      reactProps: reactSurfaceProps.length,
      missingReactProps: missingReactProps.length,
      apiOutputs: apiOutputs.length,
      tokenDependencies: tokenDependencies.length,
      missingTokenDependencies: missingTokenDependencies.length,
      missingTypeRoles: missingTypeRoles.length,
      missingTypeStates: missingTypeStates.length,
      missingRuntimeRoles: missingRuntimeRoles.length,
      missingRuntimeStates: missingRuntimeStates.length,
      missingCssRoleSelectors: missingCssRoleSelectors.length,
      missingCssStateSelectors: missingCssStateSelectors.length,
      missingSourceSnippets: missingSourceSnippets.length,
      missingTypeSnippets: missingTypeSnippets.length,
      missingCssSelectors: missingCssSelectors.length,
      rawVisualCss: rawVisualCss.length,
      patternSurfaceImports,
      structuralCardContextIssues: structuralCardContextIssues.length,
      structuralSurfacePolicyIssues: structuralSurfacePolicyIssues.length,
      distGaps: distGaps.length,
      surfaceCascadeDebt: gaps.length,
    },
    contract: {
      artifact: rel(artifactFile),
      markdown: rel(contractFile),
      source: rel(sourceFile),
      types: rel(typesFile),
      css: rel(componentCssFile),
    },
    roles: { required: roles, typeMembers: roleTypeMembers, missingTypeRoles, missingRuntimeRoles, missingCssRoleSelectors },
    states: { required: states, typeMembers: stateTypeMembers, missingTypeStates, missingRuntimeStates, missingCssStateSelectors },
    api: { requiredProps: apiProps, reactProps: reactSurfaceProps, missingReactProps, outputs: apiOutputs },
    tokenDependencies: { required: tokenDependencies, missing: missingTokenDependencies },
    gaps,
  };
}

function toMarkdown(report) {
  const inventoryRows = Object.entries(report.inventory).map(([key, value]) => `| ${key} | ${value} |`);
  const gapRows = report.gaps.map((gap) => `| ${gap} |`);
  return [
    "# Primitive Surface Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    "| Metric | Value |",
    "| --- | ---: |",
    ...inventoryRows,
    "",
    "## Gaps",
    "",
    "| Gap |",
    "| --- |",
    ...(gapRows.length ? gapRows : ["| None |"]),
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
      console.error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-primitive-surface-cascade.js.`);
      process.exit(1);
    }
  } else {
    writeReport(report);
  }
  console.log(JSON.stringify({
    status: report.status,
    audit: report.audit,
    inventory: report.inventory,
    json: rel(jsonOutput),
    markdown: rel(markdownOutput),
  }, null, 2));
  if (report.status !== "pass") process.exitCode = 1;
}

main();
