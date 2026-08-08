import React, { forwardRef, useMemo } from "react";
import { stepperPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const allowedOrientations = new Set(["horizontal", "vertical"]);

function hasStableStepId(step) {
  return step?.id !== undefined && step?.id !== null && step?.id !== "";
}

function normalizeSteps(steps) {
  const sourceSteps = Array.isArray(steps) ? steps : [];
  return sourceSteps.filter((step) => step?.label && hasStableStepId(step)).map((step) => ({
    ...step,
    id: String(step.id),
    label: step.label,
    description: step?.description,
  }));
}

export const Stepper = forwardRef(function Stepper({
  steps,
  current = 0,
  label,
  orientation = "horizontal",
  density,
  className = "",
  ...rest
}, ref) {
  const resolvedOrientation = allowedOrientations.has(orientation) ? orientation : "horizontal";
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedSteps = useMemo(() => normalizeSteps(steps), [steps]);
  const currentIndex = Math.max(0, Math.min(Number(current) || 0, resolvedSteps.length - 1));
  if (!label) return null;
  if (!resolvedSteps.length) return null;

  return React.createElement(
    "ol",
    {
      ...flowRestProps(rest),
      ref,
      className: ["stepper", className].filter(Boolean).join(" "),
      "aria-label": label,
      "data-orientation": resolvedOrientation,
      ...flowDensityProps(resolvedDensity),
      "data-current": String(currentIndex),
    },
    resolvedSteps.flatMap((step, index) => {
      const stepState = index < currentIndex ? "complete" : index === currentIndex ? "active" : "pending";
      const item = React.createElement(
        "li",
        {
          key: `step-${step.id}`,
          className: "stepper__item",
          ...flowStateProps(stepState),
          "aria-current": index === currentIndex ? "step" : undefined,
        },
        React.createElement(
          "span",
          { className: "stepper__marker", "aria-hidden": "true" },
          stepState === "complete" ? "check" : String(index + 1),
        ),
        React.createElement(
          "span",
          { className: "stepper__text" },
          React.createElement("strong", null, step.label),
          step.description ? React.createElement("small", null, step.description) : null,
        ),
      );
      if (index >= resolvedSteps.length - 1) return [item];
      return [
        item,
        React.createElement("span", {
          key: `connector-${step.id}`,
          className: "stepper__connector",
          ...flowStateProps(index < currentIndex ? "complete" : "pending"),
          "aria-hidden": "true",
        }),
      ];
    }),
  );
});

Stepper.displayName = "Stepper";
Stepper.platformContract = stepperPlatformContract;
