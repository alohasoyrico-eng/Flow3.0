import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import type { ButtonProps } from "./Button.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type CodeBlockVariant = "standard" | "source" | "inline";
export type CodeBlockState = "default" | "focus" | "copied" | "error" | "disabled";
export type CodeBlockDensity = FlowDensity;

export interface CodeBlockAction extends ButtonProps {
  key?: string;
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "children" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  code: string;
  label?: string;
  language?: string;
  helper?: string;
  variant?: CodeBlockVariant;
  state?: CodeBlockState;
  density?: CodeBlockDensity;
  copyAction?: CodeBlockAction;
  disabled?: boolean;
  wrap?: boolean;
}

export interface CodeBlockComponent extends ForwardRefExoticComponent<CodeBlockProps & RefAttributes<HTMLElement>> {
  displayName: "CodeBlock";
}

export const CodeBlock: CodeBlockComponent;
