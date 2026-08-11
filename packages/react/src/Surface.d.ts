import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";

export type SurfaceRole = "canvas" | "section" | "panel" | "overlay" | "inline";
export type SurfaceState = "default" | "raised" | "sunken" | "overlay" | "selected" | "dragging" | "disabled" | "focused";
export type SurfaceDensity = "sm" | "md" | "lg";
export type SurfaceElevation = "none" | "raised" | "floating" | "overlay";
export type SurfaceTone = "default" | "muted" | "selected" | "danger" | "warning" | "success";
export type SurfaceFocusMode = "none" | "visible" | "within";
export type SurfaceBreakpoint = "base" | "sm" | "md" | "lg";

export interface SurfaceProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  children?: ReactNode;
  surfaceRole?: SurfaceRole;
  state?: SurfaceState;
  density?: SurfaceDensity;
  elevation?: SurfaceElevation;
  tone?: SurfaceTone;
  focusMode?: SurfaceFocusMode;
  breakpoint?: SurfaceBreakpoint;
}

export interface SurfaceComponent extends ForwardRefExoticComponent<SurfaceProps & RefAttributes<HTMLDivElement>> {
  displayName: "Surface";
}

export const Surface: SurfaceComponent;
