import React, { forwardRef, useMemo } from "react";
import type { ComponentProps, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";

export type SnackbarProviderState =
  | "idle"
  | "queued"
  | "visible"
  | "dismissed"
  | "actionable"
  | "paused"
  | "error";

export type SnackbarProviderDensity = "sm" | "md" | "lg";

export interface SnackbarMessage extends Pick<ToastProps, "label" | "description" | "tone" | "variant" | "state" | "icon" | "actionLabel" | "dismissible" | "dismissLabel" | "dismissed"> {
  key?: string;
  id?: string;
  priority?: "low" | "normal" | "high";
}

export interface SnackbarQueueAction extends Pick<ButtonProps, "label" | "variant" | "intent" | "density" | "disabled" | "loading" | "icon" | "trailingIcon" | "type" | "onClick"> {
  key?: string;
}

export interface SnackbarProviderProps {
  label?: string;
  messages?: SnackbarMessage[];
  density?: SnackbarProviderDensity;
  state?: SnackbarProviderState;
  maxVisible?: number;
  paused?: boolean;
  action?: SnackbarQueueAction;
  className?: string;
  onMessageAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onMessageDismiss?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  onQueueAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
}

export interface SnackbarProviderComponent extends ForwardRefExoticComponent<SnackbarProviderProps & RefAttributes<HTMLDivElement>> {
  displayName: "SnackbarProvider";
}

interface NormalizedSnackbarMessage extends Required<Pick<SnackbarMessage, "label" | "tone" | "variant" | "state" | "dismissible" | "dismissLabel" | "priority">> {
  key: string;
  description?: SnackbarMessage["description"];
  icon?: SnackbarMessage["icon"];
  actionLabel?: SnackbarMessage["actionLabel"];
  dismissed?: SnackbarMessage["dismissed"];
}

type SnackbarRestProps = Record<string, unknown>;

function normalizeMessage(message: SnackbarMessage | null | undefined, index: number): NormalizedSnackbarMessage | null {
  if (!message?.label) return null;
  const key = message.key ?? message.id ?? `${message.label}-${index}`;
  return {
    key: String(key),
    label: message.label,
    ...(message.description ? { description: message.description } : {}),
    tone: message.tone ?? "info",
    variant: message.variant ?? (message.actionLabel ? "recovery" : "status"),
    state: message.state ?? (message.actionLabel ? "action" : "visible"),
    ...(message.icon ? { icon: message.icon } : {}),
    ...(message.actionLabel ? { actionLabel: message.actionLabel } : {}),
    dismissible: message.dismissible ?? true,
    dismissLabel: message.dismissLabel ?? "Dismiss notification",
    ...(message.dismissed === undefined ? {} : { dismissed: message.dismissed }),
    priority: message.priority ?? "normal",
  };
}

function sanitizeRestProps(rest: SnackbarRestProps): Record<`data-${string}` | `aria-${string}`, unknown> {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as Record<
    `data-${string}` | `aria-${string}`,
    unknown
  >;
}

export const SnackbarProvider = forwardRef<HTMLDivElement, SnackbarProviderProps>(function SnackbarProvider({
  label = "Notifications",
  messages,
  density,
  state = "visible",
  maxVisible = 2,
  paused = false,
  action,
  onMessageAction,
  onMessageDismiss,
  onQueueAction,
  className = "",
  ...rest
}, ref) {
  const normalizedMessages = useMemo(() => (Array.isArray(messages) ? messages : [])
    .map(normalizeMessage)
    .filter((message): message is NormalizedSnackbarMessage => Boolean(message)), [messages]);
  const visibleCount = Math.max(0, Number(maxVisible) || 0);
  const visibleMessages = normalizedMessages.slice(0, visibleCount);
  const queuedCount = Math.max(0, normalizedMessages.length - visibleMessages.length);
  const resolvedState = paused ? "paused" : normalizedMessages.length ? state : "idle";

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "overlay",
      role: "region",
      "aria-label": label,
      "data-flow-pattern": "snackbar-provider",
      "data-flow-slot": "viewport",
      "data-state": resolvedState,
      "data-density": density,
      "data-message-count": String(normalizedMessages.length),
      ...sanitizeRestProps(rest),
    } as ComponentProps<typeof Surface>,
    queuedCount > 0
      ? React.createElement(Badge, {
        label: `${queuedCount} queued`,
        ariaLabel: `${queuedCount} queued notifications`,
        tone: "info",
        variant: "count",
        state: "overflow",
        density,
        live: true,
      } as ComponentProps<typeof Badge>)
      : null,
    visibleMessages.map((message) => React.createElement(Toast, {
      key: message.key,
      label: message.label,
      description: message.description,
      tone: message.tone,
      variant: message.variant,
      state: paused ? "stacked" : message.state,
      density,
      icon: message.icon,
      actionLabel: message.actionLabel,
      dismissible: message.dismissible,
      dismissLabel: message.dismissLabel,
      dismissed: message.dismissed,
      onAction: message.actionLabel ? (event: MouseEvent<HTMLButtonElement>) => onMessageAction?.(message.key, event) : undefined,
      onDismiss: (event: MouseEvent<HTMLButtonElement>) => onMessageDismiss?.(message.key, event),
      "data-message-key": message.key,
      "data-priority": message.priority,
    } as ComponentProps<typeof Toast> & { key: string })),
    action?.label
      ? React.createElement(Button, {
        ...action,
        label: action.label,
        density: action.density ?? density,
        variant: action.variant ?? "ghost",
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          action.onClick?.(event);
          if (event.defaultPrevented) return;
          onQueueAction?.(action.key ?? action.label ?? "", event);
        },
      } as ComponentProps<typeof Button>)
      : null,
  );
}) as SnackbarProviderComponent;

SnackbarProvider.displayName = "SnackbarProvider";
