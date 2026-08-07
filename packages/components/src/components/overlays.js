import { createTransitionalActionButton, createTransitionalActionIconButton } from "./actions.js?v=2";
import { createProgressIndicator } from "./feedback.js?v=8";
import { createTransitionalFieldInput } from "./fields.js?v=18";
import { createTransitionalBadge } from "./status.js?v=2";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

function focusNode(node) {
  if (typeof node?.focus === "function") node.focus();
}

function attachOutsideClose(root, onClose) {
  globalThis.document?.addEventListener?.("pointerdown", (event) => {
    if (typeof root.contains === "function" && root.contains(event.target)) return;
    onClose();
  });
}

function focusableNodes(root) {
  const result = [];
  const visit = (node) => {
    if (!node || node.hidden) return;
    const tag = String(node.tagName ?? "").toLowerCase();
    const naturallyFocusable = ["button", "input", "select", "textarea"].includes(tag) || Boolean(node.href);
    if (!node.disabled && (naturallyFocusable || node.tabIndex >= 0)) result.push(node);
    for (const child of Array.from(node.children ?? [])) visit(child);
  };
  visit(root);
  return result;
}

function nodesWithAttribute(root, attribute) {
  const result = [];
  const visit = (node) => {
    if (!node) return;
    if (node.attributes?.[attribute] != null) result.push(node);
    for (const child of Array.from(node.children ?? [])) visit(child);
  };
  visit(root);
  return result;
}

function attachOverlayShell({
  root,
  trigger,
  surface,
  panel,
  open,
  initialFocus,
  stateOnOpen,
  stateOnClose,
  onOpenChange,
}) {
  const setOpen = (nextOpen, restoreFocus = false) => {
    root.dataset.open = String(Boolean(nextOpen));
    if (stateOnOpen || stateOnClose) root.dataset.state = nextOpen ? (stateOnOpen ?? "open") : (stateOnClose ?? "closed");
    trigger.setAttribute("aria-expanded", String(Boolean(nextOpen)));
    surface.hidden = !nextOpen;
    if (nextOpen) {
      focusNode(initialFocus ?? focusableNodes(panel)[0] ?? panel);
    } else if (restoreFocus) {
      focusNode(trigger);
    }
    if (typeof onOpenChange === "function") onOpenChange(Boolean(nextOpen));
  };
  trigger.addEventListener?.("click", () => setOpen(surface.hidden));
  surface.addEventListener?.("click", (event) => {
    if (event.target === surface) setOpen(false, true);
  });
  root.addEventListener?.("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault?.();
      setOpen(false, true);
      return;
    }
    if (event.key !== "Tab" || surface.hidden) return;
    const focusables = focusableNodes(panel);
    if (!focusables.length) return;
    const current = globalThis.document?.activeElement;
    const currentIndex = focusables.indexOf(current);
    let nextIndex = currentIndex;
    if (event.shiftKey) {
      nextIndex = currentIndex <= 0 ? focusables.length - 1 : currentIndex - 1;
    } else {
      nextIndex = currentIndex >= focusables.length - 1 ? 0 : currentIndex + 1;
    }
    event.preventDefault?.();
    focusNode(focusables[nextIndex]);
  });
  for (const control of nodesWithAttribute(panel, "data-overlay-close")) {
    control.addEventListener?.("click", () => setOpen(false, true));
  }
  if (open) focusNode(initialFocus ?? focusableNodes(panel)[0] ?? panel);
  return setOpen;
}

export function createDialog({
  label,
  description = "",
  triggerLabel = "Open dialog",
  actions = [],
  open,
  tone = "neutral",
  variant = "confirmation",
  state = "open",
  density = "md",
  icon = "",
  fields = [],
  id = "",
  onOpenChange,
  onAction,
} = {}) {
  const resolvedVariant = ["confirmation", "destructive", "form", "review", "success"].includes(variant) ? variant : "confirmation";
  const resolvedTone = ["neutral", "info", "success", "danger"].includes(tone) ? tone : resolvedVariant === "success" ? "success" : resolvedVariant === "destructive" ? "danger" : "neutral";
  const resolvedState = ["open", "focus", "closing", "default", "closed"].includes(state) ? state : "open";
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const shouldOpen = open ?? ["open", "focus", "closing"].includes(resolvedState);
  const renderedState = shouldOpen ? resolvedState : (resolvedState === "default" ? "default" : "closed");
  const toneIcon = {
    danger: "warning",
    info: "info",
    success: "check_circle",
    neutral: "",
  };
  const root = document.createElement("div");
  root.className = ["dialog", `dialog--${resolvedTone}`].join(" ");
  root.dataset.open = String(Boolean(shouldOpen));
  root.dataset.variant = resolvedVariant;
  root.dataset.state = renderedState;
  root.dataset.tone = resolvedTone;
  root.dataset.density = resolvedDensity;
  const dialogId = id || `dialog-${String(label ?? "dialog").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  const titleId = `${dialogId}-title`;
  const trigger = createTransitionalActionButton({ label: triggerLabel, variant: "secondary", density: resolvedDensity });
  trigger.className = `${trigger.className} dialog__trigger`;
  trigger.setAttribute("data-overlay-open", "");
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", String(Boolean(shouldOpen)));
  trigger.setAttribute("aria-controls", dialogId);
  const overlay = document.createElement("div");
  overlay.className = "dialog__overlay";
  overlay.setAttribute("data-overlay-dismiss", "");
  overlay.hidden = !shouldOpen;
  const panel = document.createElement("section");
  panel.className = "dialog__panel";
  panel.id = dialogId;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", titleId);
  const close = createTransitionalActionIconButton({ label: "Close dialog", icon: "close", density: resolvedDensity });
  close.className = `${close.className} dialog__close`;
  close.setAttribute("data-overlay-close", "");
  const header = document.createElement("header");
  header.className = "dialog__header";
  const resolvedIcon = icon || toneIcon[resolvedTone];
  if (resolvedIcon) {
    const iconNode = document.createElement("span");
    iconNode.className = "dialog__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, resolvedIcon);
    header.append(iconNode);
  }
  const content = document.createElement("div");
  content.className = "dialog__content";
  const title = document.createElement("h3");
  title.id = titleId;
  title.textContent = label ?? "Dialog";
  content.append(title);
  if (description) {
    const copy = document.createElement("p");
    copy.textContent = description;
    content.append(copy);
  }
  header.append(content, close);
  panel.append(header);
  if (fields.length) {
    const body = document.createElement("div");
    body.className = "dialog__body";
    for (const field of fields) {
      body.append(createTransitionalFieldInput({
        label: field.label,
        value: field.value ?? "",
        placeholder: field.placeholder ?? "",
        helper: field.helper ?? "",
        error: field.error ?? "",
        density: field.density ?? resolvedDensity,
        disabled: field.disabled,
        invalid: field.invalid,
      }));
    }
    panel.append(body);
  }
  if (actions.length) {
    const footer = document.createElement("footer");
    actions.forEach((action, index) => {
      const needsDangerIntent = action.intent == null && (resolvedTone === "danger" || resolvedVariant === "destructive") && index === 0;
      const actionVariant = action.variant === "danger" ? "primary" : action.variant ?? (index === 0 ? "primary" : "secondary");
      const actionIntent = action.variant === "danger" ? "danger" : needsDangerIntent ? "danger" : action.intent;
      const actionNode = createTransitionalActionButton({
        ...action,
        variant: actionVariant,
        intent: actionIntent,
        density: action.density ?? resolvedDensity,
      });
      actionNode.setAttribute("data-overlay-close", "");
      actionNode.dataset.key = action.key ?? action.label ?? "";
      actionNode.addEventListener?.("click", () => {
        if (typeof onAction === "function") onAction(actionNode.dataset.key);
      });
      footer.append(actionNode);
    });
    panel.append(footer);
  }
  overlay.append(panel);
  root.append(trigger, overlay);
  attachOverlayShell({
    root,
    trigger,
    surface: overlay,
    panel,
    open: shouldOpen,
    initialFocus: close,
    stateOnOpen: ["closed", "default"].includes(resolvedState) ? "open" : resolvedState,
    stateOnClose: resolvedState === "default" ? "default" : "closed",
    onOpenChange,
  });
  return root;
}

export function createDrawer({
  label,
  description = "",
  triggerLabel = "Open drawer",
  variant = "side-sheet",
  state = "closed",
  tone = "neutral",
  density = "md",
  side = "right",
  fields = [],
  content = [],
  actions = [],
  open,
  id = "",
  onOpenChange,
  onAction,
} = {}) {
  const resolvedState = state ?? "closed";
  const shouldOpen = open ?? ["open", "focus", "closing"].includes(resolvedState);
  const renderedState = shouldOpen ? resolvedState : (resolvedState === "default" ? "default" : "closed");
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const resolvedTone = ["neutral", "info", "danger"].includes(tone) ? tone : "neutral";
  const root = document.createElement("div");
  root.className = `drawer drawer--${resolvedTone}`;
  root.dataset.variant = variant;
  root.dataset.state = renderedState;
  root.dataset.tone = resolvedTone;
  root.dataset.density = resolvedDensity;
  root.dataset.open = String(Boolean(shouldOpen));
  root.dataset.side = side;
  const drawerId = id || `drawer-${String(label ?? "drawer").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  const titleId = `${drawerId}-title`;
  const trigger = createTransitionalActionButton({ label: triggerLabel, variant: "secondary", density: resolvedDensity });
  trigger.className = `${trigger.className} drawer__trigger`;
  trigger.setAttribute("data-overlay-open", "");
  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-expanded", String(Boolean(shouldOpen)));
  trigger.setAttribute("aria-controls", drawerId);
  const overlay = document.createElement("div");
  overlay.className = "drawer__overlay";
  overlay.setAttribute("data-overlay-dismiss", "");
  overlay.hidden = !shouldOpen;
  const panel = document.createElement("aside");
  panel.className = "drawer__panel";
  panel.id = drawerId;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-modal", "true");
  panel.setAttribute("aria-labelledby", titleId);
  const header = document.createElement("header");
  const title = document.createElement("strong");
  title.id = titleId;
  title.textContent = label ?? "Drawer";
  header.append(title);
  const closeButton = createTransitionalActionIconButton({ icon: "close", ariaLabel: "Close drawer", density: resolvedDensity });
  closeButton.className = `${closeButton.className} drawer__close`;
  closeButton.setAttribute("data-overlay-close", "");
  header.append(closeButton);
  if (description) {
    const copy = document.createElement("p");
    copy.textContent = description;
    header.append(copy);
  }
  const body = document.createElement("div");
  body.className = "drawer__body";
  for (const item of content) {
    if (item?.type === "badge") {
      const badgeRow = document.createElement("div");
      badgeRow.className = "drawer__status-row";
      badgeRow.append(createTransitionalBadge({ label: item.label, tone: item.tone ?? "success", variant: item.variant ?? "status", live: Boolean(item.live) }));
      body.append(badgeRow);
      continue;
    }
    if (item?.type === "progress") {
      const progressRow = document.createElement("div");
      progressRow.className = "drawer__progress-row";
      progressRow.append(createProgressIndicator({ label: item.label ?? "Progress", value: item.value ?? 0, max: item.max ?? 100, showValue: item.showValue ?? true, tone: item.tone ?? "accent", density: resolvedDensity, fullWidth: true }));
      body.append(progressRow);
      continue;
    }
    if (item?.type === "text") {
      const textRow = document.createElement("p");
      textRow.className = "drawer__supporting-copy";
      textRow.textContent = item.copy ?? item.label ?? "";
      body.append(textRow);
    }
  }
  for (const field of fields) {
    body.append(createTransitionalFieldInput({ label: field.label ?? field, value: field.value ?? "", density: field.density ?? resolvedDensity }));
  }
  panel.append(header, body);
  if (actions.length) {
    const footer = document.createElement("footer");
    for (const action of actions) {
      const actionVariant = action.intent === "danger" || action.variant === "danger" ? "primary" : action.variant;
      const actionNode = createTransitionalActionButton({ ...action, variant: actionVariant, intent: action.intent ?? (action.variant === "danger" ? "danger" : undefined), density: action.density ?? resolvedDensity });
      actionNode.setAttribute("data-overlay-close", "");
      actionNode.dataset.key = action.key ?? action.label ?? "";
      actionNode.addEventListener?.("click", () => {
        if (typeof onAction === "function") onAction(actionNode.dataset.key);
      });
      footer.append(actionNode);
    }
    panel.append(footer);
  }
  overlay.append(panel);
  root.append(trigger, overlay);
  attachOverlayShell({
    root,
    trigger,
    surface: overlay,
    panel,
    open: shouldOpen,
    initialFocus: closeButton,
    stateOnOpen: ["closed", "default"].includes(resolvedState) ? "open" : resolvedState,
    stateOnClose: resolvedState === "default" ? "default" : "closed",
    onOpenChange,
  });
  return root;
}
