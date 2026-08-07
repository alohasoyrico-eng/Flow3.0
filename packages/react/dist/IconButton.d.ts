import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { iconButtonPlatformContract } from "#flow/platforms";

export type IconButtonVariant = "ghost" | "tonal" | "primary" | "accent";
export type IconButtonDensity = "sm" | "md" | "lg";
export type IconButtonType = "button" | "submit" | "reset";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "type" | "children"> {
  ariaLabel?: string;
  label?: string;
  icon: string;
  variant?: IconButtonVariant;
  density?: IconButtonDensity;
  selected?: boolean;
  badge?: boolean;
  disabled?: boolean;
  type?: IconButtonType;
}

export interface IconButtonComponent extends ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "IconButton";
  platformContract: typeof iconButtonPlatformContract;
}

export const IconButton: IconButtonComponent;
