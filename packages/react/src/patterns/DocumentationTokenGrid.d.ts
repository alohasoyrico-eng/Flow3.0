import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DocumentationTokenGridDensity = SurfaceDensity;
export type DocumentationTokenGridVariant = "tokens" | "values" | "compact";

export interface DocumentationTokenGridItem {
  key?: string;
  token: string;
  label?: string;
  helper?: string;
}

export interface DocumentationTokenGridProps extends FlowDataAttributes {
  items?: Array<string | DocumentationTokenGridItem>;
  label?: string;
  variant?: DocumentationTokenGridVariant;
  density?: DocumentationTokenGridDensity;
  className?: string;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationTokenGridComponent extends ForwardRefExoticComponent<DocumentationTokenGridProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationTokenGrid";
}

export const DocumentationTokenGrid: DocumentationTokenGridComponent;
