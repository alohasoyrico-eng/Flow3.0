const supportedCountryFlags = Object.freeze([
  "AC", "AD", "AE", "AF", "AG", "AI", "AL", "AM", "AO", "AQ", "AR", "AS", "AT", "AU", "AW", "AX", "AZ",
  "BA", "BB", "BD", "BE", "BF", "BG", "BH", "BI", "BJ", "BL", "BM", "BN", "BO", "BQ-BO", "BQ-SA", "BQ-SE", "BQ",
  "BR", "BS", "BT", "BV", "BW", "BY", "BZ", "CA", "CC", "CD", "CF", "CG", "CH", "CI", "CK", "CL", "CM", "CN",
  "CO", "CR", "CU", "CV", "CW", "CX", "CY", "CZ", "DE", "DJ", "DK", "DM", "DO", "DZ", "EC", "EE", "EG", "EH",
  "ER", "ES-CT", "ES", "ET", "EU", "FI", "FJ", "FK", "FM", "FO", "FR", "GA", "GB-ENG", "GB-NIR", "GB-SCT",
  "GB-WLS", "GB", "GD", "GE", "GF", "GG", "GH", "GI", "GL", "GM", "GN", "GP", "GQ", "GR", "GS", "GT", "GU",
  "GW", "GY", "HK", "HM", "HN", "HR", "HT", "HU", "IC", "ID", "IE", "IL", "IM", "IN", "IO", "IQ", "IR", "IS",
  "IT", "JE", "JM", "JO", "JP", "KE", "KG", "KH", "KI", "KM", "KN", "KP", "KR", "KW", "KY", "KZ", "LA", "LB",
  "LC", "LI", "LK", "LR", "LS", "LT", "LU", "LV", "LY", "MA", "MC", "MD", "ME", "MF", "MG", "MH", "MK", "ML",
  "MM", "MN", "MO", "MP", "MQ", "MR", "MS", "MT", "MU", "MV", "MW", "MX", "MY", "MZ", "NA", "NC", "NE", "NF",
  "NG", "NI", "NL", "NO", "NP", "NR", "NU", "NZ", "OM", "PA", "PE", "PF", "PG", "PH", "PK", "PL", "PM", "PN",
  "PR", "PS", "PT", "PW", "PY", "QA", "RE", "RO", "RS", "RU", "RW", "SA", "SB", "SC", "SD", "SE", "SG", "SH",
  "SI", "SJ", "SK", "SL", "SM", "SN", "SO", "SR", "SS", "ST", "SV", "SX", "SY", "SZ", "TA", "TC", "TD", "TF",
  "TG", "TH", "TJ", "TK", "TL", "TM", "TN", "TO", "TR", "TT", "TV", "TW", "TZ", "UA", "UG", "UM", "US", "UY",
  "UZ", "VA", "VC", "VE", "VG", "VI", "VN", "VU", "WF", "WS", "XA", "XC", "XK", "XO", "YE", "YT", "ZA", "ZM", "ZW",
]);

const supportedCountryFlagSet = new Set<string>(supportedCountryFlags);
const defaultAssetBasePath = "./vendor/country-flag-icons/3x2";

let regionNames: Intl.DisplayNames | undefined;

function normalizeCountryFlagCode(country = "MX"): string {
  const code = String(country || "MX").trim().toUpperCase();
  return supportedCountryFlagSet.has(code) ? code : "MX";
}

function resolveCountryName(code: string): string {
  if (!regionNames && typeof Intl !== "undefined" && Intl.DisplayNames) {
    regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  }
  return regionNames?.of?.(code) ?? code;
}

export function hasCountryFlag(country: string): boolean {
  return supportedCountryFlagSet.has(String(country || "").trim().toUpperCase());
}

export function countryFlagAssetPath(country = "MX", { basePath = defaultAssetBasePath }: { basePath?: string } = {}): string {
  const code = normalizeCountryFlagCode(country);
  return `${String(basePath).replace(/\/$/, "")}/${code}.svg`;
}

export function createCountryFlag(country = "MX", {
  label,
  hidden = true,
  basePath = defaultAssetBasePath,
}: { label?: string; hidden?: boolean; basePath?: string } = {}): HTMLSpanElement {
  const code = normalizeCountryFlagCode(country);
  const root = document.createElement("span");
  root.className = "country-flag";
  root.dataset.country = code;
  root.dataset.flagLibrary = "country-flag-icons";
  root.dataset.flagSource = "country-flag-icons";

  if (hidden) {
    root.setAttribute("aria-hidden", "true");
  } else {
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", label ?? `${resolveCountryName(code)} flag`);
  }

  const image = document.createElement("img");
  image.className = "country-flag__asset";
  image.alt = "";
  image.decoding = "async";
  image.loading = "lazy";
  image.setAttribute("aria-hidden", "true");
  image.src = countryFlagAssetPath(code, { basePath });

  const fallback = document.createElement("span");
  fallback.className = "country-flag__fallback";
  fallback.hidden = true;
  fallback.setAttribute("aria-hidden", "true");
  fallback.textContent = code;

  image.onerror = () => {
    root.dataset.state = "fallback";
    image.hidden = true;
    fallback.hidden = false;
  };

  root.append(image, fallback);
  return root;
}

export function listCountryFlags(): string[] {
  return [...supportedCountryFlags];
}
