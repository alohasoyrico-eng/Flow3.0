import React, { forwardRef, useId, useState } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, RefAttributes, TextareaHTMLAttributes } from "react";
import { textAreaPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type TextAreaDensity = "sm" | "md" | "lg";
export type TextAreaState = "default" | "focus" | "filled" | "loading" | "error" | "disabled";

export interface TextAreaChangeMeta {
  length: number;
  maxLength?: number;
}

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  helperText?: string;
  error?: string;
  value?: string;
  loading?: boolean;
  density?: TextAreaDensity;
  state?: TextAreaState;
  onValueChange?: (value: string, meta: TextAreaChangeMeta, event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface TextAreaComponent extends ForwardRefExoticComponent<TextAreaProps & RefAttributes<HTMLTextAreaElement>> {
  displayName: "TextArea";
  platformContract: typeof textAreaPlatformContract;
}

function resolveState({ disabled = false, loading = false, error = "", state, value = "" }: { disabled?: boolean; loading?: boolean; error?: string; state?: TextAreaState; value?: string } = {}): TextAreaState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  return state ?? (value ? "filled" : "default");
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea({
  label,
  helper = "",
  helperText,
  error = "",
  value,
  name = "",
  placeholder = "",
  disabled = false,
  loading = false,
  required = false,
  rows = 3,
  maxLength,
  density,
  state,
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const textAreaId = id ?? `text-area-${generatedId}`;
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(value ?? "");
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const resolvedHelper = error || helperText || helper;
  const resolvedState = resolveState({ disabled, loading, error, ...(state ? { state } : {}), value: currentValue });
  const isDisabled = Boolean(disabled) || Boolean(loading);
  const counterId = maxLength != null ? `${textAreaId}-counter` : "";
  const helperId = resolvedHelper ? `${textAreaId}-helper` : "";
  const describedBy = [helperId, counterId].filter(Boolean).join(" ") || undefined;
  const counterText = maxLength != null ? `${String(currentValue ?? "").length}/${Number(maxLength)}` : "";
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    if (isDisabled) return;
    const nextValue = event.target.value;
    const meta = {
      ...(maxLength == null ? {} : { maxLength: Number(maxLength) }),
      length: String(nextValue).length,
    };
    if (!isValueControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue, meta, event);
  };

  return React.createElement(
    "label",
    {
      className: ["field", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
    },
    React.createElement("span", { className: "field__label", id: `${textAreaId}-label` }, label),
    React.createElement(
      "span",
      { className: "text-area__surface", "data-has-counter": maxLength != null ? "true" : undefined },
      React.createElement("textarea", {
        ...flowRestProps(rest),
        ref,
        id: textAreaId,
        className: "text-area",
        name,
        value: currentValue,
        placeholder,
        disabled: isDisabled,
        required,
        rows,
        maxLength: maxLength == null ? undefined : Number(maxLength),
        "aria-labelledby": `${textAreaId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": error ? "true" : undefined,
        onChange: handleChange,
      }),
      maxLength != null ? React.createElement("span", { className: "text-area__counter", id: counterId, "data-text-area-counter": "" }, counterText) : null,
    ),
    resolvedHelper ? React.createElement("span", { className: "field__helper", id: helperId, role: error ? "alert" : undefined }, resolvedHelper) : null,
  );
}) as TextAreaComponent;

TextArea.displayName = "TextArea";
TextArea.platformContract = textAreaPlatformContract;
