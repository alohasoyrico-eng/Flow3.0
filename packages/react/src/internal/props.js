const validFlowDensities = new Set(["sm", "md", "lg"]);

export function flowRestProps(props = {}) {
  const {
    contentEditable,
    dangerouslySetInnerHTML,
    style,
    suppressContentEditableWarning,
    suppressHydrationWarning,
    ...rest
  } = props;
  return rest;
}

export function flowDataProps(props = {}) {
  return Object.fromEntries(Object.entries(flowRestProps(props)).filter(([key]) => key.startsWith("data-")));
}

export function normalizeFlowDensity(density) {
  return validFlowDensities.has(density) ? density : undefined;
}

export function normalizeFlowValue(value, allowedValues, fallback) {
  return allowedValues?.has?.(value) ? value : fallback;
}

export function flowVariantProps(variant) {
  return variant ? { "data-variant": variant } : {};
}

export function flowStateProps(state) {
  return state ? { "data-state": state } : {};
}

export function flowToneProps(tone) {
  return tone ? { "data-tone": tone } : {};
}

export function flowDensityProps(density) {
  const normalizedDensity = normalizeFlowDensity(density);
  return normalizedDensity ? { "data-density": normalizedDensity } : {};
}
