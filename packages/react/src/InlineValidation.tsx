import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type RefAttributes,
  forwardRef,
  useId,
} from "react";
import { inlineValidationPlatformContract } from "@design-system/components/platforms";
import { Input } from "./Input.js";
import type { InputProps } from "./Input.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowStateProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

export type InlineValidationState = "default" | "info" | "success" | "warning" | "error" | "disabled";
export type InlineValidationDensity = "sm" | "md" | "lg";

export interface InlineValidationProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  message?: string;
  state?: InlineValidationState;
  id?: string;
  density?: InlineValidationDensity;
  fullWidth?: boolean;
  field?: boolean;
  live?: boolean;
}

export interface InlineValidationComponent extends ForwardRefExoticComponent<InlineValidationProps & RefAttributes<HTMLDivElement>> {
  displayName: "InlineValidation";
  platformContract: typeof inlineValidationPlatformContract;
}

const validStates = new Set<InlineValidationState>(["default", "info", "success", "warning", "error", "disabled"]);

function normalizeState(state: InlineValidationState): InlineValidationState {
  return validStates.has(state) ? state : "default";
}

function slug(value: string): string {
  return String(value ?? "field").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const InlineValidation = forwardRef<HTMLDivElement, InlineValidationProps>(function InlineValidation({
  label,
  value = "",
  message,
  state = "default",
  id,
  density,
  fullWidth = false,
  field,
  live = false,
  className = "",
  ...rest
}, ref) {
  const generatedId = useId();
  const resolvedState = normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  const requestedField = field ?? value !== "";
  const showField = Boolean(label && requestedField);
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
      ...flowRestProps(rest),
      ref,
      className: ["inline-validation", className].filter(Boolean).join(" "),
      "aria-label": !showField && label ? label : rest["aria-label"],
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "data-field": String(Boolean(showField)),
    },
    showField
      ? React.createElement(Input, {
          label,
          value,
          state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : value ? "filled" : "default",
          disabled: resolvedState === "disabled",
          density: resolvedDensity,
          id: fieldId,
          "aria-describedby": message ? messageId : undefined,
          "aria-invalid": resolvedState === "error" ? "true" : undefined,
          readOnly: true,
        } as unknown as InputProps)
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
}) as InlineValidationComponent;

InlineValidation.displayName = "InlineValidation";
InlineValidation.platformContract = inlineValidationPlatformContract;
