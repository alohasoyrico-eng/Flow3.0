import React, { forwardRef } from "react";
import { routeSummaryPlatformContract } from "#flow/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

const validVariants = new Set(["standard", "compact", "compare", "policy"]);
const validStates = new Set(["default", "hover", "focus", "selected", "warning", "disabled"]);
const validTones = new Set(["neutral", "info", "warning"]);

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
      ariaLabel: action?.ariaLabel ?? action?.label ?? "Cancel route",
      variant: action?.variant ?? "ghost",
      density: action?.density ?? density,
      disabled: actionDisabled,
      onClick: handleActionClick,
    });
  }
  return React.createElement(Button, {
    key: actionKey,
    label: action?.label ?? "Action",
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
  const resolvedLabel = label ?? "Route";
  const isDisabled = resolvedState === "disabled";
  const isCompact = resolvedVariant === "compact";

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
        React.createElement("strong", null, resolvedLabel),
        description ? React.createElement("small", null, description) : null,
      ),
    ),
    metrics?.length
      ? React.createElement(
          "div",
          { className: "route-summary__metrics" },
          metrics.map((metric, index) => React.createElement(
            "span",
            { key: metric?.key ?? `${metric?.label ?? "metric"}-${index}` },
            React.createElement("small", null, metric?.label ?? ""),
            React.createElement("strong", null, metric?.value ?? ""),
          )),
        )
      : null,
    actions?.length
      ? React.createElement(
          "footer",
          null,
          actions.map((action, index) => renderAction(action, index, { compact: isCompact, density: resolvedDensity || undefined, disabled: isDisabled })),
        )
      : null,
  );
});

RouteSummary.displayName = "RouteSummary";
RouteSummary.platformContract = routeSummaryPlatformContract;
