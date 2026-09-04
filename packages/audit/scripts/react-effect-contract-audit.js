const { add } = require("./audit-context.js");

const allowedReactEffects = {
  Checkbox: {
    count: 1,
    reasons: ["DOM-only indeterminate input property"],
    snippets: ["inputRef.current.indeterminate = currentIndeterminate"],
  },
  ChartPanel: {
    count: 1,
    reasons: ["ECharts runtime needs a DOM host and stable post-layout resize synchronization"],
    snippets: ["import(\"echarts\")", "scheduleStableResize", "new ResizeObserver(scheduleStableResize)", "window.addEventListener(\"resize\", scheduleStableResize)"],
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
    reasons: ["calendar viewport follows controlled selected date or range", "outside click closes an open panel"],
    snippets: [
      "const nextViewValue = isRange ? selectedRange.from || selectedRange.to : selectedValue;",
      "document.addEventListener(\"mousedown\", onPointerDown);",
    ],
  },
  Menu: {
    count: 1,
    reasons: ["outside click closes an open panel"],
    snippets: ["document.addEventListener(\"mousedown\", onDocumentMouseDown);"],
  },
  Popover: {
    count: 2,
    reasons: ["optional autoFocus enters an open interactive panel", "outside click closes an open panel"],
    snippets: ["focusableInside(panelRef.current)?.focus();", "document.addEventListener(\"mousedown\", onDocumentMouseDown);"],
  },
  Select: {
    count: 2,
    reasons: ["controlled searchable input follows selected value", "outside click closes an open listbox"],
    snippets: [
      "setInputValue(selectedLabel || currentValue);",
      "document.addEventListener(\"mousedown\", handleDocumentMouseDown);",
    ],
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
