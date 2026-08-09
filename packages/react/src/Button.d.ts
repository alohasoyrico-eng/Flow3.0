import type { ButtonHTMLAttributes, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { buttonPlatformContract } from "@design-system/components/platforms";

export type ButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type ButtonIntent = "default" | "danger" | "warning";
export type ButtonDensity = "sm" | "md" | "lg";
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
  icon?: string;
  trailingIcon?: string;
  fullWidth?: boolean;
  type?: ButtonType;
}

export interface ButtonComponent extends ForwardRefExoticComponent<ButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "Button";
  platformContract: typeof buttonPlatformContract;
}

export const Button: ButtonComponent;
