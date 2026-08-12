import React, { forwardRef } from "react";
import { badgePlatformContract } from "#flow/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
const validTones = new Set(["neutral", "info", "success", "warning", "danger", "accent"]);
const validVariants = new Set(["count", "dot", "status", "icon"]);
const validStates = new Set(["default", "hover", "focus", "overflow", "hidden", "disabled"]);
function normalizeTone(tone) {
    return tone && validTones.has(tone) ? tone : "neutral";
}
function normalizeVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "status";
}
function normalizeState({ hidden = false, state = "default" } = {}) {
    if (hidden)
        return "hidden";
    return state && validStates.has(state) ? state : "default";
}
export const Badge = forwardRef(function Badge({ label, tone = "neutral", variant = "status", state = "default", density, hidden = false, live = false, icon = "", ariaLabel, className = "", ...rest }, ref) {
    const resolvedTone = normalizeTone(tone);
    const resolvedVariant = normalizeVariant(variant);
    const resolvedState = normalizeState({ hidden, state });
    const text = resolvedVariant === "dot" ? "" : label;
    const accessibleLabel = ["dot", "count"].includes(resolvedVariant) ? ariaLabel : undefined;
    if (resolvedVariant === "dot" && !accessibleLabel)
        return null;
    if (resolvedVariant !== "dot" && !label)
        return null;
    const resolvedDensity = normalizeFlowDensity(density);
    return React.createElement("span", {
        ...flowRestProps(rest),
        ref,
        className: ["badge", className].filter(Boolean).join(" "),
        hidden: resolvedState === "hidden",
        role: live ? "status" : rest.role,
        "aria-live": live ? "polite" : rest["aria-live"],
        "aria-label": accessibleLabel,
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        ...flowToneProps(resolvedTone),
        ...flowVariantProps(resolvedVariant),
        ...flowDensityProps(resolvedDensity),
        ...flowStateProps(resolvedState),
        "data-live": live ? "true" : undefined,
    }, live ? React.createElement("span", { className: "badge__live", "aria-hidden": "true" }) : null, resolvedVariant === "icon" && icon
        ? React.createElement("span", { className: "badge__icon", "aria-hidden": "true" }, icon)
        : null, text ? React.createElement("span", { className: "badge__label" }, text) : null);
});
Badge.displayName = "Badge";
Badge.platformContract = badgePlatformContract;
