const supportedPaymentBrands = Object.freeze([
    "visa",
    "mastercard",
    "amex",
    "discover",
    "generic",
]);
const supportedPaymentBrandSet = new Set(supportedPaymentBrands);
const defaultAssetBasePath = "./vendor/payment-card-icons/logo";
const brandLabels = {
    visa: "Visa",
    mastercard: "Mastercard",
    amex: "American Express",
    discover: "Discover",
    generic: "Payment card",
};
const brandAliases = {
    americanexpress: "amex",
    american_express: "amex",
    "american-express": "amex",
    master_card: "mastercard",
    master: "mastercard",
    mc: "mastercard",
    unknown: "generic",
};
function resolvePaymentBrandCandidate(brand = "generic") {
    const normalized = String(brand || "generic").trim().toLowerCase().replace(/\s+/g, "-");
    return brandAliases[normalized] ?? brandAliases[normalized.replace(/-/g, "_")] ?? normalized;
}
export function normalizePaymentBrand(brand = "generic") {
    const resolved = resolvePaymentBrandCandidate(brand);
    return supportedPaymentBrandSet.has(resolved) ? resolved : "generic";
}
export function paymentBrandLabel(brand = "generic") {
    return brandLabels[normalizePaymentBrand(brand)] ?? "Payment card";
}
export function hasPaymentBrandAsset(brand) {
    const value = String(brand || "").trim();
    return Boolean(value) && supportedPaymentBrandSet.has(resolvePaymentBrandCandidate(value));
}
export function paymentBrandAssetPath(brand = "generic", { basePath = defaultAssetBasePath } = {}) {
    const normalized = normalizePaymentBrand(brand);
    return `${String(basePath).replace(/\/$/, "")}/${normalized}.svg`;
}
export function createPaymentBrandAsset(brand = "generic", { label, hidden = true, basePath = defaultAssetBasePath, } = {}) {
    const normalized = normalizePaymentBrand(brand);
    const root = document.createElement("span");
    root.className = "payment-brand-mark";
    root.dataset.paymentBrand = normalized;
    root.dataset.paymentBrandLibrary = "svg-credit-card-payment-icons";
    root.dataset.paymentBrandLicense = "Apache-2.0";
    if (hidden) {
        root.setAttribute("aria-hidden", "true");
    }
    else {
        root.setAttribute("role", "img");
        root.setAttribute("aria-label", label ?? paymentBrandLabel(normalized));
    }
    const image = document.createElement("img");
    image.className = "payment-brand-mark__asset";
    image.alt = "";
    image.decoding = "async";
    image.loading = "lazy";
    image.setAttribute("aria-hidden", "true");
    image.src = paymentBrandAssetPath(normalized, { basePath });
    const fallback = document.createElement("span");
    fallback.className = "payment-brand-mark__fallback";
    fallback.hidden = true;
    fallback.setAttribute("aria-hidden", "true");
    fallback.textContent = paymentBrandLabel(normalized);
    image.onerror = () => {
        root.dataset.state = "fallback";
        image.hidden = true;
        fallback.hidden = false;
    };
    root.append(image, fallback);
    return root;
}
export function listPaymentBrandAssets() {
    return [...supportedPaymentBrands];
}
