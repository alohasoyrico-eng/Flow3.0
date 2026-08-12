import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type InputHTMLAttributes,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useId,
  useMemo,
  useState,
} from "react";
import { cardSecurityCodeInputPlatformContract } from "@design-system/components/platforms";
import { Spinner } from "./Spinner.js";
import {
  type FlowDataAttributes,
  flowStateProps,
  normalizeFlowValue,
  flowDensityProps,
  flowRestProps,
  flowDataProps,
  normalizeFlowDensity,
} from "./internal/props.js";

export type CardSecurityCodeInputDensity = "sm" | "md" | "lg";
export type CardSecurityCodeInputState = "default" | "filled" | "valid" | "loading" | "error" | "disabled";
export type CardSecurityCodeValidity = "empty" | "incomplete" | "valid";
export type CardSecurityCodeLength = 3 | 4;
export type CardSecurityCodeMeta = {
  validity: CardSecurityCodeValidity;
  expectedLength: CardSecurityCodeLength;
  complete: boolean;
};

export interface CardSecurityCodeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "prefix" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  error?: string;
  value?: string;
  density?: CardSecurityCodeInputDensity;
  state?: CardSecurityCodeInputState;
  loading?: boolean;
  expectedLength?: CardSecurityCodeLength;
  revealable?: boolean;
  revealLabel?: string;
  hideLabel?: string;
  revealed?: boolean;
  onValueChange?: (digits: string, meta: CardSecurityCodeMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onRevealChange?: (revealed: boolean, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface CardSecurityCodeInputComponent extends ForwardRefExoticComponent<CardSecurityCodeInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CardSecurityCodeInput";
  platformContract: typeof cardSecurityCodeInputPlatformContract;
}

const validStates = new Set<CardSecurityCodeInputState>(["default", "filled", "valid", "loading", "error", "disabled"]);

function normalizeExpectedLength(expectedLength: unknown): CardSecurityCodeLength {
  return Number(expectedLength) === 4 ? 4 : 3;
}

function normalizeCardSecurityCode(value: unknown, expectedLength: CardSecurityCodeLength = 3): string {
  const length = Number(expectedLength) === 4 ? 4 : 3;
  return String(value ?? "").replace(/\D/g, "").slice(0, length);
}

function cardSecurityCodeValidity(value: unknown, expectedLength: CardSecurityCodeLength = 3): CardSecurityCodeValidity {
  const length = normalizeExpectedLength(expectedLength);
  const digits = normalizeCardSecurityCode(value, length);
  if (!digits) return "empty";
  if (digits.length < length) return "incomplete";
  return "valid";
}

function resolveCardSecurityCodeState({
  disabled = false,
  loading = false,
  error = "",
  state,
  value = "",
  validity = "empty",
}: {
  disabled?: boolean;
  loading?: boolean;
  error?: string | undefined;
  state?: CardSecurityCodeInputState | undefined;
  value?: string;
  validity?: CardSecurityCodeValidity;
} = {}): CardSecurityCodeInputState {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  if (state && state !== "default") return normalizeFlowValue(state, validStates, "default");
  if (validity === "valid") return "valid";
  return value ? "filled" : "default";
}

export const CardSecurityCodeInput = forwardRef<HTMLInputElement, CardSecurityCodeInputProps>(function CardSecurityCodeInput({
  label,
  value,
  helper = "",
  error = "",
  disabled = false,
  loading = false,
  required = false,
  density,
  state,
  name = "",
  placeholder = "",
  expectedLength = 3,
  revealable = true,
  revealLabel,
  hideLabel,
  revealed,
  onValueChange,
  onRevealChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const inputId = id ?? `card-security-code-input-${generatedId}`;
  const resolvedLength = normalizeExpectedLength(expectedLength);
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const [internalRevealed, setInternalRevealed] = useState<boolean>(Boolean(revealed));
  const isRevealedControlled = revealed !== undefined;
  const isRevealed = isRevealedControlled ? Boolean(revealed) : internalRevealed;
  const digits = normalizeCardSecurityCode(currentValue, resolvedLength);
  const validity = cardSecurityCodeValidity(digits, resolvedLength);
  const resolvedError = error;
  const resolvedHelper = resolvedError || helper;
  const isDisabled = Boolean(disabled || loading);
  const canReveal = Boolean(revealable && revealLabel && hideLabel);
  const resolvedState = resolveCardSecurityCodeState({ disabled, loading, error: resolvedError, state, value: digits, validity });
  const resolvedDensity = normalizeFlowDensity(density);
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;
  const meta = useMemo(() => ({
    validity,
    expectedLength: resolvedLength,
    complete: validity === "valid",
  }), [resolvedLength, validity]);

  if (!label) return null;

  const toggleReveal = (event: MouseEvent<HTMLButtonElement>): void => {
    const nextRevealed = !isRevealed;
    if (!isRevealedControlled) setInternalRevealed(nextRevealed);
    onRevealChange?.(nextRevealed, event);
  };

  return React.createElement(
    "label",
    {
      className: ["field card-security-code-input", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-mono": "true",
      "data-validity": validity,
      "data-length": String(digits.length),
      "data-expected-length": String(resolvedLength),
    },
    React.createElement("span", { className: "field__label card-security-code-input__label", id: `${inputId}-label` }, label),
    React.createElement(
      "span",
      { className: "field__control card-security-code-input__control" },
      React.createElement("span", { className: "field__icon card-security-code-input__icon", "aria-hidden": "true" }, "pin"),
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: inputId,
        name,
        className: "input card-security-code-input__input",
        type: revealable && !isRevealed ? "password" : "text",
        inputMode: "numeric",
        autoComplete: "cc-csc",
        placeholder,
        value: digits,
        disabled: isDisabled,
        required,
        maxLength: resolvedLength,
        pattern: "[0-9]*",
        enterKeyHint: "next",
        spellCheck: false,
        "data-card-security-code-input": "",
        "aria-labelledby": `${inputId}-label`,
        "aria-describedby": describedBy,
        "aria-invalid": resolvedError ? "true" : undefined,
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
          const nextDigits = normalizeCardSecurityCode(event.target.value, resolvedLength);
          const nextValidity = cardSecurityCodeValidity(nextDigits, resolvedLength);
          if (!isValueControlled) setInternalValue(nextDigits);
          onValueChange?.(nextDigits, {
            validity: nextValidity,
            expectedLength: resolvedLength,
            complete: nextValidity === "valid",
          }, event);
        },
      }),
      canReveal
        ? React.createElement(
          "button",
          {
            className: "field-action card-security-code-input__action",
            type: "button",
            disabled: isDisabled,
            "data-field-action": "reveal",
            "data-card-security-code-reveal": "",
            "aria-label": isRevealed ? hideLabel : revealLabel,
            "aria-pressed": String(isRevealed),
            onClick: toggleReveal,
          },
          React.createElement("span", { className: "field-action__icon field__icon card-security-code-input__action-icon", "aria-hidden": "true" }, isRevealed ? "visibility_off" : "visibility"),
        )
        : null,
      loading ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true, className: "field__icon field__icon--loading" }) : null,
    ),
    resolvedHelper
      ? React.createElement(
        "span",
        {
          className: "field__helper card-security-code-input__helper",
          id: `${inputId}-helper`,
          "data-card-security-code-helper": "",
          role: resolvedError ? "alert" : undefined,
        },
        resolvedHelper,
      )
      : null,
  );
}) as CardSecurityCodeInputComponent;

CardSecurityCodeInput.displayName = "CardSecurityCodeInput";
CardSecurityCodeInput.platformContract = cardSecurityCodeInputPlatformContract;
