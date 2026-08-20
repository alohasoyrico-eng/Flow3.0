import React, { forwardRef } from "react";
import { floatingActionButtonPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type FloatingActionButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type FloatingActionButtonIntent = "default" | "danger" | "warning";
export type FloatingActionButtonState = "default" | "hover" | "focus" | "pressed" | "loading" | "disabled";
export type FloatingActionButtonDensity = FlowDensity;
export type FloatingActionButtonType = "button" | "submit" | "reset";

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  icon?: string;
  variant?: FloatingActionButtonVariant;
  intent?: FloatingActionButtonIntent;
  state?: FloatingActionButtonState;
  density?: FloatingActionButtonDensity;
  extended?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: FloatingActionButtonType;
}

export interface FloatingActionButtonComponent extends ForwardRefExoticComponent<FloatingActionButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "FloatingActionButton";
  platformContract: typeof floatingActionButtonPlatformContract;
}

const validVariants = new Set<FloatingActionButtonVariant>(["primary", "secondary", "tertiary", "outlined", "ghost"]);
const validIntents = new Set<FloatingActionButtonIntent>(["default", "danger", "warning"]);
const validStates = new Set<FloatingActionButtonState>(["default", "hover", "focus", "pressed", "loading", "disabled"]);
const validTypes = new Set<FloatingActionButtonType>(["button", "submit", "reset"]);

export const FloatingActionButton = forwardRef<HTMLButtonElement, FloatingActionButtonProps>(function FloatingActionButton({
  label,
  icon = "add",
  variant = "primary",
  intent = "default",
  state = "default",
  density,
  extended = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "primary");
  const resolvedIntent = normalizeFlowValue(intent, validIntents, "default");
  const resolvedState = loading || state === "loading" ? "loading" : disabled || state === "disabled" ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedLabel = label;
  const resolvedType = validTypes.has(type) ? type : "button";
  const canInteract = Boolean(rest.onClick || resolvedType === "submit" || resolvedType === "reset");
  const isExtended = Boolean(extended);
  if (!resolvedLabel) return null;

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: resolvedType,
      className: ["fab", className].filter(Boolean).join(" "),
      disabled: resolvedState === "disabled" || resolvedState === "loading" || !canInteract,
      "aria-label": resolvedLabel,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      "data-intent": resolvedIntent,
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-extended": String(isExtended),
    },
    resolvedState === "loading"
      ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
      : React.createElement("span", { className: "fab__icon", "aria-hidden": "true" }, icon),
    isExtended && resolvedLabel ? React.createElement("span", { className: "fab__label" }, resolvedLabel) : null,
  );
}) as FloatingActionButtonComponent;

FloatingActionButton.displayName = "FloatingActionButton";
FloatingActionButton.platformContract = floatingActionButtonPlatformContract;
