import type { ButtonHTMLAttributes, ReactNode } from "react";
import type { iconButtonPlatformContract } from "@design-system/components/platforms";

export type IconButtonVariant = "ghost" | "tonal" | "primary" | "accent";
export type IconButtonDensity = "sm" | "md" | "lg";
export type IconButtonType = "button" | "submit" | "reset";

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type" | "children"> {
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

export interface IconButtonComponent {
  (props: IconButtonProps): ReactNode;
  displayName?: string;
  platformContract: typeof iconButtonPlatformContract;
}

export const IconButton: IconButtonComponent;
