import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Card } from "../Card.js";
import type { CardProps } from "../Card.js";
import { DateRangePicker } from "../DateRangePicker.js";
import type { DateRangePickerDensity, DateRangePickerProps, DateRangePickerValue, DateRangePickerValueChangeEvent } from "../DateRangePicker.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { List } from "../List.js";
import type { ListItem, ListProps, ListState } from "../List.js";
import { Popover } from "../Popover.js";
import type { PopoverProps } from "../Popover.js";
import { Skeleton } from "../Skeleton.js";
import type { SkeletonProps } from "../Skeleton.js";
import { Surface } from "../Surface.js";
import { Tooltip } from "../Tooltip.js";
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

type CalendarViewRestProps = Record<string, unknown>;

interface ResolveStateInput {
  disabled: boolean;
  loading: boolean;
  error: boolean;
  empty: boolean;
  dense: boolean;
  selectedKey?: string | undefined;
  rangeChanging: boolean;
  state?: CalendarViewState | undefined;
}

function sanitizeRestProps(rest: CalendarViewRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeEvents(events: CalendarViewEvent[] | undefined): CalendarViewEvent[] {
  return (Array.isArray(events) ? events : []).filter((event) => Boolean(event?.key && event.label));
}

function resolveState({
  disabled,
  loading,
  error,
  empty,
  dense,
  selectedKey,
  rangeChanging,
  state,
}: ResolveStateInput): CalendarViewState {
  if (disabled || state === "disabled") return "disabled";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (empty || state === "empty") return "empty";
  if (rangeChanging || state === "range-changing") return "range-changing";
  if (dense || state === "dense") return "dense";
  if (selectedKey || state === "selected") return "selected";
  return state ?? "default";
}

function eventTone(event: CalendarViewEvent): BadgeProps["tone"] {
  if (event.tone) return event.tone;
  if (event.status === "warning") return "warning";
  if (event.status === "danger") return "danger";
  if (event.status === "success") return "success";
  return "info";
}

function listStateFor(event: CalendarViewEvent): ListState {
  if (event.state === "selected" || event.state === "loading" || event.state === "error" || event.state === "disabled") return event.state;
  return "default";
}

function toListItem(event: CalendarViewEvent, isDisabled: boolean, selectedKey: string | undefined): ListItem {
  const disabled = Boolean(isDisabled || event.disabled);
  return {
    key: event.key,
    label: event.label,
    meta: event.description ?? event.time,
    value: event.value ?? event.owner,
    icon: event.icon ?? "event",
    state: disabled ? "disabled" : selectedKey === event.key ? "selected" : listStateFor(event),
    disabled,
  };
}

export const CalendarView = forwardRef<HTMLDivElement, CalendarViewProps>(function CalendarView({
  label = "Calendar",
  description,
  density,
  state,
  disabled = false,
  loading = false,
  empty = false,
  error = false,
  dense = false,
  rangeChanging = false,
  dateControl,
  selectedDate,
  rangeLabel,
  timezoneLabel,
  events = [],
  selectedKey,
  actions = [],
  detail,
  emptyState,
  skeleton,
  className = "",
  onDateChange,
  onEventSelect,
  onAction,
  ...rest
}, ref) {
  const normalizedEvents = normalizeEvents(events);
  const resolvedState = resolveState({
    disabled,
    loading,
    error,
    empty: empty || normalizedEvents.length === 0,
    dense,
    selectedKey,
    rangeChanging,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled";
  const showLoading = resolvedState === "loading" || resolvedState === "range-changing";
  const showEmpty = resolvedState === "empty";
  const showError = resolvedState === "error";
  const selectedEvent = normalizedEvents.find((event) => event.key === selectedKey);

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": showLoading ? "true" : undefined,
      "data-flow-pattern": "calendar-view",
      "data-state": resolvedState,
      "data-density": density,
      "data-event-count": String(normalizedEvents.length),
      "data-selected-date": selectedDate ?? dateControl?.from ?? dateControl?.value?.from,
      ...sanitizeRestProps(rest),
    },
    React.createElement(Surface, {
      surfaceRole: "section",
      state: isDisabled ? "disabled" : "default",
      density,
      "data-calendar-view-surface": "true",
    } as ComponentProps<typeof Surface>,
      React.createElement(DateRangePicker, {
        ...(dateControl ?? {}),
        label: dateControl?.label ?? `${label} date`,
        value: dateControl?.value ?? (selectedDate ? { from: selectedDate, to: selectedDate } : undefined),
        from: dateControl?.from ?? selectedDate,
        to: dateControl?.to ?? selectedDate,
        helper: dateControl?.helper ?? [rangeLabel, timezoneLabel].filter(Boolean).join(" · "),
        density: dateControl?.density ?? density,
        state: dateControl?.state ?? (isDisabled ? "disabled" : selectedDate || dateControl?.from || dateControl?.value?.from ? "selected" : "default"),
        disabled: isDisabled || dateControl?.disabled,
        onValueChange: (value, event) => {
          dateControl?.onValueChange?.(value, event);
          onDateChange?.(value, event);
        },
      } as ComponentProps<typeof DateRangePicker>),
      rangeLabel
        ? React.createElement(Badge, {
          label: rangeLabel,
          tone: dense ? "warning" : "info",
          variant: "status",
          density,
          state: isDisabled ? "disabled" : "default",
          live: true,
        } as ComponentProps<typeof Badge>)
        : null,
      timezoneLabel
        ? React.createElement(Tooltip, {
          triggerLabel: "Calendar timezone",
          content: timezoneLabel,
          variant: "icon-help",
          density,
          open: detail?.timezoneOpen,
        } as ComponentProps<typeof Tooltip>)
        : null,
      actions.filter((action) => Boolean(action?.label)).map((action) => React.createElement(Button, {
        ...action,
        key: action.key ?? action.label,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "secondary",
        disabled: isDisabled || action.disabled,
        onClick: (event) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(action.key ?? action.label, event);
        },
      } as ComponentProps<typeof Button>)),
      showLoading
        ? React.createElement(Skeleton, {
          label: skeleton?.label ?? `${label} loading`,
          variant: skeleton?.variant ?? "card",
          rows: skeleton?.rows ?? 3,
          density,
          state: "loading",
          fullWidth: true,
        } as ComponentProps<typeof Skeleton>)
        : null,
      showError || showEmpty
        ? React.createElement(EmptyState, {
          title: emptyState?.title ?? (showError ? `${label} unavailable` : `No events in ${rangeLabel ?? "this period"}`),
          description: emptyState?.description ?? description,
          icon: emptyState?.icon ?? (showError ? "error" : "event_busy"),
          action: emptyState?.action,
          variant: emptyState?.variant ?? (showError ? "error" : "search-empty"),
          state: emptyState?.state ?? (showError ? "error" : "search-empty"),
          density,
          fullWidth: true,
          onAction: emptyState?.onAction,
        } as ComponentProps<typeof EmptyState>)
        : null,
      !showLoading && !showError && normalizedEvents.length
        ? React.createElement(List, {
          label: `${label} events`,
          items: normalizedEvents.map((event) => toListItem(event, isDisabled, selectedKey)),
          variant: dense ? "compact" : "standard",
          interactive: true,
          density,
          state: isDisabled ? "disabled" : "default",
          selectedKey,
          onSelect: onEventSelect,
        } as ComponentProps<typeof List>)
        : null,
      !showLoading && !showError
        ? normalizedEvents.map((event) => React.createElement(Card, {
          key: `${event.key}-card`,
          title: event.label,
          value: event.time,
          detail: event.description,
          status: React.createElement(Badge, {
            label: event.statusLabel ?? event.status ?? "Scheduled",
            tone: eventTone(event),
            variant: "status",
            density,
            state: isDisabled ? "disabled" : "default",
          } as ComponentProps<typeof Badge>),
          icon: event.icon ?? "event",
          variant: event.cardVariant ?? "minimal",
          composition: "compact",
          state: isDisabled || event.disabled ? "disabled" : selectedKey === event.key ? "selected" : "default",
          density,
          fullWidth: true,
        } as ComponentProps<typeof Card>))
        : null,
      selectedEvent || detail?.title
        ? React.createElement(Popover, {
          triggerLabel: detail?.triggerLabel ?? "Event details",
          title: detail?.title ?? selectedEvent?.label ?? "Event details",
          description: detail?.description ?? selectedEvent?.description,
          open: detail?.open,
          variant: detail?.variant ?? "information",
          placement: detail?.placement ?? "bottom",
          density,
          disabled: isDisabled || detail?.disabled,
          actions: detail?.actions,
          field: detail?.field,
          onOpenChange: detail?.onOpenChange,
          onAction: detail?.onAction,
        } as ComponentProps<typeof Popover>)
        : null,
    ),
  );
}) as CalendarViewComponent;

CalendarView.displayName = "CalendarView";
