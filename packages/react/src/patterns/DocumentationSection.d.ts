import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceElevation, SurfaceProps, SurfaceTone } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SectionHeaderProps } from "./SectionHeader.js";

export type DocumentationSectionState = "default" | "dense" | "callout" | "matrix" | "empty" | "loading" | "error" | "dark" | "mobile";
export type DocumentationSectionLayout = "stack" | "split" | "matrix" | "cards" | "callout";
export type DocumentationSectionDensity = SurfaceDensity;
export type DocumentationSectionTone = SurfaceTone | "info";

export interface DocumentationSectionHeader extends Omit<SectionHeaderProps, "title" | "description" | "density"> {
  title: string;
  description?: string;
}

export interface DocumentationSectionProps extends FlowDataAttributes {
  title?: string;
  description?: string;
  header?: DocumentationSectionHeader;
  children?: ReactNode;
  footer?: ReactNode;
  layout?: DocumentationSectionLayout;
  state?: DocumentationSectionState;
  density?: DocumentationSectionDensity;
  tone?: DocumentationSectionTone;
  elevation?: SurfaceElevation;
  surface?: Omit<SurfaceProps, "children" | "density" | "tone" | "elevation" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationSectionComponent extends ForwardRefExoticComponent<DocumentationSectionProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationSection";
}

export const DocumentationSection: DocumentationSectionComponent;
