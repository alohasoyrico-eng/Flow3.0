import React, {
  type ButtonHTMLAttributes,
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type KeyboardEvent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { datePickerPlatformContract } from "@design-system/components/platforms";
import {
  type FlowDataAttributes,
  flowStateProps,
  flowDensityProps,
  flowRestProps,
  flowDataProps,
  normalizeFlowDensity,
} from "./internal/props.js";

export type DatePickerDensity = "sm" | "md" | "lg";
export type DatePickerState = "default" | "hover" | "focus" | "selected" | "warning" | "error" | "disabled";
export type DatePickerLocale = string | string[] | undefined;
export type DatePickerValueChangeEvent =
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLButtonElement>
  | ChangeEvent<HTMLInputElement>;
export type DatePickerOpenChangeEvent = DatePickerValueChangeEvent | KeyboardEvent<HTMLDivElement> | globalThis.MouseEvent;

export interface DatePickerProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  min?: string;
  max?: string;
  density?: DatePickerDensity;
  state?: DatePickerState;
  invalid?: boolean;
  locale?: string | string[];
  weekdays?: string[];
  calendarLabel?: string;
  previousMonthLabel?: string;
  nextMonthLabel?: string;
  open?: boolean;
  onValueChange?: (value: string, event: DatePickerValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: DatePickerOpenChangeEvent) => void;
}

export interface DatePickerComponent extends ForwardRefExoticComponent<DatePickerProps & RefAttributes<HTMLButtonElement>> {
  displayName: "DatePicker";
  platformContract: typeof datePickerPlatformContract;
}

function parseDate(value: string | undefined): Date | null {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function dateIso(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

function formatDateLabel(value: string | undefined, locale: DatePickerLocale): string {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" })
    .format(date)
    .replace(".", "");
}

function formatDateLongLabel(value: string | undefined, locale: DatePickerLocale): string {
  const date = parseDate(value);
  if (!date) return "";
  return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}

function formatMonthLabel(date: Date, locale: DatePickerLocale): string {
  const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dateCells(viewDate: Date): Array<Date | null> {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const first = new Date(year, month, 1);
  const offset = (first.getDay() + 6) % 7;
  const days = new Date(year, month + 1, 0).getDate();
  const cells: Array<Date | null> = Array.from({ length: offset }, () => null);
  for (let day = 1; day <= days; day += 1) cells.push(new Date(year, month, day));
  while (cells.length % 7) cells.push(null);
  return cells;
}

function resolveDatePickerState({
  disabled = false,
  error = "",
  invalid = false,
  state,
  value = "",
}: {
  disabled?: boolean;
  error?: string;
  invalid?: boolean;
  state?: DatePickerState | undefined;
  value?: string;
} = {}): DatePickerState {
  if (disabled) return "disabled";
  if (error || invalid) return "error";
  if (state) return state;
  return value ? "selected" : "default";
}

function clampViewDate(value: string | undefined): Date {
  return parseDate(value) ?? new Date();
}

export const DatePicker = forwardRef<HTMLButtonElement, DatePickerProps>(function DatePicker({
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
  weekdays,
  calendarLabel,
  previousMonthLabel,
  nextMonthLabel,
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
  const rootRef = useRef<HTMLDivElement | null>(null);
  const controlRef = useRef<HTMLButtonElement | null>(null);
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const selectedValue = isValueControlled ? value ?? "" : internalValue;
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(false);
  const open = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [viewDate, setViewDate] = useState(() => clampViewDate(value));
  const resolvedState = resolveDatePickerState({ disabled, error, invalid, state, value: selectedValue });
  const helperText = error || helper;
  const todayValue = useMemo(() => dateIso(new Date()), []);
  const cells = useMemo(() => dateCells(viewDate), [viewDate]);
  const sourceWeekdays = Array.isArray(weekdays) ? weekdays : [];
  const visibleValue = formatDateLabel(selectedValue, locale) || placeholder;

  useEffect(() => {
    if (isValueControlled && value) setViewDate(clampViewDate(value));
  }, [isValueControlled, value]);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (event: globalThis.MouseEvent) => {
      if (event.target instanceof Node && rootRef.current?.contains(event.target)) return;
      setOpen(false, false, event);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  const setOpen = (nextOpen: boolean, restoreFocus = false, event?: DatePickerOpenChangeEvent): void => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    onOpenChange?.(normalizedOpen, event);
    if (restoreFocus) requestAnimationFrame(() => controlRef.current?.focus());
  };

  const commitValue = (nextValue: string, event: DatePickerValueChangeEvent): void => {
    if (!isValueControlled) setInternalValue(nextValue);
    setViewDate(clampViewDate(nextValue));
    onValueChange?.(nextValue, event);
    setOpen(false, true, event);
  };

  const moveMonth = (delta: number): void => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };
  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>): void => {
    rest.onClick?.(event);
    if (event.defaultPrevented || disabled) return;
    setOpen(!open, false, event);
  };
  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
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
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        if (!isDisabled) commitValue(isoValue, event);
      },
      onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!isDisabled) commitValue(isoValue, event);
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
      className: ["field date-picker", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ref: rootRef,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-open": String(open),
    },
    React.createElement("span", { className: "field__label date-picker__label", id: `${controlId}-label` }, label),
    React.createElement(
      "button",
      {
        ...flowRestProps(rest),
        ref: (node: HTMLButtonElement | null): void => {
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
        "aria-labelledby": `${controlId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": invalid || error || state === "error" ? "true" : undefined,
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
      },
      React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "calendar_month"),
      visibleValue ? React.createElement("span", { className: "date-picker__value", "data-date-picker-value": "" }, visibleValue) : null,
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
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value) commitValue(event.target.value, event);
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
        onKeyDown: (event: KeyboardEvent<HTMLDivElement>) => {
          if (event.key !== "Escape") return;
          event.preventDefault();
          setOpen(false, true, event);
        },
      },
      React.createElement(
        "div",
        { className: "date-picker__header" },
        previousMonthLabel ? React.createElement("button", {
          type: "button",
          className: "date-picker__nav",
          "aria-label": previousMonthLabel,
          onClick: () => moveMonth(-1),
        }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_left")) : null,
        React.createElement("strong", { id: monthId, "data-date-picker-month": "" }, formatMonthLabel(viewDate, locale)),
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
          className: "date-picker__grid",
          "data-date-picker-grid": "",
          role: "grid",
          "aria-labelledby": monthId,
        },
        sourceWeekdays.map((day, index) => React.createElement("span", { key: `${day}-${index}`, className: "date-picker__weekday", role: "columnheader" }, day)),
        dayButtons,
      ),
    ),
    helperText
      ? React.createElement("span", { className: "field__helper date-picker__helper", id: `${controlId}-helper` }, helperText)
      : null,
  );
}) as DatePickerComponent;

DatePicker.displayName = "DatePicker";
DatePicker.platformContract = datePickerPlatformContract;
