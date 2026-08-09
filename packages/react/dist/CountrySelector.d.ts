import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  RefAttributes,
} from "react";
import type { FlowDataAttributes } from "./internal/props.js";
import type { countrySelectorPlatformContract } from "#flow/platforms";

export type CountrySelectorDensity = "sm" | "md" | "lg";

export interface CountrySelectorCountry {
  country: string;
  label: string;
  callingCode: string;
  nationalLength: number;
}

export type CountrySelectorValueChangeEvent = MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>;
export type CountrySelectorOpenChangeEvent =
  | MouseEvent<HTMLSpanElement>
  | KeyboardEvent<HTMLSpanElement>
  | KeyboardEvent<HTMLInputElement>;

export interface CountrySelectorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable">, FlowDataAttributes {
  label: string;
  value?: string;
  country?: string;
  countries?: CountrySelectorCountry[];
  disabled?: boolean;
  invalid?: boolean;
  density?: CountrySelectorDensity;
  inline?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  emptyText?: string;
  open?: boolean;
  onValueChange?: (countryCode: string, country: CountrySelectorCountry, event: CountrySelectorValueChangeEvent) => void;
  onOpenChange?: (open: boolean, event?: CountrySelectorOpenChangeEvent) => void;
}

export interface CountrySelectorComponent extends ForwardRefExoticComponent<CountrySelectorProps & RefAttributes<HTMLSpanElement>> {
  displayName: "CountrySelector";
  platformContract: typeof countrySelectorPlatformContract;
}

export const CountrySelector: CountrySelectorComponent;
