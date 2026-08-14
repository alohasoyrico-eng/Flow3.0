/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { biometricPromptPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["fingerprint", "face", "passcode", "fallback"]);
const validStates = new Set(["default", "focus", "authenticating", "success", "warning", "error", "disabled"]);
const stateIcons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
};
const variantIcons = {
    fingerprint: "fingerprint",
    face: "face",
    passcode: "pin",
    fallback: "lock",
};
function promptIcon(variant, state, icon) {
    if (icon)
        return icon;
    return stateIcons[state] ?? variantIcons[variant] ?? "fingerprint";
}
export const BiometricPrompt = forwardRef(function BiometricPrompt({ label, description, variant = "fingerprint", state = "default", actionLabel, fallback, icon = "", density, fullWidth = false, onAction, onFallback, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "fingerprint");
    const resolvedState = normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    const disabled = resolvedState === "disabled";
    const canRenderAction = Boolean(actionLabel && onAction);
    const canRenderFallback = Boolean(fallback && onFallback);
    return React.createElement("section", {
        ...flowRestProps(rest),
        ref,
        className: ["biometric-prompt", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
        role: "group",
        "aria-label": label,
    }, React.createElement("span", { className: "biometric-prompt__icon material-symbol", "aria-hidden": "true" }, promptIcon(resolvedVariant, resolvedState, icon)), React.createElement("div", { className: "biometric-prompt__content" }, React.createElement("strong", null, label), description ? React.createElement("p", { role: "status" }, description) : null), canRenderAction && actionLabel && onAction ? React.createElement(Button, {
        className: "biometric-prompt__action",
        label: actionLabel,
        disabled,
        loading: resolvedState === "authenticating",
        fullWidth: true,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-action": "",
        onClick: (event) => onAction(event),
    }) : null, canRenderFallback && fallback && onFallback ? React.createElement(Button, {
        className: "biometric-prompt__fallback",
        label: fallback,
        variant: "tertiary",
        disabled,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-fallback": "",
        onClick: (event) => onFallback(event),
    }) : null);
});
BiometricPrompt.displayName = "BiometricPrompt";
BiometricPrompt.platformContract = biometricPromptPlatformContract;
