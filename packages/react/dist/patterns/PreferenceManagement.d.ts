import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { InputValueMeta } from "../Input.js";
import type { SwitchValueMeta } from "../Switch.js";
import type { TextAreaChangeMeta } from "../TextArea.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ConfirmationDialogProps } from "./ConfirmationDialog.js";
import type { FormSectionProps } from "./FormSection.js";
import type { SettingsControlChangeEvent, SettingsControlChangeMeta, SettingsProps } from "./Settings.js";

export type PreferenceManagementState =
  | "idle"
  | "dirty"
  | "saving"
  | "saved"
  | "invalid"
  | "danger-confirming"
  | "permission-blocked"
  | "disabled";

export type PreferenceManagementDensity = NonNullable<SettingsProps["density"]>;

export interface PreferenceManagementSummary extends Pick<BadgeProps, "label" | "tone" | "state" | "density"> {}

export interface PreferenceManagementSection extends FormSectionProps {
  key?: string;
}

export interface PreferenceManagementDangerZone extends ConfirmationDialogProps {}

export interface PreferenceManagementProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: PreferenceManagementDensity;
  state?: PreferenceManagementState;
  dirty?: boolean;
  saving?: boolean;
  disabled?: boolean;
  permissionBlocked?: boolean;
  summary?: PreferenceManagementSummary;
  settings?: SettingsProps;
  sections?: PreferenceManagementSection[];
  dangerZone?: PreferenceManagementDangerZone;
  className?: string;
  onSettingsControlChange?: (
    key: string,
    value: string | boolean,
    meta: SettingsControlChangeMeta,
    event: SettingsControlChangeEvent
  ) => void;
  onSettingsSave?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSettingsReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  onSectionFieldValueChange?: (
    sectionKey: string,
    fieldKey: string,
    value: string,
    meta: InputValueMeta | TextAreaChangeMeta,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  onSectionAction?: (sectionKey: string, actionKey: string, event: MouseEvent<HTMLButtonElement>) => void;
  onDangerOpenChange?: NonNullable<ConfirmationDialogProps["onOpenChange"]>;
  onDangerConfirm?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDangerCancel?: (event: MouseEvent<HTMLButtonElement>) => void;
  onDangerRecoveryAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PreferenceManagementComponent extends ForwardRefExoticComponent<PreferenceManagementProps & RefAttributes<HTMLDivElement>> {
  displayName: "PreferenceManagement";
}

export const PreferenceManagement: PreferenceManagementComponent;
