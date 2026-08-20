import React, { forwardRef, useId, useRef, useState } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { dialogPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { IconButton } from "./IconButton.js";
import { Input } from "./Input.js";
import { flowStateProps, flowToneProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { ButtonVariant } from "./Button.js";
import type { InputState, InputVariant } from "./Input.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type DialogVariant = "confirmation" | "destructive" | "form" | "review" | "success";
export type DialogTone = "neutral" | "info" | "success" | "danger";
export type DialogState = "open" | "focus" | "closing" | "default" | "closed";
export type DialogDensity = "sm" | "md" | "lg";
export type DialogOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>;

export interface DialogAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: DialogDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DialogField {
  label: string;
  name: string;
  value?: string;
  placeholder?: string;
  helper?: string;
  error?: string;
  disabled?: boolean;
  readOnly?: boolean;
  density?: DialogDensity;
  state?: "default" | "hover" | "focus" | "filled" | "success" | "warning" | "error" | "disabled" | "loading";
  variant?: "default" | "password" | "search" | "with-prefix" | "with-suffix" | "readonly";
}

export interface DialogProps extends Omit<HTMLAttributes<HTMLDivElement>, "style" | "children" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  actions?: DialogAction[];
  open?: boolean;
  tone?: DialogTone;
  variant?: DialogVariant;
  state?: DialogState;
  density?: DialogDensity;
  icon?: string;
  fields?: DialogField[];
  id?: string;
  onOpenChange?: (open: boolean, event?: DialogOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface DialogComponent extends ForwardRefExoticComponent<DialogProps & RefAttributes<HTMLDivElement>> {
  displayName: "Dialog";
  platformContract: typeof dialogPlatformContract;
}

type SetOpenOptions = { restoreFocus?: boolean; event?: DialogOpenChangeEvent | undefined };
type FocusableElement = HTMLElement & { disabled?: boolean };

const validVariants = new Set<DialogVariant>(["confirmation", "destructive", "form", "review", "success"]);
const validStates = new Set<DialogState>(["open", "focus", "closing", "default", "closed"]);
const validTones = new Set<DialogTone>(["neutral", "info", "success", "danger"]);

function slug(value: string | undefined) {
  return String(value ?? "dialog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function resolveTone(tone: DialogTone | undefined, variant: DialogVariant): DialogTone {
  if (tone && validTones.has(tone)) return tone;
  if (variant === "success") return "success";
  if (variant === "destructive") return "danger";
  return "neutral";
}

function hasStableFieldName(field: DialogField | undefined): field is DialogField {
  return field?.name !== undefined && field?.name !== null && field?.name !== "";
}

function inputVariantForField(variant: DialogField["variant"] | undefined): InputVariant | undefined {
  if (variant === "password" || variant === "search") return variant;
  return undefined;
}

function inputStateForField(state: DialogField["state"] | undefined): InputState | undefined {
  if (state === "default" || state === "focus" || state === "filled" || state === "loading" || state === "error" || state === "disabled") return state;
  return undefined;
}

function buttonVariantForAction(action: DialogAction, fallback: ButtonVariant): ButtonVariant {
  if (action.variant === "danger") return "primary";
  return action.variant ?? fallback;
}

function focusableElements(container: HTMLElement | null): FocusableElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<FocusableElement>(
    "a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])",
  )).filter((element) => {
    if (element.disabled) return false;
    if (element.getAttribute("aria-disabled") === "true") return false;
    if (element.getAttribute("hidden") !== null) return false;
    return element.tabIndex >= 0;
  });
}

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(function Dialog({
  label,
  description,
  triggerLabel,
  closeLabel,
  actions,
  open: openProp,
  tone = "neutral",
  variant = "confirmation",
  state = "closed",
  density,
  icon,
  fields,
  id,
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "confirmation");
  const resolvedTone = resolveTone(tone, resolvedVariant);
  const resolvedDensity = normalizeFlowDensity(density);
  const initialState = normalizeFlowValue(state, validStates, "closed");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open" || initialState === "focus";
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? initialState : initialState === "default" ? "default" : "closed");
  const controlledInteractionState = isOpen ? "open" : initialState === "default" ? "default" : "closed";
  const resolvedInteractionState = isOpenControlled ? controlledInteractionState : interactionState;
  const resolvedState = isOpen ? resolvedInteractionState : resolvedInteractionState === "default" ? "default" : "closed";
  const dialogId = id || `dialog-${slug(label)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${dialogId}-title`;
  const resolvedIcon = icon || { danger: "warning", info: "info", success: "check_circle", neutral: "" }[resolvedTone];
  const hasTrigger = Boolean(triggerLabel);
  const sourceFields = Array.isArray(fields) ? fields : [];
  const visibleFields = sourceFields.filter((field) => field?.label && hasStableFieldName(field));

  const setOpen = (nextOpen: boolean, { restoreFocus = false, event }: SetOpenOptions = {}) => {
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    if (!isOpenControlled) setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen, event);
    if (normalizedOpen) requestAnimationFrame(() => closeRef.current?.focus());
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const closeDialog = ({ restoreFocus = true, event }: SetOpenOptions = {}) => setOpen(false, { restoreFocus, event });

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closeDialog({ event });
      return;
    }
    if (event.key !== "Tab" || !isOpen) return;
    const focusables = focusableElements(panelRef.current);
    if (!focusables.length) {
      event.preventDefault();
      panelRef.current?.focus();
      return;
    }
    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || !panelRef.current?.contains(active))) {
      event.preventDefault();
      last.focus();
      return;
    }
    if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const sourceActions = Array.isArray(actions) ? actions : [];
  const resolvedActions = sourceActions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "");

  if (!label) return null;

  return React.createElement(
    "div",
    {
      ...flowRestProps(rest),
      ref,
      className: ["dialog", `dialog--${resolvedTone}`, className].filter(Boolean).join(" "),
      "data-open": String(Boolean(isOpen)),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowToneProps(resolvedTone),
      ...flowDensityProps(resolvedDensity),
    },
    hasTrigger ? React.createElement(Button, {
      ref: triggerRef,
      label: triggerLabel ?? "",
      variant: "secondary",
      ...(resolvedDensity ? { density: resolvedDensity as FlowDensity } : {}),
      className: "dialog__trigger",
      "data-overlay-open": "",
      "aria-haspopup": "dialog",
      "aria-expanded": Boolean(isOpen),
      "aria-controls": dialogId,
      onClick: (event) => setOpen(true, { event }),
    }) : null,
    React.createElement(
      "div",
      {
        className: "dialog__overlay",
        hidden: !isOpen,
        "data-overlay-dismiss": "",
        onClick: (event: MouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) closeDialog({ event });
        },
        onKeyDown,
      },
      React.createElement(
        "section",
        {
          ref: panelRef,
          className: "dialog__panel",
          id: dialogId,
          role: "dialog",
          "aria-modal": "true",
          "aria-labelledby": titleId,
          tabIndex: -1,
          onClick: (event: MouseEvent<HTMLElement>) => event.stopPropagation(),
        },
        React.createElement(
          "header",
          { className: "dialog__header" },
          resolvedIcon ? React.createElement("span", { className: "dialog__icon", "aria-hidden": "true" }, resolvedIcon) : null,
          React.createElement(
            "div",
            { className: "dialog__content" },
            React.createElement("h3", { id: titleId }, label),
            description ? React.createElement("p", null, description) : null,
          ),
          closeLabel ? React.createElement(IconButton, {
            ref: closeRef,
            label: closeLabel,
            icon: "close",
            ...(resolvedDensity ? { density: resolvedDensity as FlowDensity } : {}),
            variant: "ghost",
            className: "dialog__close",
            "data-overlay-close": "",
            onClick: (event: MouseEvent<HTMLButtonElement>) => closeDialog({ event }),
          }) : null,
        ),
        visibleFields.length
          ? React.createElement(
            "div",
            { className: "dialog__body dialog__fields" },
            visibleFields.map((field) => {
              const { variant: fieldVariant, state: fieldState, density: fieldDensity, readOnly, ...fieldProps } = field;
              const mappedVariant = inputVariantForField(fieldVariant);
              const mappedState = inputStateForField(fieldState);
              return React.createElement(Input, {
                ...fieldProps,
                key: field.name,
                ...(fieldDensity ?? resolvedDensity ? { density: (fieldDensity ?? resolvedDensity) as FlowDensity } : {}),
                ...(mappedVariant ? { variant: mappedVariant } : {}),
                ...(mappedState ? { state: mappedState } : {}),
                readOnly: readOnly ?? true,
              });
            }),
          )
          : null,
        resolvedActions.length
          ? React.createElement(
            "footer",
            null,
            resolvedActions.map((action, index) => {
              const actionLabel = action.label;
              const needsDangerIntent = action.intent == null && resolvedTone === "danger" && index === resolvedActions.length - 1;
              const { variant: actionVariantValue, intent: actionIntent, density: actionDensity, key: actionKey, ...actionProps } = action;
              return React.createElement(Button, {
                ...actionProps,
                key: action.key,
                label: actionLabel,
                ...(actionDensity ?? resolvedDensity ? { density: (actionDensity ?? resolvedDensity) as FlowDensity } : {}),
                variant: buttonVariantForAction(action, index === resolvedActions.length - 1 ? "primary" : "secondary"),
                ...(actionVariantValue === "danger" || needsDangerIntent || actionIntent ? { intent: actionVariantValue === "danger" ? "danger" : needsDangerIntent ? "danger" : actionIntent } : {}),
                "data-overlay-close": "",
                "data-key": actionKey,
                onClick: (event: MouseEvent<HTMLButtonElement>) => {
                  action.onClick?.(event);
                  if (event.defaultPrevented) return;
                  if (actionKey) onAction?.(actionKey, event);
                  closeDialog({ event });
                },
              });
            }),
          )
          : null,
      ),
    ),
  );
}) as DialogComponent;

Dialog.displayName = "Dialog";
Dialog.platformContract = dialogPlatformContract;
