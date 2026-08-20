#!/usr/bin/env node

const {
  fs,
  path,
  read,
  readJson,
  root,
} = require("./audit-context.js");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "state-variant-public-vocabulary.json");
const markdownOutput = path.join(outputDir, "state-variant-public-vocabulary.md");
const contractsFile = path.join(root, "packages/components/src/contracts.js");
const taxonomyFile = path.join(root, "packages/audit/contracts/state-variant-taxonomy-contract.json");

const vocabularyProps = [
  "variant",
  "state",
  "tone",
  "intent",
  "density",
  "size",
  "selected",
  "disabled",
  "loading",
];

const componentPriority = {
  p0: new Set([
    "button",
    "input",
    "select",
    "combobox",
    "checkbox",
    "radio-button",
    "switch",
    "tabs",
    "menu",
    "popover",
    "dialog",
    "drawer",
    "date-picker",
    "date-range-picker",
    "phone-input",
    "code-input",
  ]),
  p1: new Set([
    "icon-button",
    "floating-action-button",
    "quick-action",
    "copy-button",
    "text-area",
    "country-selector",
    "card-number-input",
    "card-expiry-input",
    "card-security-code-input",
    "segmented-control",
    "pagination",
    "tree-view",
    "accordion",
    "table",
    "list",
    "toast",
    "tooltip",
    "inline-validation",
    "error-panel",
    "empty-state",
    "progress-indicator",
  ]),
};

const familyBySlug = {
  accordion: "navigation",
  "animated-moment": "motion-feedback",
  "audit-event": "domain-event",
  avatar: "display-status",
  badge: "display-status",
  "biometric-prompt": "domain-auth",
  breadcrumbs: "navigation",
  button: "actions",
  card: "surface-display",
  "card-expiry-input": "fields-payment",
  "card-number-input": "fields-payment",
  "card-security-code-input": "fields-payment",
  "card-summary": "domain-payment",
  "chart-panel": "data-display",
  "chat-composer": "domain-chat",
  "chat-message": "domain-chat",
  "chat-thread": "domain-chat",
  checkbox: "choices",
  chip: "display-status",
  "code-block": "documentation-code",
  "code-input": "fields",
  combobox: "fields",
  "copy-button": "actions",
  "country-selector": "fields",
  "date-picker": "fields-date",
  "date-range-picker": "fields-date",
  dialog: "overlays",
  drawer: "overlays",
  "empty-state": "feedback",
  "error-panel": "feedback",
  "floating-action-button": "actions",
  "icon-button": "actions",
  "inline-validation": "feedback",
  input: "fields",
  "input-amount": "fields-payment",
  "kpi-tile": "data-display",
  list: "data-display",
  menu: "overlays",
  "motion-boundary": "motion-feedback",
  "movement-row": "domain-fleet",
  pagination: "navigation",
  "phone-input": "fields",
  popover: "overlays",
  "progress-indicator": "feedback",
  "quick-action": "actions",
  "radio-button": "choices",
  "route-summary": "domain-fleet",
  "segmented-control": "navigation",
  select: "fields",
  skeleton: "feedback",
  slider: "fields",
  spinner: "feedback",
  "station-pin": "domain-fleet",
  stepper: "progress-feedback",
  surface: "surface-display",
  switch: "choices",
  table: "data-display",
  tabs: "navigation",
  tag: "display-status",
  "text-area": "fields",
  toast: "feedback",
  tooltip: "overlays",
  "tree-view": "navigation",
};

function slugify(id) {
  return String(id).replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

function loadContracts() {
  const source = read(contractsFile);
  const start = source.indexOf("export const componentContracts =");
  const end = source.indexOf("export const componentContractVersion");
  if (start < 0 || end < 0 || end <= start) {
    throw new Error(`Unable to locate componentContracts export in ${contractsFile}`);
  }
  const body = source
    .slice(start, end)
    .replace("export const componentContracts =", "const componentContracts =")
    .concat("\nmodule.exports = { componentContracts };\n");
  const module = { exports: {} };
  new Function("module", "exports", body)(module, module.exports);
  return module.exports.componentContracts;
}

function propMap(contract) {
  return new Map((contract.props ?? []).map((prop) => [prop.name, prop]));
}

function publicVocabulary(contract) {
  const props = propMap(contract);
  return vocabularyProps
    .filter((name) => props.has(name))
    .map((name) => ({
      name,
      type: props.get(name).type,
      required: Boolean(props.get(name).required),
    }));
}

function reviewFlags(slug, family, contract) {
  const props = propMap(contract);
  const variants = contract.variants ?? [];
  const states = contract.states ?? [];
  const flags = [];
  const rule = taxonomyRule(family);
  const allowedPublicProps = new Set(rule?.allowedPublicProps ?? []);

  for (const prop of vocabularyProps) {
    if (props.has(prop) && allowedPublicProps.size && !allowedPublicProps.has(prop)) {
      flags.push(`public-prop-${prop}-outside-family-taxonomy`);
    }
  }

  for (const prop of rule?.reviewIfPublicProps ?? []) {
    if (props.has(prop)) flags.push(`public-prop-${prop}-requires-review`);
  }

  for (const variant of rule?.reviewIfVariants ?? []) {
    if (variants.includes(variant)) flags.push(`variant-${variant}-requires-review`);
  }

  if (props.has("variant") && !variants.length) {
    flags.push("variant-prop-without-contract-variants");
  }
  if (states.includes("disabled") && !props.has("disabled") && !hasStateSource(rule, props, "disabled")) {
    flags.push("disabled-state-without-disabled-prop");
  }
  if (states.includes("loading") && !props.has("loading") && !hasStateSource(rule, props, "loading") && !["feedback", "motion-feedback", "progress-feedback"].includes(family)) {
    flags.push("loading-state-without-loading-prop");
  }
  if (states.includes("selected") && !props.has("selected") && !hasStateSource(rule, props, "selected") && !["navigation", "choices", "fields", "overlays"].includes(family)) {
    flags.push("selected-state-without-selected-prop");
  }
  if (props.has("size") && props.has("density")) {
    flags.push("size-and-density-both-public");
  }
  if (props.has("tone") && props.has("intent")) {
    flags.push("tone-and-intent-both-public");
  }
  if (!familyBySlug[slug]) {
    flags.push("missing-family-classification");
  }

  return flags;
}

function hasStateSource(rule, props, state) {
  return (rule?.stateSourceProps?.[state] ?? []).some((name) => props.has(name));
}

function priorityFor(slug) {
  if (componentPriority.p0.has(slug)) return "P0";
  if (componentPriority.p1.has(slug)) return "P1";
  return "P2";
}

function remediationFor(row) {
  const flags = row.reviewFlags;
  if (!flags.length) return "No remediation from this taxonomy pass.";
  if (flags.some((flag) => flag.includes("outside-family-taxonomy") || flag.includes("variant-"))) {
    return "Normalize public API taxonomy or document a formal family exception before component work continues.";
  }
  if (flags.some((flag) => flag.startsWith("disabled-state-without"))) {
    return "Declare disabled state source as public prop, item data, controlled value, or primitive lifecycle.";
  }
  if (flags.some((flag) => flag.startsWith("loading-state-without"))) {
    return "Declare loading state source and expose loading when the component instance owns pending behavior.";
  }
  if (flags.some((flag) => flag.startsWith("selected-state-without"))) {
    return "Declare selected state source as public prop, controlled value, item/row data, or navigation selection model.";
  }
  return "Review taxonomy flag and decide contract remediation or explicit exception.";
}

function taxonomyRule(family) {
  const taxonomy = taxonomyRule.contract ??= readJson(taxonomyFile);
  return taxonomy.familyRules?.[family]
    ?? (family.startsWith("domain-") ? taxonomy.familyRules?.domain : undefined);
}

function countBy(rows, key) {
  return rows.reduce((acc, row) => {
    const value = row[key] ?? "unknown";
    acc[value] = (acc[value] ?? 0) + 1;
    return acc;
  }, {});
}

const contracts = loadContracts();
const rows = Object.entries(contracts).map(([id, contract]) => {
  const slug = slugify(id);
  const family = familyBySlug[slug] ?? "unknown";
  return {
    id,
    slug,
    family,
    element: contract.element ?? "",
    variants: contract.variants ?? [],
    intents: contract.intents ?? [],
    states: contract.states ?? [],
    publicVocabulary: publicVocabulary(contract),
    reviewFlags: reviewFlags(slug, family, contract),
  };
}).sort((a, b) => a.slug.localeCompare(b.slug));

const flaggedRows = rows.filter((row) => row.reviewFlags.length);
const remediationQueue = flaggedRows.map((row) => ({
  slug: row.slug,
  family: row.family,
  priority: priorityFor(row.slug),
  flags: row.reviewFlags,
  remediation: remediationFor(row),
})).sort((a, b) => {
  const order = { P0: 0, P1: 1, P2: 2 };
  return order[a.priority] - order[b.priority] || a.slug.localeCompare(b.slug);
});
const propCounts = Object.fromEntries(
  vocabularyProps.map((prop) => [
    prop,
    rows.filter((row) => row.publicVocabulary.some((item) => item.name === prop)).length,
  ]),
);

const report = {
  status: "inventory",
  purpose: "Inventory the public state/variant vocabulary exposed by component contracts before enforcing taxonomy changes in the existing Flow gates.",
  source: path.relative(root, contractsFile),
  taxonomy: path.relative(root, taxonomyFile),
  taxonomySchemaVersion: readJson(taxonomyFile).schemaVersion,
  totalComponents: rows.length,
  componentsWithPublicVocabulary: rows.filter((row) => row.publicVocabulary.length).length,
  familyCounts: countBy(rows, "family"),
  propCounts,
  reviewFlagCounts: flaggedRows.reduce((acc, row) => {
    for (const flag of row.reviewFlags) acc[flag] = (acc[flag] ?? 0) + 1;
    return acc;
  }, {}),
  flaggedComponents: flaggedRows.map((row) => ({
    slug: row.slug,
    family: row.family,
    flags: row.reviewFlags,
  })),
  remediationQueue,
  components: rows,
};

function markdownList(values) {
  return values.length ? values.join(", ") : "-";
}

const markdown = [
  "# State Variant Public Vocabulary Inventory",
  "",
  "Status: **inventory**",
  "",
  report.purpose,
  "",
  "## Summary",
  `- Components: ${report.totalComponents}`,
  `- Components with public vocabulary: ${report.componentsWithPublicVocabulary}`,
  `- Source: ${report.source}`,
  `- Taxonomy: ${report.taxonomy}`,
  "",
  "## Public Prop Counts",
  ...Object.entries(report.propCounts).map(([prop, count]) => `- ${prop}: ${count}`),
  "",
  "## Review Flags",
  ...(Object.keys(report.reviewFlagCounts).length
    ? Object.entries(report.reviewFlagCounts).map(([flag, count]) => `- ${flag}: ${count}`)
    : ["- None"]),
  "",
  "## Remediation Queue",
  ...(remediationQueue.length
    ? remediationQueue.map((item) => `- **${item.priority} ${item.slug}** (${item.family}): ${item.flags.join(", ")}. ${item.remediation}`)
    : ["- None"]),
  "",
  "## Components",
  "| Component | Family | Variants | Intents | States | Public vocabulary | Review flags |",
  "| --- | --- | --- | --- | --- | --- | --- |",
  ...rows.map((row) => [
    row.slug,
    row.family,
    markdownList(row.variants),
    markdownList(row.intents),
    markdownList(row.states),
    markdownList(row.publicVocabulary.map((prop) => prop.name)),
    markdownList(row.reviewFlags),
  ].map((value) => String(value).replace(/\|/g, "\\|")).join(" | ").replace(/^/, "| ").replace(/$/, " |")),
  "",
].join("\n");

if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(markdownOutput, markdown);

console.log(JSON.stringify({
  status: report.status,
  totalComponents: report.totalComponents,
  componentsWithPublicVocabulary: report.componentsWithPublicVocabulary,
  reviewFlagCounts: report.reviewFlagCounts,
  outputs: [path.relative(root, jsonOutput), path.relative(root, markdownOutput)],
}, null, 2));
