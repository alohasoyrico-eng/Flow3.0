import React, {
  type ChangeEvent,
  type ForwardRefExoticComponent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
} from "react";
import { Button } from "../Button.js";
import type { ButtonProps } from "../Button.js";
import { Dialog } from "../Dialog.js";
import type { DialogDensity, DialogOpenChangeEvent, DialogProps } from "../Dialog.js";
import { EmptyState } from "../EmptyState.js";
import type { EmptyStateAction, EmptyStateProps, EmptyStateVariant } from "../EmptyState.js";
import { Input } from "../Input.js";
import type { InputProps, InputValueMeta } from "../Input.js";
import { Menu } from "../Menu.js";
import type { MenuItem, MenuProps } from "../Menu.js";
import { Surface } from "../Surface.js";
import { Toast } from "../Toast.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";

export type CommandPaletteState = "closed" | "open" | "querying" | "results" | "empty" | "loading" | "disabled-command" | "executing";
export type CommandPaletteDensity = DialogDensity;

export interface CommandPaletteCommand extends Omit<MenuItem, "key"> {
  key?: string;
  id?: string;
  group?: string;
  reason?: string;
}

export interface CommandPaletteEmptyState {
  title?: string;
  description?: string;
  icon?: string;
  action?: EmptyStateAction;
  variant?: EmptyStateVariant;
  onAction?: (key: string, event: MouseEvent<HTMLButtonElement>) => void;
}

export interface CommandPaletteAction extends Omit<ButtonProps, "children" | "fullWidth"> {
  label: string;
}

export interface CommandPaletteProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  triggerLabel?: string;
  closeLabel?: string;
  query?: string;
  placeholder?: string;
  density?: CommandPaletteDensity;
  state?: CommandPaletteState;
  open?: boolean;
  loading?: boolean;
  commands?: CommandPaletteCommand[];
  selectedKey?: string;
  executingKey?: string;
  empty?: CommandPaletteEmptyState;
  feedback?: ToastProps;
  primaryAction?: CommandPaletteAction;
  onOpenChange?: (open: boolean, event?: DialogOpenChangeEvent) => void;
  onQueryChange?: (value: string, meta: InputValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
  onCommandSelect?: (command: CommandPaletteCommand | MenuItem, event: MouseEvent<HTMLButtonElement>) => void;
  onPrimaryAction?: (event: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface CommandPaletteComponent extends ForwardRefExoticComponent<CommandPaletteProps & RefAttributes<HTMLDivElement>> {
  displayName: "CommandPalette";
}

type SafeRootProps = {
  [key: `data-${string}`]: string | number | boolean | undefined;
  [key: `aria-${string}`]: string | number | boolean | undefined;
};

type NormalizedCommand = CommandPaletteCommand & {
  key: string;
  disabled: boolean;
};

function sanitizeRestProps(rest: Record<string, unknown>): SafeRootProps {
  return Object.fromEntries(Object.entries(rest).filter(([key]) => key.startsWith("data-") || key.startsWith("aria-"))) as SafeRootProps;
}

function normalizeCommands(commands: CommandPaletteCommand[] | undefined, executingKey: string | undefined): NormalizedCommand[] {
  return (Array.isArray(commands) ? commands : [])
    .filter((command): command is CommandPaletteCommand => Boolean(command?.label))
    .map((command): NormalizedCommand => {
      const key = String(command.key ?? command.id ?? command.label);
      return {
        ...command,
        key,
        disabled: Boolean(command.disabled || executingKey === command.key),
      };
    });
}

function resolveState({
  open,
  query,
  loading,
  executingKey,
  commands,
  state,
}: {
  open: boolean;
  query: string;
  loading: boolean;
  executingKey: string | undefined;
  commands: NormalizedCommand[];
  state: CommandPaletteState | undefined;
}): CommandPaletteState {
  if (executingKey || state === "executing") return "executing";
  if (loading || state === "loading") return "loading";
  if (!open && !state) return "closed";
  if (!commands.length && query) return "empty";
  if (query && commands.length) return "results";
  if (query) return "querying";
  return state ?? (open ? "open" : "closed");
}

export const CommandPalette = forwardRef<HTMLDivElement, CommandPaletteProps>(function CommandPalette({
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
  const menuItems = normalizedCommands.map((command): MenuItem => ({
    key: command.key,
    label: command.label,
    ...(command.icon !== undefined ? { icon: command.icon } : {}),
    ...(command.shortcut !== undefined ? { shortcut: command.shortcut } : {}),
    disabled: command.disabled || isBusy,
    ...(command.tone !== undefined ? { tone: command.tone } : {}),
    ...(command.onClick !== undefined ? { onClick: command.onClick } : {}),
  }));

  return React.createElement(
    Surface,
    {
      ref,
      className,
      surfaceRole: "overlay",
      elevation: "overlay",
      focusMode: open ? "within" : "none",
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
    } as DialogProps),
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
    } as InputProps),
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
      } as MenuProps)
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
      } as EmptyStateProps)
      : null,
    primaryAction?.label
      ? React.createElement(Button, {
        ...primaryAction,
        label: primaryAction.label,
        variant: primaryAction.variant ?? "primary",
        density: primaryAction.density ?? density,
        disabled: isBusy || primaryAction.disabled,
        loading: primaryAction.loading,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          primaryAction.onClick?.(event);
          if (event.defaultPrevented) return;
          onPrimaryAction?.(event);
        },
      } as ButtonProps)
      : null,
    feedback?.label
      ? React.createElement(Toast, {
        ...feedback,
        label: feedback.label,
        tone: feedback.tone ?? "info",
        variant: feedback.variant ?? "status",
        state: feedback.state ?? "visible",
        density: feedback.density ?? density,
      } as ToastProps)
      : null,
  );
}) as CommandPaletteComponent;

CommandPalette.displayName = "CommandPalette";
