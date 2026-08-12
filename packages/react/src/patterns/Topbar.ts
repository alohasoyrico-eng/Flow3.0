import React, { forwardRef } from "react";
import type { MouseEvent } from "react";
import { Avatar } from "../Avatar.js";
import type { AvatarProps } from "../Avatar.js";
import { Badge } from "../Badge.js";
import { Drawer } from "../Drawer.js";
import type { DrawerOpenChangeEvent } from "../Drawer.js";
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

export interface TopbarNavigationAction extends Pick<IconButtonProps, "label" | "ariaLabel" | "icon" | "disabled" | "onClick"> {}
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

function sanitizeRestProps(rest: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
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

export const Topbar = forwardRef<HTMLDivElement, TopbarProps>(function Topbar({
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
  const resolvedState = resolveState({
    disabled,
    loading,
    permissionFiltered,
    mobile,
    searchActive: search?.active || search?.open,
    notificationsUnread: unreadCount > 0,
    accountOpen: account?.open,
    state: dense ? "dense" : state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";

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
    React.createElement(Drawer, {
      label: sidebar?.drawer?.label ?? `${label} navigation`,
      description: sidebar?.drawer?.description,
      closeLabel: sidebar?.drawer?.closeLabel ?? "Close navigation",
      open: Boolean(mobile && sidebar?.drawerOpen),
      state: mobile && sidebar?.drawerOpen ? "open" : "closed",
      variant: "side-sheet",
      side: sidebar?.drawer?.side ?? "left",
      density,
      content: [{ type: "text", key: "boundary", copy: "Navigation is delegated to Sidebar." }],
      onOpenChange: sidebar?.onDrawerOpenChange,
    }),
    React.createElement(IconButton, {
      icon: navigationAction?.icon ?? "menu",
      label: navigationAction?.label ?? "Open navigation",
      ariaLabel: navigationAction?.ariaLabel ?? navigationAction?.label ?? "Open navigation",
      density,
      variant: "ghost",
      disabled: isDisabled || navigationAction?.disabled,
      onClick: navigationAction?.onClick,
    }),
    search
      ? React.createElement(Input, {
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
      })
      : null,
    unreadCount > 0
      ? React.createElement(Badge, {
        label: String(unreadCount),
        ariaLabel: `${unreadCount} unread notifications`,
        tone: "info",
        variant: "count",
        state: isDisabled ? "disabled" : "default",
        density,
        live: true,
      })
      : null,
    normalizedActions.map((action) => React.createElement(IconButton, {
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
    })),
    account?.name
      ? React.createElement(Avatar, {
        name: account.name,
        src: account.src,
        status: account.status,
        density,
        state: isDisabled ? "disabled" : undefined,
        "aria-hidden": "true",
      })
      : null,
    account?.items?.length
      ? React.createElement(Menu, {
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
      })
      : null,
    search?.delegate
      ? React.createElement(Search, {
        ...search.delegate,
        density: search.delegate.density ?? density,
      })
      : null,
    autocomplete
      ? React.createElement(Autocomplete, {
        ...autocomplete,
        density: autocomplete.density ?? density,
      })
      : null,
    commandPalette
      ? React.createElement(CommandPalette, {
        ...commandPalette,
        density: commandPalette.density ?? density,
      })
      : null,
    notifications
      ? React.createElement(NotificationPanel, {
        ...notifications,
        density: notifications.density ?? density,
      })
      : null,
    account?.delegate
      ? React.createElement(AvatarMenu, {
        ...account.delegate,
        density: account.delegate.density ?? density,
      })
      : null,
    settings
      ? React.createElement(Settings, {
        ...settings,
        density: settings.density ?? density,
      })
      : null,
    sidebar
      ? React.createElement(Sidebar, {
        ...sidebar,
        density: sidebar.density ?? density,
      })
      : null,
    permissionFiltered
      ? React.createElement(Badge, {
        label: "Permission filtered",
        tone: "warning",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        live: true,
      })
      : null,
  );
});

Topbar.displayName = "Topbar";
