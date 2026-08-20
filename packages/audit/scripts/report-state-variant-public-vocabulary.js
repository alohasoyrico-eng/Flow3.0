#!/usr/bin/env node

const {
  fs,
  path,
  read,
  root,
} = require("./audit-context.js");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "state-variant-public-vocabulary.json");
const markdownOutput = path.join(outputDir, "state-variant-public-vocabulary.md");
const contractsFile = path.join(root, "packages/components/src/contracts.js");

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

  if (family === "actions" && variants.includes("accent")) {
    flags.push("action-variant-accent");
  }
  if (family === "actions" && variants.includes("tonal")) {
    flags.push("action-variant-tonal-review");
  }
  if (props.has("variant") && !variants.length) {
    flags.push("variant-prop-without-contract-variants");
  }
  if (states.includes("disabled") && !props.has("disabled")) {
    flags.push("disabled-state-without-disabled-prop");
  }
  if (states.includes("loading") && !props.has("loading") && !["feedback", "motion-feedback", "progress-feedback"].includes(family)) {
    flags.push("loading-state-without-loading-prop");
  }
  if (states.includes("selected") && !props.has("selected") && !["navigation", "choices", "fields", "overlays"].includes(family)) {
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
  "",
  "## Public Prop Counts",
  ...Object.entries(report.propCounts).map(([prop, count]) => `- ${prop}: ${count}`),
  "",
  "## Review Flags",
  ...(Object.keys(report.reviewFlagCounts).length
    ? Object.entries(report.reviewFlagCounts).map(([flag, count]) => `- ${flag}: ${count}`)
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
