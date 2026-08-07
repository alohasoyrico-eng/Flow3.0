import { createTransitionalActionButton, createTransitionalActionIconButton } from "./actions.js?v=2";
import { createProgressIndicator } from "./feedback.js?v=8";
import { createTransitionalFieldInput } from "./fields.js?v=18";
import { createTransitionalBadge } from "./status.js?v=2";

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
