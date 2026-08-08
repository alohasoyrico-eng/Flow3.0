import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import { cardSecurityCodeInputPlatformContract } from "#flow/platforms";
import { Spinner } from "./Spinner.js";
import { flowStateProps, normalizeFlowValue, flowDensityProps, flowRestProps } from "./internal/props.js";

const validStates = new Set(["default", "filled", "valid", "loading", "error", "disabled"]);

function normalizeCardSecurityCode(value, expectedLength = 3) {
  const length = Number(expectedLength) === 4 ? 4 : 3;
  return String(value ?? "").replace(/\D/g, "").slice(0, length);
}

function cardSecurityCodeValidity(value, expectedLength = 3) {
  const length = Number(expectedLength) === 4 ? 4 : 3;
  const digits = normalizeCardSecurityCode(value, length);
  if (!digits) return "empty";
  if (digits.length < length) return "incomplete";
  return "valid";
}

function resolveCardSecurityCodeState({ disabled = false, loading = false, error = "", state, value = "", validity = "empty" } = {}) {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  if (state && state !== "default") return normalizeFlowValue(state, validStates, "default");
  if (validity === "valid") return "valid";
  return value ? "filled" : "default";
}

export const CardSecurityCodeInput = forwardRef(function CardSecurityCodeInput({
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
  const resolvedLength = Number(expectedLength) === 4 ? 4 : 3;
  const isValueControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [internalRevealed, setInternalRevealed] = useState(Boolean(revealed));
  const isRevealedControlled = revealed !== undefined;
  const isRevealed = isRevealedControlled ? Boolean(revealed) : internalRevealed;
  const digits = normalizeCardSecurityCode(currentValue, resolvedLength);
  const validity = cardSecurityCodeValidity(digits, resolvedLength);
  const resolvedError = error;
  const resolvedHelper = resolvedError || helper;
  const isDisabled = Boolean(disabled || loading);
  const canReveal = Boolean(revealable && revealLabel && hideLabel);
  const resolvedState = resolveCardSecurityCodeState({ disabled, loading, error: resolvedError, state, value: digits, validity });
  const describedBy = resolvedHelper ? `${inputId}-helper` : undefined;
  const meta = useMemo(() => ({
    validity,
    expectedLength: resolvedLength,
    complete: validity === "valid",
  }), [resolvedLength, validity]);

  useEffect(() => {
    if (isValueControlled) setCurrentValue(value ?? "");
  }, [isValueControlled, value]);

  if (!label) return null;

  const toggleReveal = () => {
    const nextRevealed = !isRevealed;
    if (!isRevealedControlled) setInternalRevealed(nextRevealed);
    onRevealChange?.(nextRevealed);
  };

  return React.createElement(
    "label",
    {
      className: ["field card-security-code-input", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
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
        onChange: (event) => {
          const nextDigits = normalizeCardSecurityCode(event.target.value, resolvedLength);
          const nextValidity = cardSecurityCodeValidity(nextDigits, resolvedLength);
          if (!isValueControlled) setCurrentValue(nextDigits);
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
      loading ? React.createElement(Spinner, { density, decorative: true, className: "field__icon field__icon--loading" }) : null,
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
});

CardSecurityCodeInput.displayName = "CardSecurityCodeInput";
CardSecurityCodeInput.platformContract = cardSecurityCodeInputPlatformContract;
