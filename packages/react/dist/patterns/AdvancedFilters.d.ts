import type { ForwardRefExoticComponent, RefAttributes } from "react";
import type { BadgeDensity } from "../Badge.js";
import type { ButtonProps } from "../Button.js";
import type { ChipProps } from "../Chip.js";
import type { DateRangePickerProps } from "../DateRangePicker.js";
import type { DrawerProps } from "../Drawer.js";
import type { InlineValidationProps } from "../InlineValidation.js";
import type { InputProps } from "../Input.js";
import type { MenuProps } from "../Menu.js";
import type { SelectProps } from "../Select.js";
import type { ToastProps } from "../Toast.js";
import type { FlowDataAttributes } from "../internal/props.js";
import type { ToolbarProps } from "./Toolbar.js";

export type AdvancedFiltersState = "closed" | "open" | "editing" | "dirty" | "applying" | "applied" | "invalid" | "disabled";
export type AdvancedFiltersDensity = BadgeDensity;
export type AdvancedFiltersFieldKind = "input" | "select" | "date-range";

export type AdvancedFiltersInputField = Partial<Pick<InputProps, "helper" | "value" | "placeholder" | "error" | "variant" | "icon" | "loading" | "state" | "disabled" | "onValueChange">> & {
  key?: string;
  name?: string;
  kind?: "input";
  label: string;
};

export type AdvancedFiltersSelectField = Partial<Pick<SelectProps, "helper" | "options" | "value" | "open" | "state" | "disabled" | "onValueChange" | "onOpenChange">> & {
  key?: string;
  name?: string;
  kind: "select";
  label: string;
};

export type AdvancedFiltersDateRangeField = Partial<Pick<DateRangePickerProps, "value" | "from" | "to" | "placeholder" | "helper" | "error" | "disabled" | "open" | "invalid" | "presets" | "presetItems" | "state" | "onValueChange" | "onOpenChange">> & {
  key?: string;
  name?: string;
  kind: "date-range";
  label: string;
};

export type AdvancedFiltersField = AdvancedFiltersInputField | AdvancedFiltersSelectField | AdvancedFiltersDateRangeField;
export type AdvancedFiltersAppliedFilter = ChipProps & { key?: string };
export interface AdvancedFiltersMenu extends Pick<MenuProps, "triggerLabel" | "label" | "items" | "open" | "variant" | "align" | "disabled" | "onOpenChange" | "onSelect"> {}
export interface AdvancedFiltersDrawer extends Pick<DrawerProps, "triggerLabel" | "closeLabel" | "side" | "fields" | "content" | "actions" | "onOpenChange" | "onAction"> {}
export interface AdvancedFiltersValidation extends Pick<InlineValidationProps, "label" | "message" | "value" | "state"> {}

export interface AdvancedFiltersProps extends FlowDataAttributes {
  label?: string;
  description?: string;
  density?: AdvancedFiltersDensity;
  state?: AdvancedFiltersState;
  open?: boolean;
  disabled?: boolean;
  dirty?: boolean;
  applying?: boolean;
  fields?: AdvancedFiltersField[];
  appliedFilters?: AdvancedFiltersAppliedFilter[];
  validation?: AdvancedFiltersValidation;
  applyAction?: ButtonProps;
  resetAction?: ButtonProps;
  savedViews?: AdvancedFiltersMenu;
  drawer?: AdvancedFiltersDrawer;
  overflow?: AdvancedFiltersMenu;
  feedback?: ToastProps;
  toolbar?: ToolbarProps;
  className?: string;
  "aria-label"?: string;
  "aria-describedby"?: string;
  "aria-labelledby"?: string;
}

export interface AdvancedFiltersComponent extends ForwardRefExoticComponent<AdvancedFiltersProps & RefAttributes<HTMLDivElement>> {
  displayName: "AdvancedFilters";
}

export const AdvancedFilters: AdvancedFiltersComponent;
