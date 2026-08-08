import React, { forwardRef } from "react";
import { spinnerPlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validTones = new Set(["accent", "ink", "success", "warning", "danger"]);
const validStates = new Set(["default", "loading", "decorative", "subtle", "disabled"]);


function normalizeTone(tone) {
  return validTones.has(tone) ? tone : "accent";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "loading";
}

export const Spinner = forwardRef(function Spinner({
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
});

Spinner.displayName = "Spinner";
Spinner.platformContract = spinnerPlatformContract;
