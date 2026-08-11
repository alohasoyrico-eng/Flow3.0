import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MenuItem } from "../Menu.js";
import type { DenseOperationalListProps } from "./DenseOperationalList.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
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

export const AccountOperations: AccountOperationsComponent;
