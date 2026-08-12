import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { spinnerPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type SpinnerDensity = "sm" | "md" | "lg";
export type SpinnerTone = "accent" | "ink" | "success" | "warning" | "danger";
export type SpinnerState = "default" | "loading" | "decorative" | "subtle" | "disabled";

export interface SpinnerProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label?: string;
  density?: SpinnerDensity;
  tone?: SpinnerTone;
  state?: SpinnerState;
  decorative?: boolean;
}

export interface SpinnerComponent extends ForwardRefExoticComponent<SpinnerProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Spinner";
  platformContract: typeof spinnerPlatformContract;
}

const validTones = new Set<SpinnerTone>(["accent", "ink", "success", "warning", "danger"]);
const validStates = new Set<SpinnerState>(["default", "loading", "decorative", "subtle", "disabled"]);

function normalizeTone(tone: SpinnerTone | undefined): SpinnerTone {
  return tone && validTones.has(tone) ? tone : "accent";
}

function normalizeState(state: SpinnerState | undefined): SpinnerState {
  return state && validStates.has(state) ? state : "loading";
}

export const Spinner = forwardRef<HTMLSpanElement, SpinnerProps>(function Spinner({
  label,
  density,
  tone = "accent",
  state = "loading",
  decorative = false,
  className = "",
  ...rest
}, ref) {
  const resolvedState = decorative ? "decorative" : normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  const isDecorative = decorative || resolvedState === "decorative" || !label;

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["spinner", className].filter(Boolean).join(" "),
      role: isDecorative ? undefined : "status",
      "aria-busy": isDecorative ? undefined : "true",
      "aria-hidden": isDecorative ? "true" : undefined,
      "aria-label": !isDecorative && label ? label : undefined,
      ...flowDensityProps(resolvedDensity),
      ...flowToneProps(normalizeTone(tone)),
      ...flowStateProps(resolvedState),
    },
    React.createElement(
      "svg",
      {
        className: "spinner__svg",
        viewBox: "0 0 40 40",
        focusable: "false",
        "aria-hidden": "true",
      },
      React.createElement("circle", { className: "spinner__track", cx: "20", cy: "20", r: "16", pathLength: "100" }),
      React.createElement("circle", { className: "spinner__arc", cx: "20", cy: "20", r: "16", pathLength: "100" }),
    ),
  );
}) as SpinnerComponent;

Spinner.displayName = "Spinner";
Spinner.platformContract = spinnerPlatformContract;
