/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { EmptyState } from "../EmptyState.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
import { NotificationPanel } from "./NotificationPanel.js";
import { SnackbarProvider } from "./SnackbarProvider.js";
const validKinds = new Set([
    "empty",
    "error",
    "inline",
    "toast",
    "notifications",
    "snackbar",
    "loading",
    "permission",
    "maintenance",
]);
const inlineStates = new Set(["success", "warning", "error", "disabled"]);
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeKind(kind, state) {
    if (kind && validKinds.has(kind))
        return kind;
    if (state === "error" || state === "critical" || state === "warning")
        return "error";
    if (state === "loading")
        return "loading";
    if (state === "permission")
        return "permission";
    if (state === "maintenance")
        return "maintenance";
    return "empty";
}
function resolveState(kind, state) {
    if (state)
        return state;
    if (kind === "error")
        return "error";
    if (kind === "inline")
        return "info";
    if (kind === "toast")
        return "visible";
    if (kind === "notifications")
        return "closed";
    if (kind === "snackbar")
        return "visible";
    if (kind === "loading")
        return "loading";
    if (kind === "permission")
        return "permission";
    if (kind === "maintenance")
        return "default";
    return "empty";
}
function emptyVariant(kind) {
    if (kind === "permission")
        return "permission";
    if (kind === "maintenance")
        return "maintenance";
    return "search-empty";
}
function toastTone(tone, state) {
    if (tone === "neutral" || tone === "info" || tone === "success" || tone === "warning" || tone === "danger")
        return tone;
    if (state === "success")
        return "success";
    if (state === "warning")
        return "warning";
    if (state === "error" || state === "critical")
        return "danger";
    return "info";
}
function surfaceState(state) {
    if (state === "disabled")
        return "disabled";
    if (state === "error" || state === "critical")
        return "raised";
    return "default";
}
export const StatusFeedbackView = forwardRef(function StatusFeedbackView({ kind, label = "Status feedback", title, description, state, tone, density, action, field, inlineValue = "", message, live = true, notifications, messages, open = false, maxVisible = 2, paused = false, selectedKey, onAction, onDismiss, onDismissChange, onMessageAction, onMessageDismiss, onQueueAction, onOpenChange, onSelect, className = "", ...rest }, ref) {
    const resolvedKind = normalizeKind(kind, state);
    const resolvedState = resolveState(resolvedKind, state);
    const shared = sanitizeRestProps(rest);
    const statusLabel = title ?? label;
    let content = null;
    if (resolvedKind === "notifications") {
        content = React.createElement(NotificationPanel, {
            label,
            description,
            density,
            state: resolvedState,
            open,
            notifications,
            selectedKey,
            onOpenChange,
            onSelect,
            "data-flow-pattern-boundary": "notification-panel",
        });
    }
    else if (resolvedKind === "snackbar") {
        content = React.createElement(SnackbarProvider, {
            label,
            density,
            state: resolvedState,
            messages,
            maxVisible,
            paused,
            ...(action ? { action: action } : {}),
            onMessageAction,
            onMessageDismiss,
            onQueueAction,
            "data-flow-pattern-boundary": "snackbar-provider",
        });
    }
    else if (resolvedKind === "error") {
        content = React.createElement(ErrorPanel, {
            label: statusLabel,
            description,
            ...(action ? { action: action } : {}),
            tone: tone === "warning" || tone === "critical" ? tone : "error",
            variant: resolvedState === "critical" ? "blocking" : "panel",
            state: resolvedState === "critical" ? "critical" : resolvedState === "warning" ? "warning" : "error",
            density,
            onAction,
        });
    }
    else if (resolvedKind === "inline") {
        const inlineState = inlineStates.has(resolvedState)
            ? resolvedState
            : "info";
        content = React.createElement(InlineValidation, {
            label: statusLabel,
            value: inlineValue,
            message: message ?? description,
            state: inlineState,
            field,
            live,
            density,
        });
    }
    else if (resolvedKind === "toast") {
        const actionLabel = action?.label;
        content = React.createElement(Toast, {
            label: statusLabel,
            description,
            tone: toastTone(tone, resolvedState),
            variant: actionLabel ? "recovery" : resolvedState === "warning" ? "warning" : "status",
            state: actionLabel ? "action" : "visible",
            density,
            actionLabel: action?.label,
            dismissible: Boolean(onDismiss || onDismissChange),
            dismissLabel: "Dismiss status feedback",
            onAction: actionLabel ? (event) => {
                action.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onAction?.(action.key ?? actionLabel, event);
            } : undefined,
            onDismiss,
            onDismissChange,
        });
    }
    else {
        content = React.createElement(EmptyState, {
            title: statusLabel,
            description,
            icon: resolvedKind === "loading" ? undefined : resolvedKind === "maintenance" ? "construction" : undefined,
            ...(action ? { action: action } : {}),
            variant: emptyVariant(resolvedKind),
            state: resolvedKind === "loading" ? "loading" : resolvedKind === "permission" ? "permission" : "default",
            density,
            onAction,
        });
    }
    return React.createElement(Surface, {
        ref,
        className,
        surfaceRole: "section",
        state: surfaceState(resolvedState),
        density,
        elevation: "none",
        role: resolvedKind === "inline" ? "group" : "region",
        "aria-label": label,
        "aria-live": live && resolvedKind !== "notifications" && resolvedKind !== "snackbar" ? "polite" : undefined,
        "aria-busy": resolvedKind === "loading" || resolvedState === "loading" ? "true" : undefined,
        "data-flow-pattern": "status-feedback-view",
        "data-state": resolvedState,
        "data-density": density,
        "data-feedback-kind": resolvedKind,
        ...shared,
    }, content);
});
StatusFeedbackView.displayName = "StatusFeedbackView";
