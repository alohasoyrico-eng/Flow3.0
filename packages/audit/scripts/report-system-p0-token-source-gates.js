const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const SOURCE_DIR = path.join(ROOT, "packages/tokens/source");
const FOUNDATIONS_META = path.join(ROOT, "packages/specs/specs/unison-system/meta/foundations.json");
const TOKENS_OUTPUT = path.join(ROOT, "packages/tokens/tokens.json");
const OUT_JSON = path.join(ROOT, "docs/audits/system-p0-token-source-gates.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-p0-token-source-gates.md");
const CHECK = process.argv.includes("--check");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function sourceFiles() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name.endsWith(".tokens.json")) files.push(fullPath);
    }
  }
  walk(SOURCE_DIR);
  return files.sort();
}

function foundationForTokenName(name, foundations) {
  return foundations.find(
    (foundation) => name.startsWith(`ref-${foundation.slug}-`) || name.startsWith(`sys-${foundation.slug}-`),
  );
}

function gate(id, passed, evidence, failMessage) {
  return {
    id,
    status: passed ? "PASS" : "FAIL",
    evidence,
    failMessage: passed ? null : failMessage,
  };
}

function sortDeep(value) {
  if (Array.isArray(value)) return value.map(sortDeep);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, entry]) => [key, sortDeep(entry)]),
    );
  }
  return value;
}

function stableCounts(value) {
  return JSON.stringify(sortDeep(value));
}

function writeReport() {
  const foundations = readJson(FOUNDATIONS_META).foundations.map((name) => ({
    name,
    slug: slugify(name),
    file: path.join(SOURCE_DIR, "foundations", `${slugify(name)}.tokens.json`),
  }));
  const files = sourceFiles();
  const tokensByName = new Map();
  const duplicates = [];
  const misplacedFoundationTokens = [];
  const missingFoundationFiles = [];
  const emptyFoundationFiles = [];

  for (const foundation of foundations) {
    if (!fs.existsSync(foundation.file)) {
      missingFoundationFiles.push(path.relative(ROOT, foundation.file));
      continue;
    }
    const foundationTokens = readJson(foundation.file);
    if (Object.keys(foundationTokens).length === 0) {
      emptyFoundationFiles.push(path.relative(ROOT, foundation.file));
    }
  }

  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const source = readJson(file);
    for (const [name, token] of Object.entries(source)) {
      if (tokensByName.has(name)) {
        duplicates.push({
          name,
          firstFile: tokensByName.get(name).sourceFile,
          secondFile: rel,
        });
      }
      tokensByName.set(name, {
        token,
        sourceFile: rel,
      });

      const foundation = foundationForTokenName(name, foundations);
      const expected = foundation ? `packages/tokens/source/foundations/${foundation.slug}.tokens.json` : null;
      if (expected && rel !== expected) {
        misplacedFoundationTokens.push({
          name,
          sourceFile: rel,
          expectedFile: expected,
          foundation: foundation.name,
        });
      }
    }
  }

  const output = readJson(TOKENS_OUTPUT);
  const outputTokenCount = Object.keys(output.tokens ?? {}).length;
  const sourceTokenCount = tokensByName.size;
  const legacyFlatSource = path.join(SOURCE_DIR, "flow.tokens.json");
  const decisionQueueFiles = files
    .map((file) => path.relative(ROOT, file))
    .filter((file) => file.startsWith("packages/tokens/source/decision-queues/"));
  const primitiveSourceFiles = files
    .map((file) => path.relative(ROOT, file))
    .filter((file) => file.startsWith("packages/tokens/source/primitives/"));
  const docsSourceFiles = files
    .map((file) => path.relative(ROOT, file))
    .filter((file) => file.startsWith("packages/tokens/source/docs/"));
  const decisionQueueTokenCount = decisionQueueFiles.reduce((count, file) => {
    return count + Object.keys(readJson(path.join(ROOT, file))).length;
  }, 0);
  const foundationCounts = Object.fromEntries(
    foundations.map((foundation) => [
      foundation.name,
      fs.existsSync(foundation.file) ? Object.keys(readJson(foundation.file)).length : 0,
    ]),
  );
  const decisionQueueCounts = {
    aliasesToFoundations: Object.keys(readJson(path.join(SOURCE_DIR, "decision-queues/aliases-to-foundations.tokens.json"))).length,
    docsOnlyCandidates: Object.keys(readJson(path.join(SOURCE_DIR, "decision-queues/docs-only-candidates.tokens.json"))).length,
    primitiveSemanticCandidates: Object.keys(readJson(path.join(SOURCE_DIR, "decision-queues/primitive-semantic-candidates.tokens.json"))).length,
    unclassified: Object.keys(readJson(path.join(SOURCE_DIR, "decision-queues/unclassified.tokens.json"))).length,
    unresolved: Object.keys(readJson(path.join(SOURCE_DIR, "decision-queues/unresolved.tokens.json"))).length,
  };
  const primitiveTokenCount = primitiveSourceFiles.reduce((count, file) => {
    return count + Object.keys(readJson(path.join(ROOT, file))).length;
  }, 0);
  const docsTokenCount = docsSourceFiles.reduce((count, file) => {
    return count + Object.keys(readJson(path.join(ROOT, file))).length;
  }, 0);
  const actualManifestCounts = {
    sourcePath: "packages/tokens/source/**/*.tokens.json",
    foundations: foundationCounts,
    primitives: primitiveTokenCount,
    docs: docsTokenCount,
    decisionQueues: decisionQueueCounts,
    total: sourceTokenCount,
  };
  const manifestFile = path.join(SOURCE_DIR, "source-manifest.json");
  const manifestCounts = fs.existsSync(manifestFile) ? readJson(manifestFile).counts : null;

  const gates = [
    gate(
      "style-dictionary-output-count-matches-source",
      sourceTokenCount === outputTokenCount,
      { sourceTokenCount, outputTokenCount },
      "Style Dictionary output token count differs from source token count.",
    ),
    gate(
      "legacy-flat-source-removed",
      !fs.existsSync(legacyFlatSource),
      { file: path.relative(ROOT, legacyFlatSource), present: fs.existsSync(legacyFlatSource) },
      "Legacy flat token source is present; source ownership can be bypassed.",
    ),
    gate(
      "foundation-files-complete",
      missingFoundationFiles.length === 0 && emptyFoundationFiles.length === 0,
      { missingFoundationFiles, emptyFoundationFiles },
      "One or more real foundations have no dedicated non-empty source file.",
    ),
    gate(
      "no-duplicate-token-names",
      duplicates.length === 0,
      { duplicates },
      "Duplicate token names found across source files.",
    ),
    gate(
      "foundation-namespaces-contained",
      misplacedFoundationTokens.length === 0,
      { misplacedFoundationTokens },
      "Foundation-namespaced tokens exist outside their foundation source files.",
    ),
    gate(
      "decision-queues-empty",
      decisionQueueTokenCount === 0,
      { decisionQueueFiles, decisionQueueTokenCount },
      "One or more token decision queues still contain unresolved ownership.",
    ),
    gate(
      "primitive-source-files-present",
      primitiveSourceFiles.length > 0,
      { primitiveSourceFiles },
      "Primitive token source files are missing.",
    ),
    gate(
      "source-manifest-current",
      Boolean(manifestCounts) && stableCounts(manifestCounts) === stableCounts(actualManifestCounts),
      { manifestCounts, actualCounts: actualManifestCounts },
      "Token source manifest is stale or missing; run token ownership resolution and rebuild tokens.",
    ),
  ];
  const status = gates.every((item) => item.status === "PASS") ? "PASS" : "FAIL";
  const data = {
    generatedAt: new Date().toISOString(),
    scope: "P0.1 token source gates",
    status,
    totals: {
      sourceFiles: files.length,
      sourceTokens: sourceTokenCount,
      outputTokens: outputTokenCount,
      foundations: foundations.length,
      decisionQueueFiles: decisionQueueFiles.length,
      decisionQueueTokens: decisionQueueTokenCount,
      primitiveSourceFiles: primitiveSourceFiles.length,
      docsSourceFiles: docsSourceFiles.length,
    },
    gates,
  };

  const consoleSummary = { status, totals: data.totals, gates: gates.map((item) => [item.id, item.status]) };
  if (CHECK) {
    console.log(JSON.stringify(consoleSummary, null, 2));
    if (status !== "PASS") process.exitCode = 1;
    return;
  }

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);

  const lines = [
    "# P0.1 Token Source Gates",
    "",
    `Status: **${status}**`,
    "",
    "These gates validate that Style Dictionary now has a governed foundation source shape instead of one flat CSS-derived source.",
    "",
    "## Totals",
    "",
    `- Source files: ${data.totals.sourceFiles}`,
    `- Source tokens: ${data.totals.sourceTokens}`,
    `- Output tokens: ${data.totals.outputTokens}`,
    `- Foundation source files: ${data.totals.foundations}`,
    `- Decision queue files: ${data.totals.decisionQueueFiles}`,
    `- Decision queue tokens: ${data.totals.decisionQueueTokens}`,
    `- Primitive source files: ${data.totals.primitiveSourceFiles}`,
    `- Docs-only source files: ${data.totals.docsSourceFiles}`,
    "",
    "## Gates",
    "",
    "| Gate | Status | Evidence |",
    "| --- | --- | --- |",
    ...gates.map((item) => `| \`${item.id}\` | ${item.status} | \`${JSON.stringify(item.evidence)}\` |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);
  console.log(JSON.stringify(consoleSummary, null, 2));
  if (status !== "PASS") process.exitCode = 1;
}

writeReport();
