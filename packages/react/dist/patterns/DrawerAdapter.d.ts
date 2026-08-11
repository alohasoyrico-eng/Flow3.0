import type { ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { CardProps } from "../Card.js";
import type { DialogProps } from "../Dialog.js";
import type { DrawerProps } from "../Drawer.js";
import type { ListProps } from "../List.js";
import type { MenuProps } from "../Menu.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SidebarProps } from "./Sidebar.js";
import type { TopbarProps } from "./Topbar.js";
import type { MultiStepFormProps } from "./MultiStepForm.js";

export type DrawerAdapterState = "closed" | "open" | "modal" | "non-modal" | "responsive" | "loading" | "error" | "disabled";
export type DrawerAdapterDensity = "sm" | "md" | "lg";

export interface DrawerAdapterContent {
  drawerContent?: DrawerProps["content"];
}

export interface DrawerAdapterMultiStepBoundary extends Partial<MultiStepFormProps> {
  label?: ReactNode;
}

export interface DrawerAdapterProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DrawerAdapterDensity;
  state?: DrawerAdapterState;
  open?: boolean;
  modal?: boolean;
  nonModal?: boolean;
  responsive?: boolean;
  loading?: boolean;
  disabled?: boolean;
  error?: Partial<ToastProps>;
  drawer?: Partial<DrawerProps>;
  dialog?: Partial<DialogProps>;
  content?: DrawerAdapterContent;
  list?: Partial<ListProps>;
  cards?: CardProps[];
  menu?: Partial<MenuProps>;
  actions?: ButtonProps[];
  feedback?: ToastProps;
  topbar?: TopbarProps;
  sidebar?: SidebarProps;
  multiStepForm?: DrawerAdapterMultiStepBoundary;
  className?: string;
  onOpenChange?: DrawerProps["onOpenChange"];
  onAction?: DrawerProps["onAction"];
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DrawerAdapterComponent extends ForwardRefExoticComponent<DrawerAdapterProps & RefAttributes<HTMLDivElement>> {
  displayName: "DrawerAdapter";
}

export const DrawerAdapter: DrawerAdapterComponent;
