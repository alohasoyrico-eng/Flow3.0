export function createTransitionalChoiceRadioButton({
  label,
  description = "",
  error = "",
  variant = "default",
  state = "unselected",
  density = "md",
  checked = false,
  disabled = false,
  name = "",
  value = "",
  required = false,
} = {}) {
  const allowedVariants = new Set(["default", "descriptive", "compact", "critical"]);
  const allowedStates = new Set(["unselected", "selected", "focus", "error", "disabled"]);
  const allowedDensities = new Set(["sm", "md", "lg"]);
  const normalizedVariant = allowedVariants.has(variant) ? variant : "default";
  const normalizedState = disabled
    ? "disabled"
    : checked
      ? "selected"
      : allowedStates.has(state)
        ? state
        : "unselected";
  const isInvalid = normalizedState === "error" || Boolean(error);

  const field = document.createElement("label");
  field.className = "choice radio";
  field.dataset.checked = String(Boolean(checked));
  field.dataset.variant = normalizedVariant;
  field.dataset.state = normalizedState;
  field.dataset.density = allowedDensities.has(density) ? density : "md";
  if (isInvalid) field.dataset.invalid = "true";

  const input = document.createElement("input");
  input.type = "radio";
  input.className = "choice__input";
  input.name = name;
  input.value = value;
  input.checked = Boolean(checked);
  input.disabled = disabled;
  input.required = required;
  if (isInvalid) input.setAttribute("aria-invalid", "true");

  const mark = document.createElement("span");
  mark.className = "choice__mark";
  mark.setAttribute("aria-hidden", "true");

  const text = document.createElement("span");
  text.className = "choice__text";
  const labelNode = document.createElement("span");
  labelNode.className = "choice__label";
  labelNode.textContent = label ?? "Radio button";
  text.append(labelNode);
  if (description) {
    const descriptionNode = document.createElement("span");
    descriptionNode.className = "choice__description";
    descriptionNode.textContent = description;
    text.append(descriptionNode);
  }
  if (error) {
    const errorNode = document.createElement("span");
    errorNode.className = "choice__error";
    errorNode.textContent = error;
    text.append(errorNode);
  }

  if (!disabled && typeof input.addEventListener === "function") {
    input.addEventListener("change", () => {
      field.dataset.checked = String(input.checked);
      field.dataset.state = input.checked ? "selected" : "unselected";
    });
  }

  field.append(input, mark, text);
  return field;
}
