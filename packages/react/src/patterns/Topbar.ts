import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Avatar } from "../Avatar.js";
import type { AvatarProps } from "../Avatar.js";
import { Badge } from "../Badge.js";
import { Drawer } from "../Drawer.js";
import type { DrawerOpenChangeEvent, DrawerProps } from "../Drawer.js";
import { IconButton } from "../IconButton.js";
import type { IconButtonProps } from "../IconButton.js";
import { Input } from "../Input.js";
import type { InputDensity } from "../Input.js";
import { Menu } from "../Menu.js";
import type { MenuAlign, MenuItem, MenuOpenChangeEvent } from "../Menu.js";
import { Autocomplete } from "./Autocomplete.js";
import type { AutocompleteProps } from "./Autocomplete.js";
import { AvatarMenu } from "./AvatarMenu.js";
import type { AvatarMenuProps } from "./AvatarMenu.js";
import { CommandPalette } from "./CommandPalette.js";
import type { CommandPaletteProps } from "./CommandPalette.js";
import { NotificationPanel } from "./NotificationPanel.js";
import type { NotificationPanelProps } from "./NotificationPanel.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";
import { Settings } from "./Settings.js";
import type { SettingsProps } from "./Settings.js";
import { Sidebar } from "./Sidebar.js";
import type { SidebarProps } from "./Sidebar.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowDefinedProps } from "../internal/props.js";

export type TopbarState = "default" | "dense" | "mobile" | "search-active" | "notifications-unread" | "account-open" | "loading" | "permission-filtered" | "disabled";
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
export type TopbarAction = IconButtonProps & {
  key?: string;
};

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
  displayName?: string;
}

function sanitizeRestProps(rest: object | undefined) {
  return Object.fromEntries(Object.entries(rest ?? {}).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function hasRenderableAction(action: TopbarAction | undefined): action is TopbarAction & { label: string; icon: string } {
  return Boolean(action?.label && action?.icon);
}

function resolveState({
  disabled,
  loading,
  permissionFiltered,
  mobile,
  searchActive,
  notificationsUnread,
  accountOpen,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  permissionFiltered: boolean;
  mobile: boolean;
  searchActive?: boolean;
  notificationsUnread: boolean;
  accountOpen?: boolean;
  state?: TopbarState;
}): TopbarState {
  if (disabled) return "disabled";
  if (loading || state === "loading") return "loading";
  if (permissionFiltered || state === "permission-filtered") return "permission-filtered";
  if (mobile || state === "mobile") return "mobile";
  if (searchActive || state === "search-active") return "search-active";
  if (notificationsUnread || state === "notifications-unread") return "notifications-unread";
  if (accountOpen || state === "account-open") return "account-open";
  return state ?? "default";
}

export const Topbar: TopbarComponent = forwardRef<HTMLDivElement, TopbarProps>(function Topbar({
  label = "Global shell",
  density,
  state,
  dense = false,
  mobile = false,
  loading = false,
  disabled = false,
  permissionFiltered = false,
  search,
  autocomplete,
  account,
  commandPalette,
  notifications,
  settings,
  sidebar,
  navigationAction,
  actions = [],
  className = "",
  ...rest
}, ref) {
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter(hasRenderableAction);
  const unreadCount = notifications?.unreadCount ?? notifications?.notifications?.filter?.((item) => item.unread)?.length ?? 0;
  const resolvedState = resolveState(flowDefinedProps({
    disabled,
    loading,
    permissionFiltered,
    mobile,
    searchActive: search?.active || search?.open,
    notificationsUnread: unreadCount > 0,
    accountOpen: account?.open,
    state: dense ? "dense" : state,
  }));
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
  const sidebarDrawer = sidebar?.drawer === false ? undefined : sidebar?.drawer;
  const shouldRenderDrawer = Boolean(sidebar) && sidebar?.drawer !== false && (Boolean(sidebarDrawer) || Boolean(mobile && sidebar?.drawerOpen));

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "banner",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "topbar",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedActions.length),
      "data-unread-count": String(unreadCount),
      "data-mobile": String(Boolean(mobile)),
      ...sanitizeRestProps(rest),
    },
    shouldRenderDrawer ? React.createElement(Drawer, flowDefinedProps({
      label: sidebarDrawer?.label ?? `${label} navigation`,
      description: sidebarDrawer?.description,
      id: sidebarDrawer?.id,
      closeLabel: sidebarDrawer?.closeLabel ?? "Close navigation",
      showCloseButton: sidebarDrawer?.showCloseButton ?? true,
      open: Boolean(mobile && sidebar?.drawerOpen),
      state: mobile && sidebar?.drawerOpen ? "open" : "closed",
      variant: "side-sheet",
      side: sidebarDrawer?.side ?? "left",
      density,
      content: [{ type: "text", key: "boundary", copy: "Navigation is delegated to Sidebar." }] as DrawerProps["content"],
      onOpenChange: sidebar?.onDrawerOpenChange,
      "data-flow-slot": "navigation-drawer",
    })) : null,
    React.createElement(IconButton, flowDefinedProps({
      ...sanitizeRestProps(navigationAction ?? {}),
      icon: navigationAction?.icon ?? "menu",
      label: navigationAction?.label ?? "Open navigation",
      ariaLabel: navigationAction?.ariaLabel ?? navigationAction?.label ?? "Open navigation",
      density,
      variant: "ghost",
      disabled: isDisabled || navigationAction?.disabled,
      "aria-expanded": navigationAction?.["aria-expanded"],
      "aria-controls": navigationAction?.["aria-controls"],
      onClick: navigationAction?.onClick,
      "data-flow-slot": "navigation-action",
    })),
    search
      ? React.createElement(Input, flowDefinedProps({
        ...sanitizeRestProps(search),
        label: search.triggerLabel ?? search.label ?? "Search",
        value: search.query ?? search.value ?? "",
        placeholder: search.placeholder,
        variant: "search",
        icon: "search",
        density,
        disabled: isDisabled || search.disabled,
        loading: search.loading,
        state: search.active ? "focus" : search.query || search.value ? "filled" : "default",
        onValueChange: search.onQueryChange,
        "data-flow-slot": "search-field",
      }))
      : null,
    unreadCount > 0
      ? React.createElement(Badge, flowDefinedProps({
        label: String(unreadCount),
        ariaLabel: `${unreadCount} unread notifications`,
        tone: "info",
        variant: "count",
        state: isDisabled ? "disabled" : "default",
        density,
        live: true,
        "data-flow-slot": "unread-count",
      }))
      : null,
    normalizedActions.map((action) => React.createElement(IconButton, flowDefinedProps({
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      ariaLabel: action.ariaLabel ?? action.label,
      icon: action.icon,
      density: action.density ?? density,
      variant: action.variant ?? "ghost",
      selected: action.selected,
      badge: action.badge,
      disabled: isDisabled || action.disabled,
      "data-flow-slot": action["data-flow-slot"] ?? "topbar-action",
    }))),
    account?.name
      ? React.createElement(Avatar, flowDefinedProps({
        name: account.name,
        src: account.src,
        status: account.status,
        density,
        state: isDisabled ? "disabled" : undefined,
        "aria-hidden": "true",
        "data-flow-slot": "account-avatar",
      }))
      : null,
    account?.items?.length
      ? React.createElement(Menu, flowDefinedProps({
        triggerLabel: account.triggerLabel ?? `${account.name ?? "Account"} menu`,
        label: account.label ?? "Account menu",
        items: account.items,
        open: account.open,
        variant: "avatar-trigger",
        avatarName: account.name,
        avatarStatus: account.status,
        density,
        state: isDisabled ? "disabled" : account.open ? "open" : "closed",
        align: account.align ?? "end",
        disabled: isDisabled || account.disabled,
        onOpenChange: account.onOpenChange,
        onSelect: account.onSelect,
        "data-flow-slot": "account-menu",
      }))
      : null,
    search?.delegate
      ? React.createElement(Search, flowDefinedProps({
        ...search.delegate,
        density: search.delegate.density ?? density,
        "data-flow-slot": search.delegate["data-flow-slot"] ?? "search-results",
      }))
      : null,
    autocomplete
      ? React.createElement(Autocomplete, flowDefinedProps({
        ...autocomplete,
        density: autocomplete.density ?? density,
        "data-flow-slot": autocomplete["data-flow-slot"] ?? "autocomplete",
      }))
      : null,
    commandPalette
      ? React.createElement(CommandPalette, flowDefinedProps({
        ...commandPalette,
        density: commandPalette.density ?? density,
        "data-flow-slot": commandPalette["data-flow-slot"] ?? "command-palette",
      }))
      : null,
    notifications
      ? React.createElement(NotificationPanel, flowDefinedProps({
        ...notifications,
        density: notifications.density ?? density,
        "data-flow-slot": notifications["data-flow-slot"] ?? "notifications",
      }))
      : null,
    account?.delegate
      ? React.createElement(AvatarMenu, flowDefinedProps({
        ...account.delegate,
        density: account.delegate.density ?? density,
        "data-flow-slot": account.delegate["data-flow-slot"] ?? "account-delegate",
      }))
      : null,
    settings
      ? React.createElement(Settings, flowDefinedProps({
        ...settings,
        density: settings.density ?? density,
        "data-flow-slot": settings["data-flow-slot"] ?? "settings",
      }))
      : null,
    sidebar
      ? React.createElement(Sidebar, flowDefinedProps({
        ...sidebar,
        density: sidebar.density ?? density,
        "data-flow-slot": sidebar["data-flow-slot"] ?? "sidebar",
      }))
      : null,
    permissionFiltered
      ? React.createElement(Badge, flowDefinedProps({
        label: "Permission filtered",
        tone: "warning",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        live: true,
        "data-flow-slot": "permission-status",
      }))
      : null,
  );
}) as TopbarComponent;

Topbar.displayName = "Topbar";
