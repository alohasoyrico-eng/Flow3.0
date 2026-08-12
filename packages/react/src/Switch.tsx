import React, { forwardRef, useState } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { switchPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type SwitchState = "off" | "on" | "focus" | "pressed" | "error" | "disabled";
export type SwitchDensity = "sm" | "md" | "lg";

export interface SwitchValueMeta {
  name: string;
}

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "type" | "checked" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  error?: string;
  state?: SwitchState;
  density?: SwitchDensity;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean, meta: SwitchValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface SwitchComponent extends ForwardRefExoticComponent<SwitchProps & RefAttributes<HTMLInputElement>> {
  displayName: "Switch";
  platformContract: typeof switchPlatformContract;
}

function normalizeState({ checked, disabled, state, error }: { checked: boolean; disabled: boolean; state: SwitchState; error?: string }): SwitchState {
  if (disabled) return "disabled";
  if (state === "error" || error) return "error";
  if (state === "focus") return "focus";
  if (state === "pressed") return "pressed";
  return checked ? "on" : "off";
}

export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch({
  label,
  description,
  error,
  state = "off",
  density,
  checked,
  disabled = false,
  name = "",
  required = false,
  onCheckedChange,
  className = "",
  ...rest
}, ref) {
  const isCheckedControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(Boolean(checked));
  const currentChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
  const normalizedState = normalizeState({ checked: currentChecked, disabled, state, ...(error ? { error } : {}) });
  const isInvalid = normalizedState === "error" || Boolean(error);
  if (!label) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const nextChecked = event.currentTarget.checked;
    if (!isCheckedControlled) setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked, { name }, event);
  };
  const resolvedDensity = normalizeFlowDensity(density);

  return React.createElement(
    "label",
    {
      className: ["switch", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(normalizedState),
      ...flowDensityProps(resolvedDensity),
      "data-checked": String(currentChecked),
      "data-invalid": isInvalid ? "true" : undefined,
    },
    React.createElement("input", {
      ...flowRestProps(rest),
      ref,
      type: "checkbox",
      className: "switch__input",
      name,
      checked: currentChecked,
      disabled,
      required,
      role: "switch",
      "aria-checked": String(currentChecked),
      "aria-invalid": isInvalid ? "true" : undefined,
      onChange: handleChange,
    }),
    React.createElement(
      "span",
      { className: "switch__track", "aria-hidden": "true" },
      React.createElement("span", { className: "switch__thumb" }),
    ),
    React.createElement(
      "span",
      { className: "switch__text" },
      React.createElement("span", { className: "switch__label" }, label),
      description ? React.createElement("span", { className: "switch__description" }, description) : null,
      error ? React.createElement("span", { className: "switch__error" }, error) : null,
    ),
  );
}) as SwitchComponent;

Switch.displayName = "Switch";
Switch.platformContract = switchPlatformContract;
