import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CardProps } from "../Card.js";
import type { DateRangePickerDensity, DateRangePickerProps, DateRangePickerValue, DateRangePickerValueChangeEvent } from "../DateRangePicker.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { ListProps } from "../List.js";
import type { PopoverProps } from "../Popover.js";
import type { SkeletonProps } from "../Skeleton.js";
import type { TooltipProps } from "../Tooltip.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type CalendarViewState = "default" | "range-changing" | "selected" | "dense" | "loading" | "empty" | "error" | "disabled";
export type CalendarViewDensity = DateRangePickerDensity;

export interface CalendarViewEvent {
  key: string;
  label: string;
  description?: string;
  time?: string;
  value?: string;
  owner?: string;
  icon?: string;
  status?: string;
  statusLabel?: string;
  tone?: BadgeProps["tone"];
  state?: CardProps["state"];
  cardVariant?: CardProps["variant"];
  disabled?: boolean;
}

export interface CalendarViewDetail extends Partial<PopoverProps> {
  timezoneOpen?: TooltipProps["open"];
}

export interface CalendarViewAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key?: string;
  label: string;
}

export interface CalendarViewProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: CalendarViewDensity;
  state?: CalendarViewState;
  disabled?: boolean;
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  dense?: boolean;
  rangeChanging?: boolean;
  dateControl?: Partial<DateRangePickerProps>;
  selectedDate?: string;
  rangeLabel?: string;
  timezoneLabel?: string;
  events?: CalendarViewEvent[];
  selectedKey?: string;
  actions?: CalendarViewAction[];
  detail?: CalendarViewDetail;
  emptyState?: Partial<EmptyStateProps>;
  skeleton?: Partial<SkeletonProps>;
  className?: string;
  onDateChange?: (value: DateRangePickerValue, event: DateRangePickerValueChangeEvent) => void;
  onEventSelect?: ListProps["onSelect"];
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface CalendarViewComponent extends ForwardRefExoticComponent<CalendarViewProps & RefAttributes<HTMLDivElement>> {
  displayName: "CalendarView";
}

export const CalendarView: CalendarViewComponent;
