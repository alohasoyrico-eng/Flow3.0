/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { quickActionPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps, flowDataProps } from "./internal/props.js";
const validVariants = new Set(["standard", "compact", "wide"]);
const validStates = new Set(["default", "hover", "focus", "pressed", "loading", "warning", "disabled"]);
const validIntents = new Set(["default", "danger", "warning"]);
const validTypes = new Set(["button", "submit", "reset"]);
export const QuickAction = forwardRef(function QuickAction({ label, icon = "", badge = "", variant, state = "default", intent, density, loading = false, disabled = false, type = "button", onAction, className = "", ...rest }, ref) {
    const resolvedLabel = label;
    const resolvedVariant = variant && validVariants.has(variant) ? variant : "standard";
    const resolvedIntent = intent && validIntents.has(intent) ? intent : state === "warning" ? "warning" : "default";
    const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedType = validTypes.has(type) ? type : "button";
    const canInteract = Boolean(onAction || rest.onClick || resolvedType === "submit" || resolvedType === "reset");
    const blocked = resolvedState === "disabled" || resolvedState === "loading" || !canInteract;
    if (!resolvedLabel)
        return null;
    return React.createElement("div", {
        className: ["quick-action", className].filter(Boolean).join(" "),
        ...flowDataProps(rest),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-intent": resolvedIntent,
    }, React.createElement("button", {
        ...flowRestProps(rest),
        ref,
        type: resolvedType,
        className: "quick-action__control",
        disabled: blocked,
        "aria-label": resolvedLabel,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        onClick: (event) => {
            if (blocked)
                return;
            rest.onClick?.(event);
            if (event.defaultPrevented)
                return;
            onAction?.({ label: resolvedLabel, variant: resolvedVariant, intent: resolvedIntent, state: resolvedState }, event);
        },
    }, React.createElement("span", { className: "quick-action__icon", "aria-hidden": "true" }, resolvedState === "loading"
        ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
        : icon)), resolvedLabel ? React.createElement("span", { className: "quick-action__label" }, resolvedLabel) : null, badge ? React.createElement(Badge, { label: badge, variant: "count", ...(resolvedDensity ? { density: resolvedDensity } : {}) }) : null);
});
QuickAction.displayName = "QuickAction";
QuickAction.platformContract = quickActionPlatformContract;
