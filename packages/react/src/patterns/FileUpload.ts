import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import type { CardDensity } from "../Card.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateProps, EmptyStateState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { ProgressIndicator } from "../ProgressIndicator.js";
import type { ProgressIndicatorProps } from "../ProgressIndicator.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import { Tag } from "../Tag.js";
import type { TagProps, TagTone } from "../Tag.js";
import { Toast } from "../Toast.js";
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

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function fileLabel(file: FileUploadFile | undefined): string {
  if (!file) return "";
  const parts = [file.name, file.size, file.type].filter(Boolean);
  return parts.join(" · ");
}

function resolveState({
  disabled,
  loading,
  state,
  files,
}: {
  disabled: boolean;
  loading: boolean;
  state: FileUploadState | undefined;
  files: FileUploadFile[];
}): FileUploadState {
  if (disabled) return "disabled";
  if (loading || state === "uploading") return "uploading";
  if (state) return state;
  return files.length ? "selected" : "empty";
}

function progressState(state: FileUploadState): ProgressIndicatorProps["state"] {
  if (state === "complete") return "complete";
  if (state === "error" || state === "invalid") return "error";
  if (state === "disabled") return "disabled";
  if (state === "validating") return "indeterminate";
  return "active";
}

function progressTone(state: FileUploadState): ProgressIndicatorProps["tone"] {
  if (state === "complete") return "success";
  if (state === "error" || state === "invalid") return "danger";
  if (state === "validating") return "warning";
  return "accent";
}

function statusTone(state: FileUploadState): TagProps["tone"] {
  if (state === "complete") return "success";
  if (state === "error" || state === "invalid") return "danger";
  if (state === "validating") return "warning";
  return "info";
}

export const FileUpload = forwardRef<HTMLDivElement, FileUploadProps>(function FileUpload({
  label,
  description,
  density,
  state,
  disabled = false,
  loading = false,
  multiple = false,
  files = [],
  progress,
  chooseAction,
  removeAction,
  retryAction,
  empty,
  validation,
  feedback,
  onChoose,
  onRemove,
  onRetry,
  className = "",
  ...rest
}, ref) {
  const normalizedFiles = Array.isArray(files) ? files : [];
  const resolvedState = resolveState({ disabled, loading, state, files: normalizedFiles });
  const selectedCount = normalizedFiles.length;
  const firstFile = normalizedFiles[0];
  const title = label || empty?.title;
  const progressValue = typeof progress?.value === "number" ? progress.value : undefined;
  const canShowProgress = ["validating", "uploading", "complete", "invalid", "error"].includes(resolvedState);
  const statusLabel = firstFile?.status ?? progress?.label ?? (resolvedState === "empty" ? "Ready" : resolvedState);

  if (!title) return null;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "uploading" || resolvedState === "validating" ? "true" : undefined,
      "data-flow-pattern": "file-upload",
      "data-state": resolvedState,
      "data-density": density,
      "data-file-count": String(selectedCount),
      "data-multiple": String(Boolean(multiple)),
      ...sanitizeRestProps(rest),
    },
    selectedCount
      ? React.createElement(
        Surface,
        {
          surfaceRole: "panel",
          state: resolvedState === "disabled" ? "disabled" : resolvedState === "error" || resolvedState === "invalid" ? "selected" : "default",
          density,
          "data-flow-slot": "surface",
        } as SurfaceProps,
        React.createElement("h3", null, title),
        React.createElement("p", null, description ?? fileLabel(firstFile)),
        React.createElement("p", null, selectedCount > 1 ? `${selectedCount} files selected` : fileLabel(firstFile)),
        React.createElement(Tag, {
          label: statusLabel,
          tone: statusTone(resolvedState),
          variant: "status",
          state: disabled ? "disabled" : "default",
          density,
        } as TagProps),
        removeAction?.label
          ? React.createElement(Button, {
            ...removeAction,
            label: removeAction.label,
            variant: removeAction.variant ?? "ghost",
            density: removeAction.density ?? density,
            disabled: disabled || removeAction.disabled,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              removeAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onRemove?.(firstFile?.key ?? firstFile?.name ?? "", event);
            },
          } as ButtonProps)
          : null,
        retryAction?.label && (resolvedState === "error" || resolvedState === "invalid")
          ? React.createElement(Button, {
            ...retryAction,
            label: retryAction.label,
            variant: retryAction.variant ?? "secondary",
            density: retryAction.density ?? density,
            disabled: disabled || retryAction.disabled,
            onClick: (event: MouseEvent<HTMLButtonElement>) => {
              retryAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onRetry?.(event);
            },
          } as ButtonProps)
          : null,
      )
      : React.createElement(EmptyState, {
        title,
        description: empty?.description ?? description,
        icon: empty?.icon ?? "upload",
        action: empty?.action,
        variant: empty?.variant ?? "no-data",
        state: (disabled ? "disabled" : "no-data") as EmptyStateState,
        density,
        onAction: empty?.onAction,
      } as EmptyStateProps),
    canShowProgress
      ? React.createElement(ProgressIndicator, {
        label: progress?.label ?? `${title} status`,
        ariaValueText: progress?.ariaValueText,
        value: progressValue,
        max: progress?.max ?? 100,
        indeterminate: resolvedState === "validating" || progress?.indeterminate,
        showValue: progress?.showValue ?? progressValue !== undefined,
        tone: progressTone(resolvedState),
        state: progressState(resolvedState),
        density,
        fullWidth: true,
      } as ProgressIndicatorProps)
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? title,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" || resolvedState === "error" ? "error" : "warning"),
        density,
        live: validation.live,
      } as InlineValidationProps)
      : null,
    chooseAction?.label
      ? React.createElement(Button, {
        ...chooseAction,
        label: chooseAction.label,
        variant: chooseAction.variant ?? "secondary",
        density: chooseAction.density ?? density,
        disabled: disabled || chooseAction.disabled,
        loading: loading || chooseAction.loading,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          chooseAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onChoose?.(event);
        },
      } as ButtonProps)
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        label: feedback.label,
        description: feedback.description,
        tone: feedback.tone ?? statusTone(resolvedState),
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
        actionLabel: feedback.actionLabel,
        dismissible: feedback.dismissible,
        dismissLabel: feedback.dismissLabel,
        onAction: feedback.onAction,
        onDismiss: feedback.onDismiss,
      } as ToastProps)
      : null,
  );
}) as FileUploadComponent;

FileUpload.displayName = "FileUpload";
