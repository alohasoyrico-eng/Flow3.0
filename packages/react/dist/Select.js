import React, { forwardRef, useEffect, useId, useState } from "react";
import { selectPlatformContract } from "#flow/platforms";
import { flowStateProps, flowDensityProps, flowRestProps } from "./internal/props.js";

function selectedOptionFor(options, value) {
  if (!value) return null;
  return options.find((option) => option.value === value) ?? null;
}

function normalizeOptions(options) {
  return (Array.isArray(options) ? options : []).filter((option) => (
    option?.label && option.value !== undefined && option.value !== null && option.value !== ""
  ));
}

export const Select = forwardRef(function Select({
  label,
  helper = "",
  icon = "",
  options = [],
  optionsLabel,
  value,
  name = "",
  disabled = false,
  density,
  variant = "default",
  state = "default",
  onValueChange,
  className = "",
  id,
  ...rest
}, ref) {
  const generatedId = useId();
  const selectId = id ?? `select-${generatedId}`;
  const normalizedOptions = normalizeOptions(options);
  const isValueControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [open, setOpen] = useState(state === "open");
  const selectedOption = selectedOptionFor(normalizedOptions, currentValue);
  const selectedValue = selectedOption ? selectedOption.value : "";
  const selectedLabel = selectedOption ? selectedOption.label : "";
  const isOpen = open;
  const resolvedState = disabled ? "disabled" : state || "default";
  const activeIndex = Math.max(normalizedOptions.indexOf(selectedOption), 0);
  useEffect(() => {
    if (isValueControlled) setCurrentValue(value ?? "");
  }, [isValueControlled, value]);

  const commitOption = (option) => {
    if (option.disabled) return;
    const optionValue = option.value;
    if (!isValueControlled) setCurrentValue(optionValue);
    setOpen(false);
    onValueChange?.(optionValue, { label: option.label, meta: option.meta ?? "" });
  };

  return React.createElement(
    "span",
    {
      className: ["field", className].filter(Boolean).join(" "),
      ...flowStateProps(resolvedState),
      ...flowDensityProps(density),
      role: "group",
      "aria-labelledby": label ? `${selectId}-label` : undefined,
    },
    label ? React.createElement("span", { className: "field__label", id: `${selectId}-label` }, label) : null,
    React.createElement(
      "span",
      {
        className: ["select-control", variant === "inline" ? "select-control--inline" : ""].filter(Boolean).join(" "),
        "data-open": String(isOpen),
        ...flowStateProps(resolvedState),
        ...flowDensityProps(density),
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
          "aria-label": label ? undefined : rest["aria-label"],
          "aria-labelledby": label ? `${selectId}-label` : undefined,
          "aria-invalid": state === "error" ? "true" : undefined,
          "aria-activedescendant": selectedOption ? `${selectId}-option-${activeIndex}` : undefined,
          onClick: () => setOpen((current) => !current),
          onKeyDown: (event) => {
            if (["ArrowDown", "Enter", " "].includes(event.key)) {
              event.preventDefault();
              setOpen(true);
            }
            if (event.key === "Escape") {
              event.preventDefault();
              setOpen(false);
            }
          },
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
          "aria-labelledby": optionsLabel ? undefined : label ? `${selectId}-label` : undefined,
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
              onClick: option.disabled ? undefined : () => commitOption(option),
              onKeyDown: (event) => {
                if (option.disabled) return;
                if (["Enter", " "].includes(event.key)) {
                  event.preventDefault();
                  commitOption(option);
                }
                if (event.key === "Escape") {
                  event.preventDefault();
                  setOpen(false);
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
});

Select.displayName = "Select";
Select.platformContract = selectPlatformContract;
