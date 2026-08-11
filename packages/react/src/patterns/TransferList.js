import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import { InlineValidation } from "../InlineValidation.js";
import { Input } from "../Input.js";
import { List } from "../List.js";
import { Toast } from "../Toast.js";
import { MultiSelect } from "./MultiSelect.js";
import { Search } from "./Search.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function resolveState({ sourceCount, targetCount, selectedCount, transferring, partial, invalid, disabled, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (invalid || state === "invalid") return "invalid";
  if (partial || state === "partial") return "partial";
  if (transferring || state === "transferring") return "transferring";
  if (sourceCount === 0 || state === "empty-source") return "empty-source";
  if (targetCount === 0 || state === "empty-target") return "empty-target";
  if (selectedCount > 0 || state === "selecting") return "selecting";
  return state ?? "idle";
}

function itemKey(item, index) {
  return item.key ?? item.value ?? `${item.label}-${index}`;
}

function toListItem(item, index, isDisabled) {
  return {
    key: itemKey(item, index),
    label: item.label,
    meta: item.meta ?? item.description,
    value: item.valueLabel,
    icon: item.icon,
    tone: item.tone,
    disabled: isDisabled || item.disabled,
    state: isDisabled || item.disabled ? "disabled" : item.selected ? "selected" : item.state ?? "default",
  };
}

function renderCheckbox(item, index, density, isDisabled, side, onItemCheckedChange) {
  const key = itemKey(item, index);
  return React.createElement(Checkbox, {
    key: `${side}-${key}-checkbox`,
    label: item.label,
    description: item.description,
    variant: "compact",
    density,
    checked: Boolean(item.selected),
    disabled: isDisabled || item.disabled,
    value: String(key),
    onCheckedChange: (checked, meta, event) => onItemCheckedChange?.(side, key, checked, meta, event),
  });
}

export const TransferList = forwardRef(function TransferList({
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
  const sourceItems = (Array.isArray(source) ? source : []).filter((item) => item?.label);
  const targetItems = (Array.isArray(target) ? target : []).filter((item) => item?.label);
  const selectedCount = selectedSourceKeys.length + selectedTargetKeys.length + sourceItems.filter((item) => item.selected).length + targetItems.filter((item) => item.selected).length;
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
      })
      : null,
    filterInput
      ? React.createElement(Input, {
        ...filterInput,
        label: filterInput.label ?? "Filter items",
        density: filterInput.density ?? density,
        disabled: isDisabled || filterInput.disabled,
        state: filterInput.state ?? (filterInput.value ? "filled" : "default"),
      })
      : null,
    multiSelect
      ? React.createElement(MultiSelect, {
        ...multiSelect,
        label: multiSelect.label ?? `${label} selected values`,
        density: multiSelect.density ?? density,
        disabled: isDisabled || multiSelect.disabled,
      })
      : null,
    React.createElement(Badge, {
	      label: `${sourceItems.length} available`,
	      tone: sourceItems.length ? "info" : "warning",
	      variant: "status",
	      density,
	      state: isDisabled ? "disabled" : "default",
      live: true,
    }),
    React.createElement(List, {
      label: sourceLabel,
      items: sourceItems.map((item, index) => toListItem(item, index, isDisabled)),
      variant: "standard",
      interactive: true,
      density,
      state: isDisabled ? "disabled" : sourceItems.length ? "default" : "disabled",
      onSelect: onSourceSelect,
    }),
    sourceItems.map((item, index) => renderCheckbox(item, index, density, isDisabled, "source", onItemCheckedChange)),
    React.createElement(Button, {
      ...(moveToTargetAction ?? {}),
      label: moveToTargetAction?.label ?? "Move selected",
      variant: moveToTargetAction?.variant ?? "primary",
      density: moveToTargetAction?.density ?? density,
      disabled: isDisabled || selectedSourceKeys.length === 0 || moveToTargetAction?.disabled,
      loading: resolvedState === "transferring" || moveToTargetAction?.loading,
    }),
    React.createElement(Button, {
      ...(moveToSourceAction ?? {}),
      label: moveToSourceAction?.label ?? "Move back",
      variant: moveToSourceAction?.variant ?? "secondary",
      density: moveToSourceAction?.density ?? density,
      disabled: isDisabled || selectedTargetKeys.length === 0 || moveToSourceAction?.disabled,
      loading: resolvedState === "transferring" || moveToSourceAction?.loading,
    }),
    React.createElement(Badge, {
      label: `${targetItems.length} selected`,
      tone: targetItems.length ? "success" : "neutral",
      variant: "status",
      density,
      live: true,
    }),
    React.createElement(List, {
      label: targetLabel,
      items: targetItems.map((item, index) => toListItem(item, index, isDisabled)),
      variant: "standard",
      interactive: true,
      density,
      state: isDisabled ? "disabled" : targetItems.length ? "default" : "disabled",
      onSelect: onTargetSelect,
    }),
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
      })
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      })
      : null,
  );
});

TransferList.displayName = "TransferList";
