import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { DialogAction, DialogOpenChangeEvent, DialogTone, DialogVariant } from "../Dialog.js";
import type { InputDensity, InputValueMeta, InputVariant } from "../Input.js";
import type { SelectOption, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";
import type { SwitchValueMeta } from "../Switch.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SettingsState = "idle" | "dirty" | "saving" | "saved" | "invalid" | "resetting" | "permission-blocked" | "disabled";
export type SettingsDensity = InputDensity;
export type SettingsControlKind = "input" | "select" | "switch";

export interface SettingsControl {
  key?: string;
  kind?: SettingsControlKind;
  label: string;
  description?: string;
  name?: string;
  value?: string;
  checked?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  variant?: InputVariant;
  density?: SettingsDensity;
  disabled?: boolean;
  error?: string;
}

export interface SettingsGroup {
  key?: string;
  title: string;
  description?: string;
  controls?: SettingsControl[];
}

export interface SettingsSummary {
  title: string;
  value?: string;
  detail?: string;
  status?: string;
}

export interface SettingsValidation {
  message: string;
  description?: string;
  state?: "info" | "success" | "warning" | "error";
}

export interface SettingsConfirmation {
  label: string;
  description?: string;
  open?: boolean;
  closeLabel?: string;
  actions?: DialogAction[];
  tone?: DialogTone;
  variant?: DialogVariant;
  onOpenChange?: (open: boolean, event?: DialogOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface SettingsAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  label: string;
}

export type SettingsControlChangeMeta = InputValueMeta | SelectValueMeta | SwitchValueMeta;
export type SettingsControlChangeEvent = ChangeEvent<HTMLInputElement> | SelectValueChangeEvent;

export interface SettingsProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: SettingsDensity;
  state?: SettingsState;
  dirty?: boolean;
  saving?: boolean;
  resetting?: boolean;
  disabled?: boolean;
  permissionBlocked?: boolean;
  groups?: SettingsGroup[];
  summary?: SettingsSummary;
  validation?: SettingsValidation;
  confirmation?: SettingsConfirmation;
  feedback?: ToastProps;
  saveAction?: SettingsAction;
  resetAction?: SettingsAction;
  onControlChange?: (key: string, value: string | boolean, meta: SettingsControlChangeMeta, event: SettingsControlChangeEvent) => void;
  onSave?: (event: MouseEvent<HTMLButtonElement>) => void;
  onReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SettingsComponent extends ForwardRefExoticComponent<SettingsProps & RefAttributes<HTMLDivElement>> {
  displayName: "Settings";
}

export const Settings: SettingsComponent;
