import React, { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { dateRangePickerPlatformContract } from "#flow/platforms";
import { flowStateProps, flowDensityProps, flowRestProps } from "./internal/props.js";

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

function formatDateLabel(value, locale) {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" })
    .format(date)
    .replace(".", "");
}

function formatDateLongLabel(value, locale) {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

function formatMonthLabel(date, locale) {
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dateCells(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7) cells.push(null);
  return cells;
}

function resolveDateRangePickerState({ disabled = false, error = "", invalid = false, state, from = "", to = "" } = {}) {
  if (disabled) return "disabled";
  if (error || invalid) return "error";
  if (state) return state;
  return from || to ? "selected" : "default";
}

function clampViewDate(value) {
  return parseDate(value) ?? new Date();
}

function rangeLabel({ from, to, placeholder, locale }) {
  if (!from) return placeholder;
  return `${formatDateLabel(from, locale)} - ${to ? formatDateLabel(to, locale) : "..."}`;
}

export const DateRangePicker = forwardRef(function DateRangePicker({
  label,
  value,
  from,
  to,
  placeholder = "",
  helper = "",
  error = "",
  disabled = false,
  density,
  state,
  invalid = false,
  locale,
  weekdays,
  calendarLabel,
  previousMonthLabel,
  nextMonthLabel,
  presets,
  presetItems,
  open: openProp,
  onValueChange,
  onOpenChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const controlId = id ?? `date-range-picker-${generatedId}`;
  const panelId = `${controlId}-panel`;
  const monthId = `${controlId}-month`;
  const rootRef = useRef(null);
  const controlRef = useRef(null);
  const isValueControlled = value !== undefined || from !== undefined || to !== undefined;
  const initialFrom = from ?? value?.from ?? "";
  const initialTo = to ?? value?.to ?? "";
  const [internalRange, setInternalRange] = useState({ from: initialFrom, to: initialTo });
  const range = isValueControlled ? { from: from ?? value?.from ?? "", to: to ?? value?.to ?? "" } : internalRange;
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [viewDate, setViewDate] = useState(() => clampViewDate(initialFrom || initialTo));
  const helperText = error || helper;
  const resolvedState = resolveDateRangePickerState({ disabled, error, invalid, state, from: range.from, to: range.to });
  const todayValue = useMemo(() => dateIso(new Date()), []);
  const cells = useMemo(() => dateCells(viewDate), [viewDate]);
  const sourceWeekdays = Array.isArray(weekdays) ? weekdays : [];
  const presetOptions = Array.isArray(presetItems)
    ? presetItems.filter((preset) => preset?.key !== undefined && preset.key !== null && preset.key !== "" && preset?.label && Number.isFinite(Number(preset.days)))
    : [];
  const showPresets = presets ?? presetOptions.length > 0;
  const visibleValue = rangeLabel({ ...range, placeholder, locale });

  useEffect(() => {
    const nextFrom = from ?? value?.from ?? "";
    const nextTo = to ?? value?.to ?? "";
    if (isValueControlled && (nextFrom || nextTo)) setViewDate(clampViewDate(nextFrom || nextTo));
  }, [from, isValueControlled, to, value?.from, value?.to]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false, false, event);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  if (!label) return null;

  const setOpen = (nextOpen, restoreFocus = false, event) => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    onOpenChange?.(normalizedOpen, event);
    if (restoreFocus) requestAnimationFrame(() => controlRef.current?.focus());
  };

  const commitRange = (nextRange, close = false, event) => {
    if (!isValueControlled) setInternalRange(nextRange);
    if (nextRange.from || nextRange.to) setViewDate(clampViewDate(nextRange.from || nextRange.to));
    onValueChange?.(nextRange, event);
    if (close) setOpen(false, true, event);
  };

  const selectDate = (nextValue, event) => {
    if (!range.from || range.to) {
      commitRange({ from: nextValue, to: "" }, false, event);
      return;
    }
    if (nextValue < range.from) {
      commitRange({ from: nextValue, to: range.from }, true, event);
      return;
    }
    commitRange({ from: range.from, to: nextValue }, true, event);
  };

  const applyPreset = (preset, event) => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - Number(preset.days ?? 1) + 1);
    commitRange({ from: dateIso(start), to: dateIso(end) }, true, event);
  };

  const moveMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };
  const handleTriggerClick = (event) => {
    rest.onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    setOpen(!open, false, event);
  };
  const handleTriggerKeyDown = (event) => {
    rest.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, true, event);
    }
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true, false, event);
    }
  };

  const dayButtons = cells.map((cell, index) => {
    if (!cell) {
      return React.createElement("span", {
        key: `empty-${index}`,
        className: "date-picker__empty",
        role: "gridcell",
        "aria-hidden": "true",
      });
    }
    const isoValue = dateIso(cell);
    const isFrom = isoValue === range.from;
    const isTo = isoValue === range.to;
    const inRange = Boolean(range.from && range.to && isoValue > range.from && isoValue < range.to);
    return React.createElement("button", {
      key: isoValue,
      type: "button",
      className: "date-picker__day date-range-picker__day",
      role: "gridcell",
      "data-date-range-picker-day": isoValue,
      "data-today": isoValue === todayValue ? "true" : undefined,
      "data-range-edge": isFrom ? "start" : isTo ? "end" : undefined,
      "data-in-range": inRange ? "true" : undefined,
      "aria-current": isoValue === todayValue ? "date" : undefined,
      "aria-label": formatDateLongLabel(isoValue, locale),
      "aria-pressed": String(isFrom || isTo),
      onClick: (event) => selectDate(isoValue, event),
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectDate(isoValue, event);
        } else if (event.key === "PageUp" || event.key === "PageDown") {
          event.preventDefault();
          moveMonth(event.key === "PageUp" ? -1 : 1);
        } else if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false, true, event);
        }
      },
    }, String(cell.getDate()));
  });

  const describedBy = helperText ? `${controlId}-helper` : undefined;

  return React.createElement(
    "div",
    {
      className: ["field date-picker date-range-picker", className].filter(Boolean).join(" "),
      ref: rootRef,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      "data-open": String(open),
      "data-from": range.from,
      "data-to": range.to,
    },
    React.createElement("span", { className: "field__label date-picker__label date-range-picker__label", id: `${controlId}-label` }, label),
    React.createElement(
      "button",
      {
        ...flowRestProps(rest),
        ref: (node) => {
          controlRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        },
        type: "button",
        className: "field__control date-picker__control date-range-picker__control",
        id: controlId,
        disabled,
        "data-date-range-picker-trigger": "",
        "aria-haspopup": "dialog",
        "aria-expanded": String(open),
        "aria-controls": panelId,
        "aria-labelledby": `${controlId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": invalid || error || state === "error" ? "true" : undefined,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
      },
      React.createElement("span", { className: "field__icon date-picker__icon date-range-picker__icon", "aria-hidden": "true" }, "date_range"),
      visibleValue ? React.createElement("span", { className: "date-picker__value date-range-picker__value", "data-date-range-picker-value": "" }, visibleValue) : null,
    ),
    React.createElement("input", {
      type: "date",
      className: "date-picker__input date-range-picker__input",
      value: range.from,
      disabled,
      tabIndex: -1,
      "data-date-range-picker-from": "",
      "aria-hidden": "true",
      onChange: (event) => commitRange({ from: event.target.value, to: range.to }, false, event),
    }),
    React.createElement("input", {
      type: "date",
      className: "date-picker__input date-range-picker__input",
      value: range.to,
      disabled,
      tabIndex: -1,
      "data-date-range-picker-to": "",
      "aria-hidden": "true",
      onChange: (event) => commitRange({ from: range.from, to: event.target.value }, false, event),
    }),
    React.createElement(
      "div",
      {
        className: "date-picker__panel date-range-picker__panel",
        id: panelId,
        hidden: !open,
        "data-date-range-picker-panel": "",
        role: "dialog",
        "aria-modal": "false",
        "aria-label": calendarLabel || undefined,
        "aria-labelledby": calendarLabel ? undefined : label ? `${controlId}-label` : undefined,
        onKeyDown: (event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          setOpen(false, true, event);
        },
      },
      showPresets
        ? React.createElement("div", { className: "date-range-picker__presets" }, presetOptions.map((preset) => React.createElement("button", {
          key: preset.key,
          type: "button",
          className: "date-range-picker__preset",
          "data-key": preset.key,
          onClick: (event) => applyPreset(preset, event),
        }, preset.label)))
        : null,
      React.createElement(
        "div",
        { className: "date-picker__header date-range-picker__header" },
        previousMonthLabel ? React.createElement("button", {
          type: "button",
          className: "date-picker__nav",
          "aria-label": previousMonthLabel,
          onClick: () => moveMonth(-1),
        }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_left")) : null,
        React.createElement("strong", { id: monthId, "data-date-range-picker-month": "" }, formatMonthLabel(viewDate, locale)),
        nextMonthLabel ? React.createElement("button", {
          type: "button",
          className: "date-picker__nav",
          "aria-label": nextMonthLabel,
          onClick: () => moveMonth(1),
        }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_right")) : null,
      ),
      React.createElement(
        "div",
        {
          className: "date-picker__grid date-range-picker__grid",
          "data-date-range-picker-grid": "",
          role: "grid",
          "aria-labelledby": monthId,
        },
        sourceWeekdays.map((day, index) => React.createElement("span", { key: `${day}-${index}`, className: "date-picker__weekday", role: "columnheader" }, day)),
        dayButtons,
      ),
    ),
    helperText
      ? React.createElement("span", { className: "field__helper date-picker__helper date-range-picker__helper", id: `${controlId}-helper` }, helperText)
      : null,
  );
});

DateRangePicker.displayName = "DateRangePicker";
DateRangePicker.platformContract = dateRangePickerPlatformContract;
