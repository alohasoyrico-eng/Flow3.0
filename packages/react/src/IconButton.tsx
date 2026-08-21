import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { iconButtonPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type IconButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type IconButtonIntent = "default" | "danger" | "warning";
export type IconButtonDensity = "sm" | "md" | "lg";
export type IconButtonState = "default" | "hover" | "focus" | "pressed" | "selected" | "badged" | "disabled" | "loading";
export type IconButtonType = "button" | "submit" | "reset";

export type IconButtonAccessibleName =
  | { ariaLabel: string; label?: string }
  | { ariaLabel?: string; label: string };

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "type" | "children" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> & FlowDataAttributes & IconButtonAccessibleName & {
  icon: string;
  variant?: IconButtonVariant;
  intent?: IconButtonIntent;
  density?: IconButtonDensity;
  state?: IconButtonState;
  selected?: boolean;
  badge?: boolean;
  loading?: boolean;
  disabled?: boolean;
  type?: IconButtonType;
};

export interface IconButtonComponent extends ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "IconButton";
  platformContract: typeof iconButtonPlatformContract;
}

const allowedTypes = new Set<IconButtonType>(["button", "submit", "reset"]);
const allowedVariants = new Set<IconButtonVariant>(["primary", "secondary", "tertiary", "outlined", "ghost"]);
const allowedIntents = new Set<IconButtonIntent>(["default", "danger", "warning"]);
const allowedStates = new Set<IconButtonState>(["default", "hover", "focus", "pressed", "selected", "badged", "disabled", "loading"]);

function iconButtonClassName({ variant = "ghost", className = "" }: { variant?: IconButtonVariant; className?: string } = {}) {
  return ["icon-button", `icon-button--${variant}`, className].filter(Boolean).join(" ");
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton({
  ariaLabel,
  label,
  icon = "more_horiz",
  variant = "ghost",
  intent = "default",
  density,
  state = "default",
  selected = false,
  badge = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  ...rest
}, ref) {
  const resolvedLabel = ariaLabel ?? label;
  if (!resolvedLabel) return null;
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedVariant = normalizeFlowValue(variant, allowedVariants, "ghost");
  const resolvedIntent = normalizeFlowValue(intent, allowedIntents, "default");
  const normalizedState = normalizeFlowValue(state, allowedStates, "default");
  const resolvedState = loading || normalizedState === "loading"
    ? "loading"
    : disabled || normalizedState === "disabled"
      ? "disabled"
      : selected
        ? "selected"
        : badge && normalizedState === "default"
          ? "badged"
          : normalizedState;

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: allowedTypes.has(type) ? type : "button",
      className: iconButtonClassName({ variant: resolvedVariant, className }),
      disabled: resolvedState === "disabled" || resolvedState === "loading",
      "aria-label": resolvedLabel,
      "aria-pressed": selected ? "true" : undefined,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-intent": resolvedIntent,
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(resolvedState),
    },
    resolvedState === "loading"
      ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
      : React.createElement("span", { className: "icon-button__icon", "aria-hidden": "true" }, icon),
    badge ? React.createElement("span", { className: "icon-button__badge", "aria-hidden": "true" }) : null,
  );
}) as IconButtonComponent;

IconButton.displayName = "IconButton";
IconButton.platformContract = iconButtonPlatformContract;
