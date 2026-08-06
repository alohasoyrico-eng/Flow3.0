import React, { forwardRef, useState } from "react";
import { radioButtonPlatformContract } from "#flow/platforms";

function normalizeState({ checked, disabled, state, error }) {
  if (disabled) return "disabled";
  if (checked) return "selected";
  if (state === "error" || error) return "error";
  if (state === "focus") return "focus";
  return "unselected";
}

export const RadioButton = forwardRef(function RadioButton({
  label,
  description = "",
  error = "",
  variant = "default",
  state = "unselected",
  density,
  checked = false,
  disabled = false,
  name = "",
  value = "",
  required = false,
  onCheckedChange,
  className = "",
  ...rest
}, ref) {
  const [currentChecked, setCurrentChecked] = useState(Boolean(checked));
  const normalizedState = normalizeState({
    checked: currentChecked,
    disabled,
    state,
    error,
  });
  const isInvalid = normalizedState === "error" || Boolean(error);

  const handleChange = (event) => {
    if (disabled) return;
    const nextChecked = event.currentTarget.checked;
    setCurrentChecked(nextChecked);
    onCheckedChange?.(nextChecked, { value });
  };

  return React.createElement(
    "label",
    {
      className: ["choice radio", className].filter(Boolean).join(" "),
      "data-checked": String(currentChecked),
      "data-variant": variant,
      "data-state": normalizedState,
      "data-density": density || undefined,
      "data-invalid": isInvalid ? "true" : undefined,
    },
    React.createElement("input", {
      ...rest,
      ref,
      type: "radio",
      className: "choice__input",
      name,
      value,
      checked: currentChecked,
      disabled,
      required,
      "aria-invalid": isInvalid ? "true" : undefined,
      onChange: handleChange,
    }),
    React.createElement("span", { className: "choice__mark", "aria-hidden": "true" }),
    React.createElement(
      "span",
      { className: "choice__text" },
      React.createElement("span", { className: "choice__label" }, label ?? "Radio button"),
      description ? React.createElement("span", { className: "choice__description" }, description) : null,
      error ? React.createElement("span", { className: "choice__error" }, error) : null,
    ),
  );
});

RadioButton.displayName = "RadioButton";
RadioButton.platformContract = radioButtonPlatformContract;
