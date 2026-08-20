import React, { forwardRef, useEffect, useId, useRef, useState } from "react";
import type { ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { popoverPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { Input } from "./Input.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { ButtonVariant } from "./Button.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type PopoverVariant = "information" | "action" | "form" | "metric";
export type PopoverState = "default" | "closed" | "open" | "hover" | "focus" | "warning" | "disabled";
export type PopoverPlacement = "top" | "right" | "bottom" | "left";
export type PopoverDensity = "sm" | "md" | "lg";
export type PopoverOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | globalThis.MouseEvent;

export interface PopoverAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: PopoverDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PopoverField {
  label: string;
  value?: string;
  placeholder?: string;
  helper?: string;
}

export interface PopoverProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  triggerLabel: string;
  title: string;
  description?: string;
  id?: string;
  open?: boolean;
  variant?: PopoverVariant;
  state?: PopoverState;
  placement?: PopoverPlacement;
  density?: PopoverDensity;
  fullWidth?: boolean;
  disabled?: boolean;
  actions?: PopoverAction[];
  field?: PopoverField;
  onOpenChange?: (open: boolean, event?: PopoverOpenChangeEvent) => void;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface PopoverComponent extends ForwardRefExoticComponent<PopoverProps & RefAttributes<HTMLSpanElement>> {
  displayName: "Popover";
  platformContract: typeof popoverPlatformContract;
}

type SetOpenOptions = { restoreFocus?: boolean; event?: PopoverOpenChangeEvent | undefined };

const validVariants = new Set<PopoverVariant>(["information", "action", "form", "metric"]);
const validStates = new Set<PopoverState>(["default", "closed", "open", "hover", "focus", "warning", "disabled"]);
const validPlacements = new Set<PopoverPlacement>(["top", "right", "bottom", "left"]);

function slug(value: string | undefined) {
  return String(value ?? "popover").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buttonVariantForAction(action: PopoverAction): ButtonVariant {
  if (action.variant === "danger") return "primary";
  return action.variant ?? "secondary";
}

export const Popover = forwardRef<HTMLSpanElement, PopoverProps>(function Popover({
  triggerLabel,
  title,
  description,
  id,
  open: openProp,
  variant = "information",
  state = "default",
  placement = "bottom",
  density,
  fullWidth = false,
  disabled = false,
  actions,
  field,
  onOpenChange,
  onAction,
  className = "",
  ...rest
}, ref) {
  const reactId = useId();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLElement | null>(null);
  const resolvedVariant = normalizeFlowValue(variant, validVariants, "information");
  const resolvedPlacement = normalizeFlowValue(placement, validPlacements, "bottom");
  const resolvedDensity = normalizeFlowDensity(density);
  const initialState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || ["open", "focus", "warning"].includes(initialState);
  const [internalOpen, setInternalOpen] = useState(initiallyOpen);
  const isOpen = isOpenControlled ? Boolean(openProp) : internalOpen;
  const [interactionState, setInteractionState] = useState(initiallyOpen ? "open" : initialState);
  const resolvedInteractionState = isOpenControlled ? (isOpen ? "open" : initialState) : interactionState;
  const panelId = id || `popover-${slug(triggerLabel)}-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const titleId = `${panelId}-title`;
  const sourceActions = Array.isArray(actions) ? actions : [];
  const resolvedActions = sourceActions.filter((action) => action?.label && action.key !== undefined && action.key !== null && action.key !== "");
  const isDisabled = disabled || resolvedInteractionState === "disabled";
  const hasTrigger = Boolean(triggerLabel);
  const hasField = Boolean(field?.label);

  const setOpen = (nextOpen: boolean, { restoreFocus = false, event }: SetOpenOptions = {}) => {
    if (isDisabled) return;
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    if (!isOpenControlled) setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen, event);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isOpen || isDisabled) return undefined;
    const onDocumentMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false, { event });
    };
    document.addEventListener("mousedown", onDocumentMouseDown);
    return () => document.removeEventListener("mousedown", onDocumentMouseDown);
  }, [isOpen, isDisabled]);

  if (!triggerLabel || !title) return null;

  const closeFromKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, { restoreFocus: true, event });
    }
    if (event.key === "Tab") setOpen(false, { event });
  };

  return React.createElement(
    "span",
    {
      ...flowRestProps(rest),
      ref,
      className: ["popover", className].filter(Boolean).join(" "),
      "data-open": String(Boolean(isOpen)),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(isDisabled ? "disabled" : resolvedInteractionState),
      "data-placement": resolvedPlacement,
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
    },
    hasTrigger ? React.createElement(Button, {
      ref: triggerRef,
      label: triggerLabel,
      variant: resolvedVariant === "metric" ? "tertiary" : "secondary",
      ...(resolvedDensity ? { density: resolvedDensity as FlowDensity } : {}),
      trailingIcon: isOpen ? "expand_less" : "expand_more",
      disabled: isDisabled,
      fullWidth,
      className: "popover__trigger",
      "data-popover-trigger": "",
      "aria-haspopup": "dialog",
      "aria-expanded": Boolean(isOpen),
      "aria-controls": panelId,
      onClick: (event: MouseEvent<HTMLButtonElement>) => setOpen(!isOpen, { event }),
      onKeyDown: closeFromKeyboard,
    }) : null,
    React.createElement(
      "section",
      {
        ref: panelRef,
        className: "popover__panel",
        hidden: !isOpen,
        id: panelId,
        role: "dialog",
        "aria-labelledby": titleId,
        onKeyDown: closeFromKeyboard,
      },
      React.createElement("strong", { id: titleId }, title),
      description ? React.createElement("p", null, description) : null,
      resolvedVariant === "form" && hasField && field
        ? React.createElement(Input, {
          label: field.label,
          value: field?.value ?? "",
          ...(field?.placeholder ? { placeholder: field.placeholder } : {}),
          ...(field?.helper ? { helper: field.helper } : {}),
          ...(resolvedDensity ? { density: resolvedDensity as FlowDensity } : {}),
          readOnly: true,
        })
        : null,
      resolvedActions.length
        ? React.createElement(
          "footer",
          { className: "popover__actions" },
          resolvedActions.map((action) => {
            const actionLabel = action.label;
            const { variant: actionVariantValue, intent: actionIntent, density: actionDensity, key: actionKey, ...actionProps } = action;
            return React.createElement(Button, {
              ...actionProps,
              key: action.key,
              label: actionLabel,
              ...(actionDensity ?? resolvedDensity ? { density: (actionDensity ?? resolvedDensity) as FlowDensity } : {}),
              variant: buttonVariantForAction(action),
              ...(actionIntent ?? actionVariantValue === "danger" ? { intent: actionIntent ?? "danger" } : {}),
              "data-popover-action": "",
              "data-key": actionKey,
              onClick: (event: MouseEvent<HTMLButtonElement>) => {
                action.onClick?.(event);
                if (event.defaultPrevented) return;
                if (actionKey) onAction?.(actionKey, event);
                setOpen(false, { restoreFocus: true, event });
              },
            });
          }),
        )
        : null,
    ),
  );
}) as PopoverComponent;

Popover.displayName = "Popover";
Popover.platformContract = popoverPlatformContract;
