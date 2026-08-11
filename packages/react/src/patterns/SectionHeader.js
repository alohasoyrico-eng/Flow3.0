import React, { forwardRef } from "react";
import { Badge } from "../Badge.js";
import { Button } from "../Button.js";
import { Menu } from "../Menu.js";
import { Skeleton } from "../Skeleton.js";
import { Tag } from "../Tag.js";
import { FormSection } from "./FormSection.js";
import { Settings } from "./Settings.js";
import { Toolbar } from "./Toolbar.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function headingTag(level) {
  const numeric = Number(level);
  if (numeric >= 1 && numeric <= 6) return `h${numeric}`;
  return "h2";
}

function resolveState({ disabled, permissionBlocked, loading, dirty, actions, state }) {
  if (disabled || state === "disabled") return "disabled";
  if (permissionBlocked || state === "permission-blocked") return "permission-blocked";
  if (loading || state === "loading") return "loading";
  if (dirty || state === "dirty") return "dirty";
  if ((actions?.length ?? 0) > 0 || state === "actionable") return "actionable";
  return state ?? "default";
}

export const SectionHeader = forwardRef(function SectionHeader({
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
  const normalizedActions = (Array.isArray(actions) ? actions : []).filter((action) => action?.label);
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
      })
      : React.createElement(Heading, null, title),
    description ? React.createElement("p", null, description) : null,
    badge
      ? React.createElement(Badge, {
        ...badge,
        label: badge.label,
        density: badge.density ?? density,
        state: isDisabled ? "disabled" : badge.state,
        live: badge.live ?? true,
      })
      : null,
    tag
      ? React.createElement(Tag, {
        ...tag,
        label: tag.label,
        density: tag.density ?? density,
        state: isDisabled ? "disabled" : tag.state,
      })
      : null,
    dirty
      ? React.createElement(Badge, {
        label: "Unsaved changes",
	        tone: "warning",
	        variant: "status",
	        density,
	        state: isDisabled ? "disabled" : "default",
	        live: true,
	      })
      : null,
    permissionBlocked
      ? React.createElement(Tag, {
        label: "Permission blocked",
        tone: "warning",
        density,
        state: "disabled",
      })
      : null,
    normalizedActions.map((action) => React.createElement(Button, {
      ...action,
      key: action.key ?? action.label,
      label: action.label,
      variant: action.variant ?? "secondary",
      density: action.density ?? density,
      disabled: isDisabled || action.disabled,
      loading: loading || action.loading,
    })),
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
      })
      : null,
    toolbar
      ? React.createElement(Toolbar, {
        ...toolbar,
        density: toolbar.density ?? density,
      })
      : null,
    settings
      ? React.createElement(Settings, {
        ...settings,
        density: settings.density ?? density,
      })
      : null,
    formSection
      ? React.createElement(FormSection, {
        ...formSection,
        density: formSection.density ?? density,
      })
      : null,
  );
});

SectionHeader.displayName = "SectionHeader";
