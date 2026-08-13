import React, { forwardRef } from "react";
import type { ComponentProps, ForwardRefExoticComponent, RefAttributes } from "react";
import { Badge } from "../Badge.js";
import type { BadgeProps } from "../Badge.js";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Menu } from "../Menu.js";
import type { MenuProps } from "../Menu.js";
import { Skeleton } from "../Skeleton.js";
import type { SkeletonDensity } from "../Skeleton.js";
import { Tag } from "../Tag.js";
import type { TagProps } from "../Tag.js";
import type { FlowDataAttributes } from "../internal/props.js";
import { FormSection } from "./FormSection.js";
import type { FormSectionProps } from "./FormSection.js";
import { Settings } from "./Settings.js";
import type { SettingsProps } from "./Settings.js";
import { Toolbar } from "./Toolbar.js";
import type { ToolbarProps } from "./Toolbar.js";

export type SectionHeaderState = "default" | "loading" | "actionable" | "disabled" | "permission-blocked" | "dirty";
export type SectionHeaderDensity = SkeletonDensity;
export type SectionHeaderHeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type SectionHeaderAction = ButtonProps & { key?: string };
export interface SectionHeaderOverflow extends Pick<
  MenuProps,
  "triggerLabel" | "label" | "items" | "open" | "variant" | "align" | "disabled" | "onOpenChange" | "onSelect"
> {}

export interface SectionHeaderProps extends FlowDataAttributes {
  title: string;
  description?: string;
  headingLevel?: SectionHeaderHeadingLevel;
  density?: SectionHeaderDensity;
  state?: SectionHeaderState;
  loading?: boolean;
  disabled?: boolean;
  dirty?: boolean;
  permissionBlocked?: boolean;
  badge?: BadgeProps;
  tag?: TagProps;
  actions?: SectionHeaderAction[];
  overflow?: SectionHeaderOverflow;
  toolbar?: ToolbarProps;
  settings?: SettingsProps;
  formSection?: FormSectionProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface SectionHeaderComponent extends ForwardRefExoticComponent<SectionHeaderProps & RefAttributes<HTMLDivElement>> {
  displayName: "SectionHeader";
}

type SectionHeaderRestProps = Record<string, unknown>;

function sanitizeRestProps(rest: SectionHeaderRestProps): FlowDataAttributes & Record<`aria-${string}`, unknown> {
  return Object.fromEntries(
    Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")),
  ) as FlowDataAttributes & Record<`aria-${string}`, unknown>;
}

function headingTag(level: SectionHeaderHeadingLevel | undefined): `h${SectionHeaderHeadingLevel}` {
  const numeric = Number(level);
  if (numeric >= 1 && numeric <= 6) return `h${numeric}` as `h${SectionHeaderHeadingLevel}`;
  return "h2";
}

interface SectionHeaderStateInput {
  disabled?: boolean | undefined;
  permissionBlocked?: boolean | undefined;
  loading?: boolean | undefined;
  dirty?: boolean | undefined;
  actions?: SectionHeaderAction[] | undefined;
  state?: SectionHeaderState | undefined;
}

function resolveState({ disabled, permissionBlocked, loading, dirty, actions, state }: SectionHeaderStateInput): SectionHeaderState {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (dirty || state === "dirty") return "dirty";
  if ((actions?.length ?? 0) > 0 || state === "actionable") return "actionable";
  return state ?? "default";
}

function isAction(action: SectionHeaderAction | null | undefined): action is SectionHeaderAction {
  return Boolean(action?.label);
}

export const SectionHeader = forwardRef<HTMLDivElement, SectionHeaderProps>(function SectionHeader({
  title,
  description,
  headingLevel = 2,
  density,
  state,
  loading = false,
  disabled = false,
  dirty = false,
  permissionBlocked = false,
  badge,
  tag,
  actions = [],
  overflow,
  toolbar,
  settings,
  formSection,
  className = "",
  ...rest
}, ref) {
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter(isAction);
  const resolvedState = resolveState({
    disabled,
    permissionBlocked,
    loading,
    dirty,
    actions: normalizedActions,
    state,
  });
  const isDisabled = disabled || resolvedState === "disabled" || resolvedState === "loading" || resolvedState === "permission-blocked";
  const Heading = headingTag(headingLevel);

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "group",
      "aria-label": title,
      "aria-busy": resolvedState === "loading" ? "true" : undefined,
      "data-flow-pattern": "section-header",
      "data-state": resolvedState,
      "data-density": density,
      "data-action-count": String(normalizedActions.length),
      ...sanitizeRestProps(rest),
    },
    loading
      ? React.createElement(Skeleton, {
        label: `${title ?? "Section"} loading`,
        variant: "title",
        density,
        state: "loading",
        fullWidth: true,
      } as ComponentProps<typeof Skeleton>)
      : React.createElement(Heading, null, title),
    description ? React.createElement("p", null, description) : null,
    badge
      ? React.createElement(Badge, {
        ...badge,
        label: badge.label,
        density: badge.density ?? density,
        state: isDisabled ? "disabled" : badge.state,
        live: badge.live ?? true,
      } as ComponentProps<typeof Badge>)
      : null,
    tag
      ? React.createElement(Tag, {
        ...tag,
        label: tag.label,
        density: tag.density ?? density,
        state: isDisabled ? "disabled" : tag.state,
      } as ComponentProps<typeof Tag>)
      : null,
    dirty
      ? React.createElement(Badge, {
        label: "Unsaved changes",
        tone: "warning",
        variant: "status",
        density,
        state: isDisabled ? "disabled" : "default",
        live: true,
      } as ComponentProps<typeof Badge>)
      : null,
    permissionBlocked
      ? React.createElement(Tag, {
        label: "Permission blocked",
        tone: "warning",
        density,
        state: "disabled",
      } as ComponentProps<typeof Tag>)
      : null,
    normalizedActions.map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: loading || action.loading,
    } as ComponentProps<typeof Button> & { key: string })),
    overflow?.items?.length
      ? React.createElement(Menu, {
        triggerLabel: overflow.triggerLabel ?? "More section actions",
        label: overflow.label ?? "Section actions",
        items: overflow.items,
        open: overflow.open,
        variant: overflow.variant ?? "actions",
        density,
        state: isDisabled ? "disabled" : overflow.open ? "open" : "closed",
        align: overflow.align ?? "end",
        disabled: isDisabled || overflow.disabled,
        onOpenChange: overflow.onOpenChange,
        onSelect: overflow.onSelect,
      } as ComponentProps<typeof Menu>)
      : null,
    toolbar
      ? React.createElement(Toolbar, {
        ...toolbar,
        density: toolbar.density ?? density,
      } as ComponentProps<typeof Toolbar>)
      : null,
    settings
      ? React.createElement(Settings, {
        ...settings,
        density: settings.density ?? density,
      } as ComponentProps<typeof Settings>)
      : null,
    formSection
      ? React.createElement(FormSection, {
        ...formSection,
        density: formSection.density ?? density,
      } as ComponentProps<typeof FormSection>)
      : null,
  );
}) as SectionHeaderComponent;

SectionHeader.displayName = "SectionHeader";
