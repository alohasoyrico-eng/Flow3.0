/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useId, useState, } from "react";
import { chatComposerPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { TextArea } from "./TextArea.js";
import { Surface } from "./Surface.js";
import { flowDensityProps, flowRestProps, flowStateProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";
const validStates = new Set(["default", "focus", "filled", "sending", "disabled", "error"]);
function resolveState({ disabled, sending, error, value, state, }) {
    if (disabled)
        return "disabled";
    if (sending)
        return "sending";
    if (error)
        return "error";
    if (state)
        return normalizeFlowValue(state, validStates, "default");
    return value ? "filled" : "default";
}
export const ChatComposer = forwardRef(function ChatComposer({ label = "Message", helper, placeholder = "", value, defaultValue = "", disabled = false, sending = false, error = "", density, state, maxLength, rows = 2, sendLabel = "Send", attachLabel, onValueChange, onSend, onAttach, className = "", id, ...rest }, ref) {
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
    const handleValueChange = (nextValue, meta, event) => {
        if (!isValueControlled)
            setInternalValue(nextValue);
        onValueChange?.(nextValue, meta, event);
    };
    const handleSend = (event) => {
        if (!canSend)
            return;
        onSend?.(currentValue, event);
        if (event.defaultPrevented)
            return;
        if (!isValueControlled)
            setInternalValue("");
    };
    return React.createElement(Surface, {
        ...flowRestProps(rest),
        ref,
        className: ["chat-composer", className].filter(Boolean).join(" "),
        surfaceRole: "section",
        role: "form",
        "aria-label": label,
        "data-flow-component": "chat-composer",
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
    }, attachLabel
        ? React.createElement(IconButton, {
            label: attachLabel,
            icon: "attach_file",
            variant: "ghost",
            disabled: isDisabled,
            className: "chat-composer__attach",
            onClick: onAttach,
            ...(resolvedDensity ? { density: resolvedDensity } : {}),
        })
        : null, React.createElement(TextArea, {
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
    }), React.createElement(Button, {
        label: sendLabel,
        variant: "primary",
        state: sending ? "loading" : canSend ? "default" : "disabled",
        disabled: !canSend,
        loading: sending,
        className: "chat-composer__send",
        onClick: handleSend,
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
    }));
});
ChatComposer.displayName = "ChatComposer";
ChatComposer.platformContract = chatComposerPlatformContract;
