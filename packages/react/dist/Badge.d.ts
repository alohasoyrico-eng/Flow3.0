import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { badgePlatformContract } from "#flow/platforms";

export type BadgeTone = "neutral" | "info" | "success" | "warning" | "danger" | "accent";
export type BadgeVariant = "count" | "dot" | "status" | "icon";
export type BadgeState = "default" | "hover" | "focus" | "overflow" | "hidden" | "disabled";

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, "hidden"> {
  label: string;
  tone?: BadgeTone;
  variant?: BadgeVariant;
  state?: BadgeState;
  hidden?: boolean;
  live?: boolean;
  icon?: string;
  ariaLabel?: string;
}

export interface BadgeComponent extends ForwardRefExoticComponent<BadgeProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Badge";
  platformContract: typeof badgePlatformContract;
}

export const Badge: BadgeComponent;
