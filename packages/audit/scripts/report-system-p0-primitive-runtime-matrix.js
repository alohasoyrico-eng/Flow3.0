const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const PRIMITIVES_META = path.join(ROOT, "packages/specs/specs/unison-system/meta/primitivefamilies.json");
const PRIMITIVES_DIR = path.join(ROOT, "packages/specs/specs/unison-system/artifacts/primitives");
const JS_RUNTIME_DIR = path.join(ROOT, "packages/components/src/primitives");
const TS_RUNTIME_DIRS = [
  path.join(ROOT, "packages/components/src/primitives"),
  path.join(ROOT, "packages/tokens/src/primitives"),
];
const TOKEN_SOURCE_DIR = path.join(ROOT, "packages/tokens/source");
const OUT_JSON = path.join(ROOT, "docs/audits/system-p0-primitive-runtime-matrix.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-p0-primitive-runtime-matrix.md");

const P0_RUNTIME_PRIMITIVES = new Set([
  "Color",
  "Typography",
  "Spacing",
  "Radius",
  "Elevation",
  "Density",
  "Focus",
  "Surface",
  "Breakpoints",
  "Disabled",
  "Loading",
  "Duration",
  "Motion Curves",
  "Measurement",
  "Message",
  "Field Action",
  "Charts",
  "Maps",
]);

const ASSET_OR_POLICY_PRIMITIVES = new Set([
  "Iconography",
  "Library Sources",
  "Country Flags",
  "Animation Assets",
  "Illustration Assets",
  "Research",
]);

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fileExists(file) {
  return fs.existsSync(file);
}

function walkFiles(dir, predicate) {
  const files = [];
  function walk(current) {
    if (!fs.existsSync(current)) return;
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && predicate(fullPath)) files.push(fullPath);
    }
  }
  walk(dir);
  return files.sort();
}

function tokenReference(value) {
  const match = String(value).match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

function loadTokenEntries() {
  const files = walkFiles(TOKEN_SOURCE_DIR, (file) => file.endsWith(".tokens.json"));
  const entries = [];
  for (const file of files) {
    const source = readJson(file);
    for (const [name, token] of Object.entries(source)) {
      entries.push({
        name,
        value: token.$value,
        type: token.$type ?? "unknown",
        sourceFile: path.relative(ROOT, file),
        reference: tokenReference(token.$value),
      });
    }
  }
  return entries;
}

function tokenMatchesPrimitive(tokenName, primitive) {
  const slug = primitive.slug;
  const compactSlug = slug.replace(/-/g, "");
  if (tokenName.startsWith(`sys-${slug}-`)) return true;
  if (tokenName.startsWith(`ref-${slug}-`)) return true;
  if (tokenName.startsWith(`${slug}-`)) return true;
  if (slug === "color" && tokenName.startsWith("sys-color-")) return true;
  if (slug === "spacing" && (tokenName.startsWith("sys-space-") || tokenName.startsWith("sys-spacing-"))) return true;
  if (slug === "radius" && tokenName.startsWith("sys-radius-")) return true;
  if (slug === "elevation" && tokenName.startsWith("sys-elevation-")) return true;
  if (slug === "motion-curves" && tokenName.startsWith("sys-motion-")) return true;
  if (slug === "duration" && tokenName.startsWith("sys-duration-")) return true;
  if (slug === "breakpoints" && tokenName.startsWith("sys-breakpoint-")) return true;
  if (slug === "density" && (tokenName.startsWith("sys-density-") || tokenName.startsWith("density-"))) return true;
  if (slug === "field-action" && tokenName.startsWith("sys-field-action-")) return true;
  if (slug === "iconography" && (tokenName.startsWith("sys-iconography-") || tokenName.startsWith("sys-icon-"))) return true;
  if (slug === "library-sources" && tokenName.includes("library")) return true;
  return tokenName.startsWith(`sys-${compactSlug}-`) || tokenName.startsWith(`ref-${compactSlug}-`);
}

function loadPrimitives() {
  const meta = readJson(PRIMITIVES_META);
  return meta.primitiveFamilies.map((name) => {
    const slug = slugify(name);
    const artifactPath = path.join(PRIMITIVES_DIR, `${slug}.json`);
    const artifact = readJson(artifactPath).artifacts.primitives[slug];
    const jsRuntimeFile = path.join(JS_RUNTIME_DIR, `${slug}.js`);
    const tsRuntimeFiles = TS_RUNTIME_DIRS
      .map((dir) => path.join(dir, `${slug}.ts`))
      .filter(fileExists)
      .map((file) => path.relative(ROOT, file));
    return {
      name,
      slug,
      artifactPath: path.relative(ROOT, artifactPath),
      purpose: artifact.purpose,
      governingFoundations: artifact.governingFoundations ?? [],
      coordinatesPrimitives: artifact.coordinatesPrimitives ?? [],
      tokenDependencies: artifact.tokenDependencies ?? [],
      roles: artifact.roles ?? [],
      jsRuntimeFile: fileExists(jsRuntimeFile) ? path.relative(ROOT, jsRuntimeFile) : null,
      tsRuntimeFiles,
      p0RuntimeRequired: P0_RUNTIME_PRIMITIVES.has(name),
      policyPrimitive: ASSET_OR_POLICY_PRIMITIVES.has(name),
    };
  });
}

function writeReport() {
  const primitives = loadPrimitives();
  const tokenEntries = loadTokenEntries();
  const rows = primitives.map((primitive) => {
    const matchingTokens = tokenEntries.filter((token) => tokenMatchesPrimitive(token.name, primitive));
    const status = primitive.tsRuntimeFiles.length && primitive.p0RuntimeRequired
      ? "typed-runtime"
      : primitive.tsRuntimeFiles.length && primitive.policyPrimitive
        ? "typed-policy-contract"
      : primitive.jsRuntimeFile
        ? "js-runtime-only"
        : primitive.p0RuntimeRequired
          ? "missing-p0-runtime"
          : "policy-or-non-runtime-decision-needed";
    return {
      ...primitive,
      status,
      matchingTokenCount: matchingTokens.length,
      matchingTokenPrefixes: Object.fromEntries(
        Object.entries(
          matchingTokens.reduce((acc, token) => {
            const prefix = token.name.split("-").slice(0, 2).join("-");
            acc[prefix] = (acc[prefix] ?? 0) + 1;
            return acc;
          }, {}),
        ).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])),
      ),
      matchingTokens: matchingTokens.slice(0, 80),
    };
  });

  const totals = {
    primitives: rows.length,
    typedRuntime: rows.filter((row) => row.status === "typed-runtime").length,
    typedPolicyContract: rows.filter((row) => row.status === "typed-policy-contract").length,
    jsRuntimeOnly: rows.filter((row) => row.status === "js-runtime-only").length,
    missingP0Runtime: rows.filter((row) => row.status === "missing-p0-runtime").length,
    policyOrNonRuntimeDecisionNeeded: rows.filter((row) => row.status === "policy-or-non-runtime-decision-needed").length,
    p0RuntimeRequired: rows.filter((row) => row.p0RuntimeRequired).length,
  };
  const data = {
    generatedAt: new Date().toISOString(),
    scope: "P0.2 primitive runtime matrix",
    totals,
    rows,
  };
  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);

  const lines = [
    "# P0.2 Primitive Runtime Matrix",
    "",
    "This report maps each real Flow primitive 1:1 against spec, JS runtime, typed runtime, token candidates, and P0 runtime requirement.",
    "",
    "## Totals",
    "",
    `- Primitives: ${totals.primitives}`,
    `- P0 runtime required: ${totals.p0RuntimeRequired}`,
    `- Typed runtime: ${totals.typedRuntime}`,
    `- Typed policy contract: ${totals.typedPolicyContract}`,
    `- JS runtime only: ${totals.jsRuntimeOnly}`,
    `- Missing P0 runtime: ${totals.missingP0Runtime}`,
    `- Policy/non-runtime decision needed: ${totals.policyOrNonRuntimeDecisionNeeded}`,
    "",
    "## Matrix",
    "",
    "| Primitive | Status | P0 runtime | JS runtime | TS runtime | Token candidates | Foundations |",
    "| --- | --- | --- | --- | --- | ---: | --- |",
    ...rows.map((row) => `| ${row.name} | ${row.status} | ${row.p0RuntimeRequired ? "yes" : "no"} | ${row.jsRuntimeFile ? `\`${row.jsRuntimeFile}\`` : ""} | ${row.tsRuntimeFiles.map((file) => `\`${file}\``).join("<br>")} | ${row.matchingTokenCount} | ${row.governingFoundations.join(", ")} |`),
    "",
    "## Missing P0 Runtime Queue",
    "",
    ...rows
      .filter((row) => row.status === "missing-p0-runtime")
      .map((row) => `- ${row.name}: ${row.matchingTokenCount} token candidates; foundations: ${row.governingFoundations.join(", ") || "none listed"}`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);

  console.log(JSON.stringify(totals, null, 2));
}

writeReport();
