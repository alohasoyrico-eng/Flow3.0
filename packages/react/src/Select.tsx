import React, {
  type ButtonHTMLAttributes,
  type FocusEvent,
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
import { resolveFieldMessage } from "./internal/field-message.js";

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
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
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

function firstEnabledIndex(options: SelectOption[]): number | null {
  const index = options.findIndex((option) => !option.disabled);
  return index >= 0 ? index : null;
}

function nextEnabledIndex(options: SelectOption[], currentIndex: number | null, direction: 1 | -1): number | null {
  if (!options.length) return null;
  if (currentIndex === null) {
    return direction === 1 ? firstEnabledIndex(options) : lastEnabledIndex(options);
  }
  const startIndex = Math.min(Math.max(currentIndex, 0), options.length - 1);
  for (let offset = 1; offset <= options.length; offset += 1) {
    const index = (startIndex + direction * offset + options.length) % options.length;
    if (!options[index]?.disabled) return index;
  }
  return startIndex;
}

function lastEnabledIndex(options: SelectOption[]): number | null {
  for (let index = options.length - 1; index >= 0; index -= 1) {
    if (!options[index]?.disabled) return index;
  }
  return firstEnabledIndex(options);
}

export const Select = forwardRef<HTMLButtonElement, SelectProps>(function Select({
  label,
  helper = "",
  icon = "",
  options,
  optionsLabel,
  value,
  name = "",
  placeholder = "",
  disabled = false,
  loading = false,
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
  const resolvedState = disabled ? "disabled" : loading || state === "loading" ? "loading" : state || "default";
  const isLoading = resolvedState === "loading";
  const selectedIndex = selectedOption ? Math.max(normalizedOptions.indexOf(selectedOption), 0) : null;
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const resolvedActiveIndex = activeIndex !== null && !normalizedOptions[activeIndex]?.disabled ? activeIndex : null;
  const activeOption = resolvedActiveIndex !== null ? normalizedOptions[resolvedActiveIndex] ?? null : null;
  const fieldMessage = resolveFieldMessage({
    controlId: selectId,
    describedBy: rest["aria-describedby"],
    helper,
    state: resolvedState === "error" ? "error" : resolvedState === "disabled" ? "disabled" : "default",
  });
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
    setActiveIndex(Math.max(normalizedOptions.indexOf(option), 0));
    setOpen(false, event);
    onValueChange?.(optionValue, { label: option.label, meta: option.meta ?? "" }, event);
  };
  const handleTriggerClick = (event: MouseEvent<HTMLButtonElement>): void => {
    rest.onClick?.(event);
    if (event.defaultPrevented) return;
    setOpen(!open, event);
    if (!open) setActiveIndex(null);
  };
  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>): void => {
    rest.onKeyDown?.(event);
    if (event.defaultPrevented) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      setActiveIndex((index) => (isOpen ? nextEnabledIndex(normalizedOptions, index, direction) : direction === 1 ? firstEnabledIndex(normalizedOptions) : lastEnabledIndex(normalizedOptions)));
      setOpen(true, event);
    }
    if (event.key === "Home") {
      event.preventDefault();
      setActiveIndex(firstEnabledIndex(normalizedOptions));
      setOpen(true, event);
    }
    if (event.key === "End") {
      event.preventDefault();
      setActiveIndex(lastEnabledIndex(normalizedOptions));
      setOpen(true, event);
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen && activeOption) {
        commitOption(activeOption, event);
        return;
      }
      setOpen(true, event);
    }
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false, event);
    }
  };
  const handleRootBlur = (event: FocusEvent<HTMLSpanElement>): void => {
    const nextTarget = event.relatedTarget;
    if (nextTarget && event.currentTarget.contains(nextTarget as Node)) return;
    if (!open) return;
    setOpen(false);
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
      onBlur: handleRootBlur,
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
          "aria-describedby": fieldMessage.describedBy,
          "aria-invalid": fieldMessage.invalid ?? rest["aria-invalid"],
          "aria-busy": isLoading ? "true" : undefined,
          "aria-activedescendant": isOpen && activeOption && resolvedActiveIndex !== null ? `${selectId}-option-${resolvedActiveIndex}` : undefined,
          onClick: handleTriggerClick,
          onKeyDown: handleTriggerKeyDown,
        },
        icon || isLoading ? React.createElement("span", { className: "select-control__icon", "aria-hidden": "true" }, isLoading ? "progress_activity" : icon) : null,
        selectedLabel
          ? React.createElement("span", { className: "select-control__value", "data-select-value-label": "" }, selectedLabel)
          : placeholder
            ? React.createElement("span", { className: "select-control__value select-control__placeholder", "data-select-placeholder": "" }, placeholder)
            : null,
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
          const isActive = resolvedActiveIndex !== null && index === resolvedActiveIndex;
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
              "data-active": String(isActive),
              "data-value": optionValue,
              "data-label": option.label,
              "data-meta": option.meta || undefined,
              "data-disabled": option.disabled ? "true" : undefined,
              onMouseDown: (event: MouseEvent<HTMLSpanElement>) => event.preventDefault(),
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
            React.createElement("span", { className: "select-control__option-check", "aria-hidden": "true" }, isSelected ? "check" : ""),
          );
        }),
      ),
      name ? React.createElement("input", { type: "hidden", name, value: selectedValue, "data-select-input": "", readOnly: true }) : null,
    ),
    fieldMessage.message ? React.createElement("span", { className: "field__helper", id: fieldMessage.messageId, role: fieldMessage.role, ...flowStateProps(fieldMessage.state) }, fieldMessage.message) : null,
  );
}) as SelectComponent;

Select.displayName = "Select";
Select.platformContract = selectPlatformContract;
