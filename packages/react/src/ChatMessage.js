/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, } from "react";
import { chatMessagePlatformContract } from "@design-system/components/platforms";
import { Avatar } from "./Avatar.js";
import { Button } from "./Button.js";
import { Surface } from "./Surface.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowToneProps, normalizeFlowDensity, normalizeFlowValue } from "./internal/props.js";
const validAuthors = new Set(["user", "agent", "system", "assistant"]);
const validStates = new Set(["default", "sending", "sent", "delivered", "failed", "loading"]);
const validTones = new Set(["neutral", "info", "success", "warning", "danger"]);
const CompatibleAvatar = Avatar;
const CompatibleButton = Button;
function messageRoleForTone(tone, state) {
    if (tone === "danger" || state === "failed")
        return "alert";
    if (tone === "warning" || state === "sending" || state === "loading")
        return "status";
    return undefined;
}
function surfaceToneForMessage(tone) {
    if (tone === "neutral" || tone === "info")
        return "default";
    return tone;
}
export const ChatMessage = forwardRef(function ChatMessage({ author = "agent", authorLabel, avatar, body, children, timestamp, meta, state = "default", tone = "neutral", density, action, className = "", ...rest }, ref) {
    const resolvedAuthor = normalizeFlowValue(author, validAuthors, "agent");
    const resolvedState = normalizeFlowValue(state, validStates, "default");
    const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
    const resolvedDensity = normalizeFlowDensity(density);
    const role = messageRoleForTone(resolvedTone, resolvedState);
    const content = body ?? children;
    if (!content && resolvedState !== "loading")
        return null;
    return React.createElement("article", {
        ...flowRestProps(rest),
        ref,
        className: ["chat-message", className].filter(Boolean).join(" "),
        role,
        "aria-live": role === "alert" ? "assertive" : role === "status" ? "polite" : undefined,
        "data-flow-component": "chat-message",
        "data-author": resolvedAuthor,
        ...flowStateProps(resolvedState),
        ...flowToneProps(resolvedTone),
        ...flowDensityProps(resolvedDensity),
    }, resolvedAuthor !== "user" && avatar
        ? React.createElement(CompatibleAvatar, {
            ...avatar,
            name: avatar.name ?? authorLabel ?? "Agent",
            className: ["chat-message__avatar", avatar.className].filter(Boolean).join(" "),
            ...(avatar.density ?? resolvedDensity ? { density: avatar.density ?? resolvedDensity } : {}),
        })
        : null, React.createElement(Surface, {
        className: "chat-message__bubble",
        surfaceRole: "inline",
        tone: surfaceToneForMessage(resolvedTone),
        state: resolvedState === "failed" ? "focused" : "default",
        "data-flow-slot": "message-bubble",
        ...(resolvedDensity ? { density: resolvedDensity } : {}),
    }, authorLabel || timestamp || meta
        ? React.createElement("header", { className: "chat-message__header" }, authorLabel ? React.createElement("strong", { className: "chat-message__author" }, authorLabel) : null, timestamp ? React.createElement("time", { className: "chat-message__time" }, timestamp) : null, meta ? React.createElement("span", { className: "chat-message__meta" }, meta) : null)
        : null, resolvedState === "loading"
        ? React.createElement("span", { className: "chat-message__typing", "aria-label": "Message loading" })
        : React.createElement("p", { className: "chat-message__body" }, content), action?.label
        ? React.createElement(CompatibleButton, {
            ...action,
            label: action.label,
            variant: action.variant ?? "ghost",
            className: ["chat-message__action", action.className].filter(Boolean).join(" "),
            onClick: action.onClick,
            ...(action.density ?? resolvedDensity ? { density: action.density ?? resolvedDensity } : {}),
        })
        : null));
});
ChatMessage.displayName = "ChatMessage";
ChatMessage.platformContract = chatMessagePlatformContract;
