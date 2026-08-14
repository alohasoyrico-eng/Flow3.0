import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type OnThisPageNavState = "default" | "sticky" | "collapsed" | "active-section" | "overflow" | "mobile" | "dark";
export type OnThisPageNavDensity = SurfaceDensity;

export interface OnThisPageNavItem extends FlowDataAttributes {
  id: string;
  label: string;
  href?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  badgeTone?: BadgeProps["tone"];
  onClick?: ButtonProps["onClick"];
}

export interface OnThisPageNavProps extends FlowDataAttributes {
  label?: string;
  items?: OnThisPageNavItem[];
  density?: OnThisPageNavDensity;
  state?: OnThisPageNavState;
  collapsed?: boolean;
  sticky?: boolean;
  children?: ReactNode;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface OnThisPageNavComponent extends ForwardRefExoticComponent<OnThisPageNavProps & RefAttributes<HTMLDivElement>> {
  displayName: "OnThisPageNav";
}

export const OnThisPageNav: OnThisPageNavComponent;
