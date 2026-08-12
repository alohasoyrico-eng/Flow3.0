import React, { forwardRef } from "react";
import { buttonPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";

import type { ButtonHTMLAttributes, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type ButtonIntent = "default" | "danger" | "warning";
export type ButtonDensity = FlowDensity;
export type ButtonState = "default" | "hover" | "focus" | "pressed" | "disabled" | "loading";
export type ButtonType = "button" | "submit" | "reset";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "type" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label?: string;
  children?: ReactNode;
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  density?: ButtonDensity;
  state?: ButtonState;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  type?: ButtonType;
}

export interface ButtonComponent extends ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "Button";
  platformContract: typeof buttonPlatformContract;
}

const allowedTypes = new Set<ButtonType>(["button", "submit", "reset"]);

function buttonClassName({ variant = "primary", intent = "default", className = "" }: {
  variant?: ButtonVariant;
  intent?: ButtonIntent;
  className?: string;
} = {}) {
  return [
    "button",
    `button--${variant}`,
    intent !== "default" ? `button--${intent}` : "",
    className,
  ].filter(Boolean).join(" ");
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button({
  label,
  children,
  variant = "primary",
  intent = "default",
  density,
  state = "default",
  disabled = false,
  loading = false,
  icon,
  trailingIcon,
  fullWidth = false,
  type = "button",
  className = "",
  ...rest
}, ref) {
  const resolvedState = loading || state === "loading" ? "loading" : disabled || state === "disabled" ? "disabled" : state;
  const resolvedDensity = normalizeFlowDensity(density);
  const buttonLabel = children ?? label;
  if (!buttonLabel) return null;

  return React.createElement(
    "button",
    {
      ...flowRestProps(rest),
      ref,
      type: allowedTypes.has(type) ? type : "button",
      className: buttonClassName({ variant, intent, className }),
      disabled: resolvedState === "disabled" || resolvedState === "loading",
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      ...flowDensityProps(resolvedDensity),
      ...flowStateProps(resolvedState),
      "data-full-width": String(Boolean(fullWidth)),
    },
    resolvedState !== "loading" && icon
      ? React.createElement("span", { className: "button__icon", "aria-hidden": "true" }, icon)
      : null,
    resolvedState === "loading"
      ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
      : null,
    buttonLabel ? React.createElement("span", { className: "button__label" }, buttonLabel) : null,
    resolvedState !== "loading" && trailingIcon
      ? React.createElement("span", { className: "button__icon button__icon--trailing", "aria-hidden": "true" }, trailingIcon)
      : null,
  );
}) as ButtonComponent;

Button.displayName = "Button";
Button.platformContract = buttonPlatformContract;
