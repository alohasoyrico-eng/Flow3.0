import React, { forwardRef, useEffect, useId, useMemo, useRef, useState } from "react";
import { datePickerPlatformContract } from "#flow/platforms";
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

function resolveDatePickerState({ disabled = false, error = "", invalid = false, state, value = "" } = {}) {
  if (disabled) return "disabled";
  if (error || invalid) return "error";
  if (state) return state;
  return value ? "selected" : "default";
}

function clampViewDate(value) {
  return parseDate(value) ?? new Date();
}

export const DatePicker = forwardRef(function DatePicker({
  label,
  value,
  placeholder = "",
  helper = "",
  error = "",
  disabled = false,
  min = "",
  max = "",
  density,
  state,
  invalid = false,
  locale,
  weekdays = [],
  calendarLabel,
  previousMonthLabel = "Previous month",
  nextMonthLabel = "Next month",
  open: openProp,
  onValueChange,
  onOpenChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const controlId = id ?? `date-picker-${generatedId}`;
  const panelId = `${controlId}-panel`;
  const monthId = `${controlId}-month`;
  const rootRef = useRef(null);
  const controlRef = useRef(null);
  const isValueControlled = value !== undefined;
  const [selectedValue, setSelectedValue] = useState(value ?? "");
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [viewDate, setViewDate] = useState(() => clampViewDate(value));
  const resolvedState = resolveDatePickerState({ disabled, error, invalid, state, value: selectedValue });
  const helperText = error || helper;
  const todayValue = useMemo(() => dateIso(new Date()), []);
  const cells = useMemo(() => dateCells(viewDate), [viewDate]);

  useEffect(() => {
    if (!isValueControlled) return;
    setSelectedValue(value ?? "");
    if (value) setViewDate(clampViewDate(value));
  }, [isValueControlled, value]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event) => {
      if (rootRef.current?.contains(event.target)) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  const setOpen = (nextOpen, restoreFocus = false) => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    onOpenChange?.(normalizedOpen);
    if (restoreFocus) requestAnimationFrame(() => controlRef.current?.focus());
  };

  const commitValue = (nextValue) => {
    if (!isValueControlled) setSelectedValue(nextValue);
    setViewDate(clampViewDate(nextValue));
    onValueChange?.(nextValue);
    setOpen(false, true);
  };

  const moveMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
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
    const isDisabled = Boolean((min && isoValue < min) || (max && isoValue > max));
    return React.createElement("button", {
      key: isoValue,
      type: "button",
      className: "date-picker__day",
      role: "gridcell",
      disabled: isDisabled,
      "data-date-picker-day": isoValue,
      "data-today": isoValue === todayValue ? "true" : undefined,
      "aria-current": isoValue === todayValue ? "date" : undefined,
      "aria-label": formatDateLongLabel(isoValue, locale),
      "aria-pressed": String(isoValue === selectedValue),
      onClick: () => {
        if (!isDisabled) commitValue(isoValue);
      },
      onKeyDown: (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!isDisabled) commitValue(isoValue);
        } else if (event.key === "PageUp" || event.key === "PageDown") {
          event.preventDefault();
          moveMonth(event.key === "PageUp" ? -1 : 1);
        } else if (event.key === "Escape") {
          event.preventDefault();
          setOpen(false, true);
        }
      },
    }, String(cell.getDate()));
  });

  const describedBy = helperText ? `${controlId}-helper` : undefined;

  return React.createElement(
    "div",
    {
      className: ["field date-picker", className].filter(Boolean).join(" "),
      ref: rootRef,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      "data-open": String(open),
    },
    label ? React.createElement("span", { className: "field__label date-picker__label", id: `${controlId}-label` }, label) : null,
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
        className: "field__control date-picker__control",
        id: controlId,
        disabled,
        "data-date-picker-trigger": "",
        "aria-haspopup": "dialog",
        "aria-expanded": String(open),
        "aria-controls": panelId,
        "aria-labelledby": label ? `${controlId}-label` : undefined,
        "aria-label": label ? undefined : rest["aria-label"],
        "aria-describedby": describedBy,
        "aria-invalid": invalid || error || state === "error" ? "true" : undefined,
        onClick: () => {
          if (!disabled) setOpen(!open);
        },
        onKeyDown: (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, true);
          }
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        },
      },
      React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "calendar_month"),
      React.createElement("span", { className: "date-picker__value", "data-date-picker-value": "" }, formatDateLabel(selectedValue, locale) || placeholder),
    ),
    React.createElement("input", {
      type: "date",
      className: "date-picker__input",
      value: selectedValue,
      disabled,
      min,
      max,
      tabIndex: -1,
      "data-date-picker-input": "",
      "aria-hidden": "true",
      onChange: (event) => {
        if (event.target.value) commitValue(event.target.value);
      },
    }),
    React.createElement(
      "div",
      {
        className: "date-picker__panel",
        id: panelId,
        hidden: !open,
        "data-date-picker-panel": "",
        role: "dialog",
        "aria-modal": "false",
        "aria-label": calendarLabel || undefined,
        "aria-labelledby": calendarLabel ? undefined : label ? `${controlId}-label` : undefined,
        onKeyDown: (event) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          setOpen(false, true);
        },
      },
      React.createElement(
        "div",
        { className: "date-picker__header" },
        React.createElement("button", {
          type: "button",
          className: "date-picker__nav",
          "aria-label": previousMonthLabel,
          onClick: () => moveMonth(-1),
        }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_left")),
        React.createElement("strong", { id: monthId, "data-date-picker-month": "" }, formatMonthLabel(viewDate, locale)),
        React.createElement("button", {
          type: "button",
          className: "date-picker__nav",
          "aria-label": nextMonthLabel,
          onClick: () => moveMonth(1),
        }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_right")),
      ),
      React.createElement(
        "div",
        {
          className: "date-picker__grid",
          "data-date-picker-grid": "",
          role: "grid",
          "aria-labelledby": monthId,
        },
        weekdays.map((day, index) => React.createElement("span", { key: `${day}-${index}`, className: "date-picker__weekday", role: "columnheader" }, day)),
        dayButtons,
      ),
    ),
    helperText
      ? React.createElement("span", { className: "field__helper date-picker__helper", id: `${controlId}-helper` }, helperText)
      : null,
  );
});

DatePicker.displayName = "DatePicker";
DatePicker.platformContract = datePickerPlatformContract;
