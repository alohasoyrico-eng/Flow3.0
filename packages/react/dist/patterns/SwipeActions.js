import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Dialog } from "../Dialog.js";
import { IconButton } from "../IconButton.js";
import { MovementRow } from "../MovementRow.js";
import { Toast } from "../Toast.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ revealed, threshold, committed, confirming, disabled, reducedMotion, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (reducedMotion || state === "reduced-motion")
        return "reduced-motion";
    if (confirming || state === "confirming")
        return "confirming";
    if (committed || state === "committed")
        return "committed";
    if (threshold || state === "threshold")
        return "threshold";
    if (revealed || state === "revealed")
        return "revealed";
    return state ?? "closed";
}
function actionKey(action, index) {
    return action.key ?? `${action.label}-${index}`;
}
function iconButtonVariantForAction(variant) {
    return variant === "compact" ? "ghost" : "secondary";
}
function iconButtonStateForAction(state) {
    return state === "warning" ? "default" : state;
}
export const SwipeActions = forwardRef(function SwipeActions({ label = "Swipe actions", density, state, revealed = false, threshold = false, committed = false, confirming = false, disabled = false, reducedMotion = false, row, actions = [], confirmation, recovery, feedback, className = "", onAction, ...rest }, ref) {
    const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
    const resolvedState = resolveState({
        revealed,
        threshold,
        committed,
        confirming: confirming || confirmation?.open,
        disabled,
        reducedMotion,
        state,
    });
    const isDisabled = disabled || resolvedState === "disabled";
    const actionsVisible = resolvedState !== "closed";
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "data-flow-pattern": "swipe-actions",
        "data-state": resolvedState,
        "data-density": density,
        "data-action-count": String(normalizedActions.length),
        "data-non-swipe-access": "true",
        ...sanitizeRestProps(rest),
    }, React.createElement(MovementRow, {
        ...(row ?? {}),
        label: row?.label ?? label,
        meta: row?.meta,
        amount: row?.amount,
        status: row?.status,
        category: row?.category ?? "transfer",
        variant: row?.variant ?? "standard",
        state: isDisabled ? "disabled" : row?.state ?? "default",
        density: row?.density ?? density,
        fullWidth: row?.fullWidth ?? true,
        disabled: isDisabled || row?.disabled,
        onSelect: row?.onSelect,
    }), normalizedActions.map((action, index) => {
        const key = actionKey(action, index);
        const intent = action.intent === "danger" ? "danger" : action.intent === "warning" ? "warning" : "default";
        const actionDisabled = isDisabled || action.disabled;
        const actionState = actionDisabled ? "disabled" : action.loading ? "loading" : actionsVisible ? "pressed" : "default";
        const variant = action.variant ?? "compact";
        const meta = {
            label: action.label,
            variant,
            intent,
            state: actionState,
        };
        return React.createElement("div", { key, "data-swipe-action-key": key, "data-visible": actionsVisible ? "true" : "false" }, React.createElement("div", {
            className: "pattern-action-item",
            "data-variant": variant,
            "data-intent": intent,
            "data-state": actionState,
            "data-density": action.density ?? density,
        }, React.createElement(IconButton, {
            label: action.label,
            icon: action.icon,
            variant: iconButtonVariantForAction(variant),
            intent,
            state: iconButtonStateForAction(actionState),
            density: action.density ?? density,
            loading: action.loading,
            disabled: actionDisabled,
            className: "pattern-action-item__control",
            onClick: (event) => {
                action.onAction?.(meta, event);
                if (event.defaultPrevented)
                    return;
                onAction?.(key, action, event);
            },
        }), action.label ? React.createElement("span", { className: "pattern-action-item__label" }, action.label) : null, action.badge
            ? React.createElement(Badge, {
                label: action.badge,
                variant: "count",
                density: action.density ?? density,
                state: actionDisabled ? "disabled" : actionState,
            })
            : null), React.createElement(Button, {
            label: action.fallbackLabel ?? action.label,
            icon: action.icon,
            variant: action.fallbackVariant ?? "secondary",
            intent: action.intent,
            density: action.density ?? density,
            disabled: actionDisabled,
            loading: action.loading,
            onClick: action.onFallbackClick,
            "aria-label": `${action.label} without swipe`,
        }));
    }), confirmation
        ? React.createElement(Dialog, {
            ...confirmation,
            density: confirmation.density ?? density,
            open: confirmation.open,
            state: confirmation.open ? "open" : "closed",
            variant: confirmation.variant ?? "confirmation",
        })
        : null, recovery
        ? React.createElement(Toast, {
            ...recovery,
            density: recovery.density ?? density,
            state: recovery.state ?? "visible",
            variant: recovery.variant ?? "undo",
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null);
});
SwipeActions.displayName = "SwipeActions";
