import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Dialog } from "../Dialog.js";
import type { DialogProps } from "../Dialog.js";
import { MovementRow } from "../MovementRow.js";
import type { MovementRowProps } from "../MovementRow.js";
import { QuickAction } from "../QuickAction.js";
import type { QuickActionMeta, QuickActionProps, QuickActionState } from "../QuickAction.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type SwipeActionsState = "closed" | "revealed" | "threshold" | "committed" | "confirming" | "disabled" | "reduced-motion";
export type SwipeActionsDensity = "sm" | "md" | "lg";

export interface SwipeAction extends Omit<QuickActionProps, "onAction" | "intent"> {
  key?: string;
  fallbackLabel?: string;
  fallbackVariant?: ButtonProps["variant"];
  intent?: ButtonProps["intent"];
  onAction?: (meta: QuickActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
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

type SwipeActionsRestProps = Record<string, unknown>;

interface SwipeActionsStateInput {
  revealed?: boolean | undefined;
  threshold?: boolean | undefined;
  committed?: boolean | undefined;
  confirming?: boolean | undefined;
  disabled?: boolean | undefined;
  reducedMotion?: boolean | undefined;
  state?: SwipeActionsState | undefined;
}

function sanitizeRestProps(rest: SwipeActionsRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({
  revealed,
  threshold,
  committed,
  confirming,
  disabled,
  reducedMotion,
  state,
}: SwipeActionsStateInput): SwipeActionsState {
  if (disabled || state === "disabled") return "disabled";
  if (reducedMotion || state === "reduced-motion") return "reduced-motion";
  if (confirming || state === "confirming") return "confirming";
  if (committed || state === "committed") return "committed";
  if (threshold || state === "threshold") return "threshold";
  if (revealed || state === "revealed") return "revealed";
  return state ?? "closed";
}

function actionKey(action: SwipeAction, index: number): string {
  return action.key ?? `${action.label}-${index}`;
}

export const SwipeActions = forwardRef<HTMLDivElement, SwipeActionsProps>(function SwipeActions({
  label = "Swipe actions",
  density,
  state,
  revealed = false,
  threshold = false,
  committed = false,
  confirming = false,
  disabled = false,
  reducedMotion = false,
  row,
  actions = [],
  confirmation,
  recovery,
  feedback,
  className = "",
  onAction,
  ...rest
}, ref) {
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action): action is SwipeAction => Boolean(action?.label));
  const resolvedState = resolveState({
    revealed,
    threshold,
    committed,
    confirming: confirming || confirmation?.open,
    disabled,
    reducedMotion,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled";
  const actionsVisible = resolvedState !== "closed";

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "data-flow-pattern": "swipe-actions",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedActions.length),
      "data-non-swipe-access": "true",
      ...sanitizeRestProps(rest),
    },
    React.createElement(MovementRow, {
      ...(row ?? {}),
      label: row?.label ?? label,
      meta: row?.meta,
      amount: row?.amount,
      status: row?.status,
      category: row?.category ?? "transfer",
      variant: row?.variant ?? "standard",
      state: isDisabled ? "disabled" : row?.state ?? "default",
      density: row?.density ?? density,
      fullWidth: row?.fullWidth ?? true,
      disabled: isDisabled || row?.disabled,
      onSelect: row?.onSelect,
    } as ComponentProps<typeof MovementRow>),
    normalizedActions.map((action, index) => {
      const key = actionKey(action, index);
      const intent = action.intent === "danger" || action.tone === "danger" ? "danger" : action.intent === "warning" ? "warning" : "default";
      const actionDisabled = isDisabled || action.disabled;
      const actionState: QuickActionState = actionDisabled ? "disabled" : action.loading ? "loading" : actionsVisible ? "pressed" : "default";

      return React.createElement(
        "div",
        { key, "data-swipe-action-key": key, "data-visible": actionsVisible ? "true" : "false" },
        React.createElement(QuickAction, {
          label: action.label,
          icon: action.icon,
          badge: action.badge,
          variant: action.variant ?? "compact",
          intent,
          state: actionState,
          density: action.density ?? density,
          loading: action.loading,
          disabled: actionDisabled,
          onAction: (meta, event) => {
            action.onAction?.(meta, event);
            onAction?.(key, action, event);
          },
        } as ComponentProps<typeof QuickAction>),
        React.createElement(Button, {
          label: action.fallbackLabel ?? action.label,
          icon: action.icon,
          variant: action.fallbackVariant ?? "secondary",
          intent: action.intent,
          density: action.density ?? density,
          disabled: actionDisabled,
          loading: action.loading,
          onClick: action.onFallbackClick,
          "aria-label": `${action.label} without swipe`,
        } as ComponentProps<typeof Button>),
      );
    }),
    confirmation
      ? React.createElement(Dialog, {
        ...confirmation,
        density: confirmation.density ?? density,
        open: confirmation.open,
        state: confirmation.open ? "open" : "closed",
        variant: confirmation.variant ?? "confirmation",
      } as ComponentProps<typeof Dialog>)
      : null,
    recovery
      ? React.createElement(Toast, {
        ...recovery,
        density: recovery.density ?? density,
        state: recovery.state ?? "visible",
        variant: recovery.variant ?? "undo",
      } as ComponentProps<typeof Toast>)
      : null,
    feedback
      ? React.createElement(Toast, {
        ...feedback,
        density: feedback.density ?? density,
        state: feedback.state ?? "visible",
      } as ComponentProps<typeof Toast>)
      : null,
  );
}) as SwipeActionsComponent;

SwipeActions.displayName = "SwipeActions";
