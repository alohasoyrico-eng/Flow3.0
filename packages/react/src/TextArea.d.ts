import type { ChangeEvent, ForwardRefExoticComponent, RefAttributes, TextareaHTMLAttributes } from "react";
import { textAreaPlatformContract } from "@design-system/components/platforms";

export type TextAreaDensity = "sm" | "md" | "lg";
export type TextAreaState = "default" | "focus" | "filled" | "loading" | "error" | "disabled";

export interface TextAreaChangeMeta {
  length: number;
  maxLength?: number;
}

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
  label: string;
  helper?: string;
  helperText?: string;
  error?: string;
  value?: string;
  loading?: boolean;
  density?: TextAreaDensity;
  state?: TextAreaState;
  onValueChange?: (value: string, meta: TextAreaChangeMeta, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onChange?: (value: string, meta: TextAreaChangeMeta, event: ChangeEvent<HTMLTextAreaElement>) => void;
}

export interface TextAreaComponent extends ForwardRefExoticComponent<TextAreaProps & RefAttributes<HTMLTextAreaElement>> {
  displayName: "TextArea";
  platformContract: typeof textAreaPlatformContract;
}

export const TextArea: TextAreaComponent;
