import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CheckboxDensity } from "../Checkbox.js";
import type { TagProps } from "../Tag.js";
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

export const ChartLegendItem: ChartLegendItemComponent;
