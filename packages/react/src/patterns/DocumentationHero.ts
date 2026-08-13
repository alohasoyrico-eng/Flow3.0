import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, ReactNode, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Surface } from "../Surface.js";
import type { SurfaceDensity, SurfaceElevation, SurfaceProps, SurfaceTone } from "../Surface.js";
import { Tag } from "../Tag.js";
import type { TagProps } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { flowDefinedProps, flowRestProps } from "../internal/props.js";
import { SectionHeader } from "./SectionHeader.js";
import type { SectionHeaderHeadingLevel } from "./SectionHeader.js";

export type DocumentationHeroState = "default" | "with-actions" | "with-metadata" | "with-status" | "loading";
export type DocumentationHeroDensity = SurfaceDensity;
export type DocumentationHeroTone = SurfaceTone | "brand";
export type DocumentationHeroBackground = "none" | "tint" | "gradient-grid";
export type DocumentationHeroMetadataKind = "badge" | "tag";

export interface DocumentationHeroMetadata extends FlowDataAttributes {
  key?: string;
  label: string;
  value?: string;
  kind?: DocumentationHeroMetadataKind;
  tone?: BadgeProps["tone"] | TagProps["tone"];
  variant?: BadgeProps["variant"] | TagProps["variant"];
  icon?: string;
}

export interface DocumentationHeroAction extends ButtonProps {
  key?: string;
  href?: string;
}

export interface DocumentationHeroProps extends FlowDataAttributes {
  kicker?: string;
  title: string;
  description?: string;
  headingLevel?: SectionHeaderHeadingLevel;
  metadata?: DocumentationHeroMetadata[];
  actions?: DocumentationHeroAction[];
  visual?: ReactNode;
  children?: ReactNode;
  density?: DocumentationHeroDensity;
  tone?: DocumentationHeroTone;
  elevation?: SurfaceElevation;
  state?: DocumentationHeroState;
  loading?: boolean;
  background?: DocumentationHeroBackground;
  surface?: Omit<SurfaceProps, "children" | "density" | "tone" | "elevation" | "surfaceRole" | "state">;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface DocumentationHeroComponent extends ForwardRefExoticComponent<DocumentationHeroProps & RefAttributes<HTMLDivElement>> {
  displayName: "DocumentationHero";
}

const validStates = new Set<DocumentationHeroState>(["default", "with-actions", "with-metadata", "with-status", "loading"]);
const validBackgrounds = new Set<DocumentationHeroBackground>(["none", "tint", "gradient-grid"]);

function sanitizeRestProps(rest: object): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(flowRestProps(rest as Record<string, unknown>)).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function resolveState({
  state,
  loading,
  actions,
  metadata,
}: {
  state?: DocumentationHeroState;
  loading?: boolean;
  actions?: DocumentationHeroAction[];
  metadata?: DocumentationHeroMetadata[];
}): DocumentationHeroState {
  if (loading || state === "loading") return "loading";
  if (state && validStates.has(state)) return state;
  if ((actions?.length ?? 0) > 0) return "with-actions";
  if ((metadata?.length ?? 0) > 0) return "with-metadata";
  return "default";
}

function resolveTone(tone: DocumentationHeroTone | undefined): SurfaceTone {
  if (tone === "brand") return "selected";
  return tone ?? "default";
}

function resolveBackground(background: DocumentationHeroBackground | undefined): DocumentationHeroBackground {
  return background && validBackgrounds.has(background) ? background : "none";
}

function metadataKey(item: DocumentationHeroMetadata, index: number): string {
  return item.key ?? `${item.label}-${item.value ?? index}`;
}

function renderMetadata(item: DocumentationHeroMetadata, density: DocumentationHeroDensity | undefined, disabled: boolean, index: number) {
  const common = {
    label: item.value ? `${item.label}: ${item.value}` : item.label,
    density,
    icon: item.icon,
    "data-flow-slot": "documentation-hero.metadata-item",
    ...sanitizeRestProps(item),
  };
  if (item.kind === "badge") {
    return React.createElement(Badge, {
      ...common,
      key: metadataKey(item, index),
      tone: item.tone as BadgeProps["tone"],
      variant: (item.variant as BadgeProps["variant"]) ?? "status",
      state: disabled ? "disabled" : "default",
      live: false,
    } as ComponentProps<typeof Badge> & { key: string });
  }
  return React.createElement(Tag, {
    ...common,
    key: metadataKey(item, index),
    tone: item.tone as TagProps["tone"],
    variant: (item.variant as TagProps["variant"]) ?? "metadata",
    state: disabled ? "disabled" : "default",
  } as ComponentProps<typeof Tag> & { key: string });
}

function renderAction(action: DocumentationHeroAction, density: DocumentationHeroDensity | undefined, disabled: boolean, index: number) {
  const key = action.key ?? action.label ?? String(index);
  return React.createElement(Button, {
    ...action,
    key,
    label: action.label,
    density: action.density ?? density,
    variant: action.variant ?? (index === 0 ? "primary" : "secondary"),
    disabled: disabled || action.disabled,
    "data-flow-slot": "documentation-hero.action",
  } as ComponentProps<typeof Button> & { key: string });
}

export const DocumentationHero = forwardRef<HTMLDivElement, DocumentationHeroProps>(function DocumentationHero({
  kicker,
  title,
  description,
  headingLevel = 1,
  metadata = [],
  actions = [],
  visual,
  children,
  density,
  tone,
  elevation = "none",
  state,
  loading = false,
  background = "none",
  surface,
  className = "",
  ...rest
}, ref) {
  const normalizedMetadata = Array.isArray(metadata) ? metadata.filter((item) => Boolean(item?.label)) : [];
  const normalizedActions = Array.isArray(actions) ? actions.filter((action) => Boolean(action?.label)) : [];
  const resolvedState = resolveState({ state, loading, actions: normalizedActions, metadata: normalizedMetadata });
  const resolvedBackground = resolveBackground(background);
  const disabled = resolvedState === "loading";

  return React.createElement(
    Surface,
    {
      ...surface,
      ...sanitizeRestProps(rest),
      ref,
      className: ["documentation-hero", className].filter(Boolean).join(" "),
      surfaceRole: "section",
      density,
      elevation,
      tone: resolveTone(tone),
      state: disabled ? "disabled" : "default",
      "aria-busy": disabled ? "true" : undefined,
      "data-flow-pattern": "documentation-hero",
      "data-documentation-hero-state": resolvedState,
      "data-documentation-hero-background": resolvedBackground,
    } as ComponentProps<typeof Surface>,
    React.createElement(
      "div",
      { "data-flow-slot": "documentation-hero.copy" },
      kicker ? React.createElement("p", { "data-flow-slot": "documentation-hero.kicker" }, kicker) : null,
      React.createElement(SectionHeader, flowDefinedProps({
        title,
        description,
        headingLevel,
        density,
        loading: disabled,
        "data-flow-slot": "documentation-hero.header",
      }) as ComponentProps<typeof SectionHeader>),
      normalizedMetadata.length
        ? React.createElement(
          "div",
          { "data-flow-slot": "documentation-hero.metadata" },
          normalizedMetadata.map((item, index) => renderMetadata(item, density, disabled, index)),
        )
        : null,
      children ? React.createElement("div", { "data-flow-slot": "documentation-hero.body" }, children) : null,
      normalizedActions.length
        ? React.createElement(
          "div",
          { "data-flow-slot": "documentation-hero.actions" },
          normalizedActions.map((action, index) => renderAction(action, density, disabled, index)),
        )
        : null,
    ),
    visual ? React.createElement("div", { "data-flow-slot": "documentation-hero.visual" }, visual) : null,
  );
}) as DocumentationHeroComponent;

DocumentationHero.displayName = "DocumentationHero";
