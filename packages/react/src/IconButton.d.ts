import type { ButtonHTMLAttributes, ForwardRefExoticComponent, RefAttributes } from "react";
import { iconButtonPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes } from "./internal/props.js";

export type IconButtonVariant = "primary" | "secondary" | "tertiary" | "outlined" | "ghost";
export type IconButtonDensity = "sm" | "md" | "lg";
export type IconButtonType = "button" | "submit" | "reset";

export type IconButtonAccessibleName =
  | { ariaLabel: string; label?: string }
  | { ariaLabel?: string; label: string };

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "type" | "children" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> & FlowDataAttributes & IconButtonAccessibleName & {
  icon: string;
  variant?: IconButtonVariant;
  density?: IconButtonDensity;
  selected?: boolean;
  badge?: boolean;
  disabled?: boolean;
  type?: IconButtonType;
};

export interface IconButtonComponent extends ForwardRefExoticComponent<IconButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "IconButton";
  platformContract: typeof iconButtonPlatformContract;
}

export const IconButton: IconButtonComponent;
