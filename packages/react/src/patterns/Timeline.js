/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { AuditEvent } from "../AuditEvent.js";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Chip } from "../Chip.js";
import { EmptyState } from "../EmptyState.js";
import { List } from "../List.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeEvents(events) {
    return (Array.isArray(events) ? events : []).filter((event) => Boolean(event?.key && event.label));
}
function resolveState({ loading, error, permissionBlocked, filtered, empty, state }) {
    if (state === "permission-blocked" || permissionBlocked)
        return "permission-blocked";
    if (state === "error" || error)
        return "error";
    if (state === "loading" || loading)
        return "loading";
    if (state === "empty" || empty)
        return "empty";
    if (state === "filtered" || filtered)
        return "filtered";
    return state ?? "default";
}
function eventTone(event) {
    if (event.tone)
        return event.tone;
    if (event.state === "verified" || event.status === "success")
        return "success";
    if (event.state === "warning" || event.status === "warning")
        return "warning";
    if (event.state === "critical" || event.status === "danger")
        return "danger";
    if (event.status === "action")
        return "action";
    return "neutral";
}
function eventState(event, disabled) {
    if (disabled || event.disabled)
        return "disabled";
    if (event.state)
        return event.state;
    if (event.status === "success")
        return "verified";
    if (event.status === "warning")
        return "warning";
    if (event.status === "danger")
        return "critical";
    return "default";
}
function toListItem(event, disabled, selectedKey) {
    const item = {
        key: event.key,
        label: event.label,
        icon: event.icon ?? "history",
        state: disabled || event.disabled ? "disabled" : selectedKey === event.key ? "selected" : "default",
    };
    const meta = event.timestamp ?? event.meta;
    const value = event.actor ?? event.description;
    if (meta !== undefined)
        item.meta = meta;
    if (value !== undefined)
        item.value = value;
    if (disabled || event.disabled !== undefined)
        item.disabled = disabled || event.disabled === true;
    return item;
}
export const Timeline = forwardRef(function Timeline({ label = "Timeline", description, density, state, loading = false, empty = false, error = false, permissionBlocked = false, filtered = false, events = [], filters = [], status, selectedKey, recovery, clearAction, className = "", onEventSelect, onFilterRemove, onClear, ...rest }, ref) {
    const normalizedEvents = normalizeEvents(events);
    const normalizedFilters = (Array.isArray(filters) ? filters : []).filter((filter) => Boolean(filter?.label));
    const resolvedState = resolveState({
        loading,
        error,
        permissionBlocked,
        filtered,
        empty: empty || normalizedEvents.length === 0,
        state,
    });
    const isBlocked = resolvedState === "permission-blocked";
    const showLoading = resolvedState === "loading";
    const showEmpty = resolvedState === "empty";
    const showError = resolvedState === "error";
    const canShowEvents = !showLoading && !showEmpty && !showError && !isBlocked;
    const disabled = isBlocked;
    return React.createElement("div", {
        ref,
        className,
        role: "region",
        "aria-label": label,
        "aria-busy": showLoading ? "true" : undefined,
        "data-flow-pattern": "timeline",
        "data-state": resolvedState,
        "data-density": density,
        "data-event-count": String(normalizedEvents.length),
        "data-filter-count": String(filters.length),
        ...sanitizeRestProps(rest),
    }, React.createElement("div", { "data-timeline-status": "true" }, React.createElement(Badge, {
        label: status?.label ?? `${normalizedEvents.length} events`,
        tone: status?.tone ?? (resolvedState === "filtered" ? "warning" : "info"),
        variant: status?.variant ?? "status",
        density,
        state: disabled ? "disabled" : "default",
        live: true,
    }), description ? React.createElement(Badge, {
        label: description,
        tone: "neutral",
        variant: "status",
        density,
        state: disabled ? "disabled" : "default",
    }) : null), normalizedFilters.map((filter) => React.createElement(Chip, {
        ...filter,
        key: filter.key ?? filter.label,
        label: filter.label,
        density: filter.density ?? density,
        variant: filter.variant ?? "filter",
        selected: filter.selected ?? resolvedState === "filtered",
        removable: filter.removable ?? true,
        onRemoveLabel: filter.onRemoveLabel ?? `Remove ${filter.label}`,
        onRemove: (labelValue, event) => {
            filter.onRemove?.(labelValue, event);
            if (event.defaultPrevented)
                return;
            onFilterRemove?.(filter.key ?? filter.label, event);
        },
    })), clearAction || resolvedState === "filtered"
        ? React.createElement(Button, {
            ...(clearAction ?? {}),
            label: clearAction?.label ?? "Clear filters",
            variant: clearAction?.variant ?? "ghost",
            density: clearAction?.density ?? density,
            disabled: disabled || clearAction?.disabled,
            onClick: (event) => {
                clearAction?.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onClear?.(event);
            },
        })
        : null, showLoading
        ? React.createElement(EmptyState, {
            title: recovery?.title ?? `${label} loading`,
            description: recovery?.description ?? "Timeline events are loading.",
            icon: recovery?.icon ?? "progress_activity",
            variant: "first-use",
            state: "loading",
            density,
            fullWidth: true,
        })
        : null, showEmpty || showError || isBlocked
        ? React.createElement(EmptyState, {
            title: recovery?.title ?? (isBlocked ? "Timeline unavailable" : showError ? `${label} unavailable` : "No timeline events"),
            description: recovery?.description ?? description,
            icon: recovery?.icon ?? (isBlocked ? "lock" : showError ? "error" : "history"),
            action: recovery?.action,
            variant: recovery?.variant ?? (showError ? "error" : isBlocked ? "permission" : "search-empty"),
            state: recovery?.state ?? (showError ? "error" : isBlocked ? "permission" : "search-empty"),
            density,
            fullWidth: true,
            onAction: recovery?.onAction,
        })
        : null, canShowEvents
        ? React.createElement(List, {
            label: `${label} order`,
            items: normalizedEvents.map((event) => toListItem(event, disabled, selectedKey)),
            variant: "status",
            density,
            interactive: true,
            selectedKey,
            state: disabled ? "disabled" : "default",
            onSelect: onEventSelect,
        })
        : null, canShowEvents
        ? normalizedEvents.map((event) => React.createElement(AuditEvent, {
            key: `${event.key}-audit-event`,
            label: event.label,
            description: event.description,
            meta: event.meta ?? event.actor,
            status: event.statusLabel ?? event.status,
            icon: event.icon ?? "history",
            tone: eventTone(event),
            state: eventState(event, disabled),
            density,
            timestamp: event.timestamp,
        }))
        : null);
});
Timeline.displayName = "Timeline";
