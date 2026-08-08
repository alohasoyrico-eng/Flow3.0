import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  RefAttributes,
} from "react";
import type { countrySelectorPlatformContract } from "#flow/platforms";

export type CountrySelectorDensity = "sm" | "md" | "lg";

export interface CountrySelectorCountry {
  country: string;
  label: string;
  callingCode: string;
  nationalLength: number;
}

export type CountrySelectorValueChangeEvent = MouseEvent<HTMLSpanElement> | KeyboardEvent<HTMLSpanElement>;

export interface CountrySelectorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style" | "dangerouslySetInnerHTML" | "suppressHydrationWarning" | "suppressContentEditableWarning" | "contentEditable"> {
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
  onValueChange?: (countryCode: string, country: CountrySelectorCountry, event: CountrySelectorValueChangeEvent) => void;
}

export interface CountrySelectorComponent extends ForwardRefExoticComponent<CountrySelectorProps & RefAttributes<HTMLSpanElement>> {
  displayName: "CountrySelector";
  platformContract: typeof countrySelectorPlatformContract;
}

export const CountrySelector: CountrySelectorComponent;
