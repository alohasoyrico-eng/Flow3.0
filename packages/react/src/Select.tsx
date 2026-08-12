import React, {
  type ButtonHTMLAttributes,
  type ForwardRefExoticComponent,
  type KeyboardEvent,
  type MouseEvent,
  type RefAttributes,
  forwardRef,
  useId,
  useState,
} from "react";
import { selectPlatformContract } from "@design-system/components/platforms";
import {
  type FlowDataAttributes,
  flowStateProps,
  flowDensityProps,
  flowRestProps,
  flowDataProps,
  normalizeFlowDensity,
} from "./internal/props.js";

export type SelectDensity = "sm" | "md" | "lg";
export type SelectVariant = "default" | "inline";
export type SelectState = "default" | "open" | "focus" | "filled" | "loading" | "error" | "disabled";

export type SelectOption = {
  label: string;
  value?: string;
  meta?: string;
  disabled?: boolean;
};

export type SelectValueMeta = {
  label: string;
  meta: string;
};

export type SelectValueChangeEvent = MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>;
export type SelectOpenChangeEvent =
  | MouseEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLButtonElement>
  | KeyboardEvent<HTMLSpanElement>
  | MouseEvent<HTMLSpanElement>;

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "style" | "disabled" | "value" | "onChange" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  helper?: string;
  icon?: string;
  options: SelectOption[];
  optionsLabel?: string;
  value?: string;
  name?: string;
  disabled?: boolean;
  density?: SelectDensity;
  variant?: SelectVariant;
  state?: SelectState;
  open?: boolean;
  onValueChange?: (value: string, meta: SelectValueMeta, event: SelectValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: SelectOpenChangeEvent) => void;
}

export interface SelectComponent extends ForwardRefExoticComponent<SelectProps & RefAttributes<HTMLButtonElement>> {
  displayName: "Select";
  platformContract: typeof selectPlatformContract;
}

function selectedOptionFor(options: SelectOption[], value: string): SelectOption | null {
  if (!value) return null;
  return options.find((option) => option.value === value) ?? null;
}

function normalizeOptions(options: SelectOption[] | undefined): SelectOption[] {
  return (Array.isArray(options) ? options : []).filter((option) => (
    option?.label && option.value !== undefined && option.value !== null && option.value !== ""
  ));
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({
  label,
  helper = "",
  icon = "",
  options,
  optionsLabel,
  value,
  name = "",
  disabled = false,
  density,
  variant = "default",
  state = "default",
  open: openProp,
  onValueChange,
  onOpenChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const selectId = id ?? `select-${generatedId}`;
  const normalizedOptions = normalizeOptions(options);
  const isValueControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<string>(value ?? "");
  const currentValue = isValueControlled ? value ?? "" : internalValue;
  const isOpenControlled = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState<boolean>(state === "open");
  const open = isOpenControlled ? Boolean(openProp) : internalOpen;
  const selectedOption = selectedOptionFor(normalizedOptions, currentValue);
  const selectedValue = selectedOption ? selectedOption.value : "";
  const selectedLabel = selectedOption ? selectedOption.label : "";
  const isOpen = open;
  const resolvedState = disabled ? "disabled" : state || "default";
  const activeIndex = selectedOption ? Math.max(normalizedOptions.indexOf(selectedOption), 0) : 0;
  if (!label || !normalizedOptions.length) return null;

  const setOpen = (nextOpen: boolean, event?: SelectOpenChangeEvent): void => {
    if (disabled) return;
    const normalizedOpen = Boolean(nextOpen);
    if (!isOpenControlled) setInternalOpen(normalizedOpen);
    onOpenChange?.(normalizedOpen, event);
  };

  const commitOption = (option: SelectOption, event: SelectValueChangeEvent): void => {
    if (option.disabled) return;
    const optionValue = option.value ?? "";
    if (!isValueControlled) setInternalValue(optionValue);
    setOpen(false, event);
    onValueChange?.(optionValue, { label: option.label, meta: option.meta ?? "" }, event);
  };
  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>): void => {
    rest.onClick?.(event);
    if (event.defaultPrevented) return;
    setOpen(!open, event);
  };
  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    rest.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      setOpen(true, event);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, event);
    }
  };
  const resolvedDensity = normalizeFlowDensity(density);

  return React.createElement(
    "span",
    {
      className: ["field", className].filter(Boolean).join(" "),
      ...flowDataProps(rest),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(resolvedDensity),
      role: "group",
      "aria-labelledby": `${selectId}-label`,
    },
    React.createElement("span", { className: "field__label", id: `${selectId}-label` }, label),
    React.createElement(
      "span",
      {
        className: ["select-control", variant === "inline" ? "select-control--inline" : ""].filter(Boolean).join(" "),
        "data-open": String(isOpen),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(resolvedDensity),
        "data-value": selectedValue,
        "data-select-control": "",
      },
      React.createElement(
        "button",
        {
          ...flowRestProps(rest),
          ref,
          type: "button",
          className: "select-control__trigger",
          disabled,
          "data-select-trigger": "",
          role: "combobox",
          "aria-expanded": String(isOpen),
          "aria-haspopup": "listbox",
          "aria-controls": `${selectId}-listbox`,
          "aria-labelledby": `${selectId}-label`,
          "aria-invalid": state === "error" ? "true" : undefined,
          "aria-activedescendant": selectedOption ? `${selectId}-option-${activeIndex}` : undefined,
          onClick: handleTriggerClick,
          onKeyDown: handleTriggerKeyDown,
        },
        icon ? React.createElement("span", { className: "select-control__icon", "aria-hidden": "true" }, icon) : null,
        selectedLabel ? React.createElement("span", { className: "select-control__value", "data-select-value-label": "" }, selectedLabel) : null,
        selectedOption?.meta ? React.createElement("span", { className: "select-control__option-code", "data-select-value-meta": "" }, selectedOption.meta) : null,
        React.createElement("span", { className: "select-control__chevron", "aria-hidden": "true" }, "expand_more"),
      ),
      React.createElement(
        "span",
        {
          id: `${selectId}-listbox`,
          className: "select-control__listbox",
          role: "listbox",
          "data-select-listbox": "",
          "aria-label": optionsLabel,
          "aria-labelledby": optionsLabel ? undefined : `${selectId}-label`,
        },
        normalizedOptions.map((option, index) => {
          const optionValue = option.value;
          const isSelected = optionValue === selectedValue;
          return React.createElement(
            "span",
            {
              key: optionValue,
              id: `${selectId}-option-${index}`,
              className: "select-control__option",
              role: "option",
              tabIndex: -1,
              "aria-selected": String(isSelected),
              "aria-disabled": option.disabled ? "true" : undefined,
              "data-select-option": "",
              "data-selected": String(isSelected),
              "data-value": optionValue,
              "data-label": option.label,
              "data-meta": option.meta || undefined,
              "data-disabled": option.disabled ? "true" : undefined,
              onClick: option.disabled ? undefined : (event: MouseEvent<HTMLSpanElement>) => commitOption(option, event),
              onKeyDown: (event: KeyboardEvent<HTMLSpanElement>) => {
                if (option.disabled) return;
                if (["Enter", " "].includes(event.key)) {
                  event.preventDefault();
                  commitOption(option, event);
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setOpen(false, event);
                }
              },
            },
            React.createElement("span", { className: "select-control__option-label" }, option.label),
            option.meta ? React.createElement("span", { className: "select-control__option-code" }, option.meta) : null,
          );
        }),
      ),
      name ? React.createElement("input", { type: "hidden", name, value: selectedValue, "data-select-input": "", readOnly: true }) : null,
    ),
    helper ? React.createElement("span", { className: "field__helper", id: `${selectId}-helper` }, helper) : null,
  );
}) as SelectComponent;

Select.displayName = "Select";
Select.platformContract = selectPlatformContract;
