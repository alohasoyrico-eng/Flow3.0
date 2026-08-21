import React, { forwardRef, useRef, useState } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, RefAttributes } from "react";
import { codeBlockPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { flowDensityProps, flowRestProps, flowStateProps, flowVariantProps, normalizeFlowDensity } from "./internal/props.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type CodeBlockVariant = "block" | "inline-group" | "specimen";
export type CodeBlockState = "default" | "wrapped" | "scrollable" | "with-header" | "with-copy" | "copied" | "error" | "disabled";
export type CodeBlockDensity = FlowDensity;
export type CodeBlockCopyMeta = {
  value: string;
  state: "copied" | "error";
};
export type CodeBlockCopyEvent = React.MouseEvent<HTMLButtonElement>;

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

type ResolvedCodeBlockAction = CodeBlockAction & {
  value: string;
  ariaLabel: string;
};

type CodeBlockCopyFeedback = "copied" | "error";

export interface CodeBlockComponent extends ForwardRefExoticComponent<CodeBlockProps & RefAttributes<HTMLElement>> {
  displayName: "CodeBlock";
  platformContract: typeof codeBlockPlatformContract;
}

const validVariants = new Set<CodeBlockVariant>(["block", "inline-group", "specimen"]);
const validStates = new Set<CodeBlockState>(["default", "wrapped", "scrollable", "with-header", "with-copy", "copied", "error", "disabled"]);

function resolveVariant(variant: CodeBlockVariant | undefined): CodeBlockVariant {
  return variant && validVariants.has(variant) ? variant : "block";
}

function resolveState({ disabled, state }: { disabled?: boolean; state?: CodeBlockState }): CodeBlockState {
  if (disabled) return "disabled";
  return state && validStates.has(state) ? state : "default";
}

function resolveCopyAction({
  code,
  label,
  filename,
  language,
  copyAction,
  copyable,
  disabled,
}: {
  code: string;
  label?: string;
  filename?: string;
  language?: string;
  copyAction?: CodeBlockAction;
  copyable?: boolean;
  disabled?: boolean;
}): ResolvedCodeBlockAction | null {
  if (!copyAction && !copyable) return null;
  return {
    value: copyAction?.value ?? code,
    ariaLabel: copyAction?.ariaLabel ?? (label || filename || language ? `Copy ${label ?? filename ?? language}` : "Copy snippet"),
    ...(copyAction?.label !== undefined ? { label: copyAction.label } : {}),
    ...(copyAction?.copiedLabel !== undefined ? { copiedLabel: copyAction.copiedLabel } : {}),
    ...(copyAction?.errorLabel !== undefined ? { errorLabel: copyAction.errorLabel } : {}),
    ...(disabled || copyAction?.disabled ? { disabled: true } : {}),
    ...(copyAction?.feedbackDuration !== undefined ? { feedbackDuration: copyAction.feedbackDuration } : {}),
    ...(copyAction?.onCopied !== undefined ? { onCopied: copyAction.onCopied } : {}),
    ...(copyAction?.onCopyError !== undefined ? { onCopyError: copyAction.onCopyError } : {}),
  };
}

export const CodeBlock = forwardRef<HTMLElement, CodeBlockProps>(function CodeBlock({
  code,
  label,
  filename,
  language,
  helper,
  variant = "block",
  state = "default",
  density,
  copyAction,
  copyable = false,
  disabled = false,
  wrap = true,
  className = "",
  ...rest
}, ref) {
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
  const [copyFeedback, setCopyFeedback] = useState<CodeBlockCopyFeedback | null>(null);
  const copyFeedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateCopyFeedback(nextFeedback: CodeBlockCopyFeedback, duration = 1600) {
    setCopyFeedback(nextFeedback);
    if (copyFeedbackTimer.current) {
      clearTimeout(copyFeedbackTimer.current);
    }
    copyFeedbackTimer.current = setTimeout(() => setCopyFeedback(null), duration);
  }

  async function handleCopyClick(event: React.MouseEvent<HTMLButtonElement>) {
    if (!resolvedCopyAction || resolvedCopyAction.disabled || resolvedState === "disabled") return;
    try {
      if (typeof navigator === "undefined" || !navigator.clipboard?.writeText) {
        throw new Error("Clipboard API is not available.");
      }
      await navigator.clipboard.writeText(resolvedCopyAction.value);
      updateCopyFeedback("copied", resolvedCopyAction.feedbackDuration);
      resolvedCopyAction.onCopied?.({ value: resolvedCopyAction.value, state: "copied" }, event);
    } catch {
      updateCopyFeedback("error", resolvedCopyAction.feedbackDuration);
      resolvedCopyAction.onCopyError?.({ value: resolvedCopyAction.value, state: "error" }, event);
    }
  }

  if (!code) return null;

  const copyActionState = copyFeedback ?? (resolvedState === "copied" || resolvedState === "error" ? resolvedState : null);
  const copyActionLabel =
    copyActionState === "copied"
      ? resolvedCopyAction?.copiedLabel ?? "Copied"
      : copyActionState === "error"
        ? resolvedCopyAction?.errorLabel ?? "Copy failed"
        : resolvedCopyAction?.label ?? "Copy";

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
    label || filename || helper || language || resolvedCopyAction
      ? React.createElement(
        "figcaption",
        { className: "code-block__header" },
        React.createElement(
          "span",
          { className: "code-block__meta" },
          label ? React.createElement("strong", null, label) : null,
          filename ? React.createElement("span", { className: "code-block__filename" }, filename) : null,
          helper ? React.createElement("span", null, helper) : null,
          language ? React.createElement("span", { className: "code-block__language" }, language) : null,
        ),
        resolvedCopyAction
          ? React.createElement(Button, {
            label: copyActionLabel,
            variant: "tertiary",
            className: "code-block__copy-action",
            "aria-label": resolvedCopyAction.ariaLabel,
            "data-copy-feedback": copyActionState ?? undefined,
            disabled: Boolean(resolvedCopyAction.disabled) || resolvedState === "disabled",
            onClick: handleCopyClick,
            ...(resolvedDensity !== undefined ? { density: resolvedDensity } : {}),
          })
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
CodeBlock.platformContract = codeBlockPlatformContract;
