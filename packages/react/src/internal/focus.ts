export type FocusableElement = HTMLElement & { disabled?: boolean };

export function focusableElements(container: HTMLElement | null): FocusableElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<FocusableElement>(
    "a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])",
  )).filter((element) => {
    if (element.disabled) return false;
    if (element.getAttribute("aria-disabled") === "true") return false;
    if (element.getAttribute("hidden") !== null) return false;
    return element.tabIndex >= 0;
  });
}
