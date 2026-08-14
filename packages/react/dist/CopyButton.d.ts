import type { ButtonHTMLAttributes, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { copyButtonPlatformContract } from "#flow/platforms";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type CopyButtonVariant = "text" | "icon" | "inline";
export type CopyButtonState = "default" | "hover" | "focus" | "pressed" | "copied" | "error" | "disabled" | "loading";
export type CopyButtonDensity = FlowDensity;
export type CopyButtonType = "button" | "submit" | "reset";

export type CopyButtonMeta = {
  value: string;
  state: CopyButtonState;
};
export type CopyButtonEvent = MouseEvent<HTMLButtonElement>;

export interface CopyButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "children" | "disabled" | "type" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  value: string;
  label?: string;
  ariaLabel?: string;
  variant?: CopyButtonVariant;
  state?: CopyButtonState;
  density?: CopyButtonDensity;
  feedbackDuration?: number;
  copiedLabel?: string;
  errorLabel?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  type?: CopyButtonType;
  onCopied?: (meta: CopyButtonMeta, event: CopyButtonEvent) => void;
  onCopyError?: (meta: CopyButtonMeta, event: CopyButtonEvent) => void;
}

export interface CopyButtonComponent extends ForwardRefExoticComponent<CopyButtonProps & RefAttributes<HTMLButtonElement>> {
  displayName: "CopyButton";
  platformContract: typeof copyButtonPlatformContract;
}

export const CopyButton: CopyButtonComponent;
