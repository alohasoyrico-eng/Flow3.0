import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { OnThisPageNavItem } from "../patterns/OnThisPageNav.js";

export type ReferenceDetailTemplateState = "default" | "loading" | "empty" | "error";
export type ReferenceDetailTemplateDensity = SurfaceDensity;

export interface ReferenceDetailTemplateProps extends FlowDataAttributes {
  title: string;
  description?: string;
  navItems?: OnThisPageNavItem[];
  specimen?: ReactNode;
  children?: ReactNode;
  density?: ReferenceDetailTemplateDensity;
  state?: ReferenceDetailTemplateState;
  className?: string;
  "aria-label"?: string;
}

export interface ReferenceDetailTemplateComponent extends ForwardRefExoticComponent<ReferenceDetailTemplateProps & RefAttributes<HTMLElement>> {
  displayName: "ReferenceDetailTemplate";
}

export const ReferenceDetailTemplate: ReferenceDetailTemplateComponent;
