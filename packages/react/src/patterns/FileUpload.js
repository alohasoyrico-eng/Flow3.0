import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { EmptyState } from "../EmptyState.js";
import { InlineValidation } from "../InlineValidation.js";
import { ProgressIndicator } from "../ProgressIndicator.js";
import { Surface } from "../Surface.js";
import { Tag } from "../Tag.js";
import { Toast } from "../Toast.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function fileLabel(file) {
  if (!file) return "";
  const parts = [file.name, file.size, file.type].filter(Boolean);
  return parts.join(" · ");
}

function resolveState({ disabled, loading, state, files }) {
  if (disabled) return "disabled";
  if (loading || state === "uploading") return "uploading";
  if (state) return state;
  return files.length ? "selected" : "empty";
}

function progressState(state) {
  if (state === "complete") return "complete";
  if (state === "error" || state === "invalid") return "error";
  if (state === "disabled") return "disabled";
  if (state === "validating") return "indeterminate";
  return "active";
}

function progressTone(state) {
  if (state === "complete") return "success";
  if (state === "error" || state === "invalid") return "danger";
  if (state === "validating") return "warning";
  return "accent";
}

function statusTone(state) {
  if (state === "complete") return "success";
  if (state === "error" || state === "invalid") return "danger";
  if (state === "validating") return "warning";
  return "info";
}

export const FileUpload = forwardRef(function FileUpload({
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
        },
        React.createElement("h3", null, title),
        React.createElement("p", null, description ?? fileLabel(firstFile)),
        React.createElement("p", null, selectedCount > 1 ? `${selectedCount} files selected` : fileLabel(firstFile)),
        React.createElement(Tag, {
          label: statusLabel,
          tone: statusTone(resolvedState),
          variant: "status",
          state: disabled ? "disabled" : "default",
          density,
        }),
        removeAction?.label
          ? React.createElement(Button, {
            ...removeAction,
            label: removeAction.label,
            variant: removeAction.variant ?? "ghost",
            density: removeAction.density ?? density,
            disabled: disabled || removeAction.disabled,
            onClick: (event) => {
              removeAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onRemove?.(firstFile?.key ?? firstFile?.name ?? "", event);
            },
          })
          : null,
        retryAction?.label && (resolvedState === "error" || resolvedState === "invalid")
          ? React.createElement(Button, {
            ...retryAction,
            label: retryAction.label,
            variant: retryAction.variant ?? "secondary",
            density: retryAction.density ?? density,
            disabled: disabled || retryAction.disabled,
            onClick: (event) => {
              retryAction.onClick?.(event);
              if (event.defaultPrevented) return;
              onRetry?.(event);
            },
          })
          : null,
      )
      : React.createElement(EmptyState, {
        title,
        description: empty?.description ?? description,
        icon: empty?.icon ?? "upload",
        action: empty?.action,
        variant: empty?.variant ?? "no-data",
        state: disabled ? "disabled" : "no-data",
        density,
        onAction: empty?.onAction,
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
      })
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? title,
        message: validation.message,
        state: validation.state ?? (resolvedState === "invalid" || resolvedState === "error" ? "error" : "warning"),
        density,
        live: validation.live,
      })
      : null,
    chooseAction?.label
      ? React.createElement(Button, {
        ...chooseAction,
        label: chooseAction.label,
        variant: chooseAction.variant ?? "secondary",
        density: chooseAction.density ?? density,
        disabled: disabled || chooseAction.disabled,
        loading: loading || chooseAction.loading,
        onClick: (event) => {
          chooseAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onChoose?.(event);
        },
      })
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
      })
      : null,
  );
});

FileUpload.displayName = "FileUpload";
