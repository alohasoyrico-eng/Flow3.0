import React, {
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { List } from "../List.js";
import type { ListDensity, ListItem, ListProps } from "../List.js";
import { MotionBoundary } from "../MotionBoundary.js";
import type { MotionBoundaryProps } from "../MotionBoundary.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Settings } from "./Settings.js";
import type { SettingsProps } from "./Settings.js";

export type DragSortableListState = "idle" | "dragging" | "keyboard-moving" | "dirty" | "saving" | "saved" | "error" | "disabled" | "reduced-motion";
export type DragSortableListDensity = ListDensity;
export type DragSortableListDirection = "up" | "down";

export interface DragSortableListItem extends Omit<ListItem, "key" | "value"> {
  key: string;
  description?: string;
  positionLabel?: string;
  locked?: boolean;
  lockedReason?: string;
  disabledReason?: string;
  moveUpLabel?: string;
  moveDownLabel?: string;
  status?: Partial<BadgeProps> & { label: string };
}

export interface DragSortableListAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  label: string;
}

export interface DragSortableListProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: DragSortableListDensity;
  state?: DragSortableListState;
  disabled?: boolean;
  dirty?: boolean;
  saving?: boolean;
  error?: boolean;
  reducedMotion?: boolean;
  movingKey?: string;
  items?: DragSortableListItem[];
  selectedKey?: string;
  motionBoundary?: Partial<MotionBoundaryProps>;
  settings?: Partial<SettingsProps>;
  saveAction?: DragSortableListAction;
  undoAction?: DragSortableListAction;
  resetAction?: DragSortableListAction;
  feedback?: ToastProps;
  className?: string;
  onSelect?: ListProps["onSelect"];
  onMoveItem?: (key: string, direction: DragSortableListDirection, event: MouseEvent<HTMLButtonElement>) => void;
  onSave?: (event: MouseEvent<HTMLButtonElement>) => void;
  onUndo?: (event: MouseEvent<HTMLButtonElement>) => void;
  onReset?: (event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DragSortableListComponent extends ForwardRefExoticComponent<DragSortableListProps & RefAttributes<HTMLDivElement>> {
  displayName: "DragSortableList";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeItems(items: DragSortableListItem[] | undefined): DragSortableListItem[] {
  return (Array.isArray(items) ? items : []).filter((item): item is DragSortableListItem => Boolean(item?.key && item?.label));
}

function resolveState({
  disabled,
  saving,
  error,
  dirty,
  movingKey,
  reducedMotion,
  state,
}: {
  disabled: boolean;
  saving: boolean;
  error: boolean;
  dirty: boolean;
  movingKey: string | undefined;
  reducedMotion: boolean;
  state: DragSortableListState | undefined;
}): DragSortableListState {
  if (disabled || state === "disabled") return "disabled";
  if (reducedMotion || state === "reduced-motion") return "reduced-motion";
  if (error || state === "error") return "error";
  if (saving || state === "saving") return "saving";
  if (state === "saved") return "saved";
  if (movingKey || state === "keyboard-moving") return "keyboard-moving";
  if (state === "dragging") return "dragging";
  if (dirty || state === "dirty") return "dirty";
  return state ?? "idle";
}

function toListItems(
  items: DragSortableListItem[],
  density: DragSortableListDensity | undefined,
  isDisabled: boolean,
  movingKey: string | undefined,
): ListItem[] {
  return items.map((item, index): ListItem => {
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
      } as BadgeProps),
      icon: item.icon ?? (item.locked ? "lock" : "drag_indicator"),
      state: isDisabled || item.disabled || item.locked ? "disabled" : item.key === movingKey ? "selected" : item.state ?? "default",
      disabled: Boolean(isDisabled || item.disabled),
    };
  });
}

function renderMoveButtons({
  item,
  index,
  total,
  density,
  isDisabled,
  onMoveItem,
}: {
  item: DragSortableListItem;
  index: number;
  total: number;
  density: DragSortableListDensity | undefined;
  isDisabled: boolean;
  onMoveItem: DragSortableListProps["onMoveItem"];
}) {
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
      onClick: (event: MouseEvent<HTMLButtonElement>) => onMoveItem?.(key, "up", event),
    } as ButtonProps),
    React.createElement(Button, {
      key: `${key}-down`,
      label: item.moveDownLabel ?? `Move ${item.label} down`,
      variant: "ghost",
      density,
      icon: "keyboard_arrow_down",
      disabled: itemDisabled || index === total - 1,
      onClick: (event: MouseEvent<HTMLButtonElement>) => onMoveItem?.(key, "down", event),
    } as ButtonProps),
  ];
}

export const DragSortableList = forwardRef<HTMLDivElement, DragSortableListProps>(function DragSortableList({
  label = "Reorder list",
  description,
  density,
  state,
  disabled = false,
  dirty = false,
  saving = false,
  error = false,
  reducedMotion = false,
  movingKey,
  items = [],
  selectedKey,
  motionBoundary,
  settings,
  saveAction,
  undoAction,
  resetAction,
  feedback,
  className = "",
  onSelect,
  onMoveItem,
  onSave,
  onUndo,
  onReset,
  ...rest
}, ref) {
  const normalizedItems = normalizeItems(items);
  const resolvedState = resolveState({ disabled, saving, error, dirty, movingKey, reducedMotion, state });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "saving";
  const movingItem = normalizedItems.find((item) => item.key === movingKey);

  return React.createElement(
    "div",
    {
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
    },
    React.createElement(MotionBoundary, {
      label: motionBoundary?.label ?? `${label} motion boundary`,
      description: motionBoundary?.description ?? description,
      variant: motionBoundary?.variant ?? "slide",
      state: isDisabled ? "disabled" : reducedMotion ? "reduced-motion" : movingKey ? "active" : "idle",
      density,
      icon: motionBoundary?.icon ?? "swap_vert",
      reducedMotion,
      stateLabel: motionBoundary?.stateLabel ?? (movingItem ? `${movingItem.label} moved` : undefined),
    } as MotionBoundaryProps),
    React.createElement(Badge, {
      label: resolvedState === "saved" ? "Saved order" : dirty ? "Unsaved order" : `${normalizedItems.length} items`,
      tone: resolvedState === "error" ? "danger" : dirty ? "warning" : resolvedState === "saved" ? "success" : "info",
      variant: "status",
      density,
      live: true,
    } as BadgeProps),
    settings
      ? React.createElement(Settings, {
        ...settings,
        label: settings.label ?? `${label} settings host`,
        density: settings.density ?? density,
        state: settings.state ?? (isDisabled ? "disabled" : dirty ? "dirty" : "idle"),
        "data-flow-pattern-boundary": "settings",
      } as SettingsProps)
      : null,
    React.createElement(List, {
      label,
      items: toListItems(normalizedItems, density, isDisabled, movingKey),
      variant: "action",
      interactive: true,
      density,
      state: isDisabled ? "disabled" : resolvedState === "error" ? "error" : "default",
      selectedKey,
      onSelect,
    } as ListProps),
    normalizedItems.flatMap((item, index) => renderMoveButtons({
      item,
      index,
      total: normalizedItems.length,
      density,
      isDisabled,
      onMoveItem,
    })),
    saveAction
      ? React.createElement(Button, {
        ...saveAction,
        label: saveAction.label,
        variant: saveAction.variant ?? "primary",
        density: saveAction.density ?? density,
        disabled: isDisabled || saveAction.disabled,
        loading: resolvedState === "saving" || saveAction.loading,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          saveAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onSave?.(event);
        },
      } as ButtonProps)
      : null,
    undoAction
      ? React.createElement(Button, {
        ...undoAction,
        label: undoAction.label,
        variant: undoAction.variant ?? "secondary",
        density: undoAction.density ?? density,
        disabled: isDisabled || undoAction.disabled,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          undoAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onUndo?.(event);
        },
      } as ButtonProps)
      : null,
    resetAction
      ? React.createElement(Button, {
        ...resetAction,
        label: resetAction.label,
        variant: resetAction.variant ?? "ghost",
        density: resetAction.density ?? density,
        disabled: isDisabled || resetAction.disabled,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          resetAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onReset?.(event);
        },
      } as ButtonProps)
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ToastProps)
      : null,
  );
}) as DragSortableListComponent;

DragSortableList.displayName = "DragSortableList";
