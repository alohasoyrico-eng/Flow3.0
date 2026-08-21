import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Dialog } from "../Dialog.js";
import type { DialogProps } from "../Dialog.js";
import { QuickAction } from "../QuickAction.js";
import type { QuickActionMeta, QuickActionProps } from "../QuickAction.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import { Tooltip } from "../Tooltip.js";
import type { TooltipProps } from "../Tooltip.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";

export type QuickActionsGridState = "default" | "loading" | "disabled" | "permission-blocked" | "confirming" | "completed" | "error";
export type QuickActionsGridDensity = "sm" | "md" | "lg";

export interface QuickActionsGridAction extends Omit<QuickActionProps, "onAction" | "intent"> {
  key?: string;
  status?: Partial<BadgeProps> & { label: string };
  tooltip?: Partial<TooltipProps> & { content: string };
  permissionBlocked?: boolean;
  intent?: "default" | "danger" | "warning";
  onAction?: (meta: QuickActionMeta, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface QuickActionsGridProps extends FlowDataAttributes {
  label?: string;
  density?: QuickActionsGridDensity;
  state?: QuickActionsGridState;
  loading?: boolean;
  disabled?: boolean;
  permissionBlocked?: boolean;
  confirming?: boolean;
  completed?: boolean;
  error?: Partial<ToastProps>;
  actions?: QuickActionsGridAction[];
  search?: Partial<SearchProps>;
  confirmation?: Partial<DialogProps>;
  feedback?: ToastProps;
  className?: string;
  onAction?: (key: string, action: QuickActionsGridAction, event: MouseEvent<HTMLButtonElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface QuickActionsGridComponent extends ForwardRefExoticComponent<QuickActionsGridProps & RefAttributes<HTMLDivElement>> {
  displayName: "QuickActionsGrid";
}

type QuickActionsGridRestProps = Record<string, unknown>;

function sanitizeRestProps(rest: QuickActionsGridRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

interface QuickActionsGridStateInput {
  loading?: boolean | undefined;
  disabled?: boolean | undefined;
  permissionBlocked?: boolean | undefined;
  confirming?: boolean | undefined;
  completed?: boolean | undefined;
  error?: boolean | undefined;
  state?: QuickActionsGridState | undefined;
}

function resolveState({ loading, disabled, permissionBlocked, confirming, completed, error, state }: QuickActionsGridStateInput): QuickActionsGridState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (error || state === "error") return "error";
  if (confirming || state === "confirming") return "confirming";
  if (completed || state === "completed") return "completed";
  if (loading || state === "loading") return "loading";
  return state ?? "default";
}

function actionKey(action: QuickActionsGridAction, index: number): string {
  return action.key ?? `${action.label}-${index}`;
}

function isGridAction(action: QuickActionsGridAction | null | undefined): action is QuickActionsGridAction {
  return Boolean(action?.label);
}

export const QuickActionsGrid = forwardRef<HTMLDivElement, QuickActionsGridProps>(function QuickActionsGrid({
  label = "Quick actions",
  density,
  state,
  loading = false,
  disabled = false,
  permissionBlocked = false,
  confirming = false,
  completed = false,
  error,
  actions = [],
  search,
  confirmation,
  feedback,
  className = "",
  onAction,
  ...rest
}, ref) {
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter(isGridAction);
  const resolvedState = resolveState({
    loading,
    disabled,
    permissionBlocked,
    confirming: confirming || confirmation?.open,
    completed,
    error: Boolean(error || feedback?.tone === "danger"),
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "quick-actions-grid",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedActions.length),
      "data-search-boundary": search ? "true" : "false",
      ...sanitizeRestProps(rest),
    },
    search
      ? React.createElement(Search, {
        ...search,
        label: search.label ?? "Find action target",
        density: search.density ?? density,
        state: search.state ?? (search.loading ? "loading" : search.results?.length ? "results" : "idle"),
      } as ComponentProps<typeof Search>)
      : null,
    normalizedActions.map((action, index) => {
      const key = actionKey(action, index);
      const actionDisabled = isDisabled || action.disabled || action.permissionBlocked;
      const actionState = resolvedState === "loading" || action.loading
        ? "loading"
        : actionDisabled
          ? "disabled"
          : action.state ?? "default";
      const intent = action.intent === "danger" ? "danger" : action.intent === "warning" ? "warning" : "default";

      return React.createElement(
        "div",
        { key, "data-action-key": key },
        React.createElement(QuickAction, {
          label: action.label,
          icon: action.icon,
          badge: action.badge,
          variant: action.variant ?? "standard",
          intent,
          state: actionState,
          density: action.density ?? density,
          loading: resolvedState === "loading" || action.loading,
          disabled: actionDisabled,
          onAction: (meta: QuickActionMeta, event: MouseEvent<HTMLButtonElement>) => {
            action.onAction?.(meta, event);
            onAction?.(key, action, event);
          },
        } as ComponentProps<typeof QuickAction>),
        action.status
          ? React.createElement(Badge, {
            label: action.status.label,
            tone: action.status.tone ?? (action.permissionBlocked ? "warning" : "info"),
            variant: action.status.variant ?? "status",
            density: action.status.density ?? density,
            state: actionDisabled ? "disabled" : action.status.state ?? "default",
            live: action.status.live ?? true,
          } as ComponentProps<typeof Badge>)
          : null,
        action.tooltip
          ? React.createElement(Tooltip, {
            triggerLabel: action.tooltip.triggerLabel ?? `${action.label} details`,
            content: action.tooltip.content,
            placement: action.tooltip.placement ?? "top",
            variant: action.tooltip.variant ?? (actionDisabled ? "disabled-help" : "default"),
            density: action.tooltip.density ?? density,
            state: action.tooltip.state,
            open: action.tooltip.open,
            disabled: action.tooltip.disabled,
            onOpenChange: action.tooltip.onOpenChange,
          } as ComponentProps<typeof Tooltip>)
          : null,
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
    error
      ? React.createElement(Toast, {
        label: error.label ?? "Quick action failed",
        description: error.description,
        tone: "danger",
        variant: "recovery",
        state: "visible",
        density,
        actionLabel: error.actionLabel,
        dismissible: error.dismissible ?? true,
        onAction: error.onAction,
        onDismiss: error.onDismiss,
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
}) as QuickActionsGridComponent;

QuickActionsGrid.displayName = "QuickActionsGrid";
