export type FlowDataAttributes = {
  [key: `data-${string}`]: string | number | boolean | undefined;
};

export type FlowDensity = "sm" | "md" | "lg";

type FlowRestPropsInput = Record<string, unknown>;
type FlowDataAttributeValue = string | number | boolean;
type FlowDefinedProps<TProps extends Record<string, unknown>> = {
  [TKey in keyof TProps as undefined extends TProps[TKey] ? never : TKey]: TProps[TKey];
} & {
  [TKey in keyof TProps as undefined extends TProps[TKey] ? TKey : never]?: Exclude<TProps[TKey], undefined>;
};

const validFlowDensities = new Set<string>(["sm", "md", "lg"]);

export function flowRestProps<TProps extends FlowRestPropsInput>(props: TProps = {} as TProps): Omit<
  TProps,
  | "contentEditable"
  | "dangerouslySetInnerHTML"
  | "style"
  | "suppressContentEditableWarning"
  | "suppressHydrationWarning"
> {
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

export function flowDataProps(props: FlowRestPropsInput = {}): FlowDataAttributes {
  return Object.fromEntries(Object.entries(flowRestProps(props)).filter(([key]) => key.startsWith("data-"))) as FlowDataAttributes;
}

export function flowDefinedProps<const TProps extends Record<string, unknown>>(props: TProps): FlowDefinedProps<TProps> {
  return Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as FlowDefinedProps<TProps>;
}

export function normalizeFlowDensity<const TExtension extends string = never>(
  density: unknown,
  extensions: readonly TExtension[] = [],
): FlowDensity | TExtension | undefined {
  if (typeof density !== "string") return undefined;
  if (validFlowDensities.has(density)) return density as FlowDensity;
  return extensions.includes(density as TExtension) ? density as TExtension : undefined;
}

export function normalizeFlowValue<TValue>(
  value: TValue,
  allowedValues: { has?: (value: TValue) => boolean } | null | undefined,
  fallback: TValue,
): TValue {
  return allowedValues?.has?.(value) ? value : fallback;
}

function normalizeDataAttributeValue(value: unknown): FlowDataAttributeValue | undefined {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : undefined;
}

export function flowVariantProps(variant: unknown): FlowDataAttributes {
  const value = normalizeDataAttributeValue(variant);
  return value ? { "data-variant": value } : {};
}

export function flowStateProps(state: unknown): FlowDataAttributes {
  const value = normalizeDataAttributeValue(state);
  return value ? { "data-state": value } : {};
}

export function flowToneProps(tone: unknown): FlowDataAttributes {
  const value = normalizeDataAttributeValue(tone);
  return value ? { "data-tone": value } : {};
}

export function flowDensityProps<const TExtension extends string = never>(
  density: unknown,
  extensions: readonly TExtension[] = [],
): FlowDataAttributes {
  const normalizedDensity = normalizeFlowDensity(density, extensions);
  return normalizedDensity ? { "data-density": normalizedDensity } : {};
}
