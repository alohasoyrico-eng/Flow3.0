import type { ChangeEvent, ForwardRefExoticComponent, HTMLAttributes, MouseEvent, RefAttributes } from "react";
import { chatComposerPlatformContract } from "#flow/platforms";
import type { TextAreaChangeMeta } from "./TextArea.js";
import type { FlowDataAttributes } from "./internal/props.js";

export type ChatComposerState = "default" | "focus" | "filled" | "sending" | "disabled" | "error";
export type ChatComposerDensity = "sm" | "md" | "lg";

export interface ChatComposerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "defaultValue" | "onChange" | "onSubmit" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label?: string;
  helper?: string;
  placeholder?: string;
  value?: string;
  defaultValue?: string;
  disabled?: boolean;
  sending?: boolean;
  error?: string;
  density?: ChatComposerDensity;
  state?: ChatComposerState;
  maxLength?: number;
  rows?: number;
  sendLabel?: string;
  attachLabel?: string;
  onValueChange?: (value: string, meta: TextAreaChangeMeta, event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSend?: (value: string, event: MouseEvent<HTMLButtonElement>) => void;
  onAttach?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ChatComposerComponent extends ForwardRefExoticComponent<ChatComposerProps & RefAttributes<HTMLDivElement>> {
  displayName: "ChatComposer";
  platformContract: typeof chatComposerPlatformContract;
}

export const ChatComposer: ChatComposerComponent;
