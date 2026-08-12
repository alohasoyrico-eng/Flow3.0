import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { CardDensity } from "../Card.js";
import type { CheckboxProps, CheckboxValueMeta } from "../Checkbox.js";
import type { IconButtonProps } from "../IconButton.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputAlign, InputProps, InputValueMeta, InputVariant } from "../Input.js";
import type { RadioButtonProps, RadioButtonValueMeta } from "../RadioButton.js";
import type { SelectOpenChangeEvent, SelectOption, SelectValueChangeEvent, SelectValueMeta } from "../Select.js";
import type { SwitchProps, SwitchValueMeta } from "../Switch.js";
import type { TextAreaChangeMeta } from "../TextArea.js";
import type { ToastProps } from "../Toast.js";

export type FormSectionState = "idle" | "dirty" | "validating" | "invalid" | "saving" | "saved" | "disabled";
export type FormSectionDensity = CardDensity;

export interface FormSectionField {
  key?: string;
  kind?: "input" | "select" | "checkbox" | "switch" | "radio-button" | "text-area" | "icon-button";
  label: string;
  description?: string;
  helper?: string;
  helperText?: string;
  error?: string;
  value?: string;
  name?: string;
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  required?: boolean;
  state?: InputProps["state"];
  variant?: InputVariant;
  icon?: string;
  prefix?: string;
  suffix?: string;
  mono?: boolean;
  align?: InputAlign;
  revealable?: boolean;
  revealLabel?: string;
  hideLabel?: string;
  autocomplete?: string;
  options?: SelectOption[];
  open?: boolean;
  checked?: boolean;
  indeterminate?: boolean;
  selectedValue?: string;
  selected?: boolean;
  badge?: boolean;
  ariaLabel?: string;
  rows?: number;
  maxLength?: number;
  onClick?: IconButtonProps["onClick"];
  onOpenChange?: (open: boolean, event?: SelectOpenChangeEvent) => void;
  onCheckedChange?: (
    checked: boolean,
    meta: CheckboxValueMeta | SwitchValueMeta | RadioButtonValueMeta,
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onValueChange?: (
    value: string,
    meta: InputValueMeta | TextAreaChangeMeta | SelectValueMeta,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | SelectValueChangeEvent
  ) => void;
  checkboxProps?: Partial<CheckboxProps>;
  switchProps?: Partial<SwitchProps>;
  radioButtonProps?: Partial<RadioButtonProps>;
}

export interface FormSectionAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface FormSectionValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {
  summary?: string;
}

export interface FormSectionFeedback extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "density" | "actionLabel" | "dismissible" | "dismissLabel" | "onAction" | "onDismiss"> {}

export interface FormSectionProps {
  title: string;
  description?: string;
  density?: FormSectionDensity;
  state?: FormSectionState;
  disabled?: boolean;
  loading?: boolean;
  fields?: FormSectionField[];
  primaryAction?: FormSectionAction;
  secondaryAction?: FormSectionAction;
  validation?: FormSectionValidation;
  feedback?: FormSectionFeedback;
  className?: string;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onFieldValueChange?: (
    key: string,
    value: string,
    meta: InputValueMeta | TextAreaChangeMeta | SelectValueMeta | CheckboxValueMeta | SwitchValueMeta | RadioButtonValueMeta,
    event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement> | SelectValueChangeEvent
  ) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface FormSectionComponent extends ForwardRefExoticComponent<FormSectionProps & RefAttributes<HTMLDivElement>> {
  displayName: "FormSection";
}

export const FormSection: FormSectionComponent;
