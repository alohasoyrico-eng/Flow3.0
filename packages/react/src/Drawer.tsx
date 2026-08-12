import React, { forwardRef, useId, useRef, useState } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode, RefAttributes } from "react";
import { drawerPlatformContract } from "@design-system/components/platforms";
import { Badge } from "./Badge.js";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";
import { ProgressIndicator } from "./ProgressIndicator.js";
import { flowStateProps, flowToneProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { BadgeTone, BadgeVariant } from "./Badge.js";
import type { ButtonVariant } from "./Button.js";
import type { InputState, InputVariant } from "./Input.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type DrawerVariant = "side-sheet" | "filter" | "detail" | "edit" | "review";
export type DrawerState = "closed" | "default" | "open" | "focus" | "closing";
export type DrawerTone = "neutral" | "info" | "danger";
export type DrawerDensity = "sm" | "md" | "lg";
export type DrawerSide = "left" | "right";
export type DrawerOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface DrawerAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: DrawerDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DrawerField {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  density?: DrawerDensity;
  state?: "default" | "hover" | "focus" | "filled" | "success" | "warning" | "error" | "disabled" | "loading";
  variant?: "default" | "password" | "search" | "with-prefix" | "with-suffix" | "readonly";
}

export type DrawerContent =
  | { type: "badge"; key: string; label?: string; tone?: BadgeTone; variant?: BadgeVariant; live?: boolean; density?: DrawerDensity }
  | { type: "progress"; key: string; label?: string; value?: number; max?: number; showValue?: boolean; tone?: "accent" | "success" | "warning" | "danger" | "ink"; density?: DrawerDensity }
  | { type: "text"; key: string; label?: string; copy?: string };

export interface DrawerProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "children" | "content" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  variant?: DrawerVariant;
  state?: DrawerState;
  tone?: DrawerTone;
  density?: DrawerDensity;
  side?: DrawerSide;
  fields?: DrawerField[];
  content?: DrawerContent[];
  actions?: DrawerAction[];
  open?: boolean;
  showCloseButton?: boolean;
  id?: string;
  onOpenChange?: (open: boolean, event?: DrawerOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DrawerComponent extends ForwardRefExoticComponent<DrawerProps & RefAttributes<HTMLDivElement>> {
  displayName: "Drawer";
  platformContract: typeof drawerPlatformContract;
}

type SetOpenOptions = { restoreFocus?: boolean; event?: DrawerOpenChangeEvent | undefined };

const validVariants = new Set<DrawerVariant>(["side-sheet", "filter", "detail", "edit", "review"]);
const validStates = new Set<DrawerState>(["closed", "default", "open", "focus", "closing"]);
const validTones = new Set<DrawerTone>(["neutral", "info", "danger"]);
const validSides = new Set<DrawerSide>(["left", "right"]);

function slug(value: string | undefined) {
  return String(value ?? "drawer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function hasStableKey(item: DrawerContent | undefined): item is DrawerContent {
  return item?.key !== undefined && item?.key !== null && item?.key !== "";
}

function hasStableFieldName(field: DrawerField | undefined): field is DrawerField {
  return field?.name !== undefined && field?.name !== null && field?.name !== "";
}

function inputVariantForField(variant: DrawerField["variant"] | undefined): InputVariant | undefined {
  if (variant === "password" || variant === "search") return variant;
  return undefined;
}

function inputStateForField(state: DrawerField["state"] | undefined): InputState | undefined {
  if (state === "default" || state === "focus" || state === "filled" || state === "loading" || state === "error" || state === "disabled") return state;
  return undefined;
}

function buttonVariantForAction(action: DrawerAction, fallback: ButtonVariant): ButtonVariant {
  if (action.variant === "danger") return "primary";
  return action.variant ?? fallback;
}

function renderContentItem(item: DrawerContent, inheritedDensity: FlowDensity | undefined): ReactNode {
  if (!hasStableKey(item)) return null;
  if (item?.type === "badge") {
    if (!item.label) return null;
    return React.createElement(
      "div",
      { className: "drawer__status-row", key: item.key },
      React.createElement(Badge, {
        label: item.label,
        tone: item.tone ?? "success",
        variant: item.variant ?? "status",
        live: Boolean(item.live),
        ...(item.density ?? inheritedDensity ? { density: (item.density ?? inheritedDensity) as FlowDensity } : {}),
      }),
    );
  }
  if (item?.type === "progress") {
    if (!item.label || item.value === undefined || item.value === null) return null;
    return React.createElement(
      "div",
      { className: "drawer__progress-row", key: item.key },
      React.createElement(ProgressIndicator, {
        label: item.label,
        value: item.value,
        max: item.max ?? 100,
        showValue: item.showValue ?? true,
        tone: item.tone ?? "accent",
        ...(item.density ?? inheritedDensity ? { density: (item.density ?? inheritedDensity) as FlowDensity } : {}),
        fullWidth: true,
      }),
    );
  }
  if (item?.type === "text") {
    const copy = item.copy ?? item.label;
    if (!copy) return null;
    return React.createElement(
      "p",
      { className: "drawer__supporting-copy", key: item.key },
      copy,
    );
  }
  return null;
}

export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer({
  label,
  description,
  triggerLabel,
  closeLabel,
  variant = "side-sheet",
  state = "closed",
  tone = "neutral",
  density,
  side = "right",
  fields,
  content,
  actions,
  open: openProp,
  showCloseButton = true,
  id,
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "side-sheet");
  const initialState = normalizeFlowValue(state, validStates, "closed");
  const resolvedTone = normalizeFlowValue(tone, validTones, "neutral");
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedSide = normalizeFlowValue(side, validSides, "right");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
  const controlledInteractionState = isOpen ? "open" : initialState === "default" ? "default" : "closed";
  const resolvedInteractionState = isOpenControlled ? controlledInteractionState : interactionState;
  const resolvedState = isOpen ? resolvedInteractionState : resolvedInteractionState === "default" ? "default" : "closed";
  const drawerId = id || `drawer-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${drawerId}-title`;
  const sourceActions = Array.isArray(actions) ? actions : [];
  const resolvedActions = sourceActions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "");
  const hasTrigger = Boolean(triggerLabel);
  const sourceFields = Array.isArray(fields) ? fields : [];
  const sourceContent = Array.isArray(content) ? content : [];
  const visibleFields = sourceFields.filter((field) => field?.label && hasStableFieldName(field));

  if (!label) return null;

  const setOpen = (nextOpen: boolean, { restoreFocus = false, event }: SetOpenOptions = {}) => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    if (!isOpenControlled) setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen, event);
    if (normalizedOpen) requestAnimationFrame(() => closeRef.current?.focus());
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const closeDrawer = ({ restoreFocus = true, event }: SetOpenOptions = {}) => setOpen(false, { restoreFocus, event });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Escape") return;
    event.preventDefault();
    closeDrawer({ event });
  };

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["drawer", `drawer--${resolvedTone}`, className].filter(Boolean).join(" "),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
      "data-open": String(Boolean(isOpen)),
      "data-side": resolvedSide,
    },
    hasTrigger ? React.createElement(Button, {
      ref: triggerRef,
      label: triggerLabel ?? "",
      variant: "secondary",
      ...(resolvedDensity ? { density: resolvedDensity as FlowDensity } : {}),
      className: "drawer__trigger",
      "data-overlay-open": "",
      "aria-haspopup": "dialog",
      "aria-expanded": Boolean(isOpen),
      "aria-controls": drawerId,
      onClick: (event) => setOpen(true, { event }),
    }) : null,
    React.createElement(
      "div",
      {
        className: "drawer__overlay",
        hidden: !isOpen,
        "data-overlay-dismiss": "",
        onClick: (event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) closeDrawer({ event });
        },
        onKeyDown,
      },
      React.createElement(
        "aside",
        {
          className: "drawer__panel",
          id: drawerId,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          onClick: (event: MouseEvent<HTMLElement>) => event.stopPropagation(),
        },
        React.createElement(
          "header",
          null,
          React.createElement("strong", { id: titleId }, label),
          showCloseButton && closeLabel ? React.createElement(IconButton, {
            ref: closeRef,
            icon: "close",
            label: closeLabel,
            ...(resolvedDensity ? { density: resolvedDensity as FlowDensity } : {}),
            variant: "ghost",
            className: "drawer__close",
            "data-overlay-close": "",
            onClick: (event: MouseEvent<HTMLButtonElement>) => closeDrawer({ event }),
          }) : null,
          description ? React.createElement("p", null, description) : null,
        ),
        React.createElement(
          "div",
          { className: "drawer__body" },
          sourceContent.map((item) => renderContentItem(item, resolvedDensity)),
          visibleFields.map((field) => {
            const normalized = field ?? {};
            const { variant: fieldVariant, state: fieldState, density: fieldDensity, readOnly, ...fieldProps } = normalized;
            const mappedVariant = inputVariantForField(fieldVariant);
            const mappedState = inputStateForField(fieldState);
            return React.createElement(Input, {
              ...fieldProps,
              key: normalized.name,
              ...(fieldDensity ?? resolvedDensity ? { density: (fieldDensity ?? resolvedDensity) as FlowDensity } : {}),
              ...(mappedVariant ? { variant: mappedVariant } : {}),
              ...(mappedState ? { state: mappedState } : {}),
              value: normalized.value ?? "",
              readOnly: readOnly ?? true,
            });
          }),
        ),
        resolvedActions.length
          ? React.createElement(
            "footer",
            null,
            resolvedActions.map((action, index) => {
              const actionLabel = action.label;
              const { variant: actionVariantValue, intent: actionIntent, density: actionDensity, key: actionKey, ...actionProps } = action;
              return React.createElement(Button, {
                ...actionProps,
                key: action.key,
                label: actionLabel,
                ...(actionDensity ?? resolvedDensity ? { density: (actionDensity ?? resolvedDensity) as FlowDensity } : {}),
                variant: buttonVariantForAction(action, index === 0 ? "primary" : "secondary"),
                ...(actionIntent ?? actionVariantValue === "danger" ? { intent: actionIntent ?? "danger" } : {}),
                "data-overlay-close": "",
                "data-key": actionKey,
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                  action.onClick?.(event);
                  if (event.defaultPrevented) return;
                  if (actionKey) onAction?.(actionKey, event);
                  closeDrawer({ event });
                },
              });
            }),
          )
          : null,
      ),
    ),
  );
}) as DrawerComponent;

Drawer.displayName = "Drawer";
Drawer.platformContract = drawerPlatformContract;
