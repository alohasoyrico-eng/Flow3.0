import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Chip } from "../Chip.js";
import { Input } from "../Input.js";
import { Menu } from "../Menu.js";
import { Toast } from "../Toast.js";
import { Search } from "./Search.js";
import { Topbar } from "./Topbar.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function resolveState({ disabled, loading, permissionBlocked, filters, overflow, dense, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (overflow || state === "overflow") return "overflow";
  if ((filters?.length ?? 0) > 0 || state === "filter-active") return "filter-active";
  if (dense || state === "dense") return "dense";
  return state ?? "default";
}

export const Toolbar = forwardRef(function Toolbar({
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
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => action?.label);
  const normalizedFilters = (Array.isArray(filters) ? filters : []).filter((filter) => filter?.label);
  const normalizedBadges = (Array.isArray(badges) ? badges : []).filter((badge) => badge?.label);
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
      })
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
    })),
    normalizedBadges.map((badge) => React.createElement(Badge, {
      ...badge,
      key: badge.key ?? badge.label,
      label: badge.label,
      tone: badge.tone ?? "neutral",
      variant: badge.variant ?? "status",
      density: badge.density ?? density,
      state: isDisabled ? "disabled" : badge.state,
    })),
    normalizedActions.map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: action.loading,
    })),
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
      })
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      })
      : null,
    search?.delegate
      ? React.createElement(Search, {
        ...search.delegate,
        density: search.delegate.density ?? density,
      })
      : null,
    topbar
      ? React.createElement(Topbar, {
        ...topbar,
        density: topbar.density ?? density,
      })
      : null,
    permissionBlocked
      ? React.createElement(Badge, {
        label: "Permission blocked",
	        tone: "warning",
	        variant: "status",
	        density,
	        state: isDisabled ? "disabled" : "default",
	        live: true,
      })
      : null,
  );
});

Toolbar.displayName = "Toolbar";
