import React, { forwardRef, useId } from "react";
import { inlineValidationPlatformContract } from "@design-system/components/platforms";
import { Input } from "./Input.js";

const validStates = new Set(["default", "info", "success", "warning", "error", "disabled"]);

function normalizeState(state) {
  return validStates.has(state) ? state : "default";
}

function slug(value) {
  return String(value ?? "field").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const InlineValidation = forwardRef(function InlineValidation({
  label,
  value = "",
  message = "",
  state = "default",
  id = "",
  density,
  fullWidth = false,
  field,
  live = false,
  className = "",
  ...rest
}, ref) {
  const generatedId = useId();
  const resolvedState = normalizeState(state);
  const showField = field ?? value !== "";
  const fieldId = id || `inline-validation-${slug(label)}-${generatedId}`;
  const messageId = `${fieldId}-message`;
  const messageRole = live && resolvedState === "error"
    ? "alert"
    : live && resolvedState !== "disabled"
      ? "status"
      : undefined;

  return React.createElement(
    "div",
    {
      ...rest,
      ref,
      className: ["inline-validation", className].filter(Boolean).join(" "),
      "aria-label": !showField && label ? label : rest["aria-label"],
      "data-state": resolvedState,
      "data-density": density,
      "data-full-width": String(Boolean(fullWidth)),
      "data-field": String(Boolean(showField)),
    },
    showField
      ? React.createElement(Input, {
          label: label ?? "Input",
          value,
          state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : value ? "filled" : "default",
          disabled: resolvedState === "disabled",
          density,
          id: fieldId,
          "aria-describedby": message ? messageId : undefined,
          "aria-invalid": resolvedState === "error" ? "true" : undefined,
          readOnly: true,
        })
      : null,
    message
      ? React.createElement(
          "p",
          {
            className: "inline-validation__message",
            id: messageId,
            role: messageRole,
          },
          message,
        )
      : null,
  );
});

InlineValidation.displayName = "InlineValidation";
InlineValidation.platformContract = inlineValidationPlatformContract;
