export function focusableElements(container) {
    if (!container)
        return [];
    return Array.from(container.querySelectorAll("a[href], button, input, select, textarea, [tabindex]:not([tabindex=\"-1\"])")).filter((element) => {
        if (element.disabled)
            return false;
        if (element.getAttribute("aria-disabled") === "true")
            return false;
        if (element.getAttribute("hidden") !== null)
            return false;
        return element.tabIndex >= 0;
    });
}
