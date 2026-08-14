#!/usr/bin/env node

const {
  fs,
  path,
  rel,
  root,
  slug,
} = require("./audit-context.js");

const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "zip-flow-gap-audit.json");
const markdownOutput = path.join(outputDir, "zip-flow-gap-audit.md");
const checkMode = process.argv.includes("--check");
const zipRoot = "/private/tmp/flow-zip-audit";
const zipComponentsDir = path.join(zipRoot, "components");
const flowArtifactsDir = path.join(root, "packages/specs/specs/unison-system/artifacts");
const parityFile = path.join(root, "packages/content/content/zip-template-parity.json");

const componentEquivalents = {
  BottomSheet: { layer: "pattern", owner: "action-sheet", decision: "absorbed" },
  Breadcrumb: { layer: "component", owner: "breadcrumbs", decision: "rename" },
  BulkActionsTable: { layer: "pattern", owner: "virtual-data-table", decision: "absorbed" },
  BulletChart: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  CardMedia: { layer: "contract", owner: "surface/card media composition", decision: "do-not-add-component" },
  Charts: { layer: "primitive", owner: "charts", decision: "needs-react-export-review" },
  ChatComposer: { layer: "missing-component", owner: "conversational-ui", decision: "create-after-pattern-contract" },
  ChatMessage: { layer: "missing-component", owner: "conversational-ui", decision: "create-after-pattern-contract" },
  ChatThread: { layer: "missing-component", owner: "conversational-ui", decision: "create-after-pattern-contract" },
  CircularProgress: { layer: "component", owner: "progress-indicator", decision: "rename" },
  Divider: { layer: "contract", owner: "separator composition", decision: "do-not-add-component" },
  Donut: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  Field: { layer: "contract", owner: "field family CSS contract", decision: "do-not-add-wrapper" },
  FilterableEditableTable: { layer: "pattern", owner: "virtual-data-table", decision: "absorbed-partial" },
  GanttChart: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  Heatmap: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  InputAmount: { layer: "missing-component", owner: "amount field", decision: "decide-component-or-pattern" },
  InputDate: { layer: "component", owner: "date-picker", decision: "rename" },
  InputEmail: { layer: "component", owner: "input", decision: "variant" },
  InputPassword: { layer: "component", owner: "input", decision: "variant" },
  InputPhone: { layer: "component", owner: "phone-input", decision: "rename" },
  KanbanBoard: { layer: "missing-pattern", owner: "kanban-board", decision: "create-pattern-first" },
  LineChart: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  MapCanvas: { layer: "primitive", owner: "maps", decision: "covered-by-primitive-runtime" },
  NotificationCenter: { layer: "pattern", owner: "notification-panel", decision: "rename" },
  OTPInput: { layer: "component", owner: "code-input", decision: "rename" },
  OnboardingCarousel: { layer: "pattern", owner: "driver-onboarding-mobile", decision: "absorbed" },
  ParetoChart: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  PasscodeKeypad: { layer: "component", owner: "code-input", decision: "absorbed" },
  PaymentCard: { layer: "component", owner: "card-summary", decision: "absorbed" },
  PolarChart: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  Progress: { layer: "component", owner: "progress-indicator", decision: "rename" },
  Radio: { layer: "component", owner: "radio-button", decision: "rename" },
  RoleMatrix: { layer: "pattern", owner: "roles-and-permissions", decision: "rename" },
  ScatterPlot: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  SelectCombo: { layer: "component", owner: "combobox", decision: "rename" },
  SelectCountry: { layer: "component", owner: "country-selector", decision: "rename" },
  SelectMultiple: { layer: "pattern", owner: "multi-select", decision: "rename" },
  SmallMultiples: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  StackedBars100: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  StatTile: { layer: "component", owner: "kpi-tile", decision: "rename" },
  StatusView: { layer: "pattern", owner: "status-feedback-view", decision: "covered-by-pattern" },
  TabBar: { layer: "component", owner: "tabs", decision: "absorbed" },
  TableTimeline: { layer: "pattern", owner: "timeline", decision: "absorbed" },
  TableTree: { layer: "component", owner: "tree-view", decision: "rename" },
  Textarea: { layer: "component", owner: "text-area", decision: "rename" },
  TopBar: { layer: "pattern", owner: "topbar", decision: "rename" },
  TransactionRow: { layer: "component", owner: "movement-row", decision: "rename" },
  Treemap: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
  WaterfallChart: { layer: "pattern", owner: "chart-wrapper", decision: "absorbed" },
};

const zipPatternConcepts = [
  { id: "registration-onboarding-form", source: "docs/patterns-guide.md#1.1", flowOwner: "multi-step-form/form-section/authentication-login-biometrics-and-otp", status: "covered-by-pattern", missing: false },
  { id: "advanced-filter-form", source: "docs/patterns-guide.md#1.2", flowOwner: "advanced-filters/search/filter-chip-group", status: "covered-by-pattern", missing: false },
  { id: "payment-form", source: "docs/patterns-guide.md#1.3", flowOwner: "payment-form", status: "covered-by-pattern", missing: false },
  { id: "dense-operational-list", source: "docs/patterns-guide.md#2.1", flowOwner: "dense-operational-list", status: "covered-by-pattern", missing: false },
  { id: "expandable-detail-table", source: "docs/patterns-guide.md#2.2", flowOwner: "expandable-detail-table/virtual-data-table/drawer-adapter/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "tree-table", source: "docs/patterns-guide.md#2.3", flowOwner: "tree-view/table", status: "covered-by-component-pattern", missing: false },
  { id: "table-timeline", source: "docs/patterns-guide.md#2.4", flowOwner: "timeline/audit-event", status: "covered-by-pattern", missing: false },
  { id: "bulk-actions-flow", source: "docs/patterns-guide.md#2.5", flowOwner: "bulk-actions/virtual-data-table/confirmation-dialog", status: "covered-by-pattern", missing: false },
  { id: "filterable-editable-table", source: "docs/patterns-guide.md#2.6", flowOwner: "filterable-editable-table/advanced-filters/virtual-data-table/drawer-adapter/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "card-media", source: "docs/patterns-guide.md#3.1", flowOwner: "surface/card composition", status: "covered-by-contract", missing: false },
  { id: "card-minimal", source: "docs/patterns-guide.md#3.2", flowOwner: "card/surface/list", status: "covered-by-contract", missing: false },
  { id: "card-elevated", source: "docs/patterns-guide.md#3.3", flowOwner: "card/surface/depth", status: "covered-by-contract", missing: false },
  { id: "card-ghost", source: "docs/patterns-guide.md#3.4", flowOwner: "surface/dialog/popover", status: "covered-by-contract", missing: false },
  { id: "card-interactive", source: "docs/patterns-guide.md#3.5", flowOwner: "card/quick-action", status: "covered-by-contract", missing: false },
  { id: "card-stats", source: "docs/patterns-guide.md#3.6", flowOwner: "kpi-card/kpi-tile", status: "covered-by-pattern", missing: false },
  { id: "card-compact-row", source: "docs/patterns-guide.md#3.7", flowOwner: "list/quick-action", status: "covered-by-contract", missing: false },
  { id: "gantt-chart", source: "docs/patterns-guide.md#4.1", flowOwner: "gantt-chart/chart-wrapper", status: "covered-by-pattern", missing: false },
  { id: "waterfall-chart", source: "docs/patterns-guide.md#4.2", flowOwner: "waterfall-chart/chart-wrapper", status: "covered-by-pattern", missing: false },
  { id: "polar-chart", source: "docs/patterns-guide.md#4.3", flowOwner: "polar-chart/chart-wrapper", status: "covered-by-pattern", missing: false },
  { id: "kanban-board", source: "docs/patterns-guide.md#4.4", flowOwner: "kanban-board", status: "covered-by-pattern", missing: false },
  { id: "filters-inline-edit", source: "docs/patterns-guide.md#5.2", flowOwner: "filterable-editable-table/advanced-filters/virtual-data-table/drawer-adapter/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "help-center-search-category", source: "docs/patterns-guide.md#5.3", flowOwner: "help-center/search/breadcrumbs", status: "covered-by-pattern", missing: false },
  { id: "conversational-thread", source: "ui_kits/agent-chat/index.html", flowOwner: "agent-conversation/chat-thread", status: "covered-by-pattern", missing: false },
  { id: "chat-composer", source: "ui_kits/agent-chat/index.html", flowOwner: "agent-conversation/chat-composer", status: "covered-by-pattern", missing: false },
  { id: "agent-handoff", source: "ui_kits/agent-chat/index.html", flowOwner: "agent-conversation/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "account-operations", source: "ui_kits/internal-tools/accounts.html", flowOwner: "account-operations/dense-operational-list/drawer-adapter/timeline", status: "covered-by-pattern", missing: false },
  { id: "ticket-queue", source: "ui_kits/internal-tools/tickets.html", flowOwner: "ticket-queue/notification-panel/dense-operational-list/drawer-adapter/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "case-management", source: "ui_kits/internal-tools/cases.html", flowOwner: "case-management/advanced-filters/dense-operational-list/drawer-adapter/timeline/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "pricing-operations", source: "ui_kits/internal-tools/pricing.html", flowOwner: "pricing-operations/filterable-editable-table/roles-and-permissions/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "backoffice-approval", source: "ui_kits/internal-tools/backoffice.html", flowOwner: "backoffice-approval/dense-operational-list/drawer-adapter/status-feedback-view", status: "covered-by-pattern", missing: false },
  { id: "growth-onboarding-board", source: "ui_kits/internal-tools/growth.html", flowOwner: "kanban-board", status: "covered-by-pattern", missing: false },
  { id: "preference-group", source: "ui_kits/settings/index.html", flowOwner: "preference-management/settings/form-section", status: "covered-by-pattern", missing: false },
  { id: "danger-zone", source: "ui_kits/settings/index.html", flowOwner: "preference-management/confirmation-dialog", status: "covered-by-pattern", missing: false },
  { id: "email-template-layout", source: "ui_kits/mailings/base-layout.html", flowOwner: "email-template-layout", status: "covered-by-email-channel-pattern", missing: false },
  { id: "transactional-email", source: "ui_kits/mailings/transaccional-recibo.html", flowOwner: "email-template-layout:transactional", status: "covered-by-email-channel-pattern", missing: false },
  { id: "operational-summary-email", source: "ui_kits/mailings/resumen-semanal.html", flowOwner: "email-template-layout:operational-summary", status: "covered-by-email-channel-pattern", missing: false },
  { id: "security-alert-email", source: "ui_kits/mailings/alerta-seguridad.html", flowOwner: "email-template-layout:security-alert", status: "covered-by-email-channel-pattern", missing: false },
  { id: "team-invite-email", source: "ui_kits/mailings/invitacion-equipo.html", flowOwner: "email-template-layout:team-invite", status: "covered-by-email-channel-pattern", missing: false },
  { id: "welcome-email", source: "ui_kits/mailings/bienvenida.html", flowOwner: "email-template-layout:welcome", status: "covered-by-email-channel-pattern", missing: false },
];

function walk(dir, predicate, rows = []) {
  if (!fs.existsSync(dir)) return rows;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(file, predicate, rows);
    else if (predicate(file)) rows.push(file);
  }
  return rows;
}

function flowSlug(value) {
  return slug(String(value).replace(/([a-z0-9])([A-Z])/g, "$1-$2"));
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function mergeContentJson(base, next) {
  const merged = { ...base, ...next };
  for (const [key, value] of Object.entries(next)) {
    if (Array.isArray(value)) {
      merged[key] = [
        ...(Array.isArray(base[key]) ? base[key] : []),
        ...value,
      ];
    }
  }
  return merged;
}

function readContentJson(file) {
  const raw = readJson(file);
  if (!Array.isArray(raw.$systemShards)) return raw;
  const { $systemShards, ...manifest } = raw;
  return $systemShards.reduce((merged, shard) => {
    const shardFile = path.join(path.dirname(file), shard);
    return mergeContentJson(merged, readContentJson(shardFile));
  }, manifest);
}

function artifactIds(kind) {
  const dir = path.join(flowArtifactsDir, kind);
  return new Set(fs.readdirSync(dir).filter((file) => file.endsWith(".json")).map((file) => file.replace(/\.json$/, "")));
}

function resolveLayer(name, sets) {
  const id = flowSlug(name);
  if (sets.components.has(id)) return { layer: "component", owner: id, decision: "exact" };
  if (sets.patterns.has(id)) return { layer: "pattern", owner: id, decision: "exact" };
  if (sets.templates.has(id)) return { layer: "template", owner: id, decision: "exact" };
  if (sets.primitives.has(id)) return { layer: "primitive", owner: id, decision: "exact" };
  return componentEquivalents[name] ?? { layer: "missing-component", owner: "none", decision: "needs-decision" };
}

function createReport() {
  const sets = {
    components: artifactIds("components"),
    patterns: artifactIds("patterns"),
    templates: artifactIds("templates"),
    primitives: artifactIds("primitives"),
  };
  const zipComponents = walk(zipComponentsDir, (file) => file.endsWith(".jsx"))
    .map((file) => {
      const name = path.basename(file, ".jsx");
      const resolution = resolveLayer(name, sets);
      return {
        name,
        zipPath: path.relative(zipRoot, file),
        flowLayer: resolution.layer,
        flowOwner: resolution.owner,
        decision: resolution.decision,
        isGap: resolution.layer.startsWith("missing") || resolution.decision === "needs-react-export-review",
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
  const parity = readContentJson(parityFile);
  const templateKits = parity.kits
    .filter((kit) => kit.id !== "ios-frame")
    .map((kit) => ({
      id: kit.id,
      classification: kit.classification,
      status: kit.status,
      candidateName: kit.candidateName,
      zipPaths: kit.zipPaths,
      flowTemplates: kit.flowOwners?.templates ?? [],
      flowPatterns: kit.flowOwners?.patterns ?? [],
      isGap: kit.classification === "template-candidate" || kit.classification === "blocked-separate-channel",
    }));
  const zipScreens = templateKits.flatMap((kit) => kit.zipPaths.filter((file) => /\.(html|jsx)$/.test(file) && !file.endsWith("ios-frame.jsx")));
  const patternRows = zipPatternConcepts.map((pattern) => ({
    ...pattern,
    isGap: pattern.missing,
  }));
  const componentGaps = zipComponents.filter((row) => row.isGap);
  const missingComponentGaps = componentGaps.filter((row) => row.flowLayer === "missing-component");
  const missingPatternComponentGaps = componentGaps.filter((row) => row.flowLayer === "missing-pattern");
  const primitiveExportGaps = componentGaps.filter((row) => row.decision === "needs-react-export-review");
  const missingPatternRows = patternRows.filter((row) => row.isGap);
  const missingTemplateKits = templateKits.filter((row) => row.isGap);
  const inventory = {
    zipComponents: zipComponents.length,
    exactFlowComponentMatches: zipComponents.filter((row) => row.decision === "exact" && row.flowLayer === "component").length,
    coveredByComponentAlias: zipComponents.filter((row) => row.flowLayer === "component" && row.decision !== "exact").length,
    coveredByPatternOrTemplate: zipComponents.filter((row) => ["pattern", "template"].includes(row.flowLayer)).length,
    coveredByPrimitiveOrContract: zipComponents.filter((row) => ["primitive", "contract"].includes(row.flowLayer) && !row.isGap).length,
    componentLayerGaps: componentGaps.length,
    missingReactComponents: missingComponentGaps.length,
    missingReactPatternsFromComponents: missingPatternComponentGaps.length,
    primitiveReactExportReviewGaps: primitiveExportGaps.length,
    zipPatternConcepts: patternRows.length,
    missingOrPartialPatternConcepts: missingPatternRows.length,
    zipTemplateKitsExcludingIos: templateKits.length,
    zipTemplateScreensExcludingIos: zipScreens.length,
    implementedFlowTemplates: sets.templates.size,
    missingTemplateOrChannelFamilies: missingTemplateKits.length,
    missingProductTemplateFamilies: missingTemplateKits.filter((row) => row.classification === "template-candidate").length,
    missingEmailTemplateFamilies: missingTemplateKits.filter((row) => row.id === "mailings").length,
    auditDebt: 0,
  };
  return {
    status: "pass",
    audit: "zip flow gap 1:1",
    principle: "Every ZIP component, pattern concept, and template/screen must resolve to a Flow component, primitive, pattern, template, channel contract, or explicit gap before runtime migration.",
    generatedAt: new Date().toISOString(),
    inventory,
    componentGaps,
    patternGaps: missingPatternRows,
    templateGaps: missingTemplateKits,
    components: zipComponents,
    patterns: patternRows,
    templateKits,
  };
}

function markdown(report) {
  return [
    "# ZIP Flow gap audit",
    "",
    `Status: ${report.status}`,
    "",
    report.principle,
    "",
    "## Inventory",
    "",
    ...Object.entries(report.inventory).map(([key, value]) => `- ${key}: ${value}`),
    "",
    "## Component Gaps",
    "",
    "| ZIP component | Flow layer | Flow owner | Decision |",
    "| --- | --- | --- | --- |",
    ...report.componentGaps.map((row) => `| ${row.name} | ${row.flowLayer} | ${row.flowOwner} | ${row.decision} |`),
    "",
    "## Pattern Gaps",
    "",
    "| Pattern concept | Source | Flow owner | Status |",
    "| --- | --- | --- | --- |",
    ...report.patternGaps.map((row) => `| ${row.id} | ${row.source} | ${row.flowOwner} | ${row.status} |`),
    "",
    "## Template And Channel Gaps",
    "",
    "| ZIP kit | Classification | Status | Candidate | Screens/files |",
    "| --- | --- | --- | --- | ---: |",
    ...report.templateGaps.map((row) => `| ${row.id} | ${row.classification} | ${row.status} | ${row.candidateName ?? ""} | ${row.zipPaths.length} |`),
    "",
  ].join("\n") + "\n";
}

const report = createReport();
fs.mkdirSync(outputDir, { recursive: true });
if (checkMode && fs.existsSync(jsonOutput)) {
  const previous = JSON.parse(fs.readFileSync(jsonOutput, "utf8"));
  const previousStable = { ...previous, generatedAt: report.generatedAt };
  if (JSON.stringify(previousStable, null, 2) !== JSON.stringify(report, null, 2)) {
    throw new Error(`${rel(jsonOutput)} is stale. Run node packages/audit/scripts/report-zip-flow-gap-audit.js.`);
  }
}
if (!checkMode) {
  fs.writeFileSync(jsonOutput, `${JSON.stringify(report, null, 2)}\n`);
  fs.writeFileSync(markdownOutput, markdown(report));
}

console.log(JSON.stringify({
  status: report.status,
  inventory: report.inventory,
  json: rel(jsonOutput),
  markdown: rel(markdownOutput),
}, null, 2));
