import React, { forwardRef } from "react";
import { routeSummaryPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "compact", "compare", "policy"]);
const validStates = new Set(["default", "hover", "focus", "selected", "warning", "disabled"]);
const validTones = new Set(["neutral", "info", "warning"]);

function isValidRouteAction(action, compact) {
  if (!action) return false;
  return compact ? Boolean(action.label || action.ariaLabel) : Boolean(action.label);
}

function renderAction(action, index, { compact, density, disabled }) {
  const actionDisabled = Boolean(disabled || action?.disabled);
  const actionKey = action?.key ?? action?.label ?? `action-${index}`;
  const handleActionClick = (event) => {
    event.stopPropagation();
    action?.onClick?.(event);
    action?.onAction?.(String(actionKey), action, event);
  };
  if (compact) {
    return React.createElement(IconButton, {
      key: actionKey,
      icon: action?.icon ?? "close",
      ariaLabel: action?.ariaLabel ?? action?.label ?? "",
      variant: action?.variant ?? "ghost",
      density: action?.density ?? density,
      disabled: actionDisabled,
      onClick: handleActionClick,
    });
  }
  if (!action?.label) return null;
  return React.createElement(Button, {
    key: actionKey,
    label: action.label,
    icon: action?.icon,
    trailingIcon: action?.trailingIcon,
    variant: action?.variant ?? (index === 0 ? "primary" : "secondary"),
    intent: action?.intent ?? "default",
    density: action?.density ?? density,
    disabled: actionDisabled,
    loading: Boolean(action?.loading),
    onClick: handleActionClick,
  });
}

export const RouteSummary = forwardRef(function RouteSummary({
  label,
  description = "",
  metrics = [],
  actions = [],
  variant = "standard",
  state = "default",
  density,
  tone = "neutral",
  icon = "navigation",
  selected = false,
  disabled = false,
  fullWidth = false,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "standard");
  const resolvedState = disabled ? "disabled" : selected ? "selected" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedTone = normalizeFlowValue(tone, validTones, resolvedState === "warning" || resolvedVariant === "policy" ? "warning" : "neutral");
  const resolvedLabel = label ?? "";
  const isDisabled = resolvedState === "disabled";
  const isCompact = resolvedVariant === "compact";
  const visibleMetrics = metrics.filter((metric) => metric?.label && metric?.value);
  const visibleActions = Array.isArray(actions) ? actions.filter((action) => isValidRouteAction(action, isCompact)) : [];

  return React.createElement(
    "article",
    {
      ...flowRestProps(rest),
      ref,
      className: ["route-summary", className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      ...flowToneProps(resolvedTone),
      "data-full-width": String(Boolean(fullWidth)),
      "aria-selected": resolvedState === "selected" ? "true" : undefined,
      "aria-disabled": isDisabled ? "true" : undefined,
      tabIndex: resolvedState === "focus" ? 0 : rest.tabIndex,
    },
    React.createElement(
      "header",
      null,
      icon
        ? React.createElement("span", { className: "route-summary__icon material-symbol", "aria-hidden": "true" }, icon)
        : null,
      React.createElement(
        "div",
        { className: "route-summary__label" },
        resolvedLabel ? React.createElement("strong", null, resolvedLabel) : null,
        description ? React.createElement("small", null, description) : null,
      ),
    ),
    visibleMetrics.length
      ? React.createElement(
          "div",
          { className: "route-summary__metrics" },
          visibleMetrics.map((metric, index) => React.createElement(
            "span",
            { key: metric.key ?? `${metric.label}-${index}` },
            React.createElement("small", null, metric.label),
            React.createElement("strong", null, metric.value),
          )),
        )
      : null,
    visibleActions.length
      ? React.createElement(
          "footer",
          null,
          visibleActions.map((action, index) => renderAction(action, index, { compact: isCompact, density: resolvedDensity || undefined, disabled: isDisabled })),
        )
      : null,
  );
});

RouteSummary.displayName = "RouteSummary";
RouteSummary.platformContract = routeSummaryPlatformContract;
