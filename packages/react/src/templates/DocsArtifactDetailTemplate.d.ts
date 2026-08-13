import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { BreadcrumbItem } from "../Breadcrumbs.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { TabsItem, TabsValueChangeEvent } from "../Tabs.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";

export type DocsArtifactDetailTemplateState = "default" | "loading" | "empty" | "error";
export type DocsArtifactDetailTemplateDensity = SurfaceDensity;

export interface DocsArtifactDetailTemplateProps extends FlowDataAttributes {
  label?: string;
  artifactType?: string;
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  metadata?: ArtifactMetadataBarItem[];
  tabs?: TabsItem[];
  selectedTabKey?: string;
  onSelectedTabChange?: (key: string, event: TabsValueChangeEvent) => void;
  body?: ReactNode;
  aside?: ReactNode;
  footer?: ReactNode;
  density?: DocsArtifactDetailTemplateDensity;
  state?: DocsArtifactDetailTemplateState;
  loading?: boolean;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocsArtifactDetailTemplateComponent extends ForwardRefExoticComponent<DocsArtifactDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "DocsArtifactDetailTemplate";
}

export const DocsArtifactDetailTemplate: DocsArtifactDetailTemplateComponent;
