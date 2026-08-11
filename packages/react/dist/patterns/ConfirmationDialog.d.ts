import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { DialogAction, DialogDensity, DialogOpenChangeEvent, DialogTone } from "../Dialog.js";
import type { ErrorPanelAction, ErrorPanelProps } from "../ErrorPanel.js";
import type { InlineValidationProps } from "../InlineValidation.js";
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

export const ConfirmationDialog: ConfirmationDialogComponent;
