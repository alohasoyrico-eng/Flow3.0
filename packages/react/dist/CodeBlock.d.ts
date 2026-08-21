import type { ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import type { codeBlockPlatformContract } from "#flow/platforms";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type CodeBlockVariant = "block" | "inline-group" | "specimen";
export type CodeBlockState = "default" | "wrapped" | "scrollable" | "with-header" | "with-copy" | "copied" | "error" | "disabled";
export type CodeBlockDensity = FlowDensity;
export type CodeBlockCopyMeta = {
  value: string;
  state: "copied" | "error";
};
export type CodeBlockCopyEvent = MouseEvent<HTMLButtonElement>;

export interface CodeBlockAction {
  value?: string;
  label?: string;
  ariaLabel?: string;
  copiedLabel?: string;
  errorLabel?: string;
  disabled?: boolean;
  feedbackDuration?: number;
  onCopied?: (meta: CodeBlockCopyMeta, event: CodeBlockCopyEvent) => void;
  onCopyError?: (meta: CodeBlockCopyMeta, event: CodeBlockCopyEvent) => void;
}

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "children" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  code: string;
  label?: string;
  filename?: string;
  language?: string;
  helper?: string;
  variant?: CodeBlockVariant;
  state?: CodeBlockState;
  density?: CodeBlockDensity;
  copyAction?: CodeBlockAction;
  copyable?: boolean;
  disabled?: boolean;
  wrap?: boolean;
}

export interface CodeBlockComponent extends ForwardRefExoticComponent<CodeBlockProps & RefAttributes<HTMLElement>> {
  displayName: "CodeBlock";
  platformContract: typeof codeBlockPlatformContract;
}

export const CodeBlock: CodeBlockComponent;
