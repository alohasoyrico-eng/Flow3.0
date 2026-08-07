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
  const surfacesFile = path.join(root, "packages/components/src/components/surfaces.js");
  const commerceFile = path.join(root, "packages/components/src/components/commerce.js");
  const displayFile = path.join(root, "packages/components/src/components/display.js");
  const contractsFile = path.join(root, "packages/components/src/contracts.js");
  const smokeFile = path.join(root, "packages/components/test/smoke.test.mjs");
  const checks = [
    {
      file: surfacesFile,
      pattern: /export function createCard\b/,
      message: "Card must not reintroduce a DOM factory; React Card is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createCard"/,
      message: "Card contract must not name a DOM internalFactory; React Card owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{\s*createCard\s*\}|createCard\(/,
      message: "Card smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createTable\b/,
      message: "Table must not reintroduce a DOM factory; React Table is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createTable"/,
      message: "Table contract must not name a DOM internalFactory; React Table owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createTable[^}]*\}|createTable\(/,
      message: "Table smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: displayFile,
      pattern: /export function createList\b/,
      message: "List must not reintroduce a DOM factory; React List is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createList"/,
      message: "List contract must not name a DOM internalFactory; React List owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createList[^}]*\}|createList\(/,
      message: "List smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: displayFile,
      pattern: /export function createKpiTile\b/,
      message: "KPI Tile must not reintroduce a DOM factory; React KpiTile is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createKpiTile"/,
      message: "KPI Tile contract must not name a DOM internalFactory; React KpiTile owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createKpiTile[^}]*\}|createKpiTile\(/,
      message: "KPI Tile smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: displayFile,
      pattern: /export function createAuditEvent\b/,
      message: "Audit Event must not reintroduce a DOM factory; React AuditEvent is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createAuditEvent"/,
      message: "Audit Event contract must not name a DOM internalFactory; React AuditEvent owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createAuditEvent[^}]*\}|createAuditEvent\(/,
      message: "Audit Event smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createChartPanel\b/,
      message: "Chart Panel must not reintroduce a DOM factory; React ChartPanel is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createChartPanel"/,
      message: "Chart Panel contract must not name a DOM internalFactory; React ChartPanel owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createChartPanel[^}]*\}|createChartPanel\(/,
      message: "Chart Panel smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createStationPin\b/,
      message: "Station Pin must not reintroduce a DOM factory; React StationPin is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createStationPin"/,
      message: "Station Pin contract must not name a DOM internalFactory; React StationPin owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createStationPin[^}]*\}|createStationPin\(/,
      message: "Station Pin smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createRouteSummary\b/,
      message: "Route Summary must not reintroduce a DOM factory; React RouteSummary is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createRouteSummary"/,
      message: "Route Summary contract must not name a DOM internalFactory; React RouteSummary owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createRouteSummary[^}]*\}|createRouteSummary\(/,
      message: "Route Summary smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createCardSummary\b/,
      message: "Card Summary must not reintroduce a DOM factory; React CardSummary is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createCardSummary"/,
      message: "Card Summary contract must not name a DOM internalFactory; React CardSummary owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createCardSummary[^}]*\}|createCardSummary\(/,
      message: "Card Summary smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createMovementRow\b/,
      message: "Movement Row must not reintroduce a DOM factory; React MovementRow is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createMovementRow"/,
      message: "Movement Row contract must not name a DOM internalFactory; React MovementRow owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createMovementRow[^}]*\}|createMovementRow\(/,
      message: "Movement Row smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: commerceFile,
      pattern: /export function createQuickAction\b/,
      message: "Quick Action must not reintroduce a DOM factory; React QuickAction is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createQuickAction"/,
      message: "Quick Action contract must not name a DOM internalFactory; React QuickAction owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createQuickAction[^}]*\}|createQuickAction\(/,
      message: "Quick Action smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: surfacesFile,
      pattern: /export function createFloatingActionButton\b/,
      message: "Floating Action Button must not reintroduce a DOM factory; React FloatingActionButton is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createFloatingActionButton"/,
      message: "Floating Action Button contract must not name a DOM internalFactory; React FloatingActionButton owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createFloatingActionButton[^}]*\}|createFloatingActionButton\(/,
      message: "Floating Action Button smoke coverage must use React render tests, not the removed DOM factory.",
    },
    {
      file: surfacesFile,
      pattern: /export function createInlineValidation\b/,
      message: "Inline Validation must not reintroduce a DOM factory; React InlineValidation is the single product component implementation.",
    },
    {
      file: contractsFile,
      pattern: /internalFactory:\s*"createInlineValidation"/,
      message: "Inline Validation contract must not name a DOM internalFactory; React InlineValidation owns the component implementation.",
    },
    {
      file: smokeFile,
      pattern: /import\s*\{[^}]*createInlineValidation[^}]*\}|createInlineValidation\(/,
      message: "Inline Validation smoke coverage must use React render tests, not the removed DOM factory.",
    },
  ];
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
