import React, { forwardRef } from "react";
import { quickActionPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps, flowDataProps } from "./internal/props.js";

import type { ButtonHTMLAttributes, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type QuickActionVariant = "standard" | "compact" | "wide";
export type QuickActionState = "default" | "hover" | "focus" | "pressed" | "loading" | "warning" | "disabled";
export type QuickActionDensity = FlowDensity;
export type QuickActionTone = "neutral" | "danger";
export type QuickActionIntent = "default" | "danger" | "warning";
export type QuickActionType = "button" | "submit" | "reset";

export interface QuickActionMeta {
  label: string;
  variant: QuickActionVariant;
  intent: QuickActionIntent;
  state: QuickActionState;
}

export interface QuickActionProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  icon?: string;
  badge?: string;
  variant?: QuickActionVariant;
  state?: QuickActionState;
  intent?: QuickActionIntent;
  density?: QuickActionDensity;
  loading?: boolean;
  disabled?: boolean;
  tone?: QuickActionTone;
  type?: QuickActionType;
  onAction?: (meta: QuickActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface QuickActionComponent extends ForwardRefExoticComponent<QuickActionProps & RefAttributes<HTMLButtonElement>> {
  displayName: "QuickAction";
  platformContract: typeof quickActionPlatformContract;
}

const validVariants = new Set<QuickActionVariant>(["standard", "compact", "wide"]);
const validStates = new Set<QuickActionState>(["default", "hover", "focus", "pressed", "loading", "warning", "disabled"]);
const validIntents = new Set<QuickActionIntent>(["default", "danger", "warning"]);
const validTypes = new Set<QuickActionType>(["button", "submit", "reset"]);

export const QuickAction = forwardRef<HTMLButtonElement, QuickActionProps>(function QuickAction({
  label,
  icon = "",
  badge = "",
  variant,
  state = "default",
  intent,
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
  const resolvedVariant: QuickActionVariant = variant && validVariants.has(variant) ? variant : "standard";
  const resolvedIntent: QuickActionIntent = intent && validIntents.has(intent) ? intent : tone === "danger" ? "danger" : state === "warning" ? "warning" : "default";
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
      ...flowDataProps(rest),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-intent": resolvedIntent,
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
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          if (blocked) return;
          rest.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.({ label: resolvedLabel, variant: resolvedVariant, intent: resolvedIntent, state: resolvedState }, event);
        },
      },
      React.createElement(
        "span",
        { className: "quick-action__icon", "aria-hidden": "true" },
        resolvedState === "loading"
          ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
          : icon,
      ),
    ),
    resolvedLabel ? React.createElement("span", { className: "quick-action__label" }, resolvedLabel) : null,
    badge ? React.createElement(Badge, { label: badge, variant: "count", ...(resolvedDensity ? { density: resolvedDensity } : {}) }) : null,
  );
}) as QuickActionComponent;

QuickAction.displayName = "QuickAction";
QuickAction.platformContract = quickActionPlatformContract;
