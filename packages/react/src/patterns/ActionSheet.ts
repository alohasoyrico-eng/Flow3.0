import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, ReactNode, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Dialog } from "../Dialog.js";
import type { DialogProps } from "../Dialog.js";
import { List } from "../List.js";
import type { ListItem } from "../List.js";
import { Menu } from "../Menu.js";
import type { MenuAlign, MenuItem, MenuVariant } from "../Menu.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { Search } from "./Search.js";
import type { SearchProps } from "./Search.js";

export type ActionSheetState = "closed" | "open" | "loading" | "disabled" | "destructive" | "permission-blocked" | "error";
export type ActionSheetDensity = "sm" | "md" | "lg";

export type ActionSheetAction = Omit<ButtonProps, "children" | "fullWidth" | "value"> & {
  key?: string;
  label: string;
  description?: ReactNode;
  meta?: ReactNode;
  value?: ReactNode;
  valueLabel?: ReactNode;
  shortcut?: string;
  prominent?: boolean;
  selected?: boolean;
  tone?: "danger";
};

export interface ActionSheetOverflow {
  triggerLabel?: string;
  label?: string;
  items?: ActionSheetAction[];
  open?: boolean;
  variant?: MenuVariant;
  align?: MenuAlign;
  disabled?: boolean;
  onOpenChange?: DialogProps["onOpenChange"];
  onSelect?: (item: MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ActionSheetFeedback extends ToastProps {}

export interface ActionSheetError extends Partial<ToastProps> {
  label?: string;
}

export interface ActionSheetDialog extends Partial<DialogProps> {}

export interface ActionSheetProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: ActionSheetDensity;
  state?: ActionSheetState;
  open?: boolean;
  disabled?: boolean;
  loading?: boolean;
  destructive?: boolean;
  permissionBlocked?: boolean;
  error?: ActionSheetError;
  actions?: ActionSheetAction[];
  cancelAction?: ActionSheetAction;
  primaryAction?: ActionSheetAction;
  overflow?: ActionSheetOverflow;
  search?: Partial<SearchProps>;
  feedback?: ActionSheetFeedback;
  dialog?: ActionSheetDialog;
  className?: string;
  onOpenChange?: DialogProps["onOpenChange"];
  onAction?: (key: string, event: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ActionSheetComponent extends ForwardRefExoticComponent<ActionSheetProps & RefAttributes<HTMLDivElement>> {
  displayName: "ActionSheet";
}

type ActionSheetRestProps = Record<string, unknown>;

function sanitizeRestProps(rest: ActionSheetRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeActions(actions: ActionSheetAction[] | null | undefined): ActionSheetAction[] {
  return (Array.isArray(actions) ? actions : []).filter((action): action is ActionSheetAction => Boolean(action?.label));
}

interface ResolveStateInput {
  open?: boolean | undefined;
  loading?: boolean | undefined;
  disabled?: boolean | undefined;
  destructive?: boolean | undefined;
  permissionBlocked?: boolean | undefined;
  error?: boolean | undefined;
  state?: ActionSheetState | undefined;
}

function resolveState({ open, loading, disabled, destructive, permissionBlocked, error, state }: ResolveStateInput): ActionSheetState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (error || state === "error") return "error";
  if (loading || state === "loading") return "loading";
  if (destructive || state === "destructive") return "destructive";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

function actionKey(action: ActionSheetAction, index: number): string {
  return (action.key ?? action.value ?? `${action.label}-${index}`) as string;
}

function toListItem(action: ActionSheetAction, index: number, density: ActionSheetDensity | undefined, isDisabled: boolean, resolvedState: ActionSheetState): ListItem {
  const tone = action.intent === "danger" || action.tone === "danger" ? "danger" : undefined;
  const loading = action.loading || resolvedState === "loading";

  return {
    key: actionKey(action, index),
    label: action.label,
    meta: action.meta ?? action.description,
    value: action.valueLabel,
    icon: action.icon,
    tone,
    disabled: isDisabled || action.disabled || loading,
    state: loading ? "loading" : action.state ?? (isDisabled || action.disabled ? "disabled" : "default"),
    "data-density": action.density ?? density,
  } as ListItem;
}

function toMenuItem(action: ActionSheetAction, index: number, isDisabled: boolean, resolvedState: ActionSheetState): MenuItem {
  return {
    key: actionKey(action, index),
    label: action.label,
    icon: action.icon,
    shortcut: action.shortcut,
    tone: action.intent === "danger" || action.tone === "danger" ? "danger" : undefined,
    disabled: isDisabled || action.disabled || action.loading || resolvedState === "loading",
  } as MenuItem;
}

function toDialogAction(action: ActionSheetAction, index: number, isDisabled: boolean, resolvedState: ActionSheetState): NonNullable<DialogProps["actions"]>[number] {
  return {
    key: actionKey(action, index),
    label: action.label,
    variant: action.intent === "danger" || action.tone === "danger" ? "danger" : action.variant ?? "secondary",
    intent: action.intent === "danger" || action.tone === "danger" ? "danger" : "default",
    density: action.density,
    disabled: isDisabled || action.disabled,
    loading: action.loading || resolvedState === "loading",
    icon: action.icon,
    trailingIcon: action.trailingIcon,
    type: action.type,
    onClick: action.onClick,
  } as NonNullable<DialogProps["actions"]>[number];
}

export const ActionSheet = forwardRef<HTMLDivElement, ActionSheetProps>(function ActionSheet({
  label = "Action sheet",
  description,
  density,
  state,
  open = false,
  disabled = false,
  loading = false,
  destructive = false,
  permissionBlocked = false,
  error,
  actions = [],
  cancelAction,
  primaryAction,
  overflow,
  search,
  feedback,
  dialog,
  className = "",
  onOpenChange,
  onAction,
  ...rest
}, ref) {
  const normalizedActions = normalizeActions(actions);
  const resolvedState = resolveState({
    open,
    loading,
    disabled,
    destructive: destructive || normalizedActions.some((action) => action.intent === "danger" || action.tone === "danger"),
    permissionBlocked,
    error: Boolean(error || feedback?.tone === "danger"),
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "permission-blocked";
  const isBusy = resolvedState === "loading";
  const listItems = normalizedActions.map((action, index) => toListItem(action, index, density, isDisabled, resolvedState));
  const menuItems = (overflow?.items?.length ? overflow.items : normalizedActions)
    .filter((item): item is ActionSheetAction => Boolean(item?.label))
    .map((action, index) => toMenuItem(action, index, isDisabled, resolvedState));
  const cancel = cancelAction ?? { key: "cancel", label: "Cancel", variant: "ghost" as const };
  const dialogActions = [
    ...normalizedActions
      .filter((action) => action.prominent || action.intent === "danger" || action.tone === "danger")
      .map((action, index) => toDialogAction(action, index, isDisabled, resolvedState)),
    cancel ? toDialogAction(cancel, normalizedActions.length, false, resolvedState) : null,
  ].filter(Boolean) as NonNullable<DialogProps["actions"]>;

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-pattern": "action-sheet",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedActions.length),
      "data-search-handoff": search ? "true" : "false",
      ...sanitizeRestProps(rest),
    },
    React.createElement(Dialog, {
      label,
      description,
      triggerLabel: dialog?.triggerLabel ?? "Open actions",
      closeLabel: dialog?.closeLabel ?? cancel.label ?? "Cancel",
      open,
      state: open ? "open" : "closed",
      tone: resolvedState === "error" || resolvedState === "destructive" ? "danger" : dialog?.tone ?? "neutral",
      variant: resolvedState === "destructive" ? "destructive" : dialog?.variant ?? "confirmation",
      density: dialog?.density ?? density,
      icon: dialog?.icon,
      fields: dialog?.fields,
      actions: dialog?.actions ?? dialogActions,
      onOpenChange: dialog?.onOpenChange ?? onOpenChange,
      onAction: dialog?.onAction ?? ((key, event) => onAction?.(key, event)),
    } as ComponentProps<typeof Dialog>),
    search
      ? React.createElement(Search, {
        ...search,
        label: search.label ?? "Find an action target",
        density: search.density ?? density,
        state: search.state ?? (search.loading ? "loading" : search.results?.length ? "results" : "idle"),
      } as ComponentProps<typeof Search>)
      : null,
    React.createElement(List, {
      label: `${label} actions`,
      items: listItems,
      variant: "action",
      interactive: true,
      density,
      state: isBusy ? "loading" : isDisabled ? "disabled" : resolvedState === "error" ? "error" : "default",
      selectedKey: normalizedActions.find((action) => action.selected)?.key,
      onSelect: (key, event) => onAction?.(key, event),
    } as ComponentProps<typeof List>),
    menuItems.length
      ? React.createElement(Menu, {
        triggerLabel: overflow?.triggerLabel ?? "More actions",
        label: overflow?.label ?? `${label} menu`,
        items: menuItems,
        open: overflow?.open,
        variant: resolvedState === "destructive" ? "danger" : overflow?.variant ?? "actions",
        density,
        state: isDisabled ? "disabled" : overflow?.open ? "open" : "closed",
        align: overflow?.align ?? "end",
        disabled: isDisabled || overflow?.disabled,
        onOpenChange: overflow?.onOpenChange,
        onSelect: (item, event) => {
          overflow?.onSelect?.(item, event);
          onAction?.(item.key, event);
        },
      } as ComponentProps<typeof Menu>)
      : null,
    primaryAction
      ? React.createElement(Button, {
        ...primaryAction,
        label: primaryAction.label,
        variant: primaryAction.variant ?? "primary",
        intent: primaryAction.intent,
        density: primaryAction.density ?? density,
        disabled: isDisabled || primaryAction.disabled,
        loading: isBusy || primaryAction.loading,
      } as ComponentProps<typeof Button>)
      : null,
    cancel
      ? React.createElement(Button, {
        ...cancel,
        label: cancel.label,
        variant: cancel.variant ?? "ghost",
        density: cancel.density ?? density,
        disabled: cancel.disabled,
        onClick: cancel.onClick,
      } as ComponentProps<typeof Button>)
      : null,
    error
      ? React.createElement(Toast, {
        label: error.label ?? "Action unavailable",
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
}) as ActionSheetComponent;

ActionSheet.displayName = "ActionSheet";
