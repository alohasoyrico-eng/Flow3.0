import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CheckboxValueMeta } from "../Checkbox.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { ListItem, ListProps } from "../List.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { MultiSelectProps } from "./MultiSelect.js";
import type { SearchProps } from "./Search.js";

export type TransferListState = "idle" | "selecting" | "transferring" | "partial" | "invalid" | "empty-source" | "empty-target" | "disabled";
export type TransferListDensity = "sm" | "md" | "lg";
export type TransferListSide = "source" | "target";

export interface TransferListItem extends Omit<ListItem, "key"> {
  key?: string;
  value?: string;
  description?: string;
  selected?: boolean;
  status?: Partial<BadgeProps> & { label: string };
}

export interface TransferListProps extends FlowDataAttributes {
  label?: string;
  density?: TransferListDensity;
  state?: TransferListState;
  disabled?: boolean;
  transferring?: boolean;
  partial?: boolean;
  invalid?: boolean;
  sourceLabel?: string;
  targetLabel?: string;
  source?: TransferListItem[];
  target?: TransferListItem[];
  selectedSourceKeys?: string[];
  selectedTargetKeys?: string[];
  search?: Partial<SearchProps>;
  filterInput?: Partial<InputProps>;
  multiSelect?: Partial<MultiSelectProps>;
  moveToTargetAction?: ButtonProps;
  moveToSourceAction?: ButtonProps;
  validation?: Partial<InlineValidationProps>;
  feedback?: ToastProps;
  className?: string;
  onSourceSelect?: ListProps["onSelect"];
  onTargetSelect?: ListProps["onSelect"];
  onItemCheckedChange?: (side: TransferListSide, key: string, checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface TransferListComponent extends ForwardRefExoticComponent<TransferListProps & RefAttributes<HTMLDivElement>> {
  displayName: "TransferList";
}

export const TransferList: TransferListComponent;
