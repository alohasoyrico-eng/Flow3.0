import React, { forwardRef } from "react";
import { biometricPromptPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["fingerprint", "face", "passcode", "fallback"]);
const validMethods = new Set(["face", "fingerprint"]);
const validStates = new Set(["default", "idle", "focus", "authenticating", "scanning", "success", "warning", "error", "disabled"]);
const stateIcons = {
    success: "check_circle",
    error: "error",
    warning: "warning",
};
const variantIcons = {
    fingerprint: "fingerprint",
    face: "ar_on_you",
    passcode: "pin",
    fallback: "lock",
};
function promptIcon(variant, state, icon) {
    if (icon)
        return icon;
    return stateIcons[state] ?? variantIcons[variant] ?? "fingerprint";
}
function normalizeBiometricState(state) {
    if (state === "idle")
        return "default";
    if (state === "scanning")
        return "authenticating";
    return state;
}
export const BiometricPrompt = forwardRef(function BiometricPrompt({ label, title, description, method, variant = "face", state = "default", actionLabel, fallback, fallbackLabel = "Usar passcode", icon = "", density, fullWidth = false, onUse, onAction, onFallback, className = "", ...rest }, ref) {
    const resolvedMethod = method && validMethods.has(method) ? method : undefined;
    const resolvedVariant = normalizeFlowValue(resolvedMethod ?? variant, validVariants, "face");
    const resolvedState = normalizeBiometricState(normalizeFlowValue(state, validStates, "default"));
    const resolvedDensity = normalizeFlowDensity(density);
    const visibleLabel = title ?? label;
    const actionHandler = onUse ?? onAction;
    const actionCopy = actionLabel ?? (resolvedState === "error" ? "Reintentar" : "Verificar");
    const fallbackCopy = fallback ?? fallbackLabel;
    if (!visibleLabel)
        return null;
    const disabled = resolvedState === "disabled";
    const canRenderAction = Boolean(actionHandler && resolvedState !== "success");
    const canRenderFallback = Boolean(fallbackCopy && onFallback);
    return React.createElement("section", {
        ...flowRestProps(rest),
        ref,
        className: ["biometric-prompt", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
        role: "group",
        "aria-label": visibleLabel,
    }, React.createElement("span", { className: "biometric-prompt__icon material-symbol", "aria-hidden": "true" }, promptIcon(resolvedVariant, resolvedState, icon)), React.createElement("div", { className: "biometric-prompt__content" }, React.createElement("strong", null, visibleLabel), description ? React.createElement("p", { role: resolvedState === "error" ? "alert" : "status" }, description) : null), canRenderAction && actionHandler ? React.createElement(Button, {
        className: "biometric-prompt__action",
        label: actionCopy,
        disabled,
        loading: resolvedState === "authenticating",
        fullWidth: true,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-action": "",
        onClick: (event) => actionHandler(event),
    }) : null, canRenderFallback && onFallback ? React.createElement(Button, {
        className: "biometric-prompt__fallback",
        label: fallbackCopy,
        variant: "ghost",
        disabled,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
        "data-biometric-fallback": "",
        onClick: (event) => onFallback(event),
    }) : null);
});
BiometricPrompt.displayName = "BiometricPrompt";
BiometricPrompt.platformContract = biometricPromptPlatformContract;
