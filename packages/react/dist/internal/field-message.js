const validFieldMessageStates = new Set(["default", "info", "success", "warning", "error", "disabled"]);
export function normalizeFieldMessageState(state) {
    return state && validFieldMessageStates.has(state) ? state : "default";
}
export function resolveFieldMessage({ controlId, describedBy, error = "", helper = "", helperText, live = false, state, }) {
    const message = error || helperText || helper || "";
    const resolvedState = error ? "error" : normalizeFieldMessageState(state);
    const messageId = message ? `${controlId}-helper` : undefined;
    const ariaDescribedBy = [messageId, describedBy].filter(Boolean).join(" ") || undefined;
    const role = message
        ? resolvedState === "error"
            ? "alert"
            : live && resolvedState !== "default" && resolvedState !== "disabled"
                ? "status"
                : undefined
        : undefined;
    return {
        describedBy: ariaDescribedBy,
        invalid: resolvedState === "error" ? "true" : undefined,
        messageId,
        message,
        role,
        state: resolvedState,
    };
}
