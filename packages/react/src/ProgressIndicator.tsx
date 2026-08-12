import React, { forwardRef, useId } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { progressIndicatorPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type ProgressIndicatorDensity = "sm" | "md" | "lg";
export type ProgressIndicatorTone = "accent" | "success" | "warning" | "danger" | "ink";
export type ProgressIndicatorState = "default" | "active" | "indeterminate" | "paused" | "complete" | "error" | "disabled";

export interface ProgressIndicatorProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  ariaValueText?: string;
  value?: number;
  max?: number;
  indeterminate?: boolean;
  showValue?: boolean;
  tone?: ProgressIndicatorTone;
  state?: ProgressIndicatorState;
  density?: ProgressIndicatorDensity;
  fullWidth?: boolean;
}

export interface ProgressIndicatorComponent extends ForwardRefExoticComponent<ProgressIndicatorProps & RefAttributes<HTMLDivElement>> {
  displayName: "ProgressIndicator";
  platformContract: typeof progressIndicatorPlatformContract;
}

const validTones = new Set<ProgressIndicatorTone>(["accent", "success", "warning", "danger", "ink"]);
const terminalStates = new Set<ProgressIndicatorState>(["paused", "complete", "error", "disabled"]);
const validStates = new Set<ProgressIndicatorState>(["default", "active", "indeterminate", "paused", "complete", "error", "disabled"]);

function normalizeTone(tone: ProgressIndicatorTone | undefined): ProgressIndicatorTone {
  return tone && validTones.has(tone) ? tone : "accent";
}

function normalizeState(state: ProgressIndicatorState | undefined): ProgressIndicatorState {
  return state && validStates.has(state) ? state : "active";
}

function progressMeta({ value = 0, max = 100, state = "active", indeterminate = false }: { value?: number; max?: number; state?: ProgressIndicatorState; indeterminate?: boolean } = {}) {
  const numericMax = Number(max) > 0 ? Number(max) : 100;
  const numericValue = state === "complete" ? numericMax : Math.max(0, Math.min(numericMax, Number(value) || 0));
  const percent = Math.max(0, Math.min(100, (numericValue / numericMax) * 100));
  const resolvedState = normalizeState(state);
  const isIndeterminate = !terminalStates.has(resolvedState) && (Boolean(indeterminate) || resolvedState === "indeterminate");
  return { numericMax, numericValue, percent, resolvedState, isIndeterminate };
}

export const ProgressIndicator = forwardRef<HTMLDivElement, ProgressIndicatorProps>(function ProgressIndicator({
  label,
  ariaValueText,
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
  const resolvedDensity = normalizeFlowDensity(density);
  const isBusy = !terminalStates.has(resolvedState) && (isIndeterminate || numericValue < numericMax);
  if (!label) return null;

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
      "aria-valuetext": ariaValueText,
      "aria-busy": isBusy ? "true" : undefined,
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
      ...flowToneProps(normalizeTone(tone)),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "data-indeterminate": String(Boolean(isIndeterminate)),
    },
    React.createElement(
      "span",
      { className: "progress__meta" },
      React.createElement("span", { className: "progress__label", id: labelId }, label),
      showValue && !isIndeterminate
        ? React.createElement("span", { className: "progress__value" }, `${Math.round(percent)}%`)
        : null,
    ),
    React.createElement(
      "span",
      { className: "progress__track" },
      React.createElement("progress", {
        className: "progress__meter",
        max: numericMax,
        value: isIndeterminate ? undefined : numericValue,
        tabIndex: -1,
        "aria-hidden": "true",
      }),
    ),
  );
}) as ProgressIndicatorComponent;

ProgressIndicator.displayName = "ProgressIndicator";
ProgressIndicator.platformContract = progressIndicatorPlatformContract;
