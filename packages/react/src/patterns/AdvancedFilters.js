/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Chip } from "../Chip.js";
import { DateRangePicker } from "../DateRangePicker.js";
import { Drawer } from "../Drawer.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { Menu } from "../Menu.js";
import { Select } from "../Select.js";
import { Toast } from "../Toast.js";
import { Toolbar } from "./Toolbar.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, invalid, applying, dirty, appliedCount, open, state }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (invalid || state === "invalid")
        return "invalid";
    if (applying || state === "applying")
        return "applying";
    if (dirty || state === "dirty")
        return "dirty";
    if (appliedCount > 0 || state === "applied")
        return "applied";
    if (open || state === "open")
        return "open";
    if (state === "editing")
        return "editing";
    return state ?? "closed";
}
function fieldKey(field, index) {
    return field.key ?? field.name ?? `${field.kind ?? "field"}-${index}`;
}
function renderField(field, index, density, isDisabled) {
    const key = fieldKey(field, index);
    const common = {
        key,
        label: field.label,
        helper: field.helper,
        density: field.density ?? density,
        disabled: isDisabled || field.disabled,
    };
    if (field.kind === "select") {
        return React.createElement(Select, {
            ...common,
            options: field.options ?? [],
            value: field.value,
            open: field.open,
            state: field.state ?? (field.value ? "filled" : "default"),
            onValueChange: field.onValueChange,
            onOpenChange: field.onOpenChange,
        });
    }
    if (field.kind === "date-range") {
        return React.createElement(DateRangePicker, {
            ...common,
            value: field.value,
            from: field.from,
            to: field.to,
            placeholder: field.placeholder,
            error: field.error,
            open: field.open,
            invalid: field.invalid,
            presets: field.presets,
            presetItems: field.presetItems,
            state: field.state ?? (field.error || field.invalid ? "error" : field.value || field.from || field.to ? "selected" : "default"),
            onValueChange: field.onValueChange,
            onOpenChange: field.onOpenChange,
        });
    }
    return React.createElement(Input, {
        ...common,
        value: field.value,
        placeholder: field.placeholder,
        error: field.error,
        variant: field.variant ?? "text",
        icon: field.icon,
        loading: field.loading,
        state: field.state ?? (field.error ? "error" : field.value ? "filled" : "default"),
        onValueChange: field.onValueChange,
    });
}
function isAdvancedFiltersField(field) {
    return Boolean(field?.label);
}
function isAppliedFilter(filter) {
    return Boolean(filter?.label);
}
export const AdvancedFilters = forwardRef(function AdvancedFilters({ label = "Advanced filters", description, density, state, open = false, disabled = false, dirty = false, applying = false, fields = [], appliedFilters = [], validation, applyAction, resetAction, savedViews, drawer, overflow, feedback, toolbar, className = "", ...rest }, ref) {
    const normalizedFields = (Array.isArray(fields) ? fields : []).filter(isAdvancedFiltersField);
    const normalizedApplied = (Array.isArray(appliedFilters) ? appliedFilters : []).filter(isAppliedFilter);
    const invalid = Boolean(validation?.message || normalizedFields.some((field) => "error" in field && (field.error || ("invalid" in field && field.invalid))));
    const resolvedState = resolveState({
        disabled,
        invalid,
        applying,
        dirty,
        appliedCount: normalizedApplied.length,
        open,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "applying";
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "applying" ? "true" : undefined,
        "data-flow-pattern": "advanced-filters",
        "data-state": resolvedState,
        "data-density": density,
        "data-field-count": String(normalizedFields.length),
        "data-applied-count": String(normalizedApplied.length),
        ...sanitizeRestProps(rest),
    }, toolbar
        ? React.createElement(Toolbar, {
            ...toolbar,
            density: toolbar.density ?? density,
        })
        : null, React.createElement(Drawer, {
        label,
        description,
        triggerLabel: drawer?.triggerLabel ?? "Open filters",
        closeLabel: drawer?.closeLabel ?? "Close filters",
        variant: "filter",
        side: drawer?.side ?? "right",
        open,
        state: open ? "open" : "closed",
        density,
        fields: drawer?.fields,
        content: drawer?.content ?? [{ type: "badge", key: "applied", label: `${normalizedApplied.length} applied`, tone: normalizedApplied.length > 0 ? "info" : "neutral", live: true }],
        actions: drawer?.actions,
        onOpenChange: drawer?.onOpenChange,
        onAction: drawer?.onAction,
    }), savedViews?.items?.length
        ? React.createElement(Menu, {
            triggerLabel: savedViews.triggerLabel ?? "Saved filters",
            label: savedViews.label ?? "Saved filter views",
            items: savedViews.items,
            open: savedViews.open,
            variant: savedViews.variant ?? "selection",
            density,
            state: isDisabled ? "disabled" : savedViews.open ? "open" : "closed",
            align: savedViews.align ?? "start",
            disabled: isDisabled || savedViews.disabled,
            onOpenChange: savedViews.onOpenChange,
            onSelect: savedViews.onSelect,
        })
        : null, normalizedFields.map((field, index) => renderField(field, index, density, isDisabled)), normalizedApplied.length > 0
        ? React.createElement(Badge, {
            label: `${normalizedApplied.length} applied`,
            ariaLabel: `${normalizedApplied.length} applied filters`,
            tone: "info",
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            live: true,
        })
        : null, normalizedApplied.map((filter) => React.createElement(Chip, {
        ...filter,
        key: filter.key ?? filter.label,
        label: filter.label,
        variant: filter.variant ?? "filter",
        selected: filter.selected ?? true,
        removable: filter.removable ?? true,
        density: filter.density ?? density,
        disabled: isDisabled || filter.disabled,
        onRemove: filter.onRemove,
        onSelectedChange: filter.onSelectedChange,
    })), validation
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            value: validation.value,
            state: validation.state ?? (invalid ? "error" : "info"),
            density,
            live: true,
        })
        : null, applyAction
        ? React.createElement(Button, {
            ...applyAction,
            label: applyAction.label ?? "Apply filters",
            variant: applyAction.variant ?? "primary",
            density: applyAction.density ?? density,
            disabled: isDisabled || applyAction.disabled,
            loading: applying || applyAction.loading,
        })
        : null, resetAction
        ? React.createElement(Button, {
            ...resetAction,
            label: resetAction.label ?? "Reset filters",
            variant: resetAction.variant ?? "secondary",
            density: resetAction.density ?? density,
            disabled: isDisabled || resetAction.disabled,
        })
        : null, overflow?.items?.length
        ? React.createElement(Menu, {
            triggerLabel: overflow.triggerLabel ?? "More filter actions",
            label: overflow.label ?? "Filter actions",
            items: overflow.items,
            open: overflow.open,
            variant: overflow.variant ?? "actions",
            density,
            state: isDisabled ? "disabled" : overflow.open ? "open" : "closed",
            align: overflow.align ?? "end",
            disabled: isDisabled || overflow.disabled,
            onOpenChange: overflow.onOpenChange,
            onSelect: overflow.onSelect,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null);
});
AdvancedFilters.displayName = "AdvancedFilters";
