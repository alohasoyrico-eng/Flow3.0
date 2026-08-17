export type FieldMessageState = "default" | "info" | "success" | "warning" | "error" | "disabled";

const validFieldMessageStates = new Set<FieldMessageState>(["default", "info", "success", "warning", "error", "disabled"]);

export interface ResolveFieldMessageOptions {
  controlId: string;
  describedBy?: string | undefined;
  error?: string | undefined;
  helper?: string | undefined;
  helperText?: string | undefined;
  live?: boolean | undefined;
  state?: FieldMessageState | undefined;
}

export interface ResolvedFieldMessage {
  describedBy?: string | undefined;
  invalid?: "true" | undefined;
  messageId?: string | undefined;
  message?: string;
  role?: "alert" | "status" | undefined;
  state: FieldMessageState;
}

export function normalizeFieldMessageState(state?: FieldMessageState): FieldMessageState {
  return state && validFieldMessageStates.has(state) ? state : "default";
}

export function resolveFieldMessage({
  controlId,
  describedBy,
  error = "",
  helper = "",
  helperText,
  live = false,
  state,
}: ResolveFieldMessageOptions): ResolvedFieldMessage {
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
