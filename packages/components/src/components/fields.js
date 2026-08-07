import { createFieldAction } from "../primitives/field-actions.js?v=2";
import { setIconGlyph } from "../primitives/iconography.js?v=1";
import { createSpinner } from "./feedback.js?v=8";

let comboboxId = 0;

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

export function createCombobox({
  label,
  helper = "",
  icon = "search",
  options = [],
  value = "",
  name = "",
  placeholder = "Search or select",
  emptyText = "No results",
  disabled = false,
  density = "md",
  state = "default",
  onValueChange,
} = {}) {
  const id = `combobox-${++comboboxId}`;
  const selectedOption = options.find((option) => (option.value ?? option.label ?? "") === value);
  const resolvedState = disabled ? "disabled" : state || (selectedOption ? "filled" : "default");
  const { root: formControl } = createFieldShell({
    id,
    label,
    fallbackLabel: "Combobox",
    state: resolvedState,
    density,
  });
  const control = createFieldSurface({ className: "combobox" });
  control.dataset.open = String(state === "open");
  control.dataset.state = resolvedState;
  control.dataset.value = selectedOption?.value ?? value ?? "";
  control.setAttribute("data-combobox-control", "");

  if (icon) {
    const iconNode = document.createElement("span");
    iconNode.className = "field__icon combobox__icon";
    iconNode.setAttribute("aria-hidden", "true");
    setIconGlyph(iconNode, icon);
    control.append(iconNode);
  }

  const input = document.createElement("input");
  input.className = "input combobox__input";
  input.id = id;
  input.name = name;
  input.type = "text";
  input.value = selectedOption?.label ?? value ?? "";
  if (input.value) input.setAttribute("value", input.value);
  input.placeholder = placeholder;
  if (placeholder) input.setAttribute("placeholder", placeholder);
  input.disabled = Boolean(disabled);
  input.autocomplete = "off";
  input.spellcheck = false;
  input.setAttribute("role", "combobox");
  input.setAttribute("aria-autocomplete", "list");
  input.setAttribute("aria-expanded", String(state === "open"));
  input.setAttribute("aria-haspopup", "listbox");
  input.setAttribute("aria-controls", `${id}-listbox`);
  input.setAttribute("aria-labelledby", `${id}-label`);
  if (resolvedState === "error") input.setAttribute("aria-invalid", "true");
  control.append(input);

  const clearButton = createFieldAction({
    action: "clear",
    ariaLabel: "Clear selection",
    disabled: disabled || !input.value,
    icon: "close",
  });
  clearButton.className = `${clearButton.className} field__action combobox__clear`;
  clearButton.setAttribute("data-combobox-clear", "");
  control.append(clearButton);

  const chevronNode = document.createElement("span");
  chevronNode.className = "select-control__chevron combobox__chevron";
  chevronNode.setAttribute("aria-hidden", "true");
  setIconGlyph(chevronNode, "expand_more");
  control.append(chevronNode);

  const listbox = document.createElement("span");
  listbox.id = `${id}-listbox`;
  listbox.className = "select-control__listbox combobox__listbox";
  listbox.setAttribute("role", "listbox");
  listbox.setAttribute("data-combobox-listbox", "");
  listbox.setAttribute("aria-label", `${label ?? "Combobox"} options`);

  options.forEach((option, index) => {
    const optionValue = option.value ?? option.label ?? "";
    const isSelected = optionValue === (selectedOption?.value ?? value);
    const optionNode = document.createElement("span");
    optionNode.id = `${id}-option-${index}`;
    optionNode.className = "select-control__option combobox__option";
    optionNode.setAttribute("role", "option");
    optionNode.setAttribute("tabindex", "-1");
    optionNode.setAttribute("aria-selected", String(isSelected));
    optionNode.setAttribute("data-combobox-option", "");
    optionNode.dataset.selected = String(isSelected);
    optionNode.dataset.value = optionValue;
    optionNode.dataset.label = option.label ?? option.value ?? "";
    if (option.meta) optionNode.dataset.meta = option.meta;
    if (option.disabled) {
      optionNode.dataset.disabled = "true";
      optionNode.setAttribute("aria-disabled", "true");
    }
    const optionLabel = document.createElement("span");
    optionLabel.className = "select-control__option-label combobox__option-label";
    optionLabel.textContent = option.label ?? option.value ?? "";
    if (option.meta) {
      const optionMeta = document.createElement("span");
      optionMeta.className = "select-control__option-code combobox__option-meta";
      optionMeta.textContent = option.meta;
      optionNode.append(optionLabel, optionMeta);
    } else {
      optionNode.append(optionLabel);
    }
    listbox.append(optionNode);
    if (isSelected) input.setAttribute("aria-activedescendant", optionNode.id);
  });

  const emptyNode = document.createElement("span");
  emptyNode.className = "combobox__empty";
  emptyNode.setAttribute("data-combobox-empty", "");
  emptyNode.setAttribute("role", "status");
  emptyNode.hidden = true;
  emptyNode.textContent = emptyText;
  listbox.append(emptyNode);

  control.append(listbox);
  formControl.append(control);
  appendFieldHelper(formControl, { id, text: helper, target: input });
  hydrateCombobox(formControl, { onValueChange });
  return formControl;
}

export function hydrateCombobox(root, { onValueChange } = {}) {
  const attributeControls = Array.from(root?.querySelectorAll?.("[data-combobox-control]") ?? []);
  const classControls = Array.from(root?.querySelectorAll?.(".combobox") ?? []);
  const controls = root?.matches?.("[data-combobox-control]")
    ? [root]
    : root?.className?.split?.(" ")?.includes("combobox")
      ? [root]
      : attributeControls.length ? attributeControls : classControls;
  controls.forEach((control) => {
    if (control.__comboboxHydrated === true) return;
    const input = control.querySelector?.("[role='combobox']") ?? control.querySelector?.(".combobox__input");
    const clearButton = control.querySelector?.("[data-combobox-clear]") ?? control.querySelector?.(".combobox__clear");
    const listbox = control.querySelector?.("[data-combobox-listbox]") ?? control.querySelector?.(".combobox__listbox");
    const attributeOptions = Array.from(control.querySelectorAll?.("[data-combobox-option]") ?? []);
    const classOptions = Array.from(control.querySelectorAll?.(".combobox__option") ?? []);
    const options = attributeOptions.length ? attributeOptions : classOptions;
    const emptyNode = control.querySelector?.("[data-combobox-empty]");
    if (!input || !listbox) return;
    control.__comboboxHydrated = true;
    let activeIndex = Math.max(options.findIndex((option) => option.dataset.selected === "true"), 0);

    const enabledOptions = () => options.filter((option) => option.dataset.disabled !== "true" && option.hidden !== true);
    const activeOption = () => enabledOptions()[activeIndex] ?? enabledOptions()[0];
    const syncClear = () => {
      if (clearButton) clearButton.disabled = input.disabled || !input.value;
    };
    const setOpen = (open) => {
      control.dataset.open = String(open);
      input.setAttribute("aria-expanded", String(open));
    };
    const filter = () => {
      const query = input.value.trim().toLowerCase();
      let visibleCount = 0;
      options.forEach((option) => {
        const haystack = `${option.dataset.label ?? ""} ${option.dataset.meta ?? ""}`.toLowerCase();
        const visible = !query || haystack.includes(query);
        option.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (emptyNode) emptyNode.hidden = visibleCount > 0;
      activeIndex = 0;
      const next = activeOption();
      if (next) input.setAttribute("aria-activedescendant", next.id);
      else input.removeAttribute?.("aria-activedescendant");
      syncClear();
    };
    const choose = (option) => {
      if (!option || option.dataset.disabled === "true") return;
      options.forEach((item) => {
        const selected = item === option;
        item.dataset.selected = String(selected);
        item.setAttribute("aria-selected", String(selected));
      });
      input.value = option.dataset.label ?? option.dataset.value ?? "";
      control.dataset.value = option.dataset.value ?? "";
      input.setAttribute("aria-activedescendant", option.id);
      onValueChange?.(option.dataset.value ?? "", { label: option.dataset.label ?? "", meta: option.dataset.meta ?? "" });
      setOpen(false);
      syncClear();
      input.focus?.();
    };
    const move = (delta) => {
      const enabled = enabledOptions();
      if (!enabled.length) return;
      activeIndex = Math.max(0, Math.min(enabled.length - 1, activeIndex + delta));
      const next = enabled[activeIndex];
      input.setAttribute("aria-activedescendant", next.id);
      next.scrollIntoView?.({ block: "nearest" });
    };

    filter();
    input.addEventListener?.("focus", () => {
      filter();
      setOpen(true);
    });
    input.addEventListener?.("input", () => {
      filter();
      setOpen(true);
      onValueChange?.(input.value, { label: input.value, meta: "", inputValue: input.value });
    });
    input.addEventListener?.("keydown", (event) => {
      if (event.key === "ArrowDown") {
        event.preventDefault?.();
        filter();
        setOpen(true);
        move(1);
      }
      if (event.key === "ArrowUp") {
        event.preventDefault?.();
        filter();
        setOpen(true);
        move(-1);
      }
      if (event.key === "Enter") {
        event.preventDefault?.();
        choose(activeOption());
      }
      if (event.key === "Escape") setOpen(false);
    });
    options.forEach((option) => {
      option.addEventListener?.("mousedown", (event) => event.preventDefault?.());
      option.addEventListener?.("click", () => choose(option));
    });
    clearButton?.addEventListener?.("click", () => {
      input.value = "";
      control.dataset.value = "";
      options.forEach((option) => {
        option.dataset.selected = "false";
        option.setAttribute("aria-selected", "false");
      });
      onValueChange?.("", { label: "", meta: "", cleared: true });
      filter();
      setOpen(true);
      input.focus?.();
    });
    document.addEventListener?.("mousedown", (event) => {
      if (control.dataset.open !== "true") return;
      if (control.contains?.(event.target)) return;
      setOpen(false);
    });
  });
  return root;
}
