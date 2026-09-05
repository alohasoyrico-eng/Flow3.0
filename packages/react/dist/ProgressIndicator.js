import React, { forwardRef, useId } from "react";
import { progressIndicatorPlatformContract } from "#flow/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
const validTones = new Set(["accent", "success", "warning", "danger", "ink"]);
const validVariants = new Set(["linear", "circular"]);
const terminalStates = new Set(["paused", "complete", "error", "disabled"]);
const validStates = new Set(["default", "active", "indeterminate", "paused", "complete", "error", "disabled"]);
function normalizeTone(tone) {
    return tone && validTones.has(tone) ? tone : "accent";
}
function normalizeVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "linear";
}
function normalizeState(state) {
    return state && validStates.has(state) ? state : "active";
}
function progressMeta({ value = 0, max = 100, state = "active", indeterminate = false } = {}) {
    const numericMax = Number(max) > 0 ? Number(max) : 100;
    const numericValue = state === "complete" ? numericMax : Math.max(0, Math.min(numericMax, Number(value) || 0));
    const percent = Math.max(0, Math.min(100, (numericValue / numericMax) * 100));
    const resolvedState = normalizeState(state);
    const isIndeterminate = !terminalStates.has(resolvedState) && (Boolean(indeterminate) || resolvedState === "indeterminate");
    return { numericMax, numericValue, percent, resolvedState, isIndeterminate };
}
export const ProgressIndicator = forwardRef(function ProgressIndicator({ label, ariaValueText, value = 0, max = 100, variant = "linear", indeterminate = false, showValue = false, tone = "accent", state = "active", density, fullWidth = false, className = "", id, ...rest }, ref) {
    const generatedId = useId();
    const labelId = id ? `${id}-label` : `progress-label-${generatedId}`;
    const { numericMax, numericValue, percent, resolvedState, isIndeterminate } = progressMeta({ value, max, state, indeterminate });
    const resolvedVariant = isIndeterminate ? "linear" : normalizeVariant(variant);
    const resolvedDensity = normalizeFlowDensity(density);
    const isBusy = !terminalStates.has(resolvedState) && (isIndeterminate || numericValue < numericMax);
    const circleRadius = 24;
    const circleCircumference = 2 * Math.PI * circleRadius;
    const circleOffset = circleCircumference * (1 - percent / 100);
    if (!label)
        return null;
    return React.createElement("div", {
        ...flowRestProps(rest),
        ref,
        id,
        className: ["progress", className].filter(Boolean).join(" "),
        "aria-busy": isBusy ? "true" : undefined,
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        ...flowToneProps(normalizeTone(tone)),
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-full-width": String(Boolean(fullWidth)),
        "data-indeterminate": String(Boolean(isIndeterminate)),
    }, React.createElement("span", { className: "progress__meta" }, React.createElement("span", { className: "progress__label", id: labelId }, label), showValue && !isIndeterminate && resolvedVariant === "linear"
        ? React.createElement("span", { className: "progress__value" }, `${Math.round(percent)}%`)
        : null), resolvedVariant === "circular"
        ? React.createElement("span", {
            className: "progress__ring",
            role: "progressbar",
            "aria-labelledby": labelId,
            "aria-valuemin": 0,
            "aria-valuemax": numericMax,
            "aria-valuenow": numericValue,
            "aria-valuetext": ariaValueText,
            "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        }, React.createElement("svg", { className: "progress__ring-svg", viewBox: "0 0 56 56", focusable: "false", "aria-hidden": "true" }, React.createElement("circle", { className: "progress__ring-track", cx: 28, cy: 28, r: circleRadius }), React.createElement("circle", {
            className: "progress__ring-meter",
            cx: 28,
            cy: 28,
            r: circleRadius,
            strokeDasharray: circleCircumference,
            strokeDashoffset: circleOffset,
        })), showValue ? React.createElement("span", { className: "progress__ring-value" }, `${Math.round(percent)}%`) : null)
        : React.createElement("span", { className: "progress__track" }, React.createElement("progress", {
            className: "progress__meter",
            max: numericMax,
            value: isIndeterminate ? undefined : numericValue,
            "aria-labelledby": labelId,
            "aria-valuemin": isIndeterminate ? undefined : 0,
            "aria-valuemax": isIndeterminate ? undefined : numericMax,
            "aria-valuenow": isIndeterminate ? undefined : numericValue,
            "aria-valuetext": ariaValueText,
            "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        })));
});
ProgressIndicator.displayName = "ProgressIndicator";
ProgressIndicator.platformContract = progressIndicatorPlatformContract;
