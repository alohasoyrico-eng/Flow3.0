import React, { forwardRef } from "react";
import { quickActionPlatformContract } from "#flow/platforms";
import { Badge } from "./Badge.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "destructive", "compact", "wide"]);
const validStates = new Set(["default", "hover", "focus", "pressed", "loading", "warning", "disabled"]);
const validTypes = new Set(["button", "submit", "reset"]);

export const QuickAction = forwardRef(function QuickAction({
  label,
  icon = "",
  badge = "",
  variant,
  state = "default",
  density,
  loading = false,
  tone = "neutral",
  disabled = false,
  type = "button",
  onAction,
  className = "",
  ...rest
}, ref) {
  const resolvedLabel = label;
  const resolvedVariant = validVariants.has(variant) ? variant : tone === "danger" ? "destructive" : "standard";
  const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedType = validTypes.has(type) ? type : "button";
  const canInteract = Boolean(onAction || rest.onClick || resolvedType === "submit" || resolvedType === "reset");
  const blocked = resolvedState === "disabled" || resolvedState === "loading" || !canInteract;
  if (!resolvedLabel) return null;

  return React.createElement(
    "div",
    {
      className: ["quick-action", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
    },
    React.createElement(
      "button",
      {
        ...flowRestProps(rest),
        ref,
        type: resolvedType,
        className: "quick-action__control",
        disabled: blocked,
        "aria-label": resolvedLabel,
        "aria-busy": resolvedState === "loading" ? "true" : undefined,
        onClick: (event) => {
          if (blocked) return;
          rest.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.({ label: resolvedLabel, variant: resolvedVariant, state: resolvedState });
        },
      },
      React.createElement(
        "span",
        { className: "quick-action__icon", "aria-hidden": "true" },
        resolvedState === "loading"
          ? React.createElement(Spinner, { density: resolvedDensity || undefined, decorative: true })
          : icon,
      ),
    ),
    resolvedLabel ? React.createElement("span", { className: "quick-action__label" }, resolvedLabel) : null,
    badge ? React.createElement(Badge, { label: badge, variant: "count", density: resolvedDensity || undefined }) : null,
  );
});

QuickAction.displayName = "QuickAction";
QuickAction.platformContract = quickActionPlatformContract;
