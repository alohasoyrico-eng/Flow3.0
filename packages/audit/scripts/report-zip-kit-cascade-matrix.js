#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
  slug,
} = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-kit-cascade-matrix-audit.json");
const markdownOutput = path.join(outputDir, "zip-kit-cascade-matrix-audit.md");
const parityReportFile = path.join(root, "docs/audits/zip-template-parity-audit.json");
const zipRoot = "/private/tmp/flow-zip-audit";

const zipReferenceOwners = {
  Accordion: ["accordion"],
  Avatar: ["avatar"],
  Badge: ["badge"],
  Bars: ["charts", "chart-panel", "chart-wrapper"],
  BiometricPrompt: ["biometric-prompt"],
  BottomSheet: ["action-sheet", "fullscreen-sheet", "drawer"],
  Breadcrumb: ["breadcrumbs"],
  BulletChart: ["charts", "chart-panel", "chart-wrapper"],
  Button: ["button"],
  Card: ["surface", "card", "card-summary"],
  ChatComposer: ["chat-composer"],
  ChatMessage: ["chat-message"],
  ChatThread: ["chat-thread"],
  Checkbox: ["checkbox"],
  Chip: ["chip", "filter-chip-group"],
  Combobox: ["combobox", "autocomplete"],
  DatePicker: ["date-picker"],
  DateRangePicker: ["date-range-picker"],
  Dialog: ["dialog", "confirmation-dialog"],
  Donut: ["charts", "chart-panel", "chart-wrapper"],
  Drawer: ["drawer", "drawer-adapter", "fullscreen-sheet"],
  EmptyState: ["empty-state", "status-feedback-view"],
  Field: ["field-action", "input"],
  FileUpload: ["file-upload"],
  IconButton: ["icon-button"],
  Input: ["input"],
  LineChart: ["charts", "chart-panel", "chart-wrapper"],
  MapCanvas: ["maps", "station-discovery"],
  Menu: ["menu"],
  NotificationCenter: ["notification-panel"],
  OTPInput: ["code-input"],
  Pagination: ["pagination"],
  ParetoChart: ["charts", "chart-panel", "chart-wrapper"],
  PasscodeKeypad: ["authentication-login-biometrics-and-otp"],
  PaymentCard: ["card-summary", "driver-card-wallet"],
  Progress: ["progress-indicator"],
  Radio: ["radio-button"],
  RoleMatrix: ["roles-and-permissions"],
  ScatterPlot: ["charts", "chart-panel", "chart-wrapper"],
  SegmentedControl: ["segmented-control"],
  Select: ["select"],
  Skeleton: ["skeleton"],
  SmallMultiples: ["charts", "chart-panel", "chart-wrapper"],
  Sparkline: ["charts", "chart-panel", "chart-wrapper"],
  StackedBars100: ["charts", "chart-panel", "chart-wrapper"],
  StatTile: ["kpi-tile", "kpi-card"],
  StatusView: ["status-feedback-view"],
  Stepper: ["stepper"],
  Switch: ["switch"],
  TabBar: ["tabs", "driver-mobile-app"],
  Table: ["table", "virtual-data-table"],
  Tabs: ["tabs"],
  Textarea: ["text-area"],
  Timeline: ["timeline"],
  Toast: ["toast", "snackbar-provider"],
  ToastStack: ["toast", "snackbar-provider"],
  Tooltip: ["tooltip"],
  TransactionRow: ["movement-row"],
  Treemap: ["charts", "chart-panel", "chart-wrapper"],
};

function read(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function ownerIds(kit) {
  return new Set(Object.values(kit.owners ?? {}).flat().map((owner) => owner.id));
}

function ownerCount(kit, layer) {
  return kit.owners?.[layer]?.length ?? 0;
}

function sourceForKit(kit) {
  return (kit.zipPaths ?? []).map((zipPath) => read(path.join(zipRoot, zipPath))).join("\n");
}

function zipReferences(source) {
  return [...source.matchAll(/const\s*\{([^}]+)\}\s*=\s*NS/g)]
    .flatMap((match) => match[1].split(",").map((item) => item.trim()).filter(Boolean));
}

function sourceSignals(source) {
  return {
    form: /<form\b|const\s+\{\s*[^}]*\bField\b[^}]*\}\s*=\s*NS/.test(source),
    table: /\bTable\b/.test(source),
    chart: /\b(Bars|Sparkline|LineChart|Donut|StackedBars100|ScatterPlot|SmallMultiples|BulletChart|Treemap|ParetoChart)\b/.test(source),
    map: /\bMapCanvas\b/.test(source),
    bottomSheet: /\bBottomSheet\b/.test(source),
    cardShell: /\bCard\b/.test(source),
    jsxRuntime: /data-presets=["']react["']|from ["']react["']|import\s+React/.test(source),
    inlineTheme: /data-theme=|--[a-z0-9-]+\s*:|var\(--|#[0-9a-fA-F]{3,8}/.test(source),
  };
}

function layerIssues(kit) {
  const ids = ownerIds(kit);
  const hasFoundations = ownerCount(kit, "foundations") > 0;
  const hasPrimitives = ownerCount(kit, "primitives") > 0;
  const hasComponents = ownerCount(kit, "components") > 0;
  const hasPatterns = ownerCount(kit, "patterns") > 0;
  const hasTemplates = ownerCount(kit, "templates") > 0;
  const issues = [];
  if (kit.classification === "covered-by-template") {
    if (!hasFoundations) issues.push("template-covered kit lacks foundation owners.");
    if (!hasPrimitives) issues.push("template-covered kit lacks primitive owners.");
    if (!hasComponents) issues.push("template-covered kit lacks component owners.");
    if (!hasPatterns) issues.push("template-covered kit lacks pattern owners.");
    if (!hasTemplates) issues.push("template-covered kit lacks template owners.");
  }
  if (kit.classification === "covered-by-pattern") {
    if (!hasFoundations) issues.push("pattern-covered kit lacks foundation owners.");
    if (!hasPrimitives) issues.push("pattern-covered kit lacks primitive owners.");
    if (!hasComponents) issues.push("pattern-covered kit lacks component owners.");
    if (!hasPatterns) issues.push("pattern-covered kit lacks pattern owners.");
  }
  if (kit.classification === "covered-separate-channel") {
    if (!hasFoundations) issues.push("separate channel kit lacks foundation owners.");
    if (!hasPrimitives) issues.push("separate channel kit lacks primitive owners.");
    if (!hasPatterns) issues.push("separate channel kit lacks channel pattern owner.");
    if (hasComponents) issues.push("separate channel kit must not claim web component owners.");
    if (hasTemplates) issues.push("separate channel kit must not claim web template owners.");
  }
  if (kit.classification === "blocked-separate-channel") {
    if (!hasFoundations) issues.push("blocked channel kit lacks foundation owners.");
    if (!hasPrimitives) issues.push("blocked channel kit lacks primitive owners.");
    if (hasComponents || hasPatterns || hasTemplates) issues.push("blocked channel kit must not claim product runtime owners.");
  }
  if (!ids.has("surface") && kit.classification !== "covered-separate-channel") {
    issues.push("product kit must identify Surface as the visual grouping primitive.");
  }
  return issues;
}

function signalIssues(kit, signals) {
  const ids = ownerIds(kit);
  const issues = [];
  if (signals.form && !["field-action", "input", "form-section", "multi-step-form", "preference-management", "authentication-login-biometrics-and-otp"].some((id) => ids.has(id))) {
    issues.push("form signal lacks Field Action/Input/Form Section owner.");
  }
  if (signals.table && !["table", "virtual-data-table", "chat-thread"].some((id) => ids.has(id)) && kit.classification !== "covered-separate-channel") {
    issues.push("table signal lacks Table/Virtual Data Table/chat owner.");
  }
  if (signals.chart && !["charts", "chart-panel", "chart-wrapper"].some((id) => ids.has(id))) {
    issues.push("chart signal lacks Charts/Chart Panel owner.");
  }
  if (signals.map && !["maps", "station-discovery"].some((id) => ids.has(id))) {
    issues.push("map signal lacks Maps/Station Discovery owner.");
  }
  if (signals.bottomSheet && !["action-sheet", "fullscreen-sheet", "drawer"].some((id) => ids.has(id))) {
    issues.push("bottom sheet signal lacks Action Sheet/Fullscreen Sheet/Drawer owner.");
  }
  if (signals.cardShell && !["surface", "card", "card-summary", "driver-card-wallet"].some((id) => ids.has(id))) {
    issues.push("card shell signal lacks Surface or explicit card owner.");
  }
  if (signals.inlineTheme && !["surface", "color", "tone", "typography", "radius"].some((id) => ids.has(id))) {
    issues.push("inline theme signal lacks theme/foundation primitive owner.");
  }
  if (signals.jsxRuntime && kit.classification === "template-candidate") {
    issues.push("JSX runtime signal cannot remain template-candidate.");
  }
  return issues;
}

function createReport() {
  const parity = readJson(parityReportFile);
  const rows = (parity.kits ?? []).map((kit) => {
    const source = sourceForKit(kit);
    const refs = zipReferences(source);
    const uniqueRefs = [...new Set(refs)].sort();
    const ids = ownerIds(kit);
    const referenceRows = uniqueRefs.map((ref) => {
      const acceptedOwners = zipReferenceOwners[ref] ?? [slug(ref)];
      const resolvedOwners = acceptedOwners.filter((owner) => ids.has(owner));
      return {
        ref,
        acceptedOwners,
        resolvedOwners,
        resolved: resolvedOwners.length > 0,
      };
    });
    const signals = sourceSignals(source);
    const rowLayerIssues = layerIssues(kit);
    const rowSignalIssues = signalIssues(kit, signals);
    const issues = [
      ...rowLayerIssues,
      ...rowSignalIssues,
      ...referenceRows.filter((row) => !row.resolved).map((row) => `${row.ref} is not resolved by ${row.acceptedOwners.join(" / ")}.`),
    ];
    return {
      id: kit.id,
      classification: kit.classification,
      ownerCounts: {
        foundations: ownerCount(kit, "foundations"),
        primitives: ownerCount(kit, "primitives"),
        components: ownerCount(kit, "components"),
        patterns: ownerCount(kit, "patterns"),
        templates: ownerCount(kit, "templates"),
      },
      signals,
      zipReferenceCount: refs.length,
      uniqueZipReferenceCount: uniqueRefs.length,
      references: referenceRows,
      layerIssues: rowLayerIssues,
      signalIssues: rowSignalIssues,
      issues,
    };
  });
  const layerDebt = rows.reduce((sum, row) => sum + row.layerIssues.length, 0);
  const signalDebt = rows.reduce((sum, row) => sum + row.signalIssues.length, 0);
  const referenceDebt = rows.reduce((sum, row) => sum + row.references.filter((ref) => !ref.resolved).length, 0);
  const inventory = {
    kits: rows.length,
    zipPaths: (parity.kits ?? []).reduce((sum, kit) => sum + (kit.zipPaths ?? []).length, 0),
    zipComponentReferences: rows.reduce((sum, row) => sum + row.zipReferenceCount, 0),
    uniqueZipComponentReferences: new Set(rows.flatMap((row) => row.references.map((ref) => ref.ref))).size,
    foundationOwnerLinks: rows.reduce((sum, row) => sum + row.ownerCounts.foundations, 0),
    primitiveOwnerLinks: rows.reduce((sum, row) => sum + row.ownerCounts.primitives, 0),
    componentOwnerLinks: rows.reduce((sum, row) => sum + row.ownerCounts.components, 0),
    patternOwnerLinks: rows.reduce((sum, row) => sum + row.ownerCounts.patterns, 0),
    templateOwnerLinks: rows.reduce((sum, row) => sum + row.ownerCounts.templates, 0),
    kitsWithLayerCoverage: rows.filter((row) => !row.layerIssues.length).length,
    unresolvedZipReferences: referenceDebt,
    layerCoverageDebt: layerDebt,
    signalMappingDebt: signalDebt,
    zipKitCascadeDebt: rows.reduce((sum, row) => sum + row.issues.length, 0),
  };
  const issues = rows.flatMap((row) => row.issues.map((issue) => `${row.id}: ${issue}`));
  return {
    status: issues.length ? "fail" : "pass",
    audit: "zip kit cascade matrix",
    principle: "Every ZIP kit must resolve detected UI references into Flow foundations, primitives, components, patterns, templates, or an explicit separate channel without creating a parallel cascade.",
    generatedAt: new Date().toISOString(),
    inventory,
    kits: rows,
    issues,
  };
}

function markdown(report) {
  return [
    "# ZIP kit cascade matrix audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Kits",
    "",
    "| Kit | Class | Foundations | Primitives | Components | Patterns | Templates | ZIP refs | Unresolved | Issues |",
    "| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
    ...report.kits.map((kit) => `| ${kit.id} | ${kit.classification} | ${kit.ownerCounts.foundations} | ${kit.ownerCounts.primitives} | ${kit.ownerCounts.components} | ${kit.ownerCounts.patterns} | ${kit.ownerCounts.templates} | ${kit.uniqueZipReferenceCount} | ${kit.references.filter((ref) => !ref.resolved).length} | ${kit.issues.length} |`),
    "",
    "## Issues",
    "",
    ...(report.issues.length ? report.issues.map((issue) => `- ${issue}`) : ["- None."]),
    "",
  ].join("\n");
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-zip-kit-cascade-matrix.js.`);
  }
}
if (!checkMode) {
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, `${markdown(report)}\n`);
}

if (report.status !== "pass") {
  throw new Error(`ZIP kit cascade matrix failed with ${report.issues.length} issue(s).`);
}
