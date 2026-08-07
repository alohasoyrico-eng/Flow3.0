export function resolveFieldState({ disabled = false, loading = false, error = "", state, value = "" } = {}) {
  if (disabled) return "disabled";
  if (loading) return "loading";
  if (error) return "error";
  return state ?? (value ? "filled" : "default");
}

export function createFieldShell({
  id,
  label,
  fallbackLabel,
  state,
  density,
  variant,
  mono = false,
  align = "start",
  tag = "label",
  className = "",
} = {}) {
  const root = document.createElement(tag);
  root.className = ["field", className].filter(Boolean).join(" ");
  root.dataset.state = state ?? "default";
  if (density) root.dataset.density = density;
  if (variant) root.dataset.variant = variant;
  if (mono) root.dataset.mono = "true";
  if (align === "end") root.dataset.align = "end";

  const labelNode = document.createElement("span");
  labelNode.className = "field__label";
  if (id) labelNode.id = `${id}-label`;
  labelNode.textContent = label ?? fallbackLabel ?? "Field";
  root.append(labelNode);
  return { root, labelNode };
}

export function createFieldSurface({ className = "" } = {}) {
  const surface = document.createElement("span");
  surface.className = ["field__control", className].filter(Boolean).join(" ");
  return surface;
}

export function appendFieldHelper(root, { id, text, target, className = "" } = {}) {
  if (!text) return null;
  const helperNode = document.createElement("span");
  helperNode.className = ["field__helper", className].filter(Boolean).join(" ");
  helperNode.id = `${id}-helper`;
  helperNode.textContent = text;
  if (root?.dataset?.state === "error" || target?.attributes?.["aria-invalid"] === "true") {
    helperNode.setAttribute("role", "alert");
  }
  if (target) appendAriaDescribedBy(target, helperNode.id);
  root.append(helperNode);
  return helperNode;
}

export function appendAriaDescribedBy(node, id) {
  if (!node || !id) return;
  const existing = node.getAttribute?.("aria-describedby") ?? node.attributes?.["aria-describedby"] ?? "";
  const current = existing.split(/\s+/).filter(Boolean);
  if (!current.includes(id)) current.push(id);
  node.setAttribute?.("aria-describedby", current.join(" "));
}
