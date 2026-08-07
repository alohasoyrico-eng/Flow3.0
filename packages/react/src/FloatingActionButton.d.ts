import type {
  ButtonHTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { floatingActionButtonPlatformContract } from "@design-system/components/platforms";

export type FloatingActionButtonVariant = "primary" | "accent" | "extended" | "mini";
export type FloatingActionButtonState = "default" | "hover" | "focus" | "pressed" | "loading" | "disabled";
export type FloatingActionButtonDensity = "sm" | "md" | "lg";
export type FloatingActionButtonType = "button" | "submit" | "reset";

export interface FloatingActionButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style"> {
  label: string;
  icon?: string;
  variant?: FloatingActionButtonVariant;
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

export const FloatingActionButton: FloatingActionButtonComponent;
