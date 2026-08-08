const { fs, path, root, docsAppDir, read, add } = require("./audit-context.js");
const {
  classRootTokensFromClassExpression,
  classTokensFromClassExpression,
  packageCssClassRoots: packageCssClassRootsForRoot,
  reactSupportClassRoots,
} = require("./class-root-governance.js");

const docsAllowedComponentAuthors = new Set([
  "apps/docs/component-demo.js",
  "apps/docs/react-component-islands.js",
]);

const docsAllowedPackageClassTokens = new Map([
  ["apps/docs/docs-layout.js", new Set(["tag"])],
]);
const docsAppDirs = [
  path.join(root, "apps/docs"),
  path.join(root, "../FlowDocs/apps/docs"),
].filter((dir) => fs.existsSync(dir));

const componentClassRoots = new Set([
  "accordion",
  "animated-moment",
  "audit-event",
  "avatar",
  "badge",
  "biometric-prompt",
  "breadcrumbs",
  "button",
  "card",
  "card-expiry-input",
  "card-number-input",
  "card-security-code-input",
  "card-summary",
  "chart-panel",
  "checkbox",
  "choice",
  "chip",
  "code-input",
  "combobox",
  "country-flag",
  "country-selector",
  "date-picker",
  "date-range-picker",
  "dialog",
  "drawer",
  "empty-state",
  "error-panel",
  "fab",
  "field",
  "icon-button",
  "inline-validation",
  "kpi-tile",
  "list",
  "menu",
  "motion-boundary",
  "movement-row",
  "pagination",
  "phone-input",
  "popover",
  "progress",
  "quick-action",
  "radio",
  "route-summary",
  "segmented-control",
  "select",
  "select-control",
  "skeleton",
  "slider",
  "spinner",
  "station-pin",
  "stepper",
  "switch",
  "table",
  "tabs",
  "tag",
  "text-area",
  "toast",
  "tooltip",
  "tree-view",
]);

const duplicateConceptClassPatterns = [
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
const protectedComponentRoots = new Set(["button", "card", "dialog", "drawer", "menu", "popover"]);

function checkAntiDuplicationGovernance() {
  checkDocsDoNotOwnPackageComponentMarkup();
  checkKnownDuplicateConcepts();
  checkPrimitiveInteractiveDomFactories();
  checkReactOnlyComponentBoundaries();
  checkReactComponentClassOwnership();
}

function antiDuplicationCoverage() {
  return {
    docsApps: docsAppDirs.map((dir) => normalize(path.relative(root, dir))),
    componentClassRoots: [...componentClassRoots].sort(),
    duplicateConcepts: duplicateConceptClassPatterns.map((item) => ({
      concept: item.concept,
      classNames: item.classNames,
    })),
    protectedComponentRoots: [...protectedComponentRoots].sort(),
    reactSupportClassRoots: [...reactSupportClassRoots].sort(),
    docsAllowedComponentAuthors: [...docsAllowedComponentAuthors].sort(),
    docsAllowedPackageClassTokens: [...docsAllowedPackageClassTokens.entries()].map(([file, tokens]) => ({
      file,
      tokens: [...tokens].sort(),
    })),
    checks: [
      "docs package component class ownership",
      "known duplicate concept classes",
      "primitive interactive DOM factories",
      "React-only component boundaries",
      "React component class ownership",
    ],
  };
}

function checkDocsDoNotOwnPackageComponentMarkup() {
  for (const dir of docsAppDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const relativeFile = docsRelativeFile(file, dir);
      if (relativeFile.includes("/generated/")) continue;
      if (docsAllowedComponentAuthors.has(relativeFile)) continue;
      const source = read(file);
      const classStrings = [...source.matchAll(/\bclass(?:Name)?\s*[:=]\s*["'`]([^"'`]+)["'`]/g)];
      for (const match of classStrings) {
        const tokens = match[1].split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          if (docsAllowedPackageClassTokens.get(relativeFile)?.has(token)) continue;
          const rootToken = componentRootForClassToken(token);
          if (!rootToken) continue;
          add(
            "errors",
            file,
            lineForIndex(source, match.index),
            `Docs must not author Package component class "${token}" directly; compose ${rootToken} through componentDemo()/packageDemo()/React.`
          );
        }
      }
    }
  }
}

function checkKnownDuplicateConcepts() {
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
    for (const check of duplicateConceptClassPatterns) {
      for (const match of classStrings) {
        const tokens = match[1].split(/\s+/).filter(Boolean);
        if (tokens.some((token) => check.classNames.includes(token))) {
          add("errors", file, lineForIndex(source, match.index), `${check.concept}: ${check.message}`);
        }
      }
      for (const match of cssSelectors) {
        if (check.classNames.includes(match[2])) {
          add("errors", file, lineForIndex(source, match.index), `${check.concept}: ${check.message}`);
        }
      }
    }
  }
}

function checkPrimitiveInteractiveDomFactories() {
  const primitivesDir = path.join(root, "packages/components/src/primitives");
  if (!fs.existsSync(primitivesDir)) return;
  for (const file of walkFiles(primitivesDir, (candidate) => /\.js$/.test(candidate))) {
    const source = read(file);
    for (const match of source.matchAll(/document\.createElement\(\s*["'`](button|input|select|textarea)["'`]\s*\)/g)) {
      add(
        "errors",
        file,
        lineForIndex(source, match.index),
        `Primitives must not create interactive ${match[1]} DOM controls; React components own product interaction surfaces.`
      );
    }
  }
}

function checkReactOnlyComponentBoundaries() {
  const contractsFile = path.join(root, "packages/components/src/contracts.js");
  const smokeFile = path.join(root, "packages/components/test/smoke.test.mjs");
  const componentsDir = path.join(root, "packages/components/src/components");
  const platformsDir = path.join(root, "packages/components/src/platforms");
  const reactDir = path.join(root, "packages/react/src");
  const reactComponents = fs.existsSync(reactDir)
    ? fs.readdirSync(reactDir).filter((file) => /^[A-Z].*\.js$/.test(file)).map((file) => path.basename(file, ".js")).sort()
    : [];

  for (const file of walkFiles(componentsDir, (candidate) => /\.js$/.test(candidate))) {
    const source = read(file);
    for (const match of source.matchAll(/export function ((?:create|hydrate)[A-Z][A-Za-z0-9]*)\b/g)) {
      const name = match[1];
      add(
        "errors",
        file,
        lineForIndex(source, match.index),
        `${name} must not live in packages/components/src/components; React is the primary product implementation and DOM factories/hydrators are not allowed.`
      );
    }
  }

  const contractsSource = fs.existsSync(contractsFile) ? read(contractsFile) : "";
  const smokeSource = fs.existsSync(smokeFile) ? read(smokeFile) : "";
  const internalFactoryMatch = /internalFactory\s*:/.exec(contractsSource);
  if (internalFactoryMatch) {
    add("errors", contractsFile, lineForIndex(contractsSource, internalFactoryMatch.index), "Component contracts must not expose internalFactory; React package exports are the implementation contract.");
  }

  if (fs.existsSync(platformsDir)) {
    for (const file of walkFiles(platformsDir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const platformInternalFactoryMatch = /internalFactory\s*:/.exec(source);
      if (platformInternalFactoryMatch) {
        add("errors", file, lineForIndex(source, platformInternalFactoryMatch.index), "Platform contracts must not expose internalFactory; React package exports are the implementation contract.");
      }
    }
  }

  for (const componentName of reactComponents) {
    const label = labelForComponentName(componentName);
    const forbiddenFactory = new RegExp(`\\b(?:create|hydrate)(?:Transitional)?[A-Za-z0-9]*${componentName}\\b`);
    const contractMatch = forbiddenFactory.exec(contractsSource);
    if (contractMatch) {
      add("errors", contractsFile, lineForIndex(contractsSource, contractMatch.index), `${label} contract must not name a DOM factory or hydrator; React ${componentName} owns the implementation.`);
    }
    const smokeMatch = forbiddenFactory.exec(smokeSource);
    if (smokeMatch) {
      add("errors", smokeFile, lineForIndex(smokeSource, smokeMatch.index), `${label} smoke coverage must use React render tests, not DOM factory or hydrator coverage.`);
    }
  }
}

function checkReactComponentClassOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const packageRoots = packageCssClassRoots();
  for (const file of fs.readdirSync(reactDir).filter((candidate) => /^[A-Z].*\.js$/.test(candidate)).sort()) {
    const componentName = path.basename(file, ".js");
    const sourceFile = path.join(reactDir, file);
    const source = read(sourceFile);
    const allowedRoots = allowedClassRootsForReactComponent(componentName);
    const ownerRoot = ownerClassRootForReactComponent(componentName);
    for (const match of source.matchAll(/\bclassName\s*:\s*(?:\[([^\]]+)\]|["'`]([^"'`]+)["'`])/g)) {
      const roots = classRootTokensFromClassExpression(match[1] ?? match[2] ?? "");
      const componentRoots = [...roots].filter((rootToken) => componentClassRoots.has(rootToken));
      const unknownRoots = [...roots].filter((rootToken) => packageRoots.has(rootToken) && !componentClassRoots.has(rootToken) && !reactSupportClassRoots.has(rootToken));
      const protectedCrossRoots = componentRoots.filter((rootToken) => protectedComponentRoots.has(rootToken) && rootToken !== ownerRoot);
      const illegalRoots = [...new Set(componentRoots.filter((rootToken) => !allowedRoots.has(rootToken)).concat(protectedCrossRoots, unknownRoots))];
      const protectedLeaks = illegalRoots.filter((rootToken) => protectedComponentRoots.has(rootToken));
      if (!illegalRoots.length) continue;
      add(
        "errors",
        sourceFile,
        lineForIndex(source, match.index),
        `${componentName} must not author another component visual root (${illegalRoots.join(", ")}); compose ${protectedLeaks.length ? "the protected React component" : "that React component"} instead of duplicating its classes.`
      );
    }
  }
}

function allowedClassRootsForReactComponent(componentName) {
  const explicit = {
    CardExpiryInput: ["card-expiry-input", "field"],
    CardNumberInput: ["card-number-input", "field"],
    CardSecurityCodeInput: ["card-security-code-input", "field"],
    Checkbox: ["checkbox", "choice"],
    CodeInput: ["code-input", "field"],
    Combobox: ["combobox", "field", "select-control"],
    CountrySelector: ["country-flag", "country-selector", "select-control"],
    DatePicker: ["date-picker", "field"],
    DateRangePicker: ["date-picker", "date-range-picker", "field"],
    FloatingActionButton: ["fab"],
    InlineValidation: ["inline-validation"],
    Input: ["field"],
    KpiTile: ["kpi-tile"],
    MotionBoundary: ["motion-boundary"],
    MovementRow: ["movement-row"],
    PhoneInput: ["country-flag", "country-selector", "field", "phone-input", "select-control"],
    ProgressIndicator: ["progress"],
    RadioButton: ["choice", "radio"],
    RouteSummary: ["route-summary"],
    SegmentedControl: ["segmented-control"],
    Select: ["field", "select-control"],
    TextArea: ["field", "text-area"],
    TreeView: ["tree-view"],
  }[componentName];
  return new Set(explicit ?? [kebab(componentName)]);
}

function ownerClassRootForReactComponent(componentName) {
  return {
    FloatingActionButton: "fab",
    ProgressIndicator: "progress",
    RadioButton: "radio",
  }[componentName] ?? kebab(componentName);
}

function classRootsFromClassExpression(value) {
  const roots = new Set();
  for (const token of classTokensFromClassExpression(value)) {
    const rootToken = componentRootForClassToken(token);
    if (rootToken) roots.add(rootToken);
  }
  return roots;
}

function componentRootForClassToken(token) {
  for (const rootToken of componentClassRoots) {
    if (token === rootToken || token.startsWith(`${rootToken}__`) || token.startsWith(`${rootToken}--`)) {
      return rootToken;
    }
  }
  return "";
}

function packageCssClassRoots() {
  return packageCssClassRootsForRoot(root);
}

function walkFiles(dir, matcher, output = []) {
  if (!fs.existsSync(dir)) return output;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["generated", "node_modules", "vendor", "dist", "repo-split-output"].includes(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkFiles(fullPath, matcher, output);
      continue;
    }
    if (matcher(fullPath)) output.push(fullPath);
  }
  return output;
}

function normalize(value) {
  return value.split(path.sep).join("/");
}

function docsRelativeFile(file, docsDir) {
  return `apps/docs/${normalize(path.relative(docsDir, file))}`;
}

function labelForComponentName(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
}

function kebab(value) {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
}

function lineForIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

module.exports = {
  allowedClassRootsForReactComponent,
  checkAntiDuplicationGovernance,
  antiDuplicationCoverage,
  classRootTokensFromClassExpression,
  classRootsFromClassExpression,
  componentClassRoots,
  ownerClassRootForReactComponent,
  packageCssClassRoots,
  protectedComponentRoots,
  reactSupportClassRoots,
};
