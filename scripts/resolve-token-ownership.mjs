import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "packages/tokens/source");
const QUEUE_DIR = path.join(SOURCE_DIR, "decision-queues");
const PRIMITIVE_DIR = path.join(SOURCE_DIR, "primitives");
const DOCS_DIR = path.join(SOURCE_DIR, "docs");
const ACCESSIBILITY_FOUNDATION = path.join(SOURCE_DIR, "foundations/accessibility.tokens.json");
const FRAME_FOUNDATION = path.join(SOURCE_DIR, "foundations/frame.tokens.json");
const MANIFEST = path.join(SOURCE_DIR, "source-manifest.json");
const FOUNDATIONS_META = path.join(ROOT, "packages/specs/specs/unison-system/meta/foundations.json");

const QUEUES = [
  "aliases-to-foundations.tokens.json",
  "docs-only-candidates.tokens.json",
  "primitive-semantic-candidates.tokens.json",
  "unclassified.tokens.json",
  "unresolved.tokens.json",
];

const PRIMITIVE_RULES = [
  ["color", ["sys-color-"]],
  ["typography", ["sys-font-", "sys-line-", "sys-voice-"]],
  ["spacing", ["sys-space-", "sys-spacing-"]],
  ["radius", ["sys-radius-"]],
  ["elevation", ["sys-elevation-"]],
  ["duration", ["sys-duration-"]],
  ["motion-curves", ["sys-motion-"]],
  ["breakpoints", ["sys-breakpoint-"]],
  ["density", ["sys-density-", "density-control-", "density-panel-", "density-card-", "density-surface-", "density-component-", "density-subsection-", "density-section-", "density-page-", "density-row-"]],
  ["focus", ["sys-focus-"]],
  ["loading", ["sys-loading-"]],
  ["disabled", ["sys-disabled-"]],
  ["message", ["sys-message-"]],
  ["measurement", ["sys-measurement-"]],
  ["charts", ["sys-chart-"]],
  ["maps", ["sys-map-"]],
  ["research", ["sys-research-"]],
  ["surface", ["surface-", "sys-surface-"]],
  ["field-action", ["field-action-", "sys-field-action-"]],
  ["iconography", ["sys-icon-"]],
];

function readJson(file, fallback = {}) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, "utf8")) : fallback;
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function countTokens(file) {
  return Object.keys(readJson(file, {})).length;
}

function currentSourceCounts() {
  const foundations = readJson(FOUNDATIONS_META).foundations.map((name) => ({
    name,
    slug: slugify(name),
  }));
  const foundationCounts = Object.fromEntries(
    foundations.map((foundation) => [
      foundation.name,
      countTokens(path.join(SOURCE_DIR, "foundations", `${foundation.slug}.tokens.json`)),
    ]),
  );
  const decisionQueueCounts = {
    aliasesToFoundations: countTokens(path.join(QUEUE_DIR, "aliases-to-foundations.tokens.json")),
    docsOnlyCandidates: countTokens(path.join(QUEUE_DIR, "docs-only-candidates.tokens.json")),
    primitiveSemanticCandidates: countTokens(path.join(QUEUE_DIR, "primitive-semantic-candidates.tokens.json")),
    unclassified: countTokens(path.join(QUEUE_DIR, "unclassified.tokens.json")),
    unresolved: countTokens(path.join(QUEUE_DIR, "unresolved.tokens.json")),
  };
  const primitiveCount = fs.existsSync(PRIMITIVE_DIR)
    ? fs.readdirSync(PRIMITIVE_DIR)
      .filter((file) => file.endsWith(".tokens.json"))
      .reduce((total, file) => total + countTokens(path.join(PRIMITIVE_DIR, file)), 0)
    : 0;
  const docsCount = fs.existsSync(DOCS_DIR)
    ? fs.readdirSync(DOCS_DIR)
      .filter((file) => file.endsWith(".tokens.json"))
      .reduce((total, file) => total + countTokens(path.join(DOCS_DIR, file)), 0)
    : 0;

  return {
    sourcePath: "packages/tokens/source/**/*.tokens.json",
    foundations: foundationCounts,
    primitives: primitiveCount,
    docs: docsCount,
    decisionQueues: decisionQueueCounts,
    total: Object.values(foundationCounts).reduce((total, count) => total + count, 0)
      + primitiveCount
      + docsCount
      + Object.values(decisionQueueCounts).reduce((total, count) => total + count, 0),
  };
}

function isDocsOnly(name) {
  return name.startsWith("density-doc-") || name.startsWith("sys-density-doc-") || name.startsWith("doc-") || name.startsWith("docs-") || name.includes("-doc-");
}

function isAccessibilityFoundation(name) {
  return name.startsWith("ref-a11y-") || name.startsWith("sys-a11y-") || name.startsWith("sys-accessibility-") || name.startsWith("ref-accessibility-") || name.startsWith("sys-touch-target-");
}

function isFrameFoundation(name) {
  return name.startsWith("sys-border-width-");
}

function primitiveSlugFor(name) {
  for (const [slug, prefixes] of PRIMITIVE_RULES) {
    if (prefixes.some((prefix) => name.startsWith(prefix))) return slug;
  }
  return null;
}

function mergeInto(file, entries) {
  const current = readJson(file);
  writeJson(file, Object.fromEntries(Object.entries({ ...current, ...entries }).sort(([a], [b]) => a.localeCompare(b))));
}

const queues = Object.fromEntries(QUEUES.map((file) => [file, readJson(path.join(QUEUE_DIR, file))]));
const moved = {
  foundations: { accessibility: 0, frame: 0 },
  primitives: {},
  docs: 0,
  unresolved: 0,
};
const byPrimitive = {};
const docsTokens = {};
const accessibilityTokens = {};
const frameTokens = {};
const unresolved = {};

for (const queue of QUEUES) {
  for (const [name, token] of Object.entries(queues[queue])) {
    if (isDocsOnly(name)) {
      docsTokens[name] = token;
      moved.docs += 1;
      continue;
    }

    if (isAccessibilityFoundation(name)) {
      accessibilityTokens[name] = token;
      moved.foundations.accessibility += 1;
      continue;
    }

    if (isFrameFoundation(name)) {
      frameTokens[name] = token;
      moved.foundations.frame += 1;
      continue;
    }

    const primitiveSlug = primitiveSlugFor(name);
    if (primitiveSlug) {
      byPrimitive[primitiveSlug] = byPrimitive[primitiveSlug] ?? {};
      byPrimitive[primitiveSlug][name] = token;
      moved.primitives[primitiveSlug] = (moved.primitives[primitiveSlug] ?? 0) + 1;
      continue;
    }

    unresolved[name] = token;
    moved.unresolved += 1;
  }
}

if (Object.keys(accessibilityTokens).length) {
  mergeInto(ACCESSIBILITY_FOUNDATION, accessibilityTokens);
}

if (Object.keys(frameTokens).length) {
  mergeInto(FRAME_FOUNDATION, frameTokens);
}

for (const [slug, entries] of Object.entries(byPrimitive)) {
  mergeInto(path.join(PRIMITIVE_DIR, `${slug}.tokens.json`), entries);
}

if (Object.keys(docsTokens).length) {
  mergeInto(path.join(DOCS_DIR, "docs-only.tokens.json"), docsTokens);
}

for (const file of QUEUES) {
  writeJson(path.join(QUEUE_DIR, file), {});
}
writeJson(path.join(QUEUE_DIR, "unresolved.tokens.json"), unresolved);

const manifest = readJson(MANIFEST, {});
const generatedAt = new Date().toISOString();
manifest.generatedAt = generatedAt;
manifest.counts = currentSourceCounts();
manifest.lastOwnershipResolution = {
  generatedAt,
  moved,
  unresolvedTokens: Object.keys(unresolved).sort(),
};
writeJson(MANIFEST, manifest);

console.log(JSON.stringify(manifest.lastOwnershipResolution, null, 2));
