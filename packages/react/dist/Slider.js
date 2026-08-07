import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { sliderPlatformContract } from "#flow/platforms";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps } from "./internal/props.js";

const allowedVariants = new Set(["continuous", "stepped", "bounded", "threshold", "paired-value"]);
const allowedStates = new Set(["default", "focus", "dragging", "disabled", "error", "complete"]);

function clampValue(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return Number(min);
  return Math.min(Number(max), Math.max(Number(min), number));
}

function percentFor(value, min, max) {
  const range = Number(max) - Number(min);
  if (!range) return 0;
  return Math.round(Math.min(100, Math.max(0, ((Number(value) - Number(min)) / range) * 100)));
}

function normalizeState({ disabled, state, dragging }) {
  if (disabled) return "disabled";
  if (dragging) return "dragging";
  return allowedStates.has(state) ? state : "default";
}

function formatSliderValue({ value, initialValue, valueLabel, unit, formatValue }) {
  if (typeof formatValue === "function") return formatValue(Number(value));
  if (valueLabel && String(value) === String(initialValue)) return valueLabel;
  return `${value}${unit}`;
}

export const Slider = forwardRef(function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  variant = "continuous",
  state = "default",
  density,
  unit = "",
  disabled = false,
  name = "",
  valueLabel = "",
  formatValue,
  onValueChange,
  className = "",
  ...rest
}, ref) {
  const isValueControlled = value !== undefined;
  const initialValueRef = useRef(value ?? min);
  const [currentValue, setCurrentValue] = useState(clampValue(value ?? min, min, max));
  const [dragging, setDragging] = useState(false);
  const normalizedVariant = allowedVariants.has(variant) ? variant : "continuous";
  const normalizedState = normalizeState({ disabled, state, dragging });
  const pct = percentFor(currentValue, min, max);
  const formattedValue = useMemo(
    () => formatSliderValue({ value: currentValue, initialValue: initialValueRef.current, valueLabel, unit, formatValue }),
    [currentValue, formatValue, unit, valueLabel],
  );

  useEffect(() => {
    if (isValueControlled) setCurrentValue(clampValue(value ?? min, min, max));
  }, [isValueControlled, max, min, value]);

  const handleChange = (event) => {
    if (disabled) return;
    const nextValue = clampValue(event.currentTarget.value, min, max);
    if (!isValueControlled) setCurrentValue(nextValue);
    onValueChange?.(nextValue, { name, min: Number(min), max: Number(max), step: Number(step), unit });
  };

  const handlePointerDown = () => {
    if (!disabled) setDragging(true);
  };

  const handlePointerUp = () => {
    setDragging(false);
  };

  const handleBlur = () => {
    setDragging(false);
  };

  return React.createElement(
    "label",
    {
      className: ["slider", className].filter(Boolean).join(" "),
      ...flowVariantProps(normalizedVariant),
      ...flowStateProps(normalizedState),
      ...flowDensityProps(density),
      "data-value": String(currentValue),
      "data-unit": unit,
      "data-pct": String(pct),
      "data-dragging": dragging ? "true" : undefined,
    },
    React.createElement(
      "span",
      { className: "slider__meta" },
      label ? React.createElement("span", { className: "slider__label" }, label) : null,
      React.createElement("output", { className: "slider__value", "data-slider-output": "" }, formattedValue),
    ),
    React.createElement(
      "span",
      { className: "slider__control" },
      React.createElement("input", {
        ...flowRestProps(rest),
        ref,
        type: "range",
        className: "slider__input",
        "data-slider-input": "",
        "aria-label": label || undefined,
        "aria-valuetext": formattedValue,
        "aria-invalid": normalizedState === "error" ? "true" : undefined,
        name,
        value: currentValue,
        min,
        max,
        step,
        disabled: disabled || normalizedState === "disabled",
        onChange: handleChange,
        onPointerDown: handlePointerDown,
        onPointerUp: handlePointerUp,
        onPointerCancel: handlePointerUp,
        onBlur: handleBlur,
      }),
      React.createElement("span", { className: "slider__track", "aria-hidden": "true" }),
      React.createElement("span", { className: "slider__fill", "aria-hidden": "true" }),
      React.createElement("span", { className: "slider__thumb", "aria-hidden": "true" }),
    ),
  );
});

Slider.displayName = "Slider";
Slider.platformContract = sliderPlatformContract;
