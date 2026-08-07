import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { tooltipPlatformContract } from "@design-system/components/platforms";

export type TooltipPlacement = "top" | "right" | "bottom" | "left";
export type TooltipVariant = "default" | "icon-help" | "metric" | "disabled-help";
export type TooltipDensity = "sm" | "md" | "lg";
export type TooltipState = "default" | "hover" | "focus" | "open" | "disabled" | "dismissed";

export interface TooltipProps extends HTMLAttributes<HTMLSpanElement> {
  triggerLabel: string;
  content: string;
  id?: string;
  placement?: TooltipPlacement;
  variant?: TooltipVariant;
  density?: TooltipDensity;
  state?: TooltipState;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export interface TooltipComponent extends ForwardRefExoticComponent<TooltipProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Tooltip";
  platformContract: typeof tooltipPlatformContract;
}

export const Tooltip: TooltipComponent;
