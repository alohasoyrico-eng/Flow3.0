const { add, fs, path, read, readJson, root } = require("./audit-context.js");

const taxonomyFile = path.join(root, "packages/content/content/taxonomy-boundaries.json");

const componentArtifactChecks = [
  {
    label: "component contract",
    fileFor: (id) => path.join(root, "packages/content/content/component-contracts/components", `${id}.md`),
  },
  {
    label: "component copy shard",
    fileFor: (id) => path.join(root, "packages/content/content/component-copy/components", id),
  },
  {
    label: "React source",
    fileFor: (id) => path.join(root, "packages/react/src", `${pascal(id)}.js`),
  },
  {
    label: "React type source",
    fileFor: (id) => path.join(root, "packages/react/src", `${pascal(id)}.d.ts`),
  },
];

function checkTaxonomyBoundaries() {
  const taxonomy = readJson(taxonomyFile);
  if (!taxonomy) {
    add("errors", taxonomyFile, 1, "Taxonomy boundaries must exist as machine-readable JSON.");
    return;
  }

  const decisions = taxonomy.decisions ?? [];
  if (!decisions.length) {
    add("errors", taxonomyFile, 1, "Taxonomy boundaries must list explicit decisions.");
    return;
  }
  for (const rule of ["Primitive", "Component", "Pattern", "Template"]) {
    if (!(taxonomy.rules ?? []).some((item) => String(item).includes(rule))) {
      add("errors", taxonomyFile, 1, `Taxonomy rules must define ${rule}.`);
    }
  }

  const ids = decisions.map((decision) => decision.id);
  const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicateIds.length) add("errors", taxonomyFile, 1, `Taxonomy decisions must not duplicate ids: ${duplicateIds.join(", ")}.`);

  const patternCatalogIds = new Set(readCatalogIds("patterns"));
  const componentCatalogIds = new Set(readCatalogIds("components"));
  const templateCatalogIds = new Set(readCatalogIds("templates"));

  for (const decision of decisions) {
    checkDecisionShape(decision);
    if (decision.layer === "pattern" && !patternCatalogIds.has(decision.replacement)) {
      add("errors", taxonomyFile, 1, `${decision.id} points to missing replacement pattern: ${decision.replacement}.`);
    }
    if (decision.layer === "template" && !templateCatalogIds.has(decision.replacement)) {
      add("errors", taxonomyFile, 1, `${decision.id} points to missing replacement template: ${decision.replacement}.`);
    }
    if (componentCatalogIds.has(decision.id)) {
      add("errors", taxonomyFile, 1, `${decision.id} is classified as ${decision.layer} but still appears in the component catalog.`);
    }
    checkForbiddenComponentArtifacts(decision.id);
  }

  checkGoldComponentMapping(decisions.map((decision) => decision.id));
}

function checkDecisionShape(decision) {
  for (const field of ["id", "layer", "replacement", "reason"]) {
    if (typeof decision[field] !== "string" || !decision[field].trim()) {
      add("errors", taxonomyFile, 1, `Taxonomy decision must include ${field}.`);
    }
  }
  if (!["pattern", "template", "non-component"].includes(decision.layer)) {
    add("errors", taxonomyFile, 1, `${decision.id} has unsupported taxonomy layer: ${decision.layer}.`);
  }
}

function checkForbiddenComponentArtifacts(id) {
  for (const check of componentArtifactChecks) {
    const artifact = check.fileFor(id);
    if (artifactExists(artifact)) {
      add("errors", artifact, 1, `${id} is a taxonomy ${check.label} violation; it must not live as a public component artifact.`);
    }
  }

  for (const [file, snippets] of [
    [path.join(root, "packages/content/content/component-docs.json"), [`"${id}"`]],
    [path.join(root, "packages/content/content/component-copy.json"), [`"${id}"`]],
    [path.join(root, "packages/content/content/component-implementation-status.json"), [`"${id}"`]],
    [path.join(root, "packages/components/src/contracts.js"), [`${camel(id)}: {`, `create${pascal(id)}`]],
    [path.join(root, "packages/components/src/registry.js"), [`"${id}"`, `'${id}'`]],
    [path.join(root, "packages/components/src/platforms/index.js"), [`${camel(id)}PlatformContract`, `${camel(id)}PlatformProps`]],
  ]) {
    if (!fs.existsSync(file)) continue;
    const source = read(file);
    if (snippets.some((snippet) => source.includes(snippet))) {
      add("errors", file, 1, `${id} must not be exposed as a component artifact from ${path.relative(root, file)}.`);
    }
  }
}

function checkGoldComponentMapping(ids) {
  const file = path.join(root, "packages/audit/scripts/audit-gold-components.js");
  const source = read(file);
  for (const id of ids) {
    if (source.includes(`"${id}"`) || source.includes(`${camel(id)}Demo`)) {
      add("errors", file, 1, `${id} must not appear in gold component demo mapping.`);
    }
  }
}

function readCatalogIds(collection) {
  const dir = path.join(root, "packages/content/content/catalog");
  if (!fs.existsSync(dir)) return [];
  const files = collection === "templates"
    ? ["templates.json"]
    : fs.readdirSync(dir).filter((file) => file.startsWith(`${collection}-`) && file.endsWith(".json"));
  return files.flatMap((file) => {
    const json = readJson(path.join(dir, file));
    return (json?.[collection] ?? []).map((item) => item.id).filter(Boolean);
  });
}

function artifactExists(file) {
  if (!fs.existsSync(file)) return false;
  const stat = fs.statSync(file);
  if (!stat.isDirectory()) return true;
  return fs.readdirSync(file).some((item) => item !== ".DS_Store");
}

function camel(id) {
  return id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
}

function pascal(id) {
  const value = camel(id);
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}

module.exports = { checkTaxonomyBoundaries };
