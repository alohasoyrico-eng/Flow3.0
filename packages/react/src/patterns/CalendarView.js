/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Card } from "../Card.js";
import { DateRangePicker } from "../DateRangePicker.js";
import { EmptyState } from "../EmptyState.js";
import { List } from "../List.js";
import { Popover } from "../Popover.js";
import { Skeleton } from "../Skeleton.js";
import { Surface } from "../Surface.js";
import { Tooltip } from "../Tooltip.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeEvents(events) {
    return (Array.isArray(events) ? events : []).filter((event) => Boolean(event?.key && event.label));
}
function resolveState({ disabled, loading, error, empty, dense, selectedKey, rangeChanging, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (error || state === "error")
        return "error";
    if (loading || state === "loading")
        return "loading";
    if (empty || state === "empty")
        return "empty";
    if (rangeChanging || state === "range-changing")
        return "range-changing";
    if (dense || state === "dense")
        return "dense";
    if (selectedKey || state === "selected")
        return "selected";
    return state ?? "default";
}
function eventTone(event) {
    if (event.tone)
        return event.tone;
    if (event.status === "warning")
        return "warning";
    if (event.status === "danger")
        return "danger";
    if (event.status === "success")
        return "success";
    return "info";
}
function listStateFor(event) {
    if (event.state === "selected" || event.state === "loading" || event.state === "error" || event.state === "disabled")
        return event.state;
    return "default";
}
function toListItem(event, isDisabled, selectedKey) {
    const disabled = Boolean(isDisabled || event.disabled);
    return {
        key: event.key,
        label: event.label,
        meta: event.description ?? event.time,
        value: event.value ?? event.owner,
        icon: event.icon ?? "event",
        state: disabled ? "disabled" : selectedKey === event.key ? "selected" : listStateFor(event),
        disabled,
    };
}
export const CalendarView = forwardRef(function CalendarView({ label = "Calendar", description, density, state, disabled = false, loading = false, empty = false, error = false, dense = false, rangeChanging = false, dateControl, selectedDate, rangeLabel, timezoneLabel, events = [], selectedKey, actions = [], detail, emptyState, skeleton, className = "", onDateChange, onEventSelect, onAction, ...rest }, ref) {
    const normalizedEvents = normalizeEvents(events);
    const resolvedState = resolveState({
        disabled,
        loading,
        error,
        empty: empty || normalizedEvents.length === 0,
        dense,
        selectedKey,
        rangeChanging,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled";
    const showLoading = resolvedState === "loading" || resolvedState === "range-changing";
    const showEmpty = resolvedState === "empty";
    const showError = resolvedState === "error";
    const selectedEvent = normalizedEvents.find((event) => event.key === selectedKey);
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": showLoading ? "true" : undefined,
        "data-flow-pattern": "calendar-view",
        "data-state": resolvedState,
        "data-density": density,
        "data-event-count": String(normalizedEvents.length),
        "data-selected-date": selectedDate ?? dateControl?.from ?? dateControl?.value?.from,
        ...sanitizeRestProps(rest),
    }, React.createElement(Surface, {
        surfaceRole: "section",
        state: isDisabled ? "disabled" : "default",
        density,
        "data-calendar-view-surface": "true",
    }, React.createElement(DateRangePicker, {
        ...(dateControl ?? {}),
        label: dateControl?.label ?? `${label} date`,
        value: dateControl?.value ?? (selectedDate ? { from: selectedDate, to: selectedDate } : undefined),
        from: dateControl?.from ?? selectedDate,
        to: dateControl?.to ?? selectedDate,
        helper: dateControl?.helper ?? [rangeLabel, timezoneLabel].filter(Boolean).join(" · "),
        density: dateControl?.density ?? density,
        state: dateControl?.state ?? (isDisabled ? "disabled" : selectedDate || dateControl?.from || dateControl?.value?.from ? "selected" : "default"),
        disabled: isDisabled || dateControl?.disabled,
        onValueChange: (value, event) => {
            dateControl?.onValueChange?.(value, event);
            onDateChange?.(value, event);
        },
    }), rangeLabel
        ? React.createElement(Badge, {
            label: rangeLabel,
            tone: dense ? "warning" : "info",
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
            live: true,
        })
        : null, timezoneLabel
        ? React.createElement(Tooltip, {
            triggerLabel: "Calendar timezone",
            content: timezoneLabel,
            variant: "icon-help",
            density,
            open: detail?.timezoneOpen,
        })
        : null, actions.filter((action) => Boolean(action?.label)).map((action) => React.createElement(Button, {
        ...action,
        key: action.key ?? action.label,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "secondary",
        disabled: isDisabled || action.disabled,
        onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onAction?.(action.key ?? action.label, event);
        },
    })), showLoading
        ? React.createElement(Skeleton, {
            label: skeleton?.label ?? `${label} loading`,
            variant: skeleton?.variant ?? "card",
            rows: skeleton?.rows ?? 3,
            density,
            state: "loading",
            fullWidth: true,
        })
        : null, showError || showEmpty
        ? React.createElement(EmptyState, {
            title: emptyState?.title ?? (showError ? `${label} unavailable` : `No events in ${rangeLabel ?? "this period"}`),
            description: emptyState?.description ?? description,
            icon: emptyState?.icon ?? (showError ? "error" : "event_busy"),
            action: emptyState?.action,
            variant: emptyState?.variant ?? (showError ? "error" : "search-empty"),
            state: emptyState?.state ?? (showError ? "error" : "search-empty"),
            density,
            fullWidth: true,
            onAction: emptyState?.onAction,
        })
        : null, !showLoading && !showError && normalizedEvents.length
        ? React.createElement(List, {
            label: `${label} events`,
            items: normalizedEvents.map((event) => toListItem(event, isDisabled, selectedKey)),
            variant: dense ? "compact" : "standard",
            interactive: true,
            density,
            state: isDisabled ? "disabled" : "default",
            selectedKey,
            onSelect: onEventSelect,
        })
        : null, !showLoading && !showError
        ? normalizedEvents.map((event) => React.createElement(Card, {
            key: `${event.key}-card`,
            title: event.label,
            value: event.time,
            detail: event.description,
            status: React.createElement(Badge, {
                label: event.statusLabel ?? event.status ?? "Scheduled",
                tone: eventTone(event),
                variant: "status",
                density,
                state: isDisabled ? "disabled" : "default",
            }),
            icon: event.icon ?? "event",
            variant: event.cardVariant ?? "minimal",
            composition: "compact",
            state: isDisabled || event.disabled ? "disabled" : selectedKey === event.key ? "selected" : "default",
            density,
            fullWidth: true,
        }))
        : null, selectedEvent || detail?.title
        ? React.createElement(Popover, {
            triggerLabel: detail?.triggerLabel ?? "Event details",
            title: detail?.title ?? selectedEvent?.label ?? "Event details",
            description: detail?.description ?? selectedEvent?.description,
            open: detail?.open,
            variant: detail?.variant ?? "information",
            placement: detail?.placement ?? "bottom",
            density,
            disabled: isDisabled || detail?.disabled,
            actions: detail?.actions,
            field: detail?.field,
            onOpenChange: detail?.onOpenChange,
            onAction: detail?.onAction,
        })
        : null));
});
CalendarView.displayName = "CalendarView";
