import React, { forwardRef } from "react";
import { quickActionPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Spinner } from "./Spinner.js";

const validVariants = new Set(["standard", "destructive", "compact", "wide"]);
const validStates = new Set(["default", "hover", "focus", "pressed", "loading", "warning", "disabled"]);
const validDensities = new Set(["sm", "md", "lg"]);
const validTypes = new Set(["button", "submit", "reset"]);

function normalize(value, allowed, fallback) {
  return allowed.has(value) ? value : fallback;
}

export const QuickAction = forwardRef(function QuickAction({
  label,
  icon = "",
  badge = "",
  variant = "standard",
  state = "default",
  density = "md",
  loading = false,
  tone = "neutral",
  disabled = false,
  type = "button",
  onAction,
  className = "",
  ...rest
}, ref) {
  const resolvedLabel = label ?? "Action";
  const resolvedVariant = validVariants.has(variant) ? variant : tone === "danger" ? "destructive" : "standard";
  const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : normalize(state, validStates, "default");
  const resolvedDensity = normalize(density, validDensities, "md");
  const blocked = resolvedState === "disabled" || resolvedState === "loading";

  return React.createElement(
    "div",
    {
      className: ["quick-action", className].filter(Boolean).join(" "),
      "data-variant": resolvedVariant,
      "data-state": resolvedState,
      "data-density": resolvedDensity,
    },
    React.createElement(
      "button",
      {
        ...rest,
        ref,
        type: validTypes.has(type) ? type : "button",
        className: "quick-action__control",
        disabled: blocked,
        "aria-label": resolvedLabel,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        onClick: (event) => {
          if (blocked) return;
          onAction?.({ label: resolvedLabel, variant: resolvedVariant, state: resolvedState });
          rest.onClick?.(event);
        },
      },
      React.createElement(
        "span",
        { className: "quick-action__icon", "aria-hidden": "true" },
        resolvedState === "loading"
          ? React.createElement(Spinner, { label: `${resolvedLabel} loading`, density: "sm", decorative: true })
          : icon,
      ),
    ),
    React.createElement("span", { className: "quick-action__label" }, resolvedLabel),
    badge ? React.createElement(Badge, { label: badge, variant: "count" }) : null,
  );
});

QuickAction.displayName = "QuickAction";
QuickAction.platformContract = quickActionPlatformContract;
