/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { cardSummaryPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validVariants = new Set(["physical", "virtual", "compact", "limit"]);
const validStates = new Set(["default", "hover", "focus", "active", "warning", "frozen", "disabled"]);
function statusToneFor(state) {
    if (state === "warning")
        return "warning";
    if (state === "frozen")
        return "info";
    if (state === "disabled")
        return "neutral";
    return "success";
}
function maskedCardNumber(number) {
    const value = String(number ?? "").trim();
    if (!value)
        return "";
    const digits = value.replace(/\D/g, "");
    if (digits.length >= 4)
        return `**** ${digits.slice(-4)}`;
    if (/[*•]/.test(value))
        return value;
    return `**** ${value.slice(-4)}`;
}
export const CardSummary = forwardRef(function CardSummary({ label, meta, number, status, metrics, expires, variant = "physical", state = "default", density, icon = "", fullWidth = false, disabled = false, className = "", ...rest }, ref) {
    const resolvedVariant = normalizeFlowValue(variant, validVariants, "physical");
    const resolvedState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
    const resolvedDensity = normalizeFlowDensity(density);
    if (!label)
        return null;
    const statusLabel = status || (resolvedState === "frozen" ? "Frozen" : undefined);
    const displayNumber = maskedCardNumber(number);
    const resolvedIcon = icon || (resolvedVariant === "virtual" ? "smartphone" : resolvedState === "frozen" ? "ac_unit" : "contactless");
    const sourceMetrics = Array.isArray(metrics) ? metrics : [];
    const visibleMetrics = sourceMetrics.filter((metric) => metric?.key && metric?.label && metric?.value);
    return React.createElement("article", {
        ...flowRestProps(rest),
        ref,
        className: ["card-summary", className].filter(Boolean).join(" "),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        tabIndex: rest.tabIndex,
    }, React.createElement("header", null, React.createElement("strong", { className: "card-summary__brand" }, label), statusLabel ? React.createElement(Badge, {
        label: statusLabel,
        tone: statusToneFor(resolvedState),
        variant: "status",
        state: resolvedState === "disabled" ? "disabled" : "default",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
    }) : null), React.createElement("div", { className: "card-summary__tech" }, React.createElement("span", { className: "card-summary__chip", "aria-hidden": "true" }), React.createElement("span", { className: "card-summary__icon material-symbol", "aria-hidden": "true" }, resolvedIcon)), displayNumber
        ? React.createElement("p", { className: "card-summary__number-row" }, React.createElement("span", { className: "card-summary__number" }, displayNumber), expires ? React.createElement("span", { className: "card-summary__expires" }, expires) : null)
        : null, meta ? React.createElement("small", { className: "card-summary__holder" }, meta) : null, visibleMetrics.length && resolvedVariant === "limit"
        ? React.createElement("div", { className: "card-summary__metrics" }, visibleMetrics.map((metric) => React.createElement("span", { key: metric.key }, React.createElement("small", null, metric.label), React.createElement("strong", null, metric.value))))
        : null, resolvedState === "frozen" && statusLabel
        ? React.createElement("span", { className: "card-summary__frost", "aria-hidden": "true" }, React.createElement("span", { className: "card-summary__icon material-symbol" }, "ac_unit"), React.createElement("span", null, statusLabel))
        : null);
});
CardSummary.displayName = "CardSummary";
CardSummary.platformContract = cardSummaryPlatformContract;
