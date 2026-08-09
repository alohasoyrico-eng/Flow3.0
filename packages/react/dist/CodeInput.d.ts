import type { ChangeEvent, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import { codeInputPlatformContract } from "#flow/platforms";

export type CodeInputDensity = "sm" | "md" | "lg";
export type CodeInputVariant = "sms" | "otp" | "approval" | "masked" | "compact";
export type CodeInputState = "default" | "hover" | "focus" | "complete" | "warning" | "error" | "disabled";

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

export const CodeInput: CodeInputComponent;
