import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";

export type TemplateDetailTemplateState = "default" | "loading" | "empty" | "error";
export type TemplateDetailTemplateDensity = SurfaceDensity;

export interface TemplateDetailTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  modulePreview?: ReactNode;
  children?: ReactNode;
  density?: TemplateDetailTemplateDensity;
  state?: TemplateDetailTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface TemplateDetailTemplateComponent extends ForwardRefExoticComponent<TemplateDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "TemplateDetailTemplate";
}

export const TemplateDetailTemplate: TemplateDetailTemplateComponent;
