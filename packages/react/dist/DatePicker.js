import React, { forwardRef, useEffect, useId, useMemo, useRef, useState, } from "react";
import { datePickerPlatformContract } from "#flow/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity, } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";
function parseDate(value) {
    if (!value)
        return null;
    const date = new Date(`${value}T00:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
}
function dateIso(date) {
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${date.getFullYear()}-${month}-${day}`;
}
function addDays(date, days) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}
function addMonthsClamped(date, months) {
    const target = new Date(date.getFullYear(), date.getMonth() + months + 1, 0);
    return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), target.getDate()));
}
function formatDateLabel(value, locale) {
    const date = parseDate(value);
    if (!date)
        return "";
    return new Intl.DateTimeFormat(locale, { day: "2-digit", month: "short", year: "numeric" })
        .format(date)
        .replace(".", "");
}
function formatRangeLabel({ from, to, placeholder, locale }) {
    if (!from)
        return placeholder;
    return `${formatDateLabel(from, locale)} - ${to ? formatDateLabel(to, locale) : "..."}`;
}
function formatDateLongLabel(value, locale) {
    const date = parseDate(value);
    if (!date)
        return "";
    return new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(date);
}
function formatMonthLabel(date, locale) {
    const label = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(date);
    return label.charAt(0).toUpperCase() + label.slice(1);
}
function formatMonthName(month, locale) {
    const label = new Intl.DateTimeFormat(locale, { month: "long" }).format(new Date(2026, month, 1));
    return label.charAt(0).toUpperCase() + label.slice(1);
}
function dateCells(viewDate) {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const first = new Date(year, month, 1);
    const offset = (first.getDay() + 6) % 7;
    const days = new Date(year, month + 1, 0).getDate();
    const cells = Array.from({ length: offset }, () => null);
    for (let day = 1; day <= days; day += 1)
        cells.push(new Date(year, month, day));
    while (cells.length % 7)
        cells.push(null);
    return cells;
}
function resolveDatePickerState({ disabled = false, error = "", invalid = false, state, value = "", } = {}) {
    if (disabled)
        return "disabled";
    if (error || invalid)
        return "error";
    if (state)
        return state;
    return value ? "selected" : "default";
}
function clampViewDate(value) {
    return parseDate(value) ?? new Date();
}
export const DatePicker = forwardRef(function DatePicker({ label, mode = "single", value, from, to, placeholder = "", helper = "", error = "", disabled = false, min = "", max = "", density, state, invalid = false, locale, weekdays, calendarLabel, monthSelectLabel, yearSelectLabel, previousYearLabel, previousMonthLabel, nextMonthLabel, nextYearLabel, presets, presetItems, open: openProp, onValueChange, onOpenChange, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const controlId = id ?? `date-picker-${generatedId}`;
    const panelId = `${controlId}-panel`;
    const monthId = `${controlId}-month`;
    const rootRef = useRef(null);
    const controlRef = useRef(null);
    const panelRef = useRef(null);
    const dayButtonRefs = useRef(new Map());
    const isRange = mode === "range";
    const propRange = typeof value === "object" && value !== null ? value : undefined;
    const propSingleValue = typeof value === "string" ? value : "";
    const isValueControlled = value !== undefined || from !== undefined || to !== undefined;
    const initialSingleValue = propSingleValue;
    const initialRange = { from: from ?? propRange?.from ?? "", to: to ?? propRange?.to ?? "" };
    const [internalValue, setInternalValue] = useState(initialSingleValue);
    const [internalRange, setInternalRange] = useState(initialRange);
    const selectedValue = isRange ? "" : isValueControlled ? propSingleValue : internalValue;
    const selectedRange = isRange
        ? isValueControlled
            ? { from: from ?? propRange?.from ?? "", to: to ?? propRange?.to ?? "" }
            : internalRange
        : { from: "", to: "" };
    const isOpenControlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(false);
    const open = isOpenControlled ? Boolean(openProp) : internalOpen;
    const initialViewValue = isRange ? initialRange.from || initialRange.to : initialSingleValue;
    const [viewDate, setViewDate] = useState(() => clampViewDate(initialViewValue));
    const [focusedDateValue, setFocusedDateValue] = useState("");
    const [openSelector, setOpenSelector] = useState(null);
    const [activeMonth, setActiveMonth] = useState(() => clampViewDate(initialViewValue).getMonth());
    const [activeYear, setActiveYear] = useState(() => clampViewDate(initialViewValue).getFullYear());
    const resolvedState = resolveDatePickerState({ disabled, error, invalid, state, value: isRange ? selectedRange.from || selectedRange.to : selectedValue });
    const fieldMessage = resolveFieldMessage({
        controlId,
        describedBy: rest["aria-describedby"],
        error: error || (invalid ? helper : ""),
        helper,
        state: resolvedState === "error" ? "error" : resolvedState === "warning" ? "warning" : resolvedState === "disabled" ? "disabled" : "default",
    });
    const todayValue = useMemo(() => dateIso(new Date()), []);
    const cells = useMemo(() => dateCells(viewDate), [viewDate]);
    const enabledDateValues = cells
        .filter((cell) => Boolean(cell))
        .map((cell) => dateIso(cell))
        .filter((isoValue) => !((min && isoValue < min) || (max && isoValue > max)));
    const preferredDateValue = isRange ? selectedRange.to || selectedRange.from : selectedValue;
    const activeDateValue = focusedDateValue && enabledDateValues.includes(focusedDateValue)
        ? focusedDateValue
        : enabledDateValues.includes(preferredDateValue)
            ? preferredDateValue
            : enabledDateValues.includes(todayValue)
                ? todayValue
                : enabledDateValues[0] ?? "";
    const sourceWeekdays = Array.isArray(weekdays) ? weekdays : [];
    const visibleValue = isRange
        ? formatRangeLabel({ ...selectedRange, placeholder: placeholder || "Select date range", locale })
        : formatDateLabel(selectedValue, locale) || placeholder;
    const presetOptions = Array.isArray(presetItems)
        ? presetItems.filter((preset) => preset?.key !== undefined && preset.key !== null && preset.key !== "" && preset?.label && Number.isFinite(Number(preset.days)))
        : [];
    const showPresets = isRange && (presets ?? presetOptions.length > 0);
    const hasRangeClassName = className.split(/\s+/).includes("date-range-picker");
    const minDate = parseDate(min);
    const maxDate = parseDate(max);
    const monthOptions = Array.from({ length: 12 }, (_, month) => ({
        label: formatMonthName(month, locale),
        value: month,
        disabled: Boolean((minDate && viewDate.getFullYear() === minDate.getFullYear() && month < minDate.getMonth())
            || (maxDate && viewDate.getFullYear() === maxDate.getFullYear() && month > maxDate.getMonth())),
    }));
    const yearStart = minDate ? minDate.getFullYear() : viewDate.getFullYear() - 10;
    const yearEnd = maxDate ? maxDate.getFullYear() : viewDate.getFullYear() + 10;
    const yearOptions = Array.from({ length: Math.max(1, yearEnd - yearStart + 1) }, (_, index) => yearStart + index);
    const currentMonthOption = monthOptions[viewDate.getMonth()] ?? monthOptions[0];
    const activeYearIndex = Math.max(yearOptions.indexOf(activeYear), 0);
    useEffect(() => {
        const nextViewValue = isRange ? selectedRange.from || selectedRange.to : selectedValue;
        if (isValueControlled && nextViewValue)
            setViewDate(clampViewDate(nextViewValue));
    }, [isRange, isValueControlled, selectedRange.from, selectedRange.to, selectedValue]);
    useEffect(() => {
        if (!open)
            return undefined;
        const onPointerDown = (event) => {
            if (event.target instanceof Node && rootRef.current?.contains(event.target))
                return;
            setOpen(false, false, event);
        };
        document.addEventListener("mousedown", onPointerDown);
        return () => document.removeEventListener("mousedown", onPointerDown);
    }, [open]);
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    const focusActiveDate = () => {
        if (!activeDateValue)
            return;
        requestAnimationFrame(() => {
            dayButtonRefs.current.get(activeDateValue)?.focus();
        });
    };
    const setOpen = (nextOpen, restoreFocus = false, event, focusActive = false) => {
        const normalizedOpen = Boolean(nextOpen);
        if (!isOpenControlled)
            setInternalOpen(normalizedOpen);
        if (!normalizedOpen)
            setOpenSelector(null);
        onOpenChange?.(normalizedOpen, event);
        if (restoreFocus)
            requestAnimationFrame(() => controlRef.current?.focus());
        if (normalizedOpen && focusActive) {
            setFocusedDateValue(activeDateValue);
            focusActiveDate();
        }
    };
    const keepTabInsidePanel = (event) => {
        const panel = panelRef.current;
        if (!panel)
            return;
        const tabbables = [
            ...panel.querySelectorAll(".date-picker__nav:not(:disabled), .date-picker__selector-trigger:not(:disabled), [data-date-picker-day][tabindex='0']:not(:disabled)"),
        ].filter((element) => !element.hasAttribute("hidden") && element.tabIndex >= 0);
        if (!tabbables.length)
            return;
        const currentIndex = tabbables.indexOf(event.target);
        if (currentIndex < 0)
            return;
        event.preventDefault();
        const direction = event.shiftKey ? -1 : 1;
        tabbables[(currentIndex + direction + tabbables.length) % tabbables.length]?.focus();
    };
    const focusDateValue = (nextValue) => {
        const nextDate = parseDate(nextValue);
        if (!nextDate)
            return;
        setFocusedDateValue(nextValue);
        setViewDate(nextDate);
        dayButtonRefs.current.get(nextValue)?.focus();
        requestAnimationFrame(() => {
            dayButtonRefs.current.get(nextValue)?.focus();
        });
    };
    const closestEnabledValue = (startDate, direction) => {
        let candidate = startDate;
        for (let attempt = 0; attempt < 370; attempt += 1) {
            const nextValue = dateIso(candidate);
            if (!((min && nextValue < min) || (max && nextValue > max)))
                return nextValue;
            candidate = addDays(candidate, direction);
        }
        return activeDateValue;
    };
    const moveDateFocus = (event, delta) => {
        const active = event.target;
        const currentValue = active.getAttribute("data-date-picker-day") ?? "";
        const currentDate = parseDate(currentValue);
        if (!currentDate)
            return;
        event.preventDefault();
        focusDateValue(closestEnabledValue(addDays(currentDate, delta), Math.sign(delta) || 1));
    };
    const moveDateFocusToMonthEdge = (event, edge) => {
        const current = parseDate(event.target.getAttribute("data-date-picker-day") ?? "") ?? viewDate;
        const target = edge === "start"
            ? new Date(current.getFullYear(), current.getMonth(), 1)
            : new Date(current.getFullYear(), current.getMonth() + 1, 0);
        event.preventDefault();
        focusDateValue(closestEnabledValue(target, edge === "start" ? 1 : -1));
    };
    const moveDateFocusByMonth = (event, delta) => {
        const current = parseDate(event.target.getAttribute("data-date-picker-day") ?? "") ?? viewDate;
        event.preventDefault();
        focusDateValue(closestEnabledValue(addMonthsClamped(current, delta), delta > 0 ? 1 : -1));
    };
    const emitValue = (nextValue, event) => {
        onValueChange?.(nextValue, event);
    };
    const commitValue = (nextValue, event) => {
        if (!isValueControlled)
            setInternalValue(nextValue);
        setViewDate(clampViewDate(nextValue));
        emitValue(nextValue, event);
        setOpen(false, true, event);
    };
    const commitRange = (nextRange, close, event) => {
        if (!isValueControlled)
            setInternalRange(nextRange);
        if (nextRange.from || nextRange.to)
            setViewDate(clampViewDate(nextRange.from || nextRange.to));
        emitValue(nextRange, event);
        if (close)
            setOpen(false, true, event);
    };
    const selectDate = (nextValue, event) => {
        if (!isRange) {
            commitValue(nextValue, event);
            return;
        }
        if (!selectedRange.from || selectedRange.to) {
            commitRange({ from: nextValue, to: "" }, false, event);
            return;
        }
        if (nextValue < selectedRange.from) {
            commitRange({ from: nextValue, to: selectedRange.from }, true, event);
            return;
        }
        commitRange({ from: selectedRange.from, to: nextValue }, true, event);
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
    const moveToMonth = (month) => {
        const current = parseDate(focusedDateValue) ?? parseDate(preferredDateValue) ?? viewDate;
        const target = addMonthsClamped(new Date(current.getFullYear(), current.getMonth(), current.getDate()), month - current.getMonth());
        const nextValue = closestEnabledValue(target, 1);
        setFocusedDateValue(nextValue);
        setViewDate(new Date(target.getFullYear(), target.getMonth(), 1));
        setOpenSelector(null);
    };
    const moveToYear = (year) => {
        const current = parseDate(focusedDateValue) ?? parseDate(preferredDateValue) ?? viewDate;
        const minMonth = minDate && year === minDate.getFullYear() ? minDate.getMonth() : 0;
        const maxMonth = maxDate && year === maxDate.getFullYear() ? maxDate.getMonth() : 11;
        const month = Math.min(Math.max(current.getMonth(), minMonth), maxMonth);
        const target = new Date(year, month, Math.min(current.getDate(), new Date(year, month + 1, 0).getDate()));
        const nextValue = closestEnabledValue(target, 1);
        setFocusedDateValue(nextValue);
        setViewDate(new Date(year, month, 1));
        setOpenSelector(null);
    };
    const openMonthSelector = () => {
        setActiveMonth(viewDate.getMonth());
        setOpenSelector("month");
    };
    const openYearSelector = () => {
        setActiveYear(viewDate.getFullYear());
        setOpenSelector("year");
    };
    const moveActiveMonth = (direction) => {
        setActiveMonth((current) => {
            const enabled = monthOptions.filter((option) => !option.disabled).map((option) => option.value);
            const index = Math.max(enabled.indexOf(current), 0);
            return enabled[(index + direction + enabled.length) % enabled.length] ?? current;
        });
    };
    const moveActiveYear = (direction) => {
        setActiveYear((current) => yearOptions[Math.max(0, Math.min(yearOptions.length - 1, yearOptions.indexOf(current) + direction))] ?? current);
    };
    const handleMonthSelectorKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            setOpenSelector(null);
        }
        else if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            if (openSelector !== "month")
                openMonthSelector();
            else
                moveActiveMonth(event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1);
        }
        else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (openSelector === "month")
                moveToMonth(activeMonth);
            else
                openMonthSelector();
        }
    };
    const handleYearSelectorKeyDown = (event) => {
        if (event.key === "Escape") {
            event.preventDefault();
            setOpenSelector(null);
        }
        else if (event.key === "ArrowDown" || event.key === "ArrowRight" || event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault();
            if (openSelector !== "year")
                openYearSelector();
            else
                moveActiveYear(event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : -1);
        }
        else if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            if (openSelector === "year")
                moveToYear(activeYear);
            else
                openYearSelector();
        }
    };
    const handleTriggerClick = (event) => {
        rest.onClick?.(event);
        if (event.defaultPrevented || disabled)
            return;
        setOpen(!open, false, event, !open);
    };
    const handleTriggerKeyDown = (event) => {
        rest.onKeyDown?.(event);
        if (event.defaultPrevented)
            return;
        if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false, true, event);
        }
        if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true, false, event, true);
        }
    };
    const dayCells = cells.map((cell, index) => {
        if (!cell) {
            return React.createElement("span", {
                key: `empty-${index}`,
                className: "date-picker__cell date-picker__empty",
                role: "gridcell",
                "aria-hidden": "true",
            });
        }
        const isoValue = dateIso(cell);
        const isDisabled = Boolean((min && isoValue < min) || (max && isoValue > max));
        const isRangeStart = isRange && isoValue === selectedRange.from;
        const isRangeEnd = isRange && isoValue === selectedRange.to;
        const isInRange = Boolean(isRange && selectedRange.from && selectedRange.to && isoValue > selectedRange.from && isoValue < selectedRange.to);
        const isSelected = isRange ? isRangeStart || isRangeEnd : isoValue === selectedValue;
        return React.createElement("span", { key: isoValue, className: "date-picker__cell", role: "gridcell" }, React.createElement("button", {
            type: "button",
            className: ["date-picker__day", isRange ? "date-range-picker__day" : ""].filter(Boolean).join(" "),
            ref: (node) => {
                if (node)
                    dayButtonRefs.current.set(isoValue, node);
                else
                    dayButtonRefs.current.delete(isoValue);
            },
            disabled: isDisabled,
            "data-date-picker-day": isoValue,
            "data-date-range-picker-day": isRange ? isoValue : undefined,
            "data-today": isoValue === todayValue ? "true" : undefined,
            "data-range-edge": isRangeStart ? "start" : isRangeEnd ? "end" : undefined,
            "data-in-range": isInRange ? "true" : undefined,
            "aria-current": isoValue === todayValue ? "date" : undefined,
            "aria-label": formatDateLongLabel(isoValue, locale),
            "aria-pressed": String(isSelected),
            tabIndex: isoValue === activeDateValue ? 0 : -1,
            onClick: (event) => {
                if (!isDisabled)
                    selectDate(isoValue, event);
            },
            onKeyDown: (event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    if (!isDisabled)
                        selectDate(isoValue, event);
                }
                else if (event.key === "PageUp" || event.key === "PageDown") {
                    moveDateFocusByMonth(event, (event.key === "PageUp" ? -1 : 1) * (event.shiftKey ? 12 : 1));
                }
                else if (event.key === "Escape") {
                    event.preventDefault();
                    setOpen(false, true, event);
                }
            },
        }, String(cell.getDate())));
    });
    const dayRows = Array.from({ length: Math.ceil(dayCells.length / 7) }, (_, rowIndex) => React.createElement("div", { key: `row-${rowIndex}`, className: "date-picker__row", role: "row" }, dayCells.slice(rowIndex * 7, rowIndex * 7 + 7)));
    return React.createElement("div", {
        className: ["field date-picker", isRange && !hasRangeClassName ? "date-range-picker" : "", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ref: rootRef,
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-open": String(open),
        "data-mode": mode,
        "data-from": isRange ? selectedRange.from : undefined,
        "data-to": isRange ? selectedRange.to : undefined,
    }, React.createElement("span", { className: ["field__label date-picker__label", isRange ? "date-range-picker__label" : ""].filter(Boolean).join(" "), id: `${controlId}-label` }, label), React.createElement("button", {
        ...flowRestProps(rest),
        ref: (node) => {
            controlRef.current = node;
            if (typeof ref === "function")
                ref(node);
            else if (ref)
                ref.current = node;
        },
        type: "button",
        className: ["field__control date-picker__control", isRange ? "date-range-picker__control" : ""].filter(Boolean).join(" "),
        id: controlId,
        disabled,
        "data-date-picker-trigger": "",
        "data-date-range-picker-trigger": isRange ? "" : undefined,
        "aria-haspopup": "dialog",
        "aria-expanded": String(open),
        "aria-controls": panelId,
        "aria-labelledby": `${controlId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        onClick: handleTriggerClick,
        onKeyDown: handleTriggerKeyDown,
    }, React.createElement("span", { className: ["field__icon date-picker__icon", isRange ? "date-range-picker__icon" : ""].filter(Boolean).join(" "), "aria-hidden": "true" }, isRange ? "date_range" : "calendar_month"), visibleValue ? React.createElement("span", {
        className: ["date-picker__value", isRange ? "date-range-picker__value" : ""].filter(Boolean).join(" "),
        "data-date-picker-value": "",
        "data-date-range-picker-value": isRange ? "" : undefined,
    }, visibleValue) : null), isRange ? React.createElement(React.Fragment, null, React.createElement("input", {
        type: "date",
        className: "date-picker__input date-range-picker__input",
        value: selectedRange.from,
        disabled,
        min,
        max,
        tabIndex: -1,
        "data-date-range-picker-from": "",
        "aria-hidden": "true",
        onChange: (event) => commitRange({ from: event.target.value, to: selectedRange.to }, false, event),
    }), React.createElement("input", {
        type: "date",
        className: "date-picker__input date-range-picker__input",
        value: selectedRange.to,
        disabled,
        min,
        max,
        tabIndex: -1,
        "data-date-range-picker-to": "",
        "aria-hidden": "true",
        onChange: (event) => commitRange({ from: selectedRange.from, to: event.target.value }, false, event),
    })) : React.createElement("input", {
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
            if (event.target.value)
                commitValue(event.target.value, event);
        },
    }), React.createElement("div", {
        className: ["date-picker__panel", isRange ? "date-range-picker__panel" : ""].filter(Boolean).join(" "),
        ref: panelRef,
        id: panelId,
        hidden: !open,
        "data-date-picker-panel": "",
        "data-date-range-picker-panel": isRange ? "" : undefined,
        role: "dialog",
        "aria-modal": "false",
        "aria-label": calendarLabel || undefined,
        "aria-labelledby": calendarLabel ? undefined : label ? `${controlId}-label` : undefined,
        onKeyDown: (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                setOpen(false, true, event);
            }
            else if (event.key === "Tab") {
                keepTabInsidePanel(event);
            }
            else if (event.key === "ArrowRight") {
                moveDateFocus(event, 1);
            }
            else if (event.key === "ArrowLeft") {
                moveDateFocus(event, -1);
            }
            else if (event.key === "ArrowDown") {
                moveDateFocus(event, 7);
            }
            else if (event.key === "ArrowUp") {
                moveDateFocus(event, -7);
            }
            else if (event.key === "Home") {
                moveDateFocusToMonthEdge(event, "start");
            }
            else if (event.key === "End") {
                moveDateFocusToMonthEdge(event, "end");
            }
        },
    }, showPresets
        ? React.createElement("div", { className: "date-range-picker__presets" }, presetOptions.map((preset) => React.createElement("button", {
            key: preset.key,
            type: "button",
            className: "date-range-picker__preset",
            "data-key": preset.key,
            onClick: (event) => applyPreset(preset, event),
        }, preset.label)))
        : null, React.createElement("div", { className: ["date-picker__header", isRange ? "date-range-picker__header" : ""].filter(Boolean).join(" ") }, React.createElement("div", { className: "date-picker__nav-group date-picker__nav-group--start" }, previousYearLabel ? React.createElement("button", {
        type: "button",
        className: "date-picker__nav",
        "aria-label": previousYearLabel,
        onClick: () => moveMonth(-12),
    }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "keyboard_double_arrow_left")) : null, previousMonthLabel ? React.createElement("button", {
        type: "button",
        className: "date-picker__nav",
        "aria-label": previousMonthLabel,
        onClick: () => moveMonth(-1),
    }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_left")) : null), React.createElement("div", { className: "date-picker__selector-group" }, React.createElement("strong", {
        className: "date-picker__month-label",
        id: monthId,
        "data-date-picker-month": "",
        "data-date-range-picker-month": isRange ? "" : undefined,
    }, formatMonthLabel(viewDate, locale)), React.createElement("span", { className: "date-picker__selector date-picker__selector--month" }, React.createElement("button", {
        type: "button",
        className: "date-picker__selector-trigger",
        "aria-label": monthSelectLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": openSelector === "month",
        "aria-controls": `${controlId}-month-listbox`,
        "aria-activedescendant": openSelector === "month" ? `${controlId}-month-option-${activeMonth}` : undefined,
        onClick: () => (openSelector === "month" ? setOpenSelector(null) : openMonthSelector()),
        onKeyDown: handleMonthSelectorKeyDown,
    }, React.createElement("span", { className: "date-picker__selector-value" }, currentMonthOption?.label ?? ""), React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, openSelector === "month" ? "expand_less" : "expand_more"))), React.createElement("span", { className: "date-picker__selector date-picker__selector--year" }, React.createElement("button", {
        type: "button",
        className: "date-picker__selector-trigger",
        "aria-label": yearSelectLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": openSelector === "year",
        "aria-controls": `${controlId}-year-listbox`,
        "aria-activedescendant": openSelector === "year" ? `${controlId}-year-option-${yearOptions[activeYearIndex]}` : undefined,
        onClick: () => (openSelector === "year" ? setOpenSelector(null) : openYearSelector()),
        onKeyDown: handleYearSelectorKeyDown,
    }, React.createElement("span", { className: "date-picker__selector-value" }, viewDate.getFullYear()), React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, openSelector === "year" ? "expand_less" : "expand_more")))), React.createElement("div", { className: "date-picker__nav-group date-picker__nav-group--end" }, nextMonthLabel ? React.createElement("button", {
        type: "button",
        className: "date-picker__nav",
        "aria-label": nextMonthLabel,
        onClick: () => moveMonth(1),
    }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "chevron_right")) : null, nextYearLabel ? React.createElement("button", {
        type: "button",
        className: "date-picker__nav",
        "aria-label": nextYearLabel,
        onClick: () => moveMonth(12),
    }, React.createElement("span", { className: "field__icon date-picker__icon", "aria-hidden": "true" }, "keyboard_double_arrow_right")) : null)), openSelector === "month" ? React.createElement("div", { className: "date-picker__selector-panel date-picker__selector-panel--month" }, React.createElement("span", { className: "date-picker__selector-listbox", id: `${controlId}-month-listbox`, role: "listbox", "aria-label": monthSelectLabel }, monthOptions.map((option) => React.createElement("button", {
        key: option.value,
        type: "button",
        id: `${controlId}-month-option-${option.value}`,
        className: "date-picker__selector-option",
        role: "option",
        disabled: option.disabled,
        "aria-selected": option.value === viewDate.getMonth(),
        "data-active": option.value === activeMonth ? "true" : undefined,
        onClick: () => moveToMonth(option.value),
    }, option.label)))) : null, openSelector === "year" ? React.createElement("div", { className: "date-picker__selector-panel date-picker__selector-panel--year" }, React.createElement("span", { className: "date-picker__selector-listbox", id: `${controlId}-year-listbox`, role: "listbox", "aria-label": yearSelectLabel }, yearOptions.map((year) => React.createElement("button", {
        key: year,
        type: "button",
        id: `${controlId}-year-option-${year}`,
        className: "date-picker__selector-option",
        role: "option",
        "aria-selected": year === viewDate.getFullYear(),
        "data-active": year === activeYear ? "true" : undefined,
        onClick: () => moveToYear(year),
    }, year)))) : null, openSelector === null ? React.createElement("div", {
        className: ["date-picker__grid", isRange ? "date-range-picker__grid" : ""].filter(Boolean).join(" "),
        "data-date-picker-grid": "",
        "data-date-range-picker-grid": isRange ? "" : undefined,
        role: "grid",
        "aria-labelledby": monthId,
    }, sourceWeekdays.length ? React.createElement("div", { className: "date-picker__row date-picker__row--weekdays", role: "row" }, sourceWeekdays.map((day, index) => React.createElement("span", { key: `${day}-${index}`, className: "date-picker__weekday", role: "columnheader" }, day))) : null, dayRows) : null), fieldMessage.message
        ? React.createElement("span", { className: ["field__helper date-picker__helper", isRange ? "date-range-picker__helper" : ""].filter(Boolean).join(" "), id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message)
        : null);
});
DatePicker.displayName = "DatePicker";
DatePicker.platformContract = datePickerPlatformContract;
