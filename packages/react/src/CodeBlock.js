/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef } from "react";
import { codeBlockPlatformContract } from "@design-system/components/platforms";
import { CopyButton } from "./CopyButton.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowVariantProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["block", "inline-group", "specimen"]);
const validStates = new Set(["default", "wrapped", "scrollable", "with-header", "with-copy", "copied", "error", "disabled"]);
function resolveVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "block";
}
function resolveState({ disabled, state }) {
    if (disabled)
        return "disabled";
    return state && validStates.has(state) ? state : "default";
}
function resolveCopyAction({ code, label, filename, language, copyAction, copyable, disabled, }) {
    if (!copyAction && !copyable)
        return null;
    return {
        value: copyAction?.value ?? code,
        ariaLabel: copyAction?.ariaLabel ?? (label || filename || language ? `Copy ${label ?? filename ?? language}` : "Copy snippet"),
        ...(copyAction?.label !== undefined ? { label: copyAction.label } : {}),
        ...(copyAction?.copiedLabel !== undefined ? { copiedLabel: copyAction.copiedLabel } : {}),
        ...(copyAction?.errorLabel !== undefined ? { errorLabel: copyAction.errorLabel } : {}),
        ...(disabled || copyAction?.disabled ? { disabled: true } : {}),
        ...(copyAction?.feedbackDuration !== undefined ? { feedbackDuration: copyAction.feedbackDuration } : {}),
    };
}
export const CodeBlock = forwardRef(function CodeBlock({ code, label, filename, language, helper, variant = "block", state = "default", density, copyAction, copyable = false, disabled = false, wrap = true, className = "", ...rest }, ref) {
    const resolvedVariant = resolveVariant(variant);
    const resolvedState = resolveState({ disabled, state: copyAction || copyable ? state === "default" ? "with-copy" : state : state });
    const resolvedDensity = normalizeFlowDensity(density);
    const resolvedCopyAction = resolveCopyAction({
        code,
        ...(label !== undefined ? { label } : {}),
        ...(filename !== undefined ? { filename } : {}),
        ...(language !== undefined ? { language } : {}),
        ...(copyAction !== undefined ? { copyAction } : {}),
        copyable,
        disabled,
    });
    if (!code)
        return null;
    return React.createElement("figure", {
        ...flowRestProps(rest),
        ref,
        className: ["code-block", className].filter(Boolean).join(" "),
        "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
        ...flowVariantProps(resolvedVariant),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-wrap": wrap ? "true" : "false",
        "data-language": language || undefined,
    }, label || filename || helper || language || resolvedCopyAction
        ? React.createElement("figcaption", { className: "code-block__header" }, React.createElement("span", { className: "code-block__meta" }, label ? React.createElement("strong", null, label) : null, filename ? React.createElement("span", { className: "code-block__filename" }, filename) : null, helper ? React.createElement("span", null, helper) : null, language ? React.createElement("span", { className: "code-block__language" }, language) : null), resolvedCopyAction
            ? React.createElement(CopyButton, {
                ...resolvedCopyAction,
                variant: "inline",
                className: "code-block__copy-action",
                ...(resolvedDensity !== undefined ? { density: resolvedDensity } : {}),
            })
            : null)
        : null, React.createElement("pre", { className: "code-block__pre" }, React.createElement("code", { className: language ? `language-${language}` : undefined }, code)));
});
CodeBlock.displayName = "CodeBlock";
CodeBlock.platformContract = codeBlockPlatformContract;
