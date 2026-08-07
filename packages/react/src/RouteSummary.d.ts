import type {
  HTMLAttributes,
  ForwardRefExoticComponent,
  MouseEvent,
  RefAttributes,
} from "react";
import type { routeSummaryPlatformContract } from "@design-system/components/platforms";
import type { ButtonIntent, ButtonVariant } from "./Button.js";
import type { IconButtonVariant } from "./IconButton.js";

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
  variant?: ButtonVariant | IconButtonVariant;
  intent?: ButtonIntent;
  density?: RouteSummaryDensity;
  disabled?: boolean;
  loading?: boolean;
  onAction?: (key: string, action: RouteSummaryAction, event: MouseEvent<HTMLButtonElement>) => void;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface RouteSummaryProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
