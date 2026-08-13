import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import type { SurfaceDensity, SurfaceElevation, SurfaceProps, SurfaceTone } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DemoPreviewFrameState = "default" | "interactive" | "static" | "viewport-mobile" | "viewport-desktop" | "loading" | "error" | "unsupported";
export type DemoPreviewFrameKind = "demo" | "viewport" | "playground" | "template" | "specimen";
export type DemoPreviewFrameDensity = SurfaceDensity;
export type DemoPreviewFrameTone = SurfaceTone | "info";

export interface DemoPreviewFrameFallback extends Pick<ErrorPanelProps, "label" | "description" | "action" | "icon"> {
  tone?: ErrorPanelProps["tone"];
}

export interface DemoPreviewFrameProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  kind?: DemoPreviewFrameKind;
  state?: DemoPreviewFrameState;
  density?: DemoPreviewFrameDensity;
  tone?: DemoPreviewFrameTone;
  elevation?: SurfaceElevation;
  compact?: boolean;
  fullWidth?: boolean;
  preview?: ReactNode;
  controls?: ReactNode;
  source?: ReactNode;
  fallback?: DemoPreviewFrameFallback;
  children?: ReactNode;
  surface?: Omit<SurfaceProps, "children" | "density" | "tone" | "elevation" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DemoPreviewFrameComponent extends ForwardRefExoticComponent<DemoPreviewFrameProps & RefAttributes<HTMLDivElement>> {
  displayName: "DemoPreviewFrame";
}

export const DemoPreviewFrame: DemoPreviewFrameComponent;
