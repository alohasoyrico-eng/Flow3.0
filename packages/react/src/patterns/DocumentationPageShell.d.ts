import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type DocumentationPageShellState =
  | "desktop"
  | "mobile"
  | "sidebar-open"
  | "sidebar-closed"
  | "search-open"
  | "dark"
  | "light"
  | "grid-overlay-visible"
  | "loading";
export type DocumentationPageShellDensity = SurfaceDensity;
export type DocumentationPageShellBackground = "none" | "gradient-grid";

export interface DocumentationPageShellProps extends FlowDataAttributes {
  topbar?: ReactNode;
  sidebar?: ReactNode;
  localNav?: ReactNode;
  children?: ReactNode;
  density?: DocumentationPageShellDensity;
  state?: DocumentationPageShellState;
  background?: DocumentationPageShellBackground;
  sidebarOpen?: boolean;
  searchOpen?: boolean;
  loading?: boolean;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationPageShellComponent extends ForwardRefExoticComponent<DocumentationPageShellProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationPageShell";
}

export const DocumentationPageShell: DocumentationPageShellComponent;
