#!/usr/bin/env node

const {
  docsStyleModuleFiles,
  fs,
  path,
  read,
  readJson,
  resolveBoundaryPath,
  root,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "primitive-breakpoints-cascade-audit.json");
const markdownOutput = path.join(outputDir, "primitive-breakpoints-cascade-audit.md");
const tokenCssFile = resolveBoundaryPath("#design-system/tokens-css", "packages/tokens/styles/tokens.css");
const componentCssFile = resolveBoundaryPath("#design-system/components-css", "packages/components/styles/components.css");
const specFile = path.join(root, "packages/specs/specs/unison-system/artifacts/primitives/breakpoints.json");
const contractFile = path.join(root, "packages/content/content/primitive-contracts/primitives/breakpoints.md");
const foundationReports = {
  frame: path.join(root, "docs/audits/foundation-frame-cascade-audit.json"),
  accessibility: path.join(root, "docs/audits/foundation-accessibility-cascade-audit.json"),
};
const coordinatedPrimitiveReports = {
  density: path.join(root, "docs/audits/primitive-density-cascade-audit.json"),
  spacing: path.join(root, "docs/audits/primitive-spacing-cascade-audit.json"),
};

const requiredRoles = ["mobile", "tablet", "laptop", "desktop"];
const requiredFoundations = ["Frame", "Accessibility"];
const requiredCoordinatedPrimitives = ["Density", "Spacing"];
const requiredTokenAliases = [
  "--sys-frame-breakpoint-sm",
  "--sys-frame-breakpoint-shell-sidebar",
  "--sys-frame-breakpoint-md",
  "--sys-frame-breakpoint-lg",
  "--sys-frame-breakpoint-xl",
  "--sys-breakpoint-mobile",
  "--sys-breakpoint-tablet",
  "--sys-breakpoint-laptop",
  "--sys-breakpoint-desktop",
  "--sys-breakpoint-wide",
];
const approvedMediaValues = new Map([
  ["420px", "compact handheld breakpoint"],
  ["480px", "phone content breakpoint"],
  ["520px", "component narrow viewport breakpoint"],
  ["575px", "mobile max before tablet"],
  ["576px", "tablet min from Frame sm"],
  ["620px", "compact content breakpoint"],
  ["640px", "pattern compact breakpoint"],
  ["720px", "navigation compact breakpoint"],
  ["760px", "split review breakpoint"],
  ["767px", "tablet max before larger layouts"],
  ["840px", "desktop demo narrow breakpoint"],
  ["861px", "shell sidebar min breakpoint"],
  ["900px", "docs two-column breakpoint"],
  ["980px", "pattern overview breakpoint"],
  ["992px", "laptop min from Frame md"],
  ["1024px", "desktop demo min breakpoint"],
  ["1180px", "shell compact breakpoint"],
  ["1280px", "spacious viewport breakpoint"],
  ["1439px", "wide max before desktop density"],
  ["32.5rem", "table narrow breakpoint"],
  ["52rem", "choice control stacked breakpoint"],
]);

function rel(file) {
  return path.relative(root, file);
}

function readIfExists(file) {
  return fs.existsSync(file) ? read(file) : "";
}

function lineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

function collectDeclarations(css) {
  const map = new Map();
  for (const match of css.matchAll(/(?<name>--[a-z0-9-]+)\s*:\s*(?<value>[^;]+);/g)) {
    if (!map.has(match.groups.name)) map.set(match.groups.name, match.groups.value.trim());
  }
  return map;
}

function collectMediaQueries(files) {
  const mediaQueries = [];
  const unapproved = [];
  for (const file of files) {
    const source = readIfExists(file);
    let match;
    const mediaPattern = /@media\s*(?<query>[^{]+)/g;
    while ((match = mediaPattern.exec(source))) {
      const query = match.groups.query.trim();
      const values = [...query.matchAll(/\b\d+(?:\.\d+)?(?:px|rem)\b/g)].map((valueMatch) => valueMatch[0]);
      const entry = {
        file: rel(file),
        line: lineNumber(source, match.index),
        query,
        values,
      };
      mediaQueries.push(entry);
      for (const value of values) {
        if (!approvedMediaValues.has(value)) {
          unapproved.push({ ...entry, value });
        }
      }
    }
  }
  return { mediaQueries, unapproved };
}

function foundationStatus(file) {
  const report = fs.existsSync(file) ? readJson(file) : null;
  return report?.status ?? "missing";
}

const tokenCss = readIfExists(tokenCssFile);
const componentCss = readIfExists(componentCssFile);
const tokenDeclarations = collectDeclarations(tokenCss);
const specWrapper = readJson(specFile);
const spec = specWrapper.artifacts?.primitives?.breakpoints ?? specWrapper;
const contractSource = readIfExists(contractFile);
const roles = (spec.roles ?? []).map((role) => role.id);
const foundations = spec.governingFoundations ?? [];
const coordinatedPrimitives = spec.coordinatesPrimitives ?? [];
const { mediaQueries, unapproved } = collectMediaQueries([componentCssFile, ...docsStyleModuleFiles]);
const foundationGate = Object.fromEntries(
  Object.entries(foundationReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);
const primitiveGate = Object.fromEntries(
  Object.entries(coordinatedPrimitiveReports).map(([name, file]) => [name, { status: foundationStatus(file) }]),
);

const tokenAliases = {
  required: requiredTokenAliases,
  present: requiredTokenAliases.filter((token) => tokenDeclarations.has(token)),
  missing: requiredTokenAliases.filter((token) => !tokenDeclarations.has(token)),
};
const componentSignals = {
  mediaQueryCount: mediaQueries.filter((query) => query.file === rel(componentCssFile)).length,
  containerQueryCount: (componentCss.match(/@container\s/g) ?? []).length,
};

const gaps = [];
const missingRoles = requiredRoles.filter((role) => !roles.includes(role));
const missingFoundations = requiredFoundations.filter((foundation) => !foundations.includes(foundation));
const missingCoordinatedPrimitives = requiredCoordinatedPrimitives.filter(
  (primitive) => !coordinatedPrimitives.includes(primitive),
);
if (!contractSource.includes("Breakpoints sits between foundations and components")) {
  gaps.push("Primitive contract must state the Breakpoints bridge role.");
}
if (missingRoles.length) gaps.push(`Missing primitive roles: ${missingRoles.join(", ")}.`);
if (missingFoundations.length) gaps.push(`Missing governing foundations: ${missingFoundations.join(", ")}.`);
if (missingCoordinatedPrimitives.length) {
  gaps.push(`Missing coordinated primitives: ${missingCoordinatedPrimitives.join(", ")}.`);
}
if (tokenAliases.missing.length) gaps.push(`Missing sys-breakpoint aliases: ${tokenAliases.missing.join(", ")}.`);
if (!componentSignals.mediaQueryCount && !componentSignals.containerQueryCount) {
  gaps.push("Component CSS has no responsive or container-query signal.");
}
if (unapproved.length) gaps.push(`Unapproved media query breakpoint values: ${unapproved.length}.`);
for (const [name, gate] of Object.entries(foundationGate)) {
  if (gate.status !== "pass") gaps.push(`Foundation gate is not pass: ${name} is ${gate.status}.`);
}

const report = {
  status: gaps.length ? "fail" : "pass",
  primitive: "Breakpoints",
  principle: "Breakpoints consumes Frame and Accessibility, coordinates Density and Spacing, exposes named responsive tiers, and governs CSS media-query literals through an approved breakpoint registry because CSS custom properties cannot be used in media conditions.",
  gaps,
  roles: { required: requiredRoles, present: roles, missing: missingRoles },
  governingFoundations: { required: requiredFoundations, present: foundations, missing: missingFoundations },
  coordinatedPrimitives: {
    required: requiredCoordinatedPrimitives,
    present: coordinatedPrimitives,
    missing: missingCoordinatedPrimitives,
  },
  tokenAliases,
  approvedMediaValues: Object.fromEntries(approvedMediaValues),
  review: {
    mediaQueryCount: mediaQueries.length,
    unapproved,
    sampleMediaQueries: mediaQueries.slice(0, 24),
  },
  componentSignals,
  foundationGate,
  primitiveGate,
};

function writeReport() {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
  const json = `${JSON.stringify(report, null, 2)}\n`;
  const markdown = [
    "# Primitive Breakpoints Cascade Audit",
    "",
    `Status: **${report.status}**`,
    "",
    report.principle,
    "",
    "## Gaps",
    ...(report.gaps.length ? report.gaps.map((gap) => `- ${gap}`) : ["- None"]),
    "",
    "## Signals",
    `- Roles: ${report.roles.present.length}/${report.roles.required.length}`,
    `- Coordinated primitives: ${report.coordinatedPrimitives.present.length}/${report.coordinatedPrimitives.required.length}`,
    `- Token aliases: ${report.tokenAliases.present.length}/${report.tokenAliases.required.length}`,
    `- Media queries audited: ${report.review.mediaQueryCount}`,
    `- Unapproved media query values: ${report.review.unapproved.length}`,
    `- Component media/container signals: ${report.componentSignals.mediaQueryCount}/${report.componentSignals.containerQueryCount}`,
    "",
    "## Foundation Gate",
    ...Object.entries(report.foundationGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
    "",
    "## Primitive Gate",
    ...Object.entries(report.primitiveGate).map(([name, gate]) => `- ${name}: ${gate.status}`),
  ].join("\n");

  if (checkMode) {
    if (readIfExists(jsonOutput) !== json || readIfExists(markdownOutput) !== `${markdown}\n`) {
      console.error("Primitive Breakpoints cascade audit is stale. Run npm run audit:primitive:breakpoints.");
      process.exit(1);
    }
    if (report.status !== "pass") {
      console.error(`Primitive Breakpoints cascade audit failed: ${report.gaps.join("; ")}`);
      process.exit(1);
    }
    return;
  }

  fs.writeFileSync(jsonOutput, json);
  fs.writeFileSync(markdownOutput, `${markdown}\n`);
  if (report.status !== "pass") {
    console.error(`Primitive Breakpoints cascade audit failed: ${report.gaps.join("; ")}`);
    process.exit(1);
  }
  console.log(`Primitive Breakpoints cascade audit passed: ${jsonOutput}`);
}

writeReport();
