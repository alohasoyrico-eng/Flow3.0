import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { CheckboxProps, CheckboxValueMeta } from "../Checkbox.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { KpiTileProps } from "../KpiTile.js";
import type { SelectProps } from "../Select.js";
import type { StepperProps } from "../Stepper.js";
import type { TableProps } from "../Table.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { SettingsProps } from "./Settings.js";

export type FleetManagerOnboardingDesktopState = "not-started" | "in-progress" | "blocked" | "validating" | "complete" | "empty" | "permission-blocked" | "disabled";
export type FleetManagerOnboardingDesktopDensity = ButtonProps["density"];

export interface FleetManagerOnboardingDesktopMetric extends Partial<KpiTileProps> {
  key?: string;
  label: string;
  value: KpiTileProps["value"];
  tone?: BadgeProps["tone"];
}

export interface FleetManagerOnboardingDesktopTask extends Partial<CheckboxProps> {
  key?: string;
  id?: string;
  label: string;
}

export interface FleetManagerOnboardingDesktopProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FleetManagerOnboardingDesktopDensity;
  state?: FleetManagerOnboardingDesktopState;
  disabled?: boolean;
  inProgress?: boolean;
  blocked?: boolean;
  validating?: boolean;
  complete?: boolean;
  empty?: boolean;
  permissionBlocked?: boolean;
  steps?: StepperProps["steps"];
  currentStep?: StepperProps["current"];
  metrics?: FleetManagerOnboardingDesktopMetric[];
  tasks?: FleetManagerOnboardingDesktopTask[];
  fields?: Array<Partial<InputProps> & { key?: string }>;
  selects?: Array<Partial<SelectProps> & { key?: string }>;
  reviewColumns?: TableProps["columns"];
  reviewRows?: TableProps["rows"];
  settings?: Partial<SettingsProps>;
  validation?: Partial<InlineValidationProps>;
  primaryAction?: Omit<ButtonProps, "children" | "fullWidth"> & { key?: string };
  secondaryAction?: Omit<ButtonProps, "children" | "fullWidth"> & { key?: string };
  emptyState?: Partial<EmptyStateProps>;
  feedback?: Partial<ToastProps>;
  className?: string;
  onTaskChange?: (key: string, checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FleetManagerOnboardingDesktopComponent extends ForwardRefExoticComponent<FleetManagerOnboardingDesktopProps & RefAttributes<HTMLDivElement>> {
  displayName: "FleetManagerOnboardingDesktop";
}

export const FleetManagerOnboardingDesktop: FleetManagerOnboardingDesktopComponent;
