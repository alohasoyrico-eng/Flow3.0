import React, {
  type ForwardRefExoticComponent,
  type HTMLAttributes,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useId,
} from "react";
import { emptyStatePlatformContract } from "@design-system/components/platforms";
import { Button } from "./Button.js";
import type { ButtonProps } from "./Button.js";
import { Spinner } from "./Spinner.js";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowStateProps, flowVariantProps, normalizeFlowDensity, flowDensityProps, flowRestProps } from "./internal/props.js";

export type EmptyStateVariant = "first-use" | "search-empty" | "permission" | "error" | "maintenance";
export type EmptyStateState = "default" | "action" | "search-empty" | "permission" | "loading" | "error";
export type EmptyStateDensity = "sm" | "md" | "lg";

export interface EmptyStateAction {
  key?: string;
  label: string;
  variant?: "primary" | "secondary" | "tertiary" | "ghost" | "danger";
  intent?: "default" | "danger";
  density?: EmptyStateDensity;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  trailingIcon?: string;
  type?: "button" | "submit" | "reset";
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
}

export interface EmptyStateProps extends Omit<HTMLAttributes<HTMLElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  title: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  variant?: EmptyStateVariant;
  state?: EmptyStateState;
  density?: EmptyStateDensity;
  fullWidth?: boolean;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface EmptyStateComponent extends ForwardRefExoticComponent<EmptyStateProps & RefAttributes<HTMLElement>> {
  displayName: "EmptyState";
  platformContract: typeof emptyStatePlatformContract;
}

const validVariants = new Set<EmptyStateVariant>(["first-use", "search-empty", "permission", "error", "maintenance"]);
const validStates = new Set<EmptyStateState>(["default", "action", "search-empty", "permission", "loading", "error"]);

function normalizeVariant(variant: EmptyStateVariant): EmptyStateVariant {
  return validVariants.has(variant) ? variant : "first-use";
}

function normalizeState(state: EmptyStateState): EmptyStateState {
  return validStates.has(state) ? state : "default";
}

export const EmptyState = forwardRef<HTMLElement, EmptyStateProps>(function EmptyState({
  title,
  description,
  icon,
  action,
  variant = "first-use",
  state = "default",
  density,
  fullWidth = false,
  onAction,
  className = "",
  id,
  ...rest
}, ref) {
  const reactId = useId();
  const titleId = id ? `${id}-title` : `empty-state-title-${reactId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const resolvedVariant = normalizeVariant(variant);
  const resolvedState = normalizeState(state);
  const resolvedDensity = normalizeFlowDensity(density);
  if (!title) return null;
  const showIcon = Boolean(icon) || resolvedState === "loading";
  const actionLabel = action?.label;
  const actionKey = action?.key ?? "";
  const canRenderAction = Boolean(actionLabel && actionKey !== undefined && actionKey !== null && actionKey !== "");

  return React.createElement(
    "section",
    {
      ...flowRestProps(rest),
      ref,
      id,
      className: ["empty-state", className].filter(Boolean).join(" "),
      "aria-labelledby": titleId,
      ...flowVariantProps(resolvedVariant),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      "data-full-width": String(Boolean(fullWidth)),
    },
    showIcon
      ? React.createElement(
        "span",
        { className: "empty-state__icon", "aria-hidden": "true" },
        resolvedState === "loading"
          ? React.createElement(Spinner, { ...(resolvedDensity ? { density: resolvedDensity } : {}), decorative: true })
          : icon,
      )
      : null,
    React.createElement("h3", { className: "empty-state__title", id: titleId }, title),
    description
      ? React.createElement("p", { className: "empty-state__description" }, description)
      : null,
    canRenderAction
      ? React.createElement(Button, {
        ...(action as unknown as Record<string, unknown>),
        label: actionLabel,
        variant: action?.variant ?? "primary",
        ...(action?.density ?? resolvedDensity ? { density: action?.density ?? resolvedDensity } : {}),
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          action?.onClick?.(event);
          if (event.defaultPrevented) return;
          onAction?.(actionKey, event);
        },
      } as unknown as ButtonProps)
      : null,
  );
}) as EmptyStateComponent;

EmptyState.displayName = "EmptyState";
EmptyState.platformContract = emptyStatePlatformContract;
