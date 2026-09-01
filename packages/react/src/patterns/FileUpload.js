/* @generated from packages/react/src TypeScript source.
 * Do not edit this compatibility runtime directly.
 * Authored source of truth is the paired .ts/.tsx file.
 */
import React, { forwardRef, useRef, useState, } from "react";
import { Button } from "../Button.js";
import { IconButton } from "../IconButton.js";
import { InlineValidation } from "../InlineValidation.js";
import { ProgressIndicator } from "../ProgressIndicator.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function resolveState({ disabled, loading, state, files, }) {
    if (disabled)
        return "disabled";
    if (loading || state === "uploading")
        return "uploading";
    if (state)
        return state;
    return files.length ? "selected" : "empty";
}
function progressState(state) {
    if (state === "complete")
        return "complete";
    if (state === "error" || state === "invalid")
        return "error";
    if (state === "disabled")
        return "disabled";
    if (state === "validating")
        return "indeterminate";
    return "active";
}
function progressTone(state) {
    if (state === "complete")
        return "success";
    if (state === "error" || state === "invalid")
        return "danger";
    if (state === "validating")
        return "warning";
    return "accent";
}
function statusTone(state) {
    if (state === "complete")
        return "success";
    if (state === "error" || state === "invalid")
        return "danger";
    if (state === "validating")
        return "warning";
    return "info";
}
export const FileUpload = forwardRef(function FileUpload({ label, description, density, state, disabled = false, loading = false, multiple = false, files, accept, progress, chooseAction, removeAction, retryAction, empty, validation, feedback, onChoose, onChange, onRemove, onRetry, className = "", ...rest }, ref) {
    const inputRef = useRef(null);
    const isFilesControlled = files !== undefined;
    const [internalFiles, setInternalFiles] = useState([]);
    const [dragging, setDragging] = useState(false);
    const normalizedFiles = Array.isArray(files) ? files : internalFiles;
    const resolvedState = resolveState({ disabled, loading, state, files: normalizedFiles });
    const selectedCount = normalizedFiles.length;
    const title = label || empty?.title;
    const progressValue = typeof progress?.value === "number" ? progress.value : undefined;
    const canShowProgress = Boolean(progress) || ["validating", "uploading", "invalid", "error"].includes(resolvedState);
    const dropzoneLabel = chooseAction?.label ?? title;
    const dropzoneDescription = empty?.description ?? description;
    if (!title)
        return null;
    const commitFiles = (nextFiles, event) => {
        if (!isFilesControlled)
            setInternalFiles(nextFiles);
        onChange?.(nextFiles, event);
    };
    const handleInputChange = (event) => {
        const inputFiles = Array.from(event.currentTarget.files ?? []).map((file) => ({
            name: file.name,
            size: file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
            ...(file.type ? { type: file.type } : {}),
        }));
        if (!inputFiles.length)
            return;
        commitFiles(multiple ? [...normalizedFiles, ...inputFiles] : inputFiles.slice(0, 1), event);
        event.currentTarget.value = "";
    };
    const openFilePicker = (event) => {
        chooseAction?.onClick?.(event);
        if (event.defaultPrevented)
            return;
        onChoose?.(event);
        if (!event.defaultPrevented)
            inputRef.current?.click();
    };
    return React.createElement(Surface, {
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
    }, React.createElement("input", {
        ref: inputRef,
        type: "file",
        accept,
        multiple,
        disabled,
        hidden: true,
        tabIndex: -1,
        onChange: handleInputChange,
    }), canShowProgress
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
        : null, React.createElement("div", {
        role: "button",
        tabIndex: disabled ? -1 : 0,
        className: "file-upload__dropzone",
        "data-flow-slot": "dropzone",
        "aria-label": dropzoneLabel,
        "aria-disabled": disabled ? "true" : undefined,
        onClick: (event) => {
            if (disabled)
                return;
            openFilePicker(event);
        },
        onKeyDown: (event) => {
            if (disabled)
                return;
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                openFilePicker(event);
            }
        },
        onDragOver: (event) => {
            event.preventDefault();
            if (!disabled)
                setDragging(true);
        },
        onDragLeave: () => setDragging(false),
        onDrop: (event) => {
            event.preventDefault();
            setDragging(false);
            if (disabled)
                return;
            const droppedFiles = Array.from(event.dataTransfer.files ?? []).map((file) => ({
                name: file.name,
                size: file.size >= 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(file.size / 1024))} KB`,
                ...(file.type ? { type: file.type } : {}),
            }));
            if (!droppedFiles.length)
                return;
            commitFiles(multiple ? [...normalizedFiles, ...droppedFiles] : droppedFiles.slice(0, 1));
        },
    }, React.createElement("span", { className: "file-upload__dropzone-icon material-symbol", "aria-hidden": "true" }, empty?.icon ?? "upload_file"), React.createElement("span", { className: "file-upload__dropzone-label" }, dropzoneLabel), dropzoneDescription ? React.createElement("span", { className: "file-upload__dropzone-description" }, dropzoneDescription) : null), selectedCount
        ? React.createElement("ul", { className: "file-upload__list", "data-flow-slot": "file-list" }, normalizedFiles.map((file, index) => {
            const fileKey = file.key ?? `${file.name}-${index}`;
            return React.createElement("li", { key: fileKey, className: "file-upload__item", "data-flow-slot": "file-item" }, React.createElement("span", { className: "file-upload__item-icon material-symbol", "aria-hidden": "true" }, "draft"), React.createElement("span", { className: "file-upload__item-name" }, file.name), file.size ? React.createElement("span", { className: "file-upload__item-size" }, file.size) : null, removeAction?.label
                ? React.createElement(IconButton, {
                    ...removeAction,
                    ariaLabel: `${removeAction.label} ${file.name}`,
                    icon: typeof removeAction.icon === "string" ? removeAction.icon : "close",
                    variant: removeAction.variant ?? "ghost",
                    density: removeAction.density ?? density,
                    disabled: disabled || removeAction.disabled,
                    onClick: (event) => {
                        removeAction.onClick?.(event);
                        if (event.defaultPrevented)
                            return;
                        commitFiles(normalizedFiles.filter((candidate, candidateIndex) => (candidate.key ?? `${candidate.name}-${candidateIndex}`) !== fileKey));
                        onRemove?.(file.key ?? file.name, event);
                    },
                })
                : null);
        }))
        : null, validation?.message
        ? React.createElement(InlineValidation, {
            label: validation.label ?? title,
            message: validation.message,
            state: validation.state ?? (resolvedState === "invalid" || resolvedState === "error" ? "error" : "warning"),
            density,
            live: validation.live,
        })
        : null, retryAction?.label && (resolvedState === "error" || resolvedState === "invalid")
        ? React.createElement(Button, {
            ...retryAction,
            label: retryAction.label,
            variant: retryAction.variant ?? "secondary",
            density: retryAction.density ?? density,
            disabled: disabled || retryAction.disabled,
            onClick: (event) => {
                retryAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onRetry?.(event);
            },
        })
        : null, feedback?.label
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
        : null);
});
FileUpload.displayName = "FileUpload";
