import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { popoverPlatformContract } from "#flow/platforms";

export type PopoverVariant = "information" | "action" | "form" | "metric";
export type PopoverState = "default" | "closed" | "open" | "hover" | "focus" | "warning" | "disabled";
export type PopoverPlacement = "top" | "right" | "bottom" | "left";
export type PopoverDensity = "sm" | "md" | "lg";

export interface PopoverAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: PopoverDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PopoverField {
  label: string;
  value?: string;
  placeholder?: string;
  helper?: string;
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  triggerLabel?: string;
  triggerAriaLabel?: string;
  popoverAriaLabel?: string;
  title?: string;
  description?: string;
  id?: string;
  open?: boolean;
  variant?: PopoverVariant;
  state?: PopoverState;
  placement?: PopoverPlacement;
  density?: PopoverDensity;
  fullWidth?: boolean;
  disabled?: boolean;
  actions?: PopoverAction[];
  field?: PopoverField;
  onOpenChange?: (open: boolean) => void;
  onAction?: (key: string) => void;
}

export interface PopoverComponent extends ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Popover";
  platformContract: typeof popoverPlatformContract;
}

export const Popover: PopoverComponent;
