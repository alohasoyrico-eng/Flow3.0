import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { List } from "../List.js";
import { Select } from "../Select.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeResults(results) {
    return (Array.isArray(results) ? results : [])
        .filter((result) => result?.label)
        .map((result) => ({
        key: String(result.key ?? result.value ?? result.label),
        label: result.label,
        meta: result.meta ?? result.description,
        value: result.valueLabel ?? result.value,
        icon: result.icon,
        state: result.state,
        disabled: Boolean(result.disabled),
    }));
}
function resolveState({ disabled, loading, validation, results, state, }) {
    if (disabled)
        return "disabled";
    if (loading || state === "loading")
        return "loading";
    if (validation?.state === "error" || state === "invalid")
        return "invalid";
    if (!results.length && state !== "idle" && state !== "typing")
        return "empty";
    if (state)
        return state;
    return results.length ? "results" : "idle";
}
export const Search = forwardRef(function Search({ label, helper = "", value, query, placeholder, density, state, disabled = false, loading = false, name = "", scopes = [], scopeValue, scopeLabel, results = [], selectedKey, resultCount, validation, empty, submitAction, clearAction, onQueryChange, onScopeChange, onResultSelect, onSubmit, onClear, className = "", ...rest }, ref) {
    const normalizedResults = normalizeResults(results);
    const normalizedScopes = (Array.isArray(scopes) ? scopes : []).filter((scope) => scope?.label);
    const currentValue = query ?? value ?? "";
    const resolvedCount = resultCount ?? normalizedResults.length;
    const resolvedState = resolveState({ disabled, loading, validation, results: normalizedResults, state });
    const isDisabled = disabled || resolvedState === "disabled";
    const inputState = resolvedState === "invalid" ? "error" : resolvedState === "loading" ? "loading" : currentValue ? "filled" : "default";
    if (!label)
        return null;
    return React.createElement("div", {
        ref,
        className,
        role: "search",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "search",
        "data-state": resolvedState,
        "data-density": density,
        "data-result-count": String(resolvedCount),
        "data-has-scope": String(Boolean(normalizedScopes.length)),
        ...sanitizeRestProps(rest),
    }, React.createElement(Input, {
        label,
        helper,
        value: currentValue,
        name,
        placeholder,
        disabled: isDisabled,
        loading,
        density,
        variant: "search",
        icon: "search",
        state: inputState,
        error: validation?.state === "error" ? validation.message : "",
        onValueChange: onQueryChange,
    }), normalizedScopes.length
        ? React.createElement(Select, {
            label: scopeLabel ?? `${label} scope`,
            options: normalizedScopes,
            value: scopeValue,
            disabled: isDisabled,
            density,
            variant: "inline",
            state: isDisabled ? "disabled" : scopeValue ? "filled" : "default",
            onValueChange: onScopeChange,
        })
        : null, resolvedCount || currentValue
        ? React.createElement(InlineValidation, {
            label: `${label} result count`,
            message: `${resolvedCount} result${resolvedCount === 1 ? "" : "s"}`,
            state: resolvedState === "invalid" ? "error" : "info",
            density,
            live: true,
        })
        : null, normalizedResults.length
        ? React.createElement(List, {
            label: `${label} results`,
            items: normalizedResults,
            variant: "action",
            state: resolvedState === "loading" ? "loading" : "default",
            density,
            selectedKey,
            interactive: Boolean(onResultSelect),
            onSelect: onResultSelect,
        })
        : null, !normalizedResults.length && resolvedState === "empty"
        ? React.createElement(EmptyState, {
            title: empty?.title ?? "No results",
            description: empty?.description ?? helper,
            icon: empty?.icon,
            action: empty?.action,
            variant: empty?.variant ?? "search-empty",
            state: "search-empty",
            density,
            onAction: empty?.onAction,
        })
        : null, validation?.message && validation.state !== "error"
        ? React.createElement(InlineValidation, {
            label: validation.label ?? label,
            message: validation.message,
            state: validation.state ?? "default",
            density,
            live: validation.live,
        })
        : null, submitAction?.label
        ? React.createElement(Button, {
            ...submitAction,
            label: submitAction.label,
            variant: submitAction.variant ?? "primary",
            density: submitAction.density ?? density,
            disabled: isDisabled || submitAction.disabled,
            loading: submitAction.loading,
            onClick: (event) => {
                submitAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onSubmit?.(currentValue, event);
            },
        })
        : null, clearAction?.label
        ? React.createElement(Button, {
            ...clearAction,
            label: clearAction.label,
            variant: clearAction.variant ?? "ghost",
            density: clearAction.density ?? density,
            disabled: isDisabled || !currentValue || clearAction.disabled,
            loading: clearAction.loading,
            onClick: (event) => {
                clearAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onClear?.(event);
            },
        })
        : null);
});
Search.displayName = "Search";
