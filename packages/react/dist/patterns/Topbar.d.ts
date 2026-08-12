import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AvatarProps } from "../Avatar.js";
import type { DrawerOpenChangeEvent } from "../Drawer.js";
import type { IconButtonProps } from "../IconButton.js";
import type { InputDensity } from "../Input.js";
import type { MenuAlign, MenuItem, MenuOpenChangeEvent } from "../Menu.js";
import type { AutocompleteProps } from "./Autocomplete.js";
import type { AvatarMenuProps } from "./AvatarMenu.js";
import type { CommandPaletteProps } from "./CommandPalette.js";
import type { NotificationPanelProps } from "./NotificationPanel.js";
import type { SearchProps } from "./Search.js";
import type { SettingsProps } from "./Settings.js";
import type { SidebarProps } from "./Sidebar.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type TopbarState = "default" | "dense" | "mobile" | "search-active" | "notifications-unread" | "account-open" | "loading" | "permission-filtered";
export type TopbarDensity = InputDensity;

export interface TopbarSearch {
  label?: string;
  triggerLabel?: string;
  query?: string;
  value?: string;
  placeholder?: string;
  active?: boolean;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onQueryChange?: SearchProps["onQueryChange"];
  delegate?: SearchProps;
}

export interface TopbarAccount extends Pick<AvatarProps, "name" | "src" | "status"> {
  label?: string;
  triggerLabel?: string;
  open?: boolean;
  disabled?: boolean;
  items?: MenuItem[];
  align?: MenuAlign;
  onOpenChange?: (open: boolean, event?: MenuOpenChangeEvent) => void;
  onSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  delegate?: AvatarMenuProps;
}

export interface TopbarNavigationAction extends Pick<IconButtonProps, "label" | "ariaLabel" | "icon" | "disabled" | "onClick" | "aria-expanded" | "aria-controls"> {}
export interface TopbarAction extends IconButtonProps {
  key?: string;
}

export interface TopbarProps extends FlowDataAttributes {
  label?: string;
  density?: TopbarDensity;
  state?: TopbarState;
  dense?: boolean;
  mobile?: boolean;
  loading?: boolean;
  disabled?: boolean;
  permissionFiltered?: boolean;
  search?: TopbarSearch;
  autocomplete?: AutocompleteProps;
  account?: TopbarAccount;
  commandPalette?: CommandPaletteProps;
  notifications?: NotificationPanelProps;
  settings?: SettingsProps;
  sidebar?: SidebarProps & {
    drawerOpen?: boolean;
    onDrawerOpenChange?: (open: boolean, event?: DrawerOpenChangeEvent) => void;
  };
  navigationAction?: TopbarNavigationAction;
  actions?: TopbarAction[];
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface TopbarComponent extends ForwardRefExoticComponent<TopbarProps & RefAttributes<HTMLDivElement>> {
  displayName: "Topbar";
}

export const Topbar: TopbarComponent;
