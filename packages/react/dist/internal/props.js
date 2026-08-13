const validFlowDensities = new Set(["sm", "md", "lg"]);
export function flowRestProps(props = {}) {
    const { contentEditable, dangerouslySetInnerHTML, style, suppressContentEditableWarning, suppressHydrationWarning, ...rest } = props;
    return rest;
}
export function flowDataProps(props = {}) {
    return Object.fromEntries(Object.entries(flowRestProps(props)).filter(([key]) => key.startsWith("data-")));
}
export function flowDefinedProps(props) {
    return Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined));
}
export function normalizeFlowDensity(density) {
    return typeof density === "string" && validFlowDensities.has(density) ? density : undefined;
}
export function normalizeFlowValue(value, allowedValues, fallback) {
    return allowedValues?.has?.(value) ? value : fallback;
}
function normalizeDataAttributeValue(value) {
    return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : undefined;
}
export function flowVariantProps(variant) {
    const value = normalizeDataAttributeValue(variant);
    return value ? { "data-variant": value } : {};
}
export function flowStateProps(state) {
    const value = normalizeDataAttributeValue(state);
    return value ? { "data-state": value } : {};
}
export function flowToneProps(tone) {
    const value = normalizeDataAttributeValue(tone);
    return value ? { "data-tone": value } : {};
}
export function flowDensityProps(density) {
    const normalizedDensity = normalizeFlowDensity(density);
    return normalizedDensity ? { "data-density": normalizedDensity } : {};
}
