const { fs, path, root, docsAppDir, read, add } = require("./audit-context.js");

const docsAllowedComponentAuthors = new Set([
  "apps/docs/component-demo.js",
  "apps/docs/react-component-islands.js",
]);

const docsAllowedPackageClassTokens = new Map([
  ["apps/docs/docs-layout.js", new Set(["tag"])],
]);

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
  "chart-panel",
  "checkbox",
  "chip",
  "code-input",
  "combobox",
  "country-flag",
  "country-selector",
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

function checkAntiDuplicationGovernance() {
  checkDocsDoNotOwnPackageComponentMarkup();
  checkKnownDuplicateConcepts();
  checkReactOnlyComponentBoundaries();
}

function checkDocsDoNotOwnPackageComponentMarkup() {
  if (!fs.existsSync(docsAppDir)) return;
  for (const file of walkFiles(docsAppDir, (candidate) => /\.js$/.test(candidate))) {
    const relativeFile = normalize(path.relative(root, file));
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

function checkKnownDuplicateConcepts() {
  const files = [
    ...walkFiles(path.join(root, "apps"), (candidate) => /\.(?:css|html|js)$/.test(candidate)),
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

function checkReactOnlyComponentBoundaries() {
  const contractsFile = path.join(root, "packages/components/src/contracts.js");
  const smokeFile = path.join(root, "packages/components/test/smoke.test.mjs");
  const sourceFiles = {
    commerce: path.join(root, "packages/components/src/components/commerce.js"),
    display: path.join(root, "packages/components/src/components/display.js"),
    feedback: path.join(root, "packages/components/src/components/feedback.js"),
    fields: path.join(root, "packages/components/src/components/fields.js"),
    interactions: path.join(root, "packages/components/src/components/interactions.js"),
    overlays: path.join(root, "packages/components/src/components/overlays.js"),
    motion: path.join(root, "packages/components/src/components/motion.js"),
    navigation: path.join(root, "packages/components/src/components/navigation.js"),
    security: path.join(root, "packages/components/src/components/security.js"),
    status: path.join(root, "packages/components/src/components/status.js"),
    surfaces: path.join(root, "packages/components/src/components/surfaces.js"),
    specializedInputs: path.join(root, "packages/components/src/components/specialized-inputs.js"),
  };
  const reactOnlyComponents = [
    ["Button", "createTransitionalActionButton", "actions"],
    ["Icon Button", "createTransitionalActionIconButton", "actions"],
    ["Card", "createCard", "surfaces"],
    ["Table", "createTable", "commerce"],
    ["List", "createList", "display"],
    ["KPI Tile", "createKpiTile", "display"],
    ["Audit Event", "createAuditEvent", "display"],
    ["Chart Panel", "createChartPanel", "commerce"],
    ["Station Pin", "createStationPin", "commerce"],
    ["Route Summary", "createRouteSummary", "commerce"],
    ["Card Summary", "createCardSummary", "commerce"],
    ["Movement Row", "createMovementRow", "commerce"],
    ["Quick Action", "createQuickAction", "commerce"],
    ["Floating Action Button", "createFloatingActionButton", "surfaces"],
    ["Inline Validation", "createInlineValidation", "surfaces"],
    ["Empty State", "createEmptyState", "feedback"],
    ["Error Panel", "createErrorPanel", "feedback"],
    ["Skeleton", "createSkeleton", "feedback"],
    ["Breadcrumbs", "createBreadcrumbs", "navigation"],
    ["Pagination", "createPagination", "navigation"],
    ["Stepper", "createStepper", "navigation"],
    ["Biometric Prompt", "createBiometricPrompt", "security"],
    ["Motion Boundary", "createMotionBoundary", "motion"],
    ["Animated Moment", "createAnimatedMoment", "motion"],
    ["Chip", "createTransitionalChip", "status"],
    ["Tag", "createTransitionalTag", "status"],
    ["Toast", "createToast", "overlays"],
    ["Accordion", "createAccordion", "interactions"],
    ["Slider", "createSlider", "interactions"],
    ["Segmented Control", "createSegmentedControl", "interactions"],
    ["Tree View", "createTreeView", "interactions"],
    ["Tabs", "createTabs", "interactions"],
    ["Tooltip", "createTransitionalTooltip", "overlays"],
    ["Popover", "createPopover", "overlays"],
    ["Menu", "createMenu", "overlays"],
    ["Dialog", "createDialog", "overlays"],
    ["Drawer", "createDrawer", "overlays"],
    ["Badge", "createTransitionalBadge", "status"],
    ["Avatar", "createTransitionalAvatar", "display"],
    ["Progress Indicator", "createProgressIndicator", "feedback"],
    ["Checkbox", "createTransitionalChoiceCheckbox", "choices"],
    ["Switch", "createTransitionalChoiceSwitch", "choices"],
    ["Radio Button", "createTransitionalChoiceRadioButton", "choices"],
    ["Text Area", "createTransitionalFieldTextArea", "fields"],
    ["Text Area Hydrator", "hydrateTransitionalTextArea", "fields"],
    ["Input", "createTransitionalFieldInput", "fields"],
    ["Input Hydrator", "hydrateInput", "fields"],
    ["Select", "createTransitionalFieldSelect", "fields"],
    ["Select Hydrator", "hydrateTransitionalSelect", "fields"],
    ["Combobox", "createCombobox", "fields"],
    ["Combobox Hydrator", "hydrateCombobox", "fields"],
    ["Card Number Input", "createTransitionalPaymentCardNumberInput", "specializedInputs"],
    ["Card Number Input Hydrator", "hydrateTransitionalPaymentCardNumberInput", "specializedInputs"],
    ["Card Expiry Input", "createTransitionalPaymentCardExpiryInput", "specializedInputs"],
    ["Card Expiry Input Hydrator", "hydrateTransitionalPaymentCardExpiryInput", "specializedInputs"],
  ];
  const checks = reactOnlyComponents.flatMap(([label, factory, sourceKey]) => [
    {
      file: sourceFiles[sourceKey],
      pattern: new RegExp(`export function ${factory}\\b`),
      message: `${label} must not reintroduce a DOM factory; React ${label.replace(/\s+/g, "")} is the single product component implementation.`,
    },
    {
      file: contractsFile,
      pattern: new RegExp(`internalFactory:\\s*"${factory}"`),
      message: `${label} contract must not name a DOM internalFactory; React ${label.replace(/\s+/g, "")} owns the component implementation.`,
    },
    {
      file: smokeFile,
      pattern: new RegExp(`import\\s*\\{[^}]*${factory}\\b[^}]*\\}|${factory}\\(`),
      message: `${label} smoke coverage must use React render tests, not the removed DOM factory.`,
    },
  ]);
  for (const check of checks) {
    if (!fs.existsSync(check.file)) continue;
    const source = read(check.file);
    const match = check.pattern.exec(source);
    if (match) add("errors", check.file, lineForIndex(source, match.index), check.message);
  }
}

function componentRootForClassToken(token) {
  for (const rootToken of componentClassRoots) {
    if (token === rootToken || token.startsWith(`${rootToken}__`) || token.startsWith(`${rootToken}--`)) {
      return rootToken;
    }
  }
  return "";
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

function lineForIndex(text, index) {
  return text.slice(0, index).split("\n").length;
}

module.exports = { checkAntiDuplicationGovernance };
