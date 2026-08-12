import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useId,
  useState,
} from "react";
import { chatComposerPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { TextArea } from "./TextArea.js";
import type { TextAreaChangeMeta } from "./TextArea.js";
import { Surface } from "./Surface.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";

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

const validStates = new Set<ChatComposerState>(["default", "focus", "filled", "sending", "disabled", "error"]);

function resolveState({
  disabled,
  sending,
  error,
  value,
  state,
}: {
  disabled: boolean;
  sending: boolean;
  error: string;
  value: string;
  state?: ChatComposerState;
}): ChatComposerState {
  if (disabled) return "disabled";
  if (sending) return "sending";
  if (error) return "error";
  if (state) return normalizeFlowValue(state, validStates, "default");
  return value ? "filled" : "default";
}

export const ChatComposer = forwardRef<HTMLDivElement, ChatComposerProps>(function ChatComposer({
  label = "Message",
  helper,
  placeholder = "",
  value,
  defaultValue = "",
  disabled = false,
  sending = false,
  error = "",
  density,
  state,
  maxLength,
  rows = 2,
  sendLabel = "Send",
  attachLabel,
  onValueChange,
  onSend,
  onAttach,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const composerId = id ?? `chat-composer-${generatedId}`;
  const resolvedDensity = normalizeFlowDensity(density);
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue);
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const resolvedState = resolveState({
    disabled,
    sending,
    error,
    value: currentValue,
    ...(state ? { state } : {}),
  });
  const isDisabled = Boolean(disabled) || Boolean(sending);
  const canSend = Boolean(currentValue.trim()) && !isDisabled && !error;

  const handleValueChange = (nextValue: string, meta: TextAreaChangeMeta, event: ChangeEvent<HTMLTextAreaElement>): void => {
    if (!isValueControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue, meta, event);
  };

  const handleSend = (event: MouseEvent<HTMLButtonElement>): void => {
    if (!canSend) return;
    onSend?.(currentValue, event);
    if (event.defaultPrevented) return;
    if (!isValueControlled) setInternalValue("");
  };

  return React.createElement(
    Surface,
    {
      ...flowRestProps(rest),
      ref,
      className: ["chat-composer", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      role: "form",
      "aria-label": label,
      "data-flow-component": "chat-composer",
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
    },
    attachLabel
      ? React.createElement(IconButton, {
        label: attachLabel,
        icon: "attach_file",
        variant: "ghost",
        disabled: isDisabled,
        className: "chat-composer__attach",
        onClick: onAttach,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
      })
      : null,
    React.createElement(TextArea, {
      id: composerId,
      label,
      value: currentValue,
      placeholder,
      disabled: isDisabled,
      loading: sending,
      rows,
      className: "chat-composer__field",
      onValueChange: handleValueChange,
      ...(helper !== undefined ? { helper } : {}),
      ...(error ? { error } : {}),
      ...(maxLength !== undefined ? { maxLength } : {}),
      ...(resolvedDensity ? { density: resolvedDensity } : {}),
    }),
    React.createElement(Button, {
      label: sendLabel,
      variant: "primary",
      state: sending ? "loading" : canSend ? "default" : "disabled",
      disabled: !canSend,
      loading: sending,
      className: "chat-composer__send",
      onClick: handleSend,
      ...(resolvedDensity ? { density: resolvedDensity } : {}),
    }),
  );
}) as ChatComposerComponent;

ChatComposer.displayName = "ChatComposer";
ChatComposer.platformContract = chatComposerPlatformContract;
