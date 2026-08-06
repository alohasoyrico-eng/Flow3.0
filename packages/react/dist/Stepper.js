import React, { forwardRef, useMemo } from "react";
import { stepperPlatformContract } from "#flow/platforms";

const allowedOrientations = new Set(["horizontal", "vertical"]);
const allowedDensities = new Set(["sm", "md", "lg"]);

function normalizeSteps(steps) {
  const sourceSteps = Array.isArray(steps) && steps.length ? steps : [{ label: "Step 1" }];
  return sourceSteps.map((step, index) => ({
    ...step,
    label: step?.label ?? `Step ${index + 1}`,
    description: step?.description ?? "",
  }));
}

export const Stepper = forwardRef(function Stepper({
  steps = [],
  current = 0,
  label = "Progress",
  orientation = "horizontal",
  density,
  className = "",
  ...rest
}, ref) {
  const resolvedOrientation = allowedOrientations.has(orientation) ? orientation : "horizontal";
  const resolvedDensity = allowedDensities.has(density) ? density : "md";
  const resolvedSteps = useMemo(() => normalizeSteps(steps), [steps]);
  const currentIndex = Math.max(0, Math.min(Number(current) || 0, resolvedSteps.length - 1));

  return React.createElement(
    "ol",
    {
      ...rest,
      ref,
      className: ["stepper", className].filter(Boolean).join(" "),
      "aria-label": label,
      "data-orientation": resolvedOrientation,
      "data-density": resolvedDensity,
      "data-current": String(currentIndex),
    },
    resolvedSteps.flatMap((step, index) => {
      const stepState = index < currentIndex ? "complete" : index === currentIndex ? "active" : "pending";
      const item = React.createElement(
        "li",
        {
          key: `step-${step.id ?? step.label ?? index}`,
          className: "stepper__item",
          "data-state": stepState,
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
          key: `connector-${step.id ?? step.label ?? index}`,
          className: "stepper__connector",
          "data-state": index < currentIndex ? "complete" : "pending",
          "aria-hidden": "true",
        }),
      ];
    }),
  );
});

Stepper.displayName = "Stepper";
Stepper.platformContract = stepperPlatformContract;
