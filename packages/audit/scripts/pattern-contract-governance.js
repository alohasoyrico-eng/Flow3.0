const {
  fs,
  path,
  root,
} = require("./audit-context.js");

const governanceFile = path.join(root, "packages/content/content/pattern-contract-governance.json");

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))].sort();
}

function stringArray(value, key, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${key} must be an array.`);
    return [];
  }
  const normalized = value.filter((item) => typeof item === "string" && item.trim());
  if (normalized.length !== value.length) issues.push(`${key} must contain only non-empty strings.`);
  const duplicates = normalized.filter((item, index) => normalized.indexOf(item) !== index);
  if (duplicates.length) issues.push(`${key} has duplicate values: ${unique(duplicates).join(", ")}.`);
  return normalized;
}

function numberMap(value, key, issues) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push(`${key} must be an object keyed by metric name.`);
    return {};
  }
  return Object.fromEntries(Object.entries(value).filter(([metric, expected]) => {
    const valid = typeof metric === "string" && metric.trim() && Number.isFinite(expected);
    if (!valid) issues.push(`${key}.${metric} must be a finite number.`);
    return valid;
  }));
}

function demoCompositionPolicy(raw, issues) {
  const value = raw.demoCompositionPolicy ?? {};
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push("demoCompositionPolicy must be an object.");
    return {
      sharedHelperNames: [],
      localControlRules: [],
      specificRules: [],
    };
  }
  const localControlRules = Array.isArray(value.localControlRules) ? value.localControlRules.map((rule, index) => {
    const ids = stringArray(rule?.ids, `demoCompositionPolicy.localControlRules.${index}.ids`, issues);
    const tags = stringArray(rule?.tags, `demoCompositionPolicy.localControlRules.${index}.tags`, issues);
    const file = typeof rule?.file === "string" && rule.file.trim() ? rule.file : "";
    const message = typeof rule?.message === "string" && rule.message.trim() ? rule.message : "";
    if (!file) issues.push(`demoCompositionPolicy.localControlRules.${index}.file must be a non-empty string.`);
    if (!message) issues.push(`demoCompositionPolicy.localControlRules.${index}.message must be a non-empty string.`);
    return { ids, tags, file, message };
  }) : [];
  if (!Array.isArray(value.localControlRules)) issues.push("demoCompositionPolicy.localControlRules must be an array.");
  if (Array.isArray(value.localControlRules) && !value.localControlRules.length) {
    issues.push("demoCompositionPolicy.localControlRules must declare at least one local-control guard.");
  }
  const specificRules = Array.isArray(value.specificRules) ? value.specificRules.map((rule, index) => {
    const id = typeof rule?.id === "string" && rule.id.trim() ? rule.id : "";
    const file = typeof rule?.file === "string" && rule.file.trim() ? rule.file : "";
    const pattern = typeof rule?.pattern === "string" && rule.pattern.trim() ? rule.pattern : "";
    const message = typeof rule?.message === "string" && rule.message.trim() ? rule.message : "";
    if (!id) issues.push(`demoCompositionPolicy.specificRules.${index}.id must be a non-empty string.`);
    if (!file) issues.push(`demoCompositionPolicy.specificRules.${index}.file must be a non-empty string.`);
    if (!pattern) issues.push(`demoCompositionPolicy.specificRules.${index}.pattern must be a non-empty string.`);
    if (!message) issues.push(`demoCompositionPolicy.specificRules.${index}.message must be a non-empty string.`);
    return { id, file, pattern, message };
  }) : [];
  if (!Array.isArray(value.specificRules)) issues.push("demoCompositionPolicy.specificRules must be an array.");
  if (Array.isArray(value.specificRules) && !value.specificRules.length) {
    issues.push("demoCompositionPolicy.specificRules must declare at least one specific demo guard.");
  }
  const sharedHelperNames = stringArray(value.sharedHelperNames, "demoCompositionPolicy.sharedHelperNames", issues);
  if (!sharedHelperNames.length) {
    issues.push("demoCompositionPolicy.sharedHelperNames must declare shared helper names.");
  }
  return {
    sharedHelperNames,
    localControlRules,
    specificRules,
  };
}

function stringMap(value, key, issues) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    issues.push(`${key} must be an object keyed by pattern id.`);
    return {};
  }
  return Object.fromEntries(Object.entries(value).filter(([id, reason]) => {
    const valid = typeof id === "string" && id.trim() && typeof reason === "string" && reason.trim();
    if (!valid) issues.push(`${key}.${id} must have a non-empty string reason.`);
    return valid;
  }).sort(([a], [b]) => a.localeCompare(b)));
}

function readPatternContractGovernance() {
  const issues = [];
  const raw = fs.existsSync(governanceFile) ? readJson(governanceFile) : {};
  if (!raw.version) issues.push("pattern contract governance is missing version.");
  if (!raw.reason) issues.push("pattern contract governance is missing reason.");
  const requiredPatternContracts = unique(stringArray(raw.requiredPatternContracts, "requiredPatternContracts", issues));
  const requiredMarkdownSections = stringArray(raw.requiredMarkdownSections, "requiredMarkdownSections", issues);
  const requiredDemosRaw = raw.requiredDemos ?? {};
  if (!requiredDemosRaw || typeof requiredDemosRaw !== "object" || Array.isArray(requiredDemosRaw)) {
    issues.push("requiredDemos must be an object keyed by pattern id.");
  }
  const requiredDemos = Object.fromEntries(Object.entries(
    requiredDemosRaw && typeof requiredDemosRaw === "object" && !Array.isArray(requiredDemosRaw)
      ? requiredDemosRaw
      : {},
  ).map(([id, demo]) => {
    const fn = typeof demo?.fn === "string" && demo.fn.trim() ? demo.fn : "";
    if (!fn) issues.push(`requiredDemos.${id}.fn must be a non-empty string.`);
    return [id, {
      fn,
      components: stringArray(demo?.components, `requiredDemos.${id}.components`, issues),
    }];
  }));
  const requiredDemoExemptions = stringMap(
    raw.requiredDemoExemptions,
    "requiredDemoExemptions",
    issues,
  );
  Object.keys(requiredDemoExemptions).forEach((id) => {
    if (!requiredPatternContracts.includes(id)) {
      issues.push(`requiredDemoExemptions.${id} must reference a required pattern contract.`);
    }
    if (requiredDemos[id]) {
      issues.push(`requiredDemoExemptions.${id} duplicates a required demo.`);
    }
  });
  Object.keys(requiredDemos).forEach((id) => {
    if (!requiredPatternContracts.includes(id)) {
      issues.push(`requiredDemos.${id} must reference a required pattern contract.`);
    }
  });
  const readinessExpectedInventory = numberMap(
    raw.readinessExpectedInventory,
    "readinessExpectedInventory",
    issues,
  );
  const approvedFormalArtifactsMissingCatalog = stringMap(
    raw.approvedFormalArtifactsMissingCatalog,
    "approvedFormalArtifactsMissingCatalog",
    issues,
  );
  const contractGovernanceExpectedInventory = numberMap(
    raw.contractGovernanceExpectedInventory,
    "contractGovernanceExpectedInventory",
    issues,
  );
  return {
    file: governanceFile,
    raw,
    issues,
    requiredPatternContracts,
    requiredMarkdownSections,
    requiredDemos,
    requiredDemoExemptions,
    approvedFormalArtifactsMissingCatalog,
    readinessExpectedInventory,
    contractGovernanceExpectedInventory,
    demoCompositionPolicy: demoCompositionPolicy(raw, issues),
  };
}

module.exports = {
  readPatternContractGovernance,
};
