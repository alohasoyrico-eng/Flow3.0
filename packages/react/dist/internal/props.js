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

export function normalizeFlowDensity(density) {
  return validFlowDensities.has(density) ? density : undefined;
}

export function normalizeFlowValue(value, allowedValues, fallback) {
  return allowedValues?.has?.(value) ? value : fallback;
}

export function flowDensityProps(density) {
  const normalizedDensity = normalizeFlowDensity(density);
  return normalizedDensity ? { "data-density": normalizedDensity } : {};
}
