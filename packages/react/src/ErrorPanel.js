/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { errorPanelPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["inline", "panel", "blocking", "empty-recovery"]);
const validStates = new Set(["default", "warning", "error", "critical", "loading", "disabled"]);
const validTones = new Set(["warning", "error", "critical"]);
function normalizeVariant(variant) {
    return validVariants.has(variant) ? variant : "panel";
}
function normalizeState(state) {
    return validStates.has(state) ? state : "error";
}
function resolveTone(state, tone) {
    if (state === "warning")
        return "warning";
    if (state === "critical")
        return "critical";
    if (validTones.has(tone))
        return tone;
    return "error";
}
export const ErrorPanel = forwardRef(function ErrorPanel({ label, description, action, secondaryAction, tone = "error", variant = "panel", state = "error", density, fullWidth = false, icon = "", role, onAction, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeVariant(variant);
    const resolvedState = normalizeState(state);
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedTone = resolveTone(resolvedState, tone);
    const resolvedRole = role ?? (resolvedTone === "warning" || resolvedState === "loading" ? "status" : "alert");
    const actionLabel = action?.label;
    const actionKey = action?.key ?? "";
    const secondaryActionLabel = secondaryAction?.label;
    const secondaryActionKey = secondaryAction?.key ?? "";
    const canRenderAction = Boolean(actionLabel && actionKey !== undefined && actionKey !== null && actionKey !== "");
    const canRenderSecondaryAction = Boolean(secondaryActionLabel && secondaryActionKey !== undefined && secondaryActionKey !== null && secondaryActionKey !== "");
    if (!label)
        return null;
    const renderAction = (panelAction, actionKind) => React.createElement(Button, {
        ...panelAction,
        label: panelAction.label,
        variant: panelAction.variant ?? (actionKind === "primary" && resolvedVariant === "blocking" ? "primary" : "secondary"),
        disabled: resolvedState === "disabled" || panelAction.disabled,
        loading: resolvedState === "loading" || panelAction.loading,
        ...(panelAction.density ?? resolvedDensity ? { density: panelAction.density ?? resolvedDensity } : {}),
        onClick: (event) => {
            panelAction.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onAction?.(panelAction.key, event);
        },
    });
    return React.createElement("section", {
        ...flowRestProps(rest),
        ref,
        className: ["error-panel", `error-panel--${resolvedTone}`, className].filter(Boolean).join(" "),
        role: resolvedRole,
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
    }, React.createElement("span", { className: "error-panel__icon", "aria-hidden": "true" }, resolvedState === "loading"
        ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
        : icon || (resolvedTone === "warning" ? "warning" : "error")), React.createElement("div", { className: "error-panel__content" }, React.createElement("strong", null, label), description ? React.createElement("p", null, description) : null), canRenderAction || canRenderSecondaryAction
        ? React.createElement("div", { className: "error-panel__actions" }, canRenderAction && action ? renderAction(action, "primary") : null, canRenderSecondaryAction && secondaryAction ? renderAction(secondaryAction, "secondary") : null)
        : null);
});
ErrorPanel.displayName = "ErrorPanel";
ErrorPanel.platformContract = errorPanelPlatformContract;
