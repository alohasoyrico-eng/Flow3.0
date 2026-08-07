import type { ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { codeInputPlatformContract } from "@design-system/components/platforms";

export type CodeInputDensity = "sm" | "md" | "lg";
export type CodeInputVariant = "sms" | "otp" | "approval" | "masked" | "compact";
export type CodeInputState = "default" | "hover" | "focus" | "complete" | "warning" | "error" | "disabled";

export interface CodeInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
  onValueChange?: (value: string) => void;
  onComplete?: (value: string) => void;
}

export interface CodeInputComponent extends ForwardRefExoticComponent<CodeInputProps & RefAttributes<HTMLInputElement>> {
  displayName: "CodeInput";
  platformContract: typeof codeInputPlatformContract;
}

export const CodeInput: CodeInputComponent;
