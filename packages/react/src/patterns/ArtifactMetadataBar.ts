import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Chip } from "../Chip.js";
import type { ChipProps } from "../Chip.js";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceProps } from "../Surface.js";
import { Tag } from "../Tag.js";
import type { TagProps } from "../Tag.js";
import { Tooltip } from "../Tooltip.js";
import type { TooltipProps } from "../Tooltip.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowRestProps } from "../internal/props.js";

export type ArtifactMetadataBarState = "default" | "compact" | "overflow" | "interactive" | "loading" | "empty";
export type ArtifactMetadataBarDensity = SurfaceDensity;
export type ArtifactMetadataBarItemKind = "tag" | "badge" | "chip";

export interface ArtifactMetadataBarItem extends FlowDataAttributes {
  key?: string;
  label: string;
  value?: string;
  kind?: ArtifactMetadataBarItemKind;
  tone?: TagProps["tone"] | BadgeProps["tone"] | ChipProps["tone"];
  variant?: TagProps["variant"] | BadgeProps["variant"] | ChipProps["variant"];
  icon?: string;
  explanation?: string;
  interactive?: boolean;
  selected?: boolean;
  disabled?: boolean;
}

export interface ArtifactMetadataBarAction extends ButtonProps {
  key?: string;
}

export interface ArtifactMetadataBarProps extends FlowDataAttributes {
  label?: string;
  items?: ArtifactMetadataBarItem[];
  actions?: ArtifactMetadataBarAction[];
  density?: ArtifactMetadataBarDensity;
  state?: ArtifactMetadataBarState;
  compact?: boolean;
  loading?: boolean;
  emptyLabel?: string;
  children?: ReactNode;
  surface?: Omit<SurfaceProps, "children" | "density" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface ArtifactMetadataBarComponent extends ForwardRefExoticComponent<ArtifactMetadataBarProps & RefAttributes<HTMLDivElement>> {
  displayName: "ArtifactMetadataBar";
}

const validStates = new Set<ArtifactMetadataBarState>(["default", "compact", "overflow", "interactive", "loading", "empty"]);

function sanitizeRestProps(rest: object): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(flowRestProps(rest as Record<string, unknown>)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function itemLabel(item: ArtifactMetadataBarItem): string {
  return item.value ? `${item.label}: ${item.value}` : item.label;
}

function itemKey(item: ArtifactMetadataBarItem, index: number): string {
  return item.key ?? `${item.label}-${item.value ?? index}`;
}

function resolveState({
  state,
  loading,
  compact,
  items,
  actions,
}: {
  state?: ArtifactMetadataBarState;
  loading?: boolean;
  compact?: boolean;
  items: ArtifactMetadataBarItem[];
  actions: ArtifactMetadataBarAction[];
}): ArtifactMetadataBarState {
  if (loading || state === "loading") return "loading";
  if (!items.length && !actions.length) return "empty";
  if (state && validStates.has(state)) return state;
  if (compact) return "compact";
  if (actions.length || items.some((item) => item.interactive)) return "interactive";
  return "default";
}

function renderCoreItem(item: ArtifactMetadataBarItem, density: ArtifactMetadataBarDensity | undefined, disabled: boolean, index: number) {
  const label = itemLabel(item);
  const common = {
    label,
    density,
    icon: item.icon,
    "data-flow-slot": "artifact-metadata-bar.item",
    ...sanitizeRestProps(item),
  };

  if (item.kind === "badge") {
    return React.createElement(Badge, {
      ...common,
      tone: item.tone as BadgeProps["tone"],
      variant: (item.variant as BadgeProps["variant"]) ?? "status",
      state: disabled || item.disabled ? "disabled" : "default",
      live: false,
    } as ComponentProps<typeof Badge>);
  }

  if (item.kind === "chip") {
    return React.createElement(Chip, {
      ...common,
      tone: item.tone as ChipProps["tone"],
      variant: (item.variant as ChipProps["variant"]) ?? "assist",
      state: disabled || item.disabled ? "disabled" : item.selected ? "selected" : "default",
      selected: item.selected,
      interactive: item.interactive,
      disabled: disabled || item.disabled,
    } as ComponentProps<typeof Chip>);
  }

  return React.createElement(Tag, {
    ...common,
    tone: item.tone as TagProps["tone"],
    variant: (item.variant as TagProps["variant"]) ?? "metadata",
    state: disabled || item.disabled ? "disabled" : item.interactive ? "focus" : "default",
    interactive: item.interactive,
    disabled: disabled || item.disabled,
  } as ComponentProps<typeof Tag>);
}

function renderItem(item: ArtifactMetadataBarItem, density: ArtifactMetadataBarDensity | undefined, disabled: boolean, index: number) {
  const core = renderCoreItem(item, density, disabled, index);
  if (!item.explanation) return React.createElement("span", { key: itemKey(item, index), "data-flow-slot": "artifact-metadata-bar.item-wrapper" }, core);
  return React.createElement(
    "span",
    { key: itemKey(item, index), "data-flow-slot": "artifact-metadata-bar.item-wrapper" },
    core,
    React.createElement(Tooltip, {
      triggerLabel: `${itemLabel(item)} details`,
      content: item.explanation,
      density,
      disabled,
      "data-flow-slot": "artifact-metadata-bar.explanation",
    } as ComponentProps<typeof Tooltip>),
  );
}

function renderAction(action: ArtifactMetadataBarAction, density: ArtifactMetadataBarDensity | undefined, disabled: boolean, index: number) {
  return React.createElement(Button, {
    ...action,
    key: action.key ?? action.label ?? String(index),
    label: action.label,
    density: action.density ?? density,
    variant: action.variant ?? "tertiary",
    disabled: disabled || action.disabled,
    "data-flow-slot": "artifact-metadata-bar.action",
  } as ComponentProps<typeof Button> & { key: string });
}

export const ArtifactMetadataBar = forwardRef<HTMLDivElement, ArtifactMetadataBarProps>(function ArtifactMetadataBar({
  label = "Artifact metadata",
  items = [],
  actions = [],
  density,
  state,
  compact = false,
  loading = false,
  emptyLabel = "No metadata",
  children,
  surface,
  className = "",
  ...rest
}, ref) {
  const normalizedItems = (Array.isArray(items) ? items : []).filter((item) => Boolean(item?.label));
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => Boolean(action?.label));
  const resolvedState = resolveState({ state, loading, compact, items: normalizedItems, actions: normalizedActions });
  const disabled = resolvedState === "loading";

  return React.createElement(
    Surface,
    {
      ...surface,
      ...sanitizeRestProps(rest),
      ref,
      className: ["artifact-metadata-bar", className].filter(Boolean).join(" "),
      surfaceRole: "inline",
      density,
      state: disabled ? "disabled" : "default",
      "aria-label": rest["aria-label"] ?? label,
      "aria-busy": disabled ? "true" : undefined,
      "data-flow-pattern": "artifact-metadata-bar",
      "data-artifact-metadata-bar-state": resolvedState,
      "data-artifact-metadata-bar-count": String(normalizedItems.length),
    } as ComponentProps<typeof Surface>,
    normalizedItems.length
      ? React.createElement(
        "span",
        { "data-flow-slot": "artifact-metadata-bar.items" },
        normalizedItems.map((item, index) => renderItem(item, density, disabled, index)),
      )
      : React.createElement("span", { "data-flow-slot": "artifact-metadata-bar.empty" }, emptyLabel),
    children ? React.createElement("span", { "data-flow-slot": "artifact-metadata-bar.body" }, children) : null,
    normalizedActions.length
      ? React.createElement(
        "span",
        { "data-flow-slot": "artifact-metadata-bar.actions" },
        normalizedActions.map((action, index) => renderAction(action, density, disabled, index)),
      )
      : null,
  );
}) as ArtifactMetadataBarComponent;

ArtifactMetadataBar.displayName = "ArtifactMetadataBar";
