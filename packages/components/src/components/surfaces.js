import { createSpinner } from "./feedback.js?v=8";
import { createTransitionalFieldInput } from "./fields.js";
import { setIconGlyph } from "../primitives/iconography.js?v=1";

export function createFloatingActionButton({
  label,
  icon = "add",
  variant = "primary",
  state = "default",
  density = "md",
  extended = false,
  loading = false,
  disabled = false,
  type = "button",
} = {}) {
  const resolvedVariant = ["primary", "accent", "extended", "mini"].includes(variant) ? variant : "primary";
  const resolvedState = loading || state === "loading" ? "loading" : disabled || state === "disabled" ? "disabled" : state || "default";
  const isExtended = Boolean(extended) || resolvedVariant === "extended";
  const button = document.createElement("button");
  button.type = type;
  button.className = "fab";
  button.dataset.variant = resolvedVariant;
  button.dataset.state = resolvedState;
  button.dataset.density = density;
  button.dataset.extended = String(isExtended);
  button.disabled = resolvedState === "disabled" || resolvedState === "loading";
  button.setAttribute("aria-label", label ?? "Create");
  if (resolvedState === "loading") button.setAttribute("aria-busy", "true");

  if (resolvedState === "loading") {
    button.append(createSpinner({ label: `${label ?? "Create"} loading`, density: "sm", decorative: true }));
  } else {
    const iconNode = document.createElement("span");
    iconNode.className = "fab__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, icon);
    button.append(iconNode);
  }

  if (isExtended) {
    const labelNode = document.createElement("span");
    labelNode.className = "fab__label";
    labelNode.textContent = label ?? "Create";
    button.append(labelNode);
  }
  return button;
}

export function createInlineValidation({
  label,
  value = "",
  message = "",
  state = "default",
  id = "",
  fullWidth = false,
  field,
  live = false,
} = {}) {
  const root = document.createElement("div");
  root.className = "inline-validation";
  root.dataset.state = state;
  root.dataset.fullWidth = String(Boolean(fullWidth));
  const showField = field ?? value !== "";
  root.dataset.field = String(Boolean(showField));
  const fieldId = id || `inline-validation-${String(label ?? "field").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  const messageId = `${fieldId}-message`;

  if (showField) {
    const inputControl = createTransitionalFieldInput({
      label: label ?? "Input",
      value,
      state,
      disabled: state === "disabled",
    });
    const input = inputControl.querySelector("input");
    input.id = fieldId;
    if (message) input.setAttribute("aria-describedby", messageId);
    if (state === "error") input.setAttribute("aria-invalid", "true");
    root.append(inputControl);
  } else if (label) {
    root.setAttribute("aria-label", label);
  }

  if (message) {
    const messageNode = document.createElement("p");
    messageNode.className = "inline-validation__message";
    messageNode.id = messageId;
    if (live && state === "error") messageNode.setAttribute("role", "alert");
    if (live && state !== "error" && state !== "disabled") messageNode.setAttribute("role", "status");
    messageNode.textContent = message;
    root.append(messageNode);
  }
  return root;
}
