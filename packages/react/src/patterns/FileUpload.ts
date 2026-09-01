import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useRef,
  useState,
} from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import type { CardDensity } from "../Card.js";
import type { EmptyStateProps } from "../EmptyState.js";
import { IconButton } from "../IconButton.js";
import type { IconButtonProps } from "../IconButton.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { ProgressIndicator } from "../ProgressIndicator.js";
import type { ProgressIndicatorProps } from "../ProgressIndicator.js";
import { Surface } from "../Surface.js";
import type { SurfaceProps } from "../Surface.js";
import type { TagTone } from "../Tag.js";
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
  accept?: string;
  progress?: FileUploadProgress;
  chooseAction?: FileUploadAction;
  removeAction?: FileUploadAction;
  retryAction?: FileUploadAction;
  empty?: FileUploadEmptyState;
  validation?: FileUploadValidation;
  feedback?: FileUploadFeedback;
  className?: string;
  onChoose?: (event: MouseEvent<HTMLElement>) => void;
  onChange?: (files: FileUploadFile[], event?: ChangeEvent<HTMLInputElement>) => void;
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

function statusTone(state: FileUploadState): ToastProps["tone"] {
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
  files,
  accept,
  progress,
  chooseAction,
  removeAction,
  retryAction,
  empty,
  validation,
  feedback,
  onChoose,
  onChange,
  onRemove,
  onRetry,
  className = "",
  ...rest
}, ref) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isFilesControlled = files !== undefined;
  const [internalFiles, setInternalFiles] = useState<FileUploadFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const normalizedFiles = Array.isArray(files) ? files : internalFiles;
  const resolvedState = resolveState({ disabled, loading, state, files: normalizedFiles });
  const selectedCount = normalizedFiles.length;
  const title = label || empty?.title;
  const progressValue = typeof progress?.value === "number" ? progress.value : undefined;
  const canShowProgress = Boolean(progress) || ["validating", "uploading", "invalid", "error"].includes(resolvedState);
  const dropzoneLabel = chooseAction?.label ?? title;
  const dropzoneDescription = empty?.description ?? description;

  if (!title) return null;

  const commitFiles = (nextFiles: FileUploadFile[], event?: ChangeEvent<HTMLInputElement>) => {
    if (!isFilesControlled) setInternalFiles(nextFiles);
    onChange?.(nextFiles, event);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const inputFiles: FileUploadFile[] = Array.from(event.currentTarget.files ?? []).map((file) => ({
      name: file.name,
      size: file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
      ...(file.type ? { type: file.type } : {}),
    }));
    if (!inputFiles.length) return;
    commitFiles(multiple ? [...normalizedFiles, ...inputFiles] : inputFiles.slice(0, 1), event);
    event.currentTarget.value = "";
  };

  const openFilePicker = (event: MouseEvent<HTMLElement>) => {
    chooseAction?.onClick?.(event as unknown as MouseEvent<HTMLButtonElement>);
    if (event.defaultPrevented) return;
    onChoose?.(event);
    if (!event.defaultPrevented) inputRef.current?.click();
  };

  return React.createElement(
    Surface,
    {
      ref,
      className: ["file-upload", className].filter(Boolean).join(" "),
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "uploading" || resolvedState === "validating" ? "true" : undefined,
      "data-flow-pattern": "file-upload",
      "data-flow-slot": "surface",
      "data-state": resolvedState,
      "data-file-count": String(selectedCount),
      "data-multiple": String(Boolean(multiple)),
      "data-dragging": String(dragging),
      surfaceRole: "panel",
      elevation: "none",
      density,
      ...sanitizeRestProps(rest),
    } as SurfaceProps,
    React.createElement("input", {
      ref: inputRef,
      type: "file",
      accept,
      multiple,
      disabled,
      hidden: true,
      tabIndex: -1,
      onChange: handleInputChange,
    }),
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
    React.createElement(
      "div",
      {
        role: "button",
        tabIndex: disabled ? -1 : 0,
        className: "file-upload__dropzone",
        "data-flow-slot": "dropzone",
        "aria-label": dropzoneLabel,
        "aria-disabled": disabled ? "true" : undefined,
        onClick: (event: MouseEvent<HTMLElement>) => {
          if (disabled) return;
          openFilePicker(event);
        },
        onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
          if (disabled) return;
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            openFilePicker(event as unknown as MouseEvent<HTMLElement>);
          }
        },
        onDragOver: (event: React.DragEvent<HTMLElement>) => {
          event.preventDefault();
          if (!disabled) setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: (event: React.DragEvent<HTMLElement>) => {
          event.preventDefault();
          setDragging(false);
          if (disabled) return;
          const droppedFiles: FileUploadFile[] = Array.from(event.dataTransfer.files ?? []).map((file) => ({
            name: file.name,
            size: file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
            ...(file.type ? { type: file.type } : {}),
          }));
          if (!droppedFiles.length) return;
          commitFiles(multiple ? [...normalizedFiles, ...droppedFiles] : droppedFiles.slice(0, 1));
        },
      },
      React.createElement("span", { className: "file-upload__dropzone-icon material-symbol", "aria-hidden": "true" }, empty?.icon ?? "upload_file"),
      React.createElement("span", { className: "file-upload__dropzone-label" }, dropzoneLabel),
      dropzoneDescription ? React.createElement("span", { className: "file-upload__dropzone-description" }, dropzoneDescription) : null,
    ),
    selectedCount
      ? React.createElement(
        "ul",
        { className: "file-upload__list", "data-flow-slot": "file-list" },
        normalizedFiles.map((file, index) => {
          const fileKey = file.key ?? `${file.name}-${index}`;
          return React.createElement(
            "li",
            { key: fileKey, className: "file-upload__item", "data-flow-slot": "file-item" },
            React.createElement("span", { className: "file-upload__item-icon material-symbol", "aria-hidden": "true" }, "draft"),
            React.createElement("span", { className: "file-upload__item-name" }, file.name),
            file.size ? React.createElement("span", { className: "file-upload__item-size" }, file.size) : null,
            removeAction?.label
              ? React.createElement(IconButton, {
                ...removeAction,
                ariaLabel: `${removeAction.label} ${file.name}`,
                icon: typeof removeAction.icon === "string" ? removeAction.icon : "close",
                variant: removeAction.variant ?? "ghost",
                density: removeAction.density ?? density,
                disabled: disabled || removeAction.disabled,
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                  removeAction.onClick?.(event);
                  if (event.defaultPrevented) return;
                  commitFiles(normalizedFiles.filter((candidate, candidateIndex) => (candidate.key ?? `${candidate.name}-${candidateIndex}`) !== fileKey));
                  onRemove?.(file.key ?? file.name, event);
                },
              } as IconButtonProps)
              : null,
          );
        }),
      )
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
