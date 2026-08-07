import type {
  HTMLAttributes,
  ForwardRefExoticComponent,
  RefAttributes,
} from "react";
import type { routeSummaryPlatformContract } from "@design-system/components/platforms";

export type RouteSummaryVariant = "standard" | "compact" | "compare" | "policy";
export type RouteSummaryState = "default" | "hover" | "focus" | "selected" | "warning" | "disabled";
export type RouteSummaryDensity = "sm" | "md" | "lg";
export type RouteSummaryTone = "neutral" | "info" | "warning";

export interface RouteMetric {
  key?: string;
  label: string;
  value: string;
}

export interface RouteSummaryAction {
  key?: string;
  label?: string;
  ariaLabel?: string;
  icon?: string;
  trailingIcon?: string;
  variant?: string;
  intent?: string;
  density?: RouteSummaryDensity;
  disabled?: boolean;
  loading?: boolean;
  onAction?: () => void;
  onClick?: () => void;
}

export interface RouteSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "style"> {
  label: string;
  description?: string;
  metrics?: RouteMetric[];
  actions?: RouteSummaryAction[];
  variant?: RouteSummaryVariant;
  state?: RouteSummaryState;
  density?: RouteSummaryDensity;
  tone?: RouteSummaryTone;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export interface RouteSummaryComponent extends ForwardRefExoticComponent<RouteSummaryProps & RefAttributes<HTMLElement>> {
  displayName: "RouteSummary";
  platformContract: typeof routeSummaryPlatformContract;
}

export const RouteSummary: RouteSummaryComponent;
