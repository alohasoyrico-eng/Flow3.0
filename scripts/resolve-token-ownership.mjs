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
manifest.lastOwnershipResolution = {
  generatedAt: new Date().toISOString(),
  moved,
  unresolvedTokens: Object.keys(unresolved).sort(),
};
writeJson(MANIFEST, manifest);

console.log(JSON.stringify(manifest.lastOwnershipResolution, null, 2));
