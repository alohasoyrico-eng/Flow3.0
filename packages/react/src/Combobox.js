import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import { comboboxPlatformContract } from "@design-system/components/platforms";
import { flowStateProps, flowDensityProps, flowRestProps } from "./internal/props.js";

function optionValue(option) {
  return option.value ?? option.label ?? "";
}

function optionLabel(option) {
  return option.label ?? option.value ?? "";
}

function selectedOptionFor(options, value) {
  return options.find((option) => optionValue(option) === value) ?? null;
}

function normalizedState({ disabled, state, currentValue, visibleCount }) {
  if (disabled) return "disabled";
  if (state === "error") return "error";
  if (state === "open" || state === "focus") return state;
  if (visibleCount === 0 && currentValue) return "empty";
  return state ?? (currentValue ? "filled" : "default");
}

export const Combobox = forwardRef(function Combobox({
  label,
  helper = "",
  icon = "search",
  options = [],
  value,
  name = "",
  placeholder = "",
  emptyText = "",
  disabled = false,
  density,
  state,
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const comboboxId = id ?? `combobox-${generatedId}`;
  const isValueControlled = value !== undefined;
  const initialValue = value ?? "";
  const initialOption = selectedOptionFor(options, initialValue);
  const [currentValue, setCurrentValue] = useState(initialValue);
  const [inputValue, setInputValue] = useState(initialOption ? optionLabel(initialOption) : initialValue);
  const [open, setOpen] = useState(state === "open");
  const [activeIndex, setActiveIndex] = useState(0);
  const query = inputValue.trim().toLowerCase();
  const filteredOptions = useMemo(
    () => options.filter((option) => {
      const haystack = `${optionLabel(option)} ${option.meta ?? ""}`.toLowerCase();
      return !query || haystack.includes(query);
    }),
    [options, query],
  );
  const enabledOptions = filteredOptions.filter((option) => !option.disabled);
  const activeOption = enabledOptions[activeIndex] ?? enabledOptions[0] ?? null;
  const resolvedState = normalizedState({ disabled, state, currentValue: inputValue, visibleCount: filteredOptions.length });
  const isOpen = Boolean(open) && !disabled;
  const selectedOption = selectedOptionFor(options, currentValue);
  const selectedValue = selectedOption ? optionValue(selectedOption) : currentValue;

  useEffect(() => {
    if (!isValueControlled) return;
    const nextOption = selectedOptionFor(options, value);
    setCurrentValue(value ?? "");
    setInputValue(nextOption ? optionLabel(nextOption) : value ?? "");
    setActiveIndex(0);
  }, [isValueControlled, options, value]);

  const commitOption = (option) => {
    if (!option || option.disabled) return;
    const nextValue = optionValue(option);
    const nextLabel = optionLabel(option);
    if (!isValueControlled) setCurrentValue(nextValue);
    setInputValue(nextLabel);
    setOpen(false);
    setActiveIndex(0);
    onValueChange?.(nextValue, { label: nextLabel, meta: option.meta ?? "", inputValue: nextLabel });
  };

  const clearValue = () => {
    if (!isValueControlled) setCurrentValue("");
    setInputValue("");
    setOpen(true);
    setActiveIndex(0);
    onValueChange?.("", { label: "", meta: "", inputValue: "", cleared: true });
  };

  return React.createElement(
    "label",
    {
      className: ["field", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
    },
    React.createElement("span", { className: "field__label", id: `${comboboxId}-label` }, label ?? "Combobox"),
    React.createElement(
      "span",
      {
        className: "combobox",
        "data-open": String(isOpen),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(density),
        "data-value": selectedValue,
        "data-combobox-control": "",
      },
      icon ? React.createElement("span", { className: "field__icon combobox__icon", "aria-hidden": "true" }, icon) : null,
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        id: comboboxId,
        className: "input combobox__input",
        name,
        type: "text",
        value: inputValue,
        placeholder,
        disabled,
        autoComplete: "off",
        spellCheck: false,
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-expanded": String(isOpen),
        "aria-haspopup": "listbox",
        "aria-controls": `${comboboxId}-listbox`,
        "aria-labelledby": `${comboboxId}-label`,
        "aria-invalid": resolvedState === "error" ? "true" : undefined,
        "aria-activedescendant": isOpen && activeOption ? `${comboboxId}-option-${options.indexOf(activeOption)}` : undefined,
        onFocus: () => setOpen(true),
        onChange: (event) => {
          const nextValue = event.target.value;
          setInputValue(nextValue);
          if (!isValueControlled) setCurrentValue(nextValue);
          setOpen(true);
          setActiveIndex(0);
          onValueChange?.(nextValue, { label: nextValue, meta: "", inputValue: nextValue });
        },
        onKeyDown: (event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => Math.min(enabledOptions.length - 1, index + 1));
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setOpen(true);
            setActiveIndex((index) => Math.max(0, index - 1));
          }
          if (event.key === "Enter") {
            event.preventDefault();
            commitOption(activeOption);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            setOpen(false);
          }
        },
      }),
      React.createElement(
        "button",
        {
          className: "field-action field__action combobox__clear",
          type: "button",
          disabled: disabled || !inputValue,
          "aria-label": "Clear selection",
          "data-field-action": "clear",
          "data-combobox-clear": "",
          onClick: clearValue,
        },
        React.createElement("span", { className: "field-action__icon", "aria-hidden": "true" }, "close"),
      ),
      React.createElement("span", { className: "select-control__chevron combobox__chevron", "aria-hidden": "true" }, "expand_more"),
      React.createElement(
        "span",
        {
          id: `${comboboxId}-listbox`,
          className: "select-control__listbox combobox__listbox",
          role: "listbox",
          "data-combobox-listbox": "",
          "aria-label": `${label ?? "Combobox"} options`,
        },
        filteredOptions.map((option) => {
          const valueKey = optionValue(option);
          const isSelected = valueKey === selectedValue;
          const index = options.indexOf(option);
          return React.createElement(
            "span",
            {
              key: valueKey || index,
              id: `${comboboxId}-option-${index}`,
              className: "select-control__option combobox__option",
              role: "option",
              tabIndex: -1,
              "aria-selected": String(isSelected),
              "aria-disabled": option.disabled ? "true" : undefined,
              "data-combobox-option": "",
              "data-selected": String(isSelected),
              "data-value": valueKey,
              "data-label": optionLabel(option),
              "data-meta": option.meta || undefined,
              "data-disabled": option.disabled ? "true" : undefined,
              onMouseDown: (event) => event.preventDefault(),
              onClick: option.disabled ? undefined : () => commitOption(option),
            },
            React.createElement("span", { className: "select-control__option-label combobox__option-label" }, optionLabel(option)),
            option.meta ? React.createElement("span", { className: "select-control__option-code combobox__option-meta" }, option.meta) : null,
          );
        }),
        React.createElement("span", { className: "combobox__empty", "data-combobox-empty": "", role: "status", hidden: filteredOptions.length > 0 }, emptyText),
      ),
    ),
    helper ? React.createElement("span", { className: "field__helper", id: `${comboboxId}-helper` }, helper) : null,
  );
});

Combobox.displayName = "Combobox";
Combobox.platformContract = comboboxPlatformContract;
