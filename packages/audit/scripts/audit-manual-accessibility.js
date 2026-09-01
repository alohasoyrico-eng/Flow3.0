const { add, fs, path, read, root } = require("./audit-context.js");

const manualQaFile = path.join(root, "docs/manual-qa/manual-accessibility-qa.md");

const interactiveComponents = [
  {
    id: "dialog",
    source: "Dialog.js",
    contract: "dialog.md",
    sourceRequirements: [
      ["role: \"dialog\"", "role=\"dialog\""],
      ["\"aria-modal\": \"true\"", "aria-modal=\"true\""],
      ["\"aria-labelledby\"", "aria-labelledby"],
      ["aria-haspopup\": \"dialog\"", "aria-haspopup=\"dialog\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["event.key !== \"Escape\"", "event.key === \"Escape\"", "Escape"],
      ["closeRef.current?.focus"],
      ["triggerRef.current?.focus"],
    ],
    checklist: ["role dialog", "aria-modal", "accessible title", "initial focus", "focus restoration", "Escape", "overlay dismissal"],
  },
  {
    id: "drawer",
    source: "Drawer.js",
    contract: "drawer.md",
    sourceRequirements: [
      ["role: \"dialog\"", "role=\"dialog\""],
      ["\"aria-modal\": \"true\"", "aria-modal=\"true\""],
      ["\"aria-labelledby\"", "aria-labelledby"],
      ["aria-haspopup\": \"dialog\"", "aria-haspopup=\"dialog\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["event.key !== \"Escape\"", "event.key === \"Escape\"", "Escape"],
      ["closeRef.current?.focus"],
      ["triggerRef.current?.focus"],
    ],
    checklist: ["role dialog", "aria-modal", "accessible title", "initial focus", "focus restoration", "Escape", "scroll containment"],
  },
  {
    id: "menu",
    source: "Menu.js",
    contract: "menu.md",
    sourceRequirements: [
      ["\"aria-haspopup\": \"menu\"", "aria-haspopup=\"menu\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["role: \"menu\"", "role=\"menu\""],
      ["role: \"menuitem\"", "role=\"menuitem\""],
      ["ArrowDown"],
      ["ArrowUp"],
      ["Home"],
      ["End"],
      ["Escape"],
      ["restoreFocus"],
      ["focusFirst"],
    ],
    checklist: ["trigger state", "menu/menuitem roles", "roving focus", "Arrow keys", "Home/End", "Escape", "focus restoration"],
  },
  {
    id: "popover",
    source: "Popover.js",
    contract: "popover.md",
    sourceRequirements: [
      ["aria-haspopup\": \"dialog\"", "aria-haspopup=\"dialog\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["role: \"dialog\"", "role=\"dialog\""],
      ["Escape"],
      ["restoreFocus"],
    ],
    checklist: ["trigger state", "panel role/name", "Escape", "focus restoration", "outside/click dismissal", "mobile escalation decision"],
  },
  {
    id: "tooltip",
    source: "Tooltip.js",
    contract: "tooltip.md",
    sourceRequirements: [
      ["role: \"tooltip\"", "role=\"tooltip\""],
      ["\"aria-describedby\"", "aria-describedby"],
      ["onFocus"],
      ["onBlur"],
      ["onMouseEnter"],
      ["onMouseLeave"],
      ["Escape"],
    ],
    checklist: ["visible trigger", "aria-describedby", "hover", "focus", "blur", "Escape", "short copy"],
  },
  {
    id: "select",
    source: "Select.js",
    contract: "select.md",
    sourceRequirements: [
      ["role: \"combobox\"", "role=\"combobox\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["\"aria-activedescendant\"", "aria-activedescendant"],
      ["role: \"listbox\"", "role=\"listbox\""],
      ["role: \"option\"", "role=\"option\""],
      ["\"aria-selected\"", "aria-selected"],
      ["Escape"],
    ],
    checklist: ["combobox trigger", "listbox/options", "selected state", "active option", "Escape", "selection commit", "screen reader value"],
  },
  {
    id: "combobox",
    source: "Combobox.js",
    contract: "combobox.md",
    sourceRequirements: [
      ["React.createElement(Select"],
      ["searchable: true"],
      ["clearable: Boolean(clearSelectionLabel)"],
      ["onValueChange"],
      ["onOpenChange"],
    ],
    checklist: ["editable value", "aria-autocomplete", "active descendant", "filtering announcement", "keyboard selection", "clear action", "empty result"],
  },
  {
    id: "country-selector",
    source: "CountrySelector.js",
    contract: "country-selector.md",
    sourceRequirements: [
      ["role: \"combobox\"", "role=\"combobox\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["\"aria-activedescendant\"", "aria-activedescendant"],
      ["role: \"listbox\"", "role=\"listbox\""],
      ["role: \"option\"", "role=\"option\""],
      ["\"aria-selected\"", "aria-selected"],
      ["ArrowDown"],
      ["ArrowUp"],
      ["Escape"],
    ],
    checklist: ["country name", "calling code", "flag decorative", "search field", "active option", "keyboard selection", "Escape"],
  },
  {
    id: "date-picker",
    source: "DatePicker.js",
    contract: "date-picker.md",
    sourceRequirements: [
      ["aria-haspopup\": \"dialog\"", "aria-haspopup=\"dialog\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["role: \"dialog\"", "role=\"dialog\""],
      ["role: \"grid\"", "role=\"grid\""],
      ["role: \"gridcell\"", "role=\"gridcell\""],
      ["\"aria-current\": isoValue === todayValue ? \"date\"", "aria-current=\"date\""],
      ["\"aria-pressed\"", "aria-pressed"],
      ["PageUp"],
      ["PageDown"],
      ["Escape"],
      ["controlRef.current?.focus"],
    ],
    checklist: ["trigger state", "calendar dialog", "grid semantics", "day names", "today/current date", "selector navigation", "Escape/focus return"],
  },
  {
    id: "date-range-picker",
    source: "DatePicker.js",
    contract: "date-range-picker.md",
    sourceRequirements: [
      ["aria-haspopup\": \"dialog\"", "aria-haspopup=\"dialog\""],
      ["\"aria-expanded\"", "aria-expanded"],
      ["\"aria-controls\"", "aria-controls"],
      ["role: \"dialog\"", "role=\"dialog\""],
      ["role: \"grid\"", "role=\"grid\""],
      ["role: \"gridcell\"", "role=\"gridcell\""],
      ["\"aria-current\": isoValue === todayValue ? \"date\"", "aria-current=\"date\""],
      ["\"aria-pressed\"", "aria-pressed"],
      ["PageUp"],
      ["PageDown"],
      ["Escape"],
      ["controlRef.current?.focus"],
    ],
    checklist: ["trigger state", "range start/end", "calendar dialog", "grid semantics", "preset buttons", "selector navigation", "keyboard range commit", "Escape/focus return"],
  },
];

function hasAny(source, alternatives) {
  return alternatives.some((needle) => source.includes(needle));
}

function requireFile(file, message) {
  if (!fs.existsSync(file)) {
    add("errors", file, 1, message);
    return "";
  }
  return read(file);
}

function checkReactSource(component) {
  const file = path.join(root, "packages/react/src", component.source);
  const source = requireFile(file, `${component.id} needs a package-owned React implementation for manual accessibility QA.`);
  if (!source) return;

  for (const requirement of component.sourceRequirements) {
    if (!hasAny(source, requirement)) {
      add("errors", file, 1, `${component.id} manual accessibility source contract is missing ${requirement[0]}.`);
    }
  }
}

function checkContract(component) {
  const file = path.join(root, "packages/content/content/component-contracts/components", component.contract);
  const contract = requireFile(file, `${component.id} needs a component contract before manual accessibility QA can be governed.`);
  if (!contract) return;

  const normalized = contract.toLowerCase();
  for (const term of ["accessibility", "keyboard", "focus", "escape"]) {
    if (!normalized.includes(term)) {
      add("errors", file, 1, `${component.id} contract must document manual accessibility term: ${term}.`);
    }
  }
}

function checkManualQaGuide() {
  const guide = requireFile(manualQaFile, "Manual accessibility QA guide is required for release readiness.");
  if (!guide) return;
  const normalizedGuide = guide.toLowerCase();

  if (!guide.includes("## Evidence Register")) {
    add("errors", manualQaFile, 1, "Manual accessibility QA guide must include an Evidence Register.");
  }

  for (const column of ["Component", "Status", "Viewport", "Density", "Color mode", "Keyboard path", "Screen reader", "Reduced motion", "Evidence / issue"]) {
    if (!guide.includes(column)) {
      add("errors", manualQaFile, 1, `Manual accessibility Evidence Register must include column: ${column}.`);
    }
  }

  for (const component of interactiveComponents) {
    if (!guide.includes(`| ${component.id} |`)) {
      add("errors", manualQaFile, 1, `Manual accessibility QA guide must include ${component.id}.`);
    }
    if (!normalizedGuide.includes(`| ${component.id} | not run |`) && !normalizedGuide.includes(`| ${component.id} | pass |`) && !normalizedGuide.includes(`| ${component.id} | exception accepted |`)) {
      add("errors", manualQaFile, 1, `Manual accessibility Evidence Register must track status for ${component.id}.`);
    }
    for (const item of component.checklist) {
      if (!normalizedGuide.includes(item.toLowerCase())) {
        add("errors", manualQaFile, 1, `Manual accessibility QA guide must cover ${component.id}: ${item}.`);
      }
    }
  }

  for (const gate of ["keyboard", "screen reader", "focus", "Escape", "light/dark", "density", "reduced motion"]) {
    if (!guide.toLowerCase().includes(gate.toLowerCase())) {
      add("errors", manualQaFile, 1, `Manual accessibility QA guide must include gate: ${gate}.`);
    }
  }
}

function checkManualAccessibility() {
  for (const component of interactiveComponents) {
    checkReactSource(component);
    checkContract(component);
  }
  checkManualQaGuide();
}

module.exports = { checkManualAccessibility };
