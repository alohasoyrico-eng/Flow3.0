import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { MenuItem } from "../Menu.js";
import { Surface } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import { Timeline } from "./Timeline.js";
import type { TimelineProps } from "./Timeline.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type AccountOperationsState =
  | "default"
  | "account-selected"
  | "detail-open"
  | "audit-filtered"
  | "loading"
  | "error"
  | "disabled";
export type AccountOperationsDensity = BadgeDensity;

export type AccountOperationsSummary = Partial<BadgeProps> & {
  key?: string;
  label: string;
};
export type AccountOperationsAccounts = Partial<DenseOperationalListProps>;
export type AccountOperationsDetail = Partial<DrawerAdapterProps>;
export type AccountOperationsTimeline = Partial<TimelineProps>;

export interface AccountOperationsProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: AccountOperationsDensity;
  state?: AccountOperationsState;
  disabled?: boolean;
  loading?: boolean;
  error?: VirtualDataTableProps["error"];
  selectedAccountKey?: string;
  detailOpen?: boolean;
  summaries?: AccountOperationsSummary[];
  accounts?: AccountOperationsAccounts;
  detail?: AccountOperationsDetail;
  timeline?: AccountOperationsTimeline;
  className?: string;
  onAccountSearchChange?: DenseOperationalListProps["onSearchChange"];
  onAccountFilterRemove?: DenseOperationalListProps["onFilterRemove"];
  onAccountFiltersReset?: DenseOperationalListProps["onFiltersReset"];
  onAccountSortChange?: DenseOperationalListProps["onSortChange"];
  onAccountSelect?: DenseOperationalListProps["onRowSelect"];
  onAccountPageChange?: DenseOperationalListProps["onPageChange"];
  onAccountBulkAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onAccountToolbarOverflowSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onDetailOpenChange?: DrawerAdapterProps["onOpenChange"];
  onDetailAction?: DrawerAdapterProps["onAction"];
  onAuditEventSelect?: TimelineProps["onEventSelect"];
  onAuditFilterRemove?: TimelineProps["onFilterRemove"];
  onAuditClear?: TimelineProps["onClear"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface AccountOperationsComponent extends ForwardRefExoticComponent<AccountOperationsProps & RefAttributes<HTMLDivElement>> {
  displayName: "AccountOperations";
}

type AccountOperationsRestProps = Record<string, unknown>;
type LegacySearchChangeHandler = (value: string, event: unknown) => void;

function sanitizeRestProps(rest: AccountOperationsRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

interface AccountOperationsStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  error?: VirtualDataTableProps["error"] | undefined;
  selectedAccountKey?: string | undefined;
  detailOpen?: boolean | undefined;
  timeline?: AccountOperationsTimeline | undefined;
  state?: AccountOperationsState | undefined;
}

function resolveState({ disabled, loading, error, selectedAccountKey, detailOpen, timeline, state }: AccountOperationsStateInput): AccountOperationsState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (selectedAccountKey || state === "account-selected") return "account-selected";
  if (timeline?.filtered || state === "audit-filtered") return "audit-filtered";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: AccountOperationsState): ComponentProps<typeof Surface>["state"] | "critical" {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical";
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "detail-open" || resolvedState === "account-selected" || resolvedState === "audit-filtered") return "selected";
  return "default";
}

function summaryTone(summary: AccountOperationsSummary | undefined, resolvedState: AccountOperationsState): BadgeProps["tone"] {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "audit-filtered") return "warning";
  if (resolvedState === "account-selected" || resolvedState === "detail-open") return "info";
  return "neutral";
}

function isAccountOperationsSummary(summary: AccountOperationsSummary | null | undefined): summary is AccountOperationsSummary {
  return Boolean(summary?.label);
}

function hasDefaultPrevented(event: unknown): event is { defaultPrevented?: boolean } {
  return Boolean(event && typeof event === "object" && "defaultPrevented" in event);
}

export const AccountOperations = forwardRef<HTMLDivElement, AccountOperationsProps>(function AccountOperations({
  label = "Account operations",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  error,
  selectedAccountKey,
  detailOpen = false,
  summaries = [],
  accounts = {},
  detail,
  timeline,
  className = "",
  onAccountSearchChange,
  onAccountFilterRemove,
  onAccountFiltersReset,
  onAccountSortChange,
  onAccountSelect,
  onAccountPageChange,
  onAccountBulkAction,
  onAccountToolbarOverflowSelect,
  onDetailOpenChange,
  onDetailAction,
  onAuditEventSelect,
  onAuditFilterRemove,
  onAuditClear,
  ...rest
}, ref) {
  const normalizedSummaries = normalizeArray(summaries).filter(isAccountOperationsSummary);
  const resolvedState = resolveState({ disabled, loading, error, selectedAccountKey, detailOpen, timeline, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading";
  const tableRows = normalizeArray(accounts.table?.rows);
  const timelineEvents = normalizeArray(timeline?.events);

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
      "data-flow-pattern": "account-operations",
      "data-flow-slot": "accountOperationsSurface",
      "data-account-operations-state": resolvedState,
      "data-density": density,
      "data-summary-count": String(normalizedSummaries.length),
      "data-account-row-count": String(tableRows.length),
      "data-audit-event-count": String(timelineEvents.length),
      "data-detail-open": String(Boolean(detailOpen)),
      ...sanitizeRestProps(rest),
    } as ComponentProps<typeof Surface>,
    description
      ? React.createElement(Badge, {
        label: description,
        tone: summaryTone(undefined, resolvedState),
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        "data-flow-slot": "operationsSummary",
      } as ComponentProps<typeof Badge>)
      : null,
    normalizedSummaries.map((summary) => React.createElement(Badge, {
      ...summary,
      key: summary.key ?? summary.label,
      label: summary.label,
      tone: summaryTone(summary, resolvedState),
      variant: summary.variant ?? "status",
      density: summary.density ?? density,
      state: isDisabled ? "disabled" : summary.state ?? "default",
      live: summary.live ?? true,
      "data-flow-slot": "operationsMetric",
    } as ComponentProps<typeof Badge>)),
    React.createElement(DenseOperationalList, {
      ...accounts,
      label: accounts.label ?? `${label} accounts`,
      description: accounts.description,
      density: accounts.density ?? density,
      state: accounts.state ?? (selectedAccountKey ? "selected" : resolvedState === "audit-filtered" ? "filtered" : resolvedState),
      disabled: isDisabled || accounts.disabled,
      loading: isLoading || accounts.loading,
      error: accounts.error ?? error,
      selectedKeys: accounts.selectedKeys ?? (selectedAccountKey ? [selectedAccountKey] : []),
      onSearchChange: (value, event) => {
        (accounts.onSearchChange as LegacySearchChangeHandler | undefined)?.(value, event);
        if (hasDefaultPrevented(event) && event.defaultPrevented) return;
        (onAccountSearchChange as LegacySearchChangeHandler | undefined)?.(value, event);
      },
      onFilterRemove: (key, event) => {
        accounts.onFilterRemove?.(key, event);
        if (event.defaultPrevented) return;
        onAccountFilterRemove?.(key, event);
      },
      onFiltersReset: (event) => {
        accounts.onFiltersReset?.(event);
        if (event.defaultPrevented) return;
        onAccountFiltersReset?.(event);
      },
      onSortChange: (sort, event) => {
        accounts.onSortChange?.(sort, event);
        if (event.defaultPrevented) return;
        onAccountSortChange?.(sort, event);
      },
      onRowSelect: (key, event) => {
        accounts.onRowSelect?.(key, event);
        if (event.defaultPrevented) return;
        onAccountSelect?.(key, event);
      },
      onPageChange: (page, event) => {
        accounts.onPageChange?.(page, event);
        if (event.defaultPrevented) return;
        onAccountPageChange?.(page, event);
      },
      onBulkAction: (key, event) => {
        accounts.onBulkAction?.(key, event);
        if (event.defaultPrevented) return;
        onAccountBulkAction?.(key, event);
      },
      onToolbarOverflowSelect: (item, event) => {
        accounts.onToolbarOverflowSelect?.(item, event);
        if (event.defaultPrevented) return;
        onAccountToolbarOverflowSelect?.(item, event);
      },
      "data-flow-pattern-boundary": "dense-operational-list",
      "data-flow-slot": "accountListBoundary",
    } as ComponentProps<typeof DenseOperationalList>),
    detail
      ? React.createElement(DrawerAdapter, {
        ...detail,
        label: detail.label ?? `${label} detail`,
        description: detail.description,
        density: detail.density ?? density,
        open: detail.open ?? detailOpen,
        state: detail.state ?? (detailOpen ? "open" : "closed"),
        disabled: isDisabled || detail.disabled,
        loading: isLoading || detail.loading,
        error: detail.error ?? error,
        onOpenChange: (open, event) => {
          detail.onOpenChange?.(open, event);
          if (event?.defaultPrevented) return;
          onDetailOpenChange?.(open, event);
        },
        onAction: (key, event) => {
          detail.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onDetailAction?.(key, event);
        },
        "data-flow-pattern-boundary": "drawer-adapter",
        "data-flow-slot": "accountDetailBoundary",
      } as ComponentProps<typeof DrawerAdapter>)
      : null,
    timeline
      ? React.createElement(Timeline, {
        ...timeline,
        label: timeline.label ?? `${label} audit timeline`,
        density: timeline.density ?? density,
        state: timeline.state ?? (timeline.filtered ? "filtered" : resolvedState === "loading" ? "loading" : "default"),
        loading: isLoading || timeline.loading,
        error: timeline.error ?? false,
        permissionBlocked: isDisabled || timeline.permissionBlocked,
        onEventSelect: (key, event) => {
          timeline.onEventSelect?.(key, event);
          if (event.defaultPrevented) return;
          onAuditEventSelect?.(key, event);
        },
        onFilterRemove: (key, event) => {
          timeline.onFilterRemove?.(key, event);
          if (event.defaultPrevented) return;
          onAuditFilterRemove?.(key, event);
        },
        onClear: (event) => {
          timeline.onClear?.(event);
          if (event.defaultPrevented) return;
          onAuditClear?.(event);
        },
        "data-flow-pattern-boundary": "timeline",
        "data-flow-slot": "accountAuditBoundary",
      } as ComponentProps<typeof Timeline>)
      : null,
  );
}) as AccountOperationsComponent;

AccountOperations.displayName = "AccountOperations";
