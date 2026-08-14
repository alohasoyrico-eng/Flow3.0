import React, { forwardRef, useRef, useState } from "react";
import { copyButtonPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowVariantProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["text", "icon", "inline"]);
const validStates = new Set(["default", "hover", "focus", "pressed", "copied", "error", "disabled", "loading"]);
const allowedTypes = new Set(["button", "submit", "reset"]);
function resolveVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "text";
}
function resolveState({ disabled, loading, state }) {
    if (disabled)
        return "disabled";
    if (loading)
        return "loading";
    return state && validStates.has(state) ? state : "default";
}
function canUseClipboard() {
    return typeof navigator !== "undefined" && Boolean(navigator.clipboard?.writeText);
}
export const CopyButton = forwardRef(function CopyButton({ value, label, ariaLabel, variant = "text", state = "default", density, feedbackDuration, copiedLabel, errorLabel, disabled = false, loading = false, icon = "content_copy", type = "button", className = "", onClick, onCopied, onCopyError, ...rest }, ref) {
    const resolvedVariant = resolveVariant(variant);
    const [transientState, setTransientState] = useState(null);
    const timer = useRef(null);
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedState = resolveState({ disabled, loading, state: transientState ?? state });
    const fallbackLabel = `Copy ${value}`;
    const labelText = resolvedState === "copied" && copiedLabel ? copiedLabel : resolvedState === "error" && errorLabel ? errorLabel : label;
    const accessibleName = ariaLabel ?? labelText ?? fallbackLabel;
    if (!value)
        return null;
    const handleClick = async (event) => {
        onClick?.(event);
        if (event.defaultPrevented || disabled || loading)
            return;
        if (!canUseClipboard()) {
            const nextState = "error";
            setTransientState(nextState);
            onCopyError?.({ value, state: nextState }, event);
        }
        else {
            try {
                await navigator.clipboard.writeText(value);
                const nextState = "copied";
                setTransientState(nextState);
                onCopied?.({ value, state: nextState }, event);
            }
            catch (error) {
                const nextState = "error";
                void error;
                setTransientState(nextState);
                onCopyError?.({ value, state: nextState }, event);
            }
        }
        if (timer.current)
            window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setTransientState(null), feedbackDuration ?? 1600);
    };
    const commonProps = {
        ...flowRestProps(rest),
        ref,
        type: allowedTypes.has(type) ? type : "button",
        disabled: resolvedState === "disabled" || resolvedState === "loading",
        className: ["copy-button", className].filter(Boolean).join(" "),
        "aria-label": accessibleName,
        "aria-busy": resolvedState === "loading" ? true : undefined,
        "data-copy-feedback": resolvedState === "copied" || resolvedState === "error" ? resolvedState : undefined,
        onClick: handleClick,
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
    };
    if (resolvedVariant === "icon") {
        return React.createElement(IconButton, {
            ...commonProps,
            ariaLabel: accessibleName,
            icon,
            variant: "ghost",
            ...(resolvedDensity !== undefined ? { density: resolvedDensity } : {}),
        });
    }
    return React.createElement(Button, {
        ...commonProps,
        label: labelText ?? accessibleName,
        variant: resolvedVariant === "inline" ? "tertiary" : "secondary",
        ...(resolvedDensity !== undefined ? { density: resolvedDensity } : {}),
        loading: resolvedState === "loading",
    });
});
CopyButton.displayName = "CopyButton";
CopyButton.platformContract = copyButtonPlatformContract;
