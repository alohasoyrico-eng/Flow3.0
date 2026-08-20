import React, { forwardRef } from "react";
import { routeSummaryPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { flowToneProps, flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import type { ButtonIntent, ButtonVariant } from "./Button.js";
import type { IconButtonVariant } from "./IconButton.js";

export type RouteSummaryVariant = "standard" | "compact" | "compare" | "policy";
export type RouteSummaryState = "default" | "hover" | "focus" | "selected" | "warning" | "disabled";
export type RouteSummaryDensity = FlowDensity;
export type RouteSummaryTone = "neutral" | "info" | "warning";

export interface RouteMetric {
  key?: string;
  label: string;
  value: string;
}

export interface RouteSummaryAction {
  key?: string;
  label?: string;
  icon?: string;
  trailingIcon?: string;
  variant?: ButtonVariant | IconButtonVariant;
  intent?: ButtonIntent;
  density?: RouteSummaryDensity;
  disabled?: boolean;
  loading?: boolean;
  onAction?: (key: string, action: RouteSummaryAction, event: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface RouteSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  metrics?: RouteMetric[];
  actions?: RouteSummaryAction[];
  variant?: RouteSummaryVariant;
  state?: RouteSummaryState;
  density?: RouteSummaryDensity;
  tone?: RouteSummaryTone;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface RouteSummaryComponent extends ForwardRefExoticComponent<RouteSummaryProps & RefAttributes<HTMLElement>> {
  displayName: "RouteSummary";
  platformContract: typeof routeSummaryPlatformContract;
}

const validVariants = new Set<RouteSummaryVariant>(["standard", "compact", "compare", "policy"]);
const validStates = new Set<RouteSummaryState>(["default", "hover", "focus", "selected", "warning", "disabled"]);
const validTones = new Set<RouteSummaryTone>(["neutral", "info", "warning"]);
const validButtonVariants = new Set<ButtonVariant>(["primary", "secondary", "tertiary", "outlined", "ghost"]);
const validIconButtonVariants = new Set<IconButtonVariant>(["primary", "secondary", "tertiary", "outlined", "ghost"]);

function isValidRouteAction(action: RouteSummaryAction | undefined, compact: boolean): action is RouteSummaryAction & { key: string; label: string } {
  if (!action) return false;
  const hasStableKey = action.key !== undefined && action.key !== null && action.key !== "";
  return hasStableKey && Boolean(action.label);
}

function renderAction(
  action: RouteSummaryAction & { key: string; label: string },
  index: number,
  { compact, inheritedDensity, disabled }: { compact: boolean; inheritedDensity?: RouteSummaryDensity; disabled: boolean },
) {
  const actionDisabled = Boolean(disabled || action?.disabled);
  const actionKey = action?.key;
  const handleActionClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    action?.onClick?.(event);
    if (event.defaultPrevented) return;
    action?.onAction?.(String(actionKey), action, event);
  };
  const actionDensity = action?.density ?? inheritedDensity;
  const resolvedIconButtonVariant: IconButtonVariant = action?.variant && validIconButtonVariants.has(action.variant as IconButtonVariant) ? action.variant as IconButtonVariant : "ghost";
  const resolvedButtonVariant: ButtonVariant = action?.variant && validButtonVariants.has(action.variant as ButtonVariant) ? action.variant as ButtonVariant : index === 0 ? "primary" : "secondary";
  if (compact) {
    return React.createElement(IconButton, {
      key: actionKey,
      icon: action?.icon ?? "close",
      label: action.label,
      variant: resolvedIconButtonVariant,
      ...(actionDensity ? { density: actionDensity } : {}),
      disabled: actionDisabled,
      onClick: handleActionClick,
    });
  }
  if (!action?.label) return null;
  return React.createElement(Button, {
    key: actionKey,
    label: action.label,
    ...(action?.icon ? { icon: action.icon } : {}),
    ...(action?.trailingIcon ? { trailingIcon: action.trailingIcon } : {}),
    variant: resolvedButtonVariant,
    intent: action?.intent ?? "default",
    ...(actionDensity ? { density: actionDensity } : {}),
    disabled: actionDisabled,
    loading: Boolean(action?.loading),
    onClick: handleActionClick,
  });
}

export const RouteSummary = forwardRef<HTMLElement, RouteSummaryProps>(function RouteSummary({
  label,
  description,
  metrics,
  actions,
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
  if (!label) return null;
  const isDisabled = resolvedState === "disabled";
  const isCompact = resolvedVariant === "compact";
  const sourceMetrics = Array.isArray(metrics) ? metrics : [];
  const sourceActions = Array.isArray(actions) ? actions : [];
  const visibleMetrics = sourceMetrics.filter((metric) => metric?.key && metric?.label && metric?.value);
  const visibleActions = sourceActions.filter((action) => isValidRouteAction(action, isCompact));

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
      tabIndex: rest.tabIndex,
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
        React.createElement("strong", null, label),
        description ? React.createElement("small", null, description) : null,
      ),
    ),
    visibleMetrics.length
      ? React.createElement(
          "div",
          { className: "route-summary__metrics" },
          visibleMetrics.map((metric) => React.createElement(
            "span",
            { key: metric.key },
            React.createElement("small", null, metric.label),
            React.createElement("strong", null, metric.value),
          )),
        )
      : null,
    visibleActions.length
      ? React.createElement(
          "footer",
          null,
          visibleActions.map((action, index) => renderAction(action, index, { compact: isCompact, ...(resolvedDensity ? { inheritedDensity: resolvedDensity } : {}), disabled: isDisabled })),
        )
      : null,
  );
}) as RouteSummaryComponent;

RouteSummary.displayName = "RouteSummary";
RouteSummary.platformContract = routeSummaryPlatformContract;
