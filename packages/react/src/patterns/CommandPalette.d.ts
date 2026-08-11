import type { ChangeEvent, ForwardRefExoticComponent, MouseEvent, RefAttributes } from "react";
import type { ButtonProps } from "../Button.js";
import type { DialogDensity, DialogOpenChangeEvent } from "../Dialog.js";
import type { EmptyStateAction, EmptyStateVariant } from "../EmptyState.js";
import type { InputValueMeta } from "../Input.js";
import type { MenuItem } from "../Menu.js";
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

export const CommandPalette: CommandPaletteComponent;
