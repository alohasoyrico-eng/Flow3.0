import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

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

const validStates = new Set<DocumentationPageShellState>([
  "desktop",
  "mobile",
  "sidebar-open",
  "sidebar-closed",
  "search-open",
  "dark",
  "light",
  "grid-overlay-visible",
  "loading",
]);

function sanitizeRestProps(rest: object): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(flowRestProps(rest as Record<string, unknown>)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({
  state,
  sidebarOpen,
  searchOpen,
  loading,
}: {
  state?: DocumentationPageShellState;
  sidebarOpen?: boolean;
  searchOpen?: boolean;
  loading?: boolean;
}): DocumentationPageShellState {
  if (loading || state === "loading") return "loading";
  if (searchOpen) return "search-open";
  if (sidebarOpen === true) return "sidebar-open";
  if (sidebarOpen === false) return "sidebar-closed";
  return state && validStates.has(state) ? state : "desktop";
}

export const DocumentationPageShell = forwardRef<HTMLDivElement, DocumentationPageShellProps>(function DocumentationPageShell({
  topbar,
  sidebar,
  localNav,
  children,
  density,
  state,
  background = "none",
  sidebarOpen,
  searchOpen = false,
  loading = false,
  surface,
  className = "",
  ...rest
}, ref) {
  const resolvedState = resolveState({
    ...(state !== undefined ? { state } : {}),
    ...(sidebarOpen !== undefined ? { sidebarOpen } : {}),
    searchOpen,
    loading,
  });
  const resolvedBackground = background === "gradient-grid" ? "gradient-grid" : "none";

  return React.createElement(
    Surface,
    {
      ...surface,
      ...sanitizeRestProps(rest),
      ref,
      className: ["documentation-page-shell", className].filter(Boolean).join(" "),
      surfaceRole: "canvas",
      state: resolvedState === "loading" ? "disabled" : "default",
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "documentation-page-shell",
      "data-documentation-page-shell-state": resolvedState,
      "data-documentation-page-shell-background": resolvedBackground,
      "data-sidebar-open": sidebarOpen === undefined ? undefined : String(sidebarOpen),
      "data-search-open": String(searchOpen),
      ...(density !== undefined ? { density } : {}),
    },
    topbar ? React.createElement("div", { "data-flow-slot": "documentation-page-shell.topbar" }, topbar) : null,
    React.createElement(
      "div",
      { "data-flow-slot": "documentation-page-shell.body" },
      sidebar ? React.createElement("div", { "data-flow-slot": "documentation-page-shell.sidebar", role: "complementary" }, sidebar) : null,
      React.createElement("main", { "data-flow-slot": "content" }, children),
      localNav ? React.createElement("div", { "data-flow-slot": "documentation-page-shell.local-nav", role: "complementary" }, localNav) : null,
    ),
  );
}) as DocumentationPageShellComponent;

DocumentationPageShell.displayName = "DocumentationPageShell";
