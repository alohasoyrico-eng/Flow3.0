import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { CardDensity } from "../Card.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { ProgressIndicatorProps } from "../ProgressIndicator.js";
import type { TagTone } from "../Tag.js";
import type { ToastProps } from "../Toast.js";

export type FileUploadState =
  | "empty"
  | "selected"
  | "validating"
  | "uploading"
  | "complete"
  | "invalid"
  | "error"
  | "disabled";

export type FileUploadDensity = CardDensity;

export interface FileUploadFile {
  key?: string;
  name: string;
  size?: string;
  type?: string;
  status?: string;
  tone?: TagTone;
}

export interface FileUploadAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface FileUploadEmptyState extends Pick<EmptyStateProps, "title" | "description" | "icon" | "action" | "variant" | "onAction"> {}

export interface FileUploadProgress extends Pick<ProgressIndicatorProps, "label" | "ariaValueText" | "value" | "max" | "indeterminate" | "showValue"> {}

export interface FileUploadValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface FileUploadFeedback extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "density" | "actionLabel" | "dismissible" | "dismissLabel" | "onAction" | "onDismiss"> {}

export interface FileUploadProps {
  label: string;
  description?: string;
  density?: CardDensity;
  state?: FileUploadState;
  disabled?: boolean;
  loading?: boolean;
  multiple?: boolean;
  files?: FileUploadFile[];
  progress?: FileUploadProgress;
  chooseAction?: FileUploadAction;
  removeAction?: FileUploadAction;
  retryAction?: FileUploadAction;
  empty?: FileUploadEmptyState;
  validation?: FileUploadValidation;
  feedback?: FileUploadFeedback;
  className?: string;
  onChoose?: (event: MouseEvent<HTMLButtonElement>) => void;
  onRemove?: (key: string, event?: MouseEvent<HTMLElement>) => void;
  onRetry?: (event?: MouseEvent<HTMLElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface FileUploadComponent extends ForwardRefExoticComponent<FileUploadProps & RefAttributes<HTMLDivElement>> {
  displayName: "FileUpload";
}

export const FileUpload: FileUploadComponent;
