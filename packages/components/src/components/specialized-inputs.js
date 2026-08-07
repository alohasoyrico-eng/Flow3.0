import { setIconGlyph } from "../primitives/iconography.js?v=1";
import {
  appendFieldHelper,
  createFieldShell,
  createFieldSurface,
  resolveFieldState,
} from "./fields.js?v=18";
import { createSpinner } from "./feedback.js?v=8";

let dateRangePickerId = 0;

function addClassName(node, className) {
  if (!node || !className) return;
  const current = String(node.className ?? "").split(/\s+/).filter(Boolean);
  if (!current.includes(className)) current.push(className);
  node.className = current.join(" ");
}

function createFieldLoadingSpinner(label) {
  const loadingNode = createSpinner({ label, density: "sm", decorative: true });
  loadingNode.className = `${loadingNode.className} field__icon field__icon--loading`;
  loadingNode.setAttribute("aria-hidden", "true");
  return loadingNode;
}

function removeNodeAttribute(node, name) {
  node?.removeAttribute?.(name);
  if (node?.attributes && Object.prototype.hasOwnProperty.call(node.attributes, name)) delete node.attributes[name];
}

function nodeAttribute(node, name) {
  const value = node?.getAttribute?.(name);
  if (value != null) return value;
  const attribute = node?.attributes?.[name];
  return typeof attribute === "object" && attribute !== null && "value" in attribute ? attribute.value : attribute;
}

export function createTransitionalDateRangePicker({
  label,
  value = {},
  from,
  to,
  placeholder = "Rango de fechas",
  helper = "",
  error = "",
  disabled = false,
  density,
  state,
  invalid = false,
  presets = true,
  presetItems,
  onValueChange,
  onOpenChange,
} = {}) {
  const controlId = `date-range-picker-${dateRangePickerId + 1}`;
  const visualState = resolveFieldState({ disabled, error: error || invalid ? "error" : "", state });
  const resolvedFrom = from ?? value?.from ?? "";
  const resolvedTo = to ?? value?.to ?? "";
  const { root, labelNode } = createFieldShell({
    id: controlId,
    label,
    fallbackLabel: "Date range",
    state: visualState,
    density,
    tag: "div",
    className: "date-picker date-range-picker",
  });
  addClassName(labelNode, "date-picker__label date-range-picker__label");
  root.dataset.open = "false";
  root.dataset.from = resolvedFrom;
  root.dataset.to = resolvedTo;
  let rangeFrom = resolvedFrom;
  let rangeTo = resolvedTo;
  let viewDate = parseDate(rangeFrom) ?? parseDate(rangeTo) ?? new Date();
  const panelId = `date-range-picker-panel-${dateRangePickerId += 1}`;
  const control = document.createElement("button");
  control.type = "button";
  control.className = createFieldSurface({ className: "date-picker__control date-range-picker__control" }).className;
  control.id = controlId;
  control.disabled = disabled;
  control.setAttribute("data-date-range-picker-trigger", "");
  control.setAttribute("aria-haspopup", "dialog");
  control.setAttribute("aria-expanded", "false");
  control.setAttribute("aria-controls", panelId);
  control.setAttribute("aria-labelledby", labelNode.id);
  if (invalid || error || state === "error") control.setAttribute("aria-invalid", "true");
  const iconNode = document.createElement("span");
  iconNode.className = "field__icon date-picker__icon date-range-picker__icon";
  iconNode.setAttribute("aria-hidden", "true");
  setIconGlyph(iconNode, "date_range");
  const valueNode = document.createElement("span");
  valueNode.className = "date-picker__value date-range-picker__value";
  valueNode.setAttribute("data-date-range-picker-value", "");
  const inputFrom = document.createElement("input");
  inputFrom.type = "date";
  inputFrom.className = "date-picker__input date-range-picker__input";
  inputFrom.value = rangeFrom;
  inputFrom.disabled = disabled;
  inputFrom.tabIndex = -1;
  inputFrom.setAttribute("data-date-range-picker-from", "");
  inputFrom.setAttribute("aria-label", `${label ?? "Date range"} start date`);
  const inputTo = document.createElement("input");
  inputTo.type = "date";
  inputTo.className = "date-picker__input date-range-picker__input";
  inputTo.value = rangeTo;
  inputTo.disabled = disabled;
  inputTo.tabIndex = -1;
  inputTo.setAttribute("data-date-range-picker-to", "");
  inputTo.setAttribute("aria-label", `${label ?? "Date range"} end date`);
  const panel = document.createElement("div");
  panel.className = "date-picker__panel date-range-picker__panel";
  panel.id = panelId;
  panel.hidden = true;
  panel.setAttribute("data-date-range-picker-panel", "");
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "false");
  panel.setAttribute("aria-label", `${label ?? "Date range"} calendar`);
  const helperText = error || helper;
  const rangeLabel = () => {
    if (!rangeFrom) return placeholder;
    return `${formatDateLabel(rangeFrom)} - ${rangeTo ? formatDateLabel(rangeTo) : "..."}`;
  };
  const emitRange = () => {
    root.dataset.from = rangeFrom;
    root.dataset.to = rangeTo;
    inputFrom.value = rangeFrom;
    inputTo.value = rangeTo;
    valueNode.textContent = rangeLabel();
    if (typeof onValueChange === "function") onValueChange({ from: rangeFrom, to: rangeTo });
  };
  const setOpen = (open, restoreFocus = false) => {
    root.dataset.open = String(Boolean(open));
    control.setAttribute("aria-expanded", String(Boolean(open)));
    panel.hidden = !open;
    if (restoreFocus) control.focus?.();
    if (typeof onOpenChange === "function") onOpenChange(Boolean(open));
  };
  control.append(iconNode, valueNode);
  const header = document.createElement("div");
  header.className = "date-picker__header date-range-picker__header";
  const previousMonth = createDatePickerNavButton("chevron_left", "Mes anterior");
  const monthLabel = document.createElement("strong");
  monthLabel.id = `${controlId}-month`;
  monthLabel.setAttribute("data-date-range-picker-month", "");
  const nextMonth = createDatePickerNavButton("chevron_right", "Mes siguiente");
  header.append(previousMonth, monthLabel, nextMonth);
  const grid = document.createElement("div");
  grid.className = "date-picker__grid date-range-picker__grid";
  grid.setAttribute("data-date-range-picker-grid", "");
  grid.setAttribute("role", "grid");
  grid.setAttribute("aria-labelledby", monthLabel.id);
  const selectDate = (nextValue) => {
    if (!rangeFrom || (rangeFrom && rangeTo)) {
      rangeFrom = nextValue;
      rangeTo = "";
    } else if (nextValue < rangeFrom) {
      rangeTo = rangeFrom;
      rangeFrom = nextValue;
      setOpen(false, true);
    } else {
      rangeTo = nextValue;
      setOpen(false, true);
    }
    emitRange();
    renderCalendar();
  };
  const presetOptions = presetItems ?? [
    { label: "7 dias", days: 7 },
    { label: "30 dias", days: 30 },
    { label: "90 dias", days: 90 },
  ];
  const presetRow = document.createElement("div");
  presetRow.className = "date-range-picker__presets";
  if (presets) {
    for (const preset of presetOptions) {
      const presetButton = document.createElement("button");
      presetButton.type = "button";
      presetButton.className = "date-range-picker__preset";
      presetButton.textContent = preset.label;
      presetButton.addEventListener?.("click", () => {
        const end = new Date();
        const start = new Date(end);
        start.setDate(end.getDate() - Number(preset.days ?? 1) + 1);
        rangeFrom = dateIso(start);
        rangeTo = dateIso(end);
        viewDate = start;
        emitRange();
        renderCalendar();
        setOpen(false, true);
      });
      presetRow.append(presetButton);
    }
  }
  const renderCalendar = () => {
    clearNode(grid);
    monthLabel.textContent = formatMonthLabel(viewDate);
    const todayValue = dateIso(new Date());
    for (const day of ["L", "M", "X", "J", "V", "S", "D"]) {
      const dayLabel = document.createElement("span");
      dayLabel.className = "date-picker__weekday";
      dayLabel.setAttribute("role", "columnheader");
      dayLabel.textContent = day;
      grid.append(dayLabel);
    }
    for (const cell of dateCells(viewDate)) {
      if (!cell) {
        const empty = document.createElement("span");
        empty.className = "date-picker__empty";
        empty.setAttribute("role", "gridcell");
        empty.setAttribute("aria-hidden", "true");
        grid.append(empty);
        continue;
      }
      const isoValue = dateIso(cell);
      const isFrom = isoValue === rangeFrom;
      const isTo = isoValue === rangeTo;
      const inRange = Boolean(rangeFrom && rangeTo && isoValue > rangeFrom && isoValue < rangeTo);
      const day = document.createElement("button");
      day.type = "button";
      day.className = "date-picker__day date-range-picker__day";
      day.textContent = String(cell.getDate());
      day.setAttribute("role", "gridcell");
      day.setAttribute("data-date-range-picker-day", isoValue);
      day.setAttribute("aria-label", formatDateLongLabel(isoValue));
      day.setAttribute("aria-pressed", String(isFrom || isTo));
      if (isoValue === todayValue) {
        day.setAttribute("aria-current", "date");
        day.setAttribute("data-today", "true");
      }
      if (isFrom) day.dataset.rangeEdge = "start";
      if (isTo) day.dataset.rangeEdge = "end";
      if (inRange) day.dataset.inRange = "true";
      day.addEventListener?.("click", () => selectDate(isoValue));
      day.addEventListener?.("keydown", (event) => {
        const days = Array.from(panel.querySelectorAll?.(".date-range-picker__day") ?? []);
        const index = days.indexOf(day);
        const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault?.();
          selectDate(isoValue);
        } else if (event.key in moves) {
          event.preventDefault?.();
          days[Math.max(0, Math.min(days.length - 1, index + moves[event.key]))]?.focus?.();
        } else if (event.key === "Escape") {
          event.preventDefault?.();
          setOpen(false, true);
        }
      });
      grid.append(day);
    }
  };
  const moveMonth = (delta) => {
    viewDate = new Date(viewDate.getFullYear(), viewDate.getMonth() + delta, 1);
    renderCalendar();
  };
  previousMonth.addEventListener?.("click", () => moveMonth(-1));
  nextMonth.addEventListener?.("click", () => moveMonth(1));
  control.addEventListener?.("click", () => {
    if (!disabled) setOpen(panel.hidden);
  });
  control.addEventListener?.("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault?.();
      setOpen(false, true);
    }
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault?.();
      setOpen(true);
      panel.querySelector?.(".date-range-picker__day")?.focus?.();
    }
  });
  panel.addEventListener?.("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault?.();
    setOpen(false, true);
  });
  document.addEventListener?.("mousedown", (event) => {
    if (root.dataset.open !== "true") return;
    if (root.contains?.(event.target)) return;
    setOpen(false);
  });
  emitRange();
  renderCalendar();
  if (presets) panel.append(presetRow);
  panel.append(header, grid);
  root.append(control, inputFrom, inputTo, panel);
  appendFieldHelper(root, { id: controlId, text: helperText, target: control, className: "date-picker__helper date-range-picker__helper" });
  return root;
}

export function hydrateTransitionalDateRangePicker(root, { placeholder = "Rango de fechas", disabled = false, onValueChange, onOpenChange } = {}) {
  if (!root || root.dataset?.dateRangePickerReady === "true") return root;
  root.dataset.dateRangePickerReady = "true";
  const control = root.querySelector?.("[data-date-range-picker-trigger]");
  const panel = root.querySelector?.("[data-date-range-picker-panel]");
  const valueNode = root.querySelector?.("[data-date-range-picker-value]");
  const inputFrom = root.querySelector?.("[data-date-range-picker-from]");
  const inputTo = root.querySelector?.("[data-date-range-picker-to]");
  if (!control || !panel || !valueNode) return root;
  let rangeFrom = root.dataset.from ?? inputFrom?.value ?? "";
  let rangeTo = root.dataset.to ?? inputTo?.value ?? "";
  const setValueText = () => {
    valueNode.textContent = rangeFrom
      ? `${formatDateLabel(rangeFrom)} - ${rangeTo ? formatDateLabel(rangeTo) : "..."}`
      : placeholder;
    root.dataset.from = rangeFrom;
    root.dataset.to = rangeTo;
    if (inputFrom) inputFrom.value = rangeFrom;
    if (inputTo) inputTo.value = rangeTo;
  };
  const setOpen = (open, restoreFocus = false) => {
    root.dataset.open = String(Boolean(open));
    control.setAttribute?.("aria-expanded", String(Boolean(open)));
    panel.hidden = !open;
    if (restoreFocus) control.focus?.();
    if (typeof onOpenChange === "function") onOpenChange(Boolean(open));
  };
  const syncDayStates = () => {
    for (const day of panel.querySelectorAll?.("[data-date-range-picker-day]") ?? []) {
      const value = nodeAttribute(day, "data-date-range-picker-day");
      day.removeAttribute?.("data-range-edge");
      delete day.dataset.rangeEdge;
      day.removeAttribute?.("data-in-range");
      delete day.dataset.inRange;
      const isStart = value === rangeFrom;
      const isEnd = value === rangeTo;
      const middle = Boolean(rangeFrom && rangeTo && value > rangeFrom && value < rangeTo);
      day.setAttribute?.("aria-pressed", String(isStart || isEnd));
      if (isStart) day.dataset.rangeEdge = "start";
      if (isEnd) day.dataset.rangeEdge = "end";
      if (middle) day.dataset.inRange = "true";
    }
  };
  const emitRange = () => {
    setValueText();
    syncDayStates();
    if (typeof onValueChange === "function") onValueChange({ from: rangeFrom, to: rangeTo });
  };
  const chooseDate = (value) => {
    if (!rangeFrom || (rangeFrom && rangeTo)) {
      rangeFrom = value;
      rangeTo = "";
    } else if (value < rangeFrom) {
      rangeTo = rangeFrom;
      rangeFrom = value;
      setOpen(false, true);
    } else {
      rangeTo = value;
      setOpen(false, true);
    }
    emitRange();
  };
  control.addEventListener?.("click", () => {
    if (!disabled && !control.disabled) setOpen(panel.hidden);
  });
  control.addEventListener?.("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault?.();
      setOpen(false, true);
    }
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault?.();
      setOpen(true);
      panel.querySelector?.("[data-date-range-picker-day]")?.focus?.();
    }
  });
  for (const preset of panel.querySelectorAll?.(".date-range-picker__preset") ?? []) {
    preset.addEventListener?.("click", () => {
      const match = preset.textContent.match(/\d+/);
      const days = Number(match?.[0] ?? 1);
      const end = new Date();
      const start = new Date(end);
      start.setDate(end.getDate() - days + 1);
      rangeFrom = dateIso(start);
      rangeTo = dateIso(end);
      emitRange();
      setOpen(false, true);
    });
  }
  for (const day of panel.querySelectorAll?.("[data-date-range-picker-day]") ?? []) {
    const value = nodeAttribute(day, "data-date-range-picker-day");
    day.addEventListener?.("click", () => chooseDate(value));
    day.addEventListener?.("keydown", (event) => {
      const days = Array.from(panel.querySelectorAll?.("[data-date-range-picker-day]") ?? []);
      const index = days.indexOf(day);
      const moves = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault?.();
        chooseDate(value);
      } else if (event.key in moves) {
        event.preventDefault?.();
        days[Math.max(0, Math.min(days.length - 1, index + moves[event.key]))]?.focus?.();
      } else if (event.key === "Escape") {
        event.preventDefault?.();
        setOpen(false, true);
      }
    });
  }
  panel.addEventListener?.("keydown", (event) => {
    if (event.key !== "Escape") return;
    event.preventDefault?.();
    setOpen(false, true);
  });
  document.addEventListener?.("mousedown", (event) => {
    if (root.dataset.open !== "true") return;
    if (root.contains?.(event.target)) return;
    setOpen(false);
  });
  emitRange();
  return root;
}

function createDatePickerNavButton(icon, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "date-picker__nav";
  button.setAttribute("aria-label", label);
  const iconNode = document.createElement("span");
  iconNode.className = "field__icon date-picker__icon";
  iconNode.setAttribute("aria-hidden", "true");
  setIconGlyph(iconNode, icon);
  button.append(iconNode);
  return button;
}

function clearNode(node) {
  if (typeof node.replaceChildren === "function") {
    node.replaceChildren();
    return;
  }
  node.children = [];
  node.textContent = "";
}

function parseDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateIso(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDateLabel(value) {
  const date = parseDate(value);
  if (!date) return "";
  return date.toLocaleDateString("es-MX", { day: "2-digit", month: "short", year: "numeric" });
}

function formatDateLongLabel(value) {
  const date = parseDate(value);
  if (!date) return "";
  return date.toLocaleDateString("es-MX", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
}

function formatMonthLabel(date) {
  const month = date.toLocaleDateString("es-MX", { month: "long" });
  return `${month.charAt(0).toUpperCase()}${month.slice(1)} ${date.getFullYear()}`;
}

function dateCells(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: startOffset }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day));
  return cells;
}
