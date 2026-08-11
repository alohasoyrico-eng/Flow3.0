import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Surface } from "../Surface.js";
import { BulkActions } from "./BulkActions.js";
import { FilterChipGroup } from "./FilterChipGroup.js";
import { Search } from "./Search.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import { Toolbar } from "./Toolbar.js";
import { VirtualDataTable } from "./VirtualDataTable.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function resolveState({ disabled, loading, error, rows, selectedKeys, filters, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (selectedKeys.length > 0 || state === "selected") return "selected";
  if (filters.length > 0 || state === "filtered") return "filtered";
  if (!rows.length || state === "empty") return "empty";
  return state ?? "default";
}

function surfaceStateFor(resolvedState) {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "selected" || resolvedState === "filtered") return "selected";
  if (resolvedState === "loading") return "sunken";
  return "default";
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function wrapBulkActions(actions, onBulkAction) {
  return normalizeArray(actions)
    .filter((action) => action?.label)
    .map((action) => ({
      ...action,
      onClick: (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onBulkAction?.(action.key ?? action.label, event);
      },
    }));
}

export const DenseOperationalList = forwardRef(function DenseOperationalList({
  label = "Dense operational list",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  error,
  search,
  filters = [],
  toolbar,
  table = {},
  bulkActions,
  feedback,
  resultCount,
  selectedKeys = [],
  className = "",
  onSearchChange,
  onFilterRemove,
  onFiltersReset,
  onSortChange,
  onRowSelect,
  onPageChange,
  onBulkAction,
  onToolbarOverflowSelect,
  onFeedbackAction,
  ...rest
}, ref) {
  const rows = normalizeArray(table.rows);
  const activeFilters = normalizeArray(filters).filter((filter) => filter?.label);
  const selectedKeyList = normalizeArray(selectedKeys).map(String);
  const resolvedState = resolveState({ disabled, loading, error, rows, selectedKeys: selectedKeyList, filters: activeFilters, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading";
  const resolvedResultCount = typeof resultCount === "number" ? resultCount : rows.length;
  const selectedCount = selectedKeyList.length;

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState),
      density,
      elevation: "none",
      focusMode: "within",
      role: "group",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isLoading ? "true" : undefined,
      "data-flow-pattern": "dense-operational-list",
      "data-flow-slot": "listSurface",
      "data-state": resolvedState,
      "data-density": density,
      "data-row-count": String(rows.length),
      "data-filter-count": String(activeFilters.length),
      "data-selected-count": String(selectedCount),
      ...sanitizeRestProps(rest),
    },
    description
      ? React.createElement(Badge, {
        label: description,
        tone: resolvedState === "error" ? "danger" : selectedCount ? "info" : "neutral",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        "data-flow-slot": "summary",
      })
      : null,
    search
      ? React.createElement(Search, {
        ...search,
        label: search.label ?? `${label} search`,
        density: search.density ?? density,
        disabled: isDisabled || search.disabled,
        loading: isLoading || search.loading,
        resultCount: search.resultCount ?? resolvedResultCount,
        onQueryChange: (value, event) => {
          search.onQueryChange?.(value, event);
          if (event.defaultPrevented) return;
          onSearchChange?.(value, event);
        },
        "data-flow-slot": "searchBoundary",
      })
      : null,
    React.createElement(FilterChipGroup, {
      label: `${label} filters`,
      filters: activeFilters,
      resultCount: resolvedResultCount,
      density,
      state: resolvedState === "filtered" ? "active" : "active",
      disabled: isDisabled,
      reset: activeFilters.length ? { label: "Reset filters" } : undefined,
      onRemoveFilter: (key, event) => {
        onFilterRemove?.(key, event);
      },
      onReset: (event) => {
        onFiltersReset?.(event);
      },
      "data-flow-slot": "filterSummary",
    }),
    toolbar
      ? React.createElement(Toolbar, {
        ...toolbar,
        label: toolbar.label ?? `${label} toolbar`,
        density: toolbar.density ?? density,
        dense: toolbar.dense ?? true,
        disabled: isDisabled || toolbar.disabled,
        loading: isLoading || toolbar.loading,
        overflow: toolbar.overflow
          ? {
            ...toolbar.overflow,
            onSelect: (item, event) => {
              toolbar.overflow?.onSelect?.(item, event);
              if (event.defaultPrevented) return;
              onToolbarOverflowSelect?.(item, event);
            },
          }
          : toolbar.overflow,
        "data-flow-slot": "toolbarBoundary",
      })
      : null,
    bulkActions
      ? React.createElement(BulkActions, {
        ...bulkActions,
        label: bulkActions.label ?? `${label} bulk actions`,
        density: bulkActions.density ?? density,
        disabled: isDisabled || bulkActions.disabled,
        selectedCount: bulkActions.selectedCount ?? selectedCount,
        totalCount: bulkActions.totalCount ?? rows.length,
        actions: wrapBulkActions(bulkActions.actions, onBulkAction),
        onBulkAction: (key, event) => {
          bulkActions.onBulkAction?.(key, event);
          if (event.defaultPrevented) return;
          onBulkAction?.(key, event);
        },
        "data-flow-slot": "bulkActionsBoundary",
      })
      : null,
    React.createElement(VirtualDataTable, {
      ...table,
      label: table.label ?? label,
      description: table.description,
      density: table.density ?? density,
      state: table.state ?? resolvedState,
      disabled: isDisabled || table.disabled,
      loading: isLoading || table.loading,
      rows,
      selectedKeys: selectedKeyList,
      virtualized: table.virtualized ?? true,
      selection: table.selection ?? { enabled: selectedCount > 0 || Boolean(onRowSelect) },
      error: table.error ?? error,
      onSortChange: (sort, event) => {
        table.onSortChange?.(sort, event);
        if (event.defaultPrevented) return;
        onSortChange?.(sort, event);
      },
      onRowSelect: (key, event) => {
        table.onRowSelect?.(key, event);
        if (event.defaultPrevented) return;
        onRowSelect?.(key, event);
      },
      onPageChange: (page, event) => {
        table.onPageChange?.(page, event);
        if (event.defaultPrevented) return;
        onPageChange?.(page, event);
      },
      onBulkAction: (key, event) => {
        table.onBulkAction?.(key, event);
        if (event.defaultPrevented) return;
        onBulkAction?.(key, event);
      },
      "data-flow-slot": "tableBoundary",
    }),
    feedback?.kind || feedback?.title || feedback?.description
      ? React.createElement(StatusFeedbackView, {
        ...feedback,
        label: feedback.label ?? `${label} status`,
        density: feedback.density ?? density,
        state: feedback.state ?? resolvedState,
        onAction: (key, event) => {
          feedback.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onFeedbackAction?.(key, event);
        },
        "data-flow-pattern-boundary": "status-feedback-view",
        "data-flow-slot": "statusFeedback",
      })
      : null,
  );
});

DenseOperationalList.displayName = "DenseOperationalList";
