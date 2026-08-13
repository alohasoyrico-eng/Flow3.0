import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { CardProps } from "../Card.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DocumentationReferenceGridKind = "summary" | "rule" | "matrix";
export type DocumentationReferenceGridDensity = SurfaceDensity;

export interface DocumentationReferenceGridItem {
  key?: string;
  title?: ReactNode;
  value?: ReactNode;
  detail?: ReactNode;
  status?: ReactNode;
  composition?: CardProps["composition"];
  variant?: CardProps["variant"];
}

export interface DocumentationReferenceGridProps extends FlowDataAttributes {
  items?: DocumentationReferenceGridItem[];
  kind?: DocumentationReferenceGridKind;
  density?: DocumentationReferenceGridDensity;
  className?: string;
  cardClassName?: string;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationReferenceGridComponent extends ForwardRefExoticComponent<DocumentationReferenceGridProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationReferenceGrid";
}

export const DocumentationReferenceGrid: DocumentationReferenceGridComponent;
