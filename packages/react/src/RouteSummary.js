/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { routeSummaryPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["standard", "compact", "compare", "policy"]);
const validStates = new Set(["default", "hover", "focus", "selected", "warning", "disabled"]);
const validTones = new Set(["neutral", "info", "warning"]);
const validButtonVariants = new Set(["primary", "secondary", "tertiary", "outlined", "ghost"]);
const validIconButtonVariants = new Set(["primary", "secondary", "tertiary", "outlined", "ghost"]);
function isValidRouteAction(action, compact) {
    if (!action)
        return false;
    const hasStableKey = action.key !== undefined && action.key !== null && action.key !== "";
    return hasStableKey && Boolean(action.label);
}
function renderAction(action, index, { compact, inheritedDensity, disabled }) {
    const actionDisabled = Boolean(disabled || action?.disabled);
    const actionKey = action?.key;
    const handleActionClick = (event) => {
        event.stopPropagation();
        action?.onClick?.(event);
        if (event.defaultPrevented)
            return;
        action?.onAction?.(String(actionKey), action, event);
    };
    const actionDensity = action?.density ?? inheritedDensity;
    const resolvedIconButtonVariant = action?.variant && validIconButtonVariants.has(action.variant) ? action.variant : "ghost";
    const resolvedButtonVariant = action?.variant && validButtonVariants.has(action.variant) ? action.variant : index === 0 ? "primary" : "secondary";
    if (compact) {
        return React.createElement(IconButton, {
            key: actionKey,
            icon: action?.icon ?? "close",
            label: action.label,
            variant: resolvedIconButtonVariant,
            ...(actionDensity ? { density: actionDensity } : {}),
            disabled: actionDisabled,
            onClick: handleActionClick,
        });
    }
    if (!action?.label)
        return null;
    return React.createElement(Button, {
        key: actionKey,
        label: action.label,
        ...(action?.icon ? { icon: action.icon } : {}),
        ...(action?.trailingIcon ? { trailingIcon: action.trailingIcon } : {}),
        variant: resolvedButtonVariant,
        intent: action?.intent ?? "default",
        ...(actionDensity ? { density: actionDensity } : {}),
        disabled: actionDisabled,
        loading: Boolean(action?.loading),
        onClick: handleActionClick,
    });
}
export const RouteSummary = forwardRef(function RouteSummary({ label, description, metrics, actions, variant = "standard", state = "default", density, tone = "neutral", icon = "navigation", selected = false, disabled = false, fullWidth = false, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
    const resolvedState = disabled ? "disabled" : selected ? "selected" : normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedTone = normalizeFlowValue(tone, validTones, resolvedState === "warning" || resolvedVariant === "policy" ? "warning" : "neutral");
    if (!label)
        return null;
    const isDisabled = resolvedState === "disabled";
    const isCompact = resolvedVariant === "compact";
    const sourceMetrics = Array.isArray(metrics) ? metrics : [];
    const sourceActions = Array.isArray(actions) ? actions : [];
    const visibleMetrics = sourceMetrics.filter((metric) => metric?.key && metric?.label && metric?.value);
    const visibleActions = sourceActions.filter((action) => isValidRouteAction(action, isCompact));
    return React.createElement("article", {
        ...flowRestProps(rest),
        ref,
        className: ["route-summary", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        ...flowToneProps(resolvedTone),
        "data-full-width": String(Boolean(fullWidth)),
        "aria-selected": resolvedState === "selected" ? "true" : undefined,
        "aria-disabled": isDisabled ? "true" : undefined,
        tabIndex: rest.tabIndex,
    }, React.createElement("header", null, icon
        ? React.createElement("span", { className: "route-summary__icon material-symbol", "aria-hidden": "true" }, icon)
        : null, React.createElement("div", { className: "route-summary__label" }, React.createElement("strong", null, label), description ? React.createElement("small", null, description) : null)), visibleMetrics.length
        ? React.createElement("div", { className: "route-summary__metrics" }, visibleMetrics.map((metric) => React.createElement("span", { key: metric.key }, React.createElement("small", null, metric.label), React.createElement("strong", null, metric.value))))
        : null, visibleActions.length
        ? React.createElement("footer", null, visibleActions.map((action, index) => renderAction(action, index, { compact: isCompact, ...(resolvedDensity ? { inheritedDensity: resolvedDensity } : {}), disabled: isDisabled })))
        : null);
});
RouteSummary.displayName = "RouteSummary";
RouteSummary.platformContract = routeSummaryPlatformContract;
