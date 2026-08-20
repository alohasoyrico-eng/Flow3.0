#!/usr/bin/env node

const { fs, path, root, goldComponents } = require("./audit-context.js");

const checkMode = process.argv.includes("--check");
const outputDir = path.join(root, "docs/audits");
const jsonOutput = path.join(outputDir, "control-frame-adoption-inventory.json");
const markdownOutput = path.join(outputDir, "control-frame-adoption-inventory.md");

const componentRoles = {
  accordion: { role: "composition", status: "not-applicable", iteration: null, note: "Content disclosure shell; no primary control frame beyond internal triggers." },
  "animated-moment": { role: "motion", status: "not-applicable", iteration: null, note: "Motion primitive/component; not a frame consumer." },
  "audit-event": { role: "display", status: "not-applicable", iteration: null, note: "Timeline/display component." },
  avatar: { role: "display", status: "not-applicable", iteration: null, note: "Identity media frame, not an interactive control frame." },
  badge: { role: "display", status: "not-applicable", iteration: null, note: "Inline status display." },
  "biometric-prompt": { role: "composition", status: "separate-contract", iteration: 2, note: "Prompt actions compose Button; biometric icon uses its own exact density-derived frame." },
  breadcrumbs: { role: "navigation-item", status: "covered", iteration: 2, note: "Navigation targets consume ControlFrame size/typography with navigation-specific radius and padding." },
  button: { role: "action", status: "covered", iteration: 2, note: "Consumes ControlFrame action size/font/padding/radius." },
  card: { role: "surface", status: "not-applicable", iteration: null, note: "Surface/container; should not become a control frame." },
  "card-expiry-input": { role: "field", status: "covered-via-field", iteration: 3, note: "Card field geometry derives from Field aliases." },
  "card-number-input": { role: "field", status: "covered-via-field", iteration: 3, note: "Card field geometry derives from Field aliases." },
  "card-security-code-input": { role: "field", status: "covered-via-field", iteration: 3, note: "Card field geometry derives from Field aliases." },
  "card-summary": { role: "display", status: "not-applicable", iteration: null, note: "Commerce summary display." },
  "chart-panel": { role: "surface", status: "not-applicable", iteration: null, note: "Data surface; no control frame." },
  "chat-composer": { role: "field-composition", status: "covered", iteration: 3, note: "Composes Surface, TextArea, Button, and IconButton; composer layout owns no local control frame." },
  "chat-message": { role: "display", status: "not-applicable", iteration: null, note: "Message display." },
  "chat-thread": { role: "composition", status: "not-applicable", iteration: null, note: "Thread layout/composition." },
  checkbox: { role: "choice", status: "separate-contract", iteration: 5, note: "Uses ChoiceMark/IconDensity, not full ControlFrame." },
  chip: { role: "inline-trigger", status: "separate-contract", iteration: 2, note: "Selectable/removable chips use inline trigger sizing, exact border-box frame, and do not consume standard Button ControlFrame." },
  "code-block": { role: "content", status: "not-applicable", iteration: null, note: "Code content surface; CopyButton inside should own action frame." },
  "code-input": { role: "field-slot", status: "separate-contract", iteration: 3, note: "OTP/code slots use specialized exact border-box slot geometry backed by shared code slot frame roles." },
  combobox: { role: "field-option-overlay", status: "covered", iteration: 3, note: "Input frame inherits Field ControlFrame; listbox/options consume shared Listbox/OptionRow roles with explicit keyboard/selection guards." },
  "copy-button": { role: "action-composition", status: "covered", iteration: 2, note: "Composes Button/IconButton; .copy-button is limited to copy feedback and must not own frame geometry." },
  "country-selector": { role: "field-option-overlay", status: "covered", iteration: 3, note: "Consumes Select/Field trigger roles plus governed option/listbox/search frames with border-box safeguards." },
  "date-picker": { role: "field-overlay-grid", status: "covered", iteration: 3, note: "Trigger consumes Field ControlFrame sizing; calendar grid uses exact calendar-day frame and date panel roles." },
  "date-range-picker": { role: "field-overlay-grid", status: "covered", iteration: 3, note: "Inherits DatePicker trigger/day frame and adds exact range preset/date panel roles." },
  dialog: { role: "modal-panel", status: "separate-contract", iteration: 4, note: "Modal panel owns dialog-specific frame/motion/z-index aliases with border-box safeguards; footer actions compose Button." },
  drawer: { role: "sheet-panel", status: "separate-contract", iteration: 4, note: "Sheet panel owns drawer-specific frame/motion/z-index aliases with border-box safeguards; close/footer actions compose action controls." },
  "empty-state": { role: "display", status: "not-applicable", iteration: null, note: "Display/empty content; actions inside should compose Button." },
  "error-panel": { role: "feedback-surface", status: "not-applicable", iteration: null, note: "Feedback surface; actions inside should compose Button." },
  "floating-action-button": { role: "action-exception", status: "separate-contract", iteration: 2, note: "Uses FAB scale, not standard inline ControlFrame; audit requires exact block-size and border-box." },
  "icon-button": { role: "action-icon", status: "covered", iteration: 2, note: "Consumes ControlFrame action/icon sizing and passes runtime frame audit." },
  "inline-validation": { role: "feedback", status: "not-applicable", iteration: null, note: "Validation message, not a control frame." },
  input: { role: "field", status: "covered", iteration: 3, note: "Consumes ControlFrame field size/font/padding/radius." },
  "input-amount": { role: "field", status: "covered-via-field", iteration: 3, note: "Amount input should inherit Field frame contract." },
  "kpi-tile": { role: "display", status: "not-applicable", iteration: null, note: "Metric display surface." },
  list: { role: "content-list", status: "not-applicable", iteration: null, note: "List display; option rows are separate role." },
  menu: { role: "option-overlay", status: "covered", iteration: 4, note: "Panel consumes Listbox/OverlayPanel roles; items consume OptionRow geometry with explicit border-box safeguards; triggers remain action consumers." },
  "motion-boundary": { role: "motion", status: "not-applicable", iteration: null, note: "Motion boundary primitive/component." },
  "movement-row": { role: "display-row", status: "not-applicable", iteration: null, note: "Domain row display." },
  pagination: { role: "navigation-action", status: "covered", iteration: 2, note: "Consumes ControlFrame action sizing/font/padding/radius and passes runtime frame audit." },
  "phone-input": { role: "field-composition", status: "covered", iteration: 3, note: "Composes Field, Input, and CountrySelector; compact size overrides Field alias through governed phone input roles." },
  popover: { role: "overlay", status: "covered", iteration: 4, note: "Panel consumes OverlayPanel roles with explicit border-box; trigger remains an external action/control consumer." },
  "progress-indicator": { role: "feedback", status: "not-applicable", iteration: null, note: "Progress display." },
  "quick-action": { role: "action-content-frame", status: "separate-contract", iteration: 2, note: "Uses ActionContentFrame roles for circular icon control plus external label; not a standard 36/44/52 inline ControlFrame." },
  "radio-button": { role: "choice", status: "separate-contract", iteration: 5, note: "Uses ChoiceMark/IconDensity, not full ControlFrame." },
  "route-summary": { role: "display", status: "not-applicable", iteration: null, note: "Domain summary display." },
  "segmented-control": { role: "navigation-action", status: "covered", iteration: 2, note: "Segment items consume ControlFrame action sizing/padding/radius and pass runtime frame audit." },
  select: { role: "field-option-overlay", status: "covered", iteration: 3, note: "Trigger consumes field frame; listbox/options consume overlay/option roles." },
  skeleton: { role: "feedback-placeholder", status: "not-applicable", iteration: null, note: "Placeholder display." },
  slider: { role: "range-control", status: "separate-contract", iteration: 5, note: "Owns track/thumb geometry; should align icon/choice density principles, not full frame." },
  spinner: { role: "feedback", status: "not-applicable", iteration: null, note: "Loading display." },
  "station-pin": { role: "display-map", status: "not-applicable", iteration: null, note: "Map/domain marker." },
  stepper: { role: "step-marker", status: "separate-contract", iteration: 2, note: "Non-interactive progress markers use StepMarker sizing with exact border-box marker frame, not Button ControlFrame." },
  switch: { role: "choice", status: "separate-contract", iteration: 5, note: "Uses ChoiceMark/SwitchFrame, not full ControlFrame." },
  table: { role: "data", status: "not-applicable", iteration: null, note: "Data grid surface; filters/actions inside use separate controls." },
  tabs: { role: "navigation-action", status: "covered", iteration: 2, note: "Tabs tab now consumes ControlFrame action size/font/padding/radius." },
  tag: { role: "display", status: "not-applicable", iteration: null, note: "Inline label/status display unless made removable/selectable." },
  "text-area": { role: "field-multiline", status: "separate-contract", iteration: 3, note: "Multiline field should share field radius/padding, but not fixed ControlFrame height." },
  toast: { role: "feedback-overlay", status: "covered", iteration: 4, note: "Feedback surface owns toast-specific motion/size roles; action and dismiss controls compose Button/IconButton with audit guards against local action clones." },
  tooltip: { role: "tooltip-bubble", status: "separate-contract", iteration: 4, note: "Trigger consumes InlineTrigger roles; inverted bubble keeps tooltip semantics while deriving depth/z-index and border-box safeguards from shared overlay roles." },
  "tree-view": { role: "navigation-list", status: "covered", iteration: 4, note: "Rows compose Button but use a governed TreeView navigation-row contract with density, indentation, icon, motion, and border-box safeguards." },
};

function renderMarkdown(report) {
  const rows = report.components
    .map((item) => `| ${item.component} | ${item.role} | ${item.status} | ${item.iteration ?? "n/a"} | ${item.note} |`)
    .join("\n");
  const summaryRows = Object.entries(report.summary.byStatus)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([status, count]) => `| ${status} | ${count} |`)
    .join("\n");
  const iterationRows = Object.entries(report.summary.byIteration)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([iteration, count]) => `| ${iteration} | ${count} |`)
    .join("\n");
  return [
    "# ControlFrame Adoption Inventory",
    "",
    `Status: ${report.status}`,
    "",
    "This inventory classifies every gold React component by the frame role it should consume. ControlFrame is not a visual flattening rule; it defines shared rendered control size, typography, padding, radius roles, and border-box behavior where a component is an interactive frame.",
    "",
    "## Summary",
    "",
    `- Components: ${report.summary.total}`,
    `- Covered: ${report.summary.covered}`,
    `- Needs review/debt/partial: ${report.summary.needsWork}`,
    `- Not applicable or separate contract: ${report.summary.notControlFrame}`,
    "",
    "| Status | Count |",
    "| --- | ---: |",
    summaryRows,
    "",
    "## Iteration Buckets",
    "",
    "| Iteration | Components |",
    "| ---: | ---: |",
    iterationRows,
    "",
    "## Components",
    "",
    "| Component | Role | Status | Iteration | Note |",
    "| --- | --- | --- | ---: | --- |",
    rows,
    "",
  ].join("\n");
}

function buildReport() {
  const extra = Object.keys(componentRoles).filter((component) => !goldComponents.includes(component)).sort();
  const missing = goldComponents.filter((component) => !componentRoles[component]).sort();
  const components = [...goldComponents].sort().map((component) => ({
    component,
    ...componentRoles[component],
  }));
  const byStatus = {};
  const byIteration = {};
  for (const component of components) {
    byStatus[component.status] = (byStatus[component.status] ?? 0) + 1;
    if (component.iteration) byIteration[component.iteration] = (byIteration[component.iteration] ?? 0) + 1;
  }
  const issues = [
    ...missing.map((component) => `Missing ControlFrame adoption classification for ${component}.`),
    ...extra.map((component) => `ControlFrame adoption classification includes non-gold component ${component}.`),
  ];
  return {
    status: issues.length ? "fail" : "pass",
    summary: {
      total: components.length,
      covered: components.filter((component) => component.status === "covered" || component.status === "covered-via-field").length,
      needsWork: components.filter((component) => ["debt", "partial", "review"].includes(component.status)).length,
      notControlFrame: components.filter((component) => ["not-applicable", "separate-contract"].includes(component.status)).length,
      byStatus,
      byIteration,
    },
    issues,
    components,
  };
}

const report = buildReport();
const json = `${JSON.stringify(report, null, 2)}\n`;
const markdown = renderMarkdown(report);

if (checkMode) {
  const currentJson = fs.existsSync(jsonOutput) ? fs.readFileSync(jsonOutput, "utf8") : "";
  const currentMarkdown = fs.existsSync(markdownOutput) ? fs.readFileSync(markdownOutput, "utf8") : "";
  if (currentJson !== json || currentMarkdown !== markdown) {
    console.error("ControlFrame adoption inventory is stale. Run: node packages/audit/scripts/report-control-frame-adoption-inventory.js");
    process.exit(1);
  }
  if (report.status !== "pass") {
    console.error(JSON.stringify(report.issues, null, 2));
    process.exit(1);
  }
  process.exit(0);
}

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(jsonOutput, json);
fs.writeFileSync(markdownOutput, markdown);
console.log(JSON.stringify({
  status: report.status,
  output: [path.relative(root, jsonOutput), path.relative(root, markdownOutput)],
  summary: report.summary,
  issues: report.issues,
}, null, 2));
if (report.status !== "pass") process.exit(1);
