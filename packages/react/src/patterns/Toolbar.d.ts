import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonDensity, ButtonProps } from "../Button.js";
import type { ChipProps } from "../Chip.js";
import type { InputProps } from "../Input.js";
import type { MenuProps } from "../Menu.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SearchProps } from "./Search.js";
import type { TopbarProps } from "./Topbar.js";

export type ToolbarState = "default" | "dense" | "overflow" | "filter-active" | "loading" | "disabled" | "permission-blocked";
export type ToolbarDensity = ButtonDensity;

export type ToolbarAction = ButtonProps & {
  key?: string;
};

export type ToolbarFilter = ChipProps & {
  key?: string;
};

export type ToolbarBadge = BadgeProps & {
  key?: string;
};

export interface ToolbarSearch {
  label?: string;
  query?: string;
  input?: Partial<Pick<InputProps, "label" | "value" | "placeholder" | "loading" | "disabled" | "onValueChange">>;
  delegate?: SearchProps;
}

export interface ToolbarOverflow extends Pick<MenuProps, "triggerLabel" | "label" | "items" | "open" | "variant" | "align" | "disabled" | "onOpenChange" | "onSelect"> {}

export interface ToolbarProps extends FlowDataAttributes {
  label?: string;
  density?: ToolbarDensity;
  state?: ToolbarState;
  dense?: boolean;
  loading?: boolean;
  disabled?: boolean;
  permissionBlocked?: boolean;
  search?: ToolbarSearch;
  actions?: ToolbarAction[];
  filters?: ToolbarFilter[];
  badges?: ToolbarBadge[];
  overflow?: ToolbarOverflow;
  feedback?: ToastProps;
  topbar?: TopbarProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ToolbarComponent extends ForwardRefExoticComponent<ToolbarProps & RefAttributes<HTMLDivElement>> {
  displayName: "Toolbar";
}

export const Toolbar: ToolbarComponent;
