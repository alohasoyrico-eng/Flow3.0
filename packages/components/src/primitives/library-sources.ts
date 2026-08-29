const librarySources = Object.freeze({
  iconography: Object.freeze({
    id: "iconography",
    library: "material-symbols",
    license: "Apache-2.0",
    primitive: "Iconography",
    runtime: "font",
    vendorFiles: Object.freeze([
      "material-symbols/material-symbols-rounded.css",
      "material-symbols/material-symbols-rounded-400.ttf",
    ]),
    fallback: "Text label remains the required meaning.",
  }),
  "country-flags": Object.freeze({
    id: "country-flags",
    library: "country-flag-icons",
    license: "MIT",
    primitive: "Country Flags",
    runtime: "asset",
    vendorFiles: Object.freeze([
      "country-flag-icons/LICENSE",
      "country-flag-icons/3x2/MX.svg",
    ]),
    fallback: "Country name and calling code remain visible.",
  }),
  "payment-brand-assets": Object.freeze({
    id: "payment-brand-assets",
    library: "svg-credit-card-payment-icons",
    license: "Apache-2.0",
    primitive: "Payment Brand Assets",
    runtime: "asset",
    vendorFiles: Object.freeze([
      "svg-credit-card-payment-icons/LICENSE",
      "svg-credit-card-payment-icons/logo/visa.svg",
      "svg-credit-card-payment-icons/logo/mastercard.svg",
      "svg-credit-card-payment-icons/logo/amex.svg",
      "svg-credit-card-payment-icons/logo/discover.svg",
      "svg-credit-card-payment-icons/logo/generic.svg",
    ]),
    fallback: "Payment brand text remains the required meaning; logos are decorative brand reinforcement.",
  }),
  "animation-assets": Object.freeze({
    id: "animation-assets",
    library: "lottie-web",
    license: "MIT",
    primitive: "Animation Assets",
    runtime: "script",
    vendorFiles: Object.freeze([
      "lottie-web/lottie.min.js",
      "lottie-web/LICENSE.md",
    ]),
    fallback: "Static frame or reduced-motion copy remains visible.",
  }),
  "illustration-assets": Object.freeze({
    id: "illustration-assets",
    library: "open-doodles",
    license: "CC0-1.0",
    primitive: "Illustration Assets",
    runtime: "asset",
    vendorFiles: Object.freeze([
      "open-doodles/manifest.json",
      "open-doodles/LICENSE.md",
    ]),
    fallback: "Text summary remains the required meaning.",
  }),
  charts: Object.freeze({
    id: "charts",
    library: "echarts",
    license: "Apache-2.0",
    primitive: "Charts",
    runtime: "module",
    vendorFiles: Object.freeze([
      "echarts.esm.min.js",
      "echarts.LICENSE",
    ]),
    fallback: "Accessible table and text summary remain available.",
  }),
  maps: Object.freeze({
    id: "maps",
    library: "maplibre-gl",
    license: "BSD-3-Clause",
    primitive: "Maps",
    runtime: "script-css",
    vendorFiles: Object.freeze([
      "maplibre-gl/maplibre-gl.js",
      "maplibre-gl/maplibre-gl.css",
      "maplibre-gl/LICENSE.txt",
    ]),
    fallback: "Fallback list and coordinates remain available.",
  }),
});

export type LibrarySourceId = keyof typeof librarySources;
export type LibrarySource = (typeof librarySources)[LibrarySourceId];

function hasLibrarySourceId(id: string): id is LibrarySourceId {
  return Object.prototype.hasOwnProperty.call(librarySources, id);
}

export function listLibrarySources(): LibrarySource[] {
  return Object.values(librarySources);
}

export function hasLibrarySource(id: string): boolean {
  return hasLibrarySourceId(id);
}

export function getLibrarySource(id: string): LibrarySource | null {
  return hasLibrarySourceId(id) ? librarySources[id] : null;
}
