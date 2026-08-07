import { createTransitionalFieldInput } from "./fields.js";

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
