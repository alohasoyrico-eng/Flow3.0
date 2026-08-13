import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Drawer } from "../Drawer.js";
import type { DrawerProps } from "../Drawer.js";
import { IconButton } from "../IconButton.js";
import { InlineValidation } from "../InlineValidation.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import { List } from "../List.js";
import type { ListItem } from "../List.js";
import { Surface } from "../Surface.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { DrawerAdapter } from "./DrawerAdapter.js";

export type BottomSheetState = "closed" | "open" | "dragging" | "loading" | "invalid" | "destructive" | "permission-blocked" | "disabled";
export type BottomSheetDensity = "sm" | "md" | "lg";

export interface BottomSheetValidation extends Pick<InlineValidationProps, "label" | "message" | "state" | "live"> {}

export interface BottomSheetAction extends ButtonProps {
  key?: string;
}

export interface BottomSheetProps extends FlowDataAttributes {
  label: string;
  description?: string;
  density?: BottomSheetDensity;
  state?: BottomSheetState;
  open?: boolean;
  dragging?: boolean;
  loading?: boolean;
  invalid?: boolean;
  destructive?: boolean;
  permissionBlocked?: boolean;
  disabled?: boolean;
  triggerLabel?: string;
  closeLabel?: string;
  items?: ListItem[];
  actions?: BottomSheetAction[];
  validation?: BottomSheetValidation;
  drawer?: Partial<DrawerProps>;
  className?: string;
  onOpenChange?: DrawerProps["onOpenChange"];
  onAction?: (key: string, event?: MouseEvent<HTMLElement>) => void;
  onSelect?: (key: string, event?: MouseEvent<HTMLElement>) => void;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface BottomSheetComponent extends ForwardRefExoticComponent<BottomSheetProps & RefAttributes<HTMLDivElement>> {
  displayName: "BottomSheet";
}

type BottomSheetRestProps = Record<string, unknown>;

interface ResolveStateInput {
  open: boolean;
  dragging: boolean;
  loading: boolean;
  invalid: boolean;
  destructive: boolean;
  permissionBlocked: boolean;
  disabled: boolean;
  state?: BottomSheetState | undefined;
}

function sanitizeRestProps(rest: BottomSheetRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function normalizeActions(actions: BottomSheetAction[] | undefined): BottomSheetAction[] {
  return (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
}

function normalizeItems(items: ListItem[] | undefined): ListItem[] {
  return (Array.isArray(items) ? items : []).filter((item) => Boolean(item?.label));
}

function resolveState({
  open,
  dragging,
  loading,
  invalid,
  destructive,
  permissionBlocked,
  disabled,
  state,
}: ResolveStateInput): BottomSheetState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (invalid || state === "invalid") return "invalid";
  if (destructive || state === "destructive") return "destructive";
  if (dragging || state === "dragging") return "dragging";
  if (open || state === "open") return "open";
  return state ?? "closed";
}

export const BottomSheet = forwardRef<HTMLDivElement, BottomSheetProps>(function BottomSheet({
  label,
  description,
  density,
  state,
  open = false,
  dragging = false,
  loading = false,
  invalid = false,
  destructive = false,
  permissionBlocked = false,
  disabled = false,
  triggerLabel,
  closeLabel = "Close",
  items = [],
  actions = [],
  validation,
  drawer,
  className = "",
  onOpenChange,
  onAction,
  onSelect,
  ...rest
}, ref) {
  const normalizedItems = normalizeItems(items);
  const normalizedActions = normalizeActions(actions);
  const resolvedState = resolveState({
    open,
    dragging,
    loading,
    invalid: invalid || Boolean(validation?.message),
    destructive,
    permissionBlocked,
    disabled,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";

  if (!label) return null;

  return React.createElement(
    Surface,
    {
      ref,
      surfaceRole: "overlay",
      elevation: open ? "overlay" : "none",
      state: open ? "overlay" : "default",
      density,
      className,
      role: "group",
      "aria-label": label,
      "aria-busy": loading ? "true" : undefined,
      "data-flow-pattern": "bottom-sheet",
      "data-state": resolvedState,
      "data-open": String(Boolean(open)),
      ...sanitizeRestProps(rest),
    } as ComponentProps<typeof Surface>,
    React.createElement(DrawerAdapter, {
      label,
      description,
      density,
      open,
      modal: true,
      loading,
      disabled: isDisabled,
      state: open ? "modal" : "closed",
      drawer: {
        triggerLabel,
        closeLabel,
        side: "right",
        variant: "detail",
        tone: destructive ? "danger" : "neutral",
        ...drawer,
      } as ComponentProps<typeof Drawer>,
      list: normalizedItems.length
        ? {
          label: `${label} content`,
          items: normalizedItems,
          interactive: true,
          density,
          onSelect,
        }
        : undefined,
      actions: normalizedActions.map((action) => ({
        ...action,
        disabled: isDisabled || action.disabled,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(action.key ?? action.label ?? "", event);
        },
      })),
      onOpenChange,
      onAction,
      "data-bottom-sheet-boundary": "drawer-adapter",
    } as ComponentProps<typeof DrawerAdapter>),
    closeLabel && open
      ? React.createElement(IconButton, {
        label: closeLabel,
        icon: "close",
        variant: "ghost",
        density,
        disabled: isDisabled,
        onClick: (event) => onOpenChange?.(false, event),
        "data-flow-slot": "close",
      } as ComponentProps<typeof IconButton>)
      : null,
    normalizedItems.length && !open
      ? React.createElement(List, {
        label: `${label} preview`,
        items: normalizedItems.slice(0, 3),
        density,
        state: isDisabled ? "disabled" : "default",
        onSelect,
      } as ComponentProps<typeof List>)
      : null,
    validation?.message
      ? React.createElement(InlineValidation, {
        label: validation.label ?? label,
        message: validation.message,
        state: validation.state ?? "error",
        density,
        live: validation.live,
      } as ComponentProps<typeof InlineValidation>)
      : null,
    normalizedActions.length && !open
      ? React.createElement(
        "div",
        { "data-flow-slot": "actions" },
        normalizedActions.map((action) => React.createElement(Button, {
          ...action,
          key: action.key ?? action.label,
          label: action.label,
          density: action.density ?? density,
          disabled: isDisabled || action.disabled,
          onClick: (event) => {
            action.onClick?.(event);
            if (event.defaultPrevented) return;
            onAction?.(action.key ?? action.label ?? "", event);
          },
        } as ComponentProps<typeof Button>)),
      )
      : null,
  );
}) as BottomSheetComponent;

BottomSheet.displayName = "BottomSheet";
