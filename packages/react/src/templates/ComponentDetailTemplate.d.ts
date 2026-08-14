import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";
import type { OnThisPageNavItem } from "../patterns/OnThisPageNav.js";

export type ComponentDetailTemplateState = "default" | "loading" | "empty" | "error";
export type ComponentDetailTemplateDensity = SurfaceDensity;

export interface ComponentDetailTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  navItems?: OnThisPageNavItem[];
  demo?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
  density?: ComponentDetailTemplateDensity;
  state?: ComponentDetailTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface ComponentDetailTemplateComponent extends ForwardRefExoticComponent<ComponentDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "ComponentDetailTemplate";
}

export const ComponentDetailTemplate: ComponentDetailTemplateComponent;
