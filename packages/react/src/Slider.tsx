import React, { forwardRef, useMemo, useRef, useState } from "react";
import type { ChangeEvent, CSSProperties, ForwardRefExoticComponent, InputHTMLAttributes, RefAttributes } from "react";
import { sliderPlatformContract } from "@design-system/components/platforms";
import type { FlowDataAttributes } from "./internal/props.js";
import { flowStateProps, flowVariantProps, flowDensityProps, flowRestProps, flowDataProps, normalizeFlowDensity } from "./internal/props.js";

export type SliderVariant = "continuous" | "stepped" | "bounded" | "threshold" | "paired-value";
export type SliderState = "default" | "hover" | "focus" | "pressed" | "dragging" | "disabled" | "error" | "complete";
export type SliderDensity = "sm" | "md" | "lg";

export interface SliderValueMeta {
  name?: string;
  min: number;
  max: number;
  step: number;
  unit?: string | undefined;
}

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "type" | "value" | "defaultValue" | "onChange" | "onInput" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  variant?: SliderVariant;
  state?: SliderState;
  density?: SliderDensity;
  unit?: string;
  disabled?: boolean;
  name?: string;
  valueLabel?: string;
  formatValue?: (value: number) => string;
  onValueChange?: (value: number, meta: SliderValueMeta, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface SliderComponent extends ForwardRefExoticComponent<SliderProps & RefAttributes<HTMLInputElement>> {
  displayName: "Slider";
  platformContract: typeof sliderPlatformContract;
}

type SliderStyle = CSSProperties & { "--comp-slider-percent": string };

const allowedVariants = new Set<SliderVariant>(["continuous", "stepped", "bounded", "threshold", "paired-value"]);
const allowedStates = new Set<SliderState>(["default", "hover", "focus", "pressed", "dragging", "disabled", "error", "complete"]);

function clampValue(value: string | number | undefined, min: number, max: number): number {
  const number = Number(value);
  if (!Number.isFinite(number)) return Number(min);
  return Math.min(Number(max), Math.max(Number(min), number));
}

function percentFor(value: number, min: number, max: number): number {
  const range = Number(max) - Number(min);
  if (!range) return 0;
  return Math.round(Math.min(100, Math.max(0, ((Number(value) - Number(min)) / range) * 100)));
}

function normalizeState({ disabled, state, dragging }: { disabled: boolean; state: SliderState; dragging: boolean }): SliderState {
  if (disabled) return "disabled";
  if (dragging) return "pressed";
  return allowedStates.has(state) ? state : "default";
}

function formatSliderValue({ value, initialValue, valueLabel, unit, formatValue }: { value: number; initialValue: number; valueLabel?: string | undefined; unit?: string | undefined; formatValue?: ((value: number) => string) | undefined }): string {
  if (typeof formatValue === "function") return formatValue(Number(value));
  if (valueLabel && String(value) === String(initialValue)) return valueLabel;
  return unit ? `${value}${unit}` : String(value);
}

export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  variant = "continuous",
  state = "default",
  density,
  unit,
  disabled = false,
  name = "",
  valueLabel,
  formatValue,
  onValueChange,
  className = "",
  ...rest
}, ref) {
  const isValueControlled = value !== undefined;
  const initialValueRef = useRef(value ?? min);
  const [internalValue, setInternalValue] = useState(clampValue(value ?? min, min, max));
  const [dragging, setDragging] = useState(false);
  const currentValue = isValueControlled ? clampValue(value ?? min, min, max) : internalValue;
  const normalizedVariant = allowedVariants.has(variant) ? variant : "continuous";
  const normalizedState = normalizeState({ disabled, state, dragging });
  const pct = percentFor(currentValue, min, max);
  const formattedValue = useMemo(
    () => formatSliderValue({ value: currentValue, initialValue: initialValueRef.current, valueLabel, unit, formatValue }),
    [currentValue, formatValue, unit, valueLabel],
  );
  const resolvedDensity = normalizeFlowDensity(density);

  if (!label) return null;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const nextValue = clampValue(event.currentTarget.value, min, max);
    if (!isValueControlled) setInternalValue(nextValue);
    onValueChange?.(nextValue, { name, min: Number(min), max: Number(max), step: Number(step), unit }, event);
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
      ...flowDataProps(rest),
      ...flowVariantProps(normalizedVariant),
      ...flowStateProps(normalizedState),
      ...flowDensityProps(resolvedDensity),
      style: { "--comp-slider-percent": `${pct}%` } satisfies SliderStyle,
      "data-value": String(currentValue),
      "data-unit": unit,
      "data-dragging": dragging ? "true" : undefined,
    },
    React.createElement(
      "span",
      { className: "slider__meta" },
      React.createElement("span", { className: "slider__label" }, label),
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
        "aria-label": label,
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
}) as SliderComponent;

Slider.displayName = "Slider";
Slider.platformContract = sliderPlatformContract;
