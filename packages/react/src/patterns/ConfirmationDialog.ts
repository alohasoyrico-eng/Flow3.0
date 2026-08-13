import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Dialog } from "../Dialog.js";
import type { DialogAction, DialogDensity, DialogOpenChangeEvent, DialogProps, DialogTone } from "../Dialog.js";
import { ErrorPanel } from "../ErrorPanel.js";
import type { ErrorPanelAction, ErrorPanelProps } from "../ErrorPanel.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";

export type ConfirmationDialogState =
  | "closed"
  | "open"
  | "confirming"
  | "loading"
  | "error"
  | "disabled";

export interface ConfirmationDialogAction extends Partial<DialogAction> {
  label?: string;
}

export interface ConfirmationDialogValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface ConfirmationDialogRecovery extends Pick<ErrorPanelProps, "label" | "description" | "tone" | "variant" | "state" | "onAction"> {
  action?: ErrorPanelAction;
  secondaryAction?: Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> & { key?: string };
}

export interface ConfirmationDialogFeedback extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "density" | "actionLabel" | "dismissible" | "dismissLabel" | "onAction" | "onDismiss"> {}

export interface ConfirmationDialogProps {
  label: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  open?: boolean;
  density?: DialogDensity;
  state?: ConfirmationDialogState;
  tone?: DialogTone;
  destructive?: boolean;
  disabled?: boolean;
  loading?: boolean;
  confirm?: ConfirmationDialogAction;
  cancel?: ConfirmationDialogAction;
  recovery?: ConfirmationDialogRecovery;
  validation?: ConfirmationDialogValidation;
  feedback?: ConfirmationDialogFeedback;
  className?: string;
  onOpenChange?: (open: boolean, event?: DialogOpenChangeEvent) => void;
  onConfirm?: (event: MouseEvent<HTMLButtonElement>) => void;
  onCancel?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRecoveryAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface ConfirmationDialogComponent extends ForwardRefExoticComponent<ConfirmationDialogProps & RefAttributes<HTMLDivElement>> {
  displayName: "ConfirmationDialog";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

export const ConfirmationDialog = forwardRef<HTMLDivElement, ConfirmationDialogProps>(function ConfirmationDialog({
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
  const resolvedState: ConfirmationDialogState = disabled ? "disabled" : loading || state === "loading" || state === "confirming" ? "loading" : open ? "open" : "closed";
  const resolvedTone = destructive ? "danger" : tone;
  const confirmAction: DialogAction = {
    key: confirm?.key ?? "confirm",
    label: confirm?.label ?? "Confirm",
    variant: confirm?.variant ?? (destructive ? "danger" : "primary"),
    intent: confirm?.intent ?? (destructive ? "danger" : "default"),
    ...(confirm?.density ?? density ? { density: confirm?.density ?? density } : {}),
    ...(disabled || confirm?.disabled ? { disabled: true } : {}),
    ...(loading || confirm?.loading ? { loading: true } : {}),
    ...(confirm?.onClick !== undefined ? { onClick: confirm.onClick } : {}),
  };
  const cancelAction: DialogAction = {
    key: cancel?.key ?? "cancel",
    label: cancel?.label ?? "Cancel",
    variant: cancel?.variant ?? "secondary",
    intent: cancel?.intent ?? "default",
    ...(cancel?.density ?? density ? { density: cancel?.density ?? density } : {}),
    ...(disabled || cancel?.disabled ? { disabled: true } : {}),
    ...(cancel?.onClick !== undefined ? { onClick: cancel.onClick } : {}),
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
    } as DialogProps),
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? ((resolvedState as ConfirmationDialogState) === "error" ? "error" : "warning"),
        density,
        live: validation.live,
      } as InlineValidationProps)
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
      } as ErrorPanelProps)
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
      } as ToastProps)
      : null,
    recovery?.secondaryAction?.label
      ? React.createElement(Button, {
        ...recovery.secondaryAction,
        label: recovery.secondaryAction.label,
        density: recovery.secondaryAction.density ?? density,
        variant: recovery.secondaryAction.variant ?? "ghost",
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          recovery.secondaryAction?.onClick?.(event);
          if (event.defaultPrevented) return;
          onRecoveryAction?.(recovery.secondaryAction?.key ?? recovery.secondaryAction?.label ?? "", event);
        },
      } as ButtonProps)
      : null,
  );
}) as ConfirmationDialogComponent;

ConfirmationDialog.displayName = "ConfirmationDialog";
