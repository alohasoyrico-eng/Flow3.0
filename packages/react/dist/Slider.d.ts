import type {
  ChangeEvent,
  ForwardRefExoticComponent,
  InputHTMLAttributes,
  RefAttributes,
} from "react";
import { sliderPlatformContract } from "#flow/platforms";

export type SliderVariant = "continuous" | "stepped" | "bounded" | "threshold" | "paired-value";
export type SliderState = "default" | "focus" | "dragging" | "disabled" | "error" | "complete";
export type SliderDensity = "sm" | "md" | "lg";

export interface SliderValueMeta {
  name?: string;
  min: number;
  max: number;
  step: number;
  unit?: string;
}

export interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "style" | "size" | "type" | "value" | "defaultValue" | "onChange" | "onInput" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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

export const Slider: SliderComponent;
