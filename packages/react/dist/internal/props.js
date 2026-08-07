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

export function flowDensityProps(density) {
  return validFlowDensities.has(density) ? { "data-density": density } : {};
}
