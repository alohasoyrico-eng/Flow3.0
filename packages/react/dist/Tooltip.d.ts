import type { FocusEvent, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { tooltipPlatformContract } from "#flow/platforms";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";
export type TooltipVariant = "default" | "icon-help" | "metric" | "disabled-help";
export type TooltipDensity = "sm" | "md" | "lg";
export type TooltipState = "default" | "hover" | "focus" | "open" | "disabled" | "dismissed";
export type TooltipOpenChangeEvent = MouseEvent<HTMLButtonElement> | FocusEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>;

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  triggerLabel: string;
  content: string;
  id?: string;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  density?: TooltipDensity;
  state?: TooltipState;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean, event?: TooltipOpenChangeEvent) => void;
}

export interface TooltipComponent extends ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Tooltip";
  platformContract: typeof tooltipPlatformContract;
}

export const Tooltip: TooltipComponent;
