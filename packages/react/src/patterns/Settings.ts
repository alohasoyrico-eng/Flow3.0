import React, { forwardRef } from "react";
import type { ChangeEvent, ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Card } from "../Card.js";
import { Dialog } from "../Dialog.js";
import type { DialogAction, DialogOpenChangeEvent, DialogTone, DialogVariant } from "../Dialog.js";
import { Input } from "../Input.js";
import type { InputDensity, InputValueMeta, InputVariant } from "../Input.js";
import { Select } from "../Select.js";
import type { SelectOption, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";
import { Surface } from "../Surface.js";
import { Switch } from "../Switch.js";
import type { SwitchValueMeta } from "../Switch.js";
import { Toast } from "../Toast.js";
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

type SettingsRestProps = Record<string, unknown>;
type NormalizedSettingsGroup = Omit<SettingsGroup, "key" | "controls"> & {
  key: string;
  controls: SettingsControl[];
};

interface SettingsStateInput {
  disabled?: boolean | undefined;
  permissionBlocked?: boolean | undefined;
  saving?: boolean | undefined;
  resetting?: boolean | undefined;
  validation?: SettingsValidation | undefined;
  dirty?: boolean | undefined;
  state?: SettingsState | undefined;
}

function sanitizeRestProps(rest: SettingsRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeGroups(groups: SettingsGroup[] | null | undefined): NormalizedSettingsGroup[] {
  return (Array.isArray(groups) ? groups : [])
    .filter((group) => Boolean(group?.title))
    .map((group) => ({
      ...group,
      key: String(group.key ?? group.title),
      controls: (Array.isArray(group.controls) ? group.controls : []).filter((control) => Boolean(control?.label)),
    }));
}

function resolveState({ disabled, permissionBlocked, saving, resetting, validation, dirty, state }: SettingsStateInput): SettingsState {
  if (disabled) return "disabled";
  if (permissionBlocked) return "permission-blocked";
  if (validation?.state === "error" || state === "invalid") return "invalid";
  if (saving || state === "saving") return "saving";
  if (resetting || state === "resetting") return "resetting";
  if (state) return state;
  return dirty ? "dirty" : "idle";
}

function renderControl(
  control: SettingsControl,
  inheritedDensity: SettingsDensity | undefined,
  isDisabled: boolean,
  onControlChange: SettingsProps["onControlChange"],
): React.ReactElement {
  const key = String(control.key ?? control.name ?? control.label);
  const disabled = isDisabled || control.disabled;
  if (control.kind === "select") {
    return React.createElement(Select, {
      key,
      label: control.label,
      helper: control.description,
      options: control.options ?? [],
      value: control.value,
      name: control.name,
      disabled,
      density: control.density ?? inheritedDensity,
      state: disabled ? "disabled" : control.error ? "error" : control.value ? "filled" : "default",
      onValueChange: (value, meta, event) => onControlChange?.(key, value, meta, event),
    } as ComponentProps<typeof Select>);
  }
  if (control.kind === "switch") {
    return React.createElement(Switch, {
      key,
      label: control.label,
      description: control.description,
      checked: Boolean(control.checked),
      name: control.name,
      disabled,
      density: control.density ?? inheritedDensity,
      state: disabled ? "disabled" : control.error ? "error" : control.checked ? "on" : "off",
      error: control.error,
      onCheckedChange: (checked, meta, event) => onControlChange?.(key, checked, meta, event),
    } as ComponentProps<typeof Switch>);
  }
  return React.createElement(Input, {
    key,
    label: control.label,
    helper: control.description,
    value: control.value ?? "",
    name: control.name ?? key,
    placeholder: control.placeholder,
    disabled,
    density: control.density ?? inheritedDensity,
    variant: control.variant ?? "text",
    state: disabled ? "disabled" : control.error ? "error" : control.value ? "filled" : "default",
    error: control.error,
    onValueChange: (value, meta, event) => onControlChange?.(key, value, meta, event),
  } as ComponentProps<typeof Input>);
}

export const Settings = forwardRef<HTMLDivElement, SettingsProps>(function Settings({
  label = "Settings",
  description,
  density,
  state,
  dirty = false,
  saving = false,
  resetting = false,
  disabled = false,
  permissionBlocked = false,
  groups = [],
  summary,
  validation,
  confirmation,
  feedback,
  saveAction,
  resetAction,
  onControlChange,
  onSave,
  onReset,
  className = "",
  ...rest
}, ref) {
  const normalizedGroups = normalizeGroups(groups);
  const resolvedState = resolveState({ disabled, permissionBlocked, saving, resetting, validation, dirty, state });
  const isDisabled = disabled || permissionBlocked || resolvedState === "saving" || resolvedState === "resetting";
  const visibleControlCount = normalizedGroups.reduce((total, group) => total + group.controls.length, 0);

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "saving" || resolvedState === "resetting" ? "true" : undefined,
      "data-flow-pattern": "settings",
      "data-state": resolvedState,
      "data-density": density,
      "data-group-count": String(normalizedGroups.length),
      "data-control-count": String(visibleControlCount),
      ...sanitizeRestProps(rest),
    },
    summary?.title
      ? React.createElement(Card, {
        title: summary.title,
        value: summary.value,
        detail: summary.detail ?? description,
        status: summary.status ?? (dirty ? "Unsaved changes" : "Saved"),
        density,
        composition: "compact",
        variant: "minimal",
        state: resolvedState === "invalid" ? "error" : isDisabled ? "disabled" : dirty ? "selected" : "default",
        fullWidth: true,
      } as ComponentProps<typeof Card>)
      : null,
    normalizedGroups.map((group) => React.createElement(
      Surface,
      {
        key: group.key,
        surfaceRole: "section",
        density,
        state: isDisabled ? "disabled" : dirty ? "selected" : "default",
        "data-flow-slot": "groups",
        "data-settings-group": group.key,
        "aria-label": group.title,
      } as ComponentProps<typeof Surface>,
      React.createElement(
        "header",
        {
          "data-flow-slot": "groupHeader",
          "data-settings-group-header": group.key,
        },
        React.createElement("h3", null, group.title),
        group.description ? React.createElement("p", null, group.description) : null,
      ),
      group.controls.map((control) => renderControl(control, density, isDisabled, onControlChange)),
    )),
    confirmation?.label
      ? React.createElement(Dialog, {
        label: confirmation.label,
        description: confirmation.description,
        open: confirmation.open,
        closeLabel: confirmation.closeLabel ?? "Close",
        actions: confirmation.actions ?? [],
        tone: confirmation.tone ?? "neutral",
        variant: confirmation.variant ?? "review",
        density,
        onOpenChange: confirmation.onOpenChange,
        onAction: confirmation.onAction,
      } as ComponentProps<typeof Dialog>)
      : null,
    saveAction?.label
      ? React.createElement(Button, {
        ...saveAction,
        label: saveAction.label,
        variant: saveAction.variant ?? "primary",
        density: saveAction.density ?? density,
        disabled: isDisabled || !dirty || saveAction.disabled,
        loading: saving || saveAction.loading,
        onClick: (event) => {
          saveAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onSave?.(event);
        },
      } as ComponentProps<typeof Button>)
      : null,
    resetAction?.label
      ? React.createElement(Button, {
        ...resetAction,
        label: resetAction.label,
        variant: resetAction.variant ?? "secondary",
        density: resetAction.density ?? density,
        disabled: isDisabled || !dirty || resetAction.disabled,
        loading: resetting || resetAction.loading,
        onClick: (event) => {
          resetAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onReset?.(event);
        },
      } as ComponentProps<typeof Button>)
      : null,
    validation?.message
      ? React.createElement(Toast, {
        label: validation.message,
        description: validation.description,
        tone: validation.state === "error" ? "danger" : validation.state ?? "info",
        variant: "warning",
        state: "visible",
        density,
      } as ComponentProps<typeof Toast>)
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        ...feedback,
        label: feedback.label,
        tone: feedback.tone ?? "info",
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
      } as ComponentProps<typeof Toast>)
      : null,
  );
}) as SettingsComponent;

Settings.displayName = "Settings";
