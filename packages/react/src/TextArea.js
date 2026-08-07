import React, { forwardRef, useId, useState } from "react";
import { textAreaPlatformContract } from "@design-system/components/platforms";

function resolveState({ disabled = false, loading = false, error = "", state, value = "" } = {}) {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  return state ?? (value ? "filled" : "default");
}

export const TextArea = forwardRef(function TextArea({
  label,
  helper = "",
  helperText,
  error = "",
  value = "",
  name = "",
  placeholder = "",
  disabled = false,
  loading = false,
  required = false,
  rows = 3,
  maxLength,
  density,
  state,
  onChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const textAreaId = id ?? `text-area-${generatedId}`;
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const resolvedHelper = error || helperText || helper;
  const resolvedState = resolveState({ disabled, loading, error, state, value: currentValue });
  const isDisabled = Boolean(disabled) || Boolean(loading);
  const counterId = maxLength != null ? `${textAreaId}-counter` : "";
  const helperId = resolvedHelper ? `${textAreaId}-helper` : "";
  const describedBy = [helperId, counterId].filter(Boolean).join(" ") || undefined;
  const counterText = maxLength != null ? `${String(currentValue ?? "").length}/${Number(maxLength)}` : "";

  const handleChange = (event) => {
    if (isDisabled) return;
    const nextValue = event.target.value;
    setCurrentValue(nextValue);
    onChange?.(nextValue, { maxLength: maxLength == null ? undefined : Number(maxLength), length: String(nextValue).length });
  };

  return React.createElement(
    "label",
    {
      className: ["field", className].filter(Boolean).join(" "),
      "data-state": resolvedState,
      "data-density": density || undefined,
    },
    React.createElement("span", { className: "field__label", id: `${textAreaId}-label` }, label ?? "Text area"),
    React.createElement(
      "span",
      { className: "text-area__surface", "data-has-counter": maxLength != null ? "true" : undefined },
      React.createElement("textarea", {
        ...rest,
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
});

TextArea.displayName = "TextArea";
TextArea.platformContract = textAreaPlatformContract;
