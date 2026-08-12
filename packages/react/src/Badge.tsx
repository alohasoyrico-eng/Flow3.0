import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { badgePlatformContract } from "@design-system/components/platforms";
import { flowToneProps, flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";
export type BadgeVariant = "count" | "dot" | "status" | "icon";
export type BadgeState = "default" | "hover" | "focus" | "overflow" | "hidden" | "disabled";
export type BadgeDensity = "sm" | "md" | "lg";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "hidden" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  state?: BadgeState;
  density?: BadgeDensity;
  hidden?: boolean;
  live?: boolean;
  icon?: string;
  ariaLabel?: string;
}

export interface BadgeComponent extends ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Badge";
  platformContract: typeof badgePlatformContract;
}

const validTones = new Set<BadgeTone>(["neutral", "info", "success", "warning", "danger", "accent"]);
const validVariants = new Set<BadgeVariant>(["count", "dot", "status", "icon"]);
const validStates = new Set<BadgeState>(["default", "hover", "focus", "overflow", "hidden", "disabled"]);

function normalizeTone(tone: BadgeTone | undefined): BadgeTone {
  return tone && validTones.has(tone) ? tone : "neutral";
}

function normalizeVariant(variant: BadgeVariant | undefined): BadgeVariant {
  return variant && validVariants.has(variant) ? variant : "status";
}

function normalizeState({ hidden = false, state = "default" }: { hidden?: boolean; state?: BadgeState } = {}): BadgeState {
  if (hidden) return "hidden";
  return state && validStates.has(state) ? state : "default";
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge({
  label,
  tone = "neutral",
  variant = "status",
  state = "default",
  density,
  hidden = false,
  live = false,
  icon = "",
  ariaLabel,
  className = "",
  ...rest
}, ref) {
  const resolvedTone = normalizeTone(tone);
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeState({ hidden, state });
  const text = resolvedVariant === "dot" ? "" : label;
  const accessibleLabel = ["dot", "count"].includes(resolvedVariant) ? ariaLabel : undefined;

  if (resolvedVariant === "dot" && !accessibleLabel) return null;
  if (resolvedVariant !== "dot" && !label) return null;
  const resolvedDensity = normalizeFlowDensity(density);

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["badge", className].filter(Boolean).join(" "),
      hidden: resolvedState === "hidden",
      role: live ? "status" : rest.role,
      "aria-live": live ? "polite" : rest["aria-live"],
      "aria-label": accessibleLabel,
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
      ...flowToneProps(resolvedTone),
      ...flowVariantProps(resolvedVariant),
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(resolvedState),
      "data-live": live ? "true" : undefined,
    },
    live ? React.createElement("span", { className: "badge__live", "aria-hidden": "true" }) : null,
    resolvedVariant === "icon" && icon
      ? React.createElement("span", { className: "badge__icon", "aria-hidden": "true" }, icon)
      : null,
    text ? React.createElement("span", { className: "badge__label" }, text) : null,
  );
}) as BadgeComponent;

Badge.displayName = "Badge";
Badge.platformContract = badgePlatformContract;
