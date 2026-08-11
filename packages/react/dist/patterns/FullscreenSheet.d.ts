import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { CardSummaryProps } from "../CardSummary.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { SelectProps } from "../Select.js";
import type { StepperStep } from "../Stepper.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ActionSheetProps } from "./ActionSheet.js";

export type FullscreenSheetState = "closed" | "open" | "dirty" | "validating" | "saving" | "error" | "dismiss-confirming" | "disabled";
export type FullscreenSheetDensity = "sm" | "md" | "lg";
export type FullscreenSheetFieldKind = "input" | "select";

export interface FullscreenSheetInputField extends Partial<InputProps> {
  kind?: "input";
  key?: string;
  label: string;
}

export interface FullscreenSheetSelectField extends Partial<SelectProps> {
  kind: "select";
  key?: string;
  label: string;
}

export type FullscreenSheetField = FullscreenSheetInputField | FullscreenSheetSelectField;

export interface FullscreenSheetProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: FullscreenSheetDensity;
  state?: FullscreenSheetState;
  open?: boolean;
  dirty?: boolean;
  validating?: boolean;
  saving?: boolean;
  disabled?: boolean;
  dismissConfirming?: boolean;
  summary?: Partial<CardSummaryProps>;
  steps?: StepperStep[];
  currentStep?: number;
  fields?: FullscreenSheetField[];
  validation?: Partial<InlineValidationProps>;
  primaryAction?: ButtonProps;
  secondaryAction?: ButtonProps;
  closeAction?: ButtonProps;
  actionSheet?: Partial<ActionSheetProps>;
  feedback?: ToastProps;
  error?: Partial<ToastProps>;
  className?: string;
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface FullscreenSheetComponent extends ForwardRefExoticComponent<FullscreenSheetProps & RefAttributes<HTMLDivElement>> {
  displayName: "FullscreenSheet";
}

export const FullscreenSheet: FullscreenSheetComponent;
