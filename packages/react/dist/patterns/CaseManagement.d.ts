import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import type { AdvancedFiltersProps } from "./AdvancedFilters.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
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

export const CaseManagement: CaseManagementComponent;
