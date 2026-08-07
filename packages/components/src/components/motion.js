import { createAnimationAsset } from "../primitives/animation-assets.js?v=1";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

const animatedMomentVariants = new Set(["success", "empty", "loading", "celebration"]);
const animatedMomentStates = new Set(["idle", "playing", "paused", "complete", "reduced-motion", "disabled"]);

function normalizeAnimatedMomentVariant(variant) {
  return animatedMomentVariants.has(variant) ? variant : "success";
}

function normalizeAnimatedMomentState(state) {
  return animatedMomentStates.has(state) ? state : "idle";
}

function animatedMomentStateLabel(state) {
  const labels = {
    idle: "Idle",
    playing: "Playing",
    paused: "Paused",
    complete: "Complete",
    "reduced-motion": "Reduced motion",
    disabled: "Disabled",
  };
  return labels[state] ?? labels.idle;
}

function animatedMomentIcon(variant, icon) {
  if (icon) return icon;
  const icons = {
    success: "shield",
    empty: "account_balance_wallet",
    loading: "sync",
    celebration: "auto_awesome",
  };
  return icons[variant] ?? "auto_awesome";
}

export function createAnimatedMoment({
  label,
  description = "",
  variant = "success",
  state = "playing",
  density = "md",
  fullWidth = false,
  icon = "",
  animationSource = "",
  animationData,
  reducedMotionFallback = "Short controlled animation with reduced-motion fallback.",
} = {}) {
  const resolvedVariant = normalizeAnimatedMomentVariant(variant);
  const resolvedState = normalizeAnimatedMomentState(state);
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const moment = document.createElement("div");
  moment.className = "animated-moment";
  moment.dataset.variant = resolvedVariant;
  moment.dataset.state = resolvedState;
  moment.dataset.density = resolvedDensity;
  moment.dataset.fullWidth = String(Boolean(fullWidth));
  moment.setAttribute("role", "img");
  moment.setAttribute("aria-label", `${label ?? "Animated moment"}: ${animatedMomentStateLabel(resolvedState)}`);
  if (resolvedState === "disabled") moment.setAttribute("aria-disabled", "true");
  const iconNode = document.createElement("span");
  iconNode.className = "animated-moment__icon";
  iconNode.setAttribute("aria-hidden", "true");
  setIconGlyph(iconNode, animatedMomentIcon(resolvedVariant, icon));
  const stage = document.createElement("span");
  stage.className = "animated-moment__stage";
  stage.setAttribute("data-animated-moment-stage", "");
  stage.setAttribute("aria-hidden", "true");
  const asset = createAnimationAsset({
    label: label ?? "Animated moment",
    source: animationSource,
    animationData,
    state: resolvedState,
    fallbackIcon: animatedMomentIcon(resolvedVariant, icon),
    fallbackText: reducedMotionFallback,
  });
  asset.className = `${asset.className} animated-moment__asset`;
  asset.setAttribute("data-animated-moment-asset", "");
  stage.append(asset);
  const title = document.createElement("strong");
  title.textContent = label ?? "Action complete";
  const stateNode = document.createElement("span");
  stateNode.className = "animated-moment__state";
  stateNode.textContent = animatedMomentStateLabel(resolvedState);
  const copy = document.createElement("small");
  copy.textContent = description || reducedMotionFallback;
  const cue = document.createElement("span");
  cue.className = "animated-moment__cue";
  cue.setAttribute("data-animated-moment-cue", "");
  cue.setAttribute("aria-hidden", "true");
  moment.append(iconNode, stage, title, stateNode, copy, cue);
  return moment;
}
