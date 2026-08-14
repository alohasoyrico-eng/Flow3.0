import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ArtifactMetadataBarItem } from "../patterns/ArtifactMetadataBar.js";
import type { OnThisPageNavItem } from "../patterns/OnThisPageNav.js";

export type PatternDetailTemplateState = "default" | "loading" | "empty" | "error";
export type PatternDetailTemplateDensity = SurfaceDensity;

export interface PatternDetailTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  metadata?: ArtifactMetadataBarItem[];
  navItems?: OnThisPageNavItem[];
  scenario?: ReactNode;
  demo?: ReactNode;
  children?: ReactNode;
  density?: PatternDetailTemplateDensity;
  state?: PatternDetailTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface PatternDetailTemplateComponent extends ForwardRefExoticComponent<PatternDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "PatternDetailTemplate";
}

export const PatternDetailTemplate: PatternDetailTemplateComponent;
