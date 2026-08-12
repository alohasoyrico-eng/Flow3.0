import { setIconGlyph } from "./iconography.js";
const supportedAnimationStates = new Set(["idle", "playing", "paused", "complete", "reduced-motion", "disabled"]);
const supportedRenderers = new Set(["svg", "canvas", "html"]);
function normalizeAnimationState(state, reducedMotion) {
    if (state === "disabled")
        return "disabled";
    if (reducedMotion || state === "reduced-motion")
        return "reduced-motion";
    return supportedAnimationStates.has(state) ? state : "playing";
}
function normalizeRenderer(renderer) {
    return supportedRenderers.has(renderer) ? renderer : "svg";
}
function defaultAnimationRuntime() {
    return globalThis.lottie;
}
export function resolveAnimationRuntime(runtime = defaultAnimationRuntime()) {
    return runtime && typeof runtime.loadAnimation === "function" ? runtime : null;
}
export function prefersReducedAnimation() {
    return Boolean(globalThis?.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches);
}
export function createAnimationAsset({ label, source = "", animationData, renderer = "svg", state = "playing", autoplay = true, loop = true, runtime, fallbackIcon = "animation", fallbackText = "Static animation fallback", reducedMotion = prefersReducedAnimation(), } = {}) {
    const resolvedState = normalizeAnimationState(state, reducedMotion);
    const resolvedRenderer = normalizeRenderer(renderer);
    const resolvedRuntime = resolveAnimationRuntime(runtime);
    const root = document.createElement("span");
    root.className = "animation-asset";
    root.dataset.animationLibrary = "lottie-web";
    root.dataset.animationRuntime = resolvedRuntime ? "available" : "fallback";
    root.dataset.state = resolvedState;
    root.dataset.renderer = resolvedRenderer;
    root.setAttribute("role", "img");
    root.setAttribute("aria-label", label ?? "Animation");
    const viewport = document.createElement("span");
    viewport.className = "animation-asset__viewport";
    viewport.setAttribute("aria-hidden", "true");
    const fallback = document.createElement("span");
    fallback.className = "animation-asset__fallback";
    fallback.setAttribute("aria-hidden", "true");
    const fallbackGlyph = document.createElement("span");
    fallbackGlyph.className = "animation-asset__fallback-icon";
    setIconGlyph(fallbackGlyph, fallbackIcon);
    const fallbackLabel = document.createElement("span");
    fallbackLabel.className = "animation-asset__fallback-label";
    fallbackLabel.textContent = fallbackText;
    fallback.append(fallbackGlyph, fallbackLabel);
    root.append(viewport, fallback);
    const hasAsset = Boolean(source || animationData);
    const canPlay = resolvedRuntime && hasAsset && resolvedState !== "reduced-motion" && resolvedState !== "disabled";
    if (canPlay) {
        fallback.hidden = true;
        const animation = resolvedRuntime.loadAnimation({
            container: viewport,
            renderer: resolvedRenderer,
            loop: Boolean(loop),
            autoplay: Boolean(autoplay && resolvedState === "playing"),
            path: source || undefined,
            animationData,
        });
        if (resolvedState === "paused" && typeof animation.pause === "function")
            animation.pause();
        if (resolvedState === "complete" && typeof animation.goToAndStop === "function")
            animation.goToAndStop(100, true);
        root.__animationAsset = animation;
    }
    else {
        root.dataset.animationRuntime = "fallback";
    }
    return root;
}
