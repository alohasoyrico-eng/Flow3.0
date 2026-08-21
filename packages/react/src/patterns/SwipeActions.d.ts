import type { ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { DialogProps } from "../Dialog.js";
import type { IconButtonProps } from "../IconButton.js";
import type { MovementRowProps } from "../MovementRow.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SwipeActionsState = "closed" | "revealed" | "threshold" | "committed" | "confirming" | "disabled" | "reduced-motion";
export type SwipeActionsDensity = "sm" | "md" | "lg";
export type SwipeActionVariant = "standard" | "compact" | "wide";
export type SwipeActionState = "default" | "hover" | "focus" | "pressed" | "loading" | "warning" | "disabled";
export type SwipeActionIntent = "default" | "danger" | "warning";

export interface SwipeActionMeta {
  label: string;
  variant: SwipeActionVariant;
  intent: SwipeActionIntent;
  state: SwipeActionState;
}

export interface SwipeAction extends Omit<IconButtonProps, "ariaLabel" | "badge" | "icon" | "label" | "loading" | "onClick" | "selected" | "state" | "variant" | "intent"> {
  key?: string;
  label: string;
  icon?: string;
  badge?: string;
  variant?: SwipeActionVariant;
  state?: SwipeActionState;
  fallbackLabel?: string;
  fallbackVariant?: ButtonProps["variant"];
  intent?: SwipeActionIntent;
  loading?: boolean;
  onAction?: (meta: SwipeActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
  onFallbackClick?: ButtonProps["onClick"];
}

export interface SwipeActionsProps extends FlowDataAttributes {
  label?: string;
  density?: SwipeActionsDensity;
  state?: SwipeActionsState;
  revealed?: boolean;
  threshold?: boolean;
  committed?: boolean;
  confirming?: boolean;
  disabled?: boolean;
  reducedMotion?: boolean;
  row?: MovementRowProps;
  actions?: SwipeAction[];
  confirmation?: Partial<DialogProps>;
  recovery?: ToastProps;
  feedback?: ToastProps;
  className?: string;
  onAction?: (key: string, action: SwipeAction, event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SwipeActionsComponent extends ForwardRefExoticComponent<SwipeActionsProps & RefAttributes<HTMLDivElement>> {
  displayName: "SwipeActions";
}

export const SwipeActions: SwipeActionsComponent;
