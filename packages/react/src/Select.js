import React, { forwardRef, useEffect, useId, useState } from "react";
import { selectPlatformContract } from "@design-system/components/platforms";

function selectedOptionFor(options, value) {
  return options.find((option) => (option.value ?? option.label ?? "") === value)
    ?? options.find((option) => !option.disabled)
    ?? options[0]
    ?? { label: value, value };
}

export const Select = forwardRef(function Select({
  label,
  helper = "",
  icon = "",
  options = [],
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
  const isValueControlled = value !== undefined;
  const [currentValue, setCurrentValue] = useState(value ?? "");
  const [open, setOpen] = useState(state === "open");
  const selectedOption = selectedOptionFor(options, currentValue);
  const selectedValue = selectedOption.value ?? selectedOption.label ?? "";
  const isOpen = open;
  const resolvedState = disabled ? "disabled" : state || "default";
  const activeIndex = Math.max(options.indexOf(selectedOption), 0);
  useEffect(() => {
    if (isValueControlled) setCurrentValue(value ?? "");
  }, [isValueControlled, value]);

  const commitOption = (option) => {
    if (option.disabled) return;
    const optionValue = option.value ?? option.label ?? "";
    if (!isValueControlled) setCurrentValue(optionValue);
    setOpen(false);
    onValueChange?.(optionValue, { label: option.label ?? "", meta: option.meta ?? "" });
  };

  return React.createElement(
    "span",
    {
      className: ["field", className].filter(Boolean).join(" "),
      "data-state": resolvedState,
      "data-density": density || undefined,
      role: "group",
      "aria-labelledby": `${selectId}-label`,
    },
    React.createElement("span", { className: "field__label", id: `${selectId}-label` }, label ?? "Select"),
    React.createElement(
      "span",
      {
        className: ["select-control", variant === "inline" ? "select-control--inline" : ""].filter(Boolean).join(" "),
        "data-open": String(isOpen),
        "data-state": resolvedState,
        "data-density": density || undefined,
        "data-value": selectedValue,
        "data-select-control": "",
      },
      React.createElement(
        "button",
        {
          ...rest,
          ref,
          type: "button",
          className: "select-control__trigger",
          disabled,
          "data-select-trigger": "",
          role: "combobox",
          "aria-expanded": String(isOpen),
          "aria-haspopup": "listbox",
          "aria-controls": `${selectId}-listbox`,
          "aria-label": label ?? "Select",
          "aria-labelledby": `${selectId}-label`,
          "aria-invalid": state === "error" ? "true" : undefined,
          "aria-activedescendant": `${selectId}-option-${activeIndex}`,
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
        React.createElement("span", { className: "select-control__value", "data-select-value-label": "" }, selectedOption.label ?? selectedOption.value ?? ""),
        selectedOption.meta ? React.createElement("span", { className: "select-control__option-code", "data-select-value-meta": "" }, selectedOption.meta) : null,
        React.createElement("span", { className: "select-control__chevron", "aria-hidden": "true" }, "expand_more"),
      ),
      React.createElement(
        "span",
        {
          id: `${selectId}-listbox`,
          className: "select-control__listbox",
          role: "listbox",
          "data-select-listbox": "",
          "aria-label": `${label ?? "Select"} options`,
        },
        options.map((option, index) => {
          const optionValue = option.value ?? option.label ?? "";
          const isSelected = optionValue === selectedValue;
          return React.createElement(
            "span",
            {
              key: optionValue || index,
              id: `${selectId}-option-${index}`,
              className: "select-control__option",
              role: "option",
              tabIndex: -1,
              "aria-selected": String(isSelected),
              "aria-disabled": option.disabled ? "true" : undefined,
              "data-select-option": "",
              "data-selected": String(isSelected),
              "data-value": optionValue,
              "data-label": option.label ?? option.value ?? "",
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
            React.createElement("span", { className: "select-control__option-label" }, option.label ?? option.value ?? ""),
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
