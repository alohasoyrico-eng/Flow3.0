import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Checkbox } from "../Checkbox.js";
import type { CheckboxDensity } from "../Checkbox.js";
import { Chip } from "../Chip.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Tag } from "../Tag.js";
import type { TagProps } from "../Tag.js";
import { Tooltip } from "../Tooltip.js";
import type { TooltipProps } from "../Tooltip.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type ChartLegendItemState = "default" | "selected" | "hidden" | "disabled" | "loading" | "error";
export type ChartLegendItemControl = "checkbox" | "chip" | "button";
export type ChartLegendItemDensity = CheckboxDensity;

export interface ChartLegendItemToggleMeta {
  label: string;
  hidden: boolean;
  state: ChartLegendItemState;
  meta?: unknown;
}

export interface ChartLegendItemProps extends FlowDataAttributes {
  label: string;
  value?: string;
  description?: string;
  colorLabel?: string;
  density?: ChartLegendItemDensity;
  state?: ChartLegendItemState;
  selected?: boolean;
  hidden?: boolean;
  loading?: boolean;
  disabled?: boolean;
  error?: boolean;
  control?: ChartLegendItemControl;
  status?: Partial<BadgeProps> & { label: string };
  tag?: Partial<TagProps> & { label: string };
  tooltip?: Partial<TooltipProps> & { label: string };
  action?: Partial<ButtonProps> & { label: string; key?: string };
  className?: string;
  onToggle?: (checked: boolean, meta: ChartLegendItemToggleMeta, event?: MouseEvent<HTMLElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ChartLegendItemComponent extends ForwardRefExoticComponent<ChartLegendItemProps & RefAttributes<HTMLDivElement>> {
  displayName: "ChartLegendItem";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  disabled,
  loading,
  hidden,
  selected,
  error,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  hidden: boolean;
  selected: boolean;
  error: boolean;
  state: ChartLegendItemState | undefined;
}): ChartLegendItemState {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (hidden || state === "hidden") return "hidden";
  if (selected || state === "selected") return "selected";
  return state ?? "default";
}

function surfaceStateFor(state: ChartLegendItemState): SurfaceProps["state"] | "critical" {
  if (state === "disabled") return "disabled";
  if (state === "error") return "critical";
  if (state === "selected") return "selected";
  return "default";
}

function coerceToggleEvent(event: ChangeEvent<HTMLInputElement>): MouseEvent<HTMLElement> {
  return event as unknown as MouseEvent<HTMLElement>;
}

export const ChartLegendItem = forwardRef<HTMLDivElement, ChartLegendItemProps>(function ChartLegendItem({
  label,
  value,
  description,
  colorLabel,
  density = "sm",
  state,
  selected = false,
  hidden = false,
  loading = false,
  disabled = false,
  error = false,
  control = "checkbox",
  status,
  tag,
  tooltip,
  action,
  className = "",
  onToggle,
  onAction,
  ...rest
}, ref) {
  if (!label) return null;
  const resolvedState = resolveState({ disabled, loading, hidden, selected, error, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading";
  const checked = !hidden && (selected || resolvedState === "selected" || resolvedState === "default");

  const handleToggle = (nextChecked: boolean, meta: unknown, event: ChangeEvent<HTMLInputElement>) => {
    onToggle?.(nextChecked, { label, hidden: !nextChecked, state: resolvedState, meta }, coerceToggleEvent(event));
  };

  const toggleControl = control === "chip"
    ? React.createElement(Chip, {
      label,
      selected: checked,
      disabled: isDisabled,
      removable: false,
      density,
      onClick: (event: MouseEvent<HTMLButtonElement>) => onToggle?.(!checked, { label, hidden: checked, state: resolvedState }, event),
      "data-flow-slot": "toggle",
    })
    : control === "button"
      ? React.createElement(Button, {
        label,
        variant: checked ? "primary" : "secondary",
        disabled: isDisabled,
        density,
        onClick: (event: MouseEvent<HTMLButtonElement>) => onToggle?.(!checked, { label, hidden: checked, state: resolvedState }, event),
        "data-flow-slot": "toggle",
      })
      : React.createElement(Checkbox, {
        label,
        ...(description !== undefined ? { description } : {}),
        checked,
        disabled: isDisabled,
        density,
        state: checked ? "checked" : "unchecked",
        onCheckedChange: handleToggle,
        "data-flow-slot": "toggle",
      });

  return React.createElement(
    Surface,
    {
      ref,
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState),
      density,
      className,
      role: "group",
      "aria-label": `${label}${value ? ` ${value}` : ""}`,
      "aria-disabled": isDisabled ? "true" : undefined,
      "data-flow-pattern": "chart-legend-item",
      "data-flow-slot": "legendSurface",
      "data-state": resolvedState,
      "data-density": density,
      ...sanitizeRestProps(rest),
    } as SurfaceProps,
    toggleControl,
    value ? React.createElement(Badge, {
      label: value,
      tone: "neutral",
      state: resolvedState,
      density,
      "data-flow-slot": "value",
    } as BadgeProps) : null,
    colorLabel ? React.createElement(Tag, {
      label: colorLabel,
      tone: "neutral",
      state: resolvedState,
      density,
      "data-flow-slot": "seriesLabel",
    } as TagProps) : null,
    status?.label ? React.createElement(Badge, { ...status, density: status.density ?? density, "data-flow-slot": "status" } as BadgeProps) : null,
    tag?.label ? React.createElement(Tag, { ...tag, density: tag.density ?? density, "data-flow-slot": "status" } as TagProps) : null,
    tooltip?.label ? React.createElement(Tooltip, { ...tooltip, density: tooltip.density ?? density, "data-flow-slot": "status" } as TooltipProps) : null,
    action?.label ? React.createElement(Button, {
      ...action,
      density: action.density ?? density,
      variant: action.variant ?? "ghost",
      disabled: isDisabled || action.disabled,
      onClick: (event: MouseEvent<HTMLButtonElement>) => {
        action.onClick?.(event);
        if (event.defaultPrevented) return;
        onAction?.(action.key ?? action.label, event);
      },
      "data-flow-slot": "toggle",
    } as ButtonProps) : null,
  );
}) as ChartLegendItemComponent;

ChartLegendItem.displayName = "ChartLegendItem";
