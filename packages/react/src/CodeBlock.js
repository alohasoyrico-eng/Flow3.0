import React, { forwardRef } from "react";
import { Button } from "./Button.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowVariantProps, normalizeFlowDensity } from "./internal/props.js";
const validVariants = new Set(["standard", "source", "inline"]);
const validStates = new Set(["default", "focus", "copied", "error", "disabled"]);
function resolveVariant(variant) {
    return variant && validVariants.has(variant) ? variant : "standard";
}
function resolveState({ disabled, state }) {
    if (disabled)
        return "disabled";
    return state && validStates.has(state) ? state : "default";
}
export const CodeBlock = forwardRef(function CodeBlock({ code, label, language, helper, variant = "standard", state = "default", density, copyAction, disabled = false, wrap = true, className = "", ...rest }, ref) {
    const resolvedVariant = resolveVariant(variant);
    const resolvedState = resolveState({ disabled, state });
    const resolvedDensity = normalizeFlowDensity(density);
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
    }, label || helper || copyAction
        ? React.createElement("figcaption", { className: "code-block__header" }, React.createElement("span", { className: "code-block__meta" }, label ? React.createElement("strong", null, label) : null, helper ? React.createElement("span", null, helper) : null, language ? React.createElement("span", { "data-flow-slot": "code-block.language" }, language) : null), copyAction
            ? React.createElement(Button, {
                ...copyAction,
                label: copyAction.label ?? "Copy",
                density: copyAction.density ?? resolvedDensity,
                variant: copyAction.variant ?? "secondary",
                disabled: disabled || copyAction.disabled,
                "data-flow-slot": "code-block.copy-action",
            })
            : null)
        : null, React.createElement("pre", { className: "code-block__pre" }, React.createElement("code", { className: language ? `language-${language}` : undefined }, code)));
});
CodeBlock.displayName = "CodeBlock";
