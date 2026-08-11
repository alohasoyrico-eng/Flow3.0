import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AuditEventProps } from "../AuditEvent.js";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { ChipProps } from "../Chip.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { ListProps } from "../List.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type TimelineState = "default" | "loading" | "empty" | "filtered" | "error" | "permission-blocked";
export type TimelineDensity = AuditEventProps["density"];

export interface TimelineEvent {
  key: string;
  label: string;
  description?: string;
  meta?: string;
  actor?: string;
  timestamp?: string;
  status?: string;
  statusLabel?: string;
  tone?: AuditEventProps["tone"];
  state?: AuditEventProps["state"];
  icon?: string;
  disabled?: boolean;
}

export interface TimelineFilter extends Omit<ChipProps, "children"> {
  key?: string;
  label: string;
}

export interface TimelineRecovery extends Partial<EmptyStateProps> {}

export interface TimelineProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: TimelineDensity;
  state?: TimelineState;
  loading?: boolean;
  empty?: boolean;
  error?: boolean;
  permissionBlocked?: boolean;
  filtered?: boolean;
  events?: TimelineEvent[];
  filters?: TimelineFilter[];
  status?: Partial<BadgeProps>;
  selectedKey?: string;
  recovery?: TimelineRecovery;
  clearAction?: Partial<ButtonProps>;
  className?: string;
  onEventSelect?: ListProps["onSelect"];
  onFilterRemove?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onClear?: (event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface TimelineComponent extends ForwardRefExoticComponent<TimelineProps & RefAttributes<HTMLDivElement>> {
  displayName: "Timeline";
}

export const Timeline: TimelineComponent;
