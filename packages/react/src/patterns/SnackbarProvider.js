/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useMemo } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
function normalizeMessage(message, index) {
    if (!message?.label)
        return null;
    const key = message.key ?? message.id ?? `${message.label}-${index}`;
    return {
        key: String(key),
        label: message.label,
        ...(message.description ? { description: message.description } : {}),
        tone: message.tone ?? "info",
        variant: message.variant ?? (message.actionLabel ? "recovery" : "status"),
        state: message.state ?? (message.actionLabel ? "action" : "visible"),
        ...(message.icon ? { icon: message.icon } : {}),
        ...(message.actionLabel ? { actionLabel: message.actionLabel } : {}),
        dismissible: message.dismissible ?? true,
        dismissLabel: message.dismissLabel ?? "Dismiss notification",
        ...(message.dismissed === undefined ? {} : { dismissed: message.dismissed }),
        priority: message.priority ?? "normal",
    };
}
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
export const SnackbarProvider = forwardRef(function SnackbarProvider({ label = "Notifications", messages, density, state = "visible", maxVisible = 2, paused = false, action, onMessageAction, onMessageDismiss, onQueueAction, className = "", ...rest }, ref) {
    const normalizedMessages = useMemo(() => (Array.isArray(messages) ? messages : [])
        .map(normalizeMessage)
        .filter((message) => Boolean(message)), [messages]);
    const visibleCount = Math.max(0, Number(maxVisible) || 0);
    const visibleMessages = normalizedMessages.slice(0, visibleCount);
    const queuedCount = Math.max(0, normalizedMessages.length - visibleMessages.length);
    const resolvedState = paused ? "paused" : normalizedMessages.length ? state : "idle";
    return React.createElement(Surface, {
        ref,
        className,
        surfaceRole: "overlay",
        role: "region",
        "aria-label": label,
        "data-flow-pattern": "snackbar-provider",
        "data-flow-slot": "viewport",
        "data-state": resolvedState,
        "data-density": density,
        "data-message-count": String(normalizedMessages.length),
        ...sanitizeRestProps(rest),
    }, queuedCount > 0
        ? React.createElement(Badge, {
            label: `${queuedCount} queued`,
            ariaLabel: `${queuedCount} queued notifications`,
            tone: "info",
            variant: "count",
            state: "overflow",
            density,
            live: true,
        })
        : null, visibleMessages.map((message) => React.createElement(Toast, {
        key: message.key,
        label: message.label,
        description: message.description,
        tone: message.tone,
        variant: message.variant,
        state: paused ? "stacked" : message.state,
        density,
        icon: message.icon,
        actionLabel: message.actionLabel,
        dismissible: message.dismissible,
        dismissLabel: message.dismissLabel,
        dismissed: message.dismissed,
        onAction: message.actionLabel ? (event) => onMessageAction?.(message.key, event) : undefined,
        onDismiss: (event) => onMessageDismiss?.(message.key, event),
        "data-message-key": message.key,
        "data-priority": message.priority,
    })), action?.label
        ? React.createElement(Button, {
            ...action,
            label: action.label,
            density: action.density ?? density,
            variant: action.variant ?? "ghost",
            onClick: (event) => {
                action.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onQueueAction?.(action.key ?? action.label ?? "", event);
            },
        })
        : null);
});
SnackbarProvider.displayName = "SnackbarProvider";
