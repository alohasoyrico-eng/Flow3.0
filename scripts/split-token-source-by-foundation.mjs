import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const ROOT = process.cwd();
const foundationsMetaPath = path.join(ROOT, "packages/specs/specs/unison-system/meta/foundations.json");
const tokenSourcePath = path.join(ROOT, "packages/tokens/source/flow.tokens.json");
const sourceRoot = path.join(ROOT, "packages/tokens/source");
const manifestPath = path.join(sourceRoot, "source-manifest.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function writeJson(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
}

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tokenReference(value) {
  const match = String(value).match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

function likelyDocsOnly(name) {
  return (
    name.startsWith("density-doc-") ||
    name.startsWith("doc-") ||
    name.includes("-doc-") ||
    name.startsWith("docs-")
  );
}

function foundationFromName(name, foundations) {
  for (const foundation of foundations) {
    if (name.startsWith(`ref-${foundation.slug}-`) || name.startsWith(`sys-${foundation.slug}-`)) {
      return foundation;
    }
  }
  return null;
}

function foundationFromReference(value, foundations) {
  const reference = tokenReference(value);
  if (!reference) return null;
  return foundationFromName(reference, foundations);
}

function loadCurrentTokens() {
  if (fs.existsSync(tokenSourcePath)) {
    return {
      sourcePath: tokenSourcePath,
      tokens: readJson(tokenSourcePath),
    };
  }

  const files = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name.endsWith(".tokens.json")) files.push(fullPath);
    }
  }
  walk(sourceRoot);

  const tokens = {};
  for (const file of files.sort()) {
    Object.assign(tokens, readJson(file));
  }
  return {
    sourcePath: "packages/tokens/source/**/*.tokens.json",
    tokens,
  };
}

const foundations = readJson(foundationsMetaPath).foundations.map((name) => ({
  name,
  slug: slugify(name),
}));
const { sourcePath, tokens } = loadCurrentTokens();

const groups = {
  foundations: Object.fromEntries(foundations.map((foundation) => [foundation.slug, {}])),
  aliases: {},
  docs: {},
  semantic: {},
  unclassified: {},
};

for (const [name, token] of Object.entries(tokens)) {
  const ownFoundation = foundationFromName(name, foundations);
  if (ownFoundation) {
    groups.foundations[ownFoundation.slug][name] = token;
    continue;
  }

  const referencedFoundation = foundationFromReference(token.$value, foundations);
  if (referencedFoundation) {
    groups.aliases[name] = token;
    continue;
  }

  if (likelyDocsOnly(name)) {
    groups.docs[name] = token;
    continue;
  }

  if (name.startsWith("sys-")) {
    groups.semantic[name] = token;
    continue;
  }

  groups.unclassified[name] = token;
}

for (const foundation of foundations) {
  writeJson(
    path.join(sourceRoot, "foundations", `${foundation.slug}.tokens.json`),
    groups.foundations[foundation.slug],
  );
}

writeJson(path.join(sourceRoot, "decision-queues", "aliases-to-foundations.tokens.json"), groups.aliases);
writeJson(path.join(sourceRoot, "decision-queues", "docs-only-candidates.tokens.json"), groups.docs);
writeJson(path.join(sourceRoot, "decision-queues", "primitive-semantic-candidates.tokens.json"), groups.semantic);
writeJson(path.join(sourceRoot, "decision-queues", "unclassified.tokens.json"), groups.unclassified);

const counts = {
  sourcePath: path.relative(ROOT, sourcePath),
  foundations: Object.fromEntries(
    foundations.map((foundation) => [foundation.name, Object.keys(groups.foundations[foundation.slug]).length]),
  ),
  decisionQueues: {
    aliasesToFoundations: Object.keys(groups.aliases).length,
    docsOnlyCandidates: Object.keys(groups.docs).length,
    primitiveSemanticCandidates: Object.keys(groups.semantic).length,
    unclassified: Object.keys(groups.unclassified).length,
  },
  total: Object.keys(tokens).length,
};

writeJson(manifestPath, {
  generatedAt: new Date().toISOString(),
  purpose: "Curated P0.1 source split. Foundation-namespaced tokens live under source/foundations; all non-foundation tokens stay in explicit decision queues until primitives/components/docs ownership is resolved.",
  counts,
});

if (fs.existsSync(tokenSourcePath)) {
  fs.unlinkSync(tokenSourcePath);
}

console.log(JSON.stringify(counts, null, 2));
