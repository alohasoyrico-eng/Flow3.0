import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { CardProps } from "../Card.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { SelectProps } from "../Select.js";
import type { StepperStep } from "../Stepper.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { FormSectionProps } from "./FormSection.js";

export type MultiStepFormState = "not-started" | "active" | "dirty" | "validating" | "invalid" | "saving" | "complete" | "disabled";
export type MultiStepFormDensity = "sm" | "md" | "lg";

export interface MultiStepFormInputField extends Partial<InputProps> {
  kind?: "input";
  key?: string;
  label: string;
}

export interface MultiStepFormSelectField extends Partial<SelectProps> {
  kind: "select";
  key?: string;
  label: string;
}

export type MultiStepFormField = MultiStepFormInputField | MultiStepFormSelectField;

export interface MultiStepFormProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: MultiStepFormDensity;
  state?: MultiStepFormState;
  started?: boolean;
  dirty?: boolean;
  validating?: boolean;
  invalid?: boolean;
  saving?: boolean;
  complete?: boolean;
  disabled?: boolean;
  steps?: StepperStep[];
  currentStep?: number;
  summary?: Partial<CardProps>;
  fields?: MultiStepFormField[];
  formSection?: Partial<FormSectionProps>;
  validation?: Partial<InlineValidationProps>;
  primaryAction?: ButtonProps;
  secondaryAction?: ButtonProps;
  backAction?: ButtonProps;
  saveAction?: ButtonProps;
  feedback?: ToastProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface MultiStepFormComponent extends ForwardRefExoticComponent<MultiStepFormProps & RefAttributes<HTMLDivElement>> {
  displayName: "MultiStepForm";
}

export const MultiStepForm: MultiStepFormComponent;
