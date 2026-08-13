import React, { forwardRef } from "react";
import type { ChangeEvent, ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxValueMeta } from "../Checkbox.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Input } from "../Input.js";
import type { InputProps } from "../Input.js";
import { List } from "../List.js";
import type { ListItem, ListProps } from "../List.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { MultiSelect } from "./MultiSelect.js";
import type { MultiSelectProps } from "./MultiSelect.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";

export type TransferListState = "idle" | "selecting" | "transferring" | "partial" | "invalid" | "empty-source" | "empty-target" | "disabled";
export type TransferListDensity = "sm" | "md" | "lg";
export type TransferListSide = "source" | "target";

export interface TransferListItem extends Omit<ListItem, "key"> {
  key?: string;
  value?: string;
  valueLabel?: string;
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
  onItemCheckedChange?: (
    side: TransferListSide,
    key: string,
    checked: boolean,
    meta: CheckboxValueMeta,
    event: ChangeEvent<HTMLInputElement>,
  ) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface TransferListComponent extends ForwardRefExoticComponent<TransferListProps & RefAttributes<HTMLDivElement>> {
  displayName: "TransferList";
}

type TransferListRestProps = Record<string, unknown>;

interface TransferListStateInput {
  sourceCount: number;
  targetCount: number;
  selectedCount: number;
  transferring?: boolean | undefined;
  partial?: boolean | undefined;
  invalid?: boolean | undefined;
  disabled?: boolean | undefined;
  state?: TransferListState | undefined;
}

function sanitizeRestProps(rest: TransferListRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({
  sourceCount,
  targetCount,
  selectedCount,
  transferring,
  partial,
  invalid,
  disabled,
  state,
}: TransferListStateInput): TransferListState {
  if (disabled || state === "disabled") return "disabled";
  if (invalid || state === "invalid") return "invalid";
  if (partial || state === "partial") return "partial";
  if (transferring || state === "transferring") return "transferring";
  if (sourceCount === 0 || state === "empty-source") return "empty-source";
  if (targetCount === 0 || state === "empty-target") return "empty-target";
  if (selectedCount > 0 || state === "selecting") return "selecting";
  return state ?? "idle";
}

function itemKey(item: TransferListItem, index: number): string {
  return item.key ?? item.value ?? `${String(item.label)}-${index}`;
}

function toListItem(item: TransferListItem, index: number, isDisabled: boolean): ListItem {
  const disabled = isDisabled || item.disabled === true;
  const listItem: ListItem = {
    key: itemKey(item, index),
    label: item.label,
    state: disabled ? "disabled" : item.selected ? "selected" : item.state ?? "default",
  };
  const meta = item.meta ?? item.description;
  if (meta !== undefined) listItem.meta = meta;
  if (item.valueLabel !== undefined) listItem.value = item.valueLabel;
  if (item.icon !== undefined) listItem.icon = item.icon;
  if (item.tone !== undefined) listItem.tone = item.tone;
  if (isDisabled || item.disabled !== undefined) listItem.disabled = disabled;
  return listItem;
}

function renderCheckbox(
  item: TransferListItem,
  index: number,
  density: TransferListDensity | undefined,
  isDisabled: boolean,
  side: TransferListSide,
  onItemCheckedChange: TransferListProps["onItemCheckedChange"],
) {
  const key = itemKey(item, index);
  return React.createElement(Checkbox, {
    key: `${side}-${key}-checkbox`,
    label: item.label as string,
    description: item.description,
    variant: "compact",
    density,
    checked: Boolean(item.selected),
    disabled: isDisabled || item.disabled,
    value: String(key),
    onCheckedChange: (checked, meta, event) => onItemCheckedChange?.(side, key, checked, meta, event),
  } as ComponentProps<typeof Checkbox>);
}

function normalizeTransferItems(items: TransferListItem[] | undefined): TransferListItem[] {
  return (Array.isArray(items) ? items : []).filter((item): item is TransferListItem => Boolean(item?.label));
}

export const TransferList = forwardRef<HTMLDivElement, TransferListProps>(function TransferList({
  label = "Transfer list",
  density,
  state,
  disabled = false,
  transferring = false,
  partial = false,
  invalid = false,
  sourceLabel = "Available",
  targetLabel = "Selected",
  source = [],
  target = [],
  selectedSourceKeys = [],
  selectedTargetKeys = [],
  search,
  filterInput,
  multiSelect,
  moveToTargetAction,
  moveToSourceAction,
  validation,
  feedback,
  className = "",
  onSourceSelect,
  onTargetSelect,
  onItemCheckedChange,
  ...rest
}, ref) {
  const sourceItems = normalizeTransferItems(source);
  const targetItems = normalizeTransferItems(target);
  const selectedCount = selectedSourceKeys.length
    + selectedTargetKeys.length
    + sourceItems.filter((item) => item.selected).length
    + targetItems.filter((item) => item.selected).length;
  const resolvedState = resolveState({
    sourceCount: sourceItems.length,
    targetCount: targetItems.length,
    selectedCount,
    transferring,
    partial,
    invalid: invalid || Boolean(validation?.message && validation?.state === "error"),
    disabled,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "transferring";

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "transferring" ? "true" : undefined,
      "data-flow-pattern": "transfer-list",
      "data-state": resolvedState,
      "data-density": density,
      "data-source-count": String(sourceItems.length),
      "data-target-count": String(targetItems.length),
      "data-selected-count": String(selectedCount),
      "data-search-boundary": search ? "true" : "false",
      "data-multi-select-boundary": multiSelect ? "true" : "false",
      ...sanitizeRestProps(rest),
    },
    search
      ? React.createElement(Search, {
        ...search,
        label: search.label ?? `${label} search`,
        density: search.density ?? density,
        state: search.state ?? (search.loading ? "loading" : search.results?.length ? "results" : "idle"),
      } as ComponentProps<typeof Search>)
      : null,
    filterInput
      ? React.createElement(Input, {
        ...filterInput,
        label: filterInput.label ?? "Filter items",
        density: filterInput.density ?? density,
        disabled: isDisabled || filterInput.disabled,
        state: filterInput.state ?? (filterInput.value ? "filled" : "default"),
      } as ComponentProps<typeof Input>)
      : null,
    multiSelect
      ? React.createElement(MultiSelect, {
        ...multiSelect,
        label: multiSelect.label ?? `${label} selected values`,
        density: multiSelect.density ?? density,
        disabled: isDisabled || multiSelect.disabled,
      } as ComponentProps<typeof MultiSelect>)
      : null,
    React.createElement(Badge, {
      label: `${sourceItems.length} available`,
      tone: sourceItems.length ? "info" : "warning",
      variant: "status",
      density,
      state: isDisabled ? "disabled" : "default",
      live: true,
    } as ComponentProps<typeof Badge>),
    React.createElement(List, {
      label: sourceLabel,
      items: sourceItems.map((item, index) => toListItem(item, index, isDisabled)),
      variant: "standard",
      interactive: true,
      density,
      state: isDisabled ? "disabled" : sourceItems.length ? "default" : "disabled",
      onSelect: onSourceSelect,
    } as ComponentProps<typeof List>),
    sourceItems.map((item, index) => renderCheckbox(item, index, density, isDisabled, "source", onItemCheckedChange)),
    React.createElement(Button, {
      ...(moveToTargetAction ?? {}),
      label: moveToTargetAction?.label ?? "Move selected",
      variant: moveToTargetAction?.variant ?? "primary",
      density: moveToTargetAction?.density ?? density,
      disabled: isDisabled || selectedSourceKeys.length === 0 || moveToTargetAction?.disabled,
      loading: resolvedState === "transferring" || moveToTargetAction?.loading,
    } as ComponentProps<typeof Button>),
    React.createElement(Button, {
      ...(moveToSourceAction ?? {}),
      label: moveToSourceAction?.label ?? "Move back",
      variant: moveToSourceAction?.variant ?? "secondary",
      density: moveToSourceAction?.density ?? density,
      disabled: isDisabled || selectedTargetKeys.length === 0 || moveToSourceAction?.disabled,
      loading: resolvedState === "transferring" || moveToSourceAction?.loading,
    } as ComponentProps<typeof Button>),
    React.createElement(Badge, {
      label: `${targetItems.length} selected`,
      tone: targetItems.length ? "success" : "neutral",
      variant: "status",
      density,
      live: true,
    } as ComponentProps<typeof Badge>),
    React.createElement(List, {
      label: targetLabel,
      items: targetItems.map((item, index) => toListItem(item, index, isDisabled)),
      variant: "standard",
      interactive: true,
      density,
      state: isDisabled ? "disabled" : targetItems.length ? "default" : "disabled",
      onSelect: onTargetSelect,
    } as ComponentProps<typeof List>),
    targetItems.map((item, index) => renderCheckbox(item, index, density, isDisabled, "target", onItemCheckedChange)),
    validation
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        value: validation.value,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" ? "error" : "info"),
        density,
        fullWidth: true,
        field: validation.field ?? true,
        live: validation.live ?? true,
      } as ComponentProps<typeof InlineValidation>)
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ComponentProps<typeof Toast>)
      : null,
  );
}) as TransferListComponent;

TransferList.displayName = "TransferList";
