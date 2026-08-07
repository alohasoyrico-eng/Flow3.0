export function createStepper({
  steps = [],
  current = 0,
  label = "Progress",
  orientation = "horizontal",
  density = "md",
} = {}) {
  const resolvedOrientation = orientation === "vertical" ? "vertical" : "horizontal";
  const resolvedDensity = ["sm", "md", "lg"].includes(density) ? density : "md";
  const resolvedSteps = Array.isArray(steps) && steps.length ? steps : [{ label: "Step 1" }];
  const currentIndex = Math.max(0, Math.min(Number(current) || 0, resolvedSteps.length - 1));
  const stepper = document.createElement("ol");
  stepper.className = "stepper";
  stepper.setAttribute("aria-label", label);
  stepper.dataset.orientation = resolvedOrientation;
  stepper.dataset.density = resolvedDensity;
  stepper.dataset.current = String(currentIndex);
  for (const [index, step] of resolvedSteps.entries()) {
    const item = document.createElement("li");
    item.className = "stepper__item";
    const state = index < currentIndex ? "complete" : index === currentIndex ? "active" : "pending";
    item.dataset.state = state;
    if (index === currentIndex) item.setAttribute("aria-current", "step");
    const marker = document.createElement("span");
    marker.className = "stepper__marker";
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = state === "complete" ? "check" : String(index + 1);
    const text = document.createElement("span");
    text.className = "stepper__text";
    const title = document.createElement("strong");
    title.textContent = step.label ?? `Step ${index + 1}`;
    text.append(title);
    if (step.description) {
      const description = document.createElement("small");
      description.textContent = step.description;
      text.append(description);
    }
    item.append(marker, text);
    stepper.append(item);
    if (index < resolvedSteps.length - 1) {
      const connector = document.createElement("span");
      connector.className = "stepper__connector";
      connector.dataset.state = index < currentIndex ? "complete" : "pending";
      connector.setAttribute("aria-hidden", "true");
      stepper.append(connector);
    }
  }
  return stepper;
}
