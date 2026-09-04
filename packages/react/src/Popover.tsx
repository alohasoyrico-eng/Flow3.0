import React, { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { CSSProperties, ForwardRefExoticComponent, HTMLAttributes, KeyboardEvent, MouseEvent, RefAttributes } from "react";
import { popoverPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import { Input } from "./Input.js";
import { flowStateProps, flowVariantProps, normalizeFlowValue, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";
import type { ButtonVariant } from "./Button.js";
import type { FlowDataAttributes, FlowDensity } from "./internal/props.js";

export type PopoverVariant = "information" | "action" | "form" | "metric";
export type PopoverState = "default" | "closed" | "open" | "hover" | "focus" | "warning" | "disabled";
export type PopoverPlacement = "top" | "right" | "bottom" | "left" | `${"top" | "right" | "bottom" | "left"}-${"start" | "center" | "end"}`;
export type PopoverDensity = "sm" | "md" | "lg";
export type PopoverOpenChangeEvent = MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement> | globalThis.MouseEvent;
export type PopoverSurface = "card" | "none";

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
  matchAnchorWidth?: boolean;
  minWidth?: number;
  surface?: PopoverSurface;
  interactive?: boolean;
  autoFocus?: boolean;
  offset?: number;
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
const validPlacementSides = new Set(["top", "right", "bottom", "left"]);
const validPlacementAlignments = new Set(["start", "center", "end"]);
const validSurfaces = new Set<PopoverSurface>(["card", "none"]);

type PopoverSide = "top" | "right" | "bottom" | "left";
type PopoverAlignment = "start" | "center" | "end";
type PopoverPosition = {
  left: string;
  top: string;
  width?: number;
  maxHeight?: number;
  maxWidth?: number;
  transformOrigin: string;
  visible: "visible" | "hidden";
};

type PopoverRuntimeStyle = CSSProperties & Record<`--comp-popover-runtime-${string}`, string | undefined>;

function slug(value: string | undefined) {
  return String(value ?? "popover").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function buttonVariantForAction(action: PopoverAction): ButtonVariant {
  if (action.variant === "danger") return "primary";
  return action.variant ?? "secondary";
}

function normalizePlacement(value: PopoverPlacement | undefined): PopoverPlacement {
  const [sideValue, alignValue] = String(value ?? "bottom-start").split("-");
  const side = sideValue && validPlacementSides.has(sideValue) ? sideValue as PopoverSide : "bottom";
  if (!alignValue) return side === "top" || side === "bottom" ? `${side}-start` : `${side}-center`;
  const align = validPlacementAlignments.has(alignValue) ? alignValue as PopoverAlignment : "start";
  return `${side}-${align}`;
}

function splitPlacement(placement: PopoverPlacement): { side: PopoverSide; align: PopoverAlignment } {
  const [sideValue, alignValue] = placement.split("-");
  const side = sideValue && validPlacementSides.has(sideValue) ? sideValue as PopoverSide : "bottom";
  const defaultAlign = side === "top" || side === "bottom" ? "start" : "center";
  const align = alignValue && validPlacementAlignments.has(alignValue) ? alignValue as PopoverAlignment : defaultAlign;
  return { side, align };
}

function focusableInside(element: HTMLElement | null): HTMLElement | null {
  if (!element) return null;
  if (element.tabIndex >= 0 || /^(BUTTON|A|INPUT|SELECT|TEXTAREA)$/.test(element.tagName)) return element;
  return element.querySelector<HTMLElement>("[tabindex]:not([tabindex='-1']), button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])");
}

function focusableElementsInside(element: HTMLElement | null): HTMLElement[] {
  if (!element) return [];
  return [...element.querySelectorAll<HTMLElement>("[tabindex]:not([tabindex='-1']), button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])")];
}

function containsNode(element: HTMLElement | null, target: EventTarget | null): boolean {
  return Boolean(element && target instanceof Node && element.contains(target));
}

function isVisibleTabStop(element: HTMLElement): boolean {
  const style = window.getComputedStyle(element);
  return style.visibility !== "hidden" && style.display !== "none" && element.getClientRects().length > 0;
}

export const Popover = forwardRef<HTMLSpanElement, PopoverProps>(function Popover({
  triggerLabel,
  title,
  description,
  id,
  open: openProp,
  variant = "information",
  state = "default",
  placement = "bottom-start",
  density,
  fullWidth = false,
  matchAnchorWidth,
  minWidth,
  surface = "card",
  interactive = true,
  autoFocus = false,
  offset,
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
  const resolvedPlacement = normalizePlacement(placement);
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedSurface = normalizeFlowValue(surface, validSurfaces, "card");
  const resolvedOffset = typeof offset === "number" && Number.isFinite(offset) ? Math.max(0, offset) : undefined;
  const shouldMatchAnchorWidth = matchAnchorWidth ?? Boolean(fullWidth);
  const initialState = disabled ? "disabled" : normalizeFlowValue(state, validStates, "default");
  const isOpenControlled = openProp !== undefined;
  const initiallyOpen = Boolean(openProp) || initialState === "open";
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
  const [position, setPosition] = useState<PopoverPosition | null>(null);

  const setOpen = (nextOpen: boolean, { restoreFocus = false, event }: SetOpenOptions = {}) => {
    if (isDisabled) return;
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    if (!isOpenControlled) setInteractionState(normalizedOpen ? "open" : "closed");
    onOpenChange?.(normalizedOpen, event);
    if (restoreFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const placePanel = () => {
    const anchor = triggerRef.current;
    const panel = panelRef.current;
    if (!anchor || !panel || typeof window === "undefined") return;
    const anchorRect = anchor.getBoundingClientRect();
    const panelWidth = panel.offsetWidth || anchorRect.width;
    const panelHeight = panel.offsetHeight || 260;
    const { side, align } = splitPlacement(resolvedPlacement);
    const vertical = side === "top" || side === "bottom";
    const margin = 8;
    const panelOffset = resolvedOffset ?? 6;
    const room = {
      top: anchorRect.top,
      bottom: window.innerHeight - anchorRect.bottom,
      left: anchorRect.left,
      right: window.innerWidth - anchorRect.right,
    };
    const opposite = { top: "bottom", bottom: "top", left: "right", right: "left" } as const;
    const needed = (vertical ? panelHeight : panelWidth) + panelOffset;
    const realSide = room[side] < needed && room[opposite[side]] > room[side] ? opposite[side] : side;
    const cross = (size: number, start: number, end: number) => {
      if (align === "end") return end - size;
      if (align === "center") return start + ((end - start) / 2) - (size / 2);
      return start;
    };
    const clamp = (value: number, size: number, limit: number) => Math.max(margin, Math.min(value, limit - size - margin));
    let left = margin;
    let top = margin;
    let maxMain = 120;
    if (vertical) {
      left = clamp(cross(panelWidth, anchorRect.left, anchorRect.right), panelWidth, window.innerWidth);
      if (realSide === "bottom") {
        top = anchorRect.bottom + panelOffset;
        maxMain = window.innerHeight - top - margin;
      } else {
        maxMain = anchorRect.top - panelOffset - margin;
        top = Math.max(margin, anchorRect.top - panelOffset - Math.min(panelHeight, maxMain));
      }
    } else {
      top = clamp(cross(panelHeight, anchorRect.top, anchorRect.bottom), panelHeight, window.innerHeight);
      if (realSide === "right") {
        left = anchorRect.right + panelOffset;
        maxMain = window.innerWidth - left - margin;
      } else {
        maxMain = anchorRect.left - panelOffset - margin;
        left = Math.max(margin, anchorRect.left - panelOffset - Math.min(panelWidth, maxMain));
      }
    }
    const nextPosition: PopoverPosition = {
      left: `${Math.round(left)}px`,
      top: `${Math.round(top)}px`,
      transformOrigin: { top: "bottom", bottom: "top", left: "right", right: "left" }[realSide],
      visible: "visible",
    };
    if (shouldMatchAnchorWidth && vertical) nextPosition.width = anchorRect.width;
    if (vertical) nextPosition.maxHeight = Math.max(120, maxMain);
    if (!vertical) nextPosition.maxWidth = Math.max(120, maxMain);
    setPosition(nextPosition);
  };

  useLayoutEffect(() => {
    if (!isOpen || isDisabled) {
      setPosition(null);
      return undefined;
    }
    placePanel();
    const frame = requestAnimationFrame(placePanel);
    const onViewportChange = () => placePanel();
    window.addEventListener("scroll", onViewportChange, true);
    window.addEventListener("resize", onViewportChange);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onViewportChange, true);
      window.removeEventListener("resize", onViewportChange);
    };
  }, [isOpen, isDisabled, resolvedPlacement, resolvedOffset, shouldMatchAnchorWidth, title, description, resolvedDensity, resolvedVariant]);

  useEffect(() => {
    if (!isOpen || !autoFocus || !position) return;
    focusableInside(panelRef.current)?.focus();
  }, [isOpen, autoFocus, position]);

  useEffect(() => {
    if (!isOpen || isDisabled) return undefined;
    const onDocumentMouseDown = (event: globalThis.MouseEvent) => {
      const target = event.target instanceof Node ? event.target : null;
      if (!target) return;
      if (triggerRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      setOpen(false, { event });
    };
    if (interactive) document.addEventListener("mousedown", onDocumentMouseDown);
    return () => document.removeEventListener("mousedown", onDocumentMouseDown);
  }, [isOpen, isDisabled, interactive]);

  if (!triggerLabel || !title) return null;

  const closeFromKeyboard = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, { restoreFocus: true, event });
    }
  };

  const focusRelativeToTrigger = (direction: 1 | -1) => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const panel = panelRef.current;
    const stops = [...document.querySelectorAll<HTMLElement>("[tabindex]:not([tabindex='-1']), button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])")]
      .filter((element) => !containsNode(panel, element) && isVisibleTabStop(element));
    const currentIndex = stops.indexOf(trigger);
    const target = currentIndex >= 0 ? stops[currentIndex + direction] : undefined;
    requestAnimationFrame(() => target?.focus());
  };

  const closeAndContinueTabOrder = (event: KeyboardEvent<HTMLElement>, direction: 1 | -1) => {
    event.preventDefault();
    setOpen(false, { event });
    focusRelativeToTrigger(direction);
  };

  const closeWhenTabLeavesPanel = (event: KeyboardEvent<HTMLElement>) => {
    closeFromKeyboard(event);
    if (event.key !== "Tab" || !interactive || !isOpen) return;
    const focusables = focusableElementsInside(panelRef.current);
    if (!focusables.length) {
      closeAndContinueTabOrder(event, event.shiftKey ? -1 : 1);
      return;
    }
    const active = document.activeElement;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const leavesBackward = event.shiftKey && active === first;
    const leavesForward = !event.shiftKey && active === last;
    if (!leavesBackward && !leavesForward) return;
    closeAndContinueTabOrder(event, leavesBackward ? -1 : 1);
  };

  const moveFocusIntoPanel = (event: KeyboardEvent<HTMLElement>) => {
    closeFromKeyboard(event);
    if (event.key !== "Tab" || !interactive || !isOpen) return;
    const focusTarget = focusableInside(panelRef.current);
    if (!focusTarget) {
      closeAndContinueTabOrder(event, event.shiftKey ? -1 : 1);
      return;
    }
    if (event.shiftKey) {
      closeAndContinueTabOrder(event, -1);
      return;
    }
    event.preventDefault();
    focusTarget.focus();
  };

  const closeAfterFocusLeaves = (event: React.FocusEvent<HTMLElement>) => {
    if (!interactive || !isOpen) return;
    const nextFocus = event.relatedTarget;
    if (containsNode(panelRef.current, nextFocus) || containsNode(triggerRef.current, nextFocus)) return;
    setOpen(false, { event: undefined });
  };

  const panelStyle: PopoverRuntimeStyle = {
    "--comp-popover-runtime-left": position?.left ?? "-9999px",
    "--comp-popover-runtime-top": position?.top ?? "-9999px",
    "--comp-popover-runtime-origin": position?.transformOrigin ?? "top",
    "--comp-popover-runtime-visibility": position?.visible ?? "hidden",
  };
  if (position?.width) panelStyle["--comp-popover-runtime-width"] = `${Math.round(position.width)}px`;
  if (minWidth) panelStyle["--comp-popover-runtime-min-width"] = `${Math.round(minWidth)}px`;
  if (position?.maxHeight) panelStyle["--comp-popover-runtime-max-height"] = `${Math.round(position.maxHeight)}px`;
  if (position?.maxWidth) panelStyle["--comp-popover-runtime-max-width"] = `${Math.round(position.maxWidth)}px`;

  const panel = React.createElement(
    "span",
    {
      className: "popover popover--portal",
      "data-open": String(Boolean(isOpen)),
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(isDisabled ? "disabled" : resolvedInteractionState),
      "data-placement": resolvedPlacement,
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "data-surface": resolvedSurface,
      "data-interactive": String(Boolean(interactive)),
    },
    React.createElement(
      "section",
      {
        ref: panelRef,
        className: "popover__panel",
        id: panelId,
        role: "dialog",
        "aria-labelledby": titleId,
        "data-popover-panel": "",
        onKeyDown: closeWhenTabLeavesPanel,
        onBlur: closeAfterFocusLeaves,
        style: panelStyle,
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
      "data-surface": resolvedSurface,
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
      onKeyDown: moveFocusIntoPanel,
      onBlur: closeAfterFocusLeaves,
    }) : null,
    isOpen && typeof document !== "undefined" ? createPortal(panel, document.body) : null,
  );
}) as PopoverComponent;

Popover.displayName = "Popover";
Popover.platformContract = popoverPlatformContract;
