const { path, readJson, rel, root } = require("./audit-context.js");

const governanceFile = path.join(root, "packages/content/content/component-css-governance.json");
const governance = readJson(governanceFile) ?? {};

function validateNumberMap(map, label) {
  const issues = [];
  if (!map || typeof map !== "object") {
    issues.push(`${label} must be an object`);
    return issues;
  }
  for (const [key, expected] of Object.entries(map)) {
    if (!/^[a-z][a-zA-Z0-9]*$/.test(key) || !Number.isInteger(expected) || expected < 0) {
      issues.push(`invalid ${label} entry: ${key}`);
    }
  }
  return issues;
}

function validateFamilyCssContracts(contracts) {
  const issues = [];
  if (!contracts || typeof contracts !== "object") {
    issues.push("familyCssContracts must be an object");
    return issues;
  }
  for (const [component, contract] of Object.entries(contracts)) {
    if (!/^[a-z0-9-]+$/.test(component)) issues.push(`invalid family component id: ${component}`);
    if (typeof contract.contract !== "string" || !contract.contract.trim()) issues.push(`missing family contract for ${component}`);
    if (typeof contract.requiredRoot !== "string" || !contract.requiredRoot.trim()) issues.push(`missing family requiredRoot for ${component}`);
    if (!Array.isArray(contract.allowedExtensionRoots)) issues.push(`allowedExtensionRoots must be an array for ${component}`);
  }
  return issues;
}

function componentCssGovernance() {
  const familyCssContracts = governance.familyCssContracts && typeof governance.familyCssContracts === "object"
    ? governance.familyCssContracts
    : {};
  return {
    expectedInventory: governance.expectedInventory ?? {},
    expectedFamilyContracts: Array.isArray(governance.expectedFamilyContracts) ? governance.expectedFamilyContracts : [],
    familyCssContracts,
    governance: {
      file: rel(governanceFile),
      issues: [
        ...(typeof governance.principle === "string" && governance.principle.trim()
          ? []
          : ["principle must describe component CSS cascade ownership"]),
        ...validateNumberMap(governance.expectedInventory, "expectedInventory"),
        ...validateFamilyCssContracts(familyCssContracts),
      ],
    },
  };
}

function packageCssRootGovernance() {
  return {
    expectedInventory: governance.packageCssRootExpectedInventory ?? {},
    governance: {
      file: rel(governanceFile),
      issues: validateNumberMap(governance.packageCssRootExpectedInventory, "packageCssRootExpectedInventory"),
    },
  };
}

module.exports = {
  componentCssGovernance,
  packageCssRootGovernance,
};
