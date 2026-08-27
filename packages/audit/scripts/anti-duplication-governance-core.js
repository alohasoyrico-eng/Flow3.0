const { fs, goldComponents, path, root, docsAppDir, read, add } = require("./audit-context.js");
const {
  classRootTokensFromClassExpression,
  classTokensFromClassExpression,
  packageCssClassRoots: packageCssClassRootsForRoot,
  reactSupportClassRoots,
} = require("./class-root-governance.js");
const {
  blockedConceptRules,
  classRootPolicy,
  conceptContractIssues,
  docsAllowedPackageClassTokens: docsAllowedPackageClassTokenEntries,
  knownDuplicateConceptViolations: findKnownDuplicateConceptViolations,
} = require("./anti-duplication-concepts.js");

const docsAppDirs = [
  path.join(root, "apps/docs"),
  path.join(root, "../FlowDocs/apps/docs"),
].filter((dir) => fs.existsSync(dir));

function checkAntiDuplicationGovernance() {
  checkAntiDuplicationConceptContract();
  checkClassRootRegistryAlignment();
  checkDocsDoNotOwnPackageComponentMarkup();
  checkKnownDuplicateConcepts();
  checkPrimitiveInteractiveDomFactories();
  checkReactOnlyComponentBoundaries();
  checkReactComponentClassOwnership();
  checkFieldContractOwnership();
  checkStatusFeedbackContractOwnership();
  checkConversationalUiContractOwnership();
  checkChartVisualizationContractOwnership();
  checkPaymentWalletContractOwnership();
  checkDataCompositeContractOwnership();
  checkMapRuntimeContractOwnership();
  checkSelectionDateContractOwnership();
  checkNavigationOnboardingContractOwnership();
  checkFeedbackAuthContractOwnership();
  checkMediaDividerContractOwnership();
  checkEmailMessagingContractOwnership();
}

function checkAntiDuplicationConceptContract() {
  for (const issue of conceptContractIssues()) {
    add("errors", issue.file, 1, issue.message);
  }
}

function antiDuplicationCoverage() {
  const rootRegistry = componentClassRootRegistryCoverage();
  const blockedConceptViolations = knownDuplicateConceptViolations();
  return {
    docsApps: docsAppDirs.map((dir) => normalize(path.relative(root, dir))),
    componentClassRoots: [...componentClassRoots()].sort(),
    rootRegistry,
    blockedConceptRules: blockedConceptRules(),
    liveDuplicateConceptViolations: blockedConceptViolations,
    protectedComponentRoots: [...protectedComponentRoots()].sort(),
    classRootPolicy: classRootPolicy(),
    reactSupportClassRoots: [...reactSupportClassRoots].sort(),
    docsAllowedComponentAuthors: [],
    docsAllowedPackageClassTokens: docsAllowedPackageClassTokenEntries().map((entry) => ({
      file: entry.file,
      tokens: [...entry.tokens].sort(),
      reason: entry.reason,
    })),
    checks: [
      "docs package component class ownership",
      "component class root registry alignment",
      "known duplicate concept classes",
      "primitive interactive DOM factories",
      "React-only component boundaries",
      "React component class ownership",
      "Field contract ownership",
      "Status feedback contract ownership",
      "Conversational UI contract ownership",
      "Chart visualization contract ownership",
      "Payment wallet contract ownership",
      "Data composite contract ownership",
      "Map runtime contract ownership",
      "Selection and date contract ownership",
      "Navigation and onboarding contract ownership",
      "Feedback and auth contract ownership",
      "Media and divider contract ownership",
      "Email messaging contract ownership",
    ],
  };
}

function componentClassRootRegistryCoverage() {
  const ownerRoots = [...goldComponents].sort().map((component) => {
    const reactComponent = pascalCase(component);
    return {
      component,
      reactComponent,
      ownerRoot: ownerClassRootForReactComponent(reactComponent),
    };
  });
  const expectedOwnerRoots = new Set(ownerRoots.map((item) => item.ownerRoot));
  return {
    acceptedComponents: goldComponents.length,
    ownerRoots: ownerRoots.length,
    missingOwnerRoots: ownerRoots.filter((item) => !componentClassRoots().has(item.ownerRoot)),
    extensionRoots: [...componentClassRoots()].filter((rootToken) => !expectedOwnerRoots.has(rootToken)).sort(),
  };
}

function componentClassRoots() {
  const ownerRoots = [...goldComponents].map((component) => ownerClassRootForReactComponent(pascalCase(component)));
  return new Set([...ownerRoots, ...classRootPolicy().extensionRoots]);
}

function protectedComponentRoots() {
  return new Set(classRootPolicy().protectedComponentRoots);
}

function checkClassRootRegistryAlignment() {
  const coverage = componentClassRootRegistryCoverage();
  if (!coverage.missingOwnerRoots.length) return;
  add(
    "errors",
    path.join(root, "packages/audit/scripts/audit-anti-duplication.js"),
    1,
    `Accepted components missing owner class roots in componentClassRoots: ${coverage.missingOwnerRoots.map((item) => `${item.component}->${item.ownerRoot}`).join(", ")}.`
  );
}

function checkDocsDoNotOwnPackageComponentMarkup() {
  for (const dir of docsAppDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.(?:html|js)$/.test(candidate))) {
      const relativeFile = docsRelativeFile(file, dir);
      if (relativeFile.includes("/generated/")) continue;
      const source = read(file);
      const classStrings = [...source.matchAll(/\bclass(?:Name)?\s*[:=]\s*["'`]([^"'`]+)["'`]/g)];
      for (const match of classStrings) {
        const tokens = match[1].split(/\s+/).filter(Boolean);
        for (const token of tokens) {
          if (docsAllowedPackageClassTokenMap().get(relativeFile)?.has(token)) continue;
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
  for (const violation of knownDuplicateConceptViolations()) {
    add("errors", violation.file, violation.line, `${violation.concept}: ${violation.message}`);
  }
}

function knownDuplicateConceptViolations() {
  return findKnownDuplicateConceptViolations({ docsAppDirs, lineForIndex, normalize, walkFiles });
}

function docsAllowedPackageClassTokenMap() {
  return new Map(docsAllowedPackageClassTokenEntries().map((entry) => [entry.file, new Set(entry.tokens)]));
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
  const componentsIndexFile = path.join(root, "packages/components/src/index.js");
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
  const componentsIndexSource = fs.existsSync(componentsIndexFile) ? read(componentsIndexFile) : "";
  for (const match of componentsIndexSource.matchAll(/\b(?:create|hydrate)([A-Z][A-Za-z0-9]*)\b/g)) {
    const componentId = kebab(match[1]);
    if (!goldComponents.includes(componentId)) continue;
    add(
      "errors",
      componentsIndexFile,
      lineForIndex(componentsIndexSource, match.index),
      `Package components index must not export ${match[0]}; React owns ${componentId} implementation.`
    );
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
      const componentRoots = [...roots].filter((rootToken) => componentClassRoots().has(rootToken));
      const unknownRoots = [...roots].filter((rootToken) => packageRoots.has(rootToken) && !componentClassRoots().has(rootToken) && !reactSupportClassRoots.has(rootToken));
      const protectedCrossRoots = componentRoots.filter((rootToken) => protectedComponentRoots().has(rootToken) && rootToken !== ownerRoot && !allowedRoots.has(rootToken));
      const illegalRoots = [...new Set(componentRoots.filter((rootToken) => !allowedRoots.has(rootToken)).concat(protectedCrossRoots, unknownRoots))];
      const protectedLeaks = illegalRoots.filter((rootToken) => protectedComponentRoots().has(rootToken));
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

function checkFieldContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;

  for (const forbiddenFile of ["Field.js", "Field.d.ts"]) {
    const file = path.join(reactDir, forbiddenFile);
    if (fs.existsSync(file)) {
      add(
        "errors",
        file,
        1,
        "Field must remain a shared CSS/primitive contract owned by field-like components; do not ship a parallel React Field wrapper."
      );
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = /export\s+(?:\{[^}]*\bField\b[^}]*\}|(?:const|function|class)\s+Field\b|\*\s+from\s+["'][^"']*Field\.js["'])/.exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export Field as a product component; compose Input, Select, TextArea, Combobox, CodeInput, PhoneInput, DatePicker, or FormSection instead."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  const isAllowedNativeFileInput = (file, source, matchIndex) => {
    if (!file.endsWith(path.join("patterns", "FileUpload.js"))) return false;
    const slice = source.slice(matchIndex, matchIndex + 260);
    return slice.includes('type: "file"') &&
      slice.includes("hidden: true") &&
      slice.includes("tabIndex: -1") &&
      slice.includes("onChange: handleInputChange");
  };
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      for (const match of source.matchAll(/React\.createElement\(\s*["'`](input|select|textarea)["'`]/g)) {
        if (match[1] === "input" && isAllowedNativeFileInput(file, source, match.index)) continue;
        add(
          "errors",
          file,
          lineForIndex(source, match.index),
          `Patterns and templates must compose Flow field-like React components instead of authoring raw ${match[1]} controls.`
        );
      }
    }
  }
}

function checkStatusFeedbackContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;

  for (const forbiddenFile of ["StatusView.js", "StatusView.d.ts", "FeedbackShell.js", "FeedbackShell.d.ts"]) {
    const file = path.join(reactDir, forbiddenFile);
    if (fs.existsSync(file)) {
      add(
        "errors",
        file,
        1,
        "Status feedback must stay distributed across EmptyState, ErrorPanel, InlineValidation, Toast, NotificationPanel, and SnackbarProvider; do not ship a parallel status wrapper."
      );
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = /export\s+(?:\{[^}]*\b(?:StatusView|FeedbackShell)\b[^}]*\}|(?:const|function|class)\s+(?:StatusView|FeedbackShell)\b|\*\s+from\s+["'][^"']*(?:StatusView|FeedbackShell)\.js["'])/.exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export StatusView or FeedbackShell; compose EmptyState, ErrorPanel, InlineValidation, Toast, NotificationPanel, or SnackbarProvider according to the feedback slot."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      for (const match of source.matchAll(/React\.createElement\(\s*["'`](div|section|article|aside)["'`][\s\S]{0,260}\brole\s*:\s*["'`](alert|status)["'`]/g)) {
        add(
          "errors",
          file,
          lineForIndex(source, match.index),
          `Patterns and templates must compose Flow feedback components instead of authoring raw ${match[1]} role="${match[2]}" feedback shells.`
        );
      }
    }
  }
}

function checkConversationalUiContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const governedComponents = new Map([
    ["ChatMessage", "chat-message"],
    ["ChatThread", "chat-thread"],
    ["ChatComposer", "chat-composer"],
  ]);

  for (const [name, artifactId] of governedComponents) {
    const artifactFile = path.join(root, "packages/specs/specs/unison-system/artifacts/components", `${artifactId}.json`);
    const hasArtifact = fs.existsSync(artifactFile);
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file) && !hasArtifact) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP component; create packages/specs component artifact ${artifactId}.json before runtime implementation.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const missingArtifacts = [...governedComponents]
      .filter(([, artifactId]) => !fs.existsSync(path.join(root, "packages/specs/specs/unison-system/artifacts/components", `${artifactId}.json`)))
      .map(([name]) => name);
    if (missingArtifacts.length === 0) continue;
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${missingArtifacts.join("|")})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${missingArtifacts.join("|")})\\b|\\*\\s+from\\s+["'][^"']*(?:${missingArtifacts.join("|")})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        `React must not export ${missingArtifacts.join(", ")} until each has a governed Flow component artifact.`
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  const allowedConversationalOwners = new Set([
    path.join(reactDir, "patterns/AgentConversation.js"),
  ]);
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      if (allowedConversationalOwners.has(file)) continue;
      const source = read(file);
      for (const match of source.matchAll(/\b(?:import\s+\{?[^;\n]*(?:ChatMessage|ChatThread|ChatComposer)|React\.createElement\(\s*(?:ChatMessage|ChatThread|ChatComposer)\b)/g)) {
        add(
          "errors",
          file,
          lineForIndex(source, match.index),
          "Patterns and templates must not compose chat component atoms directly; create a formal Flow conversational pattern/template owner first."
        );
      }
    }
  }
}

function checkChartVisualizationContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "BulletChart",
    "Donut",
    "GanttChart",
    "Heatmap",
    "LineChart",
    "ParetoChart",
    "PolarChart",
    "ScatterPlot",
    "SmallMultiples",
    "StackedBars100",
    "Treemap",
    "WaterfallChart",
  ];
  const forbiddenPattern = forbiddenNames.join("|");

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP chart component; use ChartPanel plus the Charts primitive, or the ChartWrapper pattern for multi-state chart regions.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export standalone ZIP chart components; ChartPanel owns one chart and ChartWrapper owns chart-region composition."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const localChartMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*(?:${forbiddenPattern})|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (localChartMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, localChartMatch.index),
          "Patterns and templates must compose ChartPanel or ChartWrapper instead of standalone ZIP chart primitives."
        );
      }
      for (const match of source.matchAll(/React\.createElement\(\s*["'`](svg|canvas)["'`]/g)) {
        add(
          "errors",
          file,
          lineForIndex(source, match.index),
          `Patterns and templates must not author raw ${match[1]} chart visuals; route chart rendering through ChartPanel/Charts primitive.`
        );
      }
    }
  }
}

function checkPaymentWalletContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "InputDate",
    "InputEmail",
    "InputPassword",
    "InputPhone",
    "OTPInput",
    "PasscodeKeypad",
    "PaymentCard",
  ];
  const forbiddenPattern = forbiddenNames.join("|");

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP wallet/input component; compose Flow field-like components, CodeInput, CardSummary, or a governed wallet template instead.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export standalone ZIP wallet/input components; use Flow field-like components, CodeInput, CardSummary, or DriverCardWallet boundaries."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const walletMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*(?:${forbiddenPattern})|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (walletMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, walletMatch.index),
          "Patterns and templates must compose governed Flow wallet, field, and code components instead of ZIP wallet/input primitives."
        );
      }
    }
  }
}

function checkDataCompositeContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "BulkActionsTable",
    "FilterableEditableTable",
    "TableTimeline",
    "TableTree",
    "TransactionRow",
  ];
  const forbiddenPattern = forbiddenNames.join("|");

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP data composite; compose Table, VirtualDataTable, BulkActions, TreeView, Timeline, or governed templates instead.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export standalone ZIP data composites; Flow data views must route through Table, VirtualDataTable, BulkActions, TreeView, Timeline, or template boundaries."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const compositeMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*(?:${forbiddenPattern})|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (compositeMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, compositeMatch.index),
          "Patterns and templates must compose governed Flow data primitives, components, and patterns instead of ZIP table/board composites."
        );
      }
    }
  }
}

function checkMapRuntimeContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = ["MapCanvas"];
  const forbiddenPattern = forbiddenNames.join("|");
  const forbiddenRuntimePattern = /\b(?:maplibregl|mapboxgl|google\.maps|L\.map|new\s+MapLibre|new\s+mapboxgl\.Map|new\s+google\.maps\.Map)\b/;

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP map component; maps must route through the Maps primitive, StationPin, RouteSummary, StationDiscovery, or governed route templates.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export MapCanvas; map runtime and fallback behavior are owned by the Maps primitive and route/station patterns."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const mapCanvasMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*(?:${forbiddenPattern})|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (mapCanvasMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, mapCanvasMatch.index),
          "Patterns and templates must compose StationDiscovery, StationPin, RouteSummary, or route templates instead of ZIP MapCanvas."
        );
      }
      const runtimeMatch = forbiddenRuntimePattern.exec(source);
      if (runtimeMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, runtimeMatch.index),
          "Patterns and templates must not initialize map runtimes directly; use createMapsPrimitive and governed route/station components."
        );
      }
    }
  }
}

function checkSelectionDateContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "SelectCombo",
    "SelectCountry",
    "SelectMultiple",
  ];
  const forbiddenPattern = forbiddenNames.join("|");
  const localCalendarPattern = /\b(?:calendar-popover|calendar-picker|date-range-shell|date-filter-shell|custom-calendar|range-calendar)\b/;
  const localSelectPattern = /\b(?:select-combo|select-country|select-multiple|country-picker|country-select|multi-select-shell|custom-listbox)\b/;

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP selector component; compose Select, Combobox, CountrySelector, MultiSelect, SelectOptionLayer, DatePicker, or DateRangePicker instead.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export ZIP selector wrappers; selection/date behavior is owned by Flow Select, Combobox, CountrySelector, MultiSelect, SelectOptionLayer, DatePicker, and DateRangePicker."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const selectorMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*(?:${forbiddenPattern})|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (selectorMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, selectorMatch.index),
          "Patterns and templates must compose governed Flow selection/date components and patterns instead of ZIP selector wrappers."
        );
      }
      const localSelectMatch = localSelectPattern.exec(source);
      if (localSelectMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, localSelectMatch.index),
          "Patterns and templates must not author local selection/listbox shells; use Select, Combobox, CountrySelector, MultiSelect, or SelectOptionLayer."
        );
      }
      const localCalendarMatch = localCalendarPattern.exec(source);
      if (localCalendarMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, localCalendarMatch.index),
          "Patterns and templates must not author local calendar/date shells; use DatePicker, DateRangePicker, CalendarView, or AdvancedFilters."
        );
      }
    }
  }
}

function checkNavigationOnboardingContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "OnboardingCarousel",
    "TabBar",
    "TopBar",
  ];
  const forbiddenPattern = forbiddenNames.join("|");
  const localNavigationPattern = /\b(?:app-shell|navigation-shell|mobile-nav|bottom-nav|tab-bar|nav-rail|top-bar|topbar-clone|sidebar-clone|onboarding-carousel|wizard-carousel|stepper-flow|welcome-carousel|safe-area-tabbar|mobile-tabbar|local-navigation)\b/;

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP navigation/onboarding component; compose Topbar, Sidebar, Tabs, Stepper, MultiStepForm, DrawerAdapter, or onboarding patterns/templates instead.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export ZIP navigation/onboarding wrappers; app navigation and onboarding are owned by Flow patterns and templates."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const navigationImportMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*(?:${forbiddenPattern})|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (navigationImportMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, navigationImportMatch.index),
          "Patterns and templates must compose governed Flow navigation/onboarding boundaries instead of ZIP navigation wrappers."
        );
      }
      const localNavigationMatch = localNavigationPattern.exec(source);
      if (localNavigationMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, localNavigationMatch.index),
          "Patterns and templates must not author local navigation or onboarding shells; use Topbar, Sidebar, Tabs, Stepper, MultiStepForm, DrawerAdapter, or onboarding templates."
        );
      }
      for (const match of source.matchAll(/React\.createElement\(\s*["'`]nav["'`]/g)) {
        add(
          "errors",
          file,
          lineForIndex(source, match.index),
          "Patterns and templates must not author raw nav shells; use Sidebar or Topbar navigation boundaries."
        );
      }
    }
  }
}

function checkFeedbackAuthContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "BottomSheet",
    "CircularProgress",
    "NotificationCenter",
    "Progress",
    "ToastStack",
  ];
  const forbiddenPattern = forbiddenNames.join("|");
  const localFeedbackPattern = /\b(?:notification-center|toast-stack|circular-progress|progress-ring|loading-screen|auth-sheet|permission-sheet|status-screen|success-screen|offline-screen|service-status-screen|feedback-modal)\b/;

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP feedback/auth component; compose Flow feedback, overlay, progress, and authentication boundaries instead.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export ZIP feedback/auth wrappers; use NotificationPanel, SnackbarProvider, Toast, ProgressIndicator, Spinner, EmptyState, ErrorPanel, Dialog, Drawer, or AuthenticationLoginBiometricsAndOtp."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const feedbackImportMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*\\b(?:${forbiddenPattern})\\b|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (feedbackImportMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, feedbackImportMatch.index),
          "Patterns and templates must compose governed Flow feedback/auth boundaries instead of ZIP feedback wrappers."
        );
      }
      const localFeedbackMatch = localFeedbackPattern.exec(source);
      if (localFeedbackMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, localFeedbackMatch.index),
          "Patterns and templates must not author local feedback/auth shells; use Flow feedback, overlay, progress, and authentication contracts."
        );
      }
    }
  }
}

function checkMediaDividerContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "CardMedia",
    "Divider",
  ];
  const forbiddenPattern = forbiddenNames.join("|");
  const localMediaDividerPattern = /\b(?:card-media|media-card|image-card|media-shell|hero-card|cover-card|illustration-card|standalone-divider|content-divider|timeline-divider|vertical-divider|horizontal-divider|divider-label)\b/;

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a copied ZIP display helper; compose Card, Surface, List, Timeline, Menu separators, Breadcrumbs separators, or illustration/animation primitives instead.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export ZIP CardMedia or Divider helpers; media and separators are owned by Card/Surface/List/Timeline/Menu/Breadcrumbs and primitives."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const helperImportMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*\\b(?:${forbiddenPattern})\\b|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (helperImportMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, helperImportMatch.index),
          "Patterns and templates must compose governed Flow media/separator owners instead of ZIP display helpers."
        );
      }
      const localMediaDividerMatch = localMediaDividerPattern.exec(source);
      if (localMediaDividerMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, localMediaDividerMatch.index),
          "Patterns and templates must not author standalone media/divider shells; use Card, Surface, List, Timeline, Menu, Breadcrumbs, or primitive asset contracts."
        );
      }
    }
  }
}

function checkEmailMessagingContractOwnership() {
  const reactDir = path.join(root, "packages/react/src");
  if (!fs.existsSync(reactDir)) return;
  const forbiddenNames = [
    "EmailLayout",
    "MailingTemplate",
    "SecurityAlertEmail",
    "TeamInviteEmail",
    "TransactionalReceiptEmail",
    "WeeklySummaryEmail",
    "WelcomeEmail",
  ];
  const forbiddenPattern = forbiddenNames.join("|");
  const localEmailPattern = /\b(?:email-layout|mailing-shell|transactional-email|receipt-email|weekly-summary-email|team-invite-email|security-alert-email|welcome-email|email-card|email-footer|email-preheader|esp-template|mailer-template|email-template)\b/;
  const governedEmailPatternFile = path.join(reactDir, "patterns", "EmailTemplateLayout.js");

  for (const name of forbiddenNames) {
    for (const forbiddenFile of [`${name}.js`, `${name}.d.ts`]) {
      const file = path.join(reactDir, forbiddenFile);
      if (fs.existsSync(file)) {
        add(
          "errors",
          file,
          1,
          `${name} must not ship as a React product template copied from ZIP mailings; email needs a separate channel contract before implementation.`
        );
      }
    }
  }

  for (const indexFile of [path.join(reactDir, "index.js"), path.join(reactDir, "index.d.ts")]) {
    if (!fs.existsSync(indexFile)) continue;
    const source = read(indexFile);
    const exportMatch = new RegExp(`export\\s+(?:\\{[^}]*\\b(?:${forbiddenPattern})\\b[^}]*\\}|(?:const|function|class)\\s+(?:${forbiddenPattern})\\b|\\*\\s+from\\s+["'][^"']*(?:${forbiddenPattern})\\.js["'])`).exec(source);
    if (exportMatch) {
      add(
        "errors",
        indexFile,
        lineForIndex(source, exportMatch.index),
        "React must not export ZIP email templates; email rendering requires a governed channel/template contract outside product React surfaces."
      );
    }
  }

  const compositionDirs = [
    path.join(reactDir, "patterns"),
    path.join(reactDir, "templates"),
  ];
  for (const dir of compositionDirs) {
    for (const file of walkFiles(dir, (candidate) => /\.js$/.test(candidate))) {
      const source = read(file);
      const isGovernedEmailPattern = file === governedEmailPatternFile && source.includes("data-flow-pattern\": \"email-template-layout");
      const emailImportMatch = new RegExp(`\\b(?:import\\s+\\{?[^;\\n]*\\b(?:${forbiddenPattern})\\b|React\\.createElement\\(\\s*(?:${forbiddenPattern})\\b)`).exec(source);
      if (emailImportMatch) {
        add(
          "errors",
          file,
          lineForIndex(source, emailImportMatch.index),
          "Patterns and templates must not compose ZIP email templates; create a formal messaging/email contract first."
        );
      }
      const localEmailMatch = localEmailPattern.exec(source);
      if (localEmailMatch && !isGovernedEmailPattern) {
        add(
          "errors",
          file,
          lineForIndex(source, localEmailMatch.index),
          "Patterns and templates must not author local email/mailing shells; route in-product messaging through Message, Toast, NotificationPanel, or a future governed email template contract."
        );
      }
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
    InlineValidation: ["inline-validation"],
    Input: ["field"],
    InputAmount: ["input-amount", "field"],
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
    Input: "field",
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
  for (const rootToken of componentClassRoots()) {
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

function pascalCase(value) {
  return value.split("-").map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`).join("");
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
  componentClassRootRegistryCoverage,
  componentClassRoots,
  knownDuplicateConceptViolations,
  ownerClassRootForReactComponent,
  packageCssClassRoots,
  protectedComponentRoots,
  reactSupportClassRoots,
};
