import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { BadgeProps } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { EmptyStateProps } from "../EmptyState.js";
import type { ErrorPanelProps } from "../ErrorPanel.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { DragSortableListDirection } from "./DragSortableList.js";

export type KanbanBoardState = "idle" | "dragging" | "saving" | "loading" | "error" | "empty" | "disabled";
export type KanbanBoardDensity = "sm" | "md" | "lg";

export interface KanbanBoardCard {
  key: string;
  label: string;
  description?: string;
  meta?: string;
  icon?: string;
  state?: "default" | "hover" | "selected" | "loading" | "error" | "disabled";
  disabled?: boolean;
  disabledReason?: string;
  locked?: boolean;
  lockedReason?: string;
  positionLabel?: string;
  status?: Partial<BadgeProps> & { label: string };
}

export interface KanbanBoardColumn {
  key: string;
  label: string;
  description?: string;
  items?: KanbanBoardCard[];
  limit?: number;
  tone?: BadgeProps["tone"];
  status?: Partial<BadgeProps> & { label: string };
  disabled?: boolean;
}

export interface KanbanBoardAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  key: string;
  label: string;
}

export interface KanbanBoardProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: KanbanBoardDensity;
  state?: KanbanBoardState;
  disabled?: boolean;
  loading?: boolean;
  error?: Partial<ErrorPanelProps>;
  columns?: KanbanBoardColumn[];
  selectedKey?: string;
  selectedColumnKey?: string;
  sortable?: boolean;
  actions?: KanbanBoardAction[];
  empty?: Partial<EmptyStateProps>;
  className?: string;
  onCardSelect?: (key: string, columnKey: string, event: MouseEvent<HTMLButtonElement>) => void;
  onMoveCard?: (key: string, columnKey: string, direction: DragSortableListDirection, event: MouseEvent<HTMLButtonElement>) => void;
  onColumnAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  role?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface KanbanBoardComponent extends ForwardRefExoticComponent<KanbanBoardProps & RefAttributes<HTMLDivElement>> {
  displayName: "KanbanBoard";
}

export const KanbanBoard: KanbanBoardComponent;
