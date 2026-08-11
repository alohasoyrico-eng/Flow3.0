import React, { forwardRef } from "react";
import { Button } from "../Button.js";
import { Dialog } from "../Dialog.js";
import { EmptyState } from "../EmptyState.js";
import { Input } from "../Input.js";
import { Menu } from "../Menu.js";
import { Toast } from "../Toast.js";

function sanitizeRestProps(rest) {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-")));
}

function normalizeCommands(commands, executingKey) {
  return (Array.isArray(commands) ? commands : [])
    .filter((command) => command?.label)
    .map((command) => ({
      ...command,
      key: String(command.key ?? command.id ?? command.label),
      disabled: Boolean(command.disabled || executingKey === command.key),
    }));
}

function resolveState({ open, query, loading, executingKey, commands, state }) {
  if (executingKey || state === "executing") return "executing";
  if (loading || state === "loading") return "loading";
  if (!open && !state) return "closed";
  if (!commands.length && query) return "empty";
  if (query && commands.length) return "results";
  if (query) return "querying";
  return state ?? (open ? "open" : "closed");
}

export const CommandPalette = forwardRef(function CommandPalette({
  label = "Command palette",
  description,
  triggerLabel,
  closeLabel = "Close command palette",
  query = "",
  placeholder = "Search commands",
  density,
  state,
  open = false,
  loading = false,
  commands = [],
  selectedKey,
  executingKey,
  empty,
  feedback,
  primaryAction,
  onOpenChange,
  onQueryChange,
  onCommandSelect,
  onPrimaryAction,
  className = "",
  ...rest
}, ref) {
  const normalizedCommands = normalizeCommands(commands, executingKey);
  const resolvedState = resolveState({ open, query, loading, executingKey, commands: normalizedCommands, state });
  const isBusy = resolvedState === "loading" || resolvedState === "executing";
  const menuItems = normalizedCommands.map((command) => ({
    key: command.key,
    label: command.label,
    icon: command.icon,
    shortcut: command.shortcut,
    disabled: command.disabled || isBusy,
    tone: command.tone,
    onClick: command.onClick,
  }));

  return React.createElement(
    "div",
    {
      ref,
      className,
      role: "region",
      "aria-label": label,
      "aria-busy": isBusy ? "true" : undefined,
      "data-flow-pattern": "command-palette",
      "data-state": resolvedState,
      "data-density": density,
      "data-command-count": String(normalizedCommands.length),
      "data-has-query": String(Boolean(query)),
      ...sanitizeRestProps(rest),
    },
    React.createElement(Dialog, {
      label,
      description,
      triggerLabel,
      closeLabel,
      open,
      state: open ? "open" : "closed",
      variant: "review",
      density,
      fields: [{
        label: `${label} query`,
        name: "command-query",
        value: query,
        placeholder,
        variant: "search",
        state: isBusy ? "loading" : query ? "filled" : "default",
        readOnly: true,
      }],
      onOpenChange,
    }),
    React.createElement(Input, {
      label: `${label} query`,
      value: query,
      placeholder,
      variant: "search",
      icon: "search",
      density,
      loading,
      state: isBusy ? "loading" : query ? "filled" : "default",
      onValueChange: onQueryChange,
    }),
    normalizedCommands.length
      ? React.createElement(Menu, {
        triggerLabel: `${label} commands`,
        label: `${label} commands`,
        items: menuItems,
        open: true,
        variant: "actions",
        state: isBusy ? "disabled" : "open",
        density,
        disabled: isBusy,
        onSelect: (item, event) => {
          const command = normalizedCommands.find((candidate) => candidate.key === item.key);
          onCommandSelect?.(command ?? item, event);
        },
      })
      : null,
    !normalizedCommands.length && resolvedState === "empty"
      ? React.createElement(EmptyState, {
        title: empty?.title ?? "No commands",
        description: empty?.description ?? "Try another command name.",
        icon: empty?.icon,
        action: empty?.action,
        variant: empty?.variant ?? "search-empty",
        state: "search-empty",
        density,
        onAction: empty?.onAction,
      })
      : null,
    primaryAction?.label
      ? React.createElement(Button, {
        ...primaryAction,
        label: primaryAction.label,
        variant: primaryAction.variant ?? "primary",
        density: primaryAction.density ?? density,
        disabled: isBusy || primaryAction.disabled,
        loading: primaryAction.loading,
        onClick: (event) => {
          primaryAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onPrimaryAction?.(event);
        },
      })
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        ...feedback,
        label: feedback.label,
        tone: feedback.tone ?? "info",
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
      })
      : null,
  );
});

CommandPalette.displayName = "CommandPalette";
