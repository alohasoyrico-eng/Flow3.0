import React, {
  type ChangeEvent,
  type FocusEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type RefAttributes,
  forwardRef,
  useId,
  useState,
} from "react";
import { codeInputPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";
import { flowVariantProps, flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";
import { resolveFieldMessage } from "./internal/field-message.js";

export type CodeInputDensity = FlowDensity;
export type CodeInputVariant = "sms" | "otp" | "approval" | "masked" | "compact";
export type CodeInputState = "default" | "hover" | "focus" | "complete" | "success" | "warning" | "error" | "disabled";

export interface CodeInputChangeMeta {
  value: string;
  length: number;
  complete: boolean;
}

export interface CodeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  length?: number;
  variant?: CodeInputVariant;
  masked?: boolean;
  helper?: string;
  disabled?: boolean;
  state?: CodeInputState;
  density?: CodeInputDensity;
  error?: string;
  onValueChange?: (value: string, meta: CodeInputChangeMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onComplete?: (value: string, meta: CodeInputChangeMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CodeInputComponent extends ForwardRefExoticComponent<CodeInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CodeInput";
  platformContract: typeof codeInputPlatformContract;
}

const validVariants = new Set<CodeInputVariant>(["sms", "otp", "approval", "masked", "compact"]);
const validStates = new Set<CodeInputState>(["default", "hover", "focus", "complete", "success", "warning", "error", "disabled"]);

function normalizeCodeValue(value: unknown, length = 6) {
  return String(value ?? "").replace(/\D/g, "").slice(0, Number(length));
}

function resolveCodeInputState({ disabled = false, error = "", state, value = "", length = 6 }: {
  disabled?: boolean;
  error?: string;
  state?: CodeInputState;
  value?: string;
  length?: number;
} = {}): CodeInputState {
  if (disabled) return "disabled";
  if (error) return "error";
  if (state && state !== "default") return normalizeFlowValue(state, validStates, "default");
  return value.length === Number(length) && value ? "complete" : "default";
}

function codeMeta(value: string, length: number): CodeInputChangeMeta {
  return {
    value,
    length: Number(length),
    complete: value.length === Number(length),
  };
}

export const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(function CodeInput({
  label,
  value,
  length = 6,
  variant = "sms",
  masked = false,
  helper = "",
  disabled = false,
  state,
  density,
  error = "",
  onValueChange,
  onComplete,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `code-input-${generatedId}`;
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "sms");
  const resolvedLength = Math.max(1, Number(length) || 6);
  const isValueControlled = value !== undefined;
  const [focused, setFocused] = useState(state === "focus");
  const [internalValue, setInternalValue] = useState(normalizeCodeValue(value ?? "", resolvedLength));
  const currentValue = isValueControlled ? normalizeCodeValue(value ?? "", resolvedLength) : internalValue;
  const digits = normalizeCodeValue(currentValue, resolvedLength);
  const resolvedState = resolveCodeInputState({ disabled, error, ...(state !== undefined ? { state } : {}), value: digits, length: resolvedLength });
  const fieldMessage = resolveFieldMessage({
    controlId: inputId,
    describedBy: rest["aria-describedby"],
    error,
    helper,
    state: resolvedState === "error" ? "error" : resolvedState === "warning" ? "warning" : resolvedState === "success" ? "success" : resolvedState === "disabled" ? "disabled" : "default",
    live: resolvedState === "success",
  });
  const isMasked = Boolean(masked) || resolvedVariant === "masked";
  const activeIndex = Math.min(digits.length, Math.max(resolvedLength - 1, 0));
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  return React.createElement(
    "label",
    {
      className: ["field code-input", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      ...flowVariantProps(resolvedVariant),
      "data-masked": isMasked ? "true" : undefined,
      "data-focused": focused ? "true" : "false",
      "data-length": String(resolvedLength),
    },
    React.createElement("span", { className: "field__label", id: `${inputId}-label` }, label),
    React.createElement(
      "span",
      { className: "code-input__control" },
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        className: "code-input__input",
        type: "text",
        inputMode: "numeric",
        autoComplete: "one-time-code",
        pattern: "[0-9]*",
        value: digits,
        disabled: Boolean(disabled),
        "data-code-input": "",
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": fieldMessage.describedBy,
        "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
        onFocus: (event: FocusEvent<HTMLInputElement>) => {
          rest.onFocus?.(event);
          if (event.defaultPrevented) return;
          setFocused(true);
        },
        onBlur: (event: FocusEvent<HTMLInputElement>) => {
          rest.onBlur?.(event);
          if (event.defaultPrevented) return;
          setFocused(false);
        },
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const nextValue = normalizeCodeValue(event.target.value, resolvedLength);
          if (!isValueControlled) setInternalValue(nextValue);
          const nextMeta = codeMeta(nextValue, resolvedLength);
          onValueChange?.(nextValue, nextMeta, event);
          if (nextMeta.complete) onComplete?.(nextValue, nextMeta, event);
        },
      }),
      React.createElement(
        "span",
        { className: "code-input__slots", "aria-hidden": "true" },
        Array.from({ length: resolvedLength }, (_, index) => {
          const digit = digits[index] ?? "";
          const isActive = focused && index === activeIndex && !disabled;
          return React.createElement(
            "span",
            {
              className: "code-input__slot",
              "data-code-slot": "",
              "data-filled": String(Boolean(digit)),
              "data-active": String(isActive),
              key: index,
            },
            digit
              ? React.createElement("span", { className: "code-input__digit" }, digit)
              : isActive
                ? React.createElement("span", { className: "code-input__caret" })
                : null,
          );
        }),
      ),
    ),
    fieldMessage.message
      ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message)
      : null,
  );
}) as CodeInputComponent;

CodeInput.displayName = "CodeInput";
CodeInput.platformContract = codeInputPlatformContract;
