import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateAction } from "../EmptyState.js";
import type { SelectDensity, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";

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
  onValueChange?: (value: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface SelectOptionLayerComponent extends ForwardRefExoticComponent<SelectOptionLayerProps & RefAttributes<HTMLDivElement>> {
  displayName: "SelectOptionLayer";
}

export const SelectOptionLayer: SelectOptionLayerComponent;
