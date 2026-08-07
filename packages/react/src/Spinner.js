import React, { forwardRef } from "react";
import { spinnerPlatformContract } from "@design-system/components/platforms";
import { flowRestProps } from "./internal/props.js";

const validDensities = new Set(["sm", "md", "lg"]);
const validTones = new Set(["accent", "ink", "success", "warning", "danger"]);
const validStates = new Set(["default", "loading", "decorative", "subtle", "disabled"]);

function normalizeDensity(density) {
  return validDensities.has(density) ? density : undefined;
}

function normalizeTone(tone) {
  return validTones.has(tone) ? tone : "accent";
}

function normalizeState(state) {
  return validStates.has(state) ? state : "loading";
}

export const Spinner = forwardRef(function Spinner({
  label = "Loading",
  density,
  tone = "accent",
  state = "loading",
  decorative = false,
  className = "",
  ...rest
}, ref) {
  const resolvedState = decorative ? "decorative" : normalizeState(state);
  const isDecorative = decorative || resolvedState === "decorative";

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["spinner", className].filter(Boolean).join(" "),
      role: isDecorative ? undefined : "status",
      "aria-hidden": isDecorative ? "true" : undefined,
      "aria-label": isDecorative ? undefined : label,
      "data-density": normalizeDensity(density),
      "data-tone": normalizeTone(tone),
      "data-state": resolvedState,
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
