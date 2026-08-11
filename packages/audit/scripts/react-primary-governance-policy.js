const { path, readJson, rel, root } = require("./audit-context.js");

const governanceFile = path.join(root, "packages/content/content/react-primary-governance.json");
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

function reactPrimaryExpectedInventory() {
  const expectedInventory = governance.expectedInventory && typeof governance.expectedInventory === "object"
    ? governance.expectedInventory
    : {};
  return {
    expectedInventory,
    governance: {
      file: rel(governanceFile),
      issues: [
        ...(typeof governance.principle === "string" && governance.principle.trim()
          ? []
          : ["principle must describe React primary ownership"]),
        ...validateNumberMap(expectedInventory, "expectedInventory"),
      ],
    },
    principle: governance.principle,
  };
}

function reactSecondaryExpectedInventory(key) {
  const secondary = governance.secondaryExpectedInventories ?? {};
  const expectedInventory = secondary[key] && typeof secondary[key] === "object" ? secondary[key] : {};
  return {
    expectedInventory,
    governance: {
      file: rel(governanceFile),
      key,
      issues: validateNumberMap(expectedInventory, `secondaryExpectedInventories.${key}`),
    },
  };
}

function stringEntries(name, entries, requiredKeys) {
  const issues = [];
  if (!Array.isArray(entries) || !entries.length) {
    issues.push(`${name} must be a non-empty array`);
    return issues;
  }
  entries.forEach((entry, index) => {
    for (const key of requiredKeys) {
      if (typeof entry?.[key] !== "string" || !entry[key].trim()) {
        issues.push(`${name}[${index}].${key} must be a non-empty string`);
      }
    }
  });
  return issues;
}

function controlledMarkersPolicy() {
  const markers = Array.isArray(governance.controlledMarkers) ? governance.controlledMarkers : [];
  return {
    controlledMarkers: markers,
    governance: {
      file: rel(governanceFile),
      key: "controlledMarkers",
      issues: stringEntries("controlledMarkers", markers, ["marker", "prop"]),
    },
  };
}

function governedReactPrimitivesPolicy() {
  const primitives = Array.isArray(governance.governedReactPrimitives) ? governance.governedReactPrimitives : [];
  const issues = stringEntries("governedReactPrimitives", primitives, [
    "id",
    "name",
    "file",
    "typeFile",
    "dataAttribute",
    "packagePath",
    "rootPackagePath",
  ]);
  primitives.forEach((primitive, index) => {
    if (typeof primitive?.id === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(primitive.id)) {
      issues.push(`governedReactPrimitives[${index}].id must be kebab-case`);
    }
    if (typeof primitive?.name === "string" && !/^[A-Z][A-Za-z0-9]*$/.test(primitive.name)) {
      issues.push(`governedReactPrimitives[${index}].name must be PascalCase`);
    }
    if (typeof primitive?.file === "string" && primitive.file !== `${primitive.name}.js`) {
      issues.push(`governedReactPrimitives[${index}].file must match primitive name`);
    }
    if (typeof primitive?.typeFile === "string" && primitive.typeFile !== `${primitive.name}.d.ts`) {
      issues.push(`governedReactPrimitives[${index}].typeFile must match primitive name`);
    }
  });
  const duplicateIds = primitives
    .map((primitive) => primitive.id)
    .filter((id, index, ids) => ids.indexOf(id) !== index);
  if (duplicateIds.length) {
    issues.push(`governedReactPrimitives has duplicate ids: ${[...new Set(duplicateIds)].sort().join(", ")}`);
  }
  return {
    primitives,
    ids: new Set(primitives.map((primitive) => primitive.id)),
    exports: primitives.map((primitive) => primitive.packagePath),
    governance: {
      file: rel(governanceFile),
      key: "governedReactPrimitives",
      issues,
    },
  };
}

function allowedPrimitiveImportsPolicy() {
  const imports = Array.isArray(governance.allowedPrimitiveImports) ? governance.allowedPrimitiveImports : [];
  const issues = [];
  if (!imports.length) {
    issues.push("allowedPrimitiveImports must be a non-empty array");
  }
  for (const name of imports) {
    if (typeof name !== "string" || !/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(name)) {
      issues.push(`invalid allowedPrimitiveImports entry: ${name}`);
    }
  }
  return {
    imports: new Set(imports),
    governance: {
      file: rel(governanceFile),
      key: "allowedPrimitiveImports",
      issues,
    },
  };
}

function styleBlockedEscapePatternsPolicy() {
  const rawPatterns = Array.isArray(governance.styleBlockedEscapePatterns)
    ? governance.styleBlockedEscapePatterns
    : [];
  const issues = stringEntries("styleBlockedEscapePatterns", rawPatterns, ["id", "label", "pattern"]);
  const blockedEscapePatterns = rawPatterns.map((entry, index) => {
    try {
      return {
        id: entry.id,
        label: entry.label,
        pattern: new RegExp(entry.pattern, entry.flags ?? "g"),
      };
    } catch (error) {
      issues.push(`styleBlockedEscapePatterns[${index}] has invalid regex: ${error.message}`);
      return {
        id: entry.id ?? `invalid-${index}`,
        label: entry.label ?? "Invalid pattern",
        pattern: /$a/,
      };
    }
  });
  return {
    blockedEscapePatterns,
    governance: {
      file: rel(governanceFile),
      key: "styleBlockedEscapePatterns",
      issues,
    },
  };
}

function semanticDefaultExpectedByRulePolicy() {
  const expectedSemanticByRule = governance.semanticDefaultExpectedByRule ?? {};
  const issues = [];
  if (!expectedSemanticByRule || typeof expectedSemanticByRule !== "object") {
    issues.push("semanticDefaultExpectedByRule must be an object");
  }
  for (const [key, expected] of Object.entries(expectedSemanticByRule)) {
    if (!/^[a-z][a-z0-9-]*$/.test(key) || !Number.isInteger(expected) || expected < 0) {
      issues.push(`invalid semanticDefaultExpectedByRule entry: ${key}`);
    }
  }
  return {
    expectedSemanticByRule,
    governance: {
      file: rel(governanceFile),
      key: "semanticDefaultExpectedByRule",
      issues,
    },
  };
}

function accessibilityCriticalRequirementsPolicy() {
  const rawRequirements = governance.accessibilityCriticalRequirements ?? {};
  const issues = [];
  if (!rawRequirements || typeof rawRequirements !== "object") {
    issues.push("accessibilityCriticalRequirements must be an object");
  }
  const criticalRequirements = {};
  for (const [component, requirements] of Object.entries(rawRequirements)) {
    if (!/^[A-Z][A-Za-z0-9]*$/.test(component)) issues.push(`invalid accessibility critical component: ${component}`);
    if (!Array.isArray(requirements) || !requirements.length) {
      issues.push(`accessibilityCriticalRequirements.${component} must be a non-empty array`);
      continue;
    }
    criticalRequirements[component] = requirements.map((requirement, index) => {
      if (typeof requirement?.label !== "string" || !requirement.label.trim()) {
        issues.push(`accessibilityCriticalRequirements.${component}[${index}].label must be a non-empty string`);
      }
      if (typeof requirement?.pattern !== "string" || !requirement.pattern.trim()) {
        issues.push(`accessibilityCriticalRequirements.${component}[${index}].pattern must be a non-empty string`);
        return { label: requirement?.label ?? `invalid-${index}`, pattern: /$a/ };
      }
      try {
        return {
          label: requirement.label,
          pattern: new RegExp(requirement.pattern),
        };
      } catch (error) {
        issues.push(`accessibilityCriticalRequirements.${component}[${index}] has invalid regex: ${error.message}`);
        return { label: requirement.label, pattern: /$a/ };
      }
    });
  }
  return {
    criticalRequirements,
    criticalComponents: Object.keys(criticalRequirements).sort(),
    governance: {
      file: rel(governanceFile),
      key: "accessibilityCriticalRequirements",
      issues,
    },
  };
}

function compileRuleEntries(name, entries, requiredKeys = ["id", "description", "pattern"]) {
  const issues = stringEntries(name, entries, requiredKeys);
  const rules = (Array.isArray(entries) ? entries : []).map((entry, index) => {
    try {
      return {
        id: entry.id,
        prop: entry.prop,
        description: entry.description,
        pattern: new RegExp(entry.pattern),
      };
    } catch (error) {
      issues.push(`${name}[${index}] has invalid regex: ${error.message}`);
      return {
        id: entry.id ?? `invalid-${index}`,
        prop: entry.prop,
        description: entry.description ?? "Invalid rule",
        pattern: /$a/,
      };
    }
  });
  return { rules, issues };
}

function defaultGovernanceRulesPolicy() {
  const prohibited = compileRuleEntries("defaultProhibitedRules", governance.defaultProhibitedRules, ["id", "description", "pattern"]);
  const semantic = compileRuleEntries("defaultSemanticRules", governance.defaultSemanticRules, ["id", "prop", "description", "pattern"]);
  return {
    prohibitedRules: prohibited.rules,
    semanticRules: semantic.rules,
    governance: {
      file: rel(governanceFile),
      key: "defaultGovernanceRules",
      issues: [...prohibited.issues, ...semantic.issues],
    },
  };
}

module.exports = {
  accessibilityCriticalRequirementsPolicy,
  allowedPrimitiveImportsPolicy,
  controlledMarkersPolicy,
  defaultGovernanceRulesPolicy,
  governedReactPrimitivesPolicy,
  reactPrimaryExpectedInventory,
  reactSecondaryExpectedInventory,
  semanticDefaultExpectedByRulePolicy,
  styleBlockedEscapePatternsPolicy,
};
