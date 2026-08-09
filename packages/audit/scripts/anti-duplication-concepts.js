const { fs, path, read, root } = require("./audit-context.js");

const blockedConceptClassPatterns = [
  {
    concept: "search",
    classNames: ["pattern-topbar-search", "topbar-search", "top-search", "pattern-search-results"],
    message: "Search must use searchSlotMarkup/search-slot as the single visual source; do not keep a parallel topbar search implementation.",
  },
  {
    concept: "account menu",
    classNames: ["pattern-account-menu"],
    message: "Account menu must use avatarMenuMarkup as the single visual source; do not keep a parallel account menu implementation.",
  },
];

function blockedConceptRules() {
  return blockedConceptClassPatterns.map((item) => ({
    concept: item.concept,
    classNames: item.classNames,
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
    for (const check of blockedConceptClassPatterns) {
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
  knownDuplicateConceptViolations,
};
