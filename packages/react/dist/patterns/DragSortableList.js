import React, { forwardRef, } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { List } from "../List.js";
import { MotionBoundary } from "../MotionBoundary.js";
import { Toast } from "../Toast.js";
import { Settings } from "./Settings.js";
function sanitizeRestProps(rest) {
    return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}
function normalizeItems(items) {
    return (Array.isArray(items) ? items : []).filter((item) => Boolean(item?.key && item?.label));
}
function resolveState({ disabled, saving, error, dirty, movingKey, reducedMotion, state, }) {
    if (disabled || state === "disabled")
        return "disabled";
    if (reducedMotion || state === "reduced-motion")
        return "reduced-motion";
    if (error || state === "error")
        return "error";
    if (saving || state === "saving")
        return "saving";
    if (state === "saved")
        return "saved";
    if (movingKey || state === "keyboard-moving")
        return "keyboard-moving";
    if (state === "dragging")
        return "dragging";
    if (dirty || state === "dirty")
        return "dirty";
    return state ?? "idle";
}
function toListItems(items, density, isDisabled, movingKey) {
    return items.map((item, index) => {
        const positionLabel = item.positionLabel ?? `${index + 1} of ${items.length}`;
        const reason = item.locked || item.disabled ? item.lockedReason ?? item.disabledReason ?? "Locked item" : item.description;
        return {
            key: item.key,
            label: item.label,
            meta: reason,
            value: React.createElement(Badge, {
                label: item.status?.label ?? positionLabel,
                tone: item.status?.tone ?? (item.locked ? "warning" : item.key === movingKey ? "info" : "neutral"),
                variant: item.status?.variant ?? "status",
                density,
                state: isDisabled || item.disabled || item.locked ? "disabled" : "default",
            }),
            icon: item.icon ?? (item.locked ? "lock" : "drag_indicator"),
            state: isDisabled || item.disabled || item.locked ? "disabled" : item.key === movingKey ? "selected" : item.state ?? "default",
            disabled: Boolean(isDisabled || item.disabled),
        };
    });
}
function renderMoveButtons({ item, index, total, density, isDisabled, onMoveItem, }) {
    const itemDisabled = isDisabled || item.disabled || item.locked;
    const key = item.key;
    return [
        React.createElement(Button, {
            key: `${key}-up`,
            label: item.moveUpLabel ?? `Move ${item.label} up`,
            variant: "ghost",
            density,
            icon: "keyboard_arrow_up",
            disabled: itemDisabled || index === 0,
            onClick: (event) => onMoveItem?.(key, "up", event),
        }),
        React.createElement(Button, {
            key: `${key}-down`,
            label: item.moveDownLabel ?? `Move ${item.label} down`,
            variant: "ghost",
            density,
            icon: "keyboard_arrow_down",
            disabled: itemDisabled || index === total - 1,
            onClick: (event) => onMoveItem?.(key, "down", event),
        }),
    ];
}
export const DragSortableList = forwardRef(function DragSortableList({ label = "Reorder list", description, density, state, disabled = false, dirty = false, saving = false, error = false, reducedMotion = false, movingKey, items = [], selectedKey, motionBoundary, settings, saveAction, undoAction, resetAction, feedback, className = "", onSelect, onMoveItem, onSave, onUndo, onReset, ...rest }, ref) {
    const normalizedItems = normalizeItems(items);
    const resolvedState = resolveState({ disabled, saving, error, dirty, movingKey, reducedMotion, state });
    const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "saving";
    const movingItem = normalizedItems.find((item) => item.key === movingKey);
    return React.createElement("div", {
        ref,
        className,
        role: "group",
        "aria-label": label,
        "aria-busy": resolvedState === "saving" ? "true" : undefined,
        "data-flow-pattern": "drag-sortable-list",
        "data-state": resolvedState,
        "data-density": density,
        "data-item-count": String(normalizedItems.length),
        "data-reduced-motion": String(Boolean(reducedMotion)),
        "data-settings-boundary": settings ? "true" : "false",
        ...sanitizeRestProps(rest),
    }, React.createElement(MotionBoundary, {
        label: motionBoundary?.label ?? `${label} motion boundary`,
        description: motionBoundary?.description ?? description,
        variant: motionBoundary?.variant ?? "slide",
        state: isDisabled ? "disabled" : reducedMotion ? "reduced-motion" : movingKey ? "active" : "idle",
        density,
        icon: motionBoundary?.icon ?? "swap_vert",
        reducedMotion,
        stateLabel: motionBoundary?.stateLabel ?? (movingItem ? `${movingItem.label} moved` : undefined),
    }), React.createElement(Badge, {
        label: resolvedState === "saved" ? "Saved order" : dirty ? "Unsaved order" : `${normalizedItems.length} items`,
        tone: resolvedState === "error" ? "danger" : dirty ? "warning" : resolvedState === "saved" ? "success" : "info",
        variant: "status",
        density,
        live: true,
    }), settings
        ? React.createElement(Settings, {
            ...settings,
            label: settings.label ?? `${label} settings host`,
            density: settings.density ?? density,
            state: settings.state ?? (isDisabled ? "disabled" : dirty ? "dirty" : "idle"),
            "data-flow-pattern-boundary": "settings",
        })
        : null, React.createElement(List, {
        label,
        items: toListItems(normalizedItems, density, isDisabled, movingKey),
        variant: "action",
        interactive: true,
        density,
        state: isDisabled ? "disabled" : resolvedState === "error" ? "error" : "default",
        selectedKey,
        onSelect,
    }), normalizedItems.flatMap((item, index) => renderMoveButtons({
        item,
        index,
        total: normalizedItems.length,
        density,
        isDisabled,
        onMoveItem,
    })), saveAction
        ? React.createElement(Button, {
            ...saveAction,
            label: saveAction.label,
            variant: saveAction.variant ?? "primary",
            density: saveAction.density ?? density,
            disabled: isDisabled || saveAction.disabled,
            loading: resolvedState === "saving" || saveAction.loading,
            onClick: (event) => {
                saveAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onSave?.(event);
            },
        })
        : null, undoAction
        ? React.createElement(Button, {
            ...undoAction,
            label: undoAction.label,
            variant: undoAction.variant ?? "secondary",
            density: undoAction.density ?? density,
            disabled: isDisabled || undoAction.disabled,
            onClick: (event) => {
                undoAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onUndo?.(event);
            },
        })
        : null, resetAction
        ? React.createElement(Button, {
            ...resetAction,
            label: resetAction.label,
            variant: resetAction.variant ?? "ghost",
            density: resetAction.density ?? density,
            disabled: isDisabled || resetAction.disabled,
            onClick: (event) => {
                resetAction.onClick?.(event);
                if (event.defaultPrevented)
                    return;
                onReset?.(event);
            },
        })
        : null, feedback
        ? React.createElement(Toast, {
            ...feedback,
            density: feedback.density ?? density,
            state: feedback.state ?? "visible",
        })
        : null);
});
DragSortableList.displayName = "DragSortableList";
