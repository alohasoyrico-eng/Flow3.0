import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { CardExpiryInputProps, CardExpiryMeta } from "../CardExpiryInput.js";
import type { CardNumberInputProps, CardNumberMeta } from "../CardNumberInput.js";
import type { CardSecurityCodeInputProps, CardSecurityCodeMeta } from "../CardSecurityCodeInput.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputAmountMeta, InputAmountProps } from "../InputAmount.js";
import type { FlowDataAttributes } from "../internal/props.js";
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

export const PaymentForm: PaymentFormComponent;
