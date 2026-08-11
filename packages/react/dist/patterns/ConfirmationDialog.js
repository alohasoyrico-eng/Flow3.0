import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { Dialog } from "../Dialog.js";
import { ErrorPanel } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import { Toast } from "../Toast.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

export const ConfirmationDialog = forwardRef(function ConfirmationDialog({
  label,
  description = "",
  triggerLabel,
  closeLabel,
  open = false,
  density,
  state = "closed",
  tone = "neutral",
  destructive = false,
  disabled = false,
  loading = false,
  confirm,
  cancel,
  recovery,
  validation,
  feedback,
  onOpenChange,
  onConfirm,
  onCancel,
  onRecoveryAction,
  className = "",
  ...rest
}, ref) {
  const resolvedState = disabled ? "disabled" : loading || state === "loading" || state === "confirming" ? "loading" : open ? "open" : "closed";
  const resolvedTone = destructive ? "danger" : tone;
  const confirmAction = {
    key: confirm?.key ?? "confirm",
    label: confirm?.label ?? "Confirm",
    variant: confirm?.variant ?? (destructive ? "danger" : "primary"),
    intent: confirm?.intent ?? (destructive ? "danger" : "default"),
    density: confirm?.density ?? density,
    disabled: disabled || confirm?.disabled,
    loading: loading || confirm?.loading,
    onClick: confirm?.onClick,
  };
  const cancelAction = {
    key: cancel?.key ?? "cancel",
    label: cancel?.label ?? "Cancel",
    variant: cancel?.variant ?? "secondary",
    intent: cancel?.intent ?? "default",
    density: cancel?.density ?? density,
    disabled: disabled || cancel?.disabled,
    onClick: cancel?.onClick,
  };

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      "data-flow-pattern": "confirmation-dialog",
      "data-state": resolvedState,
      "data-density": density,
      "data-destructive": String(Boolean(destructive)),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Dialog, {
      label,
      description,
      triggerLabel,
      closeLabel,
      open,
      density,
      tone: resolvedTone,
      variant: destructive ? "destructive" : "confirmation",
      state: open ? "open" : "closed",
      actions: [cancelAction, confirmAction],
      onOpenChange,
      onAction: (key, event) => {
        if (key === cancelAction.key) {
          cancel?.onClick?.(event);
          if (event.defaultPrevented) return;
          onCancel?.(event);
          return;
        }
        if (key === confirmAction.key) {
          confirm?.onClick?.(event);
          if (event.defaultPrevented) return;
          onConfirm?.(event);
        }
      },
    }),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? (resolvedState === "error" ? "error" : "warning"),
        density,
        live: validation.live,
      })
      : null,
    recovery?.label
      ? React.createElement(ErrorPanel, {
        label: recovery.label,
        description: recovery.description,
        action: recovery.action,
        tone: recovery.tone ?? "error",
        variant: recovery.variant ?? "inline",
        state: recovery.state ?? "error",
        density,
        onAction: recovery.onAction,
      })
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? (destructive ? "warning" : "info"),
        variant: feedback.variant ?? "recovery",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
        actionLabel: feedback.actionLabel,
        dismissible: feedback.dismissible,
        dismissLabel: feedback.dismissLabel,
        onAction: feedback.onAction,
        onDismiss: feedback.onDismiss,
      })
      : null,
    recovery?.secondaryAction?.label
      ? React.createElement(Button, {
        ...recovery.secondaryAction,
        label: recovery.secondaryAction.label,
        density: recovery.secondaryAction.density ?? density,
        variant: recovery.secondaryAction.variant ?? "ghost",
        onClick: (event) => {
          recovery.secondaryAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onRecoveryAction?.(recovery.secondaryAction.key ?? recovery.secondaryAction.label, event);
        },
      })
      : null,
  );
});

ConfirmationDialog.displayName = "ConfirmationDialog";
