import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { popoverPlatformContract } from "#flow/platforms";

export type PopoverVariant = "information" | "action" | "form" | "metric";
export type PopoverState = "default" | "closed" | "open" | "hover" | "focus" | "warning" | "disabled";
export type PopoverPlacement = "top" | "right" | "bottom" | "left" | `${"top" | "right" | "bottom" | "left"}-${"start" | "center" | "end"}`;
export type PopoverDensity = "sm" | "md" | "lg";
export type PopoverOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;
export type PopoverSurface = "card" | "none";

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

export interface PopoverProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
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
  matchAnchorWidth?: boolean;
  minWidth?: number;
  surface?: PopoverSurface;
  interactive?: boolean;
  autoFocus?: boolean;
  offset?: number;
  disabled?: boolean;
  actions?: PopoverAction[];
  field?: PopoverField;
  onOpenChange?: (open: boolean, event?: PopoverOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PopoverComponent extends ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Popover";
  platformContract: typeof popoverPlatformContract;
}

export const Popover: PopoverComponent;
