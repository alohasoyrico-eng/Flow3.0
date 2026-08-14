import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";
import type { SearchProps } from "../patterns/Search.js";
import type { ToolbarProps } from "../patterns/Toolbar.js";

export type DocsCollectionTemplateState = "default" | "loading" | "empty" | "filtered";
export type DocsCollectionTemplateDensity = SurfaceDensity;

export interface DocsCollectionTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  search?: SearchProps;
  toolbar?: ToolbarProps;
  children?: ReactNode;
  density?: DocsCollectionTemplateDensity;
  state?: DocsCollectionTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface DocsCollectionTemplateComponent extends ForwardRefExoticComponent<DocsCollectionTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "DocsCollectionTemplate";
}

export const DocsCollectionTemplate: DocsCollectionTemplateComponent;
