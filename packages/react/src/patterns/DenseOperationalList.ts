import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity } from "../Badge.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps, SurfaceState } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import { BulkActions } from "./BulkActions.js";
import type { BulkActionsAction, BulkActionsProps } from "./BulkActions.js";
import { FilterChipGroup } from "./FilterChipGroup.js";
import type { FilterChipGroupProps } from "./FilterChipGroup.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import { Toolbar } from "./Toolbar.js";
import type { ToolbarProps } from "./Toolbar.js";
import { VirtualDataTable } from "./VirtualDataTable.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type DenseOperationalListState = "default" | "filtered" | "selected" | "loading" | "empty" | "error" | "disabled";
export type DenseOperationalListDensity = BadgeDensity;

export type DenseOperationalListFilter = NonNullable<FilterChipGroupProps["filters"]>[number];
export type DenseOperationalListSearch = Partial<SearchProps>;
export type DenseOperationalListToolbar = Partial<ToolbarProps>;
export type DenseOperationalListTable = Partial<VirtualDataTableProps>;
export type DenseOperationalListBulkActions = Partial<BulkActionsProps>;
export type DenseOperationalListFeedback = Partial<StatusFeedbackViewProps>;

export interface DenseOperationalListProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DenseOperationalListDensity;
  state?: DenseOperationalListState;
  disabled?: boolean;
  loading?: boolean;
  error?: VirtualDataTableProps["error"];
  search?: DenseOperationalListSearch;
  filters?: DenseOperationalListFilter[];
  toolbar?: DenseOperationalListToolbar;
  table?: DenseOperationalListTable;
  bulkActions?: DenseOperationalListBulkActions;
  feedback?: DenseOperationalListFeedback;
  resultCount?: number;
  selectedKeys?: string[];
  className?: string;
  onSearchChange?: SearchProps["onQueryChange"];
  onFilterRemove?: FilterChipGroupProps["onRemoveFilter"];
  onFiltersReset?: FilterChipGroupProps["onReset"];
  onSortChange?: VirtualDataTableProps["onSortChange"];
  onRowSelect?: VirtualDataTableProps["onRowSelect"];
  onPageChange?: VirtualDataTableProps["onPageChange"];
  onBulkAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onToolbarOverflowSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DenseOperationalListComponent extends ForwardRefExoticComponent<DenseOperationalListProps & RefAttributes<HTMLDivElement>> {
  displayName: "DenseOperationalList";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

type BulkActionsWithHandler = DenseOperationalListBulkActions & {
  onBulkAction?: NonNullable<DenseOperationalListProps["onBulkAction"]>;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeArray<T>(value: T[] | readonly T[] | undefined): T[] {
  return Array.isArray(value) ? [...value] : [];
}

function resolveState({
  disabled,
  loading,
  error,
  rows,
  selectedKeys,
  filters,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  error: VirtualDataTableProps["error"] | undefined;
  rows: NonNullable<VirtualDataTableProps["rows"]>;
  selectedKeys: string[];
  filters: DenseOperationalListFilter[];
  state: DenseOperationalListState | undefined;
}): DenseOperationalListState {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (selectedKeys.length > 0 || state === "selected") return "selected";
  if (filters.length > 0 || state === "filtered") return "filtered";
  if (!rows.length || state === "empty") return "empty";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: DenseOperationalListState): SurfaceState {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "selected" || resolvedState === "filtered") return "selected";
  if (resolvedState === "loading") return "sunken";
  return "default";
}

function wrapBulkActions(
  actions: DenseOperationalListBulkActions["actions"],
  onBulkAction: DenseOperationalListProps["onBulkAction"],
): BulkActionsAction[] {
  return normalizeArray(actions)
    .filter((action): action is BulkActionsAction => Boolean(action?.label))
    .map((action): BulkActionsAction => ({
      ...action,
      onClick: (event) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onBulkAction?.(action.key ?? action.label ?? "", event);
      },
    }));
}

export const DenseOperationalList = forwardRef<HTMLDivElement, DenseOperationalListProps>(function DenseOperationalList({
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
  const activeFilters = normalizeArray(filters).filter((filter): filter is DenseOperationalListFilter => Boolean(filter?.label));
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
    } as SurfaceProps & RefAttributes<HTMLDivElement>,
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
        onQueryChange: (value: string, event: any) => {
          search.onQueryChange?.(value, event, event);
          if (event.defaultPrevented) return;
          onSearchChange?.(value, event, event);
        },
        "data-flow-slot": "searchBoundary",
      } as SearchProps)
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
    } as FilterChipGroupProps),
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
      } as ToolbarProps)
      : null,
    bulkActions
      ? React.createElement(BulkActions, {
        ...(bulkActions as BulkActionsWithHandler),
        label: (bulkActions as BulkActionsWithHandler).label ?? `${label} bulk actions`,
        density: (bulkActions as BulkActionsWithHandler).density ?? density,
        disabled: isDisabled || (bulkActions as BulkActionsWithHandler).disabled,
        selectedCount: (bulkActions as BulkActionsWithHandler).selectedCount ?? selectedCount,
        totalCount: (bulkActions as BulkActionsWithHandler).totalCount ?? rows.length,
        actions: wrapBulkActions((bulkActions as BulkActionsWithHandler).actions, onBulkAction),
        onBulkAction: (key: string, event: MouseEvent<HTMLButtonElement>) => {
          (bulkActions as BulkActionsWithHandler).onBulkAction?.(key, event);
          if (event.defaultPrevented) return;
          onBulkAction?.(key, event);
        },
        "data-flow-slot": "bulkActionsBoundary",
      } as BulkActionsProps)
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
    } as VirtualDataTableProps),
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
      } as StatusFeedbackViewProps)
      : null,
  );
}) as DenseOperationalListComponent;

DenseOperationalList.displayName = "DenseOperationalList";
