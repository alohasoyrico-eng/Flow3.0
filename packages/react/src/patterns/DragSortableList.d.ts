import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { ListDensity, ListItem, ListProps } from "../List.js";
import type { MotionBoundaryProps } from "../MotionBoundary.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
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

export const DragSortableList: DragSortableListComponent;
