import React, { forwardRef, useMemo } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeTone } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Card } from "../Card.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { Select } from "../Select.js";
import type { SelectDensity, SelectOpenChangeEvent, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";

export type SelectOptionLayerState =
  | "closed"
  | "open"
  | "loading"
  | "empty"
  | "error"
  | "permission-blocked"
  | "stale"
  | "disabled";

export interface SelectOptionLayerOption {
  label: string;
  value: string;
  meta?: string;
  group?: string;
  reason?: string;
  tone?: BadgeTone;
  disabled?: boolean;
  unavailable?: boolean;
}

export interface SelectOptionLayerGroup {
  label: string;
  options: SelectOptionLayerOption[];
}

export interface SelectOptionLayerValidation {
  label?: string;
  message: string;
  state?: "default" | "info" | "success" | "warning" | "error" | "disabled";
  live?: boolean;
}

export interface SelectOptionLayerEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
}

export interface SelectOptionLayerProps {
  label: string;
  helper?: string;
  options?: SelectOptionLayerOption[];
  groups?: SelectOptionLayerGroup[];
  value?: string;
  name?: string;
  density?: SelectDensity;
  state?: SelectOptionLayerState;
  disabled?: boolean;
  empty?: SelectOptionLayerEmptyState;
  validation?: SelectOptionLayerValidation;
  action?: ButtonProps & { key?: string };
  className?: string;
  onOpenChange?: (open: boolean, event?: SelectOpenChangeEvent) => void;
  onValueChange?: (value: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface SelectOptionLayerComponent extends ForwardRefExoticComponent<SelectOptionLayerProps & RefAttributes<HTMLDivElement>> {
  displayName: "SelectOptionLayer";
}

type SelectOptionLayerRestProps = Record<string, unknown>;
type NormalizedSelectOption = Required<Pick<SelectOptionLayerOption, "label" | "value" | "meta" | "reason" | "group" | "unavailable">> &
  Pick<SelectOptionLayerOption, "disabled"> & {
    tone?: BadgeTone | undefined;
  };

function sanitizeRestProps(rest: SelectOptionLayerRestProps): Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as Record<`data-${string}` | `aria-${string}`, string | number | boolean | undefined>;
}

function normalizeOption(option: SelectOptionLayerOption | null | undefined): NormalizedSelectOption | null {
  if (!option?.label || option.value === undefined || option.value === null || option.value === "") return null;
  const unavailable = Boolean(option.disabled || option.unavailable);
  return {
    label: option.label,
    value: String(option.value),
    meta: option.reason || option.group || option.meta || "",
    reason: option.reason || "",
    group: option.group || "",
    tone: option.tone,
    disabled: unavailable,
    unavailable,
  };
}

function normalizeOptions(
  groups: SelectOptionLayerGroup[] | null | undefined,
  options: SelectOptionLayerOption[] | null | undefined,
): NormalizedSelectOption[] {
  const groupedOptions = Array.isArray(groups)
    ? groups.flatMap((group) => (group?.options ?? []).map((option) => ({
      ...option,
      group: option.group || group.label,
    })))
    : [];
  return (groupedOptions.length ? groupedOptions : Array.isArray(options) ? options : [])
    .map(normalizeOption)
    .filter((option): option is NormalizedSelectOption => Boolean(option));
}

function actionKey(action: ButtonProps & { key?: string }): string {
  return String(action.key ?? action.label);
}

export const SelectOptionLayer = forwardRef<HTMLDivElement, SelectOptionLayerProps>(function SelectOptionLayer({
  label,
  helper = "",
  options,
  groups,
  value,
  name = "",
  density,
  state = "closed",
  disabled = false,
  empty,
  validation,
  action,
  onOpenChange,
  onValueChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const normalizedOptions = useMemo(() => normalizeOptions(groups, options), [groups, options]);
  const resolvedState = disabled ? "disabled" : state;
  const hasOptions = normalizedOptions.length > 0;
  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      "data-flow-pattern": "select-option-layer",
      "data-state": resolvedState,
      "data-density": density,
      "data-has-options": String(hasOptions),
      ...sanitizeRestProps(rest),
    },
    hasOptions
      ? React.createElement(
        React.Fragment,
        null,
        React.createElement(Select, {
          label,
          helper,
          options: normalizedOptions,
          value,
          name,
          density,
          state: resolvedState === "open" ? "open" : resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
          disabled: disabled || resolvedState === "disabled",
          onOpenChange,
          onValueChange,
        } as ComponentProps<typeof Select>),
        React.createElement(
          "div",
          {
            role: "list",
            "aria-label": `${label} option states`,
            "data-flow-slot": "option-layer",
          },
          normalizedOptions.map((option) => React.createElement(Card, {
            key: option.value,
            title: option.label,
            detail: option.reason || option.meta || helper,
            status: React.createElement(Badge, {
              label: option.unavailable ? "Unavailable" : option.value === value ? "Selected" : option.group || "Available",
              tone: option.unavailable ? "warning" : option.value === value ? "success" : option.tone ?? "neutral",
              variant: "status",
              state: option.unavailable ? "warning" : option.value === value ? "success" : "default",
              density,
            } as ComponentProps<typeof Badge>),
            variant: "minimal",
            composition: "compact",
            state: option.unavailable ? "disabled" : option.value === value ? "selected" : "default",
            density,
            "data-flow-slot": "option-card",
            "data-option-value": option.value,
          } as ComponentProps<typeof Card>)),
        ),
      )
      : React.createElement(EmptyState, {
        title: empty?.title ?? "No options available",
        description: empty?.description ?? helper,
        icon: empty?.icon,
        density,
        state: "search-empty",
        variant: "search-empty",
        action: empty?.action,
        onAction,
      } as ComponentProps<typeof EmptyState>),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "error" ? "error" : "default"),
        density,
        live: validation.live,
      } as ComponentProps<typeof InlineValidation>)
      : null,
    action?.label
      ? React.createElement(Button, {
        ...action,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "secondary",
        onClick: (event) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(actionKey(action), event);
        },
      } as ComponentProps<typeof Button>)
      : null,
  );
}) as SelectOptionLayerComponent;

SelectOptionLayer.displayName = "SelectOptionLayer";
