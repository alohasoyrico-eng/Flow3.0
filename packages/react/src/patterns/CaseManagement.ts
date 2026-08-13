import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { MenuItem } from "../Menu.js";
import { Surface } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { AdvancedFilters } from "./AdvancedFilters.js";
import type { AdvancedFiltersProps } from "./AdvancedFilters.js";
import { DenseOperationalList } from "./DenseOperationalList.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import { DrawerAdapter } from "./DrawerAdapter.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import { Timeline } from "./Timeline.js";
import type { TimelineProps } from "./Timeline.js";

export type CaseManagementState =
  | "default"
  | "filters-open"
  | "case-selected"
  | "detail-open"
  | "activity-filtered"
  | "loading"
  | "error"
  | "disabled";
export type CaseManagementDensity = BadgeDensity;

export type CaseManagementSummary = Partial<BadgeProps> & {
  key?: string;
  label: string;
};
export type CaseManagementFilters = Partial<AdvancedFiltersProps>;
export type CaseManagementCases = Partial<DenseOperationalListProps>;
export type CaseManagementDetail = Partial<DrawerAdapterProps>;
export type CaseManagementTimeline = Partial<TimelineProps>;
export type CaseManagementFeedback = Partial<StatusFeedbackViewProps>;

export interface CaseManagementProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: CaseManagementDensity;
  state?: CaseManagementState;
  disabled?: boolean;
  loading?: boolean;
  error?: DenseOperationalListProps["error"];
  selectedCaseKey?: string;
  detailOpen?: boolean;
  summaries?: CaseManagementSummary[];
  filters?: CaseManagementFilters;
  cases?: CaseManagementCases;
  detail?: CaseManagementDetail;
  timeline?: CaseManagementTimeline;
  feedback?: CaseManagementFeedback;
  className?: string;
  onFilterDrawerOpenChange?: DrawerAdapterProps["onOpenChange"];
  onFilterApply?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFilterReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSavedFilterSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onCaseSearchChange?: DenseOperationalListProps["onSearchChange"];
  onCaseFilterRemove?: DenseOperationalListProps["onFilterRemove"];
  onCaseFiltersReset?: DenseOperationalListProps["onFiltersReset"];
  onCaseSortChange?: DenseOperationalListProps["onSortChange"];
  onCaseSelect?: DenseOperationalListProps["onRowSelect"];
  onCasePageChange?: DenseOperationalListProps["onPageChange"];
  onCaseBulkAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onCaseToolbarOverflowSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onDetailOpenChange?: DrawerAdapterProps["onOpenChange"];
  onDetailAction?: DrawerAdapterProps["onAction"];
  onTimelineEventSelect?: TimelineProps["onEventSelect"];
  onTimelineFilterRemove?: TimelineProps["onFilterRemove"];
  onTimelineClear?: TimelineProps["onClear"];
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface CaseManagementComponent extends ForwardRefExoticComponent<CaseManagementProps & RefAttributes<HTMLDivElement>> {
  displayName: "CaseManagement";
}

type CaseManagementRestProps = Record<string, unknown>;
type LegacySearchChangeHandler = (value: string, event: unknown) => void;

interface CaseManagementStateInput {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  error?: DenseOperationalListProps["error"] | undefined;
  selectedCaseKey?: string | undefined;
  detailOpen?: boolean | undefined;
  filters?: CaseManagementFilters | undefined;
  timeline?: CaseManagementTimeline | undefined;
  state?: CaseManagementState | undefined;
}

function sanitizeRestProps(rest: CaseManagementRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeArray<T>(value: T[] | null | undefined): T[] {
  return Array.isArray(value) ? value : [];
}

function resolveState({ disabled, loading, error, selectedCaseKey, detailOpen, filters, timeline, state }: CaseManagementStateInput): CaseManagementState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (detailOpen || state === "detail-open") return "detail-open";
  if (selectedCaseKey || state === "case-selected") return "case-selected";
  if (filters?.open || filters?.dirty || state === "filters-open") return "filters-open";
  if (timeline?.filtered || state === "activity-filtered") return "activity-filtered";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: CaseManagementState): ComponentProps<typeof Surface>["state"] | "critical" {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error") return "critical";
  if (resolvedState === "loading") return "sunken";
  if (resolvedState === "detail-open" || resolvedState === "case-selected" || resolvedState === "filters-open" || resolvedState === "activity-filtered") {
    return "selected";
  }
  return "default";
}

function summaryTone(summary: CaseManagementSummary | undefined, resolvedState: CaseManagementState): BadgeProps["tone"] {
  if (summary?.tone) return summary.tone;
  if (resolvedState === "error") return "danger";
  if (resolvedState === "filters-open" || resolvedState === "activity-filtered") return "warning";
  if (resolvedState === "case-selected" || resolvedState === "detail-open") return "info";
  return "neutral";
}

function isCaseManagementSummary(summary: CaseManagementSummary | null | undefined): summary is CaseManagementSummary {
  return Boolean(summary?.label);
}

function hasDefaultPrevented(event: unknown): event is { defaultPrevented?: boolean } {
  return Boolean(event && typeof event === "object" && "defaultPrevented" in event);
}

export const CaseManagement = forwardRef<HTMLDivElement, CaseManagementProps>(function CaseManagement({
  label = "Case management",
  description,
  density = "sm",
  state,
  disabled = false,
  loading = false,
  error,
  selectedCaseKey,
  detailOpen = false,
  summaries = [],
  filters,
  cases = {},
  detail,
  timeline,
  feedback,
  className = "",
  onFilterDrawerOpenChange,
  onFilterApply,
  onFilterReset,
  onSavedFilterSelect,
  onCaseSearchChange,
  onCaseFilterRemove,
  onCaseFiltersReset,
  onCaseSortChange,
  onCaseSelect,
  onCasePageChange,
  onCaseBulkAction,
  onCaseToolbarOverflowSelect,
  onDetailOpenChange,
  onDetailAction,
  onTimelineEventSelect,
  onTimelineFilterRemove,
  onTimelineClear,
  onFeedbackAction,
  ...rest
}, ref) {
  const normalizedSummaries = normalizeArray(summaries).filter(isCaseManagementSummary);
  const caseRows = normalizeArray(cases.table?.rows);
  const timelineEvents = normalizeArray(timeline?.events);
  const resolvedState = resolveState({ disabled, loading, error, selectedCaseKey, detailOpen, filters, timeline, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading";

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
      "data-flow-pattern": "case-management",
      "data-flow-slot": "caseManagementSurface",
      "data-case-management-state": resolvedState,
      "data-density": density,
      "data-summary-count": String(normalizedSummaries.length),
      "data-case-row-count": String(caseRows.length),
      "data-activity-event-count": String(timelineEvents.length),
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
        "data-flow-slot": "caseSummary",
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
      "data-flow-slot": "caseMetric",
    } as ComponentProps<typeof Badge>)),
    filters
      ? React.createElement(AdvancedFilters, {
        ...filters,
        label: filters.label ?? `${label} filters`,
        density: filters.density ?? density,
        disabled: isDisabled || filters.disabled,
        applying: isLoading || filters.applying,
        drawer: filters.drawer
          ? {
            ...filters.drawer,
            onOpenChange: (open, event) => {
              filters.drawer?.onOpenChange?.(open, event);
              if (event?.defaultPrevented) return;
              onFilterDrawerOpenChange?.(open, event);
            },
          }
          : filters.drawer,
        applyAction: filters.applyAction
          ? {
            ...filters.applyAction,
            onClick: (event) => {
              filters.applyAction?.onClick?.(event);
              if (event.defaultPrevented) return;
              onFilterApply?.(event);
            },
          }
          : filters.applyAction,
        resetAction: filters.resetAction
          ? {
            ...filters.resetAction,
            onClick: (event) => {
              filters.resetAction?.onClick?.(event);
              if (event.defaultPrevented) return;
              onFilterReset?.(event);
            },
          }
          : filters.resetAction,
        savedViews: filters.savedViews
          ? {
            ...filters.savedViews,
            onSelect: (item, event) => {
              filters.savedViews?.onSelect?.(item, event);
              if (event.defaultPrevented) return;
              onSavedFilterSelect?.(item, event);
            },
          }
          : filters.savedViews,
        "data-flow-pattern-boundary": "advanced-filters",
        "data-flow-slot": "caseFiltersBoundary",
      } as ComponentProps<typeof AdvancedFilters>)
      : null,
    React.createElement(DenseOperationalList, {
      ...cases,
      label: cases.label ?? `${label} cases`,
      density: cases.density ?? density,
      state: cases.state ?? (selectedCaseKey ? "selected" : resolvedState === "activity-filtered" ? "filtered" : resolvedState),
      disabled: isDisabled || cases.disabled,
      loading: isLoading || cases.loading,
      error: cases.error ?? error,
      selectedKeys: cases.selectedKeys ?? (selectedCaseKey ? [selectedCaseKey] : []),
      onSearchChange: (value, event: unknown) => {
        (cases.onSearchChange as LegacySearchChangeHandler | undefined)?.(value, event);
        if (hasDefaultPrevented(event) && event.defaultPrevented) return;
        (onCaseSearchChange as LegacySearchChangeHandler | undefined)?.(value, event);
      },
      onFilterRemove: (key, event) => {
        cases.onFilterRemove?.(key, event);
        if (event.defaultPrevented) return;
        onCaseFilterRemove?.(key, event);
      },
      onFiltersReset: (event) => {
        cases.onFiltersReset?.(event);
        if (event.defaultPrevented) return;
        onCaseFiltersReset?.(event);
      },
      onSortChange: (sort, event) => {
        cases.onSortChange?.(sort, event);
        if (event.defaultPrevented) return;
        onCaseSortChange?.(sort, event);
      },
      onRowSelect: (key, event) => {
        cases.onRowSelect?.(key, event);
        if (event.defaultPrevented) return;
        onCaseSelect?.(key, event);
      },
      onPageChange: (page, event) => {
        cases.onPageChange?.(page, event);
        if (event.defaultPrevented) return;
        onCasePageChange?.(page, event);
      },
      onBulkAction: (key, event) => {
        cases.onBulkAction?.(key, event);
        if (event.defaultPrevented) return;
        onCaseBulkAction?.(key, event);
      },
      onToolbarOverflowSelect: (item, event) => {
        cases.onToolbarOverflowSelect?.(item, event);
        if (event.defaultPrevented) return;
        onCaseToolbarOverflowSelect?.(item, event);
      },
      "data-flow-pattern-boundary": "dense-operational-list",
      "data-flow-slot": "caseListBoundary",
    } as ComponentProps<typeof DenseOperationalList>),
    detail
      ? React.createElement(DrawerAdapter, {
        ...detail,
        label: detail.label ?? `${label} detail`,
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
        "data-flow-slot": "caseDetailBoundary",
      } as ComponentProps<typeof DrawerAdapter>)
      : null,
    timeline
      ? React.createElement(Timeline, {
        ...timeline,
        label: timeline.label ?? `${label} activity`,
        density: timeline.density ?? density,
        state: timeline.state ?? (timeline.filtered ? "filtered" : resolvedState === "loading" ? "loading" : "default"),
        loading: isLoading || timeline.loading,
        permissionBlocked: isDisabled || timeline.permissionBlocked,
        onEventSelect: (key, event) => {
          timeline.onEventSelect?.(key, event);
          if (event.defaultPrevented) return;
          onTimelineEventSelect?.(key, event);
        },
        onFilterRemove: (key, event) => {
          timeline.onFilterRemove?.(key, event);
          if (event.defaultPrevented) return;
          onTimelineFilterRemove?.(key, event);
        },
        onClear: (event) => {
          timeline.onClear?.(event);
          if (event.defaultPrevented) return;
          onTimelineClear?.(event);
        },
        "data-flow-pattern-boundary": "timeline",
        "data-flow-slot": "caseTimelineBoundary",
      } as ComponentProps<typeof Timeline>)
      : null,
    feedback
      ? React.createElement(StatusFeedbackView, {
        ...feedback,
        label: feedback.label ?? `${label} feedback`,
        density: feedback.density ?? density,
        state: feedback.state ?? resolvedState,
        onAction: (key, event) => {
          feedback.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onFeedbackAction?.(key, event);
        },
        "data-flow-pattern-boundary": "status-feedback-view",
        "data-flow-slot": "caseFeedbackBoundary",
      } as ComponentProps<typeof StatusFeedbackView>)
      : null,
  );
}) as CaseManagementComponent;

CaseManagement.displayName = "CaseManagement";
