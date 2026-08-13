import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SurfaceDensity } from "../Surface.js";
import type { SidebarProps } from "../patterns/Sidebar.js";
import type { TopbarProps } from "../patterns/Topbar.js";

export type DocsShellTemplateState =
  | "desktop"
  | "mobile"
  | "sidebar-open"
  | "sidebar-closed"
  | "search-open"
  | "dark"
  | "light"
  | "loading";
export type DocsShellTemplateDensity = SurfaceDensity;
export type DocsShellTemplateTheme = "light" | "dark" | "system";

export interface DocsShellTemplateProps extends FlowDataAttributes {
  label?: string;
  density?: DocsShellTemplateDensity;
  state?: DocsShellTemplateState;
  theme?: DocsShellTemplateTheme;
  mobile?: boolean;
  loading?: boolean;
  sidebarOpen?: boolean;
  sidebar?: SidebarProps;
  topbar?: TopbarProps;
  brand?: ReactNode;
  pageLabel?: string;
  pageDescription?: string;
  children?: ReactNode;
  skipLinkLabel?: string;
  skipLinkHref?: string;
  className?: string;
  contentClassName?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocsShellTemplateComponent extends ForwardRefExoticComponent<DocsShellTemplateProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocsShellTemplate";
}

export const DocsShellTemplate: DocsShellTemplateComponent;
