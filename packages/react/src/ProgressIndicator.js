import React, { forwardRef, useId } from "react";
import { progressIndicatorPlatformContract } from "@design-system/components/platforms";
import { flowDensityProps, flowRestProps } from "./internal/props.js";

const validDensities = new Set(["sm", "md", "lg"]);
const validTones = new Set(["accent", "success", "warning", "danger", "ink"]);
const terminalStates = new Set(["paused", "complete", "error", "disabled"]);
const validStates = new Set(["default", "active", "indeterminate", "paused", "complete", "error", "disabled"]);

function normalizeDensity(density) {
  return validDensities.has(density) ? density : undefined;
}

function normalizeTone(tone) {
  return validTones.has(tone) ? tone : "accent";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "active";
}

function progressMeta({ value = 0, max = 100, state = "active", indeterminate = false } = {}) {
  const numericMax = Number(max) > 0 ? Number(max) : 100;
  const numericValue = state === "complete" ? numericMax : Math.max(0, Math.min(numericMax, Number(value) || 0));
  const percent = Math.max(0, Math.min(100, (numericValue / numericMax) * 100));
  const resolvedState = normalizeState(state);
  const isIndeterminate = !terminalStates.has(resolvedState) && (Boolean(indeterminate) || resolvedState === "indeterminate");
  return { numericMax, numericValue, percent, resolvedState, isIndeterminate };
}

function valueText({ resolvedState, percent, isIndeterminate }) {
  if (isIndeterminate) return "In progress";
  if (resolvedState === "paused") return `Paused at ${Math.round(percent)}%`;
  if (resolvedState === "complete") return "Complete";
  if (resolvedState === "error") return `Error at ${Math.round(percent)}%`;
  if (resolvedState === "disabled") return "Unavailable";
  return undefined;
}

export const ProgressIndicator = forwardRef(function ProgressIndicator({
  label,
  value = 0,
  max = 100,
  indeterminate = false,
  showValue = false,
  tone = "accent",
  state = "active",
  density,
  fullWidth = false,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const labelId = id ? `${id}-label` : `progress-label-${generatedId}`;
  const { numericMax, numericValue, percent, resolvedState, isIndeterminate } = progressMeta({ value, max, state, indeterminate });

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      id,
      className: ["progress", className].filter(Boolean).join(" "),
      role: "progressbar",
      "aria-labelledby": labelId,
      "aria-valuemin": "0",
      "aria-valuemax": isIndeterminate ? undefined : String(numericMax),
      "aria-valuenow": isIndeterminate ? undefined : String(numericValue),
      "aria-valuetext": valueText({ resolvedState, percent, isIndeterminate }),
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
      "data-tone": normalizeTone(tone),
      "data-state": resolvedState,
      ...flowDensityProps(normalizeDensity(density)),
      "data-full-width": String(Boolean(fullWidth)),
      "data-indeterminate": String(Boolean(isIndeterminate)),
    },
    React.createElement(
      "span",
      { className: "progress__meta" },
      React.createElement("span", { className: "progress__label", id: labelId }, label ?? "Progress"),
      showValue && !isIndeterminate
        ? React.createElement("span", { className: "progress__value" }, `${Math.round(percent)}%`)
        : null,
    ),
    React.createElement(
      "span",
      { className: "progress__track" },
      React.createElement("span", { className: "progress__fill", style: { "--progress-value": `${percent}%` } }),
    ),
  );
});

ProgressIndicator.displayName = "ProgressIndicator";
ProgressIndicator.platformContract = progressIndicatorPlatformContract;
