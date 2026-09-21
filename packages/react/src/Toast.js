/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useEffect, useRef, useState, } from "react";
import { toastPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const validVariants = new Set(["status", "progress", "warning", "recovery", "undo"]);
const validStates = new Set(["default", "visible", "action", "stacked", "exiting"]);
const toneIcons = {
    neutral: "info",
    info: "info",
    success: "check_circle",
    warning: "warning",
    danger: "error",
};
export const Toast = forwardRef(function Toast({ label, description, tone = "neutral", variant = "status", state = "visible", density, icon = "", actionLabel, dismissible = false, dismissLabel, dismissed: dismissedProp, duration, onAction, onDismiss, onDismissChange, className = "", onMouseEnter, onMouseLeave, onFocus, onBlur, ...rest }, ref) {
    const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "status");
    const resolvedState = normalizeFlowValue(state, validStates, "visible");
    const resolvedDensity = normalizeFlowDensity(density);
    const isDismissedControlled = dismissedProp !== undefined;
    const [internalDismissed, setInternalDismissed] = useState(false);
    const [paused, setPaused] = useState(false);
    const remainingDuration = useRef(0);
    const timerStartedAt = useRef(0);
    const timerId = useRef(null);
    const dismissed = isDismissedControlled ? Boolean(dismissedProp) : internalDismissed;
    const hidden = dismissed || resolvedState === "default";
    const role = resolvedTone === "danger" || resolvedTone === "warning" ? "alert" : "status";
    const canRenderAction = Boolean(actionLabel && onAction);
    const resolvedDuration = typeof duration === "number" && Number.isFinite(duration) && duration > 0 ? duration : 0;
    const pauseDuration = () => {
        if (!resolvedDuration)
            return;
        if (timerId.current) {
            window.clearTimeout(timerId.current);
            timerId.current = null;
            remainingDuration.current = Math.max(0, remainingDuration.current - (window.performance.now() - timerStartedAt.current));
        }
        setPaused(true);
    };
    const resumeDuration = () => {
        if (!resolvedDuration)
            return;
        setPaused(false);
    };
    useEffect(() => {
        if (timerId.current) {
            window.clearTimeout(timerId.current);
            timerId.current = null;
        }
        if (!resolvedDuration || hidden || paused)
            return undefined;
        if (remainingDuration.current <= 0)
            remainingDuration.current = resolvedDuration;
        timerStartedAt.current = window.performance.now();
        timerId.current = window.setTimeout(() => {
            timerId.current = null;
            remainingDuration.current = 0;
            if (!isDismissedControlled)
                setInternalDismissed(true);
            onDismissChange?.(true);
        }, remainingDuration.current);
        return () => {
            if (!timerId.current)
                return;
            window.clearTimeout(timerId.current);
            timerId.current = null;
        };
    }, [hidden, isDismissedControlled, onDismissChange, paused, resolvedDuration]);
    if (!label)
        return null;
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        className: ["toast", className].filter(Boolean).join(" "),
        hidden,
        role,
        "aria-live": role === "alert" ? "assertive" : "polite",
        ...flowToneProps(resolvedTone),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-duration": resolvedDuration ? String(resolvedDuration) : undefined,
        "data-has-action": canRenderAction ? "true" : undefined,
        "data-dismissible": dismissible && dismissLabel ? "true" : undefined,
        onMouseEnter: (event) => {
            onMouseEnter?.(event);
            pauseDuration();
        },
        onMouseLeave: (event) => {
            onMouseLeave?.(event);
            resumeDuration();
        },
        onFocus: (event) => {
            onFocus?.(event);
            pauseDuration();
        },
        onBlur: (event) => {
            onBlur?.(event);
            if (!resolvedDuration)
                return;
            const nextFocus = event.relatedTarget;
            if (nextFocus instanceof Node && event.currentTarget.contains(nextFocus))
                return;
            resumeDuration();
        },
    }, React.createElement("span", { className: "toast__icon", "aria-hidden": "true" }, icon || toneIcons[resolvedTone]), React.createElement("div", { className: "toast__content" }, React.createElement("strong", null, label), description ? React.createElement("p", null, description) : null), canRenderAction && actionLabel && onAction
        ? React.createElement(Button, {
            label: actionLabel,
            variant: "ghost",
            className: "toast__action",
            "data-toast-action": "",
            ...(resolvedDensity ? { density: resolvedDensity } : {}),
            onClick: (event) => onAction(event),
        })
        : null, dismissible && dismissLabel
        ? React.createElement(IconButton, {
            label: dismissLabel,
            icon: "close",
            className: "toast__dismiss",
            "data-toast-dismiss": "",
            ...(resolvedDensity ? { density: resolvedDensity } : {}),
            onClick: (event) => {
                onDismiss?.(event);
                if (event.defaultPrevented)
                    return;
                if (!isDismissedControlled)
                    setInternalDismissed(true);
                onDismissChange?.(true, event);
            },
        })
        : null);
});
Toast.displayName = "Toast";
Toast.platformContract = toastPlatformContract;
