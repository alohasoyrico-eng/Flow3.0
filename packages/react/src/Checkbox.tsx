import React, { forwardRef, useEffect, useRef, useState } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { checkboxPlatformContract } from "@design-system/components/platforms";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type CheckboxVariant = "default" | "descriptive" | "select-all" | "compact";
export type CheckboxState = "unchecked" | "checked" | "indeterminate" | "focus" | "error" | "disabled";
export type CheckboxDensity = "sm" | "md" | "lg";

export interface CheckboxValueMeta {
  indeterminate: boolean;
  value: string;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "type" | "checked" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  error?: string;
  variant?: CheckboxVariant;
  state?: CheckboxState;
  density?: CheckboxDensity;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  name?: string;
  value?: string;
  required?: boolean;
  onCheckedChange?: (checked: boolean, meta: CheckboxValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}

export interface CheckboxComponent extends ForwardRefExoticComponent<CheckboxProps & RefAttributes<HTMLInputElement>> {
  displayName: "Checkbox";
  platformContract: typeof checkboxPlatformContract;
}

const validVariants = new Set<CheckboxVariant>(["default", "descriptive", "select-all", "compact"]);

function normalizeState({ checked, indeterminate, disabled, state, error }: { checked: boolean; indeterminate: boolean; disabled: boolean; state: CheckboxState; error?: string }): CheckboxState {
  if (disabled) return "disabled";
  if (indeterminate) return "indeterminate";
  if (checked) return "checked";
  if (state === "error" || error) return "error";
  if (state === "focus") return "focus";
  return "unchecked";
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox({
  label,
  description,
  error,
  variant = "default",
  state = "unchecked",
  density,
  checked,
  indeterminate = false,
  disabled = false,
  name = "",
  value = "on",
  required = false,
  onCheckedChange,
  className = "",
  ...rest
}, ref) {
  const isCheckedControlled = checked !== undefined;
  const [internalChecked, setInternalChecked] = useState(Boolean(checked));
  const [currentIndeterminate, setCurrentIndeterminate] = useState(Boolean(indeterminate));
  const currentChecked = isCheckedControlled ? Boolean(checked) : internalChecked;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const normalizedState = normalizeState({
    checked: currentChecked,
    indeterminate: currentIndeterminate,
    disabled,
    state,
    ...(error ? { error } : {}),
  });
  const isInvalid = normalizedState === "error" || Boolean(error);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "default");
  if (!label) return null;

  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = currentIndeterminate;
  }, [currentIndeterminate]);

  const assignRef = (node: HTMLInputElement | null): void => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const nextChecked = event.currentTarget.checked;
    setCurrentIndeterminate(false);
    if (!isCheckedControlled) setInternalChecked(nextChecked);
    onCheckedChange?.(nextChecked, { indeterminate: false, value }, event);
  };
  const resolvedDensity = normalizeFlowDensity(density);

  return React.createElement(
    "label",
    {
      className: ["choice checkbox", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      "data-checked": String(currentChecked),
      "data-indeterminate": String(currentIndeterminate),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(normalizedState),
      ...flowDensityProps(resolvedDensity),
      "data-invalid": isInvalid ? "true" : undefined,
    },
    React.createElement("input", {
      ...flowRestProps(rest),
      ref: assignRef,
      type: "checkbox",
      className: "choice__input",
      name,
      value,
      checked: currentChecked,
      disabled,
      required,
      "aria-checked": currentIndeterminate ? "mixed" : String(currentChecked),
      "aria-invalid": isInvalid ? "true" : undefined,
      onChange: handleChange,
    }),
    React.createElement(
      "span",
      { className: "choice__mark", "aria-hidden": "true" },
      React.createElement(
        "span",
        { className: "choice__indicator material-symbol" },
        currentIndeterminate ? "remove" : "check",
      ),
    ),
    React.createElement(
      "span",
      { className: "choice__text" },
      React.createElement("span", { className: "choice__label" }, label),
      description ? React.createElement("span", { className: "choice__description" }, description) : null,
      error ? React.createElement("span", { className: "choice__error" }, error) : null,
    ),
  );
}) as CheckboxComponent;

Checkbox.displayName = "Checkbox";
Checkbox.platformContract = checkboxPlatformContract;
