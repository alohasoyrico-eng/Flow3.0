import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";

export type DocsHomeTemplateState = "default" | "loading" | "empty" | "mobile";
export type DocsHomeTemplateDensity = SurfaceDensity;

export interface DocsHomeTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  heroVisual?: ReactNode;
  coverage?: ReactNode;
  status?: ReactNode;
  children?: ReactNode;
  density?: DocsHomeTemplateDensity;
  state?: DocsHomeTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface DocsHomeTemplateComponent extends ForwardRefExoticComponent<DocsHomeTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "DocsHomeTemplate";
}

export const DocsHomeTemplate: DocsHomeTemplateComponent;
