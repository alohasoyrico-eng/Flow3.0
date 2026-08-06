import React, { forwardRef, useId } from "react";
import { motionBoundaryPlatformContract } from "#flow/platforms";

const validVariants = new Set(["fade", "slide", "collapse", "route"]);
const validStates = new Set(["idle", "entering", "active", "exiting", "reduced-motion", "disabled"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

function normalizeState(state, reducedMotion) {
  if (state === "disabled") return "disabled";
  if (reducedMotion || state === "reduced-motion") return "reduced-motion";
  return normalize(state, validStates, "active");
}

function stateLabel(state) {
  return {
    idle: "Idle",
    entering: "Entering",
    active: "Active",
    exiting: "Exiting",
    "reduced-motion": "Reduced motion",
    disabled: "Disabled",
  }[state] ?? "Active";
}

export const MotionBoundary = forwardRef(function MotionBoundary({
  label,
  description = "",
  variant = "fade",
  state = "active",
  icon = "transition_slide",
  reducedMotion = false,
  className = "",
  ...rest
}, ref) {
  const generatedId = useId();
  const id = `motion-boundary-${generatedId.replace(/:/g, "")}`;
  const resolvedVariant = normalize(variant, validVariants, "fade");
  const resolvedState = normalizeState(state, reducedMotion);
  const isReducedMotion = Boolean(reducedMotion || resolvedState === "reduced-motion");
  const resolvedLabel = label ?? "Panel transition";
  const resolvedDescription = description || "Controls the entrance, exit, and reduced-motion behavior of one bounded region.";

  return React.createElement(
    "div",
    {
      ...rest,
      ref,
      className: ["motion-boundary", className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-reduced-motion": String(isReducedMotion),
      role: "group",
      "aria-labelledby": `${id}-label`,
      "aria-describedby": `${id}-description ${id}-state`,
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    },
    React.createElement("span", { className: "motion-boundary__icon material-symbol", "aria-hidden": "true" }, icon),
    React.createElement(
      "div",
      { className: "motion-boundary__content" },
      React.createElement("strong", { id: `${id}-label` }, resolvedLabel),
      React.createElement("p", { id: `${id}-description` }, resolvedDescription),
      React.createElement("span", { className: "motion-boundary__state", id: `${id}-state` }, stateLabel(resolvedState)),
    ),
    React.createElement("span", { className: "motion-boundary__cue", "data-motion-cue": "", "aria-hidden": "true" }),
  );
});

MotionBoundary.displayName = "MotionBoundary";
MotionBoundary.platformContract = motionBoundaryPlatformContract;
