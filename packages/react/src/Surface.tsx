import React, { forwardRef } from "react";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity } from "./internal/props.js";

import type { ForwardRefExoticComponent, HTMLAttributes, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type SurfaceRole = "canvas" | "section" | "panel" | "overlay" | "inline";
export type SurfaceState = "default" | "raised" | "sunken" | "overlay" | "selected" | "dragging" | "disabled" | "focused";
export type SurfaceDensity = FlowDensity;
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

const validSurfaceRoles = new Set<SurfaceRole>(["canvas", "section", "panel", "overlay", "inline"]);
const validStates = new Set<SurfaceState>(["default", "raised", "sunken", "overlay", "selected", "dragging", "disabled", "focused"]);
const validElevations = new Set<SurfaceElevation>(["none", "raised", "floating", "overlay"]);
const validTones = new Set<SurfaceTone>(["default", "muted", "selected", "danger", "warning", "success"]);
const validFocusModes = new Set<SurfaceFocusMode>(["none", "visible", "within"]);
const validBreakpoints = new Set<SurfaceBreakpoint>(["base", "sm", "md", "lg"]);

function normalizeSurfaceRole(surfaceRole: SurfaceRole): SurfaceRole {
  return validSurfaceRoles.has(surfaceRole) ? surfaceRole : "section";
}

function normalizeState(state: SurfaceState): SurfaceState {
  return validStates.has(state) ? state : "default";
}

function normalizeElevation(elevation: SurfaceElevation): SurfaceElevation {
  return validElevations.has(elevation) ? elevation : "none";
}

function normalizeTone(tone: SurfaceTone): SurfaceTone {
  return validTones.has(tone) ? tone : "default";
}

function normalizeFocusMode(focusMode: SurfaceFocusMode): SurfaceFocusMode {
  return validFocusModes.has(focusMode) ? focusMode : "none";
}

function normalizeBreakpoint(breakpoint: SurfaceBreakpoint): SurfaceBreakpoint {
  return validBreakpoints.has(breakpoint) ? breakpoint : "base";
}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(function Surface({
  children,
  surfaceRole = "section",
  state = "default",
  density,
  elevation = "none",
  tone = "default",
  focusMode = "none",
  breakpoint = "base",
  className = "",
  ...rest
}, ref) {
  const restProps = flowRestProps(rest);
  const consumerState = restProps["data-state"];
  const resolvedSurfaceRole = normalizeSurfaceRole(surfaceRole);
  const resolvedState = normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedElevation = normalizeElevation(elevation);
  const resolvedTone = normalizeTone(tone);
  const resolvedFocusMode = normalizeFocusMode(focusMode);
  const resolvedBreakpoint = normalizeBreakpoint(breakpoint);

  return React.createElement(
    "div",
    {
      ...restProps,
      ref,
      className: ["surface", className].filter(Boolean).join(" "),
      "data-flow-primitive": "surface",
      "data-surface-role": resolvedSurfaceRole,
      "data-surface-state": resolvedState,
      "data-surface-elevation": resolvedElevation,
      "data-surface-tone": resolvedTone,
      "data-surface-focus-mode": resolvedFocusMode,
      "data-surface-breakpoint": resolvedBreakpoint,
      ...flowStateProps(resolvedState),
      ...(consumerState !== undefined ? { "data-state": consumerState } : {}),
      ...flowDensityProps(resolvedDensity),
    },
    children,
  );
}) as SurfaceComponent;

Surface.displayName = "Surface";
