/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useMemo, } from "react";
import { Combobox } from "../Combobox.js";
import { EmptyState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { List } from "../List.js";
import { Skeleton } from "../Skeleton.js";
const interactiveStates = new Set(["typing", "suggesting", "loading", "selected"]);
function normalizeSuggestion(suggestion) {
    if (!suggestion?.label)
        return null;
    const value = suggestion.value ?? suggestion.key ?? suggestion.label;
    return {
        key: String(value),
        label: suggestion.label,
        value: String(value),
        meta: suggestion.meta ?? suggestion.description ?? "",
        disabled: Boolean(suggestion.disabled),
    };
}
function isNormalizedSuggestion(suggestion) {
    return Boolean(suggestion);
}
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, loading, state, hasSuggestions, }) {
    if (disabled)
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (!hasSuggestions)
        return "empty";
    return state;
}
function comboboxStateFor(resolvedState) {
    if (resolvedState === "invalid")
        return "error";
    if (resolvedState === "disabled")
        return "disabled";
    if (resolvedState === "typing" || resolvedState === "suggesting" || resolvedState === "selected")
        return "open";
    return "default";
}
export const Autocomplete = forwardRef(function Autocomplete({ label, helper = "", suggestions, value, name = "", placeholder = "", density, state = "idle", disabled = false, loading = false, empty, validation, selectedKey, onValueChange, onOpenChange, onSuggestionSelect, className = "", ...rest }, ref) {
    const normalizedSuggestions = useMemo(() => (Array.isArray(suggestions) ? suggestions : [])
        .map(normalizeSuggestion)
        .filter(isNormalizedSuggestion), [suggestions]);
    const hasSuggestions = normalizedSuggestions.length > 0;
    const resolvedState = resolveState({ disabled, loading, state, hasSuggestions });
    const comboboxState = comboboxStateFor(resolvedState);
    if (!label)
        return null;
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "data-flow-pattern": "autocomplete",
        "data-state": resolvedState,
        "data-density": density,
        "data-suggestion-count": String(normalizedSuggestions.length),
        ...sanitizeRestProps(rest),
    }, hasSuggestions
        ? React.createElement(Combobox, {
            label,
            helper,
            options: normalizedSuggestions,
            optionsLabel: `${label} suggestions`,
            value,
            name,
            placeholder,
            disabled,
            density,
            state: comboboxState,
            open: interactiveStates.has(resolvedState),
            emptyText: empty?.title,
            onValueChange,
            onOpenChange,
        })
        : null, loading || resolvedState === "loading"
        ? React.createElement(Skeleton, {
            label: `${label} suggestions loading`,
            variant: "row",
            density,
            lines: 3,
            state: "loading",
            fullWidth: true,
        })
        : null, hasSuggestions && resolvedState !== "loading"
        ? React.createElement(List, {
            label: `${label} suggestion summary`,
            items: normalizedSuggestions.map((suggestion) => ({
                key: suggestion.key,
                label: suggestion.label,
                meta: suggestion.meta,
                state: suggestion.disabled ? "disabled" : selectedKey === suggestion.key ? "selected" : "default",
                disabled: suggestion.disabled || disabled,
            })),
            variant: "compact",
            density,
            interactive: Boolean(onSuggestionSelect),
            selectedKey,
            onSelect: onSuggestionSelect,
        })
        : null, !hasSuggestions && !loading
        ? React.createElement(EmptyState, {
            title: empty?.title ?? "No suggestions",
            description: empty?.description ?? helper,
            icon: empty?.icon,
            action: empty?.action,
            variant: "search-empty",
            state: "search-empty",
            density,
            onAction: empty?.onAction,
        })
        : null, validation?.message
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            state: validation.state ?? (resolvedState === "invalid" ? "error" : "default"),
            density,
            live: validation.live,
        })
        : null);
});
Autocomplete.displayName = "Autocomplete";
