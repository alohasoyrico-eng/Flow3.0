const { add } = require("./audit-context.js");

const allowedReactEffects = {
  Checkbox: {
    count: 1,
    reasons: ["DOM-only indeterminate input property"],
    snippets: ["inputRef.current.indeterminate = currentIndeterminate"],
  },
  CountrySelector: {
    count: 1,
    reasons: ["outside click closes an open listbox"],
    snippets: ["document.addEventListener(\"mousedown\", onDocumentMouseDown);"],
  },
  Combobox: {
    count: 1,
    reasons: ["outside click closes an open listbox"],
    snippets: ["document.addEventListener(\"mousedown\", handleDocumentMouseDown);"],
  },
  DatePicker: {
    count: 2,
    reasons: ["calendar viewport follows controlled selected date", "outside click closes an open panel"],
    snippets: [
      "if (isValueControlled && value) setViewDate(clampViewDate(value));",
      "document.addEventListener(\"mousedown\", onPointerDown);",
    ],
  },
  DateRangePicker: {
    count: 2,
    reasons: ["calendar viewport follows controlled selected range", "outside click closes an open panel"],
    snippets: [
      "if (isValueControlled && (nextFrom || nextTo)) setViewDate(clampViewDate(nextFrom || nextTo));",
      "document.addEventListener(\"mousedown\", onPointerDown);",
    ],
  },
  Menu: {
    count: 1,
    reasons: ["outside click closes an open panel"],
    snippets: ["document.addEventListener(\"mousedown\", onDocumentMouseDown);"],
  },
  Popover: {
    count: 1,
    reasons: ["outside click closes an open panel"],
    snippets: ["document.addEventListener(\"mousedown\", onDocumentMouseDown);"],
  },
  Tabs: {
    count: 1,
    reasons: ["indicator geometry follows measured tab layout"],
    snippets: ["new ResizeObserver(() => syncIndicator(activeKey))"],
  },
};

function checkReactEffectContract({ name, sourceFile, source }) {
  const effectCount = (source.match(/\buseEffect\s*\(/g) ?? []).length;
  if (!effectCount) return;

  const contract = allowedReactEffects[name];
  if (!contract) {
    add("errors", sourceFile, 1, `${name} React source uses useEffect without an explicit allowed runtime-DOM or viewport synchronization contract.`);
    return;
  }

  if (effectCount !== contract.count) {
    add("errors", sourceFile, 1, `${name} React source must keep exactly ${contract.count} allowed useEffect contract(s): ${contract.reasons.join("; ")}.`);
  }

  for (const snippet of contract.snippets) {
    if (!source.includes(snippet)) {
      add("errors", sourceFile, 1, `${name} React source missing allowed useEffect contract snippet: ${snippet}.`);
    }
  }
}

module.exports = { checkReactEffectContract };
