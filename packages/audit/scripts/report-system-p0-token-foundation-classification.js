const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../../..");
const FOUNDATIONS_META = path.join(ROOT, "packages/specs/specs/unison-system/meta/foundations.json");
const FOUNDATIONS_DIR = path.join(ROOT, "packages/specs/specs/unison-system/artifacts/foundations");
const TOKEN_SOURCE_DIR = path.join(ROOT, "packages/tokens/source");
const LEGACY_TOKEN_SOURCE = path.join(TOKEN_SOURCE_DIR, "flow.tokens.json");
const OUT_JSON = path.join(ROOT, "docs/audits/system-p0-token-foundation-classification.json");
const OUT_MD = path.join(ROOT, "docs/audits/system-p0-token-foundation-classification.md");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function tokenSourceFiles() {
  const files = [];
  function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fullPath);
      if (entry.isFile() && entry.name.endsWith(".tokens.json")) files.push(fullPath);
    }
  }
  walk(TOKEN_SOURCE_DIR);
  return files.sort();
}

function readTokenSources() {
  const files = tokenSourceFiles();
  const tokens = {};
  const duplicates = [];
  for (const file of files) {
    const sourceTokens = readJson(file);
    for (const [name, token] of Object.entries(sourceTokens)) {
      if (tokens[name]) {
        duplicates.push({
          name,
          firstFile: tokens[name].sourceFile,
          secondFile: path.relative(ROOT, file),
        });
      }
      tokens[name] = {
        token,
        sourceFile: path.relative(ROOT, file),
      };
    }
  }
  return {
    files: files.map((file) => path.relative(ROOT, file)),
    tokens,
    duplicates,
    legacyFlatSourcePresent: fs.existsSync(LEGACY_TOKEN_SOURCE),
  };
}

function slugify(name) {
  return String(name).trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function tokenReference(value) {
  const match = String(value).match(/^\{([^}]+)\}$/);
  return match ? match[1] : null;
}

function cssVarName(name, token) {
  return token.$extensions?.flow?.cssVariable ?? `--${name}`;
}

function foundationFromName(name, foundations) {
  for (const foundation of foundations) {
    const slug = foundation.slug;
    if (name.startsWith(`ref-${slug}-`) || name.startsWith(`sys-${slug}-`)) {
      return {
        kind: name.startsWith("ref-") ? "foundation-reference-token" : "foundation-system-token",
        foundation: foundation.name,
        foundationSlug: slug,
      };
    }
  }
  return null;
}

function foundationFromReference(reference, foundations) {
  if (!reference) return null;
  return foundationFromName(reference, foundations);
}

function likelyDocsOnly(name) {
  return (
    name.startsWith("density-doc-") ||
    name.startsWith("doc-") ||
    name.includes("-doc-") ||
    name.startsWith("docs-")
  );
}

function firstPrefix(name) {
  return name.split("-")[0] || "unknown";
}

function twoPartPrefix(name) {
  return name.split("-").slice(0, 2).join("-") || "unknown";
}

function loadFoundations() {
  const meta = readJson(FOUNDATIONS_META);
  return meta.foundations.map((name) => {
    const slug = slugify(name);
    const artifactPath = path.join(FOUNDATIONS_DIR, `${slug}.json`);
    const artifact = readJson(artifactPath).artifacts.foundations[slug];
    return {
      name,
      slug,
      artifactPath: path.relative(ROOT, artifactPath),
      purpose: artifact.purpose,
      tokenDependencies: artifact.tokenDependencies ?? [],
      primitiveDependencies: artifact.primitiveDependencies ?? [],
      componentDependencies: artifact.componentDependencies ?? [],
      patternDependencies: artifact.patternDependencies ?? [],
      roles: (artifact.roles ?? []).map((role) => ({
        id: role.id,
        token: role.token,
        use: role.use,
      })),
    };
  });
}

function classifyTokens(tokenEntries, foundations) {
  const rows = [];
  const byFoundation = Object.fromEntries(
    foundations.map((foundation) => [
      foundation.name,
      {
        foundation: foundation.name,
        referenceTokens: 0,
        systemTokens: 0,
        referencedByAliases: 0,
        referencesOutOfFoundation: 0,
        tokens: [],
      },
    ]),
  );
  const buckets = {
    foundationOwned: [],
    foundationAlias: [],
    docsOnly: [],
    primitiveOrSemanticCandidate: [],
    unclassified: [],
  };
  const prefixCounts = {};

  for (const [name, entry] of Object.entries(tokenEntries)) {
    const token = entry.token;
    const value = token.$value;
    const reference = tokenReference(value);
    const own = foundationFromName(name, foundations);
    const referencedFoundation = foundationFromReference(reference, foundations);
    const row = {
      name,
      cssVariable: cssVarName(name, token),
      sourceFile: entry.sourceFile,
      type: token.$type ?? "unknown",
      value,
      reference,
      prefix: firstPrefix(name),
      twoPartPrefix: twoPartPrefix(name),
      ownerKind: "unclassified",
      ownerFoundation: null,
      referencedFoundation: referencedFoundation?.foundation ?? null,
      requiresDecision: true,
      reason: "",
    };

    prefixCounts[row.twoPartPrefix] = (prefixCounts[row.twoPartPrefix] ?? 0) + 1;

    if (own) {
      row.ownerKind = own.kind;
      row.ownerFoundation = own.foundation;
      row.requiresDecision = false;
      row.reason = `Name is in ${own.foundation} foundation namespace.`;
      buckets.foundationOwned.push(row);
      byFoundation[own.foundation].tokens.push(row);
      if (own.kind === "foundation-reference-token") byFoundation[own.foundation].referenceTokens += 1;
      if (own.kind === "foundation-system-token") byFoundation[own.foundation].systemTokens += 1;
      if (referencedFoundation && referencedFoundation.foundation !== own.foundation) {
        byFoundation[own.foundation].referencesOutOfFoundation += 1;
        row.requiresDecision = true;
        row.reason = `Token is named as ${own.foundation} but references ${referencedFoundation.foundation}.`;
      }
      rows.push(row);
      continue;
    }

    if (referencedFoundation) {
      row.ownerKind = "alias-to-foundation";
      row.ownerFoundation = null;
      row.requiresDecision = true;
      row.reason = `Alias references ${referencedFoundation.foundation}; needs primitive/component/docs ownership decision.`;
      buckets.foundationAlias.push(row);
      byFoundation[referencedFoundation.foundation].referencedByAliases += 1;
      rows.push(row);
      continue;
    }

    if (likelyDocsOnly(name)) {
      row.ownerKind = "docs-only-candidate";
      row.requiresDecision = true;
      row.reason = "Name indicates docs-only or documentation density source.";
      buckets.docsOnly.push(row);
      rows.push(row);
      continue;
    }

    if (name.startsWith("sys-")) {
      row.ownerKind = "primitive-or-semantic-candidate";
      row.requiresDecision = true;
      row.reason = "System token outside a real foundation namespace.";
      buckets.primitiveOrSemanticCandidate.push(row);
      rows.push(row);
      continue;
    }

    row.reason = "No real foundation namespace, foundation reference, or docs-only signal found.";
    buckets.unclassified.push(row);
    rows.push(row);
  }

  return {
    rows,
    byFoundation,
    buckets,
    prefixCounts: Object.fromEntries(Object.entries(prefixCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
  };
}

function writeReport() {
  const foundations = loadFoundations();
  const tokenSources = readTokenSources();
  const classification = classifyTokens(tokenSources.tokens, foundations);
  const totalTokens = Object.keys(tokenSources.tokens).length;
  const decisionCount = classification.rows.filter((row) => row.requiresDecision).length;
  const data = {
    generatedAt: new Date().toISOString(),
    scope: "P0.1 token/foundation source classification",
    source: {
      foundationsMeta: path.relative(ROOT, FOUNDATIONS_META),
      foundationsDir: path.relative(ROOT, FOUNDATIONS_DIR),
      tokenSource: "packages/tokens/source/**/*.tokens.json",
      tokenSourceFiles: tokenSources.files,
      legacyFlatSourcePresent: tokenSources.legacyFlatSourcePresent,
    },
    sourceIntegrity: {
      duplicateTokenNames: tokenSources.duplicates,
      legacyFlatSourcePresent: tokenSources.legacyFlatSourcePresent,
    },
    totals: {
      foundations: foundations.length,
      tokens: totalTokens,
      foundationOwned: classification.buckets.foundationOwned.length,
      aliasToFoundation: classification.buckets.foundationAlias.length,
      docsOnlyCandidates: classification.buckets.docsOnly.length,
      primitiveOrSemanticCandidates: classification.buckets.primitiveOrSemanticCandidate.length,
      unclassified: classification.buckets.unclassified.length,
      requiresDecision: decisionCount,
    },
    foundations,
    byFoundation: classification.byFoundation,
    prefixCounts: classification.prefixCounts,
    decisionQueues: {
      aliasToFoundation: classification.buckets.foundationAlias,
      docsOnlyCandidates: classification.buckets.docsOnly,
      primitiveOrSemanticCandidates: classification.buckets.primitiveOrSemanticCandidate,
      unclassified: classification.buckets.unclassified,
      crossFoundationReferences: classification.rows.filter(
        (row) => row.ownerFoundation && row.referencedFoundation && row.ownerFoundation !== row.referencedFoundation,
      ),
    },
  };

  fs.mkdirSync(path.dirname(OUT_JSON), { recursive: true });
  fs.writeFileSync(OUT_JSON, `${JSON.stringify(data, null, 2)}\n`);

  const lines = [
    "# P0.1 Token/Foundation Classification",
    "",
    "This is the first remaining P0.1 pass. It does not rename or move tokens. It classifies the current Style Dictionary source against the 11 real Flow foundations so the next pass can curate source ownership without inventing a generic token taxonomy.",
    "",
    "## Totals",
    "",
    `- Foundations from spec: ${data.totals.foundations}`,
    `- Tokens in current source: ${data.totals.tokens}`,
    `- Source files: ${data.source.tokenSourceFiles.length}`,
    `- Legacy flat source present: ${data.source.legacyFlatSourcePresent ? "yes" : "no"}`,
    `- Duplicate token names: ${data.sourceIntegrity.duplicateTokenNames.length}`,
    `- Foundation-owned tokens by namespace: ${data.totals.foundationOwned}`,
    `- Aliases that reference foundations but are not foundation-owned: ${data.totals.aliasToFoundation}`,
    `- Docs-only candidates: ${data.totals.docsOnlyCandidates}`,
    `- Primitive/semantic candidates outside foundation namespace: ${data.totals.primitiveOrSemanticCandidates}`,
    `- Unclassified tokens: ${data.totals.unclassified}`,
    `- Tokens requiring owner decision before curated source split: ${data.totals.requiresDecision}`,
    "",
    "## Real Foundations",
    "",
    "| Foundation | Reference tokens | System tokens | Aliases referencing it | Cross-foundation refs | Artifact |",
    "| --- | ---: | ---: | ---: | ---: | --- |",
    ...foundations.map((foundation) => {
      const row = data.byFoundation[foundation.name];
      return `| ${foundation.name} | ${row.referenceTokens} | ${row.systemTokens} | ${row.referencedByAliases} | ${row.referencesOutOfFoundation} | \`${foundation.artifactPath}\` |`;
    }),
    "",
    "## Largest Prefix Buckets",
    "",
    "| Prefix | Tokens |",
    "| --- | ---: |",
    ...Object.entries(data.prefixCounts)
      .slice(0, 30)
      .map(([prefix, count]) => `| \`${prefix}\` | ${count} |`),
    "",
    "## Decision Queues",
    "",
    "These are the queues for the next P0.1 iteration. They are not safe to move into foundation files until owner decisions are explicit.",
    "",
    `- Alias-to-foundation queue: ${data.decisionQueues.aliasToFoundation.length}`,
    `- Docs-only queue: ${data.decisionQueues.docsOnlyCandidates.length}`,
    `- Primitive/semantic queue: ${data.decisionQueues.primitiveOrSemanticCandidates.length}`,
    `- Unclassified queue: ${data.decisionQueues.unclassified.length}`,
    `- Cross-foundation reference queue: ${data.decisionQueues.crossFoundationReferences.length}`,
    "",
    "## First 40 Owner Decisions",
    "",
    "| Token | Queue | Reference | Referenced foundation | Reason |",
    "| --- | --- | --- | --- | --- |",
    ...[
      ...data.decisionQueues.aliasToFoundation,
      ...data.decisionQueues.docsOnlyCandidates,
      ...data.decisionQueues.primitiveOrSemanticCandidates,
      ...data.decisionQueues.unclassified,
    ]
      .slice(0, 40)
      .map((row) => `| \`${row.name}\` | ${row.ownerKind} | ${row.reference ? `\`${row.reference}\`` : ""} | ${row.referencedFoundation ?? ""} | ${row.reason} |`),
    "",
  ];
  fs.writeFileSync(OUT_MD, `${lines.join("\n")}\n`);

  console.log(JSON.stringify(data.totals, null, 2));
}

writeReport();
