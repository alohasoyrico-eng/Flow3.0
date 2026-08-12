type IllustrationSource = {
  id: string;
  name: string;
  license: string;
  source: string;
  allowedFormats: Set<string>;
  requiresAttribution: boolean;
};

type IllustrationTheme = "auto" | "dark" | "light";

type IllustrationAssetOptions = {
  id?: string;
  src?: string;
  darkSrc?: string;
  alt?: string;
  purpose?: string;
  source?: string;
  format?: string;
  density?: string;
  theme?: string;
  fallbackText?: string;
  loading?: HTMLImageElement["loading"];
};

type IllustrationAssetModel = {
  id: string | null;
  src: string | null;
  darkSrc: string | null;
  format: string;
  purpose: string;
  density: string | null;
  theme: IllustrationTheme;
  status: string;
};

const approvedIllustrationSources = new Map<string, IllustrationSource>([
  [
    "open-doodles",
    {
      id: "open-doodles",
      name: "Open Doodles",
      license: "CC0",
      source: "https://www.opendoodles.com/about",
      allowedFormats: new Set(["svg", "png", "gif"]),
      requiresAttribution: false,
    },
  ],
  [
    "custom-artwork",
    {
      id: "custom-artwork",
      name: "Custom Artwork",
      license: "owned",
      source: "internal",
      allowedFormats: new Set(["png", "webp", "svg", "gif"]),
      requiresAttribution: false,
    },
  ],
]);

const validPurposes = new Set<string>(["decorative", "informative", "onboarding", "empty", "hero", "guidance"]);
const validDensities = new Set<string>(["sm", "md", "lg"]);

function inferFormat(src = ""): string {
  const clean = (String(src).split("?")[0] ?? "").split("#")[0] ?? "";
  const match = /\.([a-z0-9]+)$/i.exec(clean);
  return match?.[1]?.toLowerCase() ?? "png";
}

function normalizePurpose(purpose = "decorative"): string {
  return validPurposes.has(purpose) ? purpose : "decorative";
}

function normalizeDensity(density?: string): string | undefined {
  return density && validDensities.has(density) ? density : undefined;
}

function sourceModelFor(source = "open-doodles") {
  const model = approvedIllustrationSources.get(source);
  return {
    approved: Boolean(model),
    id: model?.id ?? source,
    name: model?.name ?? source,
    license: model?.license ?? null,
    source: model?.source ?? null,
    requiresAttribution: Boolean(model?.requiresAttribution),
    allowedFormats: model ? [...model.allowedFormats] : [],
  };
}

function createFallback(fallbackText = "Illustration unavailable"): HTMLSpanElement {
  const fallback = document.createElement("span");
  fallback.className = "illustration-asset__fallback";
  fallback.textContent = fallbackText;
  return fallback;
}

export function createIllustrationAsset({
  id,
  src,
  darkSrc = "",
  alt = "",
  purpose = "decorative",
  source = "open-doodles",
  format,
  density,
  theme = "auto",
  fallbackText,
  loading = "lazy",
}: IllustrationAssetOptions = {}) {
  const resolvedPurpose = normalizePurpose(purpose);
  const resolvedDensity = normalizeDensity(density);
  const resolvedFormat = (format ?? inferFormat(src)).toLowerCase();
  const sourceModel = sourceModelFor(source);
  const formatSupported = Boolean(sourceModel.allowedFormats.includes(resolvedFormat));
  const hasAsset = Boolean(src);
  const informative = resolvedPurpose !== "decorative";
  const accessibilityModel = {
    decorative: !informative,
    alt: informative ? alt || fallbackText || "Illustration" : "",
    requiresVisibleCopy: informative,
  };
  const status = !sourceModel.approved
    ? "unapprovedSource"
    : !formatSupported
      ? "unsupportedFormat"
      : hasAsset
        ? "ready"
        : "missing";

  const figure = document.createElement("figure");
  figure.className = "illustration-asset";
  figure.dataset.primitive = "illustration-assets";
  figure.dataset.source = sourceModel.id;
  figure.dataset.purpose = resolvedPurpose;
  figure.dataset.format = resolvedFormat;
  if (resolvedDensity) figure.dataset.density = resolvedDensity;
  figure.dataset.status = status;
  if (id) figure.dataset.assetId = id;

  const resolvedTheme: IllustrationTheme = theme === "dark" || theme === "light" ? theme : "auto";
  figure.dataset.theme = resolvedTheme;
  const assetModel: IllustrationAssetModel = {
    id: id ?? null,
    src: src ?? null,
    darkSrc: darkSrc || null,
    format: resolvedFormat,
    purpose: resolvedPurpose,
    density: resolvedDensity ?? null,
    theme: resolvedTheme,
    status,
  };

  if (status === "ready") {
    const media = document.createElement("span");
    media.className = "illustration-asset__media";
    const handleImageError = () => {
      figure.dataset.status = "missing";
      media.replaceWith(createFallback(fallbackText ?? "Illustration unavailable"));
      assetModel.status = "missing";
    };
    const image = document.createElement("img");
    image.className = "illustration-asset__image illustration-asset__image--light";
    image.src = src ?? "";
    image.alt = accessibilityModel.alt;
    image.loading = loading;
    image.decoding = "async";
    image.onerror = handleImageError;
    media.append(image);
    if (darkSrc) {
      const darkImage = document.createElement("img");
      darkImage.className = "illustration-asset__image illustration-asset__image--dark";
      darkImage.src = darkSrc;
      darkImage.alt = accessibilityModel.alt;
      darkImage.loading = loading;
      darkImage.decoding = "async";
      darkImage.onerror = handleImageError;
      media.append(darkImage);
    }
    figure.append(media);
  } else {
    figure.append(createFallback(fallbackText ?? "Illustration unavailable"));
  }

  return {
    assetNode: figure,
    assetModel,
    sourceModel,
    accessibilityModel,
  };
}

export function listIllustrationSources() {
  return [...approvedIllustrationSources.values()].map((source) => ({
    ...source,
    allowedFormats: [...source.allowedFormats],
  }));
}

export function hasIllustrationSource(source: string): boolean {
  return approvedIllustrationSources.has(source);
}
