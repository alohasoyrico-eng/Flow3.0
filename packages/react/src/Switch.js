import React, { forwardRef, useState } from "react";
import { switchPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowDensityProps, flowRestProps, normalizeFlowDensity } from "./internal/props.js";

function normalizeState({ checked, disabled, state, error }) {
  if (disabled) return "disabled";
  if (state === "error" || error) return "error";
  if (state === "focus") return "focus";
  if (state === "pressed") return "pressed";
  return checked ? "on" : "off";
}

export const Switch = forwardRef(function Switch({
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
  const normalizedState = normalizeState({ checked: currentChecked, disabled, state, error });
  const isInvalid = normalizedState === "error" || Boolean(error);
  if (!label) return null;

  const handleChange = (event) => {
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
});

Switch.displayName = "Switch";
Switch.platformContract = switchPlatformContract;
