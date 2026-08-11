const { fs, path, read, readJson, root } = require("./audit-context.js");

const conceptsFile = path.join(root, "packages/content/content/anti-duplication-concepts.json");

function blockedConceptClassPatterns() {
  return readJson(conceptsFile)?.blockedConceptClassPatterns ?? [];
}

function classRootPolicy() {
  const policy = readJson(conceptsFile)?.classRootPolicy ?? {};
  return {
    extensionRoots: Array.isArray(policy.extensionRoots) ? policy.extensionRoots : [],
    protectedComponentRoots: Array.isArray(policy.protectedComponentRoots) ? policy.protectedComponentRoots : [],
    reason: typeof policy.reason === "string" ? policy.reason : "",
  };
}

function docsAllowedPackageClassTokens() {
  const entries = readJson(conceptsFile)?.docsAllowedPackageClassTokens ?? [];
  return entries
    .filter((entry) => typeof entry.file === "string" && Array.isArray(entry.tokens))
    .map((entry) => ({
      file: entry.file,
      tokens: entry.tokens,
      reason: typeof entry.reason === "string" ? entry.reason : "",
    }));
}

function conceptContractIssues() {
  if (!fs.existsSync(conceptsFile)) {
    return [{ file: conceptsFile, message: "Anti-duplication concept contract must exist." }];
  }
  const json = readJson(conceptsFile);
  const rules = json?.blockedConceptClassPatterns;
  if (!Array.isArray(rules)) {
    return [{ file: conceptsFile, message: "Anti-duplication concept contract must list blockedConceptClassPatterns." }];
  }
  const issues = [];
  const policy = json?.classRootPolicy;
  if (!policy) {
    issues.push({ file: conceptsFile, message: "Anti-duplication concept contract must include classRootPolicy." });
  } else {
    for (const field of ["extensionRoots", "protectedComponentRoots"]) {
      if (!Array.isArray(policy[field]) || !policy[field].length) {
        issues.push({ file: conceptsFile, message: `classRootPolicy.${field} must be a non-empty array.` });
      } else {
        const duplicates = policy[field].filter((rootToken, index) => policy[field].indexOf(rootToken) !== index);
        if (duplicates.length) {
          issues.push({ file: conceptsFile, message: `classRootPolicy.${field} must not duplicate roots: ${[...new Set(duplicates)].join(", ")}.` });
        }
        for (const rootToken of policy[field]) {
          if (typeof rootToken !== "string" || !/^[a-z][a-z0-9-]*$/.test(rootToken)) {
            issues.push({ file: conceptsFile, message: `classRootPolicy.${field} has invalid root: ${rootToken}.` });
          }
        }
      }
    }
    if (typeof policy.reason !== "string" || !policy.reason.trim()) {
      issues.push({ file: conceptsFile, message: "classRootPolicy.reason must explain the class root boundary." });
    }
  }
  const concepts = rules.map((rule) => rule.concept).filter(Boolean);
  const duplicateConcepts = concepts.filter((concept, index) => concepts.indexOf(concept) !== index);
  if (duplicateConcepts.length) {
    issues.push({ file: conceptsFile, message: `Anti-duplication concepts must not duplicate concept names: ${[...new Set(duplicateConcepts)].join(", ")}.` });
  }
  const classNames = rules.flatMap((rule) => Array.isArray(rule.classNames) ? rule.classNames : []);
  const duplicateClassNames = classNames.filter((className, index) => classNames.indexOf(className) !== index);
  if (duplicateClassNames.length) {
    issues.push({ file: conceptsFile, message: `Anti-duplication concepts must not duplicate blocked class names: ${[...new Set(duplicateClassNames)].join(", ")}.` });
  }
  for (const rule of rules) {
    for (const field of ["concept", "message"]) {
      if (typeof rule[field] !== "string" || !rule[field].trim()) {
        issues.push({ file: conceptsFile, message: `Anti-duplication concept rule must include ${field}.` });
      }
    }
    if (!Array.isArray(rule.classNames) || !rule.classNames.length) {
      issues.push({ file: conceptsFile, message: `${rule.concept ?? "Unknown concept"} must list blocked classNames.` });
    } else {
      for (const className of rule.classNames) {
        if (typeof className !== "string" || !/^[a-z0-9_-]+$/.test(className)) {
          issues.push({ file: conceptsFile, message: `${rule.concept ?? "Unknown concept"} has invalid blocked class name: ${className}.` });
        }
      }
    }
  }
  const docsAllowedTokens = json?.docsAllowedPackageClassTokens;
  if (!Array.isArray(docsAllowedTokens)) {
    issues.push({ file: conceptsFile, message: "Anti-duplication concept contract must list docsAllowedPackageClassTokens." });
  } else {
    const files = docsAllowedTokens.map((entry) => entry.file).filter(Boolean);
    const duplicateFiles = files.filter((fileName, index) => files.indexOf(fileName) !== index);
    if (duplicateFiles.length) {
      issues.push({ file: conceptsFile, message: `docsAllowedPackageClassTokens must not duplicate files: ${[...new Set(duplicateFiles)].join(", ")}.` });
    }
    for (const entry of docsAllowedTokens) {
      if (typeof entry.file !== "string" || !/^apps\/docs\/[a-z0-9_./-]+\.js$/.test(entry.file)) {
        issues.push({ file: conceptsFile, message: `docsAllowedPackageClassTokens has invalid file: ${entry.file}.` });
      }
      if (!Array.isArray(entry.tokens) || !entry.tokens.length) {
        issues.push({ file: conceptsFile, message: `${entry.file ?? "Unknown docs file"} must list allowed tokens.` });
      } else {
        const duplicates = entry.tokens.filter((token, index) => entry.tokens.indexOf(token) !== index);
        if (duplicates.length) {
          issues.push({ file: conceptsFile, message: `${entry.file} must not duplicate allowed tokens: ${[...new Set(duplicates)].join(", ")}.` });
        }
        for (const token of entry.tokens) {
          if (typeof token !== "string" || !/^[a-z][a-z0-9-]*(?:__[a-z0-9-]+|--[a-z0-9-]+)?$/.test(token)) {
            issues.push({ file: conceptsFile, message: `${entry.file} has invalid allowed package class token: ${token}.` });
          }
        }
      }
      if (typeof entry.reason !== "string" || !entry.reason.trim()) {
        issues.push({ file: conceptsFile, message: `${entry.file ?? "Unknown docs file"} must explain why its package class token allowlist exists.` });
      }
    }
  }
  return issues;
}

function blockedConceptRules() {
  return blockedConceptClassPatterns().map((item) => ({
    concept: item.concept,
    classNames: item.classNames,
    message: item.message,
  }));
}

function knownDuplicateConceptViolations({ docsAppDirs, lineForIndex, normalize, walkFiles }) {
  const violations = [];
  const files = [
    ...walkFiles(path.join(root, "apps"), (candidate) => /\.(?:css|html|js)$/.test(candidate)),
    ...docsAppDirs.flatMap((dir) => walkFiles(dir, (candidate) => /\.(?:css|html|js)$/.test(candidate))),
    ...walkFiles(path.join(root, "packages"), (candidate) => /\.(?:css|html|js|mjs|ts|tsx)$/.test(candidate)),
  ];
  for (const file of files) {
    const relativeFile = normalize(path.relative(root, file));
    if (relativeFile.includes("/generated/") || relativeFile.includes("/dist/") || relativeFile.startsWith("packages/audit/")) continue;
    const source = read(file);
    const classStrings = [...source.matchAll(/\bclass(?:Name)?\s*[:=]\s*["'`]([^"'`]+)["'`]/g)];
    const cssSelectors = [...source.matchAll(/(^|[,{]\s*)\.([a-z0-9_-]+)(?=[\s.#:[,{>+~])/gim)];
    for (const check of blockedConceptClassPatterns()) {
      for (const match of classStrings) {
        const tokens = match[1].split(/\s+/).filter(Boolean);
        const blockedToken = tokens.find((token) => check.classNames.includes(token));
        if (blockedToken) {
          violations.push({
            concept: check.concept,
            className: blockedToken,
            file,
            line: lineForIndex(source, match.index),
            source: relativeFile,
            message: check.message,
          });
        }
      }
      for (const match of cssSelectors) {
        if (check.classNames.includes(match[2])) {
          violations.push({
            concept: check.concept,
            className: match[2],
            file,
            line: lineForIndex(source, match.index),
            source: relativeFile,
            message: check.message,
          });
        }
      }
    }
  }
  return violations;
}

module.exports = {
  blockedConceptRules,
  classRootPolicy,
  conceptContractIssues,
  docsAllowedPackageClassTokens,
  knownDuplicateConceptViolations,
};
