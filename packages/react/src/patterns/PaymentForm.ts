import React, { forwardRef } from "react";
import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { CardExpiryInput } from "../CardExpiryInput.js";
import type { CardExpiryInputProps, CardExpiryMeta } from "../CardExpiryInput.js";
import { CardNumberInput } from "../CardNumberInput.js";
import type { CardNumberInputProps, CardNumberMeta } from "../CardNumberInput.js";
import { CardSecurityCodeInput } from "../CardSecurityCodeInput.js";
import type { CardSecurityCodeInputProps, CardSecurityCodeMeta } from "../CardSecurityCodeInput.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { InputAmount } from "../InputAmount.js";
import type { InputAmountMeta, InputAmountProps } from "../InputAmount.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps, SurfaceState } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { StatusFeedbackView } from "./StatusFeedbackView.js";
import type { StatusFeedbackViewProps } from "./StatusFeedbackView.js";

export type PaymentFormState = "default" | "review" | "success" | "loading" | "error" | "disabled";
export type PaymentFormDensity = "sm" | "md" | "lg";

export interface PaymentFormAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key: string;
  label: string;
}

export type PaymentFormCardNumberField = Partial<CardNumberInputProps> & { label?: string };
export type PaymentFormExpiryField = Partial<CardExpiryInputProps> & { label?: string };
export type PaymentFormSecurityCodeField = Partial<CardSecurityCodeInputProps> & { label?: string };
export type PaymentFormAmountField = Partial<InputAmountProps> & { label?: string };
export type PaymentFormValidation = Partial<InlineValidationProps> & { message?: string };
export type PaymentFormFeedback = Partial<StatusFeedbackViewProps>;

export interface PaymentFormProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: PaymentFormDensity;
  state?: PaymentFormState;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  cardNumber?: PaymentFormCardNumberField;
  expiry?: PaymentFormExpiryField;
  securityCode?: PaymentFormSecurityCodeField;
  amount?: PaymentFormAmountField | null;
  validation?: PaymentFormValidation;
  feedback?: PaymentFormFeedback;
  submitAction?: PaymentFormAction;
  secondaryAction?: PaymentFormAction;
  className?: string;
  onCardNumberChange?: (digits: string, meta: CardNumberMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onExpiryChange?: (value: string, meta: CardExpiryMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onSecurityCodeChange?: (digits: string, meta: CardSecurityCodeMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onAmountChange?: (value: string, meta: InputAmountMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onSecondaryAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onFeedbackAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface PaymentFormComponent extends ForwardRefExoticComponent<PaymentFormProps & RefAttributes<HTMLDivElement>> {
  displayName: "PaymentForm";
}

type SafeRootProps = FlowDataAttributes & Record<`aria-${string}`, string | number | boolean | undefined>;
type FieldLike = {
  disabled?: boolean | undefined;
  loading?: boolean | undefined;
  error?: string | undefined;
  state?: string | undefined;
  value?: string | number | readonly string[] | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function resolveState({
  disabled,
  loading,
  error,
  state,
}: {
  disabled: boolean;
  loading: boolean;
  error?: boolean | undefined;
  state?: PaymentFormState | undefined;
}): PaymentFormState {
  if (disabled || state === "disabled") return "disabled";
  if (loading || state === "loading") return "loading";
  if (error || state === "error") return "error";
  if (state === "success") return "success";
  if (state === "review") return "review";
  return state ?? "default";
}

function surfaceStateFor(resolvedState: PaymentFormState): SurfaceState {
  if (resolvedState === "disabled") return "disabled";
  if (resolvedState === "error" || resolvedState === "review") return "raised";
  if (resolvedState === "loading") return "sunken";
  return "default";
}

function fieldStateFor<TState extends string>(resolvedState: PaymentFormState, field: FieldLike = {}): TState {
  if (resolvedState === "disabled" || field.disabled) return "disabled" as TState;
  if (resolvedState === "loading" || field.loading) return "loading" as TState;
  if (field.error || field.state === "error") return "error" as TState;
  if (field.state) return field.state as TState;
  if (field.value) return "filled" as TState;
  return "default" as TState;
}

function actionStateFor(resolvedState: PaymentFormState, action: Partial<ButtonProps> = {}): NonNullable<ButtonProps["state"]> {
  if (resolvedState === "loading" || action.loading) return "loading";
  if (resolvedState === "disabled" || action.disabled) return "disabled";
  return action.state ?? "default";
}

export const PaymentForm = forwardRef<HTMLDivElement, PaymentFormProps>(function PaymentForm({
  label = "Payment form",
  description,
  density,
  state,
  disabled = false,
  loading = false,
  error,
  cardNumber = {},
  expiry = {},
  securityCode = {},
  amount = {},
  validation,
  feedback,
  submitAction = { key: "submit", label: "Continue" },
  secondaryAction,
  onCardNumberChange,
  onExpiryChange,
  onSecurityCodeChange,
  onAmountChange,
  onSubmit,
  onSecondaryAction,
  onFeedbackAction,
  className = "",
  ...rest
}, ref) {
  const resolvedState = resolveState({ disabled, loading, error, state });
  const isDisabled = disabled || resolvedState === "disabled";
  const isLoading = loading || resolvedState === "loading";

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "section",
      state: surfaceStateFor(resolvedState),
      density,
      elevation: "none",
      focusMode: "within",
      role: "group",
      "aria-label": label,
      "aria-description": description,
      "aria-busy": isLoading ? "true" : undefined,
      "data-flow-pattern": "payment-form",
      "data-flow-slot": "paymentSurface",
      "data-state": resolvedState,
      "data-density": density,
      ...sanitizeRestProps(rest),
    } as SurfaceProps,
    React.createElement(
      Surface,
      {
        surfaceRole: "panel",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        "data-flow-slot": "card-fields",
        "data-payment-section": "card",
      } as SurfaceProps,
      React.createElement(CardNumberInput, {
        ...cardNumber,
        label: cardNumber.label ?? "Card number",
        value: cardNumber.value,
        helper: cardNumber.helper,
        error: cardNumber.error,
        density: cardNumber.density ?? density,
        state: fieldStateFor<CardNumberInputProps["state"] & string>(resolvedState, cardNumber),
        loading: isLoading || cardNumber.loading,
        disabled: isDisabled || cardNumber.disabled,
        onValueChange: (digits: string, meta: CardNumberMeta, event: ChangeEvent<HTMLInputElement>) => {
          cardNumber.onValueChange?.(digits, meta, event);
          if (event.defaultPrevented) return;
          onCardNumberChange?.(digits, meta, event);
        },
      } as CardNumberInputProps),
      React.createElement(CardExpiryInput, {
        ...expiry,
        label: expiry.label ?? "Expiry date",
        value: expiry.value,
        helper: expiry.helper,
        error: expiry.error,
        density: expiry.density ?? density,
        state: fieldStateFor<CardExpiryInputProps["state"] & string>(resolvedState, expiry),
        loading: isLoading || expiry.loading,
        disabled: isDisabled || expiry.disabled,
        onValueChange: (value: string, meta: CardExpiryMeta, event: ChangeEvent<HTMLInputElement>) => {
          expiry.onValueChange?.(value, meta, event);
          if (event.defaultPrevented) return;
          onExpiryChange?.(value, meta, event);
        },
      } as CardExpiryInputProps),
      React.createElement(CardSecurityCodeInput, {
        ...securityCode,
        label: securityCode.label ?? "Security code",
        value: securityCode.value,
        helper: securityCode.helper,
        error: securityCode.error,
        density: securityCode.density ?? density,
        state: fieldStateFor<CardSecurityCodeInputProps["state"] & string>(resolvedState, securityCode),
        loading: isLoading || securityCode.loading,
        disabled: isDisabled || securityCode.disabled,
        onValueChange: (digits: string, meta: CardSecurityCodeMeta, event: ChangeEvent<HTMLInputElement>) => {
          securityCode.onValueChange?.(digits, meta, event);
          if (event.defaultPrevented) return;
          onSecurityCodeChange?.(digits, meta, event);
        },
      } as CardSecurityCodeInputProps),
    ),
    amount
      ? React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: surfaceStateFor(resolvedState),
          density,
          elevation: "none",
          "data-flow-slot": "amount-fields",
          "data-payment-section": "amount",
        } as SurfaceProps,
        React.createElement(InputAmount, {
          ...amount,
          label: amount.label ?? "Amount",
          value: amount.value,
          helper: amount.helper,
          error: amount.error,
          currency: amount.currency ?? "MXN",
          density: amount.density ?? density,
          state: fieldStateFor<InputAmountProps["state"] & string>(resolvedState, amount),
          loading: isLoading || amount.loading,
          disabled: isDisabled || amount.disabled,
          onValueChange: (value: string, meta: InputAmountMeta, event: ChangeEvent<HTMLInputElement>) => {
            amount.onValueChange?.(value, meta, event);
            if (event.defaultPrevented) return;
            onAmountChange?.(value, meta, event);
          },
        } as InputAmountProps),
      )
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (error ? "error" : "info"),
        field: validation.field ?? false,
        live: validation.live ?? true,
        density: validation.density ?? density,
        "data-flow-slot": "validation",
      } as InlineValidationProps)
      : null,
    feedback?.kind || feedback?.title || feedback?.description
      ? React.createElement(StatusFeedbackView, {
        ...feedback,
        label: feedback.label ?? `${label} status`,
        density: feedback.density ?? density,
        state: feedback.state ?? (error ? "error" : resolvedState),
        onAction: (key: string, event: MouseEvent<HTMLButtonElement>) => {
          feedback.onAction?.(key, event);
          if (event.defaultPrevented) return;
          onFeedbackAction?.(key, event);
        },
        "data-flow-pattern-boundary": "status-feedback-view",
      } as StatusFeedbackViewProps)
      : null,
    React.createElement(
      Surface,
      {
        surfaceRole: "inline",
        state: surfaceStateFor(resolvedState),
        density,
        elevation: "none",
        "data-flow-slot": "actions",
      } as SurfaceProps,
      secondaryAction?.label
        ? React.createElement(Button, {
          ...secondaryAction,
          label: secondaryAction.label,
          variant: secondaryAction.variant ?? "secondary",
          density: secondaryAction.density ?? density,
          state: actionStateFor(resolvedState, secondaryAction),
          disabled: isDisabled || secondaryAction.disabled,
          loading: isLoading || secondaryAction.loading,
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            secondaryAction.onClick?.(event);
            if (event.defaultPrevented) return;
            onSecondaryAction?.(secondaryAction.key ?? secondaryAction.label, event);
          },
        } as ButtonProps)
        : null,
      submitAction?.label
        ? React.createElement(Button, {
          ...submitAction,
          label: submitAction.label,
          variant: submitAction.variant ?? "primary",
          density: submitAction.density ?? density,
          state: actionStateFor(resolvedState, submitAction),
          disabled: isDisabled || submitAction.disabled,
          loading: isLoading || submitAction.loading,
          onClick: (event: MouseEvent<HTMLButtonElement>) => {
            submitAction.onClick?.(event);
            if (event.defaultPrevented) return;
            onSubmit?.(submitAction.key ?? submitAction.label, event);
          },
        } as ButtonProps)
        : null,
    ),
  );
}) as PaymentFormComponent;

PaymentForm.displayName = "PaymentForm";
