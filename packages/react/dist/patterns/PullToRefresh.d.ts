import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { AnimatedMomentProps } from "../AnimatedMoment.js";
import type { ButtonProps } from "../Button.js";
import type { CardProps } from "../Card.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { ListDensity, ListProps } from "../List.js";
import type { ProgressIndicatorProps } from "../ProgressIndicator.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type PullToRefreshState = "idle" | "pulling" | "threshold" | "refreshing" | "complete" | "error" | "disabled" | "reduced-motion";
export type PullToRefreshDensity = ListDensity;

export interface PullToRefreshIndicator extends Partial<ProgressIndicatorProps> {
  animatedLabel?: string;
  animatedState?: AnimatedMomentProps["state"];
  progressLabel?: string;
  progressState?: ProgressIndicatorProps["state"];
  variant?: AnimatedMomentProps["variant"];
  description?: string;
  icon?: string;
  animationSource?: string;
  animationData?: AnimatedMomentProps["animationData"];
  reducedMotionFallback?: string;
  stateLabel?: string;
}

export interface PullToRefreshProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: PullToRefreshDensity;
  state?: PullToRefreshState;
  disabled?: boolean;
  reducedMotion?: boolean;
  refreshing?: boolean;
  complete?: boolean;
  error?: boolean;
  progress?: number;
  list?: Partial<ListProps>;
  cards?: CardProps[];
  indicator?: PullToRefreshIndicator;
  fallbackAction?: ButtonProps;
  validation?: Partial<InlineValidationProps>;
  feedback?: ToastProps;
  className?: string;
  onRefresh?: (event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface PullToRefreshComponent extends ForwardRefExoticComponent<PullToRefreshProps & RefAttributes<HTMLDivElement>> {
  displayName: "PullToRefresh";
}

export const PullToRefresh: PullToRefreshComponent;
