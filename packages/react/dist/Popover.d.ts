import type { ButtonProps } from "./Button.js";
import type { InputProps } from "./Input.js";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { popoverPlatformContract } from "#flow/platforms";

export type PopoverVariant = "information" | "action" | "form" | "metric";
export type PopoverState = "default" | "closed" | "open" | "hover" | "focus" | "warning" | "disabled";
export type PopoverPlacement = "top" | "right" | "bottom" | "left";
export type PopoverDensity = "sm" | "md" | "lg";

export interface PopoverAction extends ButtonProps {
  key?: string;
}

export interface PopoverField extends Pick<InputProps, "label" | "value" | "placeholder" | "helper"> {}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "onChange"> {
  triggerLabel: string;
  title: string;
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
