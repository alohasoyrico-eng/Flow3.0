import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeDensity, BadgeProps } from "../Badge.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { AdvancedFiltersProps } from "./AdvancedFilters.js";
import type { DrawerAdapterProps } from "./DrawerAdapter.js";
import type { RolesAndPermissionsProps } from "./RolesAndPermissions.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";
import type { VirtualDataTableProps } from "./VirtualDataTable.js";

export type PricingOperationsState =
  | "default"
  | "pending-approval"
  | "rule-selected"
  | "editing"
  | "submitting"
  | "loading"
  | "error"
  | "disabled";
export type PricingOperationsDensity = BadgeDensity;

export interface PricingOperationsRule {
  key?: string;
  id?: string;
  name: string;
  scope?: string;
  type?: string;
  value?: string;
  status?: string;
  owner?: string;
  by?: string;
}

export type PricingOperationsSummary = Partial<BadgeProps> & {
  key?: string;
  label: string;
};

export type PricingOperationsQueue = Partial<VirtualDataTableProps> & {
  filters?: Partial<AdvancedFiltersProps>;
  table?: Partial<VirtualDataTableProps>;
  editor?: Partial<DrawerAdapterProps>;
};
export type PricingOperationsEditor = Partial<DrawerAdapterProps>;
export type PricingOperationsRolePolicy = Partial<RolesAndPermissionsProps>;
export type PricingOperationsFeedback = Partial<StatusFeedbackViewProps>;

export interface PricingOperationsProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: PricingOperationsDensity;
  state?: PricingOperationsState;
  disabled?: boolean;
  loading?: boolean;
  submitting?: boolean;
  error?: VirtualDataTableProps["error"];
  selectedRuleKey?: string;
  editorOpen?: boolean;
  summaries?: PricingOperationsSummary[];
  rules?: PricingOperationsRule[];
  queue?: PricingOperationsQueue;
  editor?: PricingOperationsEditor;
  rolePolicy?: PricingOperationsRolePolicy;
  feedback?: PricingOperationsFeedback;
  className?: string;
  onRuleFiltersReset?: () => void;
  onRuleSortChange?: VirtualDataTableProps["onSortChange"];
  onRuleSelect?: VirtualDataTableProps["onRowSelect"];
  onRulePageChange?: VirtualDataTableProps["onPageChange"];
  onRuleBulkAction?: VirtualDataTableProps["onBulkAction"];
  onRuleSubmitForApproval?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onEditorOpenChange?: (open: boolean) => void;
  onEditorAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onPermissionChange?: RolesAndPermissionsProps["onPermissionChange"];
  onPermissionAction?: RolesAndPermissionsProps["onAction"];
  onFeedbackAction?: StatusFeedbackViewProps["onAction"];
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface PricingOperationsComponent extends ForwardRefExoticComponent<PricingOperationsProps & RefAttributes<HTMLDivElement>> {
  displayName: "PricingOperations";
}

export const PricingOperations: PricingOperationsComponent;
