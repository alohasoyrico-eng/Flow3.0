import React, { forwardRef } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { Button, type ButtonProps } from "./Button.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowVariantProps, normalizeFlowDensity } from "./internal/props.js";
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

const validVariants = new Set<CodeBlockVariant>(["standard", "source", "inline"]);
const validStates = new Set<CodeBlockState>(["default", "focus", "copied", "error", "disabled"]);

function resolveVariant(variant: CodeBlockVariant | undefined): CodeBlockVariant {
  return variant && validVariants.has(variant) ? variant : "standard";
}

function resolveState({ disabled, state }: { disabled?: boolean; state?: CodeBlockState }): CodeBlockState {
  if (disabled) return "disabled";
  return state && validStates.has(state) ? state : "default";
}

export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock({
  code,
  label,
  language,
  helper,
  variant = "standard",
  state = "default",
  density,
  copyAction,
  disabled = false,
  wrap = true,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = resolveVariant(variant);
  const resolvedState = resolveState({ disabled, state });
  const resolvedDensity = normalizeFlowDensity(density);
  if (!code) return null;

  return React.createElement(
    "figure",
    {
      ...flowRestProps(rest),
      ref,
      className: ["code-block", className].filter(Boolean).join(" "),
      "aria-disabled": resolvedState === "disabled" ? "true" : undefined,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-wrap": wrap ? "true" : "false",
      "data-language": language || undefined,
    },
    label || helper || copyAction
      ? React.createElement(
        "figcaption",
        { className: "code-block__header" },
        React.createElement(
          "span",
          { className: "code-block__meta" },
          label ? React.createElement("strong", null, label) : null,
          helper ? React.createElement("span", null, helper) : null,
          language ? React.createElement("span", { "data-flow-slot": "code-block.language" }, language) : null,
        ),
        copyAction
          ? React.createElement(Button, {
            ...copyAction,
            label: copyAction.label ?? "Copy",
            density: copyAction.density ?? resolvedDensity,
            variant: copyAction.variant ?? "secondary",
            disabled: disabled || copyAction.disabled,
            "data-flow-slot": "code-block.copy-action",
          } as ButtonProps)
          : null,
      )
      : null,
    React.createElement(
      "pre",
      { className: "code-block__pre" },
      React.createElement("code", { className: language ? `language-${language}` : undefined }, code),
    ),
  );
}) as CodeBlockComponent;

CodeBlock.displayName = "CodeBlock";
