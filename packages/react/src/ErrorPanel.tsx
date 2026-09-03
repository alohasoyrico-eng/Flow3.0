import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { errorPanelPlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import type { ButtonProps } from "./Button.js";
import { Spinner } from "./Spinner.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

export type ErrorPanelVariant = "inline" | "panel" | "blocking" | "empty-recovery";
export type ErrorPanelState = "default" | "warning" | "error" | "critical" | "loading" | "disabled";
export type ErrorPanelTone = "warning" | "error" | "critical";
export type ErrorPanelDensity = "sm" | "md" | "lg";
export type ErrorPanelRole = "status" | "alert";

export interface ErrorPanelAction {
  key: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: ErrorPanelDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ErrorPanelProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  description?: string;
  action?: ErrorPanelAction;
  secondaryAction?: ErrorPanelAction;
  tone?: ErrorPanelTone;
  variant?: ErrorPanelVariant;
  state?: ErrorPanelState;
  density?: ErrorPanelDensity;
  fullWidth?: boolean;
  icon?: string;
  role?: ErrorPanelRole;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface ErrorPanelComponent extends ForwardRefExoticComponent<ErrorPanelProps & RefAttributes<HTMLElement>> {
  displayName: "ErrorPanel";
  platformContract: typeof errorPanelPlatformContract;
}

const validVariants = new Set<ErrorPanelVariant>(["inline", "panel", "blocking", "empty-recovery"]);
const validStates = new Set<ErrorPanelState>(["default", "warning", "error", "critical", "loading", "disabled"]);
const validTones = new Set<ErrorPanelTone>(["warning", "error", "critical"]);

function normalizeVariant(variant: ErrorPanelVariant): ErrorPanelVariant {
  return validVariants.has(variant) ? variant : "panel";
}

function normalizeState(state: ErrorPanelState): ErrorPanelState {
  return validStates.has(state) ? state : "error";
}

function resolveTone(state: ErrorPanelState, tone: ErrorPanelTone): ErrorPanelTone {
  if (state === "warning") return "warning";
  if (state === "critical") return "critical";
  if (validTones.has(tone)) return tone;
  return "error";
}

export const ErrorPanel = forwardRef<HTMLElement, ErrorPanelProps>(function ErrorPanel({
  label,
  description,
  action,
  secondaryAction,
  tone = "error",
  variant = "panel",
  state = "error",
  density,
  fullWidth = false,
  icon = "",
  role,
  onAction,
  className = "",
  ...rest
}, ref) {
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  const resolvedTone = resolveTone(resolvedState, tone);
  const resolvedRole = role ?? (resolvedTone === "warning" || resolvedState === "loading" ? "status" : "alert");
  const actionLabel = action?.label;
  const actionKey = action?.key ?? "";
  const secondaryActionLabel = secondaryAction?.label;
  const secondaryActionKey = secondaryAction?.key ?? "";
  const canRenderAction = Boolean(actionLabel && actionKey !== undefined && actionKey !== null && actionKey !== "");
  const canRenderSecondaryAction = Boolean(secondaryActionLabel && secondaryActionKey !== undefined && secondaryActionKey !== null && secondaryActionKey !== "");

  if (!label) return null;

  const renderAction = (panelAction: ErrorPanelAction, actionKind: "primary" | "secondary") => React.createElement(Button, {
    ...(panelAction as unknown as Record<string, unknown>),
    label: panelAction.label,
    variant: panelAction.variant ?? (actionKind === "primary" && resolvedVariant === "blocking" ? "primary" : "secondary"),
    disabled: resolvedState === "disabled" || panelAction.disabled,
    loading: resolvedState === "loading" || panelAction.loading,
    ...(panelAction.density ?? resolvedDensity ? { density: panelAction.density ?? resolvedDensity } : {}),
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      panelAction.onClick?.(event);
      if (event.defaultPrevented) return;
      onAction?.(panelAction.key, event);
    },
  } as unknown as ButtonProps);

  return React.createElement(
    "section",
    {
      ...flowRestProps(rest),
      ref,
      className: ["error-panel", `error-panel--${resolvedTone}`, className].filter(Boolean).join(" "),
      role: resolvedRole,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
    },
    React.createElement(
      "span",
      { className: "error-panel__icon", "aria-hidden": "true" },
      resolvedState === "loading"
        ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
        : icon || (resolvedTone === "warning" ? "warning" : "error"),
    ),
    React.createElement(
      "div",
      { className: "error-panel__content" },
      React.createElement("strong", null, label),
      description ? React.createElement("p", null, description) : null,
    ),
    canRenderAction || canRenderSecondaryAction
      ? React.createElement(
        "div",
        { className: "error-panel__actions" },
        canRenderAction && action ? renderAction(action, "primary") : null,
        canRenderSecondaryAction && secondaryAction ? renderAction(secondaryAction, "secondary") : null,
      )
      : null,
  );
}) as ErrorPanelComponent;

ErrorPanel.displayName = "ErrorPanel";
ErrorPanel.platformContract = errorPanelPlatformContract;
