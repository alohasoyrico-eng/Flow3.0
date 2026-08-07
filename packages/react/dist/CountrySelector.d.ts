import type {
  ForwardRefExoticComponent,
  HTMLAttributes,
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

export interface CountrySelectorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "style"> {
  label?: string;
  value?: string;
  country?: string;
  countries?: CountrySelectorCountry[];
  disabled?: boolean;
  invalid?: boolean;
  density?: CountrySelectorDensity;
  inline?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  ariaLabel?: string;
  listboxLabel?: string;
  onValueChange?: (countryCode: string, country: CountrySelectorCountry) => void;
}

export interface CountrySelectorComponent extends ForwardRefExoticComponent<CountrySelectorProps & RefAttributes<HTMLSpanElement>> {
  displayName: "CountrySelector";
  platformContract: typeof countrySelectorPlatformContract;
}

export const CountrySelector: CountrySelectorComponent;
