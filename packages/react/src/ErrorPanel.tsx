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
  const canRenderAction = Boolean(actionLabel && actionKey !== undefined && actionKey !== null && actionKey !== "");

  if (!label) return null;

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
    canRenderAction
      ? React.createElement(Button, {
        ...(action as unknown as Record<string, unknown>),
        label: actionLabel,
        variant: action?.variant ?? "secondary",
        disabled: resolvedState === "disabled" || action?.disabled,
        loading: resolvedState === "loading" || action?.loading,
        ...(action?.density ?? resolvedDensity ? { density: action?.density ?? resolvedDensity } : {}),
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          action?.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(actionKey, event);
        },
      } as unknown as ButtonProps)
      : null,
  );
}) as ErrorPanelComponent;

ErrorPanel.displayName = "ErrorPanel";
ErrorPanel.platformContract = errorPanelPlatformContract;
