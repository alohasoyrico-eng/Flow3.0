/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { iconButtonPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";
const allowedTypes = new Set(["button", "submit", "reset"]);
const allowedVariants = new Set(["primary", "secondary", "tertiary", "outlined", "ghost"]);
const allowedIntents = new Set(["default", "danger", "warning"]);
const allowedStates = new Set(["default", "hover", "focus", "pressed", "selected", "badged", "disabled", "loading"]);
function iconButtonClassName({ variant = "ghost", className = "" } = {}) {
    return ["icon-button", `icon-button--${variant}`, className].filter(Boolean).join(" ");
}
export const IconButton = forwardRef(function IconButton({ ariaLabel, label, icon = "more_horiz", variant = "ghost", intent = "default", density, state = "default", selected = false, badge = false, loading = false, disabled = false, type = "button", className = "", ...rest }, ref) {
    const resolvedLabel = ariaLabel ?? label;
    if (!resolvedLabel)
        return null;
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedVariant = normalizeFlowValue(variant, allowedVariants, "ghost");
    const resolvedIntent = normalizeFlowValue(intent, allowedIntents, "default");
    const normalizedState = normalizeFlowValue(state, allowedStates, "default");
    const resolvedState = loading || normalizedState === "loading"
        ? "loading"
        : disabled || normalizedState === "disabled"
            ? "disabled"
            : selected
                ? "selected"
                : badge && normalizedState === "default"
                    ? "badged"
                    : normalizedState;
    return React.createElement("button", {
        ...flowRestProps(rest),
        ref,
        type: allowedTypes.has(type) ? type : "button",
        className: iconButtonClassName({ variant: resolvedVariant, className }),
        disabled: resolvedState === "disabled" || resolvedState === "loading",
        "aria-label": resolvedLabel,
        "aria-pressed": selected ? "true" : undefined,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        "data-intent": resolvedIntent,
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(resolvedState),
    }, resolvedState === "loading"
        ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
        : React.createElement("span", { className: "icon-button__icon", "aria-hidden": "true" }, icon), badge ? React.createElement("span", { className: "icon-button__badge", "aria-hidden": "true" }) : null);
});
IconButton.displayName = "IconButton";
IconButton.platformContract = iconButtonPlatformContract;
