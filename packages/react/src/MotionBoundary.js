import React, { forwardRef, useId } from "react";
import { motionBoundaryPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowVariantProps, normalizeFlowValue, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["fade", "slide", "collapse", "route"]);
const validStates = new Set(["idle", "entering", "active", "exiting", "reduced-motion", "disabled"]);

function normalizeState(state, reducedMotion) {
  if (state === "disabled") return "disabled";
  if (reducedMotion || state === "reduced-motion") return "reduced-motion";
  return normalizeFlowValue(state, validStates, "active");
}

export const MotionBoundary = forwardRef(function MotionBoundary({
  label,
  description = "",
  variant = "fade",
  state = "active",
  icon = "transition_slide",
  reducedMotion = false,
  stateLabel = "",
  className = "",
  ...rest
}, ref) {
  const generatedId = useId();
  const id = `motion-boundary-${generatedId.replace(/:/g, "")}`;
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "fade");
  const resolvedState = normalizeState(state, reducedMotion);
  const isReducedMotion = Boolean(reducedMotion || resolvedState === "reduced-motion");
  const resolvedLabel = label ?? "";
  const resolvedDescription = description || "";
  const resolvedStateLabel = stateLabel || "";
  const describedBy = [resolvedDescription ? `${id}-description` : "", resolvedStateLabel ? `${id}-state` : ""].filter(Boolean).join(" ") || undefined;

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["motion-boundary", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      "data-reduced-motion": String(isReducedMotion),
      role: "group",
      "aria-labelledby": resolvedLabel ? `${id}-label` : undefined,
      "aria-describedby": describedBy,
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
    },
    React.createElement("span", { className: "motion-boundary__icon material-symbol", "aria-hidden": "true" }, icon),
    React.createElement(
      "div",
      { className: "motion-boundary__content" },
      resolvedLabel ? React.createElement("strong", { id: `${id}-label` }, resolvedLabel) : null,
      resolvedDescription ? React.createElement("p", { id: `${id}-description` }, resolvedDescription) : null,
      resolvedStateLabel ? React.createElement("span", { className: "motion-boundary__state", id: `${id}-state`, hidden: true }, resolvedStateLabel) : null,
    ),
    React.createElement("span", { className: "motion-boundary__cue", "data-motion-cue": "", "aria-hidden": "true" }),
  );
});

MotionBoundary.displayName = "MotionBoundary";
MotionBoundary.platformContract = motionBoundaryPlatformContract;
