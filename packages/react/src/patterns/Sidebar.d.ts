import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AccordionDensity } from "../Accordion.js";
import type { BadgeTone, BadgeVariant } from "../Badge.js";
import type { BreadcrumbItem } from "../Breadcrumbs.js";
import type { DrawerSide, DrawerOpenChangeEvent } from "../Drawer.js";
import type { IconButtonProps } from "../IconButton.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SidebarState = "expanded" | "collapsed" | "mobile-drawer" | "active" | "loading" | "permission-filtered" | "disabled";
export type SidebarDensity = AccordionDensity;

export interface SidebarRoute {
  key?: string;
  id?: string;
  label: string;
  icon?: string;
  active?: boolean;
  disabled?: boolean;
  badge?: string;
  badgeTone?: BadgeTone;
  badgeVariant?: BadgeVariant;
  badgeLive?: boolean;
}

export interface SidebarGroup {
  key?: string;
  title: string;
  icon?: string;
  badge?: string;
  open?: boolean;
  disabled?: boolean;
  routes?: SidebarRoute[];
}

export interface SidebarDrawer {
  label?: string;
  description?: string;
  closeLabel?: string;
  side?: DrawerSide;
}

export interface SidebarCollapseAction extends Pick<IconButtonProps, "label" | "ariaLabel" | "disabled" | "onClick"> {}

export interface SidebarProps extends FlowDataAttributes {
  label?: string;
  density?: SidebarDensity;
  state?: SidebarState;
  collapsed?: boolean;
  mobileDrawer?: boolean;
  drawerOpen?: boolean;
  loading?: boolean;
  disabled?: boolean;
  permissionFiltered?: boolean;
  groups?: SidebarGroup[];
  breadcrumbs?: BreadcrumbItem[];
  activeKey?: string;
  expandedIds?: string[];
  collapseAction?: SidebarCollapseAction;
  drawer?: SidebarDrawer;
  onExpandedChange?: (expandedIds: string[], event: MouseEvent<HTMLButtonElement>) => void;
  onDrawerOpenChange?: (open: boolean, event?: DrawerOpenChangeEvent) => void;
  onRouteSelect?: (key: string, route: SidebarRoute, event: MouseEvent<HTMLButtonElement>) => void;
  onCollapse?: (collapsed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SidebarComponent extends ForwardRefExoticComponent<SidebarProps & RefAttributes<HTMLDivElement>> {
  displayName: "Sidebar";
}

export const Sidebar: SidebarComponent;
