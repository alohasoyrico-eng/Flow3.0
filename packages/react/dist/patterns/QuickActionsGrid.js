import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Dialog } from "../Dialog.js";
import { QuickAction } from "../QuickAction.js";
import { Toast } from "../Toast.js";
import { Tooltip } from "../Tooltip.js";
import { Search } from "./Search.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ loading, disabled, permissionBlocked, confirming, completed, error, state }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (permissionBlocked || state === "permission-blocked")
        return "permission-blocked";
    if (error || state === "error")
        return "error";
    if (confirming || state === "confirming")
        return "confirming";
    if (completed || state === "completed")
        return "completed";
    if (loading || state === "loading")
        return "loading";
    return state ?? "default";
}
function actionKey(action, index) {
    return action.key ?? `${action.label}-${index}`;
}
function isGridAction(action) {
    return Boolean(action?.label);
}
export const QuickActionsGrid = forwardRef(function QuickActionsGrid({ label = "Quick actions", density, state, loading = false, disabled = false, permissionBlocked = false, confirming = false, completed = false, error, actions = [], search, confirmation, feedback, className = "", onAction, ...rest }, ref) {
    const normalizedActions = (Array.isArray(actions) ? actions : []).filter(isGridAction);
    const resolvedState = resolveState({
        loading,
        disabled,
        permissionBlocked,
        confirming: confirming || confirmation?.open,
        completed,
        error: Boolean(error || feedback?.tone === "danger"),
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "quick-actions-grid",
        "data-state": resolvedState,
        "data-density": density,
        "data-action-count": String(normalizedActions.length),
        "data-search-boundary": search ? "true" : "false",
        ...sanitizeRestProps(rest),
    }, search
        ? React.createElement(Search, {
            ...search,
            label: search.label ?? "Find action target",
            density: search.density ?? density,
            state: search.state ?? (search.loading ? "loading" : search.results?.length ? "results" : "idle"),
        })
        : null, normalizedActions.map((action, index) => {
        const key = actionKey(action, index);
        const actionDisabled = isDisabled || action.disabled || action.permissionBlocked;
        const actionState = resolvedState === "loading" || action.loading
            ? "loading"
            : actionDisabled
                ? "disabled"
                : action.state ?? "default";
        const tone = action.intent === "danger" || action.tone === "danger" ? "danger" : "neutral";
        return React.createElement("div", { key, "data-action-key": key }, React.createElement(QuickAction, {
            label: action.label,
            icon: action.icon,
            badge: action.badge,
            variant: action.variant ?? (tone === "danger" ? "destructive" : "standard"),
            state: actionState,
            density: action.density ?? density,
            loading: resolvedState === "loading" || action.loading,
            disabled: actionDisabled,
            tone,
            onAction: (meta, event) => {
                action.onAction?.(meta, event);
                onAction?.(key, action, event);
            },
        }), action.status
            ? React.createElement(Badge, {
                label: action.status.label,
                tone: action.status.tone ?? (action.permissionBlocked ? "warning" : "info"),
                variant: action.status.variant ?? "status",
                density: action.status.density ?? density,
                state: actionDisabled ? "disabled" : action.status.state ?? "default",
                live: action.status.live ?? true,
            })
            : null, action.tooltip
            ? React.createElement(Tooltip, {
                triggerLabel: action.tooltip.triggerLabel ?? `${action.label} details`,
                content: action.tooltip.content,
                placement: action.tooltip.placement ?? "top",
                variant: action.tooltip.variant ?? (actionDisabled ? "disabled-help" : "default"),
                density: action.tooltip.density ?? density,
                state: action.tooltip.state,
                open: action.tooltip.open,
                disabled: action.tooltip.disabled,
                onOpenChange: action.tooltip.onOpenChange,
            })
            : null);
    }), confirmation
        ? React.createElement(Dialog, {
            ...confirmation,
            density: confirmation.density ?? density,
            open: confirmation.open,
            state: confirmation.open ? "open" : "closed",
            variant: confirmation.variant ?? "confirmation",
        })
        : null, error
        ? React.createElement(Toast, {
            label: error.label ?? "Quick action failed",
            description: error.description,
            tone: "danger",
            variant: "recovery",
            state: "visible",
            density,
            actionLabel: error.actionLabel,
            dismissible: error.dismissible ?? true,
            onAction: error.onAction,
            onDismiss: error.onDismiss,
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null);
});
QuickActionsGrid.displayName = "QuickActionsGrid";
