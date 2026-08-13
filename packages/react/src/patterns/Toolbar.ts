import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonDensity, ButtonProps } from "../Button.js";
import { Chip } from "../Chip.js";
import type { ChipProps } from "../Chip.js";
import { Input } from "../Input.js";
import type { InputProps } from "../Input.js";
import { Menu } from "../Menu.js";
import type { MenuProps } from "../Menu.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";
import { Topbar } from "./Topbar.js";
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

type ToolbarRestProps = Record<string, unknown>;

interface ToolbarStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  permissionBlocked?: boolean | undefined;
  filters?: ToolbarFilter[] | undefined;
  overflow?: boolean | number | undefined;
  dense?: boolean | undefined;
  state?: ToolbarState | undefined;
}

function sanitizeRestProps(rest: ToolbarRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({ disabled, loading, permissionBlocked, filters, overflow, dense, state }: ToolbarStateInput): ToolbarState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (overflow || state === "overflow") return "overflow";
  if ((filters?.length ?? 0) > 0 || state === "filter-active") return "filter-active";
  if (dense || state === "dense") return "dense";
  return state ?? "default";
}

function normalizeToolbarItems<T extends { label?: unknown }>(items: T[] | undefined): T[] {
  return (Array.isArray(items) ? items : []).filter((item): item is T => Boolean(item?.label));
}

export const Toolbar = forwardRef<HTMLDivElement, ToolbarProps>(function Toolbar({
  label = "Local actions",
  density,
  state,
  dense = false,
  loading = false,
  disabled = false,
  permissionBlocked = false,
  search,
  actions = [],
  filters = [],
  badges = [],
  overflow,
  feedback,
  topbar,
  className = "",
  ...rest
}, ref) {
  const normalizedActions = normalizeToolbarItems(actions);
  const normalizedFilters = normalizeToolbarItems(filters);
  const normalizedBadges = normalizeToolbarItems(badges);
  const resolvedState = resolveState({
    disabled,
    loading,
    permissionBlocked,
    filters: normalizedFilters,
    overflow: overflow?.open || overflow?.items?.length,
    dense,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "toolbar",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "aria-disabled": isDisabled ? "true" : undefined,
      "data-flow-pattern": "toolbar",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedActions.length),
      "data-filter-count": String(normalizedFilters.length),
      "data-badge-count": String(normalizedBadges.length),
      ...sanitizeRestProps(rest),
    },
    search?.input
      ? React.createElement(Input, {
        label: search.input.label ?? search.label ?? "Search",
        value: search.input.value ?? search.query ?? "",
        placeholder: search.input.placeholder,
        variant: "search",
        icon: "search",
        density,
        loading: search.input.loading ?? loading,
        disabled: isDisabled || search.input.disabled,
        state: search.input.value || search.query ? "filled" : "default",
        onValueChange: search.input.onValueChange,
      } as ComponentProps<typeof Input>)
      : null,
    normalizedFilters.map((filter) => React.createElement(Chip, {
      ...filter,
      key: filter.key ?? filter.label,
      label: filter.label,
      variant: filter.variant ?? "filter",
      selected: filter.selected ?? true,
      density: filter.density ?? density,
      disabled: isDisabled || filter.disabled,
      removable: filter.removable,
      onRemove: filter.onRemove,
      onSelectedChange: filter.onSelectedChange,
    } as ComponentProps<typeof Chip>)),
    normalizedBadges.map((badge) => React.createElement(Badge, {
      ...badge,
      key: badge.key ?? badge.label,
      label: badge.label,
      tone: badge.tone ?? "neutral",
      variant: badge.variant ?? "status",
      density: badge.density ?? density,
      state: isDisabled ? "disabled" : badge.state,
    } as ComponentProps<typeof Badge>)),
    normalizedActions.map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: action.loading,
    } as ComponentProps<typeof Button>)),
    overflow?.items?.length
      ? React.createElement(Menu, {
        triggerLabel: overflow.triggerLabel ?? "More actions",
        label: overflow.label ?? "More local actions",
        items: overflow.items,
        open: overflow.open,
        variant: overflow.variant ?? "actions",
        density,
        state: isDisabled ? "disabled" : overflow.open ? "open" : "closed",
        align: overflow.align ?? "end",
        disabled: isDisabled || overflow.disabled,
        onOpenChange: overflow.onOpenChange,
        onSelect: overflow.onSelect,
      } as ComponentProps<typeof Menu>)
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ComponentProps<typeof Toast>)
      : null,
    search?.delegate
      ? React.createElement(Search, {
        ...search.delegate,
        density: search.delegate.density ?? density,
      } as ComponentProps<typeof Search>)
      : null,
    topbar
      ? React.createElement(Topbar, {
        ...topbar,
        density: topbar.density ?? density,
      } as ComponentProps<typeof Topbar>)
      : null,
    permissionBlocked
      ? React.createElement(Badge, {
        label: "Permission blocked",
        tone: "warning",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        live: true,
      } as ComponentProps<typeof Badge>)
      : null,
  );
}) as ToolbarComponent;

Toolbar.displayName = "Toolbar";
