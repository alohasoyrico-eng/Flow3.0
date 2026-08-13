import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DocumentationPrimitiveDemoType = "typography" | "stack" | "icon" | "swatch" | "radius" | "elevation" | "motionToken" | "breakpoint" | "focus" | "loading" | "disabled" | "chart" | "map" | "message" | "statGrid" | "surface";
export type DocumentationPrimitiveDemoDensity = SurfaceDensity;
export type DocumentationPrimitiveDemoChoice = [string, string];
export type DocumentationPrimitiveDemoCardAction = [string, string?, string?, string?, string?];

export interface DocumentationPrimitiveDemoCard {
  title?: string;
  copy?: string;
  eyebrow?: string;
  actions?: DocumentationPrimitiveDemoCardAction[];
}

export interface DocumentationPrimitiveDemoProps extends FlowDataAttributes {
  type?: DocumentationPrimitiveDemoType;
  initial?: string;
  choices?: DocumentationPrimitiveDemoChoice[];
  ariaLabel?: string;
  samples?: Record<string, [string, string]>;
  staticSamples?: Array<[string, string]>;
  code?: string;
  items?: string[];
  icons?: string[];
  roles?: string[];
  labels?: Record<string, string>;
  states?: Record<string, string | [string, string]>;
  title?: string;
  copy?: string;
  targetLabel?: string;
  action?: string;
  initialLabel?: string;
  cards?: DocumentationPrimitiveDemoCard[];
  rows?: Array<[string, string]>;
  className?: string;
  density?: DocumentationPrimitiveDemoDensity;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationPrimitiveDemoComponent extends ForwardRefExoticComponent<DocumentationPrimitiveDemoProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationPrimitiveDemo";
}

export const DocumentationPrimitiveDemo: DocumentationPrimitiveDemoComponent;
