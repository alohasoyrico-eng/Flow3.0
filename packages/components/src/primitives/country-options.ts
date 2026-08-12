export type CountryCallingCodeOption = {
  country: string;
  label: string;
  callingCode: string;
  nationalLength: number;
  prefix?: string;
};

export const countryCallingCodeOptions = Object.freeze([
  { country: "AR", label: "Argentina", callingCode: "+54", nationalLength: 10 },
  { country: "BR", label: "Brazil", callingCode: "+55", nationalLength: 11 },
  { country: "CL", label: "Chile", callingCode: "+56", nationalLength: 9 },
  { country: "CO", label: "Colombia", callingCode: "+57", nationalLength: 10 },
  { country: "MX", label: "Mexico", callingCode: "+52", nationalLength: 10 },
  { country: "PE", label: "Peru", callingCode: "+51", nationalLength: 9 },
  { country: "ES", label: "Spain", callingCode: "+34", nationalLength: 9 },
  { country: "US", label: "United States", callingCode: "+1", nationalLength: 10 },
  { country: "CA", label: "Canada", callingCode: "+1", nationalLength: 10 },
  { country: "CU", label: "Cuba", callingCode: "+53", nationalLength: 8 },
]) satisfies readonly CountryCallingCodeOption[];

const defaultCountryCallingCodeOption = countryCallingCodeOptions[0] as CountryCallingCodeOption;

export function resolveCountryCallingCodeOption(
  { country, prefix, callingCode }: Partial<CountryCallingCodeOption> = {},
  countries: readonly CountryCallingCodeOption[] = countryCallingCodeOptions,
): CountryCallingCodeOption {
  const countryCode = String(country ?? "").toUpperCase();
  const dialCode = callingCode ?? prefix;
  return countries.find((item) => item.country === countryCode)
    ?? countries.find((item) => item.callingCode === dialCode)
    ?? defaultCountryCallingCodeOption;
}

export function normalizeCountryCallingCodeOptions(
  countries: readonly Partial<CountryCallingCodeOption>[] = countryCallingCodeOptions,
): CountryCallingCodeOption[] {
  return (countries?.length ? countries : countryCallingCodeOptions).map((item) => ({
    ...resolveCountryCallingCodeOption(item, countryCallingCodeOptions),
    ...item,
    country: String(item.country ?? "").toUpperCase(),
  }));
}
